import React, { useState, useEffect } from 'react';
import { BarChart2, Users, MousePointer2, FileText, ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, ref, onValue } from './firebase';

const Analytics = ({ onBack }) => {
  const [stats, setStats] = useState({
    visits: 0,
    cvViews: 0,
    projectClicks: 0,
    solvedProblems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statsRef = ref(db, 'stats');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats({
          visits: data.visits || 0,
          cvViews: data.cvViews || 0,
          projectClicks: data.projectClicks || 0,
          solvedProblems: data.solvedProblems || 0
        });
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#0c0a09]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-orange-600 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5" title="Go back to Portfolio">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <div className="flex items-center gap-2">
           {loading && <Loader2 size={14} className="animate-spin text-orange-600" title="Syncing with Firebase..." />}
           <span className="font-black uppercase tracking-widest text-sm text-orange-600">Live Analytics</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Portfolio <span className="text-orange-600">Performance</span></h1>
          <p className="text-stone-500">Real-time engagement metrics powered by Firebase.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Visits', value: stats.visits, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Unique Visitors' },
            { label: 'CV Views', value: stats.cvViews, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-600/10', title: 'Curriculum Vitae Access' },
            { label: 'Project Clicks', value: stats.projectClicks, icon: MousePointer2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Interactive Elements Engagement' },
            { label: 'Solved in Zen', value: stats.solvedProblems, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Platform Achievement' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} title={stat.title} />
              </div>
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black text-white">
                {loading ? "..." : stat.value.toLocaleString()}
              </h4>
            </motion.div>
          ))}
        </div>

        {/* Growth Visualizer Placeholder */}
        <div className="mt-12 p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-orange-600/5 to-orange-500/5 border border-orange-600/10 h-64 sm:h-80 flex flex-col justify-end">
           <div className="flex items-end gap-1 sm:gap-2 h-full">
              {[40, 70, 45, 90, 65, 80, 50, 85, 30, 95, 60, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-orange-600/20 rounded-t-sm sm:rounded-t-lg hover:bg-orange-600 transition-all cursor-help relative group" style={{ height: `${h}%` }}>
                </div>
              ))}
           </div>
           <div className="flex flex-col sm:flex-row justify-between mt-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-stone-600 px-2 gap-2">
              <span>Traffic Trends (Simulation)</span>
              <span>Firebase Real-time Connection Active</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
