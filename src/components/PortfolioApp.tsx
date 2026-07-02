"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

type IconName =
  | "folder"
  | "document"
  | "terminal"
  | "info"
  | "contact"
  | "mail"
  | "github"
  | "linkedin"
  | "spark"
  | "warning";

const shortcuts: Shortcut[] = [
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "cv", label: "CV", icon: "document" },
  { id: "terminal", label: "Terminal", icon: "terminal" },
  { id: "about", label: "About", icon: "info" },
  { id: "contact", label: "Contact", icon: "contact" },
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
  "clear",
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
        return current.map((win) =>
          win.id === id ? { ...win, minimized: false, z } : win,
        );
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
          y: 96 + index * 26,
        },
      ];
    });
    setStartOpen(false);
  };

  const closeWindow = (id: WindowId) =>
    setWindows((wins) => wins.filter((win) => win.id !== id));
  const focusWindow = (id: WindowId) => {
    setWindows((wins) =>
      wins.map((win) =>
        win.id === id ? { ...win, z: ++zRef.current, minimized: false } : win,
      ),
    );
  };
  const minimizeWindow = (id: WindowId) => {
    setWindows((wins) =>
      wins.map((win) => (win.id === id ? { ...win, minimized: true } : win)),
    );
  };

  const switchTheme = (next: ThemeMode) => {
    setTransition(
      next === "3d"
        ? "Classic desktop is extruding into dimensional portfolio mode"
        : next === "ugly"
          ? "Taste filter disabled. Brace for impact."
          : "Restoring classic Windows desktop",
    );
    setTheme(next);
    window.setTimeout(() => setTransition(""), 2800);
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
  onTheme,
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
    <main
      className="aeroDesktop"
      aria-label="Oldschool Windows-inspired portfolio desktop"
    >
      <section className="desktopHero" aria-label="Portfolio introduction">
        <h1>{portfolio.name}</h1>
        <p>{portfolio.title}</p>
      </section>

      <div className="desktopGrid" aria-label="Desktop shortcuts">
        {shortcuts.map((shortcut) => (
          <DesktopIcon
            key={shortcut.id}
            shortcut={shortcut}
            onOpen={() => onOpen(shortcut.id)}
          />
        ))}
      </div>

      {windows
        .filter((win) => !win.minimized)
        .map((win) => (
          <AeroWindow
            key={win.id}
            win={win}
            onFocus={onFocus}
            onClose={onClose}
            onMinimize={onMinimize}
          >
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

function DesktopIcon({
  shortcut,
  onOpen,
}: {
  shortcut: Shortcut;
  onOpen: () => void;
}) {
  return (
    <button
      className="desktopIcon"
      onDoubleClick={onOpen}
      onClick={onOpen}
      aria-label={`Open ${shortcut.label}`}
    >
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
  onMinimize,
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
          <button
            onClick={() => onMinimize(win.id)}
            aria-label={`Minimize ${win.title}`}
          >
            <span aria-hidden="true">−</span>
          </button>
          <button aria-label={`Maximize ${win.title}`}>
            <span aria-hidden="true">□</span>
          </button>
          <button
            className="closeControl"
            onClick={() => onClose(win.id)}
            aria-label={`Close ${win.title}`}
          >
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
  onTheme,
}: {
  id: WindowId;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  onOpen: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  if (id === "projects")
    return (
      <FolderView
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    );
  if (id === "cv") return <CVView />;
  if (id === "terminal") return <Terminal onOpen={onOpen} onTheme={onTheme} />;
  if (id === "contact") return <ContactView />;
  return <AboutView />;
}

function FolderView({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}) {
  if (selectedProject) {
    return (
      <div
        className="fileIconGrid"
        aria-label={`${selectedProject.name} files`}
      >
        <button className="fileIcon" onClick={() => setSelectedProject(null)}>
          <Icon name="folder" />
          <span>.. Projects</span>
        </button>
        <button className="fileIcon">
          <Icon name="document" />
          <span>README.txt</span>
        </button>
        <button className="fileIcon">
          <Icon name="folder" />
          <span>screenshots</span>
        </button>
        <a className="fileIcon" href={selectedProject.liveUrl}>
          <Icon name="spark" />
          <span>live-project.url</span>
        </a>
        <a className="fileIcon" href={selectedProject.sourceUrl}>
          <Icon name="terminal" />
          <span>source-code.url</span>
        </a>
      </div>
    );
  }

  return (
    <div className="fileIconGrid" aria-label="Project folders">
      {portfolio.projects.map((project) => (
        <button
          className="fileIcon"
          key={project.id}
          onClick={() => setSelectedProject(project)}
        >
          <Icon name="folder" />
          <span>{project.name}</span>
        </button>
      ))}
    </div>
  );
}

function CVView() {
  return (
    <div className="fileIconGrid" aria-label="CV files">
      <button className="fileIcon">
        <Icon name="document" />
        <span>{portfolio.cv.fileName}</span>
      </button>
      <button className="fileIcon">
        <Icon name="document" />
        <span>replace-cv-readme.txt</span>
      </button>
    </div>
  );
}

function AboutView() {
  return (
    <div className="fileIconGrid" aria-label="About files">
      <button className="fileIcon">
        <Icon name="document" />
        <span>About.txt</span>
      </button>
      <button className="fileIcon">
        <Icon name="document" />
        <span>Skills.ini</span>
      </button>
    </div>
  );
}

function ContactView() {
  return (
    <div className="fileIconGrid" aria-label="Contact shortcuts">
      {portfolio.contact.map((link) => (
        <a className="fileIcon" key={link.label} href={link.href}>
          <Icon name={getContactIcon(link.label)} />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}

function getContactIcon(label: string): IconName {
  const normalized = label.toLowerCase();
  if (normalized.includes("github")) return "github";
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("mail") || normalized.includes("email"))
    return "mail";
  return "contact";
}

function Terminal({
  onOpen,
  onTheme,
}: {
  onOpen: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  const [lines, setLines] = useState<string[]>([
    "SimonOS Aero Terminal v2.0",
    "Type 'help' for commands.",
  ]);
  const [input, setInput] = useState("");
  const suggestions = useMemo(
    () =>
      commandList.filter(
        (command) => command.startsWith(input.toLowerCase()) && input,
      ),
    [input],
  );

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
    else if (command === "dir")
      output.push("Projects  CV  Terminal.exe  About.txt  Contact.url");
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
      {suggestions.length > 0 && (
        <small>Suggestions: {suggestions.join(", ")}</small>
      )}
    </div>
  );
}

function Taskbar({
  windows,
  startOpen,
  setStartOpen,
  onOpen,
  onFocus,
  onTheme,
}: {
  windows: WindowState[];
  startOpen: boolean;
  setStartOpen: (open: boolean) => void;
  onOpen: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onTheme: (mode: ThemeMode) => void;
}) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="taskbar">
      <button
        className="startButton"
        onClick={() => setStartOpen(!startOpen)}
        aria-expanded={startOpen}
      >
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
          <button onClick={() => onTheme("retro")}>Classic desktop</button>
        </nav>
      )}
      <div className="taskButtons" aria-label="Open windows">
        {windows.map((win) => (
          <button key={win.id} onClick={() => onFocus(win.id)}>
            {win.title}
          </button>
        ))}
      </div>
      <time>{currentTime}</time>
    </footer>
  );
}

function ThreeDPortfolio({ onTheme }: { onTheme: (mode: ThemeMode) => void }) {
  return (
    <main className="modernShell">
      <nav className="modernNav">
        <strong>{portfolio.name}</strong>
        <span>
          <button onClick={() => onTheme("retro")}>Classic desktop</button>
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
          <article
            key={project.id}
            style={
              { "--tilt": `${index % 2 === 0 ? -1 : 1}` } as React.CSSProperties
            }
          >
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

function TransitionOverlay({
  label,
  mode,
}: {
  label: string;
  mode: ThemeMode;
}) {
  const steps =
    mode === "3d"
      ? [
          "defragmenting desktop",
          "extruding project cards",
          "lighting glass layers",
        ]
      : [];

  return (
    <div
      className={`transitionOverlay transition-${mode}`}
      role="status"
      aria-live="polite"
    >
      <div className="transitionTunnel" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="transitionCard">
        <span className="transitionRing" aria-hidden="true" />
        <strong>{label}</strong>
        {steps.length > 0 && (
          <ol className="transitionSteps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const icons: Record<IconName, React.ReactNode> = {
    folder: (
      <>
        <path fill="#c98d12" d="M2.8 7.4h7.1l1.4 1.8h9.9v1.9H2.8V7.4Z" />
        <path fill="#ffd45a" d="M3.4 9.4h17.2l-1.4 10.2H4.8L3.4 9.4Z" />
        <path fill="#ffec9a" d="M4.4 10.3h15.1l-.3 1.8H4.7l-.3-1.8Z" />
        <path
          fill="#8f6208"
          d="M4.8 19.6h14.4l1.4-10.2h-1.7l-1 8.4H5.8L4.7 9.4H3.4l1.4 10.2Z"
          opacity=".55"
        />
      </>
    ),
    document: (
      <>
        <path fill="#f7fbff" d="M5.2 2.8h9.1l4.5 4.5v13.9H5.2V2.8Z" />
        <path fill="#d7e7ff" d="M14.3 2.8v4.5h4.5l-4.5-4.5Z" />
        <path
          fill="#2b5fc2"
          d="M7.4 10.4h8.8v1.3H7.4v-1.3Zm0 3h8.8v1.3H7.4v-1.3Zm0 3h6.2v1.3H7.4v-1.3Z"
        />
        <path
          fill="#9db8df"
          d="M5.2 2.8h9.1l4.5 4.5v13.9H5.2V2.8Zm1.4 1.4v15.6h10.8V8.2h-4.1v-4H6.6Z"
        />
      </>
    ),
    terminal: (
      <>
        <path fill="#1d2733" d="M2.8 4.4h18.4v15.2H2.8V4.4Z" />
        <path fill="#f4f4f4" d="M4.3 6.1h15.4v11.8H4.3V6.1Z" />
        <path fill="#07111f" d="M5.4 7.2h13.2v9.6H5.4V7.2Z" />
        <path
          fill="#2cff72"
          d="m7.1 9.3 3 2.7-3 2.7-1-1.1 1.8-1.6-1.8-1.6 1-1.1Zm4.2 4.4h4.9v1.2h-4.9v-1.2Z"
        />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9.3" fill="#2f7de1" />
        <circle cx="12" cy="12" r="7.4" fill="#69b8ff" />
        <path
          fill="#fff"
          d="M10.9 10.2h2.2v7.1h-2.2v-7.1Zm0-3.5h2.2v2.1h-2.2V6.7Z"
        />
      </>
    ),
    contact: (
      <>
        <path fill="#f7fbff" d="M3.5 6h17v12h-17V6Z" />
        <path fill="#7fb6ea" d="m4.7 7.2 7.3 5.2 7.3-5.2H4.7Z" />
        <path
          fill="#2b5fc2"
          d="M3.5 6h17v12h-17V6Zm1.5 2.2v8.3h14V8.2l-7 5-7-5Z"
        />
      </>
    ),
    mail: (
      <>
        <path fill="#ffffff" d="M2.8 6.2h18.4v12.5H2.8V6.2Z" />
        <path fill="#dbeafe" d="M4.1 7.6 12 13.2l7.9-5.6v9.8H4.1V7.6Z" />
        <path
          fill="#2563eb"
          d="M2.8 6.2h18.4v12.5H2.8V6.2Zm2.2 2 7 5 7-5H5Zm14.7 1.5-7.7 5.5-7.7-5.5v7.4h15.4V9.7Z"
        />
      </>
    ),
    github: (
      <>
        <circle cx="12" cy="12" r="9.5" fill="#111827" />
        <path
          fill="#ffffff"
          d="M12 5.3a6.9 6.9 0 0 0-2.2 13.4c.35.06.48-.15.48-.34v-1.26c-1.96.43-2.38-.84-2.38-.84-.32-.82-.78-1.04-.78-1.04-.64-.44.05-.43.05-.43.7.05 1.08.73 1.08.73.63 1.08 1.65.77 2.05.59.06-.46.25-.77.45-.95-1.56-.18-3.2-.78-3.2-3.48 0-.77.27-1.4.72-1.9-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 12 8.4c.6 0 1.19.08 1.75.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.5.72 1.13.72 1.9 0 2.7-1.64 3.3-3.21 3.47.25.22.48.66.48 1.34v1.86c0 .19.13.4.49.34A6.9 6.9 0 0 0 12 5.3Z"
        />
      </>
    ),
    linkedin: (
      <>
        <path
          fill="#0a66c2"
          d="M4.2 3.8h15.6a.9.9 0 0 1 .9.9v15.6a.9.9 0 0 1-.9.9H4.2a.9.9 0 0 1-.9-.9V4.7a.9.9 0 0 1 .9-.9Z"
        />
        <path
          fill="#ffffff"
          d="M7 10.2h2.4v7.4H7v-7.4Zm1.2-3.7a1.38 1.38 0 1 1 0 2.76 1.38 1.38 0 0 1 0-2.76Zm3.2 3.7h2.3v1h.03c.32-.6 1.1-1.23 2.27-1.23 2.43 0 2.88 1.6 2.88 3.68v3.95h-2.4v-3.5c0-.84-.02-1.92-1.17-1.92-1.17 0-1.35.91-1.35 1.86v3.56h-2.4v-7.4Z"
        />
      </>
    ),
    spark: (
      <>
        <path
          fill="#f7fbff"
          d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2L10 9l2-6.5Z"
        />
        <path
          fill="#69e6ff"
          d="M12 6.4 13.1 10l3.5 1-3.5 1.1L12 15.6 10.9 12l-3.5-1 3.5-1L12 6.4Z"
        />
      </>
    ),
    warning: (
      <>
        <path fill="#f7c948" d="M12 3 22 20H2L12 3Z" />
        <path
          fill="#7c3b00"
          d="M12 6.5 18.7 18H5.3L12 6.5Zm-1 4.2v4.2h2v-4.2h-2Zm0 5.3v1.6h2V16h-2Z"
        />
      </>
    ),
  };

  return (
    <svg
      className={`uiIcon icon-${name}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name]}
    </svg>
  );
}
