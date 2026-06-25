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

export const portfolio = {
  name: "Simon Kane",
  title: "Full-stack developer & product-minded builder",
  shortBio:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. I build thoughtful, reliable interfaces with strong attention to product detail and developer experience.",
  contact: [
    { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
    { label: "GitHub", value: "github.com/SimonKane", href: "https://github.com/SimonKane" },
    { label: "LinkedIn", value: "linkedin.com/in/placeholder", href: "https://www.linkedin.com/" }
  ],
  cv: {
    fileName: "Simon_Kane_CV.placeholder.pdf",
    updated: "Replace with real date",
    summary:
      "Mock CV metadata. Replace this file/card with a real CV PDF in /public/cv and update this central data file.",
    experience: ["Senior Widget Engineer — Lorem Labs", "Frontend Developer — Ipsum Studio", "Software Intern — Dolor Systems"]
  },
  skills: ["TypeScript", "React", "Next.js", "Node.js", "CSS", "UX systems", "Testing", "APIs"],
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
      sourceUrl: "https://github.com/SimonKane/atlas-placeholder"
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
      sourceUrl: "https://github.com/SimonKane/forge-placeholder"
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
      sourceUrl: "https://github.com/SimonKane/signal-placeholder"
    }
  ] satisfies Project[]
};
