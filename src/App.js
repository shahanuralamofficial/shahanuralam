import React, { useState, useEffect, Suspense, useRef } from 'react';
import {
  Github, Linkedin, Facebook, Mail, MapPin, Download,
  Code2, Globe, ExternalLink, Award, FileText, Layout,
  Sun, Moon, BarChart2, Save, Loader2, Phone, Zap
} from 'lucide-react';
import profileImg from "./assets/ShahanurAlam.png";
import bloodDonateLogo from "./assets/applogo/blood_donate.png";
import badalgachiLogo from "./assets/applogo/Badalgachi Net.png";
import luminaPopLogo from "./assets/applogo/lumina_pop.png";
import cvPdf from './assets/cv/CV.pdf';

// Firebase
import { db, ref, update, increment, trackEvent } from './firebase';

// Components (Lazy Load for performance)
const CPPractice = React.lazy(() => import('./CPPractice'));
const Visualizers = React.lazy(() => import('./Visualizers'));
const Analytics = React.lazy(() => import('./Analytics'));

// Certificates
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
    description: "A high-performance Competitive Programming environment with real-time problem aggregation from Codeforces and AtCoder (14,000+ problems).",
    stack: ["React", "Tailwind CSS", "API"],
    demoLink: "https://shahanuralam.vercel.app/#cp",
    sourceLink: "https://github.com/shahanuralamofficial/zen-cp-workspace.git",
    logo: "icon:code",
  },
  {
    title: "Blood Donate — Donor Matching",
    description: "Donor matching application built with Flutter and Firebase for urgent blood needs.",
    stack: ["Flutter", "Firebase"],
    playstoreLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net — ISP App",
    description: "ISP management app for local internet service providers, billing, and support.",
    stack: ["Java", "Android", "Firebase"],
    playstoreLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    logo: badalgachiLogo,
  },
  {
    title: "Lumina Pop — Premium Bubble Shooter",
    description: "A high-performance casual game featuring 1500+ levels, stunning glassmorphism UI, and real-time cloud synchronization.",
    stack: ["Flutter", "Firebase", "AdMob", "Advanced Physics"],
    playstoreLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.luminapop",
    logo: luminaPopLogo,
  },
];

const skills = ["Java (Android)", "Dart (Flutter)", "C++", "PHP", "HTML & CSS", "Flutter", "Firebase", "MySQL", "Git & GitHub"];

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600"></div>
  </div>
);

