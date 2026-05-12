import React, { useState, useEffect, Suspense } from 'react';
import {
  Github, Linkedin, Facebook, Mail, MapPin, Download,
  Code2, Globe, ExternalLink, Award, FileText, Layout,
  Sun, Moon, BarChart2, Save, Loader2, Phone
} from 'lucide-react';
import profileImg from "./assets/ShahanurAlam.png";
import bloodDonateLogo from "./assets/applogo/blood_donate.png";
import badalgachiLogo from "./assets/applogo/Badalgachi Net.png";
import cvPdf from './assets/cv/CV.pdf';

// Components (Lazy Load for performance)
const CPPractice = React.lazy(() => import('./CPPractice'));
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
    demoLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    sourceLink: "#",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net — ISP App",
    description: "ISP management app for local internet service providers, billing, and support.",
    stack: ["Java", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    sourceLink: "#",
    logo: badalgachiLogo,
  },
];

const skills = ["Java (Android)", "Dart (Flutter)", "C++", "PHP", "HTML & CSS", "Flutter", "Firebase", "MySQL", "Git & GitHub"];

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
  </div>
);

export default function ShahanurPortfolio() {
  const [hash, setHash] = useState(window.location.hash);
  const [darkMode, setDarkMode] = useState(true);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
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
      }
    } catch (error) {
      setContactStatus({ loading: false, success: '', error: 'Failed to send message.' });
    }
  };

  if (hash === '#cp') return <Suspense fallback={<LoadingScreen/>}><CPPractice onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#analytics') return <Suspense fallback={<LoadingScreen/>}><Analytics onBack={() => window.location.hash = ''} /></Suspense>;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 antialiased relative overflow-x-hidden ${darkMode ? 'bg-[#0c0a09] text-stone-200' : 'bg-[#fcfaf9] text-stone-900'}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${darkMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,119,6,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.03),transparent_50%)] pointer-events-none"></div>
      </div>

      <header className={`w-full p-4 border-b sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'border-white/5 bg-black/40' : 'border-stone-200 bg-white/70 shadow-sm'}`}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/50 overflow-hidden shadow-lg shadow-amber-900/20">
              <img src={profileImg} alt="Shahanur" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="hidden sm:block text-left">
               <h1 className="text-lg font-bold">Shahanur Alam</h1>
               <p className="text-[10px] text-amber-500 font-black uppercase">Mobile Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-white/10">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => window.location.hash = '#cp'} className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-white/10 rounded-lg transition-colors hover:border-amber-500/50">
              <Code2 size={14} className="text-amber-500" />
              CP Workspace
            </button>
            <button onClick={() => window.location.hash = '#analytics'} className="p-2 rounded-xl border border-white/10"><BarChart2 size={18}/></button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        {/* Hero */}
        <section className={`p-8 sm:p-12 rounded-[3rem] border transition-all ${darkMode ? 'bg-black/20 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter">Hi — I’m <span className="text-amber-500">Shahanur</span>.</h2>
              <p className="text-xl text-stone-400">Mobile App Developer specializing in Java & Flutter.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => window.location.hash = '#cp'} className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-all">CP Zen Workspace</button>
                <a href="Shahanur_Alam_CV.html" target="_blank" className={`px-8 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all`}>View CV</a>
                <a href={cvPdf} download className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center gap-2"><Download size={18}/> Download</a>
              </div>
              <div className="flex items-center gap-6 text-sm text-stone-500 pt-6">
                 <span className="flex items-center gap-2"><MapPin size={14} className="text-amber-500"/> Rajshahi, BD</span>
                 <span className="flex items-center gap-2"><Award size={14} className="text-amber-500"/> Open to Internships</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className={`w-56 h-56 rounded-[3.5rem] overflow-hidden border-4 border-amber-500/20 shadow-2xl transition-all duration-700 hover:scale-105`}>
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* About & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-500 border-l-4 border-amber-500 pl-4">About Me</h3>
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
            <h3 className="text-2xl font-bold text-amber-500 border-l-4 border-amber-500 pl-4">Skills & Tools</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(s => <span key={s} className="px-4 py-2 bg-stone-800 rounded-xl text-xs font-bold border border-white/5 text-stone-300 transition-all hover:border-amber-500/50">{s}</span>)}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
               <h4 className="text-sm font-bold text-stone-500 mb-3">Other Technologies</h4>
               <p className="text-sm text-stone-400">Android Studio, Firebase, MySQL, XAMPP, Postman, Git & GitHub, VS Code</p>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <section>
          <h3 className="text-2xl font-bold text-amber-500 border-l-4 border-amber-500 pl-4 mb-8">Professional Certificates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className={`p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group`}>
                <div className="flex justify-between items-start mb-6">
                   <FileText size={24} className="text-stone-500 group-hover:text-amber-500 transition-colors"/>
                   <div className="flex gap-2">
                      <a href={cert.file} target="_blank" className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black"><ExternalLink size={16}/></a>
                      <a href={cert.file} download className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"><Download size={16}/></a>
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
           <h3 className="text-2xl font-bold text-amber-500 border-l-4 border-amber-500 pl-4 mb-12">Selected Projects</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((p, i) => (
                <div key={i} className={`p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-amber-500/20 transition-all`}>
                   <div className="flex items-center gap-4 mb-6">
                      {p.logo === "icon:code" ? <Code2 className="text-amber-500" size={32}/> : <img src={p.logo} className="w-14 h-14 rounded-2xl shadow-lg" alt="logo"/>}
                      <h4 className="text-xl font-bold">{p.title}</h4>
                   </div>
                   <p className="text-stone-400 text-sm mb-8 leading-relaxed">{p.description}</p>
                   <div className="flex gap-6">
                      <a href={p.demoLink} target="_blank" className="text-amber-500 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">Live Demo <Globe size={16}/></a>
                      <a href={p.sourceLink} target="_blank" className="text-stone-500 font-bold text-sm uppercase tracking-widest underline underline-offset-8">Source</a>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h3 className="text-2xl font-bold text-amber-500 border-l-4 border-amber-500 pl-4 mb-8">Contact Me</h3>
          <div className={`p-10 sm:p-16 rounded-[4rem] border transition-all ${darkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-5xl font-black">Get in <span className="text-amber-500">Touch</span></h3>
                <p className="text-stone-400 text-lg leading-relaxed">I’m available for internships, freelance projects, and junior roles. Send a note and I will reach out with a tailored reply.</p>
                <div className="space-y-4 pt-4">
                  <a href="mailto:shahanuralam.dev@gmail.com" className="flex items-center gap-4 text-stone-300 font-medium hover:text-amber-500 transition-colors">
                    <Mail className="text-amber-500" size={20}/> shahanuralam.dev@gmail.com
                  </a>
                  <a href="tel:+8801518939114" className="flex items-center gap-4 text-stone-300 font-medium hover:text-amber-500 transition-colors">
                    <Phone className="text-amber-500" size={20}/> +880 1518-939114
                  </a>
                  <div className="flex items-center gap-4 text-stone-300 font-medium">
                    <MapPin className="text-amber-500" size={20}/> Rajshahi, Bangladesh
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                   <a href="https://github.com/shahanuralamofficial" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all"><Github size={20}/></a>
                   <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-500 transition-all"><Linkedin size={20}/></a>
                   <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all"><Facebook size={20}/></a>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <input name="name" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} placeholder="Full Name" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
                   <input name="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} placeholder="Email Address" className={`w-full p-5 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
                </div>
                <textarea name="message" value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} placeholder="Tell me about your project..." rows={6} className={`w-full p-5 rounded-2xl outline-none border transition-all resize-none ${darkMode ? 'bg-black/40 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} required />
                <button className="w-full py-5 bg-amber-500 text-stone-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 active:scale-95 transition-all">
                  {contactStatus.loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={18}/>} Send Message
                </button>
                {contactStatus.success && <p className="text-emerald-500 text-xs font-bold text-center mt-4">{contactStatus.success}</p>}
                {contactStatus.error && <p className="text-rose-500 text-xs font-bold text-center mt-4">{contactStatus.error}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-12 text-center text-stone-600 border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} Shahanur Alam • Built with Passion</p>
      </footer>
    </div>
  );
}
