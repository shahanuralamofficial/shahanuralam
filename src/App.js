import React, { useState, useEffect, Suspense } from 'react';
import {
  Github, Linkedin, Facebook, Mail, MapPin, Download,
  Code2, Globe, ExternalLink, Award, FileText, Layout,
  Sun, Moon, BarChart2
} from 'lucide-react';
import profileImg from "./assets/ShahanurAlam.png";
import logoIcon from "./assets/logo-icon.png";
import bloodDonateLogo from "./assets/applogo/blood_donate.png";
import badalgachiLogo from "./assets/applogo/Badalgachi Net.png";
import cvPdf from './assets/cv/CV.pdf';

// Lazy load heavy components
const CPPractice = React.lazy(() => import('./CPPractice'));
const PDFToolbox = React.lazy(() => import('./PDFToolbox'));
const ResumeBuilder = React.lazy(() => import('./ResumeBuilder'));
const Analytics = React.lazy(() => import('./Analytics'));

// Certificates imports
import flutterCert from "./assets/certificates/Flutter Certificate.pdf";
import flutterMarkSheet from "./assets/certificates/Flutter Mark Sheet.pdf";
import java1Cert from "./assets/certificates/Java Certificate Season1.pdf";
import java2Cert from "./assets/certificates/Java Certificate Season2.pdf";
import java3Cert from "./assets/certificates/Java Certificate Season3.pdf";

const certificates = [
  { title: "Flutter Certificate", file: flutterCert, provider: "Self-Paced" },
  { title: "Flutter Mark Sheet", file: flutterMarkSheet, provider: "Self-Paced" },
  { title: "Java Certificate Season 1", file: java1Cert, provider: "Self-Paced" },
  { title: "Java Certificate Season 2", file: java2Cert, provider: "Self-Paced" },
  { title: "Java Certificate Season 3", file: java3Cert, provider: "Self-Paced" },
];

