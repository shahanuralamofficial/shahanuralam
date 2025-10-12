import profileImg from "./assets/ShahanurAlam.jpg";
import logoIcon from "./assets/logo-icon.png";

import { Github, Linkedin, Mail, MapPin, Download, Facebook } from "lucide-react";

const projects = [
  {
    title: "AgriCare — Smart Agriculture (Android Java)",
    description:
      "Smart agriculture Android app with disease detection (Teachable Machine + TFLite), weather-based recommendations, and a Bangla UI targeted for local farmers.",
    stack: ["Java", "Android", "TFLite", "Firebase"],
    link: "#",
  },
  {
    title: "Ukil — Lawyer Finder (Flutter)",
    description:
      "Lawyer directory app with category search, filters, lawyer profiles, client-lawyer interactions and a PHP+MySQL backend (XAMPP).",
    stack: ["Flutter", "Dart", "PHP", "MySQL"],
    link: "#",
  },
  {
    title: "HostelMate — Hostel Management (Android Java)",
    description:
      "Role-based hostel management system supporting owners, managers, and members, with leave requests, notices and profile control. Java Android front-end and PHP+MySQL backend.",
    stack: ["Java", "Android", "PHP", "MySQL"],
    link: "#",
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
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 antialiased">
      <header className="w-full p-3 sm:p-4 lg:p-6 border-b border-indigo-100/50 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-1 w-full sm:w-auto justify-start sm:justify-start">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
              <img src={logoIcon} alt="Shahanur Alam Icon" className="w-full h-full object-cover rounded-full transition-transform hover:scale-110" loading="lazy" />
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Shahanur Alam</h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Mobile App Developer • Java & Flutter</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap order-2 sm:order-2 justify-center sm:justify-end">
            <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:underline hover:text-indigo-600 transition-colors">
              <Github size={12} className="sm:w-3.5 sm:h-3.5" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:underline hover:text-blue-600 transition-colors">
              <Linkedin size={12} className="sm:w-3.5 sm:h-3.5" /> LinkedIn
            </a>
            <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:underline hover:text-blue-800 transition-colors">
              <Facebook size={12} className="sm:w-3.5 sm:h-3.5" /> Facebook
            </a>
            <a href="mailto:shahanuralam.dev@gmail.com" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm hover:underline hover:text-red-500 transition-colors">
              <Mail size={12} className="sm:w-3.5 sm:h-3.5" /> Email
            </a>
          </div>
        </nav>
      </header>

      <main className="w-full py-6 sm:py-8 lg:py-10">
        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start md:items-center bg-white/80 backdrop-blur-sm my-3 sm:my-4 lg:my-6 p-4 sm:p-5 lg:p-6 rounded-2xl shadow-lg border border-indigo-100 animate-fade-in">
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Hi — I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">Shahanur</span>.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Motivated computer science undergraduate from Rajshahi, Bangladesh specializing in mobile app development using Java and Flutter. I build localized, practical apps with real users in mind — from agriculture tools to management systems.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a href="#projects" className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium">View Projects</a>
              <a href="#contact" className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transform hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium">Contact Me</a>
              <a href="/Shahanur_Alam.pdf" download className="inline-block px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-sm font-medium"><Download size={14} /> Download CV</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
                <div className="text-xs font-medium text-gray-500">Location</div>
                <div className="flex items-center gap-2 mt-1 text-gray-700 font-medium"><MapPin size={14} />Rajshahi, Bangladesh</div>
              </div>

              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <div className="text-xs font-medium text-gray-500">Open to</div>
                <div className="mt-1 text-gray-700 font-medium">Internships • Junior Developer • Freelance</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border-2 border-white shadow-xl flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              <img src={profileImg} alt="Shahanur Alam" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-600 space-y-1.5">
              <div className="font-medium">Quick links</div>
              <div className="flex gap-2 sm:gap-3 justify-center">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="hover:underline hover:text-indigo-600 transition-colors text-xs font-medium">GitHub</a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-600 transition-colors text-xs font-medium">LinkedIn</a>
                <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-800 transition-colors text-xs font-medium">Facebook</a>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <article className="lg:col-span-2 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold border-b border-indigo-200 pb-3">About Me</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">I am a motivated and self-driven computer science undergraduate passionate about mobile app development. Proficient in Java and Flutter, with hands-on experience building real-world Android and cross-platform apps. Eager to contribute to innovative projects and gain practical experience through internships or entry-level roles.</p>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-800 border-l-4 border-indigo-500 pl-3">Education</h4>
                <div className="text-gray-700 text-sm sm:text-base">B.Sc. in Computer Science & Engineering — Varendra University, Rajshahi (Expected graduation: 2026)</div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-800 border-l-4 border-purple-500 pl-3">Achievements</h4>
                <ul className="mt-2 space-y-2 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    Winner — University Innovation Hub Competition (led a team project for mobile app development)
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold border-b border-indigo-200 pb-3">Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((s) => (
                <span key={s} className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg text-xs sm:text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors cursor-pointer">{s}</span>
              ))}
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 border-b border-indigo-200 pb-2 mb-3">Tools & Frameworks</h4>
              <div className="text-gray-700 text-sm sm:text-base">Flutter, Android Studio, Firebase, MySQL, XAMPP, Git & GitHub</div>
            </div>
          </aside>
        </section>

        <section id="projects" className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-8 sm:mt-10">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 border-b border-indigo-200 pb-3">Selected Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p.title} className="group bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{p.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {p.stack.map((t) => (
                    <span key={t} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-xs sm:text-sm font-medium text-blue-700">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 sm:gap-6 items-center">
                  <a href={p.link} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors">View Project →</a>
                  <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">View Source</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 mt-8 sm:mt-10 bg-gradient-to-br from-white to-indigo-50 p-6 sm:p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">Contact</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 text-center leading-relaxed max-w-md mx-auto">I'm open to internships, freelance or junior developer roles. Send me a message and I will reply as soon as I can.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-800 border-l-4 border-indigo-500 pl-3">Reach me</h4>
              <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-indigo-500" />
                  <a href="mailto:shahanuralam.dev@gmail.com" className="hover:text-indigo-600 font-medium transition-colors">shahanuralam.dev@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-500" />
                  <a href="tel:+8801518939114" className="hover:text-green-600 font-medium transition-colors">+8801518939114</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>Rajshahi, Bangladesh</span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 text-xs sm:text-sm font-medium">
                  <Github size={14} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-xs sm:text-sm font-medium">
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a href="https://www.facebook.com/ShahanurAlam2k3" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-800 hover:bg-blue-50 transition-all duration-300 text-xs sm:text-sm font-medium">
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>

            <form className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm text-gray-600 block mb-1.5 font-medium">Name</label>
                <input className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm transition-all" placeholder="Your name" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600 block mb-1.5 font-medium">Email</label>
                <input className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm transition-all" placeholder="you@example.com" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600 block mb-1.5 font-medium">Message</label>
                <textarea className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm transition-all resize-none" rows={4} placeholder="Brief message..." />
              </div>

              <button type="button" className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Send Message
              </button>
              {/* <p className="text-xs text-gray-500 italic text-center">This is a placeholder form. Replace with your preferred contact handling.</p> */}
            </form>
          </div>
        </section>

        <footer className="w-full mt-8 sm:mt-12 py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-500 bg-white/50 backdrop-blur-sm border-t border-indigo-100">
          © {new Date().getFullYear()} Shahanur Alam — Built with React & Tailwind
        </footer>
      </main>
    </div>
  );
}