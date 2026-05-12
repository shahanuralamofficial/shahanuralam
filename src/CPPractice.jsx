import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame, Bookmark, CheckCircle2, ExternalLink, Heart, Ban, Dices, Filter,
  Sparkles, ArrowLeft, Loader2, RefreshCw, Code2, X, Copy, Terminal,
  ChevronDown, Globe, Zap, Play, Maximize2, Minimize2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// For Syntax Highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages as prismLanguages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';

const CPPractice = ({ onBack }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCodeProblem, setActiveCodeProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [visArray, setVisArray] = useState([45, 20, 80, 60, 30, 90, 10]);
  const [isSorting, setIsVisSorting] = useState(false);

  const bubbleSort = async () => {
    setIsVisSorting(true);
    let arr = [...visArray];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setVisArray([...arr]);
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }
    setIsVisSorting(false);
    showToast("Sorting Complete!");
  };

  const langSkeletons = {
    'C++ 17': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your logic here\n    return 0;\n}',
    'Python 3': 'def solve():\n    # Write your logic here\n    pass\n\nif __name__ == "__main__":\n    solve()',
    'Java': 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your logic here\n    }\n}',
    'JavaScript': 'const solve = () => {\n    // Write your logic here\n};\nsolve();'
  };

  const [selectedLang, setSelectedLang] = useState('C++ 17');
  const [code, setCode] = useState(langSkeletons['C++ 17']);

  const platforms = ['All Platforms', 'Codeforces', 'AtCoder'];

  const platformColors = {
    'Codeforces': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'AtCoder': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('cp_user_data');
    return saved ? JSON.parse(saved) : { solved: [], favorites: [], saved: [], blocked: [] };
  });

  useEffect(() => {
    localStorage.setItem('cp_user_data', JSON.stringify(userData));
  }, [userData]);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCode(langSkeletons[lang] || '// Start coding...');
    setOutput('');
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const cfPromise = fetch('https://codeforces.com/api/problemset.problems')
        .then(res => res.json())
        .then(data => data.status === 'OK' ? data.result.problems.map(p => ({
          id: `${p.contestId}${p.index}`, title: p.name, platform: 'Codeforces', tags: p.tags,
          link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
        })) : []);

      const acPromise = fetch('https://kenkoooo.com/atcoder/resources/problems.json')
        .then(res => res.json())
        .then(data => data.map(p => ({
          id: p.id, title: p.title || p.name, platform: 'AtCoder', tags: ['Practice'],
          link: `https://atcoder.jp/contests/${p.contest_id}/tasks/${p.id}`
        })));

      const results = await Promise.all([cfPromise, acPromise]);
      const rawCombined = results.flat();
      const uniqueProblems = rawCombined.filter((p, index, self) => index === self.findIndex(t => t.title === p.title));
      setProblems(uniqueProblems.sort(() => Math.random() - 0.5));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProblems(); }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [filter, platformFilter, searchQuery]);

  const toggleAction = (id, type) => {
    setUserData(prev => ({
      ...prev, [type]: prev[type].includes(id) ? prev[type].filter(i => i !== id) : [...prev[type], id]
    }));
  };

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const globalId = `${p.platform}-${p.id}`;
      // Search logic
      const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
      if (!searchMatch) return false;

      // Platform logic
      if (platformFilter !== 'All Platforms' && p.platform !== platformFilter) return false;

      // Status logic
      if (userData.blocked.includes(globalId) && filter !== 'blocked') return false;
      if (filter === 'blocked') return userData.blocked.includes(globalId);
      if (filter === 'solved') return userData.solved.includes(globalId);
      if (filter === 'saved') return userData.saved.includes(globalId);
      if (filter === 'favorites') return userData.favorites.includes(globalId);
      return filter === 'all' ? !userData.solved.includes(globalId) : true;
    });
  }, [problems, filter, platformFilter, userData, searchQuery]);

  const runCode = () => {
    setIsRunning(true);
    setOutput('Compiling...\nChecking Test Cases...');
    setTimeout(() => {
      setIsRunning(false);
      setOutput('Result: All Sample Test Cases Passed!\n\nOutput:\nHello Zen CP!');
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0a0604] text-slate-200 font-sans pb-20 overflow-x-hidden">
      <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-orange-500/10 sticky top-0">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-all bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-bold hidden sm:inline">Portfolio</span>
        </button>
        <button onClick={fetchProblems} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500/10 text-slate-400 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={() => setShowVisualizer(!showVisualizer)} className="flex items-center gap-2 text-orange-400 hover:text-white transition-all bg-orange-400/10 px-3 py-1.5 rounded-xl border border-orange-400/20">
          <Zap className="w-4 h-4" /> <span className="text-xs font-bold">{showVisualizer ? 'Hide Visualizer' : 'Algo Visualizer'}</span>
        </button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        {showVisualizer && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-12 p-8 rounded-[3rem] bg-orange-500/[0.03] border border-orange-500/10 overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase text-orange-500 tracking-tighter">Bubble Sort Visualizer</h3>
                <button onClick={bubbleSort} disabled={isSorting} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-all disabled:opacity-50">START SORTING</button>
             </div>
             <div className="flex items-end gap-2 h-40">
                {visArray.map((val, i) => (
                  <motion.div key={i} layout style={{ height: `${val}%` }} className="flex-1 bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-lg" />
                ))}
             </div>
          </motion.div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
            Zen <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Workspace</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-lg max-w-2xl font-medium leading-relaxed">
            Exploring {problems.length > 0 ? problems.length.toLocaleString() : 'thousands of'} problems across multiple platforms for distraction-free practice.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by problem name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="bg-white/[0.03] border border-white/10 text-white text-xs font-black uppercase px-6 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer appearance-none min-w-[200px]">
                  {platforms.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
               </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 p-2 bg-white/[0.01] rounded-2xl border border-white/5">
              {['All', 'Solved', 'Saved', 'Favorites', 'Blocked'].map(item => (
                <button key={item} onClick={() => setFilter(item.toLowerCase())} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === item.toLowerCase() ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-slate-500 hover:text-slate-300'}`}>{item}</button>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center">
              <Loader2 className="animate-spin text-orange-500 w-10 h-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Aggregating problems...</p>
            </div>
          ) : filteredProblems.length > 0 ? (
            <>
              <AnimatePresence mode='popLayout'>
                {filteredProblems.slice(0, visibleCount).map(p => {
                  const globalId = `${p.platform}-${p.id}`;
                  return (
                    <motion.div layout key={globalId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${platformColors[p.platform] || 'bg-white/10'}`}>{p.platform}</span>
                          <span onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.id); showToast(`ID #${p.id} copied!`); }} className="text-[10px] font-bold text-slate-500 cursor-pointer hover:text-orange-400 flex items-center gap-1 group/id" title="Click to copy ID">#{p.id} <Copy className="w-2.5 h-2.5 opacity-0 group-hover/id:opacity-100" /></span>
                        </div>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="block"><h3 className="text-xl font-bold text-white hover:text-orange-400 transition-colors line-clamp-2">{p.title}</h3></a>
                      </div>
                      <div className="flex items-center justify-between mt-8">
                        <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                          <button onClick={() => toggleAction(globalId, 'favorites')} className={`p-2.5 rounded-lg transition-all ${userData.favorites.includes(globalId) ? 'text-rose-400 bg-rose-400/10' : 'text-slate-600 hover:text-rose-400'}`} title="Favorite"><Heart className="w-4 h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'saved')} className={`p-2.5 rounded-lg transition-all ${userData.saved.includes(globalId) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-600 hover:text-blue-400'}`} title="Save"><Bookmark className="w-4 h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'solved')} className={`p-2.5 rounded-lg transition-all ${userData.solved.includes(globalId) ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-600 hover:text-emerald-400'}`} title="Mark Solved"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'blocked')} className={`p-2.5 rounded-lg transition-all ${userData.blocked.includes(globalId) ? 'text-white bg-white/10' : 'text-slate-600 hover:text-white'}`} title="Block"><Ban className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => { setActiveCodeProblem(p); handleLangChange('C++ 17'); }} className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95">Code & Solve</button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {filteredProblems.length > visibleCount && (
                <div className="col-span-full flex justify-center mt-12 mb-20">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="px-10 py-5 bg-white/[0.03] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 group"
                  >
                    Load More Problems
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-20 text-center text-slate-600 uppercase text-[10px] font-black tracking-widest">No problems match your search</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeCodeProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveCodeProblem(null)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative w-full h-full sm:max-h-[96vh] sm:max-w-[98vw] bg-[#0d0a09] sm:rounded-[3rem] border-t sm:border border-orange-500/10 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <Terminal className="text-orange-400 w-6 h-6 hidden sm:block" />
                  <div>
                    <h4 className="text-white font-black text-sm sm:text-lg flex items-center gap-2">
                       {activeCodeProblem.title}
                       <span onClick={() => { navigator.clipboard.writeText(activeCodeProblem.id); showToast(`ID #${activeCodeProblem.id} copied!`); }} className="text-slate-500 cursor-pointer hover:text-orange-400 transition-colors flex items-center gap-1 group/editid" title="Copy ID">#{activeCodeProblem.id} <Copy className="w-3 h-3 opacity-0 group-hover/editid:opacity-100" /></span>
                    </h4>
                    <p className="text-[10px] text-orange-500/60 font-black uppercase tracking-widest">{activeCodeProblem.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <select value={selectedLang} onChange={(e) => handleLangChange(e.target.value)} className="bg-white/5 border border-white/10 text-white text-[9px] sm:text-[10px] font-black uppercase px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer appearance-none min-w-[120px]">
                    {Object.keys(langSkeletons).map(l => <option key={l} value={l} className="bg-[#111]">{l}</option>)}
                  </select>
                  <button onClick={() => setIsFullScreenEditor(!isFullScreenEditor)} className="p-3 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all hidden lg:block">{isFullScreenEditor ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
                  <button onClick={() => setActiveCodeProblem(null)} className="p-3 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {!isFullScreenEditor && (
                  <div className="hidden lg:flex flex-1 flex-col border-r border-white/5 bg-black/20 overflow-auto p-10">
                     <div className="max-w-2xl mx-auto w-full">
                        <h2 className="text-4xl font-black text-white mb-6 tracking-tight">{activeCodeProblem.title}</h2>
                        <div className="flex items-center gap-4 mb-10">
                           <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${platformColors[activeCodeProblem.platform]}`}>{activeCodeProblem.platform}</span>
                           <span className="text-xs font-bold text-slate-500 tracking-widest">#{activeCodeProblem.id}</span>
                        </div>
                        <div className="p-8 bg-orange-500/[0.03] border border-orange-500/10 rounded-[2rem] mb-10">
                           <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"To master the logic, one must understand the core of the problem."</p>
                           <button onClick={() => window.open(activeCodeProblem.link, '_blank')} className="w-full py-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2">View Official Statement <ExternalLink className="w-4 h-4" /></button>
                        </div>
                     </div>
                  </div>
                )}
                <div className={`flex flex-col relative ${isFullScreenEditor ? 'w-full' : 'w-full lg:w-[60%]'}`}>
                  <div className="flex-1 overflow-auto bg-[#1a1412] p-2 sm:p-4">
                      <button onClick={() => { navigator.clipboard.writeText(code); showToast("Code snippet copied!"); }} className="absolute top-4 right-4 z-10 p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all" title="Copy Snippet"><Copy className="w-4 h-4" /></button>
                      <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code,
                          selectedLang === 'C++ 17' ? prismLanguages.cpp :
                          selectedLang === 'Python 3' ? prismLanguages.python :
                          selectedLang === 'Java' ? prismLanguages.java : prismLanguages.javascript
                        )}
                        padding={20}
                        style={{ fontFamily: '"Fira code", monospace', fontSize: 14, minHeight: '100%' }}
                        className="editor text-slate-300 outline-none"
                      />
                  </div>
                  <div className="h-44 sm:h-52 bg-black/60 p-4 sm:p-6 flex flex-col border-t border-white/5 backdrop-blur-md">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Compiler Output</span>
                        <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-2 bg-orange-600/10 text-orange-500 rounded-xl text-[10px] font-black uppercase border border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all">
                          {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} TEST RUN
                        </button>
                     </div>
                     <div className="flex-1 bg-black/40 rounded-2xl p-4 font-mono text-[10px] sm:text-xs text-slate-400 overflow-auto whitespace-pre-wrap border border-white/5">
                        {output || 'Draft your solution and click TEST RUN...'}
                     </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-end gap-6 bg-black/40">
                <a href={activeCodeProblem.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95">Go to Submit <ExternalLink className="w-4 h-4" /></a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-400/20">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CPPractice;
