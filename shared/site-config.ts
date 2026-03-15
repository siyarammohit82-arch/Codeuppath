export const siteConfig = {
  name: "CodeUpPath",
  defaultTitle: "CodeUpPath | Search smarter for hackathons, learning resources, and tech growth",
  defaultDescription:
    "Discover hackathons, curated learning resources, tech insights, and career tools in one place built for students and early-career builders.",
  themeColor: "#050b14",
  defaultSocialImagePath: "/favicon.png",
} as const;

export const publicIndexablePaths = [
  "/",
  "/hackathons",
  "/learning-resources",
  "/blog",
  "/product",
  "/contact",
  "/internships",
  "/certifications",
  "/resume-guidance",
  "/opportunities",
] as const;

export const privateNoIndexPaths = ["/login", "/profile", "/dashboard", "/ai-roadmap"] as const;
