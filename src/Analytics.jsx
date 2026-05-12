import React, { useState } from 'react';
import { BarChart2, Users, MousePointer2, FileText, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = ({ onBack }) => {
  const [stats] = useState({
    visits: 642,
    cvViews: 128,
    projectClicks: 310,
    solvedProblems: 142
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#0c0a09]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <span className="font-black uppercase tracking-widest text-sm text-amber-500">Live Analytics</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Portfolio <span className="text-amber-500">Performance</span></h1>
          <p className="text-stone-500">Real-time engagement metrics and visitor statistics.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Visits', value: stats.visits, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'CV Views', value: stats.cvViews, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Project Interactions', value: stats.projectClicks, icon: MousePointer2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Solved in Zen', value: stats.solvedProblems, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black text-white">{stat.value}</h4>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-[3rem] bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 h-80 flex flex-col justify-end">
           <div className="flex items-end gap-2 h-full">
              {[40, 70, 45, 90, 65, 80, 50, 85, 30, 95, 60, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-amber-500/20 rounded-t-lg hover:bg-amber-500 transition-all cursor-help relative group" style={{ height: `${h}%` }}>
                   <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Day {i+1}: {h*10} views</span>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-stone-600 px-2">
              <span>Last 12 Days Activity</span>
              <span>Growth: +24%</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
