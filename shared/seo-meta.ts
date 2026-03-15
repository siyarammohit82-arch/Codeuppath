import { siteConfig } from "@shared/site-config";

type FAQItem = {
  question: string;
  answer: string;
};

export type PageMeta = {
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
  robots?: string;
  faq?: FAQItem[];
};

const generalFaq: FAQItem[] = [
  {
    question: "What is CodeUpPath?",
    answer:
      "CodeUpPath is a discovery and growth platform for students and developers that curates internships, hackathons, certifications, projects, and career-ready guidance.",
  },
  {
    question: "How do I find hackathons for beginners?",
    answer:
      "Use the Hackathons hub to filter by beginner-friendly tracks, deadlines, and prizes—we surface only verified and high-impact competitions.",
  },
  {
    question: "Can CodeUpPath help with developer internships in India?",
    answer:
      "Our opportunity lists, newsletters, and alerts highlight developer internships across India, the US, and remote-first companies so you never miss a deadline.",
  },
];

const targetedKeywords = [
  "tech internships for students",
  "hackathons for beginners",
  "coding opportunities platform",
  "developer internships India",
  "student career platform",
  "build resume projects",
];

const pageMetaMap: Record<string, PageMeta> = {
  "/": {
    title: "Discover tech internships, hackathons, and career launches",
    description:
      "CodeUpPath curates tech internships for students, hackathons for beginners, coding opportunities, and resume-building projects in one platform.",
    keywords: ["coding opportunities platform", "student career platform", "tech internships for students"],
    faq: generalFaq,
  },
  "/hackathons": {
    title: "Hackathons for beginners and builders",
    description:
      "Browse verified hackathons for beginners, beginner-friendly challenges, and prizes so you can build resume projects that impress.",
    keywords: ["hackathons for beginners", "coding opportunities platform"],
    faq: generalFaq,
  },
  "/learning-resources": {
    title: "Learning resources and certifications",
    description:
      "Curated certifications, courses, and reading lists to help you build resume projects, prove skills, and win developer internships.",
    keywords: ["build resume projects", "student career platform"],
    faq: generalFaq,
  },
  "/opportunities": {
    title: "Opportunities hub",
    description:
      "The Opportunities Hub lists hackathons, internships, and projects so you can discover the best coding opportunities platform for your next move.",
    keywords: ["coding opportunities platform", "tech internships for students"],
    faq: generalFaq,
  },
  "/internships": {
    title: "Developer internships in India & remote",
    description:
      "Discover developer internships India and global remote roles filtered for students and early-career builders with direct apply details.",
    keywords: ["developer internships India", "tech internships for students"],
    faq: generalFaq,
  },
  "/certifications": {
    title: "Certifications & learning tracks for builders",
    description:
      "Complete certifications that back up your resume projects, track progress, and unlock opportunities across tech, AI, and product teams.",
    keywords: ["build resume projects", "student career platform"],
    faq: generalFaq,
  },
  "/resume-guidance": {
    title: "Resume guidance & project proof",
    description:
      "Get resume guidance, project checklists, and presentation tips to showcase your internships, hackathons, and certifications.",
    keywords: ["build resume projects", "student career platform"],
    faq: generalFaq,
  },
  "/contact": {
    title: "Contact CodeUpPath support",
    description: "Contact the CodeUpPath team for partnerships, support, sponsor inquiries, and community collaboration.",
    keywords: ["coding opportunities platform"],
    faq: generalFaq,
  },
  "/blog": {
    title: "Tech blog & career playbooks",
    description:
      "Read practical posts on hackathons, internships, certifications, and resume guidance curated for students and early-career developers.",
    keywords: ["student career platform", "coding opportunities platform"],
    type: "article",
    faq: generalFaq,
  },
  "/product": {
    title: "CodeUpPath product studio",
    description:
      "Plan Play Store launches and life-product narratives with curated signals, meta coverage, and launch-ready storytelling.",
    keywords: ["coding opportunities platform"],
    faq: generalFaq,
  },
  "/ai-roadmap": {
    title: "AI roadmap builder",
    description:
      "Build a private AI learning roadmap with resume scoring, goals, and project prompts that align with internships and hackathons.",
    keywords: ["tech internships for students", "build resume projects"],
    faq: generalFaq,
    robots: "noindex,nofollow",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  const normalized = pathname.split("?")[0] || "/";

  if (normalized === "/") {
    return pageMetaMap["/"];
  }

  if (normalized.startsWith("/hackathons")) {
    return pageMetaMap["/hackathons"];
  }

  if (normalized.startsWith("/blog")) {
    return pageMetaMap["/blog"];
  }

  if (pageMetaMap[normalized]) {
    return pageMetaMap[normalized];
  }

  return pageMetaMap["/"];
}

function buildFaqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type SharedStructuredData = Array<Record<string, unknown>>;

export function buildStructuredDataForPage(siteUrl: string, pathname: string, meta: PageMeta): SharedStructuredData {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");
  const normalizedPath = pathname === "/" ? "" : pathname;
  const pageUrl = `${normalizedSiteUrl}${normalizedPath}`;

  const data: SharedStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: normalizedSiteUrl,
      logo: `${normalizedSiteUrl}/favicon.png`,
      sameAs: ["https://www.linkedin.com/company/codeuppath", "https://twitter.com/codeuppath"],
      description: siteConfig.defaultDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: normalizedSiteUrl,
      description: siteConfig.defaultDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: siteConfig.name,
      description: siteConfig.defaultDescription,
      brand: siteConfig.name,
      url: normalizedSiteUrl,
      category: "Career discovery platform",
    },
  ];

  if (meta.faq && meta.faq.length) {
    data.push(buildFaqSchema(meta.faq));
  }

  return data;
}
