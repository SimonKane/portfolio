"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { portfolio, type Project } from "@/data/portfolio";

type ThemeMode = "retro" | "3d" | "ugly";
type WindowId = "projects" | "cv" | "terminal" | "about" | "contact";
type Win = { id: WindowId; title: string; z: number; minimized: boolean; x: number; y: number };

const shortcuts: { id: WindowId; label: string; icon: string }[] = [
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "cv", label: "CV", icon: "📄" },
  { id: "terminal", label: "Terminal", icon: "▣" },
  { id: "about", label: "About", icon: "💾" },
  { id: "contact", label: "Contact", icon: "☎" }
];
const commandList = ["help", "dir", "open projects", "open cv", "open about", "3d:ify", "uglify", "retro", "clear"];

export function PortfolioApp() {
  const [theme, setTheme] = useState<ThemeMode>("retro");
  const [windows, setWindows] = useState<Win[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [transition, setTransition] = useState<string>("");
  const zRef = useRef(10);

  const openWindow = (id: WindowId) => {
    setWindows((current) => {
      const existing = current.find((win) => win.id === id);
      const z = ++zRef.current;
      if (existing) return current.map((win) => (win.id === id ? { ...win, minimized: false, z } : win));
      const index = current.length;
      return [...current, { id, title: shortcuts.find((s) => s.id === id)?.label ?? id, z, minimized: false, x: 86 + index * 28, y: 78 + index * 24 }];
    });
    setStartOpen(false);
  };
  const closeWindow = (id: WindowId) => setWindows((wins) => wins.filter((win) => win.id !== id));
  const focusWindow = (id: WindowId) => setWindows((wins) => wins.map((win) => (win.id === id ? { ...win, z: ++zRef.current, minimized: false } : win)));
  const minimizeWindow = (id: WindowId) => setWindows((wins) => wins.map((win) => (win.id === id ? { ...win, minimized: true } : win)));
  const switchTheme = (next: ThemeMode) => {
    setTransition(next === "3d" ? "System shell upgraded" : next === "ugly" ? "Warning: taste.exe crashed" : "Restoring retro desktop");
    setTheme(next);
    window.setTimeout(() => setTransition(""), 1200);
  };

  if (theme === "3d") return <ThreeDPortfolio onTheme={switchTheme} onOpen={openWindow} />;
  if (theme === "ugly") return <UglyPortfolio onTheme={switchTheme} onOpen={openWindow} />;

  return (
    <div className="retroShell">
      {transition && <div className="transitionBanner">{transition}</div>}
      <div className="desktopGrid" aria-label="Desktop shortcuts">
        {shortcuts.map((shortcut) => <DesktopIcon key={shortcut.id} {...shortcut} onOpen={() => openWindow(shortcut.id)} />)}
      </div>
      {windows.filter((w) => !w.minimized).map((win) => (
        <RetroWindow key={win.id} win={win} onFocus={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow}>
          <WindowContent id={win.id} selectedProject={selectedProject} setSelectedProject={setSelectedProject} onOpen={openWindow} onTheme={switchTheme} />
        </RetroWindow>
      ))}
      <Taskbar windows={windows} startOpen={startOpen} setStartOpen={setStartOpen} onOpen={openWindow} onFocus={focusWindow} onTheme={switchTheme} />
    </div>
  );
}

function DesktopIcon({ label, icon, onOpen }: { label: string; icon: string; onOpen: () => void }) {
  return <button className="desktopIcon" onDoubleClick={onOpen} onClick={onOpen} aria-label={`Open ${label}`}><span>{icon}</span><strong>{label}</strong></button>;
}

function RetroWindow({ win, children, onFocus, onClose, onMinimize }: { win: Win; children: React.ReactNode; onFocus: (id: WindowId) => void; onClose: (id: WindowId) => void; onMinimize: (id: WindowId) => void }) {
  return (
    <section className="retroWindow" style={{ left: win.x, top: win.y, zIndex: win.z }} onMouseDown={() => onFocus(win.id)} aria-label={`${win.title} window`}>
      <header className="titleBar"><span>{win.title}</span><div><button onClick={() => onMinimize(win.id)} aria-label="Minimize">_</button><button aria-label="Maximize">□</button><button onClick={() => onClose(win.id)} aria-label="Close">×</button></div></header>
      <div className="windowBody">{children}</div>
    </section>
  );
}

function WindowContent(props: { id: WindowId; selectedProject: Project | null; setSelectedProject: (p: Project | null) => void; onOpen: (id: WindowId) => void; onTheme: (m: ThemeMode) => void }) {
  if (props.id === "projects") return <FolderView selectedProject={props.selectedProject} setSelectedProject={props.setSelectedProject} />;
  if (props.id === "cv") return <CVView />;
  if (props.id === "terminal") return <Terminal onOpen={props.onOpen} onTheme={props.onTheme} />;
  if (props.id === "contact") return <ContactView />;
  return <AboutView />;
}

function FolderView({ selectedProject, setSelectedProject }: { selectedProject: Project | null; setSelectedProject: (p: Project | null) => void }) {
  if (selectedProject) return <div><button className="retroButton" onClick={() => setSelectedProject(null)}>← Back to Projects</button><h2>📁 {selectedProject.name}</h2><p>{selectedProject.description}</p><div className="fileList"><article>📝 README.txt<br />{selectedProject.tagline}</article><article>🖼 screenshots<br />{selectedProject.screenshots.join(", ")}</article><a href={selectedProject.liveUrl}>🌐 live-project.url</a><a href={selectedProject.sourceUrl}>💻 source-code.url</a></div></div>;
  return <div><h2>Projects</h2><p>Double-click a folder to browse project files.</p><div className="folderGrid">{portfolio.projects.map((project) => <button key={project.id} onClick={() => setSelectedProject(project)}>📁<span>{project.name}</span><small>{project.tagline}</small></button>)}</div></div>;
}
function CVView() { return <div><h2>📄 {portfolio.cv.fileName}</h2><p>{portfolio.cv.summary}</p><p><b>Updated:</b> {portfolio.cv.updated}</p><ul>{portfolio.cv.experience.map((item) => <li key={item}>{item}</li>)}</ul><p className="note">Place your real CV in /public/cv and update src/data/portfolio.ts.</p></div>; }
function AboutView() { return <div><h2>{portfolio.name}</h2><h3>{portfolio.title}</h3><p>{portfolio.shortBio}</p><div className="chips">{portfolio.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>; }
function ContactView() { return <div><h2>Contact</h2>{portfolio.contact.map((link) => <p key={link.label}><b>{link.label}:</b> <a href={link.href}>{link.value}</a></p>)}</div>; }

function Terminal({ onOpen, onTheme }: { onOpen: (id: WindowId) => void; onTheme: (m: ThemeMode) => void }) {
  const [lines, setLines] = useState<string[]>(["SimonOS Terminal v1.0", "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const suggestions = useMemo(() => commandList.filter((c) => c.startsWith(input.toLowerCase()) && input), [input]);
  const run = (event: FormEvent) => { event.preventDefault(); const cmd = input.trim().toLowerCase(); setInput(""); if (cmd === "clear") return setLines([]); const out: string[] = [`C:\\PORTFOLIO> ${cmd}`]; if (cmd === "help") out.push(commandList.join(" | ")); else if (cmd === "dir") out.push("Projects  CV  Terminal.exe  About.txt  Contact.url"); else if (cmd === "open projects") onOpen("projects"); else if (cmd === "open cv") onOpen("cv"); else if (cmd === "open about") onOpen("about"); else if (cmd === "3d:ify") onTheme("3d"); else if (cmd === "uglify") onTheme("ugly"); else if (cmd === "retro") onTheme("retro"); else out.push("Bad command or file name. Try 'help'."); setLines((l) => [...l, ...out]); };
  return <div className="terminal"><div>{lines.map((line, i) => <p key={`${line}-${i}`}>{line}</p>)}</div><form onSubmit={run}><label>C:\PORTFOLIO&gt;</label><input value={input} onChange={(e) => setInput(e.target.value)} autoFocus aria-label="Terminal command" /></form>{suggestions.length > 0 && <small>Suggestions: {suggestions.join(", ")}</small>}</div>;
}

function Taskbar({ windows, startOpen, setStartOpen, onOpen, onFocus, onTheme }: { windows: Win[]; startOpen: boolean; setStartOpen: (b: boolean) => void; onOpen: (id: WindowId) => void; onFocus: (id: WindowId) => void; onTheme: (m: ThemeMode) => void }) {
  return <footer className="taskbar"><button className="startButton" onClick={() => setStartOpen(!startOpen)}>Start</button>{startOpen && <nav className="startMenu">{shortcuts.map((s) => <button key={s.id} onClick={() => onOpen(s.id)}>{s.icon} {s.label}</button>)}<hr /><button onClick={() => onTheme("3d")}>✨ 3d:ify</button><button onClick={() => onTheme("ugly")}>☢ uglify</button><button onClick={() => onTheme("retro")}>🪟 retro</button><button onClick={() => onOpen("terminal")}>? Help / Terminal</button></nav>}<div className="taskButtons">{windows.map((win) => <button key={win.id} onClick={() => onFocus(win.id)}>{win.title}</button>)}</div><time>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></footer>;
}

function ThreeDPortfolio({ onTheme, onOpen }: { onTheme: (m: ThemeMode) => void; onOpen: (id: WindowId) => void }) {
  return <main className="modernShell"><nav><b>{portfolio.name}</b><span><button onClick={() => onTheme("retro")}>Retro OS</button><button onClick={() => onTheme("ugly")}>Uglify</button></span></nav><section className="hero3d"><p>Premium portfolio mode</p><h1>{portfolio.title}</h1><p>{portfolio.shortBio}</p><button onClick={() => onOpen("projects")}>Explore work</button></section><section className="modernGrid">{portfolio.projects.map((p) => <article key={p.id}><span>✦</span><h2>{p.name}</h2><p>{p.description}</p><div className="chips">{p.stack.map((s) => <small key={s}>{s}</small>)}</div></article>)}</section><section className="glassPanel"><h2>Skills & contact</h2><p>{portfolio.skills.join(" · ")}</p>{portfolio.contact.map((c) => <a key={c.label} href={c.href}>{c.label}</a>)}</section></main>;
}
function UglyPortfolio({ onTheme, onOpen }: { onTheme: (m: ThemeMode) => void; onOpen: (id: WindowId) => void }) {
  return <main className="uglyShell"><div className="fakeMarquee"><span>WELCOME TO THE PORTFOLIO ZONE!!! UNDER CONSTRUCTION FOREVER!!!</span></div><h1>{portfolio.name}</h1><button onClick={() => onTheme("retro")}>make it normal</button><button onClick={() => onTheme("3d")}>fancy pants mode</button><button onClick={() => onOpen("terminal")}>terminal goblin</button><div className="uglyCards">{portfolio.projects.map((p) => <article key={p.id}><h2>💥 {p.name} 💥</h2><p>{p.description}</p><a href={p.liveUrl}>CLICK ME MAYBE</a></article>)}</div></main>;
}
