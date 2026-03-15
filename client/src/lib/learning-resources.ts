export type Category = "All" | "Web Development" | "AI" | "Programming" | "Free Certifications";

export type LearningResource = {
  id: number;
  slug: string;
  category: Exclude<Category, "All">;
  name: string;
  provider: string;
  duration: string;
  description: string;
  outcomes: string[];
  platformUrl: string;
};

export const resourceCategories: Category[] = ["All", "Web Development", "AI", "Programming", "Free Certifications"];

export const learningResources: LearningResource[] = [
  {
    id: 1,
    slug: "responsive-web-design",
    category: "Web Development",
    name: "Responsive Web Design",
    provider: "freeCodeCamp",
    duration: "40 hours",
    description: "HTML, CSS, and responsive UI fundamentals for students building their first solid frontend portfolio.",
    outcomes: ["Build responsive pages", "Understand layout systems", "Earn a free certificate"],
    platformUrl: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    id: 2,
    slug: "google-ai-essentials",
    category: "AI",
    name: "Google AI Essentials",
    provider: "Google",
    duration: "10 hours",
    description: "A practical entry point into AI workflows, prompt usage, and responsible adoption in real projects.",
    outcomes: ["Learn AI basics", "Use generative AI in workflows", "Understand responsible AI habits"],
    platformUrl: "https://www.coursera.org/professional-certificates/google-ai-essentials",
  },
  {
    id: 3,
    slug: "cs50x-introduction-to-computer-science",
    category: "Programming",
    name: "CS50x Introduction to Computer Science",
    provider: "Harvard",
    duration: "12 weeks",
    description: "Programming fundamentals, algorithms, data structures, and problem-solving for strong technical foundations.",
    outcomes: ["Learn core programming concepts", "Practice algorithmic thinking", "Build project confidence"],
    platformUrl: "https://cs50.harvard.edu/x/",
  },
  {
    id: 4,
    slug: "microsoft-learn-cloud-skills",
    category: "Free Certifications",
    name: "Microsoft Learn Cloud Skills",
    provider: "Microsoft",
    duration: "Self-paced",
    description: "Structured cloud learning paths with badges and certification preparation for developers and students.",
    outcomes: ["Prepare for certificates", "Understand cloud basics", "Track progress with badges"],
    platformUrl: "https://learn.microsoft.com/training/",
  },
];
