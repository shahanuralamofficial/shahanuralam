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

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToolbox = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('merge'); // 'editor', 'merge', 'img2pdf'
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
      renderPage(1, doc);
    } catch (err) {
      console.error(err);
      alert('Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNum, doc = pdfDoc) => {
    if (!doc) return;
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // Render high quality

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const bgImage = canvas.toDataURL('image/png');

    // Set Fabric Background
    fabric.Image.fromURL(bgImage, (img) => {
      fabricCanvas.current.setWidth(viewport.width / 2);
      fabricCanvas.current.setHeight(viewport.height / 2);
      img.scale(0.5);
      fabricCanvas.current.setBackgroundImage(img, fabricCanvas.current.renderAll.bind(fabricCanvas.current));

      // Auto-detect text layers
      detectText(pageNum, doc, viewport);
    });
  };

  const detectText = async (pageNum, doc, viewport) => {
    const textData = await getPageTextData(doc, pageNum);

    textData.forEach(item => {
      // Create an editable text object exactly on top
      const text = new fabric.IText(item.text, {
        left: item.x / 2,
        top: item.y / 2,
        fontSize: item.fontSize / 2,
        fontFamily: 'Arial',
        fill: 'transparent', // Hide by default until clicked? Or show as ghost?
        hasBorders: true,
        hasControls: true,
      });

      // Add a white "hider" rectangle behind it if edited
      text.on('changed', () => {
        if (!text.hider) {
          const rect = new fabric.Rect({
            left: text.left,
            top: text.top,
            width: text.width,
            height: text.height,
            fill: '#fff',
            selectable: false,
          });
          text.hider = rect;
          fabricCanvas.current.add(rect);
          rect.sendToBack();
          text.set('fill', '#000'); // Make text visible now that it's "editing"
        }
      });

      fabricCanvas.current.add(text);
    });
    fabricCanvas.current.renderAll();
  };

  const addText = () => {
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
    alert('Exporting advanced edits requires server-side or complex client-side mapping. Base structure ready!');
    // In a full implementation, we'd use pdf-lib to draw fabric objects on top of existing pages
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-stone-300 flex flex-col font-sans">
      {/* Header */}
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
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all text-xs font-bold uppercase">
              <Eraser size={16} /> Erase
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
        {/* Sidebar / Thumbnails */}
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

        {/* Main Workspace */}
        <main className="flex-1 overflow-auto bg-[#0a0908] relative flex flex-col items-center p-8">
          {platform === 'merge' && !file && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-20 max-w-xl w-full text-center">
              <div className="p-16 rounded-[4rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition-all group relative cursor-pointer">
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Plus size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Upload PDF to Edit</h2>
                <p className="text-stone-500 text-sm leading-relaxed">Experience professional PDF editing like Sejda. Detect text layers, edit line-by-line, and more.</p>
              </div>
            </motion.div>
          )}

          {platform === 'editor' && (
            <div className="relative shadow-2xl shadow-black shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-white rounded-sm mb-20 overflow-hidden">
               <canvas ref={canvasRef} />
            </div>
          )}

          {/* Floating Controls */}
          {platform === 'editor' && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1a1918]/90 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl z-50">
               <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomOut size={18} /></button>
               <span className="text-xs font-black px-4 border-x border-white/10 text-white">100%</span>
               <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomIn size={18} /></button>
               <div className="w-px h-4 bg-white/10 mx-2" />
               <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-[10px] font-black uppercase">
                  <Undo size={14} /> Undo
               </button>
               <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-[10px] font-black uppercase">
                  <Redo size={14} /> Redo
               </button>
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