export default function ShahanurPortfolio() {
  const [hash, setHash] = useState(window.location.hash);
  const [darkMode, setDarkMode] = useState(true);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: '', error: '' });
  const visitTrackedRef = useRef(false);

  useEffect(() => {
    // Track Page Visit (only once, prevent double counting on React Strict Mode)
    if (!visitTrackedRef.current) {
      visitTrackedRef.current = true;
      try {
        const statsRef = ref(db, 'stats');
        update(statsRef, { visits: increment(1) }).catch(() => { });
        trackEvent('page_view');
      } catch (e) { }
    }

    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: '', error: '' });
    try {
      if (window.emailjs) {
        await window.emailjs.send('service_olg0zov', 'template_69edrmm', {
          from_name: contactData.name, from_email: contactData.email, message: contactData.message,
        });
        setContactStatus({ loading: false, success: 'Message sent successfully!', error: '' });
        setContactData({ name: '', email: '', message: '' });
        trackEvent('contact_form_submit', { from_email: contactData.email });
      }
    } catch (error) {
      setContactStatus({ loading: false, success: '', error: 'Failed to send message.' });
      trackEvent('contact_form_error', { error: error.message });
    }
  };

  const mainContent = () => {
    if (hash === '#cp') return <Suspense fallback={<LoadingScreen />}><CPPractice onBack={() => window.location.hash = ''} /></Suspense>;
    if (hash === '#visualizers') return <Suspense fallback={<LoadingScreen />}><Visualizers onBack={() => window.location.hash = ''} /></Suspense>;
    if (hash === '#analytics') return <Suspense fallback={<LoadingScreen />}><Analytics onBack={() => window.location.hash = ''} /></Suspense>;

    return (
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        {/* Hero */}
        <section className={`p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border transition-all ${darkMode ? 'bg-black/20 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter">Hi — I’m <span className="text-orange-600">Shahanur Alam</span>.</h2>
              <p className="text-xl text-stone-400">Mobile App Developer specializing in Java & Flutter.</p>
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                <button onClick={() => {
                  update(ref(db, 'stats'), { cpWorkspaceClicks: increment(1) }).catch(() => { });
                  trackEvent('cp_workspace_click');
                  window.location.hash = '#cp';
                }} className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-all text-sm sm:text-base">CP Zen Workspace</button>
                <a href="Shahanur_Alam_CV.html" target="_blank" onClick={() => {
                  update(ref(db, 'stats'), { cvViews: increment(1) }).catch(() => { });
                  trackEvent('cv_view');
                }} className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-center text-sm sm:text-base`}>View CV</a>
                <a href={cvPdf} download onClick={() => {
                  update(ref(db, 'stats'), { cvViews: increment(1) }).catch(() => { });
                  trackEvent('cv_download');
                }} className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 text-sm sm:text-base" title="Download CV (PDF)"><Download size={18} /> Download</a>
              </div>
              <div className="flex items-center gap-6 text-sm text-stone-500 pt-6">
                <span className="flex items-center gap-2" title="Location"><MapPin size={14} className="text-orange-600" /> Rajshahi, BD</span>
                <span className="flex items-center gap-2" title="Status"><Award size={14} className="text-orange-600" /> Open to Internships</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className={`w-56 h-56 rounded-[3.5rem] overflow-hidden border-4 border-orange-600/20 shadow-2xl transition-all duration-700 hover:scale-105 lg:translate-x-3`}>
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* About & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-600 border-l-4 border-orange-600 pl-4">About Me</h3>
            <p className="text-stone-400 leading-relaxed text-lg">I am a motivated computer science undergraduate passionate about mobile development. Proficient in Java and Flutter, with hands-on experience building real-world Android apps.</p>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <h4 className="font-bold text-stone-100">Education</h4>
              <p className="text-sm text-stone-500">B.Sc. in CSE, Varendra University (Expected graduation 2026)</p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <h4 className="font-bold text-stone-100">Achievement</h4>
              <p className="text-sm text-stone-500">Winner — University Innovation Hub Competition (Team Project)</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-600 border-l-4 border-orange-600 pl-4">Skills & Tools</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(s => <span key={s} className="px-4 py-2 bg-stone-800 rounded-xl text-xs font-bold border border-white/5 text-stone-300 transition-all hover:border-orange-600/50">{s}</span>)}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <h4 className="text-sm font-bold text-stone-500 mb-4 uppercase tracking-widest">Other Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {["Android Studio", "Firebase", "MySQL", "XAMPP", "Postman", "Git & GitHub", "VS Code"].map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg text-[10px] text-stone-400 font-bold">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <section>
          <h3 className="text-2xl font-bold text-orange-600 border-l-4 border-orange-600 pl-4 mb-8">Professional Certificates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className={`p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-orange-600/30 transition-all group`}>
                <div className="flex justify-between items-start mb-6">
                  <FileText size={24} className="text-stone-500 group-hover:text-orange-600 transition-all duration-500 group-hover:scale-110" />
                  <div className="flex gap-2">
                    <a href={cert.file} target="_blank" title="View Certificate" className="p-2 rounded-lg bg-orange-600/10 text-orange-600 hover:bg-orange-600 hover:text-black transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg shadow-orange-600/5"><ExternalLink size={16} /></a>
                    <a href={cert.file} download title="Download Certificate" className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg shadow-emerald-500/5"><Download size={16} /></a>
                  </div>
                </div>
                <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
                <p className="text-[10px] uppercase font-black text-stone-600 tracking-widest">{cert.provider}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects */}
        <section id="projects">
          <h3 className="text-2xl font-bold text-orange-600 border-l-4 border-orange-600 pl-4 mb-12">Selected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <div key={i} className={`p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[3rem] hover:border-orange-600/20 transition-all`}>
                <div className="flex items-center gap-4 mb-6">
                  {p.logo === "icon:code" ? <Code2 className="text-orange-600" size={32} title="Project Icon" /> : <img src={p.logo} className="w-14 h-14 rounded-2xl shadow-lg border border-orange-600/30 transition-all hover:border-orange-600 hover:shadow-orange-600/30 hover:scale-110" alt="logo" title="Project Logo" />}
                  <h4 className="text-xl font-bold">{p.title}</h4>
                </div>
                <p className="text-stone-400 text-sm mb-8 leading-relaxed">{p.description}</p>
                <div className="flex gap-6">
                  <a href={p.playstoreLink || p.demoLink} target="_blank" onClick={() => {
                    update(ref(db, 'stats'), { projectClicks: increment(1) }).catch(() => { });
                    trackEvent('project_link_click', { project: p.title, type: p.playstoreLink ? 'playstore' : 'demo' });
                  }} className="text-orange-600 font-bold flex items-center gap-2 text-sm uppercase tracking-widest hover:text-orange-500 hover:scale-105 transition-all duration-300">{p.playstoreLink ? 'Play Store' : 'Live Demo'} <span className="p-2 border border-orange-600/30 rounded-lg transition-all hover:border-orange-600 hover:bg-orange-600/10 hover:shadow-lg hover:shadow-orange-600/20"><Globe size={16} title={p.playstoreLink ? 'Play Store' : 'Live Demo'} /></span></a>
                  {p.sourceLink && <a href={p.sourceLink} target="_blank" onClick={() => trackEvent('source_link_click', { project: p.title })} className="text-stone-500 font-bold text-sm uppercase tracking-widest underline underline-offset-8 hover:text-stone-300 hover:scale-105 transition-all duration-300">Source</a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h3 className="text-2xl font-bold text-orange-600 border-l-4 border-orange-600 pl-4 mb-8">Contact Me</h3>
          <div className={`p-6 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] border transition-all ${darkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-4xl sm:text-5xl font-black">Get in <span className="text-orange-600">Touch</span></h3>
                <p className="text-stone-400 text-lg leading-relaxed">I’m available for internships, freelance projects, and junior roles. Send a note and I will reach out with a tailored reply.</p>
                <div className="space-y-4 pt-4">
                  <a href="mailto:shahanuralam.dev@gmail.com" className="flex items-center gap-4 text-stone-300 font-medium hover:text-orange-600 transition-colors" title="Send Email">
                    <Mail className="text-orange-600" size={20} /> shahanuralam.dev@gmail.com
                  </a>
                  <a href="tel:+8801518939114" className="flex items-center gap-4 text-stone-300 font-medium hover:text-orange-600 transition-colors" title="Call Shahanur">
                    <Phone className="text-orange-600" size={20} /> +880 1518-939114
                  </a>
                  <div className="flex items-center gap-4 text-stone-300 font-medium" title="Location">
                    <MapPin className="text-orange-600" size={20} /> Rajshahi, Bangladesh
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <a href="https://github.com/shahanuralamofficial" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all" title="GitHub Profile"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-500 transition-all" title="LinkedIn Profile"><Linkedin size={20} /></a>
                  <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all" title="Facebook Profile"><Facebook size={20} /></a>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" value={contactData.name} onChange={e => setContactData({ ...contactData, name: e.target.value })} placeholder="Full Name" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-orange-600' : 'bg-stone-50 border-stone-200 focus:border-orange-600'}`} required />
                  <input name="email" value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} placeholder="Email Address" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-orange-600' : 'bg-stone-50 border-stone-200 focus:border-orange-600'}`} required />
                </div>
                <textarea name="message" value={contactData.message} onChange={e => setContactData({ ...contactData, message: e.target.value })} placeholder="Tell me about your project..." rows={6} className={`w-full p-5 rounded-2xl outline-none border transition-all resize-none ${darkMode ? 'bg-black/40 border-white/10 focus:border-orange-600' : 'bg-stone-50 border-stone-200 focus:border-orange-600'}`} required />
                <button className="w-full py-5 bg-orange-600 text-stone-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-500 flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20 active:scale-95 transition-all">
                  {contactStatus.loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />} Send Message
                </button>
                {contactStatus.success && <p className="text-emerald-500 text-xs font-bold text-center mt-4">{contactStatus.success}</p>}
                {contactStatus.error && <p className="text-rose-500 text-xs font-bold text-center mt-4">{contactStatus.error}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 antialiased relative overflow-x-hidden ${darkMode ? 'bg-[#0c0a09] text-stone-200' : 'bg-[#fcfaf9] text-stone-900'}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${darkMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(234,88,12,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.03),transparent_50%)] pointer-events-none"></div>
      </div>

      <header className={`w-full p-4 border-b sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'border-white/5 bg-black/40' : 'border-stone-200 bg-white/70 shadow-sm'}`}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="w-10 h-10 rounded-full border-2 border-orange-600/50 overflow-hidden shadow-lg shadow-orange-900/20 shrink-0">
              <img src={profileImg} alt="Shahanur" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="hidden min-[400px]:block text-left">
              <h1 className="text-sm sm:text-lg font-bold leading-tight">Shahanur Alam</h1>
              <p className="text-[8px] sm:text-[10px] text-orange-600 font-black uppercase tracking-tighter sm:tracking-normal">Mobile Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => {
              setDarkMode(!darkMode);
              trackEvent('theme_toggle', { theme: darkMode ? 'light' : 'dark' });
            }} className="p-2 rounded-xl border border-white/10 transition-colors hover:bg-white/5" title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => {
              window.location.hash = '#cp';
              trackEvent('nav_cp_click');
            }} className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold border rounded-lg transition-colors bg-white/5 ${hash === '#cp' ? 'border-orange-600 bg-orange-600/10' : 'border-white/10 hover:border-orange-600/50'}`} title="Competitive Programming Workspace">
              <Code2 size={14} className="text-orange-600" />
              <span className="hidden sm:inline">CP Workspace</span>
              <span className="sm:hidden">CP</span>
            </button>
            <button onClick={() => {
              window.location.hash = '#visualizers';
              trackEvent('nav_visualizers_click');
            }} className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold border rounded-lg transition-colors bg-white/5 ${hash === '#visualizers' ? 'border-orange-500 bg-orange-600/10' : 'border-white/10 hover:border-orange-500/50'}`} title="Algorithm Visualizer Lab">
              <Zap size={14} className="text-orange-500" />
              <span className="hidden sm:inline">Algo Lab</span>
              <span className="sm:hidden">Lab</span>
            </button>
            <button onClick={() => {
              window.location.hash = '#analytics';
              trackEvent('nav_analytics_click');
            }} className={`p-2 rounded-xl border transition-colors hover:bg-white/5 ${hash === '#analytics' ? 'border-orange-600 bg-orange-600/10' : 'border-white/10'}`} title="Live Portfolio Analytics"><BarChart2 size={18} /></button>
          </div>
        </nav>
      </header>

      {mainContent()}

      {!hash && (
        <footer className="p-12 text-center text-stone-600 border-t border-white/5 bg-black/20 backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} Shahanur Alam • Built with Passion</p>
        </footer>
      )}
    </div>
  );
}
