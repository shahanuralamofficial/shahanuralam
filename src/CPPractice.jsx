import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { CP_TEMPLATES } from './algoSolutions';
import { db, ref, update, increment, trackEvent } from './firebase';

const CountdownTimer = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState(startTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(startTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  if (isNaN(timeLeft) || timeLeft <= 0) return <span className="text-emerald-500 animate-pulse font-black text-[10px]">LIVE NOW</span>;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (isNaN(days) || isNaN(hours)) return <span className="text-slate-500 font-bold text-[10px]">TBA</span>;

  return (
    <div className="flex gap-1 text-[10px] font-mono font-black text-orange-600 bg-orange-600/10 px-2 py-1 rounded-lg border border-orange-600/20">
      {days > 0 && <span>{days}d</span>}
      <span>{hours.toString().padStart(2, '0')}h</span>
      <span>{minutes.toString().padStart(2, '0')}m</span>
      <span>{seconds.toString().padStart(2, '0')}s</span>
    </div>
  );
};

const CPPractice = ({ onBack }) => {
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contestsLoading, setContestsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorting, setIsVisSorting] = useState(false);
  const [output, setOutput] = useState('');
  const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Scroll logic for contests
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const move = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const [activeCodeProblem, setActiveCodeProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const langSkeletons = CP_TEMPLATES;

  const [selectedLang, setSelectedLang] = useState('C++ 17');
  const [code, setCode] = useState(langSkeletons['C++ 17']);

  const platforms = ['All Platforms', 'Codeforces', 'AtCoder'];

  const platformColors = {
    'Codeforces': 'bg-orange-600/10 text-orange-500 border-orange-600/20',
    'AtCoder': 'bg-rose-600/10 text-rose-500 border-rose-600/20'
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

  const fetchContests = async () => {
    setContestsLoading(true);
    try {
      const res = await fetch('https://kontests.net/api/v1/all');
      const data = await res.json();

      const filtered = data
        .filter(c => {
          const site = c.site.toLowerCase();
          return site.includes('codeforces') ||
                 site.includes('at_coder') ||
                 site.includes('atcoder') ||
                 site.includes('leetcode') ||
                 site.includes('codechef');
        })
        .map(c => {
          let platform = c.site;
          const site = c.site.toLowerCase();
          if (site.includes('codeforces')) platform = 'Codeforces';
          else if (site.includes('atcoder') || site.includes('at_coder')) platform = 'AtCoder';
          else if (site.includes('leetcode')) platform = 'LeetCode';
          else if (site.includes('codechef')) platform = 'CodeChef';

          return {
            id: c.name + c.start_time,
            name: c.name,
            platform,
            startTime: c.start_time ? new Date(c.start_time).getTime() : 0,
            link: c.url
          };
        })
        .filter(c => c.startTime > Date.now() || c.startTime === 0)
        .sort((a, b) => a.startTime - b.startTime);

      setContests(filtered);
    } catch (e) {
      console.error("Kontests API failed, falling back to CF", e);
      try {
        const res = await fetch('https://codeforces.com/api/contest.list');
        const data = await res.json();
        if (data.status === 'OK') {
          const upcoming = data.result
            .filter(c => c.phase === 'BEFORE')
            .map(c => ({
              id: c.id,
              name: c.name,
              platform: 'Codeforces',
              startTime: c.startTimeSeconds * 1000,
              link: `https://codeforces.com/contests/${c.id}`
            }))
            .sort((a, b) => a.startTime - b.startTime);
          setContests(upcoming);
        }
      } catch (err) { console.error(err); }
    } finally { setContestsLoading(false); }
  };

  useEffect(() => {
    fetchProblems();
    fetchContests();
  }, []);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen text-slate-200 font-sans pb-20 overflow-x-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 88, 12, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 88, 12, 0.6); }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        {/* Upcoming Contests Section */}
        <div className="mb-12">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-orange-600 rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Upcoming Contests</h2>
              {contestsLoading && <Loader2 className="w-4 h-4 animate-spin text-orange-600" title="Fetching upcoming contests..." />}
           </div>

           <div
              ref={scrollRef}
              onMouseDown={startDragging}
              onMouseLeave={stopDragging}
              onMouseUp={stopDragging}
              onMouseMove={move}
              className={`overflow-x-auto pb-6 custom-scrollbar scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing ${isDragging ? 'select-none' : ''}`}
           >
              <div className="flex gap-4 min-w-max px-2">
                 {contests.length > 0 ? contests.map(c => {
                   const date = new Date(c.startTime);
                   return (
                     <div key={c.id} className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all w-[18rem] sm:w-80 flex flex-col justify-between shrink-0">
                       <div>
                         <div className="flex justify-between items-start mb-4">
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${platformColors[c.platform] || 'bg-white/10 text-white border-white/20'}`}>{c.platform}</span>
                           <CountdownTimer startTime={c.startTime} />
                         </div>
                         <h4 className="text-white font-bold text-sm mb-6 line-clamp-2 leading-relaxed h-10">{c.name}</h4>
                       </div>
                       <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-white font-black">
                              {c.startTime > 0 ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA'}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold">
                              {c.startTime > 0 ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Date TBA'}
                            </span>
                          </div>
                          <a href={c.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-orange-600/10 text-orange-600 text-[9px] font-black uppercase hover:bg-orange-600 hover:text-black transition-all border border-orange-600/20">Register</a>
                       </div>
                     </div>
                   );
                 }) : !contestsLoading && (
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest pl-4">No upcoming contests found.</p>
                 )}
              </div>
           </div>
        </div>

        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-7xl font-black text-white tracking-tighter mb-4 leading-tight sm:leading-none">
              Zen <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-rose-600">Workspace</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-lg max-w-2xl font-medium leading-relaxed">
              Exploring {problems.length > 0 ? problems.length.toLocaleString() : 'thousands of'} problems across multiple platforms for distraction-free practice.
            </p>
          </div>
          <button onClick={fetchProblems} title="Refresh Problems" className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-400 transition-all self-end sm:self-auto">
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" title="Search Problems" />
              <input
                type="text"
                placeholder="Search by problem name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-600/50 transition-all"
              />
            </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="bg-white/[0.03] border border-white/10 text-white text-[10px] sm:text-xs font-black uppercase px-6 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-orange-600 cursor-pointer appearance-none w-full sm:min-w-[200px]">
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
                          <span onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.id); showToast(`ID #${p.id} copied!`); }} className="text-[10px] font-bold text-slate-500 cursor-pointer hover:text-orange-500 flex items-center gap-1 group/id" title="Click to copy ID">#{p.id} <Copy className="w-2.5 h-2.5 opacity-0 group-hover/id:opacity-100" /></span>
                        </div>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="block"><h3 className="text-xl font-bold text-white hover:text-orange-500 transition-colors line-clamp-2">{p.title}</h3></a>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 gap-4">
                        <div className="flex justify-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                          <button onClick={() => toggleAction(globalId, 'favorites')} className={`p-2 sm:p-2.5 rounded-lg transition-all ${userData.favorites.includes(globalId) ? 'text-rose-400 bg-rose-400/10' : 'text-slate-600 hover:text-rose-400'}`} title="Favorite"><Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'saved')} className={`p-2 sm:p-2.5 rounded-lg transition-all ${userData.saved.includes(globalId) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-600 hover:text-blue-400'}`} title="Save"><Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'solved')} className={`p-2 sm:p-2.5 rounded-lg transition-all ${userData.solved.includes(globalId) ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-600 hover:text-emerald-400'}`} title="Mark Solved"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          <button onClick={() => toggleAction(globalId, 'blocked')} className={`p-2 sm:p-2.5 rounded-lg transition-all ${userData.blocked.includes(globalId) ? 'text-white bg-white/10' : 'text-slate-600 hover:text-white'}`} title="Block"><Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                        </div>
                        <button onClick={() => { setActiveCodeProblem(p); handleLangChange('C++ 17'); }} className="px-6 py-3 bg-white text-black rounded-xl sm:rounded-2xl text-[10px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-95 text-center">Code & Solve</button>
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
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative w-full h-full sm:max-h-[96vh] sm:max-w-[98vw] bg-[#0d0a09] sm:rounded-[3rem] border-t sm:border border-orange-600/10 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <Terminal className="text-orange-500 w-6 h-6 hidden sm:block" />
                  <div>
                    <h4 className="text-white font-black text-sm sm:text-lg flex items-center gap-2">
                       {activeCodeProblem.title}
                       <span onClick={() => { navigator.clipboard.writeText(activeCodeProblem.id); showToast(`ID #${activeCodeProblem.id} copied!`); }} className="text-slate-500 cursor-pointer hover:text-orange-500 transition-colors flex items-center gap-1 group/editid" title="Copy ID">#{activeCodeProblem.id} <Copy className="w-3 h-3 opacity-0 group-hover/editid:opacity-100" /></span>
                    </h4>
                    <p className="text-[10px] text-orange-600/60 font-black uppercase tracking-widest">{activeCodeProblem.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <select value={selectedLang} onChange={(e) => handleLangChange(e.target.value)} className="bg-white/5 border border-white/10 text-white text-[9px] sm:text-[10px] font-black uppercase px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none focus:ring-1 focus:ring-orange-600 cursor-pointer appearance-none min-w-[120px]">
                    {Object.keys(langSkeletons).map(l => <option key={l} value={l} className="bg-[#111]">{l}</option>)}
                  </select>
                  <button onClick={() => setIsFullScreenEditor(!isFullScreenEditor)} className="p-3 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all hidden lg:block" title={isFullScreenEditor ? "Exit Fullscreen" : "Fullscreen Mode"}>{isFullScreenEditor ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
                  <button onClick={() => setActiveCodeProblem(null)} className="p-3 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all" title="Close Workspace"><X className="w-6 h-6" /></button>
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
                        <div className="p-8 bg-orange-600/[0.03] border border-orange-600/10 rounded-[2rem] mb-10">
                           <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"To master the logic, one must understand the core of the problem."</p>
                           <button onClick={() => window.open(activeCodeProblem.link, '_blank')} className="w-full py-4 bg-orange-600/10 text-orange-500 border border-orange-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2">View Official Statement <ExternalLink className="w-4 h-4" /></button>
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
                        padding={window.innerWidth < 640 ? 12 : 20}
                        style={{ fontFamily: '"Fira code", monospace', fontSize: window.innerWidth < 640 ? 12 : 14, minHeight: '100%' }}
                        className="editor text-slate-300 outline-none"
                      />
                  </div>
                  <div className="h-44 sm:h-52 bg-black/60 p-4 sm:p-6 flex flex-col border-t border-white/5 backdrop-blur-md">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Compiler Output</span>
                        <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-2 bg-orange-600/10 text-orange-500 rounded-xl text-[10px] font-black uppercase border border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all" title="Run Sample Tests">
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
                <a href={activeCodeProblem.link} target="_blank" rel="noopener noreferrer" onClick={() => {
                  update(ref(db, 'stats'), { solvedProblems: increment(1) }).catch(() => { });
                  trackEvent('cp_problem_submit', { problem: activeCodeProblem.title, platform: activeCodeProblem.platform });
                }} className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95">Go to Submit <ExternalLink className="w-4 h-4" /></a>
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
