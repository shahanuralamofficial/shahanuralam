import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase,
  Code2, Award, Download, ArrowLeft, Plus, Trash2, Loader2, Save
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeBuilder = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', role: '' },
    objective: '',
    education: [{ school: '', degree: '', date: '' }],
    experience: [{ company: '', position: '', date: '', desc: '' }],
    skills: '',
    projects: [{ title: '', link: '', desc: '' }]
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const addItem = (field) => {
    const newItem = field === 'education' ? { school: '', degree: '', date: '' } :
                   field === 'experience' ? { company: '', position: '', date: '', desc: '' } :
                   { title: '', link: '', desc: '' };
    setData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
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

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(data.personal.name || "NAME", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(data.personal.role || "Professional Role", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 7;

    doc.setFontSize(9);
    const contactInfo = `${data.personal.location} | ${data.personal.phone} | ${data.personal.email}`;
    doc.text(contactInfo, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 5;
    doc.text(`${data.personal.linkedin} | ${data.personal.github}`, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
    y += 10;

    // Sections helper
    const addSection = (title, items, renderItem) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setLineWidth(0.2);
        doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        items.forEach(item => {
            y = renderItem(item, y);
            y += 5;
        });
        y += 5;
    };

    // Objective
    if (data.objective) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("OBJECTIVE", margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitObj = doc.splitTextToSize(data.objective, doc.internal.pageSize.getWidth() - (margin * 2));
        doc.text(splitObj, margin, y);
        y += (splitObj.length * 5) + 10;
    }

    // Education
    addSection("Education", data.education, (item, curY) => {
        doc.setFont("helvetica", "bold");
        doc.text(item.degree || "Degree", margin, curY);
        doc.setFont("helvetica", "italic");
        doc.text(item.date || "Date", doc.internal.pageSize.getWidth() - margin, curY, { align: 'right' });
        curY += 5;
        doc.setFont("helvetica", "normal");
        doc.text(item.school || "School/University", margin, curY);
        return curY + 5;
    });

    // Experience
    addSection("Experience", data.experience, (item, curY) => {
        doc.setFont("helvetica", "bold");
        doc.text(item.position || "Position", margin, curY);
        doc.setFont("helvetica", "italic");
        doc.text(item.date || "Date", doc.internal.pageSize.getWidth() - margin, curY, { align: 'right' });
        curY += 5;
        doc.setFont("helvetica", "normal");
        doc.text(item.company || "Company", margin, curY);
        curY += 5;
        const splitDesc = doc.splitTextToSize(item.desc || "", doc.internal.pageSize.getWidth() - (margin * 2));
        doc.text(splitDesc, margin, curY);
        return curY + (splitDesc.length * 5);
    });

    // Skills
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(data.skills || "Add your skills here...", margin, y);
    y += 15;

    // Projects
    addSection("Projects", data.projects, (item, curY) => {
        doc.setFont("helvetica", "bold");
        doc.text(item.title || "Project Title", margin, curY);
        curY += 5;
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(item.desc || "", doc.internal.pageSize.getWidth() - (margin * 2));
        doc.text(splitDesc, margin, curY);
        return curY + (splitDesc.length * 5);
    });

    doc.save(`${data.personal.name || 'resume'}_cv.pdf`);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center sticky top-0 bg-[#0c0a09]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft size={18} /> <span className="font-bold">Portfolio</span>
        </button>
        <span className="font-black uppercase tracking-widest text-sm text-amber-500">Resume Builder</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-12 grid grid-cols-1 gap-8">
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-10">

          {/* Personal Info */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="text-amber-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
              <input type="text" name="role" placeholder="Desired Role (e.g. Flutter Developer)" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
              <input type="email" name="email" placeholder="Email" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
              <input type="text" name="phone" placeholder="Phone Number" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
              <input type="text" name="location" placeholder="Location (e.g. Rajshahi, BD)" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
              <input type="text" name="linkedin" placeholder="LinkedIn URL" onChange={handlePersonalChange} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
            </div>
            <textarea name="objective" placeholder="Professional Objective" onChange={(e) => setData({...data, objective: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all h-32" />
          </section>

          {/* Education */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <h3 className="text-xl font-bold text-white flex items-center gap-3"><GraduationCap className="text-amber-500" /> Education</h3>
               <button onClick={() => addItem('education')} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-stone-900 transition-all"><Plus size={20}/></button>
            </div>
            {data.education.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative group">
                <input type="text" name="degree" placeholder="Degree" value={item.degree} onChange={(e) => handleItemChange('education', index, e)} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                <input type="text" name="school" placeholder="School/Uni" value={item.school} onChange={(e) => handleItemChange('education', index, e)} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                <div className="flex gap-2">
                  <input type="text" name="date" placeholder="Date/Year" value={item.date} onChange={(e) => handleItemChange('education', index, e)} className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                  <button onClick={() => removeItem('education', index)} className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </section>

          {/* Experience */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <h3 className="text-xl font-bold text-white flex items-center gap-3"><Briefcase className="text-amber-500" /> Experience</h3>
               <button onClick={() => addItem('experience')} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-stone-900 transition-all"><Plus size={20}/></button>
            </div>
            {data.experience.map((item, index) => (
              <div key={index} className="space-y-4 p-4 border border-white/5 rounded-2xl bg-white/[0.01]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="position" placeholder="Position" value={item.position} onChange={(e) => handleItemChange('experience', index, e)} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                  <input type="text" name="company" placeholder="Company" value={item.company} onChange={(e) => handleItemChange('experience', index, e)} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                  <input type="text" name="date" placeholder="Date/Duration" value={item.date} onChange={(e) => handleItemChange('experience', index, e)} className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all" />
                </div>
                <textarea name="desc" placeholder="Description of work" value={item.desc} onChange={(e) => handleItemChange('experience', index, e)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all h-24" />
                <button onClick={() => removeItem('experience', index)} className="text-xs text-rose-500 font-bold flex items-center gap-1 hover:underline"><Trash2 size={14}/> Remove Experience</button>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
              <Code2 className="text-amber-500" /> Skills
            </h3>
            <textarea placeholder="e.g. Java, Flutter, Firebase, Git, React (Comma separated)" value={data.skills} onChange={(e) => setData({...data, skills: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all h-24" />
          </section>

          <button
            onClick={generatePDF}
            disabled={loading}
            className="w-full py-6 bg-amber-500 text-stone-900 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/20 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            {loading ? 'Generating...' : 'Generate Professional PDF'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeBuilder;
