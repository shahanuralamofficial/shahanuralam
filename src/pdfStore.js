import { create } from 'zustand';

const usePDFStore = create((set) => ({
  pdfDoc: null,
  numPages: 0,
  currentPage: 1,
  scale: 1.5,
  isDragging: false,
  selectedId: null,
  history: [],
  redoStack: [],

  setPDFDoc: (doc) => set({ pdfDoc: doc, numPages: doc.numPages, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setScale: (scale) => set({ scale }),
  setDragging: (isDragging) => set({ isDragging }),
  setSelectedId: (id) => set({ selectedId: id }),

  addToHistory: (state) => set((prev) => ({
    history: [...prev.history, state],
    redoStack: []
  })),

  undo: () => set((prev) => {
    if (prev.history.length === 0) return prev;
    const last = prev.history[prev.history.length - 1];
    return {
      history: prev.history.slice(0, -1),
      redoStack: [prev.currentPageState, ...prev.redoStack],
      // This needs implementation in the Canvas component to apply state
    };
  }),
}));

export default usePDFStore;
