import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import {
  FilePlus, FileStack, Scissors, FileText, ArrowLeft,
  Download, Trash2, Loader2, Plus, MoveUp, MoveDown,
  Type, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PDFToolbox = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('merge'); // merge, edit, img2pdf
  const [overlayText, setOverlayText] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
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

  // --- PDF MERGE LOGIC ---
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
      downloadBlob(mergedPdfBytes, 'merged_document.pdf');
    } catch (error) {
      console.error(error);
      alert('Error merging PDFs.');
    } finally {
      setLoading(false);
    }
  };

  // --- IMAGE TO PDF LOGIC ---
  const convertImagesToPDF = async () => {
    if (files.length === 0) return alert('Please select images.');
    setLoading(true);
    try {
      const doc = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        if (!fileObj.file.type.startsWith('image/')) continue;

        const imgData = await getBase64(fileObj.file);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      doc.save('images_to_pdf.pdf');
    } catch (error) {
      console.error(error);
      alert('Error converting images.');
    } finally {
      setLoading(false);
    }
  };

  // --- ADD TEXT OVERLAY LOGIC (Simplified "Edit") ---
  const addTextToPDF = async () => {
    if (files.length === 0 || !overlayText) return alert('Select a PDF and enter text.');
    setLoading(true);
    try {
      const fileBytes = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(overlayText, {
          x: 50,
          y: height - 50,
          size: 30,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
        });
      });

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, 'edited_document.pdf');
    } catch (error) {
      console.error(error);
      alert('Error editing PDF.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (bytes, name) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
           <span className="font-black uppercase tracking-widest text-sm">PDF Toolbox Pro</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
            {activeTab === 'merge' ? 'Merge PDFs' : activeTab === 'edit' ? 'Add Text' : 'Image to PDF'}
          </h1>
          <p className="text-stone-500 text-lg">Professional tools for your daily document needs.</p>
        </header>

        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl mb-8 border border-white/5 w-fit mx-auto justify-center">
          {[
            { id: 'merge', icon: FileStack, label: 'Merge' },
            { id: 'edit', icon: Type, label: 'Add Text' },
            { id: 'img2pdf', icon: ImageIcon, label: 'Image to PDF' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFiles([]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-stone-900 shadow-xl' : 'text-stone-500 hover:text-stone-200'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="relative group cursor-pointer">
            <input
              type="file"
              multiple={activeTab !== 'edit'}
              accept={activeTab === 'img2pdf' ? 'image/*' : 'application/pdf'}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border-2 border-dashed border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/[0.02] transition-all text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {activeTab === 'img2pdf' ? 'Select Images' : activeTab === 'edit' ? 'Select 1 PDF' : 'Drop PDFs here'}
              </h3>
              <p className="text-stone-500 text-sm">Everything is processed locally in your browser.</p>
            </div>
          </div>

          {/* Edit Options */}
          {activeTab === 'edit' && files.length > 0 && (
             <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500">Text to add (Top Left)</label>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Type text here..."
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all"
                />
             </div>
          )}

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    layout
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                  >
                    {file.preview ? (
                      <img src={file.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-stone-400 font-bold text-xs">{index + 1}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">{file.size}</p>
                    </div>
                    <div className="flex gap-1">
                      {activeTab !== 'edit' && (
                        <>
                          <button onClick={() => moveFile(index, -1)} disabled={index === 0} className="p-2 text-stone-500 hover:text-white disabled:opacity-20"><MoveUp size={16} /></button>
                          <button onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} className="p-2 text-stone-500 hover:text-white disabled:opacity-20"><MoveDown size={16} /></button>
                        </>
                      )}
                      <button onClick={() => removeFile(file.id)} className="p-2 text-stone-500 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={activeTab === 'merge' ? mergePDFs : activeTab === 'edit' ? addTextToPDF : convertImagesToPDF}
                  disabled={loading || (activeTab === 'merge' && files.length < 2) || (activeTab === 'edit' && !overlayText)}
                  className="w-full py-5 bg-amber-500 text-stone-900 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/20 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {loading ? 'Processing...' : `Execute ${activeTab.toUpperCase()}`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFToolbox;
