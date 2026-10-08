export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  readme: string;
  folderIcon?: string;
  stack: string[];
  screenshots: string[];
  liveUrl: string;
  sourceUrl: string;
};

export type SkillItem = {
  name: string;
  icon: string;
  progress?: number;
};

export type SkillCategory = {
  name: string;
  items: SkillItem[];
};

export type CvFile = {
  label: string;
  fileName: string;
  href: string;
};

const triopickDescription = `Triopick is a live Swedish football prediction PWA with around 90 real users.

I own the development across frontend, backend logic, APIs, data flows, deployment, maintenance and automated testing.

The product integrates external football data and automates flows around matches, predictions and scoring.

The source code is private, but the live product is available at triopick.se.`;

export const portfolio = {
  name: "Simon Kane",
  title: "Full Stack Product Engineer",
  tagline: "I build and ship products end to end.",
  introduction:
    "TypeScript, React, Next.js and Node.js at the core, with growing depth in AI engineering, security, cloud and developer workflows.",
  shortBio: `Before becoming a developer I spent more than a decade working in healthcare administration. I decided to start to teach my self about programming.

Today I build products and continuously try to expand my knowledge in AI and cybersecurity. I enjoy taking ideas from concept to production, especially in teams and I'm always looking for the next challenge.`,
  contact: [
    {
      label: "Email",
      value: "simon.kaneborn@gmail.com",
      href: "mailto:simon.kaneborn@gmail.com",
    },
    {
      label: "GitHub",
      value: "github.com/SimonKane",
      href: "https://github.com/SimonKane",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/placeholder",
      href: "https://www.linkedin.com/in/simon-k-2b8918327",
    },
  ],
  cvFiles: [
    {
      label: "CV – International / ATS",
      fileName: "Simon Kaneborn CV.pdf",
      href: "/cv/Simon Kaneborn CV.pdf",
    },
    {
      label: "CV – English",
      fileName: "Simon Kaneborn - CV-en.pdf",
      href: "/cv/Simon Kaneborn - CV-en.pdf",
    },
    {
      label: "CV – Svenska",
      fileName: "Simon Kaneborn CV sv.pdf",
      href: "/cv/Simon Kaneborn CV sv.pdf",
    },
  ] satisfies CvFile[],
  cv: {
    fileName: "Simon_Kane_CV.placeholder.pdf",
    updated: "Replace with real date",
    summary:
      "Mock CV metadata. Replace this file/card with a real CV PDF in /public/cv and update this central data file.",
    experience: [
      "Senior Widget Engineer — Lorem Labs",
      "Frontend Developer — Ipsum Studio",
      "Software Intern — Dolor Systems",
    ],
  },
  skillCategories: [
    {
      name: "Core",
      items: [
        { name: "TypeScript", icon: "TS" },
        { name: "JavaScript", icon: "JS" },
        { name: "React", icon: "R" },
        { name: "Next.js", icon: "NX" },
        { name: "Node.js", icon: "ND" },
        { name: "PostgreSQL", icon: "PG" },
      ],
    },
    {
      name: "Frontend",
      items: [
        { name: "React", icon: "R" },
        { name: "Next.js", icon: "NX" },
        { name: "Vue.js", icon: "V" },
        { name: "Tailwind CSS", icon: "TW" },
        { name: "MUI", icon: "MUI" },
        { name: "Responsive UI", icon: "UI" },
        { name: "Accessibility", icon: "A11Y" },
      ],
    },
    {
      name: "Backend & Data",
      items: [
        { name: "Node.js", icon: "ND" },
        { name: "Express.js", icon: "EX" },
        { name: "REST API Design", icon: "API" },
        { name: "Authentication & Authorization", icon: "AUTH" },
        { name: "PostgreSQL", icon: "PG" },
        { name: "MongoDB", icon: "MDB" },
        { name: "Prisma", icon: "PR" },
        { name: "Supabase", icon: "SB" },
        { name: "WebSockets", icon: "WS" },
      ],
    },
    {
      name: "Testing & Delivery",
      items: [
        { name: "Playwright", icon: "PW" },
        { name: "Jest", icon: "J" },
        { name: "Docker", icon: "DK" },
        { name: "AWS", icon: "AWS" },
        { name: "GitHub Actions", icon: "GHA" },
        { name: "CI/CD", icon: "CI" },
        { name: "Vercel", icon: "VC" },
      ],
    },
    {
      name: "AI & Automation",
      items: [
        { name: "AI Engineering", icon: "AI" },
        { name: "LLM Integration", icon: "LLM" },
        { name: "OpenAI API", icon: "OA" },
        { name: "Agentic Workflows", icon: "AG" },
        { name: "AI-assisted Development", icon: "AID" },
      ],
    },
    {
      name: "Growing Specialization",
      items: [
        { name: "Python", icon: "PY" },
        { name: "AI Security", icon: "AIS" },
        { name: "Cybersecurity", icon: "SEC" },
        { name: "C#", icon: "C#" },
      ],
    },
  ] satisfies SkillCategory[],
  projects: [
    {
      id: "umbrella",
      name: "Umbrella",
      tagline:
        "An atmospheric, interactive landing page created for a Swedish non-profit organization.",
      description:
        "A cinematic, scroll-driven landing page that uses animation, 3D, canvas effects and responsive performance adaptations to tell an emotionally difficult story with a powerful but relatively simple design.",
      folderIcon: "/umbrella-folder.png",
      readme: `Umbrella is an interactive landing page created for a non-profit organization in Sweden. I was honored to be trusted with the opportunity to design and build an experience around an important but difficult subject.

Despite the darkness of the theme, it felt meaningful to explore how an impactful yet relatively simple design could carry the story. The experience combines atmosphere, motion and carefully paced interactions to guide the visitor from tension toward hope without letting the visual effects overshadow the message.

Astro provides the structure, component architecture, build process and asset handling. GSAP and ScrollTrigger coordinate the animated sequences, transitions, pinned scenes and scroll-driven timing throughout the experience. Three.js renders the cinematic 3D environment, including the street, character, rain, fog, lighting and wet surfaces, while Postprocessing adds bloom, tone mapping, vignette and film grain on supported devices.

Canvas 2D powers effects such as the water-text reveal, lightning flashes, rain and umbrella splash collisions. TypeScript handles the interaction logic, animation controllers and performance adaptations, while CSS creates the responsive layouts, typography, masks, fades and atmospheric compositing. Sharp and WebP were used to optimize image assets while preserving their visual quality.

The final experience was prepared for and published through Webflow.`,
      stack: [
        "Astro",
        "GSAP",
        "ScrollTrigger",
        "Three.js",
        "Postprocessing",
        "Canvas 2D",
        "TypeScript",
        "CSS",
        "Sharp",
        "WebP",
        "Webflow",
      ],
      screenshots: [],
      liveUrl: "https://simonkaneumbrella.webflow.io/",
      sourceUrl: "https://github.com/SimonKane/CodeTVchallenge",
    },
    {
      id: "ai-recipe-generator",
      name: "AI Recipe Generator",
      tagline: "AI-assisted recipe ideas from ingredients you already have.",
      description:
        "A showcase React/Vite app where users enter ingredients and generate recipe ideas with AI-style food images, browser-side fallback generation, and included FastAPI backend code for review.",
      folderIcon: "/ai-recipe-generator-folder.png",
      readme: `AI Recipe Generator is a showcase project for exploring AI-assisted application development. Users can enter ingredients and generate recipe ideas with recipe cards and AI-style food images.

The project started as a vibe-coded frontend during a school course about modern AI tools, then expanded into an experiment in owning more of the AI flow through a custom Python/FastAPI backend. The current showcase version focuses on the frontend experience and can run as a standalone Vite/React app, while the backend remains included for review.

The frontend is built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui-inspired components and Lucide icons. It includes a browser-side fallback using Pollinations AI so the demo can still generate recipe content when the local backend is not running.

The included backend explores a FastAPI structure with recipe endpoints, SQLite/local setup notes, optional OpenAI integration and earlier semantic-search architecture. It shows the intended direction for a fuller AI-powered recipe system beyond the static showcase.`,
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "shadcn/ui",
        "Lucide React",
        "Python",
        "FastAPI",
        "SQLite",
        "Pollinations AI",
        "OpenAI API",
      ],
      screenshots: ["/ai-food-preview.png"],
      liveUrl: "https://recipe-generator-tau-ten.vercel.app/",
      sourceUrl: "https://github.com/SimonKane/recipe-generator",
    },
    {
      id: "ai-incident-manager",
      name: "AI Incident Manager",
      tagline: "AI-assisted incident response platform with a safe demo environment.",
      description:
        "AI Incident Manager is an AI-assisted incident response platform designed to classify, prioritize and route operational incidents through a structured workflow.",
      folderIcon: "/logfixai-folder.png",
      readme: `AI Incident Manager is an AI-assisted incident response platform designed to classify, prioritize and route operational incidents through a structured workflow.

The system models how incoming alerts can be analysed, assigned to the right owner, escalated when needed and followed through with timeline updates and notification flows.

The deployed version runs safely with seeded demo incidents and simulated Slack/SMS delivery, while the repository also contains the backend architecture from the original prototype, including Express routes, MongoDB/Mongoose models, AI analysis flows, Socket.IO events and notification service integrations.

The frontend is built with Next.js, React, TypeScript and Tailwind CSS. The project explores practical AI integration in operational systems, including incident classification, prioritization, ownership assignment, escalation and workflow automation.`,
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "MongoDB",
        "Mongoose",
        "Socket.IO",
        "Slack API",
        "SMS integrations",
        "AI workflow design",
      ],
      screenshots: ["/projects/ai-incident-manager/cover.png"],
      liveUrl: "https://logfixai.vercel.app/",
      sourceUrl: "https://github.com/SimonKane/ai-incident-manager",
    },
    {
      id: "nextract",
      name: "Nextract",
      tagline:
        "A product-feed tool for turning API data into usable storefront previews.",
      description:
        "An early-stage showcase prototype for helping second-hand and small online merchants load API or product data, select useful fields, save cleaned feeds, choose products and preview a simple HTML storefront concept.",
      folderIcon: "/nextract-folder.png",
      readme: `Nextract is an early-stage showcase prototype for making API-based product feeds easier to use. It was built for second-hand and small online merchants who want to work with product APIs without needing deep API knowledge.

Instead of digging through very large API responses manually, the user can load product data, choose the keys that matter, save a cleaned feed, select products and preview how those products could look in a simple HTML storefront.

The project was built during the first year at Chas Academy and became a finalist in Chas Challenge, where the team finished in second place. It is not a finished product, but a basic prototype with clear potential for further development.

The current showcase is prepared so the frontend can run without a live backend. It includes landing and auth screens, dashboard demo activity, API/data flow with fallback demo data, JSON and CSV upload in the browser, field selection, preview and local save/update using localStorage, product selection and a downloadable HTML preview concept.

The backend is kept for code review and future development. It contains the original database, upload, authentication, contact/support and chat endpoints, and expects environment variables, a configured database and external service keys for full functionality.`,
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Zustand",
        "React Hook Form",
        "React JSON View Lite",
        "Motion",
        "Tailwind CSS",
        "DaisyUI",
        "Node.js",
        "Express",
        "Prisma",
        "CSV/XML parsing",
      ],
      screenshots: ["/projects/nextract/cover.png"],
      liveUrl: "https://nextract.vercel.app/",
      sourceUrl: "https://github.com/SimonKane/Nextract",
    },
    {
      id: "trullo",
      name: "Trullo",
      tagline:
        "A Trello-inspired Kanban board built from a simulated client brief.",
      description:
        "An early school project adapted into a frontend-only portfolio showcase where users can create, edit, assign, delete, drag and reorder seeded demo tasks on a Kanban board.",
      folderIcon: "/trullo-folder.png",
      readme: `Trullo is an early school project built from a simulated client brief for a Kanban-style project management tool. The original idea was to create a small Trello-inspired application where users could manage tasks, assign work to team members and move tickets between workflow columns.

The repository currently serves as a portfolio showcase. To make the project easy to open and review, the active frontend runs without a backend: it seeds a few users and tickets locally, then stores changes in the browser with localStorage.

Users can view a seeded Kanban board, create new tickets, edit task title, description and assignee, delete tickets, drag tickets between columns, reorder tickets inside a column, filter the board to show one demo user's tasks and reset the board to the original demo data.

The backend and authentication-related code are still kept in the repository to show the intended full-stack direction of the project, including a REST API, database-backed users/tasks and JWT-based authentication.`,
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "@hello-pangea/dnd",
        "localStorage",
        "Node.js",
        "Express",
        "MongoDB",
        "Mongoose",
        "JWT",
        "bcrypt",
      ],
      screenshots: ["/trullo-preview.png"],
      liveUrl: "https://trullo-dusky.vercel.app/",
      sourceUrl: "https://github.com/SimonKane/trullo",
    },
    {
      id: "triopick",
      name: "Triopick",
      tagline: "Live football prediction platform built and operated end to end.",
      description: triopickDescription,
      folderIcon: "/triopick-folder.png",
      readme: triopickDescription,
      stack: ["Next.js", "TypeScript", "REST APIs", "Databases", "Playwright", "Product ownership"],
      screenshots: [],
      liveUrl: "https://triopick.se/",
      sourceUrl: "https://triopick.se/",
    },
    {
      id: "kalender",
      name: "Christmas Calendar",
      tagline: "A small Vue Christmas game for coding friends.",
      description:
        "Something minor i built to expand my vue knowledge as a game for my coding mates to do over christmas, swedish at the moment with plans to make it in english",
      folderIcon: "/kalender-folder.png",
      readme:
        "Something minor i built to expand my vue knowledge as a game for my coding mates to do over christmas, swedish at the moment with plans to make it in english",
      stack: ["Vue", "TypeScript", "Vite", "PixiJS"],
      screenshots: [],
      liveUrl: "https://kalender-sand.vercel.app/",
      sourceUrl: "https://github.com/SimonKane/Kalender",
    },
  ] satisfies Project[],
};
