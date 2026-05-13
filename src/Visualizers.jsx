import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RefreshCw, Zap, Info, Play, RotateCcw,
  Code2, HelpCircle, CheckCircle2, Terminal, ExternalLink,
  ChevronRight, ChevronLeft, FastForward, Cpu, Volume2, VolumeX,
  Pause, SkipForward, LayoutGrid, List, Binary, Layers
} from 'lucide-react';
import { highlight, languages as prismLanguages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';

const ALGO_METADATA = {
    bubble: { type: 'bars', name: 'Bubble Sort', cat: 'Sorting' },
    selection: { type: 'bars', name: 'Selection Sort', cat: 'Sorting' },
    insertion: { type: 'bars', name: 'Insertion Sort', cat: 'Sorting' },
    merge: { type: 'bars', name: 'Merge Sort', cat: 'Sorting' },
    quick: { type: 'bars', name: 'Quick Sort', cat: 'Sorting' },
    heap: { type: 'bars', name: 'Heap Sort', cat: 'Sorting' },
    shell: { type: 'bars', name: 'Shell Sort', cat: 'Sorting' },
    linear: { type: 'bars', name: 'Linear Search', cat: 'Searching' },
    binary: { type: 'bars', name: 'Binary Search', cat: 'Searching' },
    jump: { type: 'bars', name: 'Jump Search', cat: 'Searching' },
    interpolation: { type: 'bars', name: 'Interpolation Search', cat: 'Searching' },
    bfs: { type: 'grid', name: 'Breadth-First Search', cat: 'Graph/Grid' },
    dfs: { type: 'grid', name: 'Depth-First Search', cat: 'Graph/Grid' },
    fibonacci: { type: 'bars', name: 'Fibonacci (DP)', cat: 'Math & DP' },
    gcd: { type: 'bars', name: 'Euclidean GCD', cat: 'Math & DP' },
    sieve: { type: 'bars', name: 'Sieve of Eratosthenes', cat: 'Math & DP' },
    pascals: { type: 'bars', name: 'Pascal Triangle', cat: 'Math & DP' },
    hanoi: { type: 'peg', name: 'Tower of Hanoi', cat: 'Backtracking' },
    nqueens: { type: 'grid', name: 'N-Queens', cat: 'Backtracking' },
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
  const [ansSelectedLang, setAnsSelectedLang] = useState('JavaScript');

  const [gridData, setVisGrid] = useState([]);
  const [pegs, setVisPegs] = useState([[], [], []]);

  const audioCtx = useRef(null);
  const isPausedRef = useRef(false);
  const stepResolverRef = useRef(null);

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
    await checkPause();
    await new Promise(r => setTimeout(r, speedRef.current));
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

  // --- Algorithms ---
  const bubbleSort = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setVisPointers(prev => ({ ...prev, active: [j, j + 1] }));
        setStepDescription(`Comparing ${arr[j]} and ${arr[j+1]}`);
        playTone(200 + arr[j] * 5); await delay();
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setVisArray([...arr]); await delay();
        }
      }
    }
    setVisPointers(prev => ({ ...prev, active: [] })); setIsVisSorting(false);
    setStepDescription('Bubble Sort Complete!'); playSuccessSound();
  };

  const selectionSort = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            setVisPointers(prev => ({ ...prev, active: [j], mid: min, left: i }));
            setStepDescription(`Looking for min. Current: ${arr[min]}`);
            playTone(300 + j * 10); await delay();
            if (arr[j] < arr[min]) min = j;
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
        setVisArray([...arr]); await delay();
    }
    setIsVisSorting(false); playSuccessSound();
  };

  const insertionSort = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let arr = [...visArray];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i]; let j = i - 1;
        setStepDescription(`Inserting ${key}`);
        while (j >= 0 && arr[j] > key) {
            setVisPointers(prev => ({ ...prev, active: [j, j+1] }));
            arr[j + 1] = arr[j]; setVisArray([...arr]);
            playTone(300 + j * 10); await delay(); j--;
        }
        arr[j + 1] = key; setVisArray([...arr]);
    }
    setIsVisSorting(false); playSuccessSound();
  };

  const linearSearch = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let arr = [...visArray];
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Searching for: ${target}`);
    for (let i = 0; i < arr.length; i++) {
        setVisPointers(prev => ({ ...prev, active: [i] }));
        setStepDescription(`Checking index ${i}: ${arr[i]}`);
        playTone(300 + i * 20); await delay();
        if (arr[i] === target) {
            setStepDescription(`Match found at index ${i}!`);
            playSuccessSound(); setIsVisSorting(false); return;
        }
    }
    setIsVisSorting(false);
  };

  const binarySearch = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let arr = [...visArray].sort((a, b) => a - b);
    setVisArray(arr);
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Searching for: ${target}`);
    let low = 0, high = arr.length - 1;
    while (low <= high) {
      let mid = low + Math.floor((high - low) / 2);
      setVisPointers(prev => ({ ...prev, left: low, right: high, mid: mid, active: [] }));
      setStepDescription(`Checking index ${mid}: ${arr[mid]}`);
      playTone(400 + mid * 20); await delay();
      if (arr[mid] === target) {
        setVisPointers(prev => ({ ...prev, active: [mid] }));
        setStepDescription(`Found ${target} at index ${mid}!`);
        playSuccessSound(); break;
      } else if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
      await delay();
    }
    setIsVisSorting(false);
  };

  const runBFS = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let grid = Array(100).fill(0); const start = 0, end = 99;
    let queue = [start]; let visited = new Set([start]);
    grid[start] = 1; grid[end] = 2;
    const neighbors = (u) => {
        let n = []; let r = Math.floor(u / 10), c = u % 10;
        if (r > 0) n.push(u - 10); if (r < 9) n.push(u + 10);
        if (c > 0) n.push(u - 1); if (c < 9) n.push(u + 1);
        return n;
    };
    while (queue.length > 0) {
        let u = queue.shift(); if (u === end) break;
        setVisPointers(prev => ({ ...prev, active: [u] }));
        for (let v of neighbors(u)) {
            if (!visited.has(v)) {
                visited.add(v); grid[v] = grid[v] === 2 ? 2 : 3;
                setVisGrid([...grid]); playTone(400 + v * 5); await delay();
                queue.push(v);
            }
        }
    }
    setIsVisSorting(false); playSuccessSound();
  };

  const runDFS = async () => {
    setIsVisSorting(true); setIsPaused(false);
    let grid = Array(100).fill(0); const end = 99;
    let visited = new Set(); grid[end] = 2;
    const neighbors = (u) => {
        let n = []; let r = Math.floor(u / 10), c = u % 10;
        if (r < 9) n.push(u + 10); if (c < 9) n.push(u + 1);
        if (r > 0) n.push(u - 10); if (c > 0) n.push(u - 1);
        return n;
    };
    const dfs = async (u) => {
        if (u === end || visited.has(u)) return u === end;
        visited.add(u); grid[u] = 3; setVisGrid([...grid]);
        playTone(300 + u * 5); await delay();
        for (let v of neighbors(u)) if (await dfs(v)) return true;
        return false;
    };
    await dfs(0); setIsVisSorting(false); playSuccessSound();
  };

  const algoData = {
    bubble: {
        ...ALGO_METADATA.bubble,
        startFunc: bubbleSort,
        description: 'Compares adjacent elements and swaps if needed.',
        practiceProblems: [
            { title: 'Bubble Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/bubble-sort/1', difficulty: 'Easy' },
            { title: 'Sort Colors (LeetCode)', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' }
        ],
        solutions: {
            JavaScript: `function bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}`
        }
    },
    selection: {
        ...ALGO_METADATA.selection,
        startFunc: selectionSort,
        description: 'Finds min element and puts it at front.',
        practiceProblems: [
            { title: 'Selection Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/selection-sort/1', difficulty: 'Easy' }
        ],
        solutions: {
            JavaScript: `function selectionSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n; i++) {\n    let min = i;\n    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[min]) min = j;\n    }\n    [arr[i], arr[min]] = [arr[min], arr[i]];\n  }\n  return arr;\n}`
        }
    },
    insertion: {
        ...ALGO_METADATA.insertion,
        startFunc: insertionSort,
        description: 'Inserts each element into its place.',
        practiceProblems: [
            { title: 'Insertion Sort (GFG)', url: 'https://www.geeksforgeeks.org/problems/insertion-sort/1', difficulty: 'Easy' }
        ],
        solutions: {
            JavaScript: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    let key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}`
        }
    },
    linear: {
        ...ALGO_METADATA.linear,
        startFunc: linearSearch,
        description: 'Sequentially checks elements.',
        practiceProblems: [
            { title: 'Linear Search (GFG)', url: 'https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1', difficulty: 'Easy' }
        ],
        solutions: {
            JavaScript: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`
        }
    },
    binary: {
        ...ALGO_METADATA.binary,
        startFunc: binarySearch,
        description: 'Search in sorted array.',
        practiceProblems: [
            { title: 'Binary Search (LeetCode)', url: 'https://leetcode.com/problems/binary-search/', difficulty: 'Easy' },
            { title: 'Search Insert Position (LeetCode)', url: 'https://leetcode.com/problems/search-insert-position/', difficulty: 'Easy' }
        ],
        solutions: {
            JavaScript: `function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`
        }
    },
    bfs: {
        ...ALGO_METADATA.bfs,
        startFunc: runBFS,
        description: 'Explores neighbors level by level.',
        practiceProblems: [
            { title: 'BFS of Graph (GFG)', url: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1', difficulty: 'Easy' },
            { title: 'Number of Islands (LeetCode)', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium' }
        ],
        solutions: {
            JavaScript: `function bfs(graph, start) {\n  let queue = [start];\n  let visited = new Set([start]);\n  while (queue.length > 0) {\n    let u = queue.shift();\n    console.log(u);\n    for (let v of graph[u]) {\n      if (!visited.has(v)) {\n        visited.add(v);\n        queue.push(v);\n      }\n    }\n  }\n}`
        }
    },
    dfs: {
        ...ALGO_METADATA.dfs,
        startFunc: runDFS,
        description: 'Explores path as deep as possible.',
        practiceProblems: [
            { title: 'DFS of Graph (GFG)', url: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1', difficulty: 'Easy' },
            { title: 'Path Sum (LeetCode)', url: 'https://leetcode.com/problems/path-sum/', difficulty: 'Easy' }
        ],
        solutions: {
            JavaScript: `function dfs(graph, u, visited = new Set()) {\n  visited.add(u);\n  console.log(u);\n  for (let v of graph[u]) {\n    if (!visited.has(v)) {\n      dfs(graph, v, visited);\n    }\n  }\n}`
        }
    }
  };

  const algoCategories = [
    { name: 'Sorting', icon: List, keys: ['bubble', 'selection', 'insertion'] },
    { name: 'Searching', icon: Binary, keys: ['linear', 'binary'] },
    { name: 'Graph/Grid', icon: LayoutGrid, keys: ['bfs', 'dfs'] }
  ];

  const resetVis = useCallback(() => {
    const type = ALGO_METADATA[visType]?.type;
    if (type === 'bars') setVisArray(Array.from({length: 12}, () => Math.floor(Math.random() * 90) + 10));
    else if (type === 'grid') setVisGrid(Array(100).fill(0));
    setVisPointers({ left: -1, right: -1, mid: -1, active: [], secondary: [] });
    setStepDescription('Ready to visualize.');
  }, [visType]);

  useEffect(() => { resetVis(); }, [resetVis]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen text-slate-200 font-sans pb-20 overflow-x-hidden">

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Algo<span className="text-orange-600">Lab</span></h1>
          <p className="text-slate-500 max-w-2xl">Learn and visualize computer science algorithms.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-3 space-y-4">
              {algoCategories.map((cat) => (
                <div key={cat.name} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <cat.icon size={12} /> {cat.name}
                    </h4>
                    <div className="space-y-1">
                        {cat.keys.map(key => (
                            <button key={key} onClick={() => { setVisType(key); setActiveTab('visualizer'); }} disabled={isSorting}
                                className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${visType === key ? 'bg-orange-600 text-black' : 'text-slate-400 hover:bg-white/5'}`}
                            > {algoData[key]?.name} </button>
                        ))}
                    </div>
                </div>
              ))}
           </div>

           <div className="lg:col-span-9 space-y-6">
              <div className="flex gap-2 p-1.5 bg-white/[0.02] rounded-2xl border border-white/5 inline-flex">
                 {[{ id: 'visualizer', name: 'Visualize', icon: Play }, { id: 'problem', name: 'Practice', icon: HelpCircle }, { id: 'solution', name: 'Standard Code', icon: Code2 }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-600 text-black' : 'text-slate-500 hover:text-slate-300'}`}
                    > <tab.icon size={14} /> {tab.name} </button>
                 ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'visualizer' && (
                  <motion.div key={`vis-${visType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-8 sm:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 min-h-[550px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-white">{algoData[visType]?.name}</h3>
                            <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mt-1">{algoData[visType]?.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                           <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 gap-1">
                                {[0.5, 1, 1.5, 2].map(m => (
                                    <button key={m} onClick={() => setSpeedMultiplier(m)} title={`Set Speed to ${m}x`}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${speedMultiplier === m ? 'bg-orange-600 text-black shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-200'}`}
                                    > {m}x </button>
                                ))}
                           </div>
                           <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                               <button onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Unmute" : "Mute"} className="text-slate-400 hover:text-white">
                                 {isMuted || volume === 0 ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                               </button>
                               <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={(e) => {setVolume(parseFloat(e.target.value)); setIsMuted(false);}} className="w-16 h-1 accent-orange-600 cursor-pointer" title={`Volume: ${Math.round(volume * 100)}%`} />
                           </div>
                           <button onClick={resetVis} disabled={isSorting} title="Reset Simulation" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all"><RotateCcw size={18}/></button>

                           <div className="flex items-center gap-2">
                                {!isSorting ? (
                                    <button onClick={() => algoData[visType]?.startFunc()} className="px-8 py-3 bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/10"><Play size={16}/> Start</button>
                                ) : (
                                    <>
                                        <button onClick={togglePlayPause} title={isPaused ? "Resume" : "Pause"} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">{isPaused ? <Play size={18}/> : <Pause size={18}/>}</button>
                                        <button onClick={handleStep} disabled={!isPaused} className={`p-3 rounded-xl transition-all ${isPaused ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-slate-600'}`} title="Next Step"><SkipForward size={18}/></button>
                                    </>
                                )}
                           </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-10 min-h-[350px]">
                        {algoData[visType]?.type === 'grid' ? (
                            <div className="grid grid-cols-10 gap-1 w-full max-w-[400px]">
                                {(gridData || []).map((val, i) => (
                                    <div key={i} className={`aspect-square rounded-sm border ${val === 1 ? 'bg-orange-600 border-orange-400' : val === 2 ? 'bg-rose-500 border-rose-400' : val === 3 ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/10'}`} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-end gap-2 h-64 w-full max-w-4xl px-4">
                                {(visArray || []).map((val, i) => (
                                    <motion.div key={i} layout animate={{ height: `${val}%`, opacity: (visPointers.secondary || []).includes(i) ? 0.6 : 1 }}
                                        className={`flex-1 rounded-t-xl transition-all duration-300 relative group ${(visPointers.active || []).includes(i) ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : visPointers.mid === i ? 'bg-rose-500' : (visPointers.secondary || []).includes(i) ? 'bg-blue-400' : 'bg-gradient-to-t from-orange-700 to-orange-500'}`}
                                    > <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 group-hover:text-white">{val}</span> </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5 flex items-start gap-4">
                        <Terminal size={14} className="text-orange-600 mt-1" />
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
                            <div className="p-4 bg-orange-600/10 rounded-2xl"><Cpu size={24} className="text-orange-600" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(algoData[visType]?.practiceProblems || []).map((prob, idx) => (
                                <a key={idx} href={prob.url} target="_blank" rel="noopener noreferrer" className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-600/50 transition-all flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-white group-hover:text-orange-500">{prob.title}</h4>
                                        <ExternalLink size={16} className="text-slate-600 group-hover:text-orange-600" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/5 text-slate-400 w-fit">{prob.difficulty}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'solution' && (
                    <motion.div key={`sol-${visType}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                            <h3 className="text-2xl font-black text-white">Reference Solution</h3>
                            <button onClick={() => { navigator.clipboard.writeText(algoData[visType]?.solutions?.JavaScript || ""); showToast("Copied!"); }} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5 hover:text-white transition-all">Copy Code</button>
                         </div>
                         <div className="p-8 bg-[#1a1412] rounded-[2rem] border border-white/5 overflow-auto max-h-[500px]">
                            <pre className="text-xs leading-relaxed"><code dangerouslySetInnerHTML={{ __html: highlight(algoData[visType]?.solutions?.JavaScript || "// Solution coming soon...", prismLanguages.javascript) }} /></pre>
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
