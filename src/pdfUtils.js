import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const loadPDF = async (url) => {
  const loadingTask = pdfjsLib.getDocument(url);
  return await loadingTask.promise;
};

export const getPageTextData = async (pdfDoc, pageNum) => {
  const page = await pdfDoc.getPage(pageNum);
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1.0 });

  return textContent.items.map(item => ({
    text: item.str,
    width: item.width,
    height: item.height,
    transform: item.transform, // [scaleX, skewY, skewX, scaleY, translateX, translateY]
    fontSize: Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1]),
    x: item.transform[4],
    y: viewport.height - item.transform[5] - (item.height || 12), // Flip Y coordinate
  }));
};

export const exportEditedPDF = async (originalFile, fabricCanvasData) => {
  const existingPdfBytes = await originalFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Note: This logic needs to iterate over all pages and match fabric canvas objects
  // For now, assuming single page or first page implementation for foundation
  const pages = pdfDoc.getPages();

  // Implementation details for flattening fabric objects onto pdf-lib
  // will go here (drawing text, rectangles for erasing, etc.)

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
