"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { portfolio, type Project } from "@/data/portfolio";

type ThemeMode = "retro" | "3d" | "ugly";
type WindowId = "projects" | "cv" | "terminal" | "about" | "contact";
type WindowState = {
  id: WindowId;
  title: string;
  z: number;
  minimized: boolean;
  x: number;
  y: number;
};

type Shortcut = {
  id: WindowId;
  label: string;
  icon: IconName;
};

type IconName = "folder" | "document" | "terminal" | "info" | "contact" | "spark" | "warning";

const shortcuts: Shortcut[] = [
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "cv", label: "CV", icon: "document" },
  { id: "terminal", label: "Terminal", icon: "terminal" },
  { id: "about", label: "About", icon: "info" },
  { id: "contact", label: "Contact", icon: "contact" }
];

const commandList = [
  "help",
  "dir",
  "open projects",
  "open cv",
  "open about",
  "3d:ify",
  "3d.ify",
  "uglify",
  "retro",
  "clear"
];

export function PortfolioApp() {
  const [theme, setTheme] = useState<ThemeMode>("retro");
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [transition, setTransition] = useState("");
  const zRef = useRef(10);

  const openWindow = (id: WindowId) => {
    setWindows((current) => {
      const existing = current.find((win) => win.id === id);
      const z = ++zRef.current;

      if (existing) {
        return current.map((win) => (win.id === id ? { ...win, minimized: false, z } : win));
      }

      const index = current.length;
      return [
        ...current,
        {
          id,
          title: shortcuts.find((shortcut) => shortcut.id === id)?.label ?? id,
          z,
          minimized: false,
          x: 92 + index * 32,
          y: 96 + index * 26
        }
      ];
    });
    setStartOpen(false);
  };

  const closeWindow = (id: WindowId) => setWindows((wins) => wins.filter((win) => win.id !== id));
  const focusWindow = (id: WindowId) => {
    setWindows((wins) => wins.map((win) => (win.id === id ? { ...win, z: ++zRef.current, minimized: false } : win)));
  };
  const minimizeWindow = (id: WindowId) => {
    setWindows((wins) => wins.map((win) => (win.id === id ? { ...win, minimized: true } : win)));
  };

  const switchTheme = (next: ThemeMode) => {
    setTransition(
      next === "3d"
        ? "Aero shell is unfolding into dimensional portfolio mode"
        : next === "ugly"
          ? "Taste filter disabled. Brace for impact."
          : "Restoring Vista glass desktop"
    );
    setTheme(next);
    window.setTimeout(() => setTransition(""), 1400);
  };

  return (
    <div className={`portfolioRoot mode-${theme}`}>
      {transition && <TransitionOverlay label={transition} mode={theme} />}
      {theme === "3d" ? (
        <ThreeDPortfolio onTheme={switchTheme} />
      ) : theme === "ugly" ? (
        <UglyPortfolio onTheme={switchTheme} />
      ) : (
        <RetroDesktop
          windows={windows}
          startOpen={startOpen}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setStartOpen={setStartOpen}
          onOpen={openWindow}
          onClose={closeWindow}
          onFocus={focusWindow}
          onMinimize={minimizeWindow}
          onTheme={switchTheme}
        />
      )}
    </div>
  );
}

