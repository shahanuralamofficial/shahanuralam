import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Zap, Info, Play, RotateCcw } from 'lucide-react';

const Visualizers = ({ onBack }) => {
  const [visType, setVisType] = useState('bubble');
  const [visArray, setVisArray] = useState([]);
  const [visPointers, setVisPointers] = useState({ left: -1, right: -1, mid: -1, active: [] });
  const [isSorting, setIsVisSorting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const bubbleSort = async () => {
    setIsVisSorting(true);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setVisPointers({ active: [j, j + 1] });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setVisArray([...arr]);
          await new Promise(r => setTimeout(r, 100));
        }
      }
    }
    setVisPointers({ active: [] });
    setIsVisSorting(false);
    showToast("Sorting Complete!");
  };

  const binarySearch = async () => {
    setIsVisSorting(true);
    let arr = [...visArray].sort((a, b) => a - b);
    setVisArray(arr);
    let target = arr[Math.floor(Math.random() * arr.length)];
    showToast(`Searching for value: ${target}`);

    let low = 0, high = arr.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setVisPointers({ left: low, right: high, mid: mid, active: [] });
      await new Promise(r => setTimeout(r, 800));

      if (arr[mid] === target) {
        setVisPointers({ left: low, right: high, mid: mid, active: [mid] });
        showToast("Element Found!");
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    setIsVisSorting(false);
  };

  const sieveVisualizer = async () => {
    setIsVisSorting(true);
    let n = 50;
    let primes = new Array(n + 1).fill(true);
    setVisArray(primes.map((_, i) => i));
    setVisPointers({ active: [] });

    for (let p = 2; p * p <= n; p++) {
      if (primes[p]) {
        setVisPointers({ active: [p] });
        await new Promise(r => setTimeout(r, 600));
        for (let i = p * p; i <= n; i += p) {
          primes[i] = false;
          setVisArray([...primes.map((val, idx) => val ? idx : -1)]);
          setVisPointers({ active: [p, i] });
          await new Promise(r => setTimeout(r, 100));
        }
      }
    }
    setVisPointers({ active: [] });
    setIsVisSorting(false);
    showToast("Sieve of Eratosthenes Complete!");
  };

  const resetVis = () => {
    if (visType === 'sieve') {
        setVisArray(Array.from({length: 51}, (_, i) => i));
    } else {
        setVisArray(Array.from({length: 15}, () => Math.floor(Math.random() * 90) + 10));
    }
    setVisPointers({ left: -1, right: -1, mid: -1, active: [] });
  };

  useEffect(() => { resetVis(); }, [visType]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#080605] text-slate-200 font-sans pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#080605]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <span className="font-black uppercase tracking-widest text-sm text-orange-600 flex items-center gap-2">
            <Zap size={16} /> Algo Visualizer Lab
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Master the <span className="text-orange-600">Algorithms</span></h1>
          <p className="text-slate-500 max-w-2xl">Interactive visualizations of core computer science algorithms. Select an algorithm to begin the simulation.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Controls */}
           <div className="lg:col-span-1 space-y-4">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Select Algorithm</h4>
                 <div className="space-y-2">
                    {[
                        { id: 'bubble', name: 'Bubble Sort', icon: '📊' },
                        { id: 'binary', name: 'Binary Search', icon: '🔍' },
                        { id: 'sieve', name: 'Sieve of Eratosthenes', icon: '🔢' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setVisType(t.id)}
                            disabled={isSorting}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${visType === t.id ? 'bg-orange-600 text-black border-orange-600 shadow-lg shadow-orange-600/20' : 'text-slate-400 border-transparent hover:border-white/10 hover:bg-white/5'}`}
                        >
                            <span>{t.icon}</span> {t.name}
                        </button>
                    ))}
                 </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-orange-600/5 border border-orange-600/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2"><Info size={12}/> Info</h4>
                 <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                    {visType === 'bubble' && "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."}
                    {visType === 'binary' && "Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half."}
                    {visType === 'sieve' && "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit."}
                 </p>
              </div>
           </div>

           {/* Visualization Canvas */}
           <div className="lg:col-span-3 space-y-6">
              <div className="p-8 sm:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                 <div className="flex justify-between items-center mb-12">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">{visType.replace('_', ' ')} Simulation</h3>
                    <div className="flex gap-3">
                       <button onClick={resetVis} disabled={isSorting} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all"><RotateCcw size={18}/></button>
                       <button
                         onClick={() => visType === 'bubble' ? bubbleSort() : visType === 'binary' ? binarySearch() : sieveVisualizer()}
                         disabled={isSorting}
                         className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all"
                       >
                         {isSorting ? <RefreshCw size={16} className="animate-spin"/> : <Play size={16}/>}
                         {isSorting ? 'Processing' : 'Start Simulation'}
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 flex items-center justify-center py-10">
                    {visType === 'sieve' ? (
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full max-w-2xl">
                            {visArray.map((val, i) => (
                                i >= 2 && (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: visPointers.active.includes(i) ? 1.1 : 1,
                                        opacity: val === -1 ? 0.2 : 1
                                    }}
                                    className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-black border transition-colors ${visPointers.active.includes(i) ? 'bg-orange-600 border-orange-600 text-black shadow-lg shadow-orange-600/30' : 'bg-white/5 border-white/5 text-slate-400'}`}
                                >
                                    {i}
                                </motion.div>
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-end gap-2 h-64 w-full max-w-3xl px-4">
                            {visArray.map((val, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    animate={{
                                        height: `${val}%`,
                                        opacity: (visType === 'binary' && i >= visPointers.left && i <= visPointers.right) || visType === 'bubble' ? 1 : 0.2
                                    }}
                                    className={`flex-1 rounded-t-2xl transition-all duration-300 relative group ${
                                        visPointers.active.includes(i) ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' :
                                        i === visPointers.mid ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' :
                                        i === visPointers.left || i === visPointers.right ? 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]' :
                                        'bg-gradient-to-t from-orange-700 to-orange-500'
                                    }`}
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                 </div>

                 {/* Legend */}
                 <div className="mt-12 flex flex-wrap gap-6 border-t border-white/5 pt-8">
                    {visType === 'binary' ? (
                        <>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 bg-blue-400 rounded-full" /> Range (L/R)</div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 bg-rose-500 rounded-full" /> Mid Point</div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Found</div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Active Element</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl border border-orange-400/20">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Visualizers;
