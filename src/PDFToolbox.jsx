import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import {
  FileText, ArrowLeft, Download, Trash2, Loader2, Plus,
  Type, Eraser, MousePointer2, ZoomIn, ZoomOut, Maximize2,
  ChevronLeft, ChevronRight, Save, Undo, Redo, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import usePDFStore from './pdfStore';
import { loadPDF, getPageTextData } from './pdfUtils';

// Correct way to set worker in newer pdfjs versions
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFToolbox = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('merge');
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const {
    pdfDoc, numPages, currentPage, scale,
    setPDFDoc, setCurrentPage, setScale
  } = usePDFStore();

  useEffect(() => {
    if (platform === 'editor' && canvasRef.current && !fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 1100,
        backgroundColor: '#fff',
      });
    }
    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, [platform]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setLoading(true);
    setFile(uploadedFile);

    try {
      const url = URL.createObjectURL(uploadedFile);
      const doc = await loadPDF(url);
      setPDFDoc(doc);
      setPlatform('editor');
      setTimeout(() => renderPage(1, doc), 100);
    } catch (err) {
      console.error(err);
      alert('Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNum, doc = pdfDoc) => {
    if (!doc || !fabricCanvas.current) return;
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const bgImage = canvas.toDataURL('image/png');

    try {
      const img = await fabric.FabricImage.fromURL(bgImage);
      fabricCanvas.current.setDimensions({
        width: viewport.width / 2,
        height: viewport.height / 2
      });
      img.scale(0.5);
      fabricCanvas.current.backgroundImage = img;
      fabricCanvas.current.renderAll();
      detectText(pageNum, doc, viewport);
    } catch (e) {
      console.error("Fabric image load error:", e);
    }
  };

  const detectText = async (pageNum, doc, viewport) => {
    const textData = await getPageTextData(doc, pageNum);

    textData.forEach(item => {
      const text = new fabric.IText(item.text, {
        left: item.x / 2,
        top: item.y / 2,
        fontSize: item.fontSize / 2,
        fontFamily: 'Arial',
        fill: 'rgba(0,0,0,0.01)', // Very transparent instead of transparent to allow clicking
        hasBorders: true,
        hasControls: true,
      });

      text.on('changed', () => {
        text.set('fill', '#000');
        fabricCanvas.current.renderAll();
      });

      fabricCanvas.current.add(text);
    });
    fabricCanvas.current.renderAll();
  };

  const addText = () => {
    if (!fabricCanvas.current) return;
    const text = new fabric.IText('New Text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#000',
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const downloadPDF = async () => {
    alert('Exporting logic is being finalized. You can edit visually for now!');
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-stone-300 flex flex-col font-sans">
      <header className="h-16 border-b border-white/5 bg-[#1a1918]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <FileText className="text-amber-500" size={24} />
            <h1 className="font-black uppercase tracking-widest text-sm">Zen PDF Editor</h1>
          </div>
        </div>

        {platform === 'editor' && (
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <button onClick={addText} className="flex items-center gap-2 px-4 py-2 hover:bg-amber-500 hover:text-stone-900 rounded-lg transition-all text-xs font-bold uppercase">
              <Type size={16} /> Add Text
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {platform === 'editor' && (
            <button onClick={downloadPDF} className="bg-amber-500 text-stone-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/20">
              <Save size={16} /> Export PDF
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {platform === 'editor' && (
          <aside className="w-64 border-r border-white/5 bg-[#141312] overflow-y-auto p-4 hidden md:block">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-6 px-2">Pages ({numPages})</h3>
            <div className="space-y-4">
              {[...Array(numPages)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer overflow-hidden relative group ${currentPage === i + 1 ? 'border-amber-500' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold">{i + 1}</div>
                </div>
              ))}
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-auto bg-[#0a0908] relative flex flex-col items-center p-8">
          {platform === 'merge' && !file && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-20 max-w-xl w-full text-center">
              <div className="p-16 rounded-[4rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition-all group relative cursor-pointer">
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Plus size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Upload PDF to Edit</h2>
                <p className="text-stone-500 text-sm leading-relaxed">Experience professional PDF editing. Detect text layers, edit line-by-line, and more.</p>
              </div>
            </motion.div>
          )}

          {platform === 'editor' && (
            <div className="relative shadow-2xl shadow-black bg-white rounded-sm mb-20 overflow-hidden">
               <canvas ref={canvasRef} />
            </div>
          )}
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
           <Loader2 className="text-amber-500 animate-spin w-12 h-12 mb-4" />
           <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Initializing Editor...</p>
        </div>
      )}
    </div>
  );
};

export default PDFToolbox;
