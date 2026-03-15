import { publicIndexablePaths, siteConfig } from "../shared/site-config";
import { buildStructuredDataForPage, getPageMeta } from "../shared/seo-meta";
import { storage } from "./storage";

function getBaseSiteUrl() {
  const configuredUrl = process.env.VITE_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const port = process.env.PORT || "5000";
  return `http://localhost:${port}`;
}

export function getAbsoluteSiteUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getBaseSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

export type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  type: "website" | "article";
  image: string;
  structuredData?: StructuredData;
  keywords?: string[];
};

function getSocialImageUrl() {
  const configuredPath = process.env.VITE_SITE_OG_IMAGE?.trim();
  return getAbsoluteSiteUrl(configuredPath || siteConfig.defaultSocialImagePath);
}

function buildStaticSeo(pathname: string): SeoPayload {
  const meta = getPageMeta(pathname);
  const image = getSocialImageUrl();
  const structuredData = buildStructuredDataForPage(getAbsoluteSiteUrl("/"), pathname, meta);
  return {
    title: meta.title,
    description: meta.description,
    canonical: getAbsoluteSiteUrl(pathname),
    robots: meta.robots || "index,follow",
    type: meta.type || "website",
    image,
    structuredData,
    keywords: meta.keywords,
  };
}

function buildDetailStructuredData(
  pathname: string,
  payload: {
    name: string;
    description: string;
    category?: string;
    provider?: string;
    organizer?: string;
    mode?: string;
  },
) {
  if (pathname.startsWith("/blog/")) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: payload.name,
      description: payload.description,
      articleSection: payload.category,
      mainEntityOfPage: getAbsoluteSiteUrl(pathname),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    };
  }

  if (pathname.startsWith("/learning-resources/")) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: payload.name,
      description: payload.description,
      provider: {
        "@type": "Organization",
        name: payload.provider || siteConfig.name,
      },
      url: getAbsoluteSiteUrl(pathname),
    };
  }

  if (pathname.startsWith("/hackathons/")) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: payload.name,
      description: payload.description,
      organizer: {
        "@type": "Organization",
        name: payload.organizer || siteConfig.name,
      },
      eventAttendanceMode:
        payload.mode === "Offline"
          ? "https://schema.org/OfflineEventAttendanceMode"
          : "https://schema.org/OnlineEventAttendanceMode",
      url: getAbsoluteSiteUrl(pathname),
    };
  }

  return undefined;
}

export async function getSeoForPath(pathname: string): Promise<SeoPayload> {
  const cleanPath = pathname.split("?")[0] || "/";

  if (cleanPath === "/" || publicIndexablePaths.includes(cleanPath as (typeof publicIndexablePaths)[number])) {
    return buildStaticSeo(cleanPath);
  }

  if (cleanPath === "/login" || cleanPath === "/profile" || cleanPath === "/dashboard" || cleanPath === "/ai-roadmap") {
    return buildStaticSeo(cleanPath);
  }

  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    const post = await storage.getBlogPostBySlug(slug);

    if (!post) {
      return buildStaticSeo(cleanPath);
    }

    const baseMeta = getPageMeta("/blog");
    const baseStructured = buildStructuredDataForPage(getAbsoluteSiteUrl("/"), "/blog", baseMeta);

    return {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.summary,
      canonical: getAbsoluteSiteUrl(cleanPath),
      robots: "index,follow",
      type: "article",
      image: getSocialImageUrl(),
      structuredData: (() => {
        const detail = buildDetailStructuredData(cleanPath, {
          name: post.title,
          description: post.summary,
          category: post.category,
        });

        return detail ? [...baseStructured, detail] : baseStructured;
      })(),
      keywords: baseMeta.keywords,
    };
  }

  const hackathonMatch = cleanPath.match(/^\/hackathons\/([^/]+)$/);
  if (hackathonMatch) {
    const slug = decodeURIComponent(hackathonMatch[1]);
    const hackathon = await storage.getHackathonBySlug(slug);

    if (!hackathon) {
      return buildStaticSeo(cleanPath);
    }

    const baseMeta = getPageMeta("/hackathons");
    const baseStructured = buildStructuredDataForPage(getAbsoluteSiteUrl("/"), "/hackathons", baseMeta);

    return {
      title: `${hackathon.name} | ${siteConfig.name}`,
      description: hackathon.description,
      canonical: getAbsoluteSiteUrl(cleanPath),
      robots: "index,follow",
      type: "website",
      image: getSocialImageUrl(),
      structuredData: (() => {
        const detail = buildDetailStructuredData(cleanPath, {
          name: hackathon.name,
          description: hackathon.description,
          organizer: hackathon.organizer,
          mode: hackathon.mode,
        });

        return detail ? [...baseStructured, detail] : baseStructured;
      })(),
      keywords: baseMeta.keywords,
    };
  }

  const learningMatch = cleanPath.match(/^\/learning-resources\/([^/]+)$/);
  if (learningMatch) {
    const slug = decodeURIComponent(learningMatch[1]);
    const resource = await storage.getLearningResourceBySlug(slug);

    if (!resource) {
      return buildStaticSeo(cleanPath);
    }

    const baseMeta = getPageMeta("/learning-resources");
    const baseStructured = buildStructuredDataForPage(getAbsoluteSiteUrl("/"), "/learning-resources", baseMeta);

    return {
      title: `${resource.name} | ${siteConfig.name}`,
      description: resource.description,
      canonical: getAbsoluteSiteUrl(cleanPath),
      robots: "index,follow",
      type: "website",
      image: getSocialImageUrl(),
      structuredData: (() => {
        const detail = buildDetailStructuredData(cleanPath, {
          name: resource.name,
          description: resource.description,
          provider: resource.provider,
        });

        return detail ? [...baseStructured, detail] : baseStructured;
      })(),
      keywords: baseMeta.keywords,
    };
  }

  return buildStaticSeo(cleanPath);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stringifyStructuredData(structuredData?: StructuredData) {
  if (!structuredData) {
    return "";
  }

  return JSON.stringify(structuredData).replace(/</g, "\\u003c");
}

export function injectSeoIntoHtml(template: string, seo: SeoPayload) {
  const replacements = new Map([
    ["__SEO_TITLE__", escapeHtml(seo.title)],
    ["__SEO_DESCRIPTION__", escapeHtml(seo.description)],
    ["__SEO_CANONICAL__", escapeHtml(seo.canonical)],
    ["__SEO_KEYWORDS__", escapeHtml(seo.keywords?.join(", ") || siteConfig.defaultTitle)],
    ["__SEO_ROBOTS__", escapeHtml(seo.robots)],
    ["__SEO_OG_TYPE__", escapeHtml(seo.type)],
    ["__SEO_OG_IMAGE__", escapeHtml(seo.image)],
    ["__SEO_OG_URL__", escapeHtml(seo.canonical)],
    ["__SEO_STRUCTURED_DATA__", stringifyStructuredData(seo.structuredData)],
    ["__GOOGLE_SITE_VERIFICATION__", escapeHtml(process.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() || "")],
  ]);

  let html = template;
  replacements.forEach((value, token) => {
    html = html.replaceAll(token, value);
  });

  return html;
}
