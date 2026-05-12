import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Facebook, Mail, MapPin, Download, Code2, Globe, ExternalLink, Award, FileText, Layout, Sun, Moon, BarChart } from 'lucide-react';
import CPPractice from './CPPractice';
import PDFToolbox from './PDFToolbox';
import ResumeBuilder from './ResumeBuilder';
import Analytics from './Analytics';
import profileImg from "./assets/ShahanurAlam.png";
import logoIcon from "./assets/logo-icon.png";
import bloodDonateLogo from "./assets/applogo/blood_donate.png";
import badalgachiLogo from "./assets/applogo/Badalgachi Net.png";
import cvPdf from './assets/cv/CV.pdf';

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
    description: "Blood donation app for connecting donors and recipients, with search by blood group, location-based matching, and direct contact options.",
    stack: ["Flutter", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    sourceLink: "#",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net — ISP App (Android)",
    description: "ISP app for managing customers, billing, and internet service support. Designed for easy account access and contact tools.",
    stack: ["Java", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    sourceLink: "#",
    logo: badalgachiLogo,
  },
];

const skills = ["Java (Android)", "Dart (Flutter)", "C++", "PHP", "HTML & CSS", "Flutter", "Firebase", "MySQL", "Git & GitHub"];

export default function ShahanurPortfolio() {
  const [showCP, setShowCP] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    } catch (e) {
      return true;
    }
  });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      setShowCP(window.location.hash === '#cp');
      setShowPDF(window.location.hash === '#pdf-tools');
      setShowResume(window.location.hash === '#resume-builder');
      setShowAnalytics(window.location.hash === '#analytics');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (window.emailjs?.init) window.emailjs.init('lzXCo-rsbVGxeyVKI');
  }, []);

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
    setContactStatus({ loading: false, success: '', error: '' });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
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

  if (showCP) return <CPPractice onBack={() => window.location.hash = ''} />;
  if (showPDF) return <PDFToolbox onBack={() => window.location.hash = ''} />;
  if (showResume) return <ResumeBuilder onBack={() => window.location.hash = ''} />;
  if (showAnalytics) return <Analytics onBack={() => window.location.hash = ''} />;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 antialiased relative overflow-hidden ${darkMode ? 'bg-[#0c0a09] text-stone-200' : 'bg-[#fcfaf9] text-stone-900'}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${darkMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,119,6,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.03),transparent_50%)] pointer-events-none"></div>
      </div>

      <header className={`w-full p-3 sm:p-4 lg:p-6 border-b sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${darkMode ? 'border-amber-400/10 bg-black/40' : 'border-stone-200 bg-white/80'}`}>
        <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${darkMode ? 'border-amber-500/50' : 'border-stone-200'}`}>
              <img src={logoIcon} alt="Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Shahanur Alam</h1>
              <p className="text-xs text-amber-500 font-medium">Mobile App Developer</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-500' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => window.location.hash = 'analytics'} className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-500' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
              <BarChart size={18} />
            </button>
            <button onClick={() => window.location.hash = 'resume-builder'} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${darkMode ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'bg-stone-100 border-stone-200'}`}><Layout size={14}/> Resume</button>
            <button onClick={() => window.location.hash = 'pdf-tools'} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${darkMode ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'bg-stone-100 border-stone-200'}`}><FileText size={14}/> PDF Tools</button>
            <button onClick={() => window.location.hash = 'cp'} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${darkMode ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'bg-stone-100 border-stone-200'}`}><Code2 size={14}/> CP</button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-20">
        {/* Hero Section */}
        <section className={`p-8 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-black/20 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">Hi — I’m <span className="text-amber-500">Shahanur</span>.</h2>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Computer Science undergraduate specializing in Java and Flutter. I build localized, practical apps with real users in mind.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => window.location.hash = 'resume-builder'} className="px-6 py-3 bg-amber-500 text-stone-900 rounded-xl font-bold hover:bg-amber-400 transition-all">Get Started</button>
                <a href="/Shahanur_Alam_CV.html" target="_blank" className={`px-6 py-3 rounded-xl font-bold border transition-all ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-stone-200 hover:bg-stone-50'}`}>View CV</a>
                <a href={cvPdf} download className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2"><Download size={18}/> Download</a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className={`w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 ${darkMode ? 'border-amber-500/20' : 'border-stone-100 shadow-lg'}`}>
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* About & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h3 className={`text-2xl font-bold border-b pb-4 ${darkMode ? 'border-white/5 text-stone-100' : 'border-stone-200 text-stone-900'}`}>About Me</h3>
            <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} leading-relaxed`}>I am a self-driven CS student passionate about mobile development. Proficient in Java and Flutter, with hands-on experience building real-world Android apps.</p>
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-stone-200'}`}>
              <h4 className="font-bold mb-2">Education</h4>
              <p className="text-sm">B.Sc. in CSE — Varendra University (Expected 2026)</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold border-b pb-4 ${darkMode ? 'border-white/5 text-stone-100' : 'border-stone-200 text-stone-900'}`}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s} className={`px-4 py-2 rounded-xl text-xs font-bold border ${darkMode ? 'bg-stone-800 border-white/5 text-stone-300' : 'bg-white border-stone-200 text-stone-600'}`}>{s}</span>)}
            </div>
          </div>
        </div>

        {/* Certificates */}
        <section>
          <h3 className={`text-2xl font-bold border-b pb-4 mb-8 ${darkMode ? 'border-white/5 text-stone-100' : 'border-stone-200 text-stone-900'}`}>Certificates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-white/[0.02] border-white/5 hover:border-amber-500/30' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'}`}>
                <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
                <div className="flex gap-2 mt-4">
                  <a href={cert.file} target="_blank" className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><ExternalLink size={16}/></a>
                  <a href={cert.file} download className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Download size={16}/></a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <h3 className={`text-2xl font-bold border-b pb-4 mb-8 ${darkMode ? 'border-white/5 text-stone-100' : 'border-stone-200 text-stone-900'}`}>Selected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border transition-all ${darkMode ? 'bg-black/20 border-white/5 hover:border-amber-500/20' : 'bg-white border-stone-200 shadow-sm hover:shadow-xl'}`}>
                <div className="flex items-center gap-4 mb-6">
                  {p.logo === "icon:code" ? <Code2 className="text-amber-500" size={32}/> : <img src={p.logo} className="w-12 h-12 rounded-2xl" alt="logo" />}
                  <h4 className="font-black text-xl">{p.title}</h4>
                </div>
                <p className={`text-sm mb-6 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{p.description}</p>
                <div className="flex gap-4">
                  <a href={p.demoLink} target="_blank" className="text-amber-500 font-bold flex items-center gap-2">Live Demo <Globe size={16}/></a>
                  <a href={p.sourceLink} target="_blank" className="text-stone-500 font-bold">Source</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <h3 className="text-4xl font-black">Contact <span className="text-amber-500">Me</span></h3>
              <p className={darkMode ? 'text-stone-400' : 'text-stone-600'}>I'm available for internships and freelance projects.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><Mail className="text-amber-500"/> shahanuralam.dev@gmail.com</div>
                <div className="flex items-center gap-4"><MapPin className="text-amber-500"/> Rajshahi, Bangladesh</div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input name="name" placeholder="Name" onChange={handleContactChange} className={`w-full p-4 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} />
              <input name="email" placeholder="Email" onChange={handleContactChange} className={`w-full p-4 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} />
              <textarea name="message" placeholder="Message" rows={5} onChange={handleContactChange} className={`w-full p-4 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/10 focus:border-amber-500' : 'bg-stone-50 border-stone-200 focus:border-amber-500'}`} />
              <button className="w-full py-4 bg-amber-500 text-stone-900 rounded-2xl font-bold flex items-center justify-center gap-2">
                {contactStatus.loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className={`p-10 text-center border-t ${darkMode ? 'border-white/5 bg-black/40 text-stone-500' : 'border-stone-100 bg-white text-stone-400'}`}>
        © {new Date().getFullYear()} Shahanur Alam • Built with Passion
      </footer>
    </div>
  );
}
