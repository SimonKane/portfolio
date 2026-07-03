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
  "beautify",
  "uglify",
  "retro",
  "clear",
];

const WINDOW_BOTTOM_SAFE_AREA = 58;

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
      const estimatedWidth = Math.min(720, window.innerWidth - 24);
      const estimatedHeight = 340;
      const preferredX = 92 + index * 32;
      const preferredY = 96 + index * 26;
      const maxX = Math.max(0, window.innerWidth - estimatedWidth);
      const maxY = Math.max(
        0,
        window.innerHeight - WINDOW_BOTTOM_SAFE_AREA - estimatedHeight,
      );

      return [
        ...current,
        {
          id,
          title: shortcuts.find((shortcut) => shortcut.id === id)?.label ?? id,
          z,
          minimized: false,
          x: Math.max(0, Math.min(preferredX, maxX)),
          y: Math.max(0, Math.min(preferredY, maxY)),
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
  const moveWindow = (id: WindowId, x: number, y: number) => {
    setWindows((wins) =>
      wins.map((win) => (win.id === id ? { ...win, x, y } : win)),
    );
  };
  const minimizeWindow = (id: WindowId) => {
    setWindows((wins) =>
      wins.map((win) => (win.id === id ? { ...win, minimized: true } : win)),
    );
  };

  const switchTheme = (next: ThemeMode) => {
    if (next === "ugly") {
      setTransition("");
      setTheme(next);
      return;
    }

    setTransition(
      next === "3d"
        ? "Classic desktop is extruding into dimensional portfolio mode"
        : "Restoring classic Windows desktop",
    );
    setTheme(next);
    window.setTimeout(() => setTransition(""), 2800);
  };

  return (
    <div className={`portfolioRoot mode-${theme}`}>
      {transition && <TransitionOverlay label={transition} mode={theme} />}
      {theme === "3d" ? (
        <BeautifyPortfolio onTheme={switchTheme} />
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
          onMove={moveWindow}
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
  onMove,
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
  onMove: (id: WindowId, x: number, y: number) => void;
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
            onMove={onMove}
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
  onMove,
  onMinimize,
}: {
  win: WindowState;
  children: React.ReactNode;
  onFocus: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onMove: (id: WindowId, x: number, y: number) => void;
  onMinimize: (id: WindowId) => void;
}) {
  const windowRef = useRef<HTMLElement>(null);
  const [drag, setDrag] = useState<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    const bounds = windowRef.current?.getBoundingClientRect();
    if (!bounds) return;

    onFocus(win.id);
    windowRef.current?.setPointerCapture(event.pointerId);
    setDrag({
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    });
  };

  const dragWindow = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const bounds = windowRef.current?.getBoundingClientRect();
    const nextX = event.clientX - drag.offsetX;
    const nextY = event.clientY - drag.offsetY;

    if (!bounds) {
      onMove(win.id, nextX, nextY);
      return;
    }

    onMove(
      win.id,
      Math.max(0, Math.min(nextX, window.innerWidth - bounds.width)),
      Math.max(
        0,
        Math.min(
          nextY,
          window.innerHeight - WINDOW_BOTTOM_SAFE_AREA - bounds.height,
        ),
      ),
    );
  };

  const stopDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    windowRef.current?.releasePointerCapture(event.pointerId);
    setDrag(null);
  };

  return (
    <section
      ref={windowRef}
      className="aeroWindow"
      style={
        {
          left: win.x,
          top: win.y,
          zIndex: win.z,
          "--window-top": `${win.y}px`,
        } as React.CSSProperties
      }
      onMouseDown={() => onFocus(win.id)}
      onPointerMove={dragWindow}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      aria-label={`${win.title} window`}
    >
      <header className="titleBar" onPointerDown={startDrag}>
        <span>{win.title}</span>
        <div className="windowControls" aria-label="Window controls">
          <button
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMinimize(win.id)}
            aria-label={`Minimize ${win.title}`}
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={`Maximize ${win.title}`}
          >
            <span aria-hidden="true">□</span>
          </button>
          <button
            className="closeControl"
            onPointerDown={(event) => event.stopPropagation()}
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
  const [selectedCv, setSelectedCv] = useState<
    (typeof portfolio.cvFiles)[number] | null
  >(null);
  const [viewingCv, setViewingCv] = useState<
    (typeof portfolio.cvFiles)[number] | null
  >(null);

  if (viewingCv) {
    return (
      <div className="cvViewerSurface">
        <header className="cvViewerHeader">
          <button className="classicButton" onClick={() => setViewingCv(null)}>
            Back
          </button>
          <strong>{viewingCv.label}</strong>
          <a
            className="classicButton"
            href={viewingCv.href}
            download={viewingCv.fileName}
          >
            Download
          </a>
        </header>
        <iframe
          className="cvFrame"
          src={viewingCv.href}
          title={viewingCv.label}
        />
      </div>
    );
  }

  return (
    <div className="cvFileSurface">
      <div className="fileIconGrid" aria-label="CV files">
        {portfolio.cvFiles.map((cv) => (
          <button
            className="fileIcon"
            key={cv.href}
            onClick={() => setSelectedCv(cv)}
            title={`${cv.label} - ${cv.fileName}`}
          >
            <Icon name="document" />
            <span>{cv.label}</span>
          </button>
        ))}
      </div>
      {selectedCv && (
        <div
          className="cvActionDialog"
          role="dialog"
          aria-label={`${selectedCv.label} actions`}
        >
          <header>
            <strong>{selectedCv.label}</strong>
            <button
              onClick={() => setSelectedCv(null)}
              aria-label="Close CV actions"
            >
              <span aria-hidden="true">x</span>
            </button>
          </header>
          <p>{selectedCv.fileName}</p>
          <div>
            <a
              className="classicButton"
              href={selectedCv.href}
              download={selectedCv.fileName}
            >
              Download
            </a>
            <button
              className="classicButton"
              onClick={() => setViewingCv(selectedCv)}
            >
              View here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AboutView() {
  const [openFile, setOpenFile] = useState<"about" | "skills" | null>(null);

  if (openFile !== "skills") {
    return (
      <div className="fileIconGrid" aria-label="About files">
        <button className="fileIcon" onClick={() => setOpenFile("about")}>
          <FileImageIcon src="/about-icon.png" alt="" />
          <span>About.txt</span>
        </button>
        <button className="fileIcon" onClick={() => setOpenFile("skills")}>
          <FileImageIcon
            src="https://static.vecteezy.com/system/resources/thumbnails/010/332/153/small_2x/code-flat-color-outline-icon-free-png.png"
            alt=""
          />
          <span>Skills.ini</span>
        </button>
      </div>
    );
  }

  return (
    <div className="skillsSurface" aria-label="Skills.ini">
      <header className="skillsHeader">
        <button className="skillsBackButton" onClick={() => setOpenFile(null)}>
          <Icon name="folder" />
          <span>.. About</span>
        </button>
        <div>
          <h2>Skills.ini</h2>
          <p>{portfolio.shortBio}</p>
        </div>
      </header>

      <div className="skillsCategoryList">
        {portfolio.skillCategories.map((category) => (
          <section className="skillsCategory" key={category.name}>
            <h3>{category.name}</h3>
            <div className="skillsGrid">
              {category.items.map((skill) => (
                <div
                  className="skillTile"
                  key={`${category.name}-${skill.name}`}
                >
                  <span className="skillIcon" aria-hidden="true">
                    <TechIcon label={skill.name} fallback={skill.icon} />
                  </span>
                  <span className="skillName">{skill.name}</span>
                  {typeof skill.progress === "number" && (
                    <span className="skillProgressWrap">
                      <span className="skillProgressText">
                        Progress {skill.progress}%
                      </span>
                      <span
                        className="skillProgress"
                        aria-label={`${skill.name} progress ${skill.progress}%`}
                      >
                        <span style={{ width: `${skill.progress}%` }} />
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FileImageIcon({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img className="fileIconImage" src={src} alt={alt} draggable="false" />
  );
}

const TECH_ICON_SOURCES: Record<string, string> = {
  "ai application development": "/svg/TensorFlow.svg",
  angular: "/svg/Angular.svg",
  "api routing": "/svg/OpenAPI.svg",
  aws: "/svg/AWS.svg",
  bash: "/svg/Bash.svg",
  "c#": "/svg/C%23-(CSharp).svg",
  "ci/cd": "/svg/GitHub-Actions.svg",
  css: "/svg/CSS3.svg",
  cypress: "/svg/Cypress.svg",
  docker: "/svg/Docker.svg",
  "express.js": "/svg/Express.svg",
  firebase: "/svg/Firebase.svg",
  git: "/svg/Git.svg",
  github: "/svg/GitHub.svg",
  "github actions": "/svg/GitHub-Actions.svg",
  graphql: "/svg/GraphQL.svg",
  html: "/svg/HTML5.svg",
  javascript: "/svg/JavaScript.svg",
  jest: "/svg/Jest.svg",
  mongodb: "/svg/MongoDB.svg",
  mongoose: "/svg/Mongoose.js.svg",
  mysql: "/svg/MySQL.svg",
  "node.js": "/svg/Node.js.svg",
  "openai api": "/svg/OpenAPI.svg",
  playwright: "/svg/Playwrite.svg",
  postgres: "/svg/PostgresSQL.svg",
  python: "/svg/Python.svg",
  react: "/svg/React.svg",
  rest: "/svg/OpenAPI.svg",
  "rest api development": "/svg/OpenAPI.svg",
  "tailwind css": "/svg/Tailwind-CSS.svg",
  tdd: "/svg/Jest.svg",
  typescript: "/svg/TypeScript.svg",
  vitest: "/svg/Vite.svg",
  "vue.js": "/svg/Vue.js.svg",
  websockets: "/svg/Socket.io.svg",
};

function TechIcon({ label, fallback }: { label: string; fallback: string }) {
  const key = label.toLowerCase();
  const iconSrc = TECH_ICON_SOURCES[key];
  if (iconSrc) {
    return (
      <img
        className="techIconSvg"
        src={iconSrc}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    );
  }

  const textIcon = (text: string, color = "#1267c7") => (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="5" width="38" height="38" rx="7" fill={color} />
      <text x="24" y="29" textAnchor="middle">
        {text}
      </text>
    </svg>
  );

  if (key.includes("javascript")) return textIcon("JS", "#f7df1e");
  if (key.includes("typescript")) return textIcon("TS", "#3178c6");
  if (key.includes("python")) {
    return (
      <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#3776ab"
          d="M12 10h17a7 7 0 0 1 7 7v6H20a6 6 0 0 0-6 6v3H8V17a7 7 0 0 1 4-7Z"
        />
        <path
          fill="#ffd43b"
          d="M36 38H19a7 7 0 0 1-7-7v-6h16a6 6 0 0 0 6-6v-3h6v15a7 7 0 0 1-4 7Z"
        />
        <circle cx="17" cy="16" r="2" fill="#fff" />
        <circle cx="31" cy="32" r="2" fill="#111" />
      </svg>
    );
  }
  if (key === "c#") return textIcon("C#", "#68217a");
  if (key.includes("react")) {
    return (
      <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="4" fill="#61dafb" />
        <ellipse
          cx="24"
          cy="24"
          rx="18"
          ry="7"
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.4"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="18"
          ry="7"
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.4"
          transform="rotate(60 24 24)"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="18"
          ry="7"
          fill="none"
          stroke="#61dafb"
          strokeWidth="2.4"
          transform="rotate(120 24 24)"
        />
      </svg>
    );
  }
  if (key.includes("vue")) {
    return (
      <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#41b883" d="M4 9h12l8 14 8-14h12L24 43 4 9Z" />
        <path fill="#35495e" d="M14 9h7l3 5 3-5h7L24 27 14 9Z" />
      </svg>
    );
  }
  if (key === "html") return textIcon("H5", "#e34f26");
  if (key === "css") return textIcon("CSS", "#1572b6");
  if (key.includes("tailwind")) {
    return (
      <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#38bdf8"
          d="M13 22c3-8 8-12 15-12 4 0 7 2 10 6-3-2-6-2-9 0-2 1-3 4-5 5-3 3-7 3-11 1Zm-3 12c3-8 8-12 15-12 4 0 7 2 10 6-3-2-6-2-9 0-2 1-3 4-5 5-3 3-7 3-11 1Z"
        />
      </svg>
    );
  }
  if (key.includes("angular")) return textIcon("A", "#dd0031");
  if (key.includes("node")) return textIcon("node", "#339933");
  if (key.includes("express")) return textIcon("ex", "#111827");
  if (key.includes("mongodb")) {
    return (
      <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#47a248"
          d="M25 4c10 8 12 18 1 32l-2 8-2-8C12 23 15 12 25 4Z"
        />
        <path fill="none" stroke="#0f3d1f" strokeWidth="2" d="M24 11v25" />
      </svg>
    );
  }
  if (key.includes("mysql")) return databaseIcon("SQL", "#00758f");
  if (key.includes("graphql")) return nodeIcon("#e10098");
  if (key.includes("jest")) return textIcon("Jest", "#99425b");
  if (key.includes("playwright")) return textIcon("PW", "#2ead33");
  if (key.includes("cypress")) return textIcon("Cy", "#17202c");
  if (key.includes("vitest")) return textIcon("Vi", "#6e9f18");
  if (key.includes("openai") || key.includes("llm") || key.includes("ai "))
    return nodeIcon("#111827");
  if (key.includes("aws")) return cloudIcon("AWS", "#ff9900");
  if (key.includes("docker")) return dockerIcon();
  if (key === "git") return branchIcon("#f05032");
  if (key.includes("github actions")) return branchIcon("#2088ff");
  if (key.includes("github")) return githubMark();
  if (key.includes("cybersecurity") || key.includes("authentication"))
    return shieldIcon();
  if (key.includes("websocket")) return nodeIcon("#2563eb");
  if (key.includes("file upload")) return arrowIcon("UP");
  if (key.includes("error")) return textIcon("ERR", "#b91c1c");
  if (key.includes("environment")) return textIcon("ENV", "#047857");
  if (key.includes("review")) return textIcon("CR", "#4f46e5");
  if (key.includes("test-driven")) return textIcon("TDD", "#0f766e");
  if (key.includes("ci/cd") || key.includes("continuous"))
    return branchIcon("#0891b2");
  if (key.includes("scrum") || key.includes("agile") || key.includes("kanban"))
    return textIcon(fallback, "#7c3aed");
  if (key.includes("api") || key.includes("rest") || key.includes("routing"))
    return apiIcon(fallback);
  if (key.includes("crud") || key.includes("middleware"))
    return textIcon(fallback, "#0f766e");

  return textIcon(fallback);
}

function databaseIcon(label: string, color: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <ellipse cx="24" cy="12" rx="15" ry="7" fill={color} />
      <path
        fill={color}
        d="M9 12h30v22c0 4-7 8-15 8S9 38 9 34V12Z"
        opacity=".86"
      />
      <ellipse cx="24" cy="34" rx="15" ry="7" fill={color} />
      <text x="24" y="29" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

function nodeIcon(color: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="14" cy="16" r="5" fill={color} />
      <circle cx="34" cy="16" r="5" fill={color} />
      <circle cx="24" cy="34" r="5" fill={color} />
      <path
        d="M18 18l12 0M17 20l5 10M31 20l-5 10"
        stroke={color}
        strokeWidth="3"
      />
    </svg>
  );
}

function cloudIcon(label: string, color: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill={color}
        d="M16 35h20a8 8 0 0 0 0-16 12 12 0 0 0-23-3 10 10 0 0 0 3 19Z"
      />
      <text x="24" y="31" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

function dockerIcon() {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#2496ed" d="M8 25h32c-2 10-8 15-18 15-8 0-13-4-14-15Z" />
      <path
        fill="#2496ed"
        d="M12 13h6v6h-6v-6Zm7 0h6v6h-6v-6Zm7 0h6v6h-6v-6ZM19 20h6v5h-6v-5Zm7 0h6v5h-6v-5Zm7 0h6v5h-6v-5Z"
      />
    </svg>
  );
}

function branchIcon(color: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M16 13v22M16 25h14a7 7 0 0 0 7-7v-3"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="12" r="6" fill={color} />
      <circle cx="16" cy="36" r="6" fill={color} />
      <circle cx="37" cy="12" r="6" fill={color} />
    </svg>
  );
}

function githubMark() {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#111827" />
      <path
        fill="#fff"
        d="M24 10a14 14 0 0 0-4 27c1 .2 1.4-.4 1.4-1v-3.3c-5.2 1.1-6.3-2.2-6.3-2.2-.8-2-2-2.6-2-2.6-1.7-1.1.1-1.1.1-1.1 1.9.1 2.9 1.9 2.9 1.9 1.7 2.9 4.4 2.1 5.4 1.6.2-1.2.7-2.1 1.2-2.5-4.1-.5-8.5-2.1-8.5-9.2 0-2 .7-3.7 1.9-5-.2-.5-.8-2.4.2-4.9 0 0 1.6-.5 5.1 1.9a18 18 0 0 1 9.2 0c3.5-2.4 5.1-1.9 5.1-1.9 1 2.5.4 4.4.2 4.9 1.2 1.3 1.9 3 1.9 5 0 7.1-4.4 8.7-8.5 9.2.7.6 1.3 1.8 1.3 3.6V36c0 .6.4 1.2 1.4 1A14 14 0 0 0 24 10Z"
      />
    </svg>
  );
}

function shieldIcon() {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#0f766e"
        d="M24 5 39 11v10c0 10-6 18-15 22C15 39 9 31 9 21V11l15-6Z"
      />
      <path fill="#fff" d="m21 29-6-6 3-3 3 3 9-10 3 3-12 13Z" />
    </svg>
  );
}

function arrowIcon(label: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#2563eb" d="M12 39h24v-8h6L24 9 6 31h6v8Z" />
      <text x="24" y="34" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

function apiIcon(label: string) {
  return (
    <svg className="techIconSvg" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
        d="m17 15-9 9 9 9m14-18 9 9-9 9"
      />
      <text x="24" y="29" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

function ContactView() {
  const [copied, setCopied] = useState(false);
  const email = portfolio.contact.find((link) =>
    link.label.toLowerCase().includes("email"),
  );

  const copyEmail = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email.value);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = email.value;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fileIconGrid" aria-label="Contact shortcuts">
      {portfolio.contact.map((link) => (
        <a className="fileIcon" key={link.label} href={link.href}>
          <Icon name={getContactIcon(link.label)} />
          <span>{link.label}</span>
        </a>
      ))}
      {email && (
        <button className="fileIcon" type="button" onClick={copyEmail}>
          <Icon name="mail" />
          <span>{copied ? "Copied" : "Copy email"}</span>
        </button>
      )}
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
  const typeTimerRef = useRef<number | null>(null);
  const themeDelayTimerRef = useRef<number | null>(null);
  const [awaitingUglifyConfirm, setAwaitingUglifyConfirm] = useState(false);
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

  useEffect(() => {
    return () => {
      if (typeTimerRef.current !== null) {
        window.clearTimeout(typeTimerRef.current);
      }
      if (themeDelayTimerRef.current !== null) {
        window.clearTimeout(themeDelayTimerRef.current);
      }
    };
  }, []);

  const typeLine = (text: string, onComplete?: () => void) => {
    if (typeTimerRef.current !== null) {
      window.clearTimeout(typeTimerRef.current);
    }

    setLines((current) => [...current, ""]);

    const typeNextCharacter = (position: number) => {
      setLines((current) =>
        current.map((line, index) =>
          index === current.length - 1 ? text.slice(0, position) : line,
        ),
      );

      if (position < text.length) {
        typeTimerRef.current = window.setTimeout(
          () => typeNextCharacter(position + 1),
          34,
        );
        return;
      }

      typeTimerRef.current = null;
      onComplete?.();
    };

    typeNextCharacter(1);
  };

  const run = (event: FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    setInput("");

    if (command === "clear") {
      if (typeTimerRef.current !== null) {
        window.clearTimeout(typeTimerRef.current);
        typeTimerRef.current = null;
      }
      if (themeDelayTimerRef.current !== null) {
        window.clearTimeout(themeDelayTimerRef.current);
        themeDelayTimerRef.current = null;
      }
      setAwaitingUglifyConfirm(false);
      setLines([]);
      return;
    }

    const output: string[] = [`C:\\PORTFOLIO> ${command}`];

    if (awaitingUglifyConfirm) {
      setLines((current) => [...current, ...output]);

      if (command === "yes") {
        setAwaitingUglifyConfirm(false);
        typeLine("ok i warned you...", () => {
          themeDelayTimerRef.current = window.setTimeout(
            () => onTheme("ugly"),
            1100,
          );
        });
        return;
      }

      if (command === "no") {
        setAwaitingUglifyConfirm(false);
        typeLine("uglify cancelled");
        return;
      }

      typeLine("type yes if you dare");
      return;
    }

    if (command === "help") output.push(commandList.join(" | "));
    else if (command === "dir")
      output.push("Projects  CV  Terminal.exe  About.txt  Contact.url");
    else if (command === "open projects") onOpen("projects");
    else if (command === "open cv") onOpen("cv");
    else if (command === "open about") onOpen("about");
    else if (command === "beautify") onTheme("3d");
    else if (command === "uglify") {
      setLines((current) => [...current, ...output]);
      setAwaitingUglifyConfirm(true);
      typeLine("Are you sure? Your eyes might bleed Yes/No");
      return;
    } else if (command === "retro") onTheme("retro");
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
  const taskbarRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (!startOpen) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        taskbarRef.current?.contains(event.target)
      ) {
        return;
      }

      setStartOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        closeOnOutsidePointerDown,
        true,
      );
    };
  }, [setStartOpen, startOpen]);

  return (
    <footer className="taskbar" ref={taskbarRef}>
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

const aboutDetailParagraphs = [
  "Programming started as curiosity. I wanted to understand how things worked, then how to improve them, and eventually how to build them from scratch. What began as self-learning quickly became something I couldn't stop doing. Today I've recently finished Full Stack Development at CHAS Academy while spending most of my free time building products, experimenting with AI and trying to expand my knowledge in cybersecurity.",
  "It actually started because I wanted to make a tiny browser game for my niece. No AI, no tutorials to copy, no Stack Overflow rabbit hole, just plain React, stubbornness and an unhealthy amount of trial and error. That little passion project eventually became <Ellie's mini game> Looking back, it might not win any awards, so be kind. But it was a project that holds a special place in my heart and a start to this journey. ",
  "I'm not particularly attached to specific frameworks or languages. Technologies change. Curiosity doesn't. I enjoy learning whatever a project requires, whether that's React, TypeScript, Node.js, cloud services or something completely new. For me it's always been more about solving problems than collecting technologies.",
  "I also love creating products from the ground up. That's how projects like TrioPick, LogFix AI and Nextract came to life. Taking an idea from a blank page to something that people can actually use is easily my favorite part of software development.",
  "Outside of programming you'll probably find me in the gym, where I spend an unreasonable amount of time convincing myself that one more set is a good idea. Music has been a huge part of my life for years as well—I write, play and produce whenever inspiration shows up. And yes, I'm a Liverpool supporter, which has taught me resilience, patience and how to emotionally recover from a football match before Monday morning.",
  "One thing I've also accepted is that I'm absolutely terrible at naming things. Variables, projects, side projects... if you've ever wondered why half of my early repositories have questionable names, now you know. Thankfully, naming things is one of the few programming problems that Git commits let you fix later.",
  "At the end of the day, I simply enjoy building things. I like working with curious people, solving interesting problems and constantly pushing myself to become a better engineer than I was yesterday. If that sounds like the kind of person you'd enjoy working with, I'd love to have a conversation.",
];

function renderAboutParagraph(paragraph: string) {
  const linkText = "<Ellie's mini game>";
  if (!paragraph.includes(linkText)) return paragraph;

  const [before, after] = paragraph.split(linkText);

  return (
    <>
      {before}
      <a
        href="https://elliesminispel.netlify.app"
        target="_blank"
        rel="noreferrer"
      >
        {linkText}
      </a>
      {after}
    </>
  );
}

function ProjectCardContent({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <>
      <span className="projectIndex">0{index + 1}</span>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div className="chips">
        {project.stack.map((skill) => (
          <small key={skill}>{skill}</small>
        ))}
      </div>
      <div className="projectLinks">
        <a href={project.liveUrl}>Live</a>
        <a href={project.sourceUrl}>Source</a>
      </div>
    </>
  );
}

function carouselSlotClass(index: number, offset: number, total: number) {
  const slot = (index - offset + total) % total;
  return slot < 3 ? `mobileSlot-${slot}` : "mobileSlotHidden";
}

function BeautifyPortfolio({
  onTheme,
}: {
  onTheme: (mode: ThemeMode) => void;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectOffset, setProjectOffset] = useState(0);
  const [cvOffset, setCvOffset] = useState(0);
  const [contactOffset, setContactOffset] = useState(0);
  const skillDragRef = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
  } | null>(null);
  const copyrightYear = new Date().getFullYear();
  const email = portfolio.contact.find((link) =>
    link.label.toLowerCase().includes("email"),
  );
  const skillsByCategory = (categoryNames: string[]) =>
    portfolio.skillCategories
      .filter((category) => categoryNames.includes(category.name))
      .flatMap((category) => category.items);
  const skillRows = [
    {
      label: "Frontend and languages",
      skills: skillsByCategory(["Languages", "Frontend"]),
    },
    {
      label: "Backend",
      skills: skillsByCategory(["Backend", "Databases", "API"]),
    },
    {
      label: "Tooling, AI, methods and security",
      skills: skillsByCategory([
        "Testing",
        "AI",
        "Cloud & DevOps",
        "Methodologies",
        "Security",
      ]),
    },
  ];
  const hasProjectCarousel = portfolio.projects.length > 3;
  const visibleProjects = [-1, 0, 1].map(
    (slot) =>
      portfolio.projects[
        (projectOffset + slot + portfolio.projects.length) %
          portfolio.projects.length
      ],
  );
  const rotateProjects = (direction: -1 | 1) => {
    setProjectOffset((current) => {
      const total = portfolio.projects.length;
      return (current + direction + total) % total;
    });
  };
  const rotateCvCards = (direction: -1 | 1) => {
    setCvOffset((current) => {
      const total = portfolio.cvFiles.length;
      return (current + direction + total) % total;
    });
  };
  const contactCardCount = portfolio.contact.length + (email ? 1 : 0);
  const rotateContactCards = (direction: -1 | 1) => {
    setContactOffset((current) => {
      return (current + direction + contactCardCount) % contactCardCount;
    });
  };

  const startSkillDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    skillDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    event.preventDefault();
  };

  const moveSkillDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = skillDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.currentTarget.scrollLeft =
      drag.scrollLeft - (event.clientX - drag.startX);
  };

  const stopSkillDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = skillDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove("is-dragging");
    skillDragRef.current = null;
  };

  const copyEmail = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email.value);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = email.value;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }

    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 1600);
  };

  return (
    <main className="modernShell" id="top">
      <nav className="modernNav">
        <a className="modernBrand" href="#top" aria-label="Go to top">
          {portfolio.name}
        </a>
        <div className="modernNavLinks" aria-label="Beautify sections">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#cv">CV</a>
          <a href="#contact">Contact</a>
        </div>
        <span className="modernModeActions">
          <button onClick={() => onTheme("retro")}>Classic desktop</button>
        </span>
      </nav>

      <section className="hero3d modernSection" aria-label="Intro">
        <div className="heroCopy">
          <h1>{portfolio.name}</h1>
          <p>{portfolio.title}</p>
          <div className="heroActions">
            <a href="#contact">Start a conversation</a>
            <a href="#projects">View work</a>
          </div>
        </div>
        <div className="heroSignal" aria-hidden="true">
          <span>Building products. Solving problems. </span>
          <strong>Fullstack Engineer</strong>
          <small>Always learning</small>
        </div>
      </section>

      <section className="modernSection modernSplit" id="about">
        <div>
          <h2>
            I&apos;m much better at building things than writing about
            myself....
          </h2>
        </div>
        <div className="aboutIntro">
          <p>{portfolio.shortBio}</p>
          <button
            className="aboutMoreButton"
            type="button"
            onClick={() => setAboutOpen(true)}
            aria-label="Read more about Simon Kane"
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </section>

      {aboutOpen && (
        <div
          className="aboutModalOverlay"
          role="presentation"
          onClick={() => setAboutOpen(false)}
        >
          <article
            className="aboutModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="aboutModalClose"
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="Close about text"
            >
              <span aria-hidden="true">x</span>
            </button>
            <h2 id="about-modal-title">A little more about me</h2>
            <div className="aboutModalText">
              {aboutDetailParagraphs.map((paragraph) => (
                <p key={paragraph}>{renderAboutParagraph(paragraph)}</p>
              ))}
            </div>
          </article>
        </div>
      )}

      <section
        className={`modernSection ${
          hasProjectCarousel ? "projectCarouselSection" : "modernGrid"
        }`}
        id="projects"
        aria-label="Project highlights"
      >
        {hasProjectCarousel ? (
          <>
            <div className="projectCarouselHeader">
              <div className="sectionHeading"></div>
            </div>
            <div className="projectCarouselFrame">
              <button
                className="projectCarouselArrow"
                type="button"
                onClick={() => rotateProjects(-1)}
                aria-label="Previous projects"
              >
                <span aria-hidden="true">&lsaquo;</span>
              </button>
              <div className="projectCarouselViewport" aria-live="polite">
                {visibleProjects.map((project, slotIndex) => {
                  const realIndex = portfolio.projects.findIndex(
                    (item) => item.id === project.id,
                  );
                  return (
                    <article
                      className={`projectCarouselCard projectSlot-${slotIndex}`}
                      key={`${project.id}-${projectOffset}-${slotIndex}`}
                    >
                      <ProjectCardContent project={project} index={realIndex} />
                    </article>
                  );
                })}
              </div>
              <button
                className="projectCarouselArrow"
                type="button"
                onClick={() => rotateProjects(1)}
                aria-label="Next projects"
              >
                <span aria-hidden="true">&rsaquo;</span>
              </button>
            </div>
          </>
        ) : (
          portfolio.projects.map((project, index) => (
            <article
              key={project.id}
              style={
                {
                  "--tilt": `${index % 2 === 0 ? -1 : 1}`,
                } as React.CSSProperties
              }
            >
              <ProjectCardContent project={project} index={index} />
            </article>
          ))
        )}
      </section>

      <section className="modernSection skillsShowcase" id="skills">
        <div className="sectionHeading">
          <h2>Current toolkit. Future unknown.</h2>
        </div>
        <div className="skillBelt" aria-label="Skill carousel">
          {skillRows.map((row) => (
            <div
              className="skillBeltScroller"
              key={row.label}
              onPointerDown={startSkillDrag}
              onPointerMove={moveSkillDrag}
              onPointerUp={stopSkillDrag}
              onPointerCancel={stopSkillDrag}
              aria-label={row.label}
            >
              <div className="skillBeltRow">
                {[...row.skills, ...row.skills].map((skill, index) => (
                  <span
                    className="modernSkillPill"
                    key={`${row.label}-${skill.name}-${index}`}
                  >
                    <TechIcon label={skill.name} fallback={skill.icon} />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="modernSection cvSection" id="cv">
        <div className="sectionHeading">
          <h2>Different audience. Same developer.</h2>
        </div>
        <div className="mobileCardFrame">
          <button
            className="mobileStackArrow"
            type="button"
            onClick={() => rotateCvCards(-1)}
            aria-label="Previous CV"
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
          <div className="cvCards mobileStackCards">
            {portfolio.cvFiles.map((cv, index) => (
              <a
                className={`cvCard ${carouselSlotClass(
                  index,
                  cvOffset,
                  portfolio.cvFiles.length,
                )}`}
                key={cv.href}
                href={cv.href}
                download
              >
                <span className="cvIconBurst" aria-hidden="true">
                  <Icon name="document" />
                </span>
                <strong>{cv.label}</strong>
              </a>
            ))}
          </div>
          <button
            className="mobileStackArrow"
            type="button"
            onClick={() => rotateCvCards(1)}
            aria-label="Next CV"
          >
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </div>
      </section>

      <section className="modernSection contactSection" id="contact">
        <div className="sectionHeading">
          <h2>Get in touch</h2>
        </div>
        <div className="mobileCardFrame">
          <button
            className="mobileStackArrow"
            type="button"
            onClick={() => rotateContactCards(-1)}
            aria-label="Previous contact option"
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
          <div className="contactCards mobileStackCards">
            {portfolio.contact.map((contact, index) => (
              <a
                className={`contactCard ${carouselSlotClass(
                  index,
                  contactOffset,
                  contactCardCount,
                )}`}
                key={contact.label}
                href={contact.href}
              >
                <Icon name={getContactIcon(contact.label)} />
                <span>{contact.label}</span>
              </a>
            ))}
            {email && (
              <button
                className={`contactCard ${carouselSlotClass(
                  portfolio.contact.length,
                  contactOffset,
                  contactCardCount,
                )}`}
                type="button"
                onClick={copyEmail}
              >
                <Icon name="mail" />
                <span>Email</span>
                <strong>{copiedEmail ? "Copied" : "Copy address"}</strong>
              </button>
            )}
          </div>
          <button
            className="mobileStackArrow"
            type="button"
            onClick={() => rotateContactCards(1)}
            aria-label="Next contact option"
          >
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </div>
      </section>

      <footer className="modernFooter">
        <p>&copy; {copyrightYear} Simon Kane</p>
      </footer>
    </main>
  );
}

function UglyPortfolio({ onTheme }: { onTheme: (mode: ThemeMode) => void }) {
  const [profileDismissed, setProfileDismissed] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectOffset, setProjectOffset] = useState(0);
  const [cvOffset, setCvOffset] = useState(0);
  const [contactOffset, setContactOffset] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [uglySkillPage, setUglySkillPage] = useState(0);
  const email = portfolio.contact.find((link) =>
    link.label.toLowerCase().includes("email"),
  );
  const loudSkills = portfolio.skillCategories.flatMap(
    (category) => category.items,
  );
  const uglySkillPageSize = 18;
  const uglySkillPageCount = Math.max(
    1,
    Math.ceil(loudSkills.length / uglySkillPageSize),
  );
  const uglySkillPages = Array.from({ length: uglySkillPageCount }, (_, page) =>
    Array.from({ length: uglySkillPageSize }, (_, pageSlot) => {
      const slotIndex = page * uglySkillPageSize + pageSlot;
      return {
        skill: loudSkills[slotIndex % loudSkills.length],
        slotIndex,
      };
    }),
  );
  const visibleProjects = [-1, 0, 1].map(
    (slot) =>
      portfolio.projects[
        (projectOffset + slot + portfolio.projects.length) %
          portfolio.projects.length
      ],
  );
  const contactCardCount = portfolio.contact.length + (email ? 1 : 0);

  const rotateProjects = (direction: -1 | 1) => {
    setProjectOffset((current) => {
      const total = portfolio.projects.length;
      return (current + direction + total) % total;
    });
  };
  const rotateCvCards = (direction: -1 | 1) => {
    setCvOffset((current) => {
      const total = portfolio.cvFiles.length;
      return (current + direction + total) % total;
    });
  };
  const rotateContactCards = (direction: -1 | 1) => {
    setContactOffset((current) => {
      return (current + direction + contactCardCount) % contactCardCount;
    });
  };
  const rotateUglySkills = (direction: -1 | 1) => {
    setUglySkillPage((current) => {
      return (current + direction + uglySkillPageCount) % uglySkillPageCount;
    });
  };
  const copyEmail = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email.value);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = email.value;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }

    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 1600);
  };

  return (
    <main className="uglyShell" id="ugly-top">
      <div className="fakeMarquee">
        <span>WELCOME TO THE PORTFOLIO ZONE - TASTE FILTER NOT FOUND</span>
      </div>

      <button
        className="uglyPanicButton"
        type="button"
        onClick={() => onTheme("3d")}
        aria-label="Take me back to beautify mode"
      >
        <span className="uglyPanicBurst" aria-hidden="true">
          <img src="/panic-button.png" alt="" draggable="false" />
        </span>
        <span className="uglyPanicLabel">Take me back</span>
      </button>

      <section className="uglyHero uglySection" aria-label="Uglify intro">
        <div className="uglyHeroCopy">
          <h1>
            Simon <span className="uglyBlinkName">Kane</span>
          </h1>
          <p>{portfolio.title}</p>
          <div className="uglyActions">
            <a href="#ugly-contact">START A CONVERSATION!!</a>
            <a href="#ugly-projects">LOOK AT WORK NOW</a>
          </div>
        </div>
        <button
          className={`uglyProfileStage ${profileDismissed ? "is-exiting" : ""}`}
          type="button"
          onClick={() => setProfileDismissed(true)}
          aria-label="Spin profile image away"
        >
          <span className="uglyProfileBurst" aria-hidden="true" />
          <img
            className="uglyProfileImage"
            src="/uglify-profile-image.png"
            alt=""
            draggable="false"
          />
        </button>
      </section>

      <section className="uglySection uglyAbout" id="ugly-about">
        <div>
          <h2>
            I&apos;m much better at building things than writing about
            myself....
          </h2>
        </div>
        <div>
          <p>{portfolio.shortBio}</p>
          <button type="button" onClick={() => setAboutOpen(true)}>
            READ TOO MUCH
          </button>
        </div>
      </section>

      {aboutOpen && (
        <div
          className="uglyModalOverlay"
          role="presentation"
          onClick={() => setAboutOpen(false)}
        >
          <article
            className="uglyModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ugly-about-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="uglyModalClose"
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="Close about text"
            >
              x
            </button>
            <h2 id="ugly-about-title">A little more about me, unfortunately</h2>
            {aboutDetailParagraphs.map((paragraph) => (
              <p key={paragraph}>{renderAboutParagraph(paragraph)}</p>
            ))}
          </article>
        </div>
      )}

      <section
        className="uglySection uglyProjectZone"
        id="ugly-projects"
        aria-label="Project highlights"
      >
        <div className="uglySectionHeader">
          <h2>PROJECTS THAT SURVIVED THE DESIGN INCIDENT</h2>
        </div>
        <div className="uglyCarousel">
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateProjects(-1)}
            aria-label="Previous projects"
          >
            &lt;&lt;
          </button>
          <div className="uglyCards" aria-live="polite">
            {visibleProjects.map((project, slotIndex) => {
              const realIndex = portfolio.projects.findIndex(
                (item) => item.id === project.id,
              );
              return (
                <article
                  className={`uglyProjectCard uglyProjectSlot-${slotIndex}`}
                  key={`${project.id}-${projectOffset}-${slotIndex}`}
                >
                  <span className="projectIndex">0{realIndex + 1}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="chips">
                    {project.stack.map((skill) => (
                      <small key={skill}>{skill}</small>
                    ))}
                  </div>
                  <div className="projectLinks">
                    <a href={project.liveUrl}>CLICK RESPONSIBLY</a>
                    <a href={project.sourceUrl}>SOURCE CHAOS</a>
                  </div>
                </article>
              );
            })}
          </div>
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateProjects(1)}
            aria-label="Next projects"
          >
            &gt;&gt;
          </button>
        </div>
      </section>

      <section className="uglySection uglySkills" id="ugly-skills">
        <div className="uglySectionHeader">
          <h2>Current toolkit. Future unknown.</h2>
        </div>
        <div className="uglySkillFrame">
          <button
            className="uglySkillArrow"
            type="button"
            onClick={() => rotateUglySkills(-1)}
            aria-label="Previous skills"
          >
            &lt;
          </button>
          <div
            className="uglySkillWall"
            aria-label="Skills"
          >
            {loudSkills.map((skill, index) => (
              <span
                className="uglySkillTile"
                key={`${skill.name}-${index}`}
                style={
                  {
                    "--skill-tilt": `${(index % 5) - 2}deg`,
                  } as React.CSSProperties
                }
              >
                <TechIcon label={skill.name} fallback={skill.icon} />
                {skill.name}
              </span>
            ))}
          </div>
          <div className="uglySkillViewport" aria-label="Skills">
            <div
              className="uglySkillTrack"
              style={
                {
                  "--skill-page": uglySkillPage,
                } as React.CSSProperties
              }
            >
              {uglySkillPages.map((page, pageIndex) => (
                <div className="uglySkillPage" key={`skill-page-${pageIndex}`}>
                  {page.map(({ skill, slotIndex }) => (
                    <span
                      className="uglySkillTile"
                      key={`${skill.name}-${slotIndex}`}
                      style={
                        {
                          "--skill-tilt": `${(slotIndex % 5) - 2}deg`,
                        } as React.CSSProperties
                      }
                    >
                      <TechIcon label={skill.name} fallback={skill.icon} />
                      {skill.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            className="uglySkillArrow"
            type="button"
            onClick={() => rotateUglySkills(1)}
            aria-label="Next skills"
          >
            &gt;
          </button>
        </div>
      </section>

      <section className="uglySection uglyDownloads" id="ugly-cv">
        <div className="uglySectionHeader">
          <h2>Different audience. Same developer.</h2>
        </div>
        <div className="uglyMiniCarousel">
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateCvCards(-1)}
            aria-label="Previous CV"
          >
            &lt;
          </button>
          <div className="uglyMiniCards">
            {portfolio.cvFiles.map((cv, index) => (
              <a
                className={`uglyCvCard ${carouselSlotClass(
                  index,
                  cvOffset,
                  portfolio.cvFiles.length,
                )}`}
                key={cv.href}
                href={cv.href}
                download
              >
                <Icon name="document" />
                <strong>{cv.label}</strong>
              </a>
            ))}
          </div>
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateCvCards(1)}
            aria-label="Next CV"
          >
            &gt;
          </button>
        </div>
      </section>

      <section className="uglySection uglyContact" id="ugly-contact">
        <div className="uglySectionHeader">
          <h2>Get in touch</h2>
        </div>
        <div className="uglyMiniCarousel">
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateContactCards(-1)}
            aria-label="Previous contact option"
          >
            &lt;
          </button>
          <div className="uglyMiniCards">
            {portfolio.contact.map((contact, index) => (
              <a
                className={`uglyContactCard ${carouselSlotClass(
                  index,
                  contactOffset,
                  contactCardCount,
                )}`}
                key={contact.label}
                href={contact.href}
              >
                <Icon name={getContactIcon(contact.label)} />
                <strong>{contact.label}</strong>
              </a>
            ))}
            {email && (
              <button
                className={`uglyContactCard ${carouselSlotClass(
                  portfolio.contact.length,
                  contactOffset,
                  contactCardCount,
                )}`}
                type="button"
                onClick={copyEmail}
              >
                <Icon name="mail" />
                <strong>{copiedEmail ? "COPIED!!!" : "COPY EMAIL"}</strong>
              </button>
            )}
          </div>
          <button
            className="uglyArrow"
            type="button"
            onClick={() => rotateContactCards(1)}
            aria-label="Next contact option"
          >
            &gt;
          </button>
        </div>
      </section>
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
