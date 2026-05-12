import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  FilePlus, FileStack, Scissors, FileText, ArrowLeft,
  Download, Trash2, Loader2, Plus, MoveUp, MoveDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PDFToolbox = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('merge'); // merge, crop, image-to-pdf

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => id !== f.id));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) return alert('Please select at least 2 PDF files to merge.');
    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const fileBytes = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      link.click();
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Failed to merge PDFs. Please ensure all files are valid PDF documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans pb-20"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#0c0a09]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <div className="flex items-center gap-2">
           <FileText className="text-amber-500" />
           <span className="font-black uppercase tracking-widest text-sm">PDF Toolbox</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4">
            Master your <span className="text-amber-500">Documents</span>
          </h1>
          <p className="text-stone-500 text-lg">Merge, crop, and manipulate PDFs directly in your browser.</p>
        </header>

        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8 border border-white/5 w-fit mx-auto">
          {[
            { id: 'merge', icon: FileStack, label: 'Merge' },
            { id: 'crop', icon: Scissors, label: 'Crop (Soon)' },
            { id: 'img2pdf', icon: FilePlus, label: 'Img to PDF (Soon)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-stone-900 shadow-xl' : 'text-stone-500 hover:text-stone-200'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'merge' && (
          <div className="space-y-6">
            <div className="relative group cursor-pointer">
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border-2 border-dashed border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/[0.02] transition-all text-center">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Drop PDFs here</h3>
                <p className="text-stone-500 text-sm">Select multiple files to merge into one.</p>
              </div>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-black uppercase tracking-widest text-stone-500">{files.length} Files selected</span>
                    <button onClick={() => setFiles([])} className="text-xs font-bold text-rose-500 hover:underline">Clear all</button>
                  </div>

                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-stone-400 font-bold text-xs">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">{file.size}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => moveFile(index, -1)} disabled={index === 0} className="p-2 text-stone-500 hover:text-white disabled:opacity-20"><MoveUp size={16} /></button>
                        <button onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} className="p-2 text-stone-500 hover:text-white disabled:opacity-20"><MoveDown size={16} /></button>
                        <button onClick={() => removeFile(file.id)} className="p-2 text-stone-500 hover:text-rose-500"><Trash2 size={16} /></button>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={mergePDFs}
                    disabled={loading || files.length < 2}
                    className="w-full py-5 bg-amber-500 text-stone-900 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/20 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                    {loading ? 'Merging...' : 'Merge and Download'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {(activeTab === 'crop' || activeTab === 'img2pdf') && (
          <div className="py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
               <Zap className="text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto">I'm currently building this module. It will be available in the next update.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PDFToolbox;
