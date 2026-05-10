import React, { useState } from 'react';
import { Github, Linkedin, Facebook, Mail, MapPin, Download, Code2 } from 'lucide-react';
import CPPractice from './CPPractice';
import profileImg from "./assets/ShahanurAlam.jpg";
import logoIcon from "./assets/logo-icon.png";
import bloodDonateLogo from "./assets/blood_donate.png";
import badalgachiLogo from "./assets/Badalgachi Net.png";
import cvPdf from './assets/CV.pdf';


// Projects array updated with demoLink and sourceLink
const projects = [
  {
    title: "Blood Donate — Donor Matching (Android)",
    description:
      "Blood donation app for connecting donors and recipients, with search by blood group, location-based matching, and direct contact options. Built for fast access to urgent blood needs.",
    stack: ["Flutter", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.blood_donate_app.bd",
    sourceLink: "#",
    logo: bloodDonateLogo,
  },
  {
    title: "Badalgachi Net — ISP App (Android)",
    description:
      "ISP app for managing customers, billing, and internet service support. Designed for easy account access, package details, and contact tools for local ISP users.",
    stack: ["Java", "Android", "Firebase"],
    demoLink: "https://play.google.com/store/apps/details?id=com.careconnectstudio.badalgachinet",
    sourceLink: "#",
    logo: badalgachiLogo,
  },
];

const skills = [
  "Java (Android)",
  "Dart (Flutter)",
  "C++",
  "PHP",
  "HTML & CSS",
  "Flutter",
  "Firebase",
  "MySQL",
  "Git & GitHub",
];

export default function ShahanurPortfolio() {
  const [showCP, setShowCP] = useState(false);

  if (showCP) {
    return <CPPractice onBack={() => setShowCP(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white antialiased relative overflow-hidden">
      {/* Luxury background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <header className="w-full p-3 sm:p-4 lg:p-6 border-b border-gold-400/20 backdrop-blur-xl bg-black/20 sticky top-0 z-50 shadow-2xl shadow-black/50">
        <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-1 w-full sm:w-auto justify-start sm:justify-start">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl shadow-yellow-500/50 border-2 border-yellow-300/50">
              <img src={logoIcon} alt="Shahanur Alam Icon" className="w-full h-full object-cover rounded-full transition-transform hover:scale-110" loading="lazy" />
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">Shahanur Alam</h1>
              <p className="text-xs sm:text-sm text-yellow-200/80 font-medium">Mobile App Developer • Java & Flutter</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 order-2 sm:order-2 w-full sm:w-auto justify-start sm:justify-end">
            <button onClick={() => setShowCP(true)} className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-yellow-400 hover:text-white transition-all duration-300 font-bold px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
              <Code2 size={12} className="sm:w-3.5 sm:h-3.5" /> CP Workspace
            </button>
            <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:text-yellow-400 transition-all duration-300 hover:scale-105 text-white/80">
              <Github size={12} className="sm:w-3.5 sm:h-3.5" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:text-blue-400 transition-all duration-300 hover:scale-105 text-white/80">
              <Linkedin size={12} className="sm:w-3.5 sm:h-3.5" /> LinkedIn
            </a>
            <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:text-blue-500 transition-all duration-300 hover:scale-105 text-white/80">
              <Facebook size={12} className="sm:w-3.5 sm:h-3.5" /> Facebook
            </a>
            <a href="mailto:shahanuralam.dev@gmail.com" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:text-red-400 transition-all duration-300 hover:scale-105 text-white/80">
              <Mail size={12} className="sm:w-3.5 sm:h-3.5" /> Email
            </a>
          </div>
        </nav>
      </header>

      <main className="w-full py-6 sm:py-8 lg:py-10">
        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start md:items-center bg-black/20 backdrop-blur-xl my-3 sm:my-4 lg:my-6 p-4 sm:p-5 lg:p-6 rounded-3xl shadow-2xl shadow-black/50 border border-white/10 animate-fade-in">
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Hi — I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300">Shahanur</span>.
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Motivated computer science undergraduate from Rajshahi, Bangladesh specializing in mobile app development using Java and Flutter. I build localized, practical apps with real users in mind — from agriculture tools to management systems.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button onClick={() => setShowCP(true)} className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 bg-white text-black rounded-xl shadow-xl hover:shadow-white/20 transform hover:-translate-y-1 transition-all duration-300 text-sm font-black uppercase flex items-center gap-2">
                <Code2 size={16} /> CP Workspace
              </button>
              <a href="#projects" className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm font-bold border border-yellow-400/50">View Projects</a>
              <a href="#contact" className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-yellow-400/50 text-yellow-400 rounded-xl hover:bg-yellow-400/10 transform hover:-translate-y-1 transition-all duration-300 text-sm font-bold">Contact Me</a>
              <a
                href={cvPdf}
                download="Shahanur-Alam-CV.pdf"
                className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-sm font-bold"
              >
                <Download size={14} /> Download CV
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
              <div className="p-3 sm:p-4 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-medium text-yellow-200/60">Location</div>
                <div className="flex items-center gap-2 mt-1 text-white/90 font-medium"><MapPin size={14} className="text-yellow-400" />Rajshahi, Bangladesh</div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-medium text-yellow-200/60">Open to</div>
                <div className="mt-1 text-white/90 font-medium">Internships • Junior Developer • Freelance</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-yellow-400/50 shadow-2xl shadow-yellow-500/30 flex-shrink-0 transform hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-yellow-400/20 to-amber-400/20">
              <img src={profileImg} alt="Shahanur Alam" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="text-center text-xs sm:text-sm text-white/70 space-y-1.5">
              <div className="font-medium text-yellow-200/80">Quick links</div>
              <div className="flex gap-2 sm:gap-3 justify-center">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition-colors text-xs font-medium">GitHub</a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors text-xs font-medium">LinkedIn</a>
                <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors text-xs font-medium">Facebook</a>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <article className="lg:col-span-2 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-yellow-400/30 pb-3 text-yellow-200">About Me</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">I am a motivated and self-driven computer science undergraduate passionate about mobile app development. Proficient in Java and Flutter, with hands-on experience building real-world Android and cross-platform apps. Eager to contribute to innovative projects and gain practical experience through internships or entry-level roles.</p>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-yellow-200 border-l-4 border-yellow-400 pl-3">Education</h4>
                <div className="text-white/90 text-sm sm:text-base bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">B.Sc. in Computer Science & Engineering — Varendra University, Rajshahi (Expected graduation: 2026)</div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-yellow-200 border-l-4 border-amber-400 pl-3">Achievements</h4>
                <ul className="mt-2 space-y-2 text-white/90 text-sm sm:text-base bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Winner — University Innovation Hub Competition (led a team project for mobile app development)
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold border-b border-yellow-400/30 pb-3 text-yellow-200">Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((s) => (
                <span key={s} className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-xl text-xs sm:text-sm font-medium border border-yellow-400/30 hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer text-white/90 hover:text-yellow-100 shadow-lg hover:shadow-yellow-500/20">{s}</span>
              ))}
            </div>

            <div>
              <h4 className="text-base font-semibold text-yellow-200 border-b border-yellow-400/30 pb-2 mb-3">Tools & Frameworks</h4>
              <div className="text-white/80 text-sm sm:text-base bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">Flutter, Android Studio, Firebase, MySQL, XAMPP, Git & GitHub</div>
            </div>
          </aside>
        </section>

        {/* Projects Section */}
        <section id="projects" className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-8 sm:mt-10">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 border-b border-yellow-400/30 pb-3 text-yellow-200">Selected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p.title} className="group bg-black/20 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-2 border border-white/10 hover:border-yellow-400/30">
                <div className="flex items-center gap-3 mb-4">
                  {p.logo ? (
                    <img src={p.logo} alt={`${p.title} logo`} className="w-12 h-12 rounded-2xl object-cover border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/30" loading="lazy" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border-2 border-yellow-400/50 flex items-center justify-center text-yellow-400 font-bold shadow-lg">APP</div>
                  )}
                  <h4 className="text-base sm:text-lg font-bold text-white">{p.title}</h4>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mb-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {p.stack.map((t) => (
                    <span key={t} className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full text-xs sm:text-sm font-medium text-yellow-200 border border-yellow-400/30">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 sm:gap-6 items-center">
                  <a href={p.demoLink} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-all duration-300 hover:scale-105">
                    View Project →
                  </a>
                  <a href={p.sourceLink} target="_blank" rel="noreferrer" className="text-white/60 hover:text-yellow-400 text-sm transition-all duration-300 hover:scale-105">
                    View Source
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-8 sm:mt-10 bg-black/20 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/50 border border-white/10">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-yellow-200">Contact</h3>
          <p className="text-white/70 text-sm sm:text-base mb-6 text-center leading-relaxed max-w-md mx-auto">I'm open to internships, freelance or junior developer roles. Send me a message and I will reply as soon as I can.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-yellow-200 border-l-4 border-yellow-400 pl-3">Reach me</h4>
              <div className="space-y-3 text-xs sm:text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-yellow-400" />
                  <a href="mailto:shahanuralam.dev@gmail.com" className="hover:text-yellow-300 font-medium transition-colors">shahanuralam.dev@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-400" />
                  <a href="tel:+8801518939114" className="hover:text-green-300 font-medium transition-colors">+8801518939114</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-white/60" />
                  <span>Rajshahi, Bangladesh</span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-white/20 rounded-xl hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 text-xs sm:text-sm font-medium text-white/80 hover:text-yellow-200">
                  <Github size={14} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-white/20 rounded-xl hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300 text-xs sm:text-sm font-medium text-white/80 hover:text-blue-300">
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-white/20 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 text-xs sm:text-sm font-medium text-white/80 hover:text-blue-400">
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>

            <form className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm text-yellow-200/80 block mb-1.5 font-medium">Name</label>
                <input className="w-full p-3 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 text-xs sm:text-sm transition-all text-white placeholder-white/50" placeholder="Your name" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-yellow-200/80 block mb-1.5 font-medium">Email</label>
                <input className="w-full p-3 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 text-xs sm:text-sm transition-all text-white placeholder-white/50" placeholder="you@example.com" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-yellow-200/80 block mb-1.5 font-medium">Message</label>
                <textarea className="w-full p-3 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 text-xs sm:text-sm transition-all resize-none text-white placeholder-white/50" rows={4} placeholder="Brief message..." />
              </div>

              <button type="button" className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black rounded-xl font-bold text-xs sm:text-sm hover:from-yellow-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-yellow-500/50 border border-yellow-400/50">
                Send Message
              </button>
            </form>
          </div>
        </section>

        <footer className="w-full mt-8 sm:mt-12 py-4 sm:py-6 text-center text-xs sm:text-sm text-white/50 bg-black/30 backdrop-blur-xl border-t border-yellow-400/20">
          © {new Date().getFullYear()} Shahanur Alam — Built with React & Tailwind
        </footer>
      </main>
    </div>
  );
}
