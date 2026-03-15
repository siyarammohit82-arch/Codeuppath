export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  description: string;
  highlights: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "ai-tools-changing-student-projects",
    title: "AI tools changing student projects",
    category: "AI Update",
    summary: "How students can use modern AI workflows without building shallow projects.",
    readTime: "5 min read",
    description: "AI tools ab sirf code generation tak limited nahi hain. Students unhe research acceleration, UI prototyping, debugging assistance, aur documentation quality improve karne ke liye use kar sakte hain.",
    highlights: [
      "Use AI for iteration speed, not as a replacement for core understanding",
      "Showcase real problem solving in portfolio projects",
      "Add evaluation, testing, and reasoning to make projects credible",
    ],
  },
  {
    id: 2,
    slug: "new-developer-tools-worth-tracking",
    title: "New developer tools worth tracking",
    category: "Developer Tools",
    summary: "A focused look at tools that improve coding speed, debugging, and shipping.",
    readTime: "4 min read",
    description: "Developer tooling fast change ho raha hai. Teams ab AI-assisted editors, observability platforms, and deployment pipelines combine karke much faster shipping cycles achieve kar rahe hain.",
    highlights: [
      "Faster debugging with trace-first tooling",
      "Better deployment confidence through previews and checks",
      "Improved local development through integrated AI copilots",
    ],
  },
  {
    id: 3,
    slug: "tech-terms-you-should-actually-understand",
    title: "Tech terms you should actually understand",
    category: "Tech Terms",
    summary: "Clear explainers on models, agents, vector databases, cloud runtimes, and more.",
    readTime: "6 min read",
    description: "Hype bohot hai, clarity kam. Ye post practical definitions deti hai jisse students interviews, hackathons, aur project discussions me stronger lagte hain.",
    highlights: [
      "Model, agent, and workflow me difference samajhna",
      "Vector database kab useful hai aur kab nahi",
      "Cloud runtime terms ko project examples se connect karna",
    ],
  },
  {
    id: 4,
    slug: "industry-signals-that-affect-hiring",
    title: "Industry signals that affect hiring",
    category: "Industry Trend",
    summary: "What current platform and AI shifts mean for internships and entry-level roles.",
    readTime: "5 min read",
    description: "Hiring trends mostly skill signaling aur practical proof par shift ho rahe hain. Strong portfolios, shipped demos, and visible technical depth entry-level candidates ko alag karte hain.",
    highlights: [
      "Internship competition me project quality matters more",
      "Applied AI literacy is becoming a baseline advantage",
      "Public proof of work remains a strong differentiator",
    ],
  },
];