function RetroDesktop({
  windows,
  startOpen,
  selectedProject,
  setSelectedProject,
  setStartOpen,
  onOpen,
  onClose,
  onFocus,
  onMinimize,
  onTheme
}: {
  windows: WindowState[];
  startOpen: boolean;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  setStartOpen: (open: boolean) => void;
  onOpen: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  return (
    <main className="aeroDesktop" aria-label="Vista-inspired portfolio desktop">
      <section className="desktopHero" aria-label="Portfolio introduction">
        <p className="eyebrow">SimonOS Vista Portfolio</p>
        <h1>{portfolio.name}</h1>
        <p>{portfolio.title}</p>
      </section>

      <div className="desktopGrid" aria-label="Desktop shortcuts">
        {shortcuts.map((shortcut) => (
          <DesktopIcon key={shortcut.id} shortcut={shortcut} onOpen={() => onOpen(shortcut.id)} />
        ))}
      </div>

      {windows
        .filter((win) => !win.minimized)
        .map((win) => (
          <AeroWindow key={win.id} win={win} onFocus={onFocus} onClose={onClose} onMinimize={onMinimize}>
            <WindowContent
              id={win.id}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              onOpen={onOpen}
              onTheme={onTheme}
            />
          </AeroWindow>
        ))}

      <Taskbar
        windows={windows}
        startOpen={startOpen}
        setStartOpen={setStartOpen}
        onOpen={onOpen}
        onFocus={onFocus}
        onTheme={onTheme}
      />
    </main>
  );
}

function DesktopIcon({ shortcut, onOpen }: { shortcut: Shortcut; onOpen: () => void }) {
  return (
    <button className="desktopIcon" onDoubleClick={onOpen} onClick={onOpen} aria-label={`Open ${shortcut.label}`}>
      <span className="iconTile" aria-hidden="true">
        <Icon name={shortcut.icon} />
      </span>
      <strong>{shortcut.label}</strong>
    </button>
  );
}

function AeroWindow({
  win,
  children,
  onFocus,
  onClose,
  onMinimize
}: {
  win: WindowState;
  children: React.ReactNode;
  onFocus: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
}) {
  return (
    <section
      className="aeroWindow"
      style={{ left: win.x, top: win.y, zIndex: win.z }}
      onMouseDown={() => onFocus(win.id)}
      aria-label={`${win.title} window`}
    >
      <header className="titleBar">
        <span>{win.title}</span>
        <div className="windowControls" aria-label="Window controls">
          <button onClick={() => onMinimize(win.id)} aria-label={`Minimize ${win.title}`}>
            <span aria-hidden="true">−</span>
          </button>
          <button aria-label={`Maximize ${win.title}`}>
            <span aria-hidden="true">□</span>
          </button>
          <button className="closeControl" onClick={() => onClose(win.id)} aria-label={`Close ${win.title}`}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </header>
      <div className="windowBody">{children}</div>
    </section>
  );
}

function WindowContent({
  id,
  selectedProject,
  setSelectedProject,
  onOpen,
  onTheme
}: {
  id: WindowId;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  onOpen: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  if (id === "projects") return <FolderView selectedProject={selectedProject} setSelectedProject={setSelectedProject} />;
  if (id === "cv") return <CVView />;
  if (id === "terminal") return <Terminal onOpen={onOpen} onTheme={onTheme} />;
  if (id === "contact") return <ContactView />;
  return <AboutView />;
}

function FolderView({
  selectedProject,
  setSelectedProject
}: {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}) {
  if (selectedProject) {
    return (
      <div className="contentStack">
        <button className="secondaryButton" onClick={() => setSelectedProject(null)}>
          Back to Projects
        </button>
        <div>
          <p className="eyebrow">Project folder</p>
          <h2>{selectedProject.name}</h2>
          <p>{selectedProject.description}</p>
        </div>
        <div className="fileList">
          <article>
            <strong>README.txt</strong>
            <span>{selectedProject.tagline}</span>
          </article>
          <article>
            <strong>screenshots</strong>
            <span>{selectedProject.screenshots.join(", ")}</span>
          </article>
          <a href={selectedProject.liveUrl}>live-project.url</a>
          <a href={selectedProject.sourceUrl}>source-code.url</a>
        </div>
      </div>
    );
  }

  return (
    <div className="contentStack">
      <div>
        <p className="eyebrow">Portfolio directory</p>
        <h2>Projects</h2>
        <p>Open a folder to browse project notes, screenshots, live links, and source links.</p>
      </div>
      <div className="folderGrid">
        {portfolio.projects.map((project) => (
          <button key={project.id} onClick={() => setSelectedProject(project)}>
            <Icon name="folder" />
            <span>{project.name}</span>
            <small>{project.tagline}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function CVView() {
  return (
    <div className="contentStack">
      <div>
        <p className="eyebrow">Curriculum vitae</p>
        <h2>{portfolio.cv.fileName}</h2>
        <p>{portfolio.cv.summary}</p>
      </div>
      <p>
        <strong>Updated:</strong> {portfolio.cv.updated}
      </p>
      <ul className="timelineList">
        {portfolio.cv.experience.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="note">Place your real CV in /public/cv and update src/data/portfolio.ts.</p>
    </div>
  );
}

function AboutView() {
  return (
    <div className="contentStack">
      <div>
        <p className="eyebrow">About</p>
        <h2>{portfolio.name}</h2>
        <h3>{portfolio.title}</h3>
        <p>{portfolio.shortBio}</p>
      </div>
      <div className="chips">
        {portfolio.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

function ContactView() {
  return (
    <div className="contentStack">
      <div>
        <p className="eyebrow">Contact shortcuts</p>
        <h2>Contact</h2>
      </div>
      <div className="contactList">
        {portfolio.contact.map((link) => (
          <a key={link.label} href={link.href}>
            <strong>{link.label}</strong>
            <span>{link.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Terminal({ onOpen, onTheme }: { onOpen: (id: WindowId) => void; onTheme: (mode: ThemeMode) => void }) {
  const [lines, setLines] = useState<string[]>(["SimonOS Aero Terminal v2.0", "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const suggestions = useMemo(() => commandList.filter((command) => command.startsWith(input.toLowerCase()) && input), [input]);

  const run = (event: FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    setInput("");

    if (command === "clear") {
      setLines([]);
      return;
    }

    const output: string[] = [`C:\\PORTFOLIO> ${command}`];

    if (command === "help") output.push(commandList.join(" | "));
    else if (command === "dir") output.push("Projects  CV  Terminal.exe  About.txt  Contact.url");
    else if (command === "open projects") onOpen("projects");
    else if (command === "open cv") onOpen("cv");
    else if (command === "open about") onOpen("about");
    else if (command === "3d:ify" || command === "3d.ify") onTheme("3d");
    else if (command === "uglify") onTheme("ugly");
    else if (command === "retro") onTheme("retro");
    else output.push("Bad command or file name. Try 'help'.");

    setLines((current) => [...current, ...output]);
  };

  return (
    <div className="terminal">
      <div className="terminalOutput" aria-live="polite">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form onSubmit={run}>
        <label htmlFor="terminal-command">C:\PORTFOLIO&gt;</label>
        <input
          id="terminal-command"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
          autoComplete="off"
        />
      </form>
      {suggestions.length > 0 && <small>Suggestions: {suggestions.join(", ")}</small>}
    </div>
  );
}

function Taskbar({
  windows,
  startOpen,
  setStartOpen,
  onOpen,
  onFocus,
  onTheme
}: {
  windows: WindowState[];
  startOpen: boolean;
  setStartOpen: (open: boolean) => void;
  onOpen: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  return (
    <footer className="taskbar">
      <button className="startButton" onClick={() => setStartOpen(!startOpen)} aria-expanded={startOpen}>
        <span className="startOrb" aria-hidden="true" />
        Start
      </button>
      {startOpen && (
        <nav className="startMenu" aria-label="Start menu">
          <div className="startMenuHeader">
            <strong>{portfolio.name}</strong>
            <span>{portfolio.title}</span>
          </div>
          {shortcuts.map((shortcut) => (
            <button key={shortcut.id} onClick={() => onOpen(shortcut.id)}>
              <Icon name={shortcut.icon} />
              {shortcut.label}
            </button>
          ))}
          <hr />
          <button onClick={() => onTheme("3d")}>
            <Icon name="spark" />
            3d.ify
          </button>
          <button onClick={() => onTheme("ugly")}>
            <Icon name="warning" />
            uglify
          </button>
          <button onClick={() => onTheme("retro")}>Vista desktop</button>
        </nav>
      )}
      <div className="taskButtons" aria-label="Open windows">
        {windows.map((win) => (
          <button key={win.id} onClick={() => onFocus(win.id)}>
            {win.title}
          </button>
        ))}
      </div>
      <time>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
    </footer>
  );
}

function ThreeDPortfolio({ onTheme }: { onTheme: (mode: ThemeMode) => void }) {
  return (
    <main className="modernShell">
      <nav className="modernNav">
        <strong>{portfolio.name}</strong>
        <span>
          <button onClick={() => onTheme("retro")}>Vista desktop</button>
          <button onClick={() => onTheme("ugly")}>Uglify</button>
        </span>
      </nav>
      <section className="hero3d">
        <p className="eyebrow">Dimensional case-study mode</p>
        <h1>{portfolio.title}</h1>
        <p>{portfolio.shortBio}</p>
        <div className="heroActions">
          <a href={portfolio.contact[0].href}>Start a conversation</a>
          <button onClick={() => onTheme("retro")}>Return to desktop</button>
        </div>
      </section>
      <section className="modernGrid" aria-label="Project highlights">
        {portfolio.projects.map((project, index) => (
          <article key={project.id} style={{ "--tilt": `${index % 2 === 0 ? -1 : 1}` } as React.CSSProperties}>
            <span className="projectIndex">0{index + 1}</span>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="chips">
              {project.stack.map((skill) => (
                <small key={skill}>{skill}</small>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="glassPanel">
        <h2>Skills & contact</h2>
        <p>{portfolio.skills.join(" · ")}</p>
        {portfolio.contact.map((contact) => (
          <a key={contact.label} href={contact.href}>
            {contact.label}
          </a>
        ))}
      </section>
    </main>
  );
}

function UglyPortfolio({ onTheme }: { onTheme: (mode: ThemeMode) => void }) {
  return (
    <main className="uglyShell">
      <div className="fakeMarquee">
        <span>WELCOME TO THE PORTFOLIO ZONE — TASTE FILTER NOT FOUND</span>
      </div>
      <h1>{portfolio.name}</h1>
      <div className="uglyActions">
        <button onClick={() => onTheme("retro")}>make it normal</button>
        <button onClick={() => onTheme("3d")}>fancy mode</button>
      </div>
      <div className="uglyCards">
        {portfolio.projects.map((project) => (
          <article key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <a href={project.liveUrl}>CLICK RESPONSIBLY</a>
          </article>
        ))}
      </div>
    </main>
  );
}

function TransitionOverlay({ label, mode }: { label: string; mode: ThemeMode }) {
  return (
    <div className={`transitionOverlay transition-${mode}`} role="status" aria-live="polite">
      <div className="transitionCard">
        <span className="transitionRing" aria-hidden="true" />
        <strong>{label}</strong>
      </div>
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    folder: <path d="M3 7.5h6l1.6 2H21v8.8A1.7 1.7 0 0 1 19.3 20H4.7A1.7 1.7 0 0 1 3 18.3V7.5Zm0-2A1.5 1.5 0 0 1 4.5 4H9l1.6 2H21v2H3V5.5Z" />,
    document: <path d="M6 3h8l4 4v14H6V3Zm8 1.8V8h3.2L14 4.8ZM8 11h8v1.6H8V11Zm0 3.2h8v1.6H8v-1.6Zm0 3.2h5v1.6H8v-1.6Z" />,
    terminal: <path d="M3 5h18v14H3V5Zm2 2v10h14V7H5Zm2 2.2 3 2.8-3 2.8-1.1-1.2 1.7-1.6-1.7-1.6L7 9.2Zm4.2 5.2H16V16h-4.8v-1.6Z" />,
    info: <path d="M11 10h2v8h-2v-8Zm0-4h2v2h-2V6Zm1 16a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
    contact: <path d="M4 5h16v14H4V5Zm2 3.2V17h12V8.2l-6 4.3-6-4.3Zm1.4-1.2 4.6 3.3L16.6 7H7.4Z" />,
    spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm6 11 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />,
    warning: <path d="M12 3 2 20h20L12 3Zm0 4 6.5 11h-13L12 7Zm-1 4h2v4h-2v-4Zm0 5h2v2h-2v-2Z" />
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