const projects = [
  {
    title: "Zen CP Workspace",
    description: "A high-performance Competitive Programming environment with real-time problem aggregation from Codeforces and AtCoder (14,000+ problems). Includes an integrated IDE and smart filters.",
    stack: ["React", "Tailwind CSS", "API Integration"],
    demoLink: "https://shahanuralam.vercel.app/#cp",
    sourceLink: "https://github.com/shahanuralamofficial/zen-cp-workspace.git",
    logo: "icon:code",
  },
  {
    title: "Blood Donate — Donor Matching (Android)",
    description: "Blood donation app for connecting donors and recipients, with search by blood group, location-based matching, and direct contact options. Built for fast access to urgent blood needs.",
    stack: ["Flutter", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    sourceLink: "#",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net — ISP App (Android)",
    description: "ISP app for managing customers, billing, and internet service support. Designed for easy account access, package details, and contact tools for local ISP users.",
    stack: ["Java", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    sourceLink: "#",
    logo: badalgachiLogo,
  },
];

const skills = [
  "Java (Android)", "Dart (Flutter)", "C++", "PHP",
  "HTML & CSS", "Flutter", "Firebase", "MySQL", "Git & GitHub"
];

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
      <p className="text-amber-500 text-xs font-black uppercase tracking-widest">Loading Zen Experience...</p>
    </div>
  </div>
);

export default function ShahanurPortfolio() {
  const [hash, setHash] = useState(window.location.hash);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    } catch (e) { return true; }
  });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
    setContactStatus({ loading: false, success: '', error: '' });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!window.emailjs) return;
    setContactStatus({ loading: true, success: '', error: '' });
    try {
      await window.emailjs.send('service_olg0zov', 'template_69edrmm', {
        from_name: contactData.name, from_email: contactData.email, message: contactData.message,
      });
      setContactStatus({ loading: false, success: 'Message sent successfully!', error: '' });
      setContactData({ name: '', email: '', message: '' });
    } catch (error) {
      setContactStatus({ loading: false, success: '', error: 'Failed to send message.' });
    }
  };

  if (hash === '#cp') return <Suspense fallback={<LoadingScreen/>}><CPPractice onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#pdf-tools') return <Suspense fallback={<LoadingScreen/>}><PDFToolbox onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#resume-builder') return <Suspense fallback={<LoadingScreen/>}><ResumeBuilder onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#analytics') return <Suspense fallback={<LoadingScreen/>}><Analytics onBack={() => window.location.hash = ''} /></Suspense>;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 antialiased relative overflow-x-hidden ${darkMode ? 'bg-[#0c0a09] text-stone-200' : 'bg-[#fcfaf9] text-stone-900'}`}>
      {/* Background elements */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${darkMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,119,6,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.03),transparent_50%)] pointer-events-none"></div>
      </div>

      <header className={`w-full p-3 sm:p-4 border-b sticky top-0 z-50 backdrop-blur-xl transition-all ${darkMode ? 'border-white/5 bg-black/40' : 'border-stone-200 bg-white/80 shadow-sm'}`}>
        <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${darkMode ? 'border-amber-500/30' : 'border-stone-200'}`}>
              <img src={logoIcon} alt="Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Shahanur Alam</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-500 font-black">Mobile App Developer</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-500' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => window.location.hash = 'analytics'} className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-500' : 'bg-stone-100 border-stone-200 text-stone-600'}`} title="Analytics">
              <BarChart2 size={18} />
            </button>
            <button onClick={() => window.location.hash = 'resume-builder'} className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all ${darkMode ? 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-stone-950' : 'text-stone-600 border-stone-200 bg-stone-100 hover:bg-stone-200'}`}>
              <Layout size={14}/> Resume
            </button>
            <button onClick={() => window.location.hash = 'pdf-tools'} className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all ${darkMode ? 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-stone-950' : 'text-stone-600 border-stone-200 bg-stone-100 hover:bg-stone-200'}`}>
              <FileText size={14}/> PDF Tools
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24 relative z-10">
        {/* Hero Section */}
        <section className={`p-8 sm:p-12 rounded-[3rem] border transition-all ${darkMode ? 'bg-black/20 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">Hi — I’m <span className="text-amber-500">Shahanur</span>.</h2>
                 <p className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Mobile App Developer specializing in Java & Flutter.</p>
              </div>
              <p className={`max-w-xl leading-relaxed ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Motivated computer science undergraduate from Rajshahi, Bangladesh. I build localized, practical apps with real users in mind — from agriculture tools to management systems.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => window.location.hash = 'cp'} className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl active:scale-95">Zen Workspace</button>
                <a href="/Shahanur_Alam_CV.html" target="_blank" className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border transition-all ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-stone-200 hover:bg-stone-50'}`}>View CV</a>
                <a href={cvPdf} download className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-900/20"><Download size={18}/> Download</a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
                  <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2">Location</p>
                  <p className="text-sm font-bold flex items-center gap-2"><MapPin size={14}/> Rajshahi, Bangladesh</p>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
                  <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2">Availability</p>
                  <p className="text-sm font-bold">Internships • Freelance • Junior Roles</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className={`w-64 h-64 rounded-[3.5rem] overflow-hidden border-8 transition-all duration-500 ${darkMode ? 'border-white/[0.03] shadow-amber-500/10 shadow-2xl' : 'border-stone-100 shadow-xl'}`}>
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </section>

        {/* About & Education & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h3 className={`text-2xl font-black border-l-4 border-amber-500 pl-6 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>About Me</h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>I am a motivated and self-driven computer science undergraduate passionate about mobile app development. Proficient in Java and Flutter, with hands-on experience building real-world Android and cross-platform apps.</p>
            </section>

            <section className="space-y-8">
               <div className="space-y-4">
                  <h4 className={`text-sm font-black uppercase tracking-widest text-amber-500`}>Education</h4>
                  <div className={`p-8 rounded-[2rem] border transition-all ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
                    <h5 className="font-bold text-lg">B.Sc. in Computer Science & Engineering</h5>
                    <p className={darkMode ? 'text-stone-500' : 'text-stone-400'}>Varendra University, Rajshahi (Expected graduation: 2026)</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className={`text-sm font-black uppercase tracking-widest text-amber-500`}>Achievements</h4>
                  <div className={`p-8 rounded-[2rem] border transition-all ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center mt-1"><Award size={14} className="text-amber-500" /></div>
                        <p className="font-medium">Winner — University Innovation Hub Competition (led a team project for mobile app development)</p>
                      </li>
                    </ul>
                  </div>
               </div>
            </section>
          </div>

          <aside className="space-y-12">
            <section className="space-y-6">
               <h3 className={`text-2xl font-black border-l-4 border-amber-500 pl-6 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {skills.map(s => <span key={s} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-default ${darkMode ? 'bg-stone-800 border-white/5 text-stone-300 hover:border-amber-500/50' : 'bg-white border-stone-200 text-stone-600 hover:shadow-md'}`}>{s}</span>)}
               </div>
            </section>

            <section className="space-y-6">
               <h4 className={`text-sm font-black uppercase tracking-widest text-amber-500`}>Tools & Tech</h4>
               <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
                  <p className={`text-sm leading-loose font-medium ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Flutter, Android Studio, Firebase, MySQL, XAMPP, Git & GitHub, Postman, VS Code</p>
               </div>
            </section>
          </aside>
        </div>

        {/* Certificates */}
        <section>
          <div className="flex justify-between items-end mb-10">
             <h3 className={`text-2xl font-black border-l-4 border-amber-500 pl-6 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Certificates</h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{certificates.length} Total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className={`group p-6 rounded-[2rem] border transition-all ${darkMode ? 'bg-white/[0.02] border-white/5 hover:border-amber-500/30' : 'bg-white border-stone-200 shadow-sm hover:shadow-lg'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-stone-50 text-stone-400'}`}><FileText size={20}/></div>
                   <div className="flex gap-2">
                      <a href={cert.file} target="_blank" className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-stone-950 transition-all"><ExternalLink size={14}/></a>
                      <a href={cert.file} download className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><Download size={14}/></a>
                   </div>
                </div>
                <h4 className="font-bold text-stone-200 group-hover:text-amber-500 transition-colors mb-1">{cert.title}</h4>
                <p className="text-[10px] font-black uppercase text-stone-500 tracking-tighter">{cert.provider}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
           <h3 className={`text-2xl font-black border-l-4 border-amber-500 pl-6 mb-12 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Selected Projects</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((p, i) => (
                <div key={i} className={`p-10 rounded-[3.5rem] border transition-all duration-500 ${darkMode ? 'bg-black/20 border-white/5 hover:border-amber-500/20' : 'bg-white border-stone-200 shadow-md hover:shadow-2xl'}`}>
                   <div className="flex items-center gap-5 mb-8">
                      {p.logo === "icon:code" ? (
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-lg"><Code2 size={28}/></div>
                      ) : (
                        <img src={p.logo} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/10" alt="logo"/>
                      )}
                      <div>
                        <h4 className="text-xl font-black tracking-tight">{p.title}</h4>
                        <div className="flex gap-2 mt-1">
                           {p.stack.slice(0,2).map(s => <span key={s} className="text-[9px] font-black uppercase text-amber-500/60">{s}</span>)}
                        </div>
                      </div>
                   </div>
                   <p className={`text-sm mb-8 leading-relaxed line-clamp-3 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>{p.description}</p>
                   <div className="flex items-center gap-6">
                      <a href={p.demoLink} target="_blank" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">Live Project <Globe size={16}/></a>
                      <a href={p.sourceLink} target="_blank" className="text-stone-500 hover:text-stone-300 font-bold text-xs underline underline-offset-8 transition-all">Source Code</a>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Contact */}
        <section id="contact" className={`p-12 sm:p-20 rounded-[4rem] border relative overflow-hidden transition-all ${darkMode ? 'bg-[#0a0807] border-white/5' : 'bg-white border-stone-100 shadow-2xl'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-10">
              <div className="space-y-4">
                 <h3 className="text-5xl font-black tracking-tighter">Get in <span className="text-amber-500">Touch</span></h3>
                 <p className={`text-lg ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>I’m available for internships, freelance projects, and junior roles. Send a note and I will reach out with a tailored reply.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Mail size={24}/></div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-stone-500">Email Address</p>
                      <a href="mailto:shahanuralam.dev@gmail.com" className="font-bold hover:text-amber-500 transition-colors">shahanuralam.dev@gmail.com</a>
                   </div>
                </div>
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><MapPin size={24}/></div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-stone-500">Office Location</p>
                      <p className="font-bold">Rajshahi, Bangladesh</p>
                   </div>
                </div>
              </div>
              <div className="flex gap-4">
                 <a href="https://github.com/shahanuralamofficial" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-stone-900 transition-all"><Github size={20}/></a>
                 <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><Linkedin size={20}/></a>
                 <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20}/></a>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} placeholder="Name" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
                <input name="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} placeholder="Email" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
              </div>
              <textarea name="message" value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} placeholder="How can I help you?" rows={6} className={`w-full p-5 rounded-2xl outline-none border transition-all resize-none ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
              <button className="w-full py-5 bg-amber-500 text-stone-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-amber-900/20">
                {contactStatus.loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Send Message
              </button>
              {contactStatus.success && <p className="text-emerald-500 text-xs font-bold text-center mt-4">{contactStatus.success}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className={`p-12 text-center border-t transition-all ${darkMode ? 'border-white/5 bg-black/40 text-stone-600' : 'border-stone-100 bg-white text-stone-400'}`}>
        <p className="text-xs font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} Shahanur Alam • Portfolio v2.0</p>
      </footer>
    </div>
  );
}
