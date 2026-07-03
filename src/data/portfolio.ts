export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
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
      id: "atlas",
      name: "Atlas Dashboard",
      tagline: "A polished analytics dashboard concept.",
      description:
        "Lorem ipsum project description for a data-rich dashboard with thoughtful hierarchy, responsive cards, and clear workflows.",
      stack: ["Next.js", "TypeScript", "Charts", "Design Systems"],
      screenshots: ["/screenshots/atlas-placeholder.svg"],
      liveUrl: "https://example.com/atlas",
      sourceUrl: "https://github.com/SimonKane/atlas-placeholder",
    },
    {
      id: "forge",
      name: "Forge Notes",
      tagline: "A focused writing and research workspace.",
      description:
        "Placeholder for a productivity app with fast search, keyboard-first navigation, and calm editorial design.",
      stack: ["React", "IndexedDB", "CSS Modules"],
      screenshots: ["/screenshots/forge-placeholder.svg"],
      liveUrl: "https://example.com/forge",
      sourceUrl: "https://github.com/SimonKane/forge-placeholder",
    },
    {
      id: "signal",
      name: "Signal Shop",
      tagline: "A conversion-focused ecommerce storefront.",
      description:
        "Lorem ipsum ecommerce case study demonstrating product cards, trust cues, fast checkout concepts, and accessibility-minded UI.",
      stack: ["Next.js", "Commerce", "A11y"],
      screenshots: ["/screenshots/signal-placeholder.svg"],
      liveUrl: "https://example.com/signal",
      sourceUrl: "https://github.com/SimonKane/signal-placeholder",
    },
    {
      id: "nextract",
      name: "Nextract",
      tagline: "A product idea shaped from scratch.",
      description:
        "A placeholder project card for testing the carousel flow with more than three projects in the beautify view.",
      stack: ["React", "TypeScript", "Product Design"],
      screenshots: ["/screenshots/nextract-placeholder.svg"],
      liveUrl: "https://example.com/nextract",
      sourceUrl: "https://github.com/SimonKane/nextract-placeholder",
    },
  ] satisfies Project[],
};
