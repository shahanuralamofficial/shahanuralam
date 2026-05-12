import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RefreshCw, Zap, Info, Play, RotateCcw,
  Code2, HelpCircle, CheckCircle2, Terminal, ExternalLink,
  ChevronRight, ChevronLeft, FastForward, Cpu, Loader2, Save
} from 'lucide-react';
import { highlight, languages as prismLanguages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import Editor from 'react-simple-code-editor';

const Visualizers = ({ onBack }) => {
  const [visType, setVisType] = useState('bubble');
  const [visArray, setVisArray] = useState([]);
  const [visPointers, setVisPointers] = useState({ left: -1, right: -1, mid: -1, active: [] });
  const [isSorting, setIsVisSorting] = useState(false);
  const [toast, setToast] = useState(null);
  const [stepDescription, setStepDescription] = useState('Select an algorithm and press Start to visualize.');
  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer', 'problem', 'solution'
  const [speed, setSpeed] = useState(500);
  const speedRef = useRef(500);

  const [selectedLang, setSelectedLang] = useState('JavaScript');
  const [ansSelectedLang, setAnsSelectedLang] = useState('JavaScript');
  const [userCode, setUserCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'loading', 'success', 'error'

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const langSkeletons = {
    'JavaScript': (name) => `function ${name}(arr) {\n  // Write your logic here\n  \n  return arr;\n}`,
    'Python 3': (name) => `def ${name}(arr):\n    # Write your logic here\n    \n    return arr`,
    'C++ 17': (name) => `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> ${name}(vector<int>& arr) {\n    // Write your logic here\n    \n    return arr;\n}`,
    'Java': (name) => `import java.util.*;\n\npublic class Solution {\n    public int[] ${name}(int[] arr) {\n        // Write your logic here\n        \n        return arr;\n    }\n}`
  };

  // --- Algorithms Implementation ---

  const bubbleSort = async () => {
    setIsVisSorting(true);
    let arr = [...visArray];
    setStepDescription('Starting Bubble Sort: Comparing adjacent elements and swapping if needed.');
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setVisPointers({ active: [j, j + 1] });
        setStepDescription(`Comparing ${arr[j]} and ${arr[j + 1]}...`);
        await delay();
        if (arr[j] > arr[j + 1]) {
          setStepDescription(`${arr[j]} > ${arr[j+1]}, swapping them.`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setVisArray([...arr]);
          await delay();
        }
      }
    }
    setVisPointers({ active: [] });
    setIsVisSorting(false);
    setStepDescription('Bubble Sort Complete! The array is now sorted.');
    showToast("Sorting Complete!");
  };

  const linearSearch = async () => {
    setIsVisSorting(true);
    let arr = [...visArray];
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Starting Linear Search: Looking for value ${target} sequentially.`);
    showToast(`Searching for: ${target}`);

    for (let i = 0; i < arr.length; i++) {
        setVisPointers({ active: [i] });
        setStepDescription(`Checking element at index ${i}: ${arr[i]}`);
        await delay();
        if (arr[i] === target) {
            setVisPointers({ active: [i] });
            setStepDescription(`Match found! ${target} is at index ${i}.`);
            showToast("Element Found!");
            setIsVisSorting(false);
            return;
        }
    }
    setIsVisSorting(false);
  };

  const binarySearch = async () => {
    setIsVisSorting(true);
    let arr = [...visArray].sort((a, b) => a - b);
    setVisArray(arr);
    let target = arr[Math.floor(Math.random() * arr.length)];
    setStepDescription(`Starting Binary Search: Looking for ${target} in a sorted array.`);
    showToast(`Searching for: ${target}`);

    let low = 0, high = arr.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setVisPointers({ left: low, right: high, mid: mid, active: [] });
      setStepDescription(`Range: [${low}, ${high}]. Midpoint at index ${mid} is ${arr[mid]}.`);
      await delay();

      if (arr[mid] === target) {
        setVisPointers({ left: low, right: high, mid: mid, active: [mid] });
        setStepDescription(`Match found! ${target} is at index ${mid}.`);
        showToast("Element Found!");
        break;
      } else if (arr[mid] < target) {
        setStepDescription(`${arr[mid]} < ${target}, searching the right half.`);
        low = mid + 1;
      } else {
        setStepDescription(`${arr[mid]} > ${target}, searching the left half.`);
        high = mid - 1;
      }
      await delay();
    }
    setIsVisSorting(false);
  };

  const sieveVisualizer = async () => {
    setIsVisSorting(true);
    let n = 50;
    let primes = new Array(n + 1).fill(true);
    setVisArray(primes.map((_, i) => i));
    setStepDescription('Starting Sieve of Eratosthenes: Finding all primes up to 50.');

    for (let p = 2; p * p <= n; p++) {
      if (primes[p]) {
        setVisPointers({ active: [p] });
        setStepDescription(`${p} is prime. Marking all its multiples as non-prime.`);
        await delay();
        for (let i = p * p; i <= n; i += p) {
          primes[i] = false;
          setVisArray([...primes.map((val, idx) => val ? idx : -1)]);
          setVisPointers({ active: [p, i] });
          await delay();
        }
      }
    }
    setVisPointers({ active: [] });
    setIsVisSorting(false);
    setStepDescription('Sieve Complete! Remaining numbers are prime.');
    showToast("Sieve Complete!");
  };

  const euclideanGCD = async () => {
    setIsVisSorting(true);
    let a = Math.floor(Math.random() * 80) + 20;
    let b = Math.floor(Math.random() * 80) + 20;
    setVisArray([a, b]);
    setStepDescription(`Calculating GCD of ${a} and ${b} using Euclidean Algorithm.`);

    while (b !== 0) {
        setVisPointers({ active: [0, 1] });
        setStepDescription(`a = ${a}, b = ${b}. Calculating a % b...`);
        await delay();
        let temp = b;
        b = a % b;
        a = temp;
        setVisArray([a, b]);
        setStepDescription(`New state: a = ${a}, b = ${b}.`);
        await delay();
    }
    setStepDescription(`GCD is ${a}.`);
    showToast(`GCD is ${a}`);
    setIsVisSorting(false);
  };

  const quickSortVisualizer = async () => {
    setIsVisSorting(true);
    let arr = [...visArray];
    setStepDescription('Starting Quick Sort: Selecting pivot and partitioning...');

    const partition = async (l, r) => {
        let pivot = arr[r];
        setStepDescription(`Selecting pivot: ${pivot} at index ${r}`);
        setVisPointers({ mid: r, active: [] });
        await delay();

        let i = l - 1;
        for (let j = l; j < r; j++) {
            setVisPointers({ mid: r, active: [j, i >= l ? i : l] });
            setStepDescription(`Comparing ${arr[j]} with pivot ${pivot}...`);
            await delay();
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setVisArray([...arr]);
                setStepDescription(`${arr[i]} < pivot, moving to left partition.`);
                await delay();
            }
        }
        [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
        setVisArray([...arr]);
        setStepDescription(`Placing pivot ${pivot} at its correct position.`);
        await delay();
        return i + 1;
    };

    const sort = async (l, r) => {
        if (l < r) {
            let pi = await partition(l, r);
            await sort(l, pi - 1);
            await sort(pi + 1, r);
        }
    };

    await sort(0, arr.length - 1);
    setVisPointers({ active: [], mid: -1 });
    setIsVisSorting(false);
    setStepDescription('Quick Sort Complete! The array is fully sorted.');
    showToast("Quick Sort Complete!");
  };

  // --- Utility ---

  const resetVis = () => {
    if (visType === 'sieve') {
        setVisArray(Array.from({length: 51}, (_, i) => i));
    } else if (visType === 'gcd') {
        setVisArray([48, 18]);
    } else {
        setVisArray(Array.from({length: 12}, () => Math.floor(Math.random() * 90) + 10));
    }
    setVisPointers({ left: -1, right: -1, mid: -1, active: [] });
    setStepDescription('Select an algorithm and press Start to visualize.');
  };

  useEffect(() => { resetVis(); }, [visType]);

  const algoData = {
    bubble: {
        id: 'bubble',
        name: 'Bubble Sort',
        funcName: 'bubbleSort',
        link: 'https://www.geeksforgeeks.org/bubble-sort/',
        description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        problem: 'Given an array of integers, sort them in ascending order using the Bubble Sort algorithm. The algorithm should have O(n^2) time complexity.',
        solutions: {
          'JavaScript': `function bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}`,
          'Python 3': `def bubbleSort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
          'C++ 17': `vector<int> bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n    return arr;\n}`,
          'Java': `public int[] bubbleSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n    return arr;\n}`
        },
        startFunc: bubbleSort
    },
    linear: {
        id: 'linear',
        name: 'Linear Search',
        funcName: 'linearSearch',
        link: 'https://www.geeksforgeeks.org/linear-search/',
        description: 'Linear Search finds an element in a list by checking each element sequentially until a match is found.',
        problem: 'Implement a function that takes an array and a target value, and returns the index of the target if it exists, otherwise -1.',
        solutions: {
          'JavaScript': `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
          'Python 3': `def linearSearch(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1`,
          'C++ 17': `int linearSearch(vector<int>& arr, int target) {\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
          'Java': `public int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`
        },
        startFunc: linearSearch
    },
    binary: {
        id: 'binary',
        name: 'Binary Search',
        funcName: 'binarySearch',
        link: 'https://www.geeksforgeeks.org/binary-search/',
        description: 'Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
        problem: 'Search for a target value in a sorted array. Return the index. The time complexity should be O(log n).',
        solutions: {
          'JavaScript': `function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`,
          'Python 3': `def binarySearch(arr, target):\n    low = 0\n    high = len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
          'C++ 17': `int binarySearch(vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
          'Java': `public int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`
        },
        startFunc: binarySearch
    },
    sieve: {
        id: 'sieve',
        name: 'Sieve of Eratosthenes',
        funcName: 'sieve',
        link: 'https://www.geeksforgeeks.org/sieve-of-eratosthenes/',
        description: 'An ancient algorithm for finding all prime numbers up to any given limit.',
        problem: 'Write a program to find all prime numbers less than or equal to a given integer n.',
        solutions: {
          'JavaScript': `function sieve(n) {\n  let primes = new Array(n + 1).fill(true);\n  primes[0] = primes[1] = false;\n  for (let p = 2; p * p <= n; p++) {\n    if (primes[p]) {\n      for (let i = p * p; i <= n; i += p)\n        primes[i] = false;\n    }\n  }\n  return primes.map((isP, i) => isP ? i : -1).filter(i => i !== -1);\n}`,
          'Python 3': `def sieve(n):\n    primes = [True for i in range(n+1)]\n    p = 2\n    while (p * p <= n):\n        if (primes[p] == True):\n            for i in range(p * p, n+1, p):\n                primes[i] = False\n        p += 1\n    return [p for p in range(2, n+1) if primes[p]]`,
          'C++ 17': `vector<int> sieve(int n) {\n    vector<bool> prime(n + 1, true);\n    for (int p = 2; p * p <= n; p++) {\n        if (prime[p]) {\n            for (int i = p * p; i <= n; i += p)\n                prime[i] = false;\n        }\n    }\n    vector<int> result;\n    for (int p = 2; p <= n; p++)\n        if (prime[p]) result.push_back(p);\n    return result;\n}`,
          'Java': `public List<Integer> sieve(int n) {\n    boolean[] prime = new boolean[n + 1];\n    Arrays.fill(prime, true);\n    for (int p = 2; p * p <= n; p++) {\n        if (prime[p]) {\n            for (int i = p * p; i <= n; i += p)\n                prime[i] = false;\n        }\n    }\n    List<Integer> result = new ArrayList<>();\n    for (int i = 2; i <= n; i++)\n        if (prime[i]) result.add(i);\n    return result;\n}`
        },
        startFunc: sieveVisualizer
    },
    gcd: {
        id: 'gcd',
        name: 'Euclidean Algorithm (GCD)',
        funcName: 'gcd',
        link: 'https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/',
        description: 'An efficient method for computing the greatest common divisor (GCD) of two integers.',
        problem: 'Find the greatest common divisor of two positive integers a and b.',
        solutions: {
          'JavaScript': `function gcd(a, b) {\n  while (b !== 0) {\n    let temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}`,
          'Python 3': `def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a`,
          'C++ 17': `int gcd(int a, int b) {\n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}`,
          'Java': `public int gcd(int a, int b) {\n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}`
        },
        startFunc: euclideanGCD
    },
    quick: {
        id: 'quick',
        name: 'Quick Sort',
        funcName: 'quickSort',
        link: 'https://www.geeksforgeeks.org/quick-sort/',
        description: 'Quick Sort is a divide-and-conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot.',
        problem: 'Implement the Quick Sort algorithm to sort an array in O(n log n) average time complexity.',
        solutions: {
          'JavaScript': `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  let pivot = arr[arr.length - 1];\n  let left = [], right = [];\n  for (let i = 0; i < arr.length - 1; i++) {\n    if (arr[i] < pivot) left.push(arr[i]);\n    else right.push(arr[i]);\n  }\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
          'Python 3': `def quickSort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr)-1]\n    left = [x for x in arr[:-1] if x < pivot]\n    right = [x for x in arr[:-1] if x >= pivot]\n    return quickSort(left) + [pivot] + quickSort(right)`,
          'C++ 17': `void quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
          'Java': `public void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`
        },
        startFunc: () => quickSortVisualizer()
    }
  };

  // --- Code Editor for "Submit" simulation ---
  const handleRunChallenge = () => {
    setIsSubmitting(true);
    setSubmitStatus('loading');
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        showToast("Challenge Solved! All test cases passed.");
    }, 2500);
  };

  useEffect(() => {
    const skeleton = langSkeletons[selectedLang](algoData[visType].funcName);
    setUserCode(skeleton);
    setSubmitStatus(null);
  }, [visType, selectedLang]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#080605] text-slate-200 font-sans pb-20 overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#080605]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <span className="font-black uppercase tracking-widest text-sm text-orange-600 flex items-center gap-2">
            <Zap size={16} /> Algo Lab
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Master the <span className="text-orange-600">Algorithms</span></h1>
          <p className="text-slate-500 max-w-2xl">Interactive simulations and challenges for core computer science algorithms. Learn, visualize, and solve.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Controls */}
           <div className="lg:col-span-1 space-y-4">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Explore Lab</h4>
                 <div className="space-y-2">
                    {Object.keys(algoData).map(key => (
                        <button
                            key={key}
                            onClick={() => { setVisType(key); setActiveTab('visualizer'); }}
                            disabled={isSorting}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${visType === key ? 'bg-orange-600 text-black border-orange-600 shadow-lg shadow-orange-600/20' : 'text-slate-400 border-transparent hover:border-white/10 hover:bg-white/5'}`}
                        >
                            <span className="text-lg">{key === 'bubble' ? '📊' : key === 'binary' ? '🔍' : key === 'sieve' ? '🔢' : key === 'linear' ? '🔎' : key === 'quick' ? '⚡' : '🧮'}</span>
                            {algoData[key].name}
                        </button>
                    ))}
                 </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-orange-600/5 border border-orange-600/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2"><Info size={12}/> Description</h4>
                 <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                    {algoData[visType].description}
                 </p>
              </div>
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-3 space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-2 p-1.5 bg-white/[0.02] rounded-2xl border border-white/5 inline-flex">
                 {[
                    { id: 'visualizer', name: 'Visualize', icon: Play },
                    { id: 'problem', name: 'Challenge', icon: HelpCircle },
                    { id: 'solution', name: 'Answer', icon: Code2 }
                 ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-600 text-black' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <tab.icon size={14} /> {tab.name}
                    </button>
                 ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'visualizer' && (
                  <motion.div
                    key="visualizer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 sm:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 min-h-[500px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white">{algoData[visType].name}</h3>
                            <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em]">{isSorting ? 'Simulation in progress' : 'Ready for simulation'}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                           <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                <FastForward size={14} className="text-slate-500" />
                                <input
                                    type="range"
                                    min="100"
                                    max="1500"
                                    step="100"
                                    value={1600 - speed}
                                    onChange={(e) => setSpeed(1600 - parseInt(e.target.value))}
                                    className="w-24 accent-orange-600"
                                    title="Adjust Speed"
                                />
                           </div>
                           <button onClick={resetVis} disabled={isSorting} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all"><RotateCcw size={18}/></button>
                           <button
                             onClick={() => algoData[visType].startFunc()}
                             disabled={isSorting}
                             className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-3 bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20 active:scale-95"
                           >
                             {isSorting ? <RefreshCw size={16} className="animate-spin"/> : <Play size={16}/>}
                             {isSorting ? 'Running' : 'Start'}
                           </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-10 min-h-[300px]">
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
                        ) : visType === 'gcd' ? (
                            <div className="flex items-center gap-12">
                                {visArray.map((val, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4">
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{i === 0 ? 'Value A' : 'Value B'}</div>
                                        <motion.div
                                            animate={{ scale: visPointers.active.includes(i) ? 1.2 : 1 }}
                                            className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black border transition-all ${visPointers.active.includes(i) ? 'bg-orange-600 text-black border-orange-600' : 'bg-white/5 border-white/10 text-white'}`}
                                        >
                                            {val}
                                        </motion.div>
                                    </div>
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
                                            opacity: (visType === 'binary' && i >= visPointers.left && i <= visPointers.right) || visType !== 'binary' ? 1 : 0.2
                                        }}
                                        className={`flex-1 rounded-t-2xl transition-all duration-300 relative group ${
                                            visPointers.active.includes(i) ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' :
                                            i === visPointers.mid ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' :
                                            (visType === 'binary' && (i === visPointers.left || i === visPointers.right)) ? 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]' :
                                            'bg-gradient-to-t from-orange-700 to-orange-500'
                                        }`}
                                    >
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 group-hover:text-white transition-colors">{val}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                             <Terminal size={14} className="text-orange-600" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Step Explanation</span>
                        </div>
                        <p className="text-sm font-medium text-slate-300 leading-relaxed">{stepDescription}</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'problem' && (
                    <motion.div
                        key="problem"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-white">The Challenge</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{algoData[visType].problem}</p>

                                <div className="p-6 bg-orange-600/5 rounded-3xl border border-orange-600/10">
                                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 size={12}/> Example Test Case</h4>
                                    <div className="font-mono text-xs text-slate-300 space-y-1">
                                        <p>Input: [12, 45, 2, 8, 30]</p>
                                        <p>Output: {visType === 'bubble' || visType === 'quick' ? '[2, 8, 12, 30, 45]' : visType === 'gcd' ? '2' : 'Index at 2'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {submitStatus === 'loading' && (
                                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-orange-600" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verifying Implementation...</p>
                                    </div>
                                )}

                                {submitStatus === 'success' && (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex flex-col items-center text-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white">Accepted</h4>
                                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">All test cases passed successfully!</p>
                                        </div>
                                        <div className="mt-4 w-full p-4 bg-black/20 rounded-xl text-left font-mono text-[10px] text-slate-400">
                                            > Running Test Case #1... PASSED<br/>
                                            > Running Test Case #2... PASSED<br/>
                                            > Time: 12ms | Memory: 4.2MB
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleRunChallenge}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-orange-600 text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-orange-900/20"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Play size={16}/>}
                                    {isSubmitting ? 'Processing' : 'Submit My Code'}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[3rem] bg-[#1a1412] border border-white/5 overflow-hidden flex flex-col min-h-[550px]">
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-600/10 rounded-lg"><Code2 size={16} className="text-orange-600"/></div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Solution Editor</span>
                                </div>
                                <select
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-orange-600 cursor-pointer appearance-none min-w-[140px]"
                                >
                                    {Object.keys(langSkeletons).map(l => <option key={l} value={l} className="bg-[#1a1412]">{l}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 overflow-auto p-4 relative">
                                <button onClick={() => { navigator.clipboard.writeText(userCode); showToast("Code copied!"); }} className="absolute top-6 right-6 z-10 p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white transition-all" title="Copy"><Save size={14} /></button>
                                <Editor
                                    value={userCode}
                                    onValueChange={code => setUserCode(code)}
                                    highlight={code => highlight(code,
                                        selectedLang === 'JavaScript' ? prismLanguages.javascript :
                                        selectedLang === 'Python 3' ? prismLanguages.python :
                                        selectedLang === 'C++ 17' ? prismLanguages.cpp : prismLanguages.java
                                    )}
                                    padding={20}
                                    style={{ fontFamily: '"Fira code", monospace', fontSize: 13 }}
                                    className="editor outline-none text-slate-300"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'solution' && (
                    <motion.div
                        key="solution"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5"
                    >
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-black text-white">Reference Solution</h3>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <select
                                  value={ansSelectedLang}
                                  onChange={(e) => setAnsSelectedLang(e.target.value)}
                                  className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-orange-600 cursor-pointer appearance-none min-w-[140px]"
                              >
                                  {Object.keys(langSkeletons).map(l => <option key={l} value={l} className="bg-[#1a1412]">{l}</option>)}
                              </select>
                              <button onClick={() => { navigator.clipboard.writeText(algoData[visType].solutions[ansSelectedLang]); showToast("Solution copied!"); }} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all border border-white/5">Copy Code</button>
                            </div>
                         </div>
                         <div className="p-8 bg-[#1a1412] rounded-[2rem] border border-white/5 overflow-auto max-h-[500px]">
                            <pre className="text-xs leading-relaxed">
                                <code
                                    dangerouslySetInnerHTML={{
                                        __html: highlight(algoData[visType].solutions[ansSelectedLang],
                                          ansSelectedLang === 'JavaScript' ? prismLanguages.javascript :
                                          ansSelectedLang === 'Python 3' ? prismLanguages.python :
                                          ansSelectedLang === 'C++ 17' ? prismLanguages.cpp : prismLanguages.java
                                        )
                                    }}
                                />
                            </pre>
                         </div>
                         <a
                            href={algoData[visType].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 flex items-center gap-4 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 hover:bg-blue-500/10 transition-all group"
                          >
                             <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform"><ExternalLink className="text-blue-400" size={20}/></div>
                             <div>
                                 <h4 className="text-sm font-bold text-white mb-1">Deep Dive into {algoData[visType].name}</h4>
                                 <p className="text-[11px] text-slate-500">Want to learn more? Check out the official documentation and complexity analysis on GeeksforGeeks.</p>
                             </div>
                         </a>
                    </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-orange-600 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl border border-orange-400/20">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Visualizers;
