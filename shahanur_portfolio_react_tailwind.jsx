import React from "react";

// Single-file React + Tailwind portfolio component for Md. Shahanur Alam
// Usage: drop this file into a React project (Vite/Create React App) and ensure Tailwind CSS is installed.
// Recommended: Vite + React + Tailwind. Icons use lucide-react (optional).

import { Github, Linkedin, Mail, MapPin } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      <header className="max-w-5xl mx-auto p-6 sm:p-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-semibold">SA</div>
            <div>
              <h1 className="text-xl font-semibold">Md. Shahanur Alam</h1>
              <p className="text-sm text-gray-600">Mobile App Developer • Java & Flutter</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
              <Github size={16} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="mailto:shahanuralam.dev@gmail.com" className="flex items-center gap-2 text-sm hover:underline">
              <Mail size={16} /> Email
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-10">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white p-8 rounded-2xl shadow-md">
          <div className="md:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Hi — I’m <span className="text-indigo-600">Shahanur</span>.
            </h2>
            <p className="mt-4 text-gray-600">
              Motivated computer science undergraduate from Rajshahi, Bangladesh specializing in mobile app development using Java and Flutter. I build localized, practical apps with real users in mind — from agriculture tools to management systems.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#projects" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:opacity-95">View Projects</a>
              <a href="#contact" className="inline-block px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">Contact Me</a>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-500">Location</div>
                <div className="flex items-center gap-2 mt-2 text-gray-700"><MapPin size={16} />Rajshahi, Bangladesh</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-500">Open to</div>
                <div className="mt-2 text-gray-700">Internships • Junior Developer • Freelance</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-100">
              <img src="/profile.jpg" alt="Shahanur Alam" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <div>Quick links</div>
              <div className="mt-2 flex gap-3 justify-center">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS & SUMMARY */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold">About Me</h3>
            <p className="mt-3 text-gray-600">I am a motivated and self-driven computer science undergraduate passionate about mobile app development. Proficient in Java and Flutter, with hands-on experience building real-world Android and cross-platform apps. Eager to contribute to innovative projects and gain practical experience through internships or entry-level roles.</p>

            <div className="mt-6">
              <h4 className="text-sm text-gray-500 uppercase tracking-wide">Education</h4>
              <div className="mt-2 text-gray-700">B.Sc. in Computer Science & Engineering — Varendra University, Rajshahi (Expected graduation: 2026)</div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-gray-500 uppercase tracking-wide">Achievements</h4>
              <ul className="mt-2 list-disc list-inside text-gray-700">
                <li>Winner — University Innovation Hub Competition (led a team project for mobile app development)</li>
              </ul>
            </div>
          </article>

          <aside className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm">{s}</span>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-gray-500 uppercase tracking-wide">Tools & Frameworks</h4>
              <div className="mt-2 text-gray-700">Flutter, Android Studio, Firebase, MySQL, XAMPP, Git & GitHub</div>
            </div>
          </aside>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mt-8">
          <h3 className="text-2xl font-semibold">Selected Projects</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div key={p.title} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold">{p.title}</h4>
                <p className="mt-2 text-gray-600 text-sm">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 items-center">
                  <a href={p.link} className="text-sm text-indigo-600 hover:underline">View</a>
                  <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:underline">Source</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold">Contact</h3>
          <p className="mt-2 text-gray-600">I'm open to internships, freelance or junior developer roles. Send me a message and I will reply as soon as I can.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-gray-500 uppercase tracking-wide">Reach me</h4>
              <div className="mt-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">Email: <a className="text-indigo-600 hover:underline" href="mailto:shahanuralam.dev@gmail.com">shahanuralam.dev@gmail.com</a></div>
                <div className="mt-2">Phone: <a className="text-indigo-600 hover:underline" href="tel:+8801518939114">+8801518939114</a></div>
                <div className="mt-2">Location: Rajshahi, Bangladesh</div>
              </div>

              <div className="mt-4 flex gap-3">
                <a href="https://github.com/shahanuralamofficial" target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-2 px-3 py-2 border rounded"> <Github size={14} /> GitHub</a>
                <a href="https://www.linkedin.com/in/shahanur-alam/" target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-2 px-3 py-2 border rounded"> <Linkedin size={14} /> LinkedIn</a>
              </div>
            </div>

            <form className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm text-gray-600">Name</label>
              <input className="w-full mt-1 p-2 rounded-md border" placeholder="Your name" />

              <label className="text-sm text-gray-600 mt-3 block">Email</label>
              <input className="w-full mt-1 p-2 rounded-md border" placeholder="you@example.com" />

              <label className="text-sm text-gray-600 mt-3 block">Message</label>
              <textarea className="w-full mt-1 p-2 rounded-md border" rows={4} placeholder="Brief message..." />

              <div className="mt-3">
                <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Send — mailto</button>
                <div className="text-xs text-gray-500 mt-2">(This is a placeholder form. Replace with your preferred contact handling / Netlify function / email API.)</div>
              </div>
            </form>
          </div>
        </section>

        <footer className="mt-10 py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Md. Shahanur Alam — Built with React & Tailwind</footer>
      </main>
    </div>
  );
}
