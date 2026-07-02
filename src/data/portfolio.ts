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
  title: "Full-stack developer & product-minded builder",
  shortBio:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. I build thoughtful, reliable interfaces with strong attention to product detail and developer experience.",
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
        { name: "Middleware", icon: "MW" },
        { name: "API Routing", icon: "RT" },
        { name: "File Uploads", icon: "UP" },
        { name: "Environment Variables", icon: "ENV" },
        { name: "Error Handling", icon: "ERR" },
        { name: "WebSockets", icon: "WS", progress: 30 },
      ],
    },
    {
      name: "Databases",
      items: [
        { name: "MySQL", icon: "SQL" },
        { name: "MongoDB", icon: "MDB" },
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
        { name: "AI Agents", icon: "AG" },
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
      ],
    },
    {
      name: "Methodologies",
      items: [
        { name: "Agile Development", icon: "AGL" },
        { name: "Scrum", icon: "SC" },
        { name: "Kanban", icon: "KB" },
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
  ] satisfies Project[],
};
