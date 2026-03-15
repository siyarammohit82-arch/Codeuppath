export type Hackathon = {
  id: number;
  slug: string;
  name: string;
  organizer: string;
  mode: "Online" | "Offline";
  location: string;
  prize: number;
  deadline: string;
  description: string;
  rules: string[];
  timeline: string[];
  registrationUrl: string;
};

export const hackathons: Hackathon[] = [
  {
    id: 1,
    slug: "global-ai-buildathon",
    name: "Global AI Buildathon",
    organizer: "AI Consortium",
    mode: "Online",
    location: "Worldwide",
    prize: 30000,
    deadline: "2026-04-28",
    description: "Build practical AI tools for education, productivity, or social impact with mentorship from product and ML teams.",
    rules: ["Teams of 2-5 participants", "Original idea required", "Working demo and short pitch deck mandatory"],
    timeline: ["Registration closes on April 28, 2026", "Kickoff on May 1, 2026", "Final demo day on May 10, 2026"],
    registrationUrl: "https://example.com/global-ai-buildathon",
  },
  {
    id: 2,
    slug: "europe-web-innovation-hack",
    name: "Europe Web Innovation Hack",
    organizer: "EU Dev Network",
    mode: "Offline",
    location: "Berlin, Germany",
    prize: 12000,
    deadline: "2026-05-08",
    description: "A product-focused web hackathon centered on accessibility, performance, and developer experience for the modern web.",
    rules: ["Maximum 4 members per team", "Open-source frameworks allowed", "Final prototype must be deployable"],
    timeline: ["Registration closes on May 8, 2026", "On-site hack begins on May 15, 2026", "Winners announced on May 17, 2026"],
    registrationUrl: "https://example.com/europe-web-innovation",
  },
  {
    id: 3,
    slug: "fintech-sprint-challenge",
    name: "Fintech Sprint Challenge",
    organizer: "NextBank Labs",
    mode: "Online",
    location: "Remote",
    prize: 18000,
    deadline: "2026-05-18",
    description: "Create secure fintech workflows, budgeting assistants, or inclusion-first payment tools using sandbox banking APIs.",
    rules: ["Solo and team entries accepted", "API usage report required", "Compliance and privacy section mandatory"],
    timeline: ["Registration closes on May 18, 2026", "Mentor clinic on May 20, 2026", "Submission deadline on May 29, 2026"],
    registrationUrl: "https://example.com/fintech-sprint",
  },
  {
    id: 4,
    slug: "open-source-impact-hack",
    name: "Open Source Impact Hack",
    organizer: "OSS Collective",
    mode: "Offline",
    location: "Toronto, Canada",
    prize: 10000,
    deadline: "2026-06-03",
    description: "Contribute to real open-source products, improve maintainability, and ship features that communities can adopt immediately.",
    rules: ["Team size 1-4", "At least one OSS repository contribution required", "Documentation quality is scored"],
    timeline: ["Registration closes on June 3, 2026", "Community briefing on June 7, 2026", "Closing showcase on June 14, 2026"],
    registrationUrl: "https://example.com/open-source-impact",
  },
];

export const formatPrize = (value: number) => `$${value.toLocaleString()}`;
