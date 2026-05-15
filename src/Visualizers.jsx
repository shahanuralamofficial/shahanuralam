import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RefreshCw, Zap, Info, Play, RotateCcw,
  Code2, HelpCircle, CheckCircle2, Terminal, ExternalLink,
  ChevronRight, ChevronLeft, FastForward, Cpu, Volume2, VolumeX,
  Pause, SkipForward, LayoutGrid, List, Binary, Layers,
  Network, Table, Shapes, Compass, Brain, Hash
} from 'lucide-react';
import { highlight, languages as prismLanguages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';

import * as Algos from './algoLogic';
import { ALGO_SOLUTIONS } from './algoSolutions';
import { trackEvent } from './firebase';

const ALGO_METADATA = {
    // Sorting
    bubble: { type: 'bars', name: 'Bubble Sort', cat: 'Sorting' },
    selection: { type: 'bars', name: 'Selection Sort', cat: 'Sorting' },
    insertion: { type: 'bars', name: 'Insertion Sort', cat: 'Sorting' },
    merge: { type: 'bars', name: 'Merge Sort', cat: 'Sorting' },
    quick: { type: 'bars', name: 'Quick Sort', cat: 'Sorting' },
    heap: { type: 'bars', name: 'Heap Sort', cat: 'Sorting' },
    shell: { type: 'bars', name: 'Shell Sort', cat: 'Sorting' },
    // Searching
    linear: { type: 'bars', name: 'Linear Search', cat: 'Searching' },
    binary: { type: 'bars', name: 'Binary Search', cat: 'Searching' },
    jump: { type: 'bars', name: 'Jump Search', cat: 'Searching' },
    // Graph
    bfs: { type: 'grid', name: 'Breadth-First Search', cat: 'Graph/Grid' },
    dfs: { type: 'grid', name: 'Depth-First Search', cat: 'Graph/Grid' },
    dijkstra: { type: 'grid', name: 'Dijkstra Pathfinding', cat: 'Graph/Grid' },
    // DP
    fibonacci: { type: 'bars', name: 'Fibonacci (DP)', cat: 'Dynamic Programming' },
    knapsack: { type: 'table', name: '0/1 Knapsack', cat: 'Dynamic Programming' },
    // Backtracking
    nqueens: { type: 'grid', name: 'N-Queens (Backtrack)', cat: 'Backtracking' },
    sudoku: { type: 'grid', name: 'Sudoku Solver', cat: 'Backtracking' },
    // Math
    gcd: { type: 'bars', name: 'Euclidean GCD', cat: 'Math & Logic' },
    sieve: { type: 'grid', name: 'Sieve of Eratosthenes', cat: 'Math & Logic' },
};

const Visualizers = ({ onBack }) => {
  const [visType, setVisType] = useState('bubble');
  const [visArray, setVisArray] = useState([]);
  const [visPointers, setVisPointers] = useState({ left: -1, right: -1, mid: -1, active: [], secondary: [] });
  const [isSorting, setIsVisSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [toast, setToast] = useState(null);
  const [stepDescription, setStepDescription] = useState('Select an algorithm to start.');
  const [activeTab, setActiveTab] = useState('visualizer');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const speedRef = useRef(800);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [solLang, setSolLang] = useState('JavaScript');

  const [gridData, setVisGrid] = useState([]);

  const audioCtx = useRef(null);
  const isPausedRef = useRef(false);
  const stepResolverRef = useRef(null);
  const stopSignalRef = useRef(false);

  useEffect(() => { speedRef.current = 800 / speedMultiplier; }, [speedMultiplier]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); }, []);

  const playTone = useCallback((freq, type = 'sine', duration = 0.1) => {
    if (isMuted || volume === 0) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      gain.gain.setValueAtTime(volume * 0.05, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
      osc.connect(gain); gain.connect(audioCtx.current.destination);
      osc.start(); osc.stop(audioCtx.current.currentTime + duration);
    } catch (e) {}
  }, [isMuted, volume]);

  const playSuccessSound = useCallback(() => {
    if (isMuted) return;
    [440, 554, 659].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.2), i * 150));
  }, [isMuted, playTone]);

  const checkPause = useCallback(async () => {
    if (isPausedRef.current) await new Promise(resolve => { stepResolverRef.current = resolve; });
  }, []);

  const delay = useCallback(async () => {
    if (stopSignalRef.current) throw new Error('STOP');
    await checkPause();
    await new Promise(r => setTimeout(r, speedRef.current));
    if (stopSignalRef.current) throw new Error('STOP');
  }, [checkPause]);

  const handleStep = () => {
    if (stepResolverRef.current) {
        const resolve = stepResolverRef.current;
        stepResolverRef.current = null;
        resolve();
    }
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    if (isPaused && stepResolverRef.current) handleStep();
  };

  const [tableData, setTableData] = useState({ rows: [], cols: [], data: [[]] });

  const algoHelpers = {
    visArray, setVisArray, visPointers, setVisPointers, setIsVisSorting,
    setStepDescription, playTone, delay, playSuccessSound, setVisGrid, gridData,
    tableData, setTableData
  };

  const startAlgo = async () => {
    stopSignalRef.current = false;
    setIsPaused(false);
    trackEvent('algorithm_start', { algorithm: visType, algorithmName: algoData[visType]?.name });
    try {
        await algoData[visType]?.startFunc();
    } catch (e) {
        if (e.message !== 'STOP') console.error(e);
        setIsVisSorting(false);
        setVisPointers({ left: -1, right: -1, mid: -1, active: [], secondary: [] });
    }
  };

  const resetVis = useCallback(() => {
    stopSignalRef.current = true;
    if (stepResolverRef.current) handleStep();
    setIsVisSorting(false);
    setIsPaused(false);

    const type = ALGO_METADATA[visType]?.type;
    if (type === 'bars') setVisArray(Array.from({length: 12}, () => Math.floor(Math.random() * 90) + 10));
    else if (type === 'grid') setVisGrid(Array(100).fill(0));
    setVisPointers({ left: -1, right: -1, mid: -1, active: [], secondary: [] });
    setStepDescription('Ready to visualize.');
  }, [visType]);

  const handleAlgoSwitch = (key) => {
    if (visType === key) return;
    stopSignalRef.current = true;
    if (stepResolverRef.current) handleStep();
    setVisType(key);
    setActiveTab('visualizer');
    trackEvent('algorithm_switch', { algorithm: key, algorithmName: ALGO_METADATA[key]?.name });
  };

  useEffect(() => {
    resetVis();
    return () => { stopSignalRef.current = true; };
  }, [visType]);

  const algoData = useMemo(() => ({
    bubble: {
        ...ALGO_METADATA.bubble,
        startFunc: () => Algos.runBubbleSort(algoHelpers),
        description: 'Compares adjacent elements and swaps if needed.',
        practiceProblems: [
            { title: 'Bubble Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/bubble-sort/1', difficulty: 'Easy' },
            { title: 'Sort Colors (LeetCode)', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' }
        ],
        solutions: ALGO_SOLUTIONS.bubble
    },
    selection: {
        ...ALGO_METADATA.selection,
        startFunc: () => Algos.runSelectionSort(algoHelpers),
        description: 'Finds min element and puts it at front.',
        practiceProblems: [
            { title: 'Selection Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/selection-sort/1', difficulty: 'Easy' }
        ],
        solutions: ALGO_SOLUTIONS.selection
    },
    insertion: {
        ...ALGO_METADATA.insertion,
        startFunc: () => Algos.runInsertionSort(algoHelpers),
        description: 'Inserts each element into its place.',
        practiceProblems: [
            { title: 'Insertion Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/insertion-sort/1', difficulty: 'Easy' }
        ],
        solutions: ALGO_SOLUTIONS.insertion
    },
    merge: {
        ...ALGO_METADATA.merge,
        startFunc: () => Algos.runMergeSort(algoHelpers),
        description: 'Divide and conquer sorting algorithm.',
        practiceProblems: [{ title: 'Merge Sort (LeetCode)', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.merge
    },
    quick: {
        ...ALGO_METADATA.quick,
        startFunc: () => Algos.runQuickSort(algoHelpers),
        description: 'Efficient partition-based sorting.',
        practiceProblems: [{ title: 'Quick Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/quick-sort/1', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.quick
    },
    linear: {
        ...ALGO_METADATA.linear,
        startFunc: () => Algos.runLinearSearch(algoHelpers),
        description: 'Sequentially checks elements.',
        practiceProblems: [
            { title: 'Linear Search (GFG)', url: 'https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1', difficulty: 'Easy' }
        ],
        solutions: ALGO_SOLUTIONS.linear
    },
    binary: {
        ...ALGO_METADATA.binary,
        startFunc: () => Algos.runBinarySearch(algoHelpers),
        description: 'Search in sorted array.',
        practiceProblems: [
            { title: 'Binary Search (LeetCode)', url: 'https://leetcode.com/problems/binary-search/', difficulty: 'Easy' },
            { title: 'Search Insert Position (LeetCode)', url: 'https://leetcode.com/problems/search-insert-position/', difficulty: 'Easy' }
        ],
        solutions: ALGO_SOLUTIONS.binary
    },
    bfs: {
        ...ALGO_METADATA.bfs,
        startFunc: () => Algos.runBFS(algoHelpers),
        description: 'Explores neighbors level by level.',
        practiceProblems: [
            { title: 'BFS of Graph (GFG)', url: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1', difficulty: 'Easy' },
            { title: 'Number of Islands (LeetCode)', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium' }
        ],
        solutions: ALGO_SOLUTIONS.bfs
    },
    dfs: {
        ...ALGO_METADATA.dfs,
        startFunc: () => Algos.runDFS(algoHelpers),
        description: 'Explores path as deep as possible.',
        practiceProblems: [
            { title: 'DFS of Graph (GFG)', url: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1', difficulty: 'Easy' },
            { title: 'Path Sum (LeetCode)', url: 'https://leetcode.com/problems/path-sum/', difficulty: 'Easy' }
        ],
        solutions: ALGO_SOLUTIONS.dfs
    },
    dijkstra: {
        ...ALGO_METADATA.dijkstra,
        startFunc: () => Algos.runDijkstra(algoHelpers),
        description: 'Finds shortest path in grid.',
        practiceProblems: [{ title: 'Dijkstra (GFG)', url: 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.dijkstra
    },
    fibonacci: {
        ...ALGO_METADATA.fibonacci,
        startFunc: () => Algos.runFibonacciDP(algoHelpers),
        description: 'Efficient calculation using memoization.',
        practiceProblems: [{ title: 'Fibonacci (LeetCode)', url: 'https://leetcode.com/problems/fibonacci-number/', difficulty: 'Easy' }],
        solutions: ALGO_SOLUTIONS.fibonacci
    },
    gcd: {
        ...ALGO_METADATA.gcd,
        startFunc: () => Algos.runEuclideanGCD(algoHelpers),
        description: 'Fastest way to find GCD.',
        practiceProblems: [{ title: 'GCD (GFG)', url: 'https://www.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1', difficulty: 'Easy' }],
        solutions: ALGO_SOLUTIONS.gcd
    },
    jump: {
        ...ALGO_METADATA.jump,
        startFunc: () => Algos.runJumpSearch(algoHelpers),
        description: 'Jump through blocks to find target.',
        practiceProblems: [{ title: 'Jump Search (GFG)', url: 'https://www.geeksforgeeks.org/jump-search/', difficulty: 'Easy' }],
        solutions: ALGO_SOLUTIONS.jump
    },
    heap: {
        ...ALGO_METADATA.heap,
        startFunc: () => Algos.runHeapSort(algoHelpers),
        description: 'Sort using a binary heap structure.',
        practiceProblems: [{ title: 'Heap Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/heap-sort/1', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.heap
    },
    shell: {
        ...ALGO_METADATA.shell,
        startFunc: () => Algos.runShellSort(algoHelpers),
        description: 'Generalized insertion sort.',
        practiceProblems: [{ title: 'Shell Sort (GFG)', url: 'https://www.geeksforgeeks.org/shell-sort/', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.shell
    },
    nqueens: {
        ...ALGO_METADATA.nqueens,
        startFunc: () => Algos.runNQueens(algoHelpers),
        description: 'Recursive backtracking puzzle.',
        practiceProblems: [{ title: 'N-Queens (LeetCode)', url: 'https://leetcode.com/problems/n-queens/', difficulty: 'Hard' }],
        solutions: ALGO_SOLUTIONS.nqueens
    },
    sudoku: {
        ...ALGO_METADATA.sudoku,
        startFunc: () => Algos.runSudoku(algoHelpers),
        description: 'Constraint satisfaction solver.',
        practiceProblems: [{ title: 'Sudoku Solver (LeetCode)', url: 'https://leetcode.com/problems/sudoku-solver/', difficulty: 'Hard' }],
        solutions: ALGO_SOLUTIONS.sudoku
    },
    sieve: {
        ...ALGO_METADATA.sieve,
        startFunc: () => Algos.runSieve(algoHelpers),
        description: 'Finding primes by elimination.',
        practiceProblems: [{ title: 'Count Primes (LeetCode)', url: 'https://leetcode.com/problems/count-primes/', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.sieve
    },
    knapsack: {
        ...ALGO_METADATA.knapsack,
        startFunc: () => Algos.runKnapsack(algoHelpers),
        description: 'Classic optimization problem.',
        practiceProblems: [{ title: '0/1 Knapsack (GFG)', url: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1', difficulty: 'Medium' }],
        solutions: ALGO_SOLUTIONS.knapsack
    }
  }), [algoHelpers]);

  const algoCategories = [
    { name: 'Sorting', icon: List, keys: ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'shell'] },
    { name: 'Searching', icon: Binary, keys: ['linear', 'binary', 'jump'] },
    { name: 'Graph/Grid', icon: Network, keys: ['bfs', 'dfs', 'dijkstra'] },
    { name: 'Dynamic Programming', icon: Table, keys: ['fibonacci', 'knapsack'] },
    { name: 'Backtracking', icon: Brain, keys: ['nqueens', 'sudoku'] },
    { name: 'Math & Logic', icon: Hash, keys: ['gcd', 'sieve'] }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen text-slate-200 font-sans pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Algo<span className="text-orange-600">Lab</span></h1>
          <p className="text-slate-500 max-w-2xl">Learn and visualize computer science algorithms.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-3 space-y-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <div className="flex lg:flex-col gap-4 min-w-max lg:min-w-0">
                {algoCategories.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 w-64 lg:w-full shrink-0">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                          <cat.icon size={12} title={cat.name} /> {cat.name}
                      </h4>
                      <div className="space-y-1">
                          {cat.keys.map(key => (
                              <button key={key} onClick={() => handleAlgoSwitch(key)}
                                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${visType === key ? 'bg-orange-600 text-black' : 'text-slate-400 hover:bg-white/5'}`}
                              > {algoData[key]?.name} </button>
                          ))}
                      </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="lg:col-span-9 space-y-6">
              <div className="flex gap-1.5 p-1.5 bg-white/[0.02] rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
                 {[{ id: 'visualizer', name: 'Visualize', icon: Play }, { id: 'problem', name: 'Practice', icon: HelpCircle }, { id: 'solution', name: 'Standard Code', icon: Code2 }].map(tab => (
                    <button key={tab.id} onClick={() => {
                      setActiveTab(tab.id);
                      trackEvent('algo_lab_tab_switch', { tab: tab.id, algorithm: visType });
                    }} title={tab.name}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-orange-600 text-black' : 'text-slate-500 hover:text-slate-300'}`}
                    > <tab.icon size={14} /> {tab.name} </button>
                 ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'visualizer' && (
                  <motion.div key={`vis-${visType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-4 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-white/[0.02] border border-white/5 min-h-[500px] sm:min-h-[550px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-black text-white">{algoData[visType]?.name}</h3>
                            <p className="text-[9px] sm:text-[10px] text-orange-600 font-black uppercase tracking-widest mt-1">{algoData[visType]?.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                           <div className="flex bg-white/5 p-1 rounded-lg sm:rounded-xl border border-white/5 gap-0.5 sm:gap-1">
                                {[0.5, 1, 1.5, 2].map(m => (
                                    <button key={m} onClick={() => setSpeedMultiplier(m)} title={`Set Speed to ${m}x`}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black transition-all ${speedMultiplier === m ? 'bg-orange-600 text-black shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-200'}`}
                                    > {m}x </button>
                                ))}
                           </div>
                           <div className="flex items-center gap-2 bg-white/5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-white/5">
                               <button onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Unmute" : "Mute"} className="text-slate-400 hover:text-white">
                                 {isMuted || volume === 0 ? <VolumeX size={14}/> : <Volume2 size={14}/>}
                               </button>
                               <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={(e) => {setVolume(parseFloat(e.target.value)); setIsMuted(false);}} className="w-12 sm:w-16 h-1 accent-orange-600 cursor-pointer" title={`Volume: ${Math.round(volume * 100)}%`} />
                           </div>
                           <button onClick={resetVis} title="Reset Simulation" className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all"><RotateCcw size={16}/></button>

                           <div className="flex items-center gap-2 w-full sm:w-auto">
                                {!isSorting ? (
                                    <button onClick={startAlgo} className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-600 text-black font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-lg sm:rounded-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/10"><Play size={14}/> Start</button>
                                ) : (
                                    <>
                                        <button onClick={togglePlayPause} title={isPaused ? "Resume" : "Pause"} className="flex-1 sm:flex-none p-2.5 sm:p-3 bg-white/10 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all flex justify-center" onClickCapture={() => trackEvent('algorithm_pause_resume', { algorithm: visType, action: isPaused ? 'resume' : 'pause' })}>{isPaused ? <Play size={16}/> : <Pause size={16}/>}</button>
                                        <button onClick={handleStep} disabled={!isPaused} className={`flex-1 sm:flex-none p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all flex justify-center ${isPaused ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-slate-600'}`} title="Next Step" onClickCapture={() => isPaused && trackEvent('algorithm_step', { algorithm: visType })}><SkipForward size={16}/></button>
                                    </>
                                )}
                           </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 min-h-[300px] sm:min-h-[350px]">
                        {algoData[visType]?.type === 'grid' ? (
                            <div className="grid grid-cols-10 gap-0.5 sm:gap-1 w-full max-w-full sm:max-w-[400px]">
                                {(gridData || []).map((val, i) => (
                                    <div key={i} className={`aspect-square rounded-[1px] sm:rounded-sm border flex items-center justify-center relative ${visType === 'sieve' && visPointers.mid === i + 1 ? 'bg-orange-400 border-amber-300 z-10 scale-110 shadow-[0_0_15px_rgba(251,146,60,0.5)]' : val === 1 ? 'bg-orange-600 border-orange-400' : val === 2 ? 'bg-rose-500 border-rose-400' : val === 3 ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/10'}`}>
                                        {visType === 'sieve' && <span className={`text-[8px] sm:text-[10px] font-bold ${visPointers.mid === i + 1 ? 'text-black' : 'text-slate-500'}`}>{i + 1}</span>}
                                        {visType === 'sudoku' && val !== 0 && val !== 1 && val !== 2 && val !== 3 && <span className="text-[10px] sm:text-xs font-bold text-white">{val}</span>}
                                        {visType === 'nqueens' && val === 1 && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />}
                                    </div>
                                ))}
                            </div>
                        ) : algoData[visType]?.type === 'table' ? (
                            <div className="overflow-auto max-w-full custom-scrollbar p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                                <table className="border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border border-white/10 bg-white/5" />
                                            {tableData.cols.map((c, i) => <th key={i} className="p-2 border border-white/10 text-[10px] font-black text-slate-500">{c}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.data.map((row, i) => (
                                            <tr key={i}>
                                                <th className="p-2 border border-white/10 text-[10px] font-black text-slate-500">{tableData.rows[i]}</th>
                                                {row.map((cell, j) => (
                                                    <td key={j} className={`p-2 sm:p-3 border border-white/10 text-[10px] sm:text-xs font-bold text-center transition-all ${visPointers.mid === i && visPointers.left === j ? 'bg-orange-600 text-black' : 'text-slate-400'}`}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex items-end gap-1 sm:gap-2 h-48 sm:h-64 w-full max-w-4xl px-2 sm:px-4">
                                {(visArray || []).map((val, i) => (
                                    <motion.div key={i} layout animate={{ height: `${val}%`, opacity: (visPointers.secondary || []).includes(i) ? 0.6 : 1 }}
                                        className={`flex-1 rounded-t-md sm:rounded-t-xl transition-all duration-300 relative group ${(visPointers.active || []).includes(i) ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : visPointers.mid === i ? 'bg-rose-500' : (visPointers.secondary || []).includes(i) ? 'bg-blue-400' : 'bg-gradient-to-t from-orange-700 to-orange-500'}`}
                                    > <span className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] font-black text-slate-500 group-hover:text-white">{val}</span> </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5 flex items-start gap-4">
                        <Terminal size={14} className="text-orange-600 mt-1" title="Execution Log" />
                        <div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Step Explanation</span>
                             <p className="text-sm font-medium text-slate-300 leading-relaxed">{stepDescription}</p>
                        </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'problem' && (
                    <motion.div key={`prob-${visType}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-black text-white">Practice Lab</h3>
                            <div className="p-4 bg-orange-600/10 rounded-2xl"><Cpu size={24} className="text-orange-600" title="Algorithm Logic" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(algoData[visType]?.practiceProblems || []).map((prob, idx) => (
                                <a key={idx} href={prob.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('practice_problem_click', { algorithm: visType, problem: prob.title })} className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-600/50 transition-all flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-white group-hover:text-orange-500">{prob.title}</h4>
                                        <ExternalLink size={16} className="text-slate-600 group-hover:text-orange-600" title="Open Practice Problem" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/5 text-slate-400 w-fit">{prob.difficulty}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'solution' && (
                    <motion.div key={`sol-${visType}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
                         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <h3 className="text-2xl font-black text-white">Reference Solution</h3>
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto">
                               <select value={solLang} onChange={(e) => setSolLang(e.target.value)} className="flex-1 sm:flex-none bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase px-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-orange-600 cursor-pointer appearance-none min-w-[100px]">
                                  {['JavaScript', 'CPP', 'Python', 'Java'].map(l => <option key={l} value={l} className="bg-[#111]">{l === 'CPP' ? 'C++' : l}</option>)}
                               </select>
                               <button onClick={() => { navigator.clipboard.writeText(algoData[visType]?.solutions?.[solLang] || ""); showToast("Copied!"); trackEvent('copy_solution_code', { algorithm: visType, language: solLang }); }} className="flex-1 sm:flex-none px-6 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5 hover:text-white transition-all">Copy Code</button>
                            </div>
                         </div>
                         <div className="p-8 bg-[#1a1412] rounded-[2rem] border border-white/5 overflow-auto max-h-[500px]">
                            <pre className="text-xs leading-relaxed"><code dangerouslySetInnerHTML={{ __html: highlight(algoData[visType]?.solutions?.[solLang] || "// Solution coming soon...",
                                solLang === 'JavaScript' ? prismLanguages.javascript :
                                solLang === 'CPP' ? prismLanguages.cpp :
                                solLang === 'Python' ? prismLanguages.python : prismLanguages.java
                            ) }} /></pre>
                         </div>
                    </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-orange-600 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-orange-400/20">{toast}</motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 88, 12, 0.5); }
      `}} />
    </motion.div>
  );
};

export default Visualizers;
