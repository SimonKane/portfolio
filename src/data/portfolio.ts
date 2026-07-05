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

export const portfolio = {
  name: "Simon Kane",
  title: `Full-stack developer with experience in modern web applications, product development
and problem solving. I adapt quickly to new technologies, languages and frameworks while
deepening my knowledge in cybersecurity.`,
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
      label: "ATS-friendly CV",
      fileName: "Simon Kaneborn - ATS CV.pdf",
      href: "/cv/simon-kaneborn-ats-cv.pdf",
    },
    {
      label: "CV English",
      fileName: "Simon Kaneborn - CV-en.pdf",
      href: "/cv/simon-kaneborn-cv-en.pdf",
    },
    {
      label: "CV Svenska",
      fileName: "Simon Kaneborn - CV-sv.pdf",
      href: "/cv/simon-kaneborn-cv-sv.pdf",
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
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "CSS",
    "UX systems",
    "Testing",
    "APIs",
  ],
  skillCategories: [
    {
      name: "Languages",
      items: [
        { name: "JavaScript", icon: "JS" },
        { name: "TypeScript", icon: "TS" },
        { name: "Python", icon: "PY", progress: 50 },
        { name: "C#", icon: "C#", progress: 40 },
      ],
    },
    {
      name: "Frontend",
      items: [
        { name: "React", icon: "R" },
        { name: "Redux", icon: "RX" },
        { name: "Vue.js", icon: "V" },
        { name: "HTML", icon: "H5" },
        { name: "CSS", icon: "CSS" },
        { name: "Tailwind CSS", icon: "TW" },
        { name: "Angular", icon: "A", progress: 40 },
      ],
    },
    {
      name: "Backend",
      items: [
        { name: "Node.js", icon: "ND" },
        { name: "Express.js", icon: "EX" },
        { name: "REST API Development", icon: "API" },
        { name: "Authentication (JWT)", icon: "JWT" },
        { name: "CRUD Operations", icon: "CRUD" },
        { name: "API Routing", icon: "RT" },
        { name: "Error Handling", icon: "ERR" },
        { name: "WebSockets", icon: "WS", progress: 30 },
      ],
    },
    {
      name: "Databases",
      items: [
        { name: "MySQL", icon: "SQL" },
        { name: "MongoDB", icon: "MDB" },
        { name: "Postgres", icon: "PG" },
        { name: "Redis", icon: "RDS" },
        { name: "Supabase", icon: "SB" },
        { name: "Firebase", icon: "FB" },
        { name: "Mongoose", icon: "MG" },
        { name: "Prisma", icon: "PR" },
      ],
    },
    {
      name: "API",
      items: [
        { name: "REST", icon: "REST" },
        { name: "GraphQL", icon: "GQL" },
      ],
    },
    {
      name: "Testing",
      items: [
        { name: "Jest", icon: "J" },
        { name: "Playwright", icon: "PW" },
        { name: "Cypress", icon: "CY" },
        { name: "Vitest", icon: "VI", progress: 25 },
      ],
    },
    {
      name: "AI",
      items: [
        { name: "AI Application Development", icon: "AI" },
        { name: "LLM", icon: "LLM" },
        { name: "OpenAI API", icon: "OA" },
        { name: "AI-assisted Development", icon: "AID" },
      ],
    },
    {
      name: "Cloud & DevOps",
      items: [
        { name: "AWS", icon: "AWS" },
        { name: "Docker", icon: "DK" },
        { name: "Git", icon: "GIT" },
        { name: "GitHub", icon: "GH" },
        { name: "GitHub Actions", icon: "GHA" },
        { name: "Bash", icon: "SH" },
      ],
    },
    {
      name: "Methodologies",
      items: [
        { name: "Scrum", icon: "SC" },
        { name: "TDD", icon: "TDD", progress: 70 },
        {
          name: "CI/CD",
          icon: "CI",
        },
      ],
    },
    {
      name: "Security",
      items: [{ name: "Cybersecurity", icon: "SEC", progress: 30 }],
    },
  ] satisfies SkillCategory[],
  projects: [
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
      tagline: "AI-assisted incident response dashboard for operations teams.",
      description:
        "A frontend-first showcase for classifying, prioritizing and resolving operational incidents with seeded demo data, AI-style recommendations, assignment flows, timelines and simulated Slack/SMS notifications.",
      folderIcon: "/logfixai-folder.png",
      readme: `AI Incident Manager is a portfolio-ready showcase of an AI-assisted incident response dashboard. It demonstrates how operational alerts can be classified, prioritized, assigned to the right owner and followed up with simulated Slack/SMS notifications.

The project started as a project/examensarbete prototype and is now prepared as a frontend-first showcase. The deployed portfolio version can run without a backend and includes seeded demo incidents, AI-style recommendations, ownership assignment, timeline views, filtering, a local technician roster, notification channel selection and automatic notification simulation.

Slack and SMS are not actually sent in showcase mode. The interface displays simulated delivery messages so the main incident response flow can be tested safely in any browser.

The frontend is built with Next.js, React, TypeScript and Tailwind CSS. The backend folder is kept as reference code for the original prototype and future expansion, with Express routes, MongoDB/Mongoose models, AI analysis flow, Socket.IO events and notification service integrations.`,
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
      tagline: "A product-feed tool for turning API data into usable storefront previews.",
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
      tagline: "A Trello-inspired Kanban board built from a simulated client brief.",
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
      tagline: "A private live product and company I co-founded.",
      description:
        "Triopick is my private project and the company I co-founded. I cannot share the source code publicly, but the product is live, with an official launch coming soon. It is currently in Swedish.",
      folderIcon: "/triopick-folder.png",
      readme:
        "Triopick is my private project and the company I co-founded. I cannot share the source code publicly, but the product is live, with an official launch coming soon. It is currently in Swedish.",
      stack: ["Private product", "Co-founder", "Live launch"],
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
