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

// Lazy load heavy components to prevent top-level crashes
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
  { title: "Flutter Certificate", file: flutterCert },
  { title: "Flutter Mark Sheet", file: flutterMarkSheet },
  { title: "Java Certificate Season 1", file: java1Cert },
  { title: "Java Certificate Season 2", file: java2Cert },
  { title: "Java Certificate Season 3", file: java3Cert },
];

const projects = [
  {
    title: "Zen CP Workspace",
    description: "A high-performance Competitive Programming environment with real-time API integration.",
    stack: ["React", "Tailwind CSS"],
    demoLink: "https://shahanuralam.vercel.app/#cp",
    sourceLink: "https://github.com/shahanuralamofficial/zen-cp-workspace.git",
    logo: "icon:code",
  },
  {
    title: "Blood Donate App",
    description: "Donor matching application built with Flutter and Firebase.",
    stack: ["Flutter", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    sourceLink: "#",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net",
    description: "ISP management app for local internet service providers.",
    stack: ["Java", "Android"],
    demoLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    sourceLink: "#",
    logo: badalgachiLogo,
  },
];

const skills = ["Java", "Dart", "Flutter", "React", "Firebase", "MySQL", "Git", "PHP"];

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
  </div>
);

export default function ShahanurPortfolio() {
  const [hash, setHash] = useState(window.location.hash);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (hash === '#cp') return <Suspense fallback={<LoadingScreen/>}><CPPractice onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#pdf-tools') return <Suspense fallback={<LoadingScreen/>}><PDFToolbox onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#resume-builder') return <Suspense fallback={<LoadingScreen/>}><ResumeBuilder onBack={() => window.location.hash = ''} /></Suspense>;
  if (hash === '#analytics') return <Suspense fallback={<LoadingScreen/>}><Analytics onBack={() => window.location.hash = ''} /></Suspense>;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 antialiased relative overflow-x-hidden ${darkMode ? 'bg-[#0c0a09] text-stone-200' : 'bg-[#fcfaf9] text-stone-900'}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${darkMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,119,6,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.03),transparent_50%)] pointer-events-none"></div>
      </div>

      <header className={`w-full p-4 border-b sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'border-white/5 bg-black/40' : 'border-stone-200 bg-white/70'}`}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Icon" className="w-8 h-8 rounded-full border border-amber-500/50" />
            <span className="font-bold hidden sm:inline">Shahanur Alam</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg border border-white/10 hover:bg-white/5">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => window.location.hash = 'analytics'} className="p-2 rounded-lg border border-white/10 hover:bg-white/5"><BarChart2 size={18}/></button>
            <button onClick={() => window.location.hash = 'resume-builder'} className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-black rounded-lg">Resume</button>
            <button onClick={() => window.location.hash = 'pdf-tools'} className="px-3 py-1.5 text-xs font-bold border border-white/10 rounded-lg">PDF Tools</button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        <section className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter">Hi — I’m <span className="text-amber-500">Shahanur</span>.</h2>
              <p className="text-xl text-stone-400">Mobile App Developer specializing in Java & Flutter.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => window.location.hash = 'cp'} className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-all">CP Workspace</button>
                <a href="/Shahanur_Alam_CV.html" target="_blank" className="px-8 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all">View CV</a>
                <a href={cvPdf} download className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all">Download</a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-56 h-56 rounded-[3rem] overflow-hidden border-4 border-amber-500/20 shadow-2xl">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-500 uppercase tracking-widest">About Me</h3>
            <p className="text-stone-400 leading-relaxed">I build practical, user-centric mobile applications with a focus on performance and clean UI.</p>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
               <h4 className="font-bold">Education</h4>
               <p className="text-sm text-stone-500">B.Sc. in CSE, Varendra University (2026)</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-500 uppercase tracking-widest">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(s => <span key={s} className="px-4 py-2 bg-stone-800 rounded-xl text-xs font-bold border border-white/5">{s}</span>)}
            </div>
          </div>
        </section>

        <section className="space-y-8">
           <h3 className="text-2xl font-bold text-amber-500 uppercase tracking-widest">Projects</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((p, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
                   <div className="flex items-center gap-4 mb-4">
                      {p.logo === "icon:code" ? <Code2 className="text-amber-500" size={32}/> : <img src={p.logo} className="w-12 h-12 rounded-xl" alt="logo"/>}
                      <h4 className="text-xl font-bold">{p.title}</h4>
                   </div>
                   <p className="text-stone-400 text-sm mb-6">{p.description}</p>
                   <div className="flex gap-4">
                      <a href={p.demoLink} target="_blank" className="text-amber-500 font-bold flex items-center gap-2">Live Demo <ExternalLink size={14}/></a>
                      <a href={p.sourceLink} target="_blank" className="text-stone-500 font-bold">Source</a>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="p-12 text-center text-stone-600 border-t border-white/5">
        © {new Date().getFullYear()} Shahanur Alam • Built with React & Tailwind
      </footer>
    </div>
  );
}
