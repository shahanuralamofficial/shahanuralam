import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase,
  Code2, Award, Download, ArrowLeft, Plus, Trash2, Loader2,
  Save, Sparkles, Layout, Type, Palette,
  Eye, Edit, Languages, Trophy, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBuilder = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('content'); // content, templates, style
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [data, setData] = useState({
    personal: { name: 'Shahanur Alam', email: 'shahanur.dev@gmail.com', phone: '+8801518939114', location: 'Rajshahi, BD', linkedin: 'linkedin.com/in/shahanur', github: 'github.com/shahanuralam', role: 'Full Stack Developer' },
    summary: 'Motivated developer with expertise in Java, Flutter, and React. Passionate about building user-centric applications.',
    education: [{ school: 'Varendra University', degree: 'B.Sc. in CSE', date: '2022 - 2026' }],
    experience: [{ company: 'Freelance', position: 'Mobile App Developer', date: '2023 - Present', desc: 'Developed localized apps using Flutter and Java.' }],
    skills: 'Java, Flutter, React, Firebase, Git, MySQL',
    projects: [{ title: 'Zen Workspace', desc: 'Competitive programming platform for developers.' }],
    certifications: [{ title: 'Flutter Advanced', provider: 'Udemy' }],
    languages: 'English, Bengali',
    awards: 'University Innovation Hub Winner'
  });

  const [theme, setTheme] = useState({
    primary: '#f59e0b', // amber-500
    font: 'sans-serif',
    spacing: 'compact'
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const addItem = (field) => {
    const templates = {
      education: { school: '', degree: '', date: '' },
      experience: { company: '', position: '', date: '', desc: '' },
      projects: { title: '', desc: '' },
      certifications: { title: '', provider: '' }
    };
    setData(prev => ({ ...prev, [field]: [...prev[field], templates[field]] }));
  };

  const removeItem = (field, index) => {
    setData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleItemChange = (field, index, e) => {
    const { name, value } = e.target;
    const newItems = [...data[field]];
    newItems[index][name] = value;
    setData(prev => ({ ...prev, [field]: newItems }));
  };

  const generateAIContent = (field) => {
    setAiLoading(true);
    setTimeout(() => {
      if (field === 'summary') {
        setData(prev => ({ ...prev, summary: "Highly skilled Software Engineer with a focus on mobile and web technologies. Expert in Flutter and Java, with a proven track record of delivering high-performance applications." }));
      }
      setAiLoading(false);
    }, 1500);
  };

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Premium PDF Logic
    doc.setFillColor(theme.primary);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(data.personal.name.toUpperCase(), 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`${data.personal.role} | ${data.personal.location} | ${data.personal.phone}`, 105, 30, { align: 'center' });

    y = 50;
    doc.setTextColor(0, 0, 0);

    const drawSection = (title, content) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), margin, y);
      y += 2;
      doc.setDrawColor(theme.primary);
      doc.line(margin, y, margin + 30, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      if (typeof content === 'string') {
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, margin, y);
        y += (splitText.length * 5) + 10;
      } else {
          content();
      }
    };

    if (data.summary) drawSection('Summary', data.summary);

    drawSection('Education', () => {
      data.education.forEach(edu => {
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, margin, y);
        doc.setFont("helvetica", "italic");
        doc.text(edu.date, 190, y, { align: 'right' });
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.text(edu.school, margin, y);
        y += 10;
      });
    });

    drawSection('Experience', () => {
      data.experience.forEach(exp => {
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, margin, y);
        doc.setFont("helvetica", "italic");
        doc.text(exp.date, 190, y, { align: 'right' });
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.text(exp.company, margin, y);
        y += 5;
        const splitDesc = doc.splitTextToSize(exp.desc, 170);
        doc.text(splitDesc, margin, y);
        y += (splitDesc.length * 5) + 10;
      });
    });

    doc.save(`${data.personal.name}_Resume.pdf`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0807] text-stone-200 flex flex-col font-sans overflow-hidden h-screen">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 bg-[#120f0e]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <Layout className="text-amber-500" size={20} />
            <h1 className="font-black uppercase tracking-widest text-sm">Zen AI Resume</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold"
          >
            {showPreviewMobile ? <Edit size={14}/> : <Eye size={14}/>} {showPreviewMobile ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={generatePDF}
            disabled={loading}
            className="bg-amber-500 text-stone-950 px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/20"
          >
            {loading ? <Loader2 size={14} className="animate-spin"/> : <Download size={14} />} Export
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-16 border-r border-white/5 bg-[#120f0e] flex flex-col items-center py-6 gap-6 shrink-0">
          {[
            { id: 'content', icon: Edit },
            { id: 'templates', icon: Layout },
            { id: 'style', icon: Palette }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(tab.id)}
              className={`p-3 rounded-xl transition-all ${activeSidebarTab === tab.id ? 'bg-amber-500 text-stone-950 shadow-lg' : 'text-stone-500 hover:text-stone-200 hover:bg-white/5'}`}
            >
              <tab.icon size={20} />
            </button>
          ))}
        </aside>

        {/* Editor Area */}
        <main className={`flex-1 flex flex-col lg:flex-row overflow-hidden ${showPreviewMobile ? 'hidden lg:flex' : 'flex'}`}>
          <div className="w-full lg:w-[450px] bg-[#0a0807] border-r border-white/5 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-10">

              {activeSidebarTab === 'content' && (
                <AnimatePresence mode="wait">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 pb-20">

                    {/* Personal Info */}
                    <section className="space-y-6">
                      <div className="flex justify-between items-end">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Personal Info</h3>
                        <span className="text-[10px] font-black text-amber-500/60 tracking-widest">SECTION 1</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-stone-600 pl-1">Full Name</label>
                          <input type="text" name="name" value={data.personal.name} onChange={handlePersonalChange} className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-stone-600 pl-1">Job Role</label>
                          <input type="text" name="role" value={data.personal.role} onChange={handlePersonalChange} className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email" className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-sm" />
                          <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone" className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-sm" />
                        </div>
                      </div>
                    </section>

                    {/* AI Summary */}
                    <section className="space-y-6 p-6 rounded-3xl bg-amber-500/[0.02] border border-amber-500/10">
                      <div className="flex justify-between items-center">
                         <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest">AI Summary</h3>
                         <button
                           onClick={() => generateAIContent('summary')}
                           disabled={aiLoading}
                           className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black hover:bg-amber-500 hover:text-stone-950 transition-all"
                         >
                           {aiLoading ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} GENERATE
                         </button>
                      </div>
                      <textarea
                        value={data.summary}
                        onChange={(e) => setData({...data, summary: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm h-32 resize-none outline-none focus:border-amber-500 transition-all"
                      />
                    </section>

                    {/* Education - Repeater */}
                    <section className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Education</h3>
                        <button onClick={() => addItem('education')} className="p-2 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-stone-950 transition-all"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-4">
                        {data.education.map((item, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
                            <button onClick={() => removeItem('education', i)} className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"><Trash2 size={12}/></button>
                            <div className="grid gap-3">
                              <input placeholder="Degree" value={item.degree} name="degree" onChange={(e) => handleItemChange('education', i, e)} className="bg-transparent font-bold border-b border-white/5 outline-none focus:border-amber-500 py-1" />
                              <input placeholder="School" value={item.school} name="school" onChange={(e) => handleItemChange('education', i, e)} className="bg-transparent text-sm border-b border-white/5 outline-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                  </motion.div>
                </AnimatePresence>
              )}

              {activeSidebarTab === 'templates' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-xl font-black text-white">Select Template</h3>
                  <div className="grid grid-cols-2 gap-4">
                     {[1,2,3,4].map(t => (
                       <div key={t} className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${t === 1 ? 'border-amber-500' : 'border-white/5 hover:border-white/20'}`}>
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-black text-stone-600">TEMPLATE {t}</div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Area - Live Preview */}
          <div className={`flex-1 bg-[#1a1918] overflow-y-auto p-10 flex justify-center custom-scrollbar ${showPreviewMobile ? 'flex fixed inset-0 z-[100] mt-16' : 'hidden lg:flex'}`}>
            <div
              className="bg-white w-[210mm] min-h-[297mm] shadow-2xl origin-top scale-[0.8] lg:scale-100 transform mb-20 p-[20mm] text-stone-900"
              style={{ fontFamily: theme.font }}
            >
              {/* Resume Header Preview */}
              <div className="border-b-4 pb-6 mb-8" style={{ borderColor: theme.primary }}>
                 <h1 className="text-4xl font-black tracking-tighter mb-2">{data.personal.name || 'YOUR NAME'}</h1>
                 <p className="text-lg font-bold text-stone-500 mb-4">{data.personal.role}</p>
                 <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-stone-400 uppercase">
                    <span className="flex items-center gap-2"><Mail size={12}/> {data.personal.email}</span>
                    <span className="flex items-center gap-2"><Phone size={12}/> {data.personal.phone}</span>
                    <span className="flex items-center gap-2"><MapPin size={12}/> {data.personal.location}</span>
                 </div>
              </div>

              {/* Resume Content Preview */}
              <div className="space-y-8">
                {data.summary && (
                  <section>
                    <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-stone-700">{data.summary}</p>
                  </section>
                )}

                <section>
                   <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4 border-b pb-1">Work Experience</h2>
                   <div className="space-y-6">
                      {data.experience.map((exp, i) => (
                        <div key={i}>
                           <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-sm">{exp.position}</h3>
                              <span className="text-[10px] font-bold text-stone-400">{exp.date}</span>
                           </div>
                           <p className="text-xs font-bold text-stone-500 mb-2">{exp.company}</p>
                           <p className="text-xs text-stone-600 leading-relaxed">{exp.desc}</p>
                        </div>
                      ))}
                   </div>
                </section>

                <section>
                   <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4 border-b pb-1">Education</h2>
                   <div className="space-y-4">
                      {data.education.map((edu, i) => (
                        <div key={i} className="flex justify-between">
                           <div>
                              <h3 className="font-bold text-sm">{edu.degree}</h3>
                              <p className="text-xs text-stone-500">{edu.school}</p>
                           </div>
                           <span className="text-[10px] font-bold text-stone-400">{edu.date}</span>
                        </div>
                      ))}
                   </div>
                </section>

                <section>
                   <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">Technical Skills</h2>
                   <p className="text-sm text-stone-700">{data.skills}</p>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}} />
    </div>
  );
};

export default ResumeBuilder;
