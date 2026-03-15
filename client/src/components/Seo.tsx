import { useEffect } from "react";
import { siteConfig } from "@shared/site-config";

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  canonical?: string;
  type?: "website" | "article";
  robots?: string;
  noindex?: boolean;
  image?: string;
  structuredData?: StructuredData;
  keywords?: string[];
};

function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
  return configuredUrl ? configuredUrl.replace(/\/+$/, "") : window.location.origin;
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

function getOrCreateMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function getOrCreateCanonicalLink() {
  let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  return element;
}

function getOrCreateStructuredDataScript() {
  let element = document.getElementById("structured-data") as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = "structured-data";
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  return element;
}

export function Seo({
  title,
  description,
  path,
  canonical,
  type = "website",
  robots,
  noindex = false,
  image,
  structuredData,
  keywords,
}: SeoProps) {
  useEffect(() => {
    const titleWithBrand = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
    const descriptionText = description.trim() || siteConfig.defaultDescription;
    const canonicalUrl = toAbsoluteUrl(canonical || path || window.location.pathname);
    const imageUrl = toAbsoluteUrl(image || import.meta.env.VITE_SITE_OG_IMAGE?.trim() || siteConfig.defaultSocialImagePath);
    const robotsValue = noindex ? "noindex,nofollow" : robots || "index,follow";
    const keywordsValue = keywords?.join(", ") || siteConfig.defaultTitle;

    document.title = titleWithBrand;

    getOrCreateMeta("meta[name='description']", {
      name: "description",
      content: descriptionText,
    });
    getOrCreateMeta("meta[name='keywords']", {
      name: "keywords",
      content: keywordsValue,
    });
    getOrCreateMeta("meta[name='robots']", {
      name: "robots",
      content: robotsValue,
    });
    getOrCreateMeta("meta[property='og:title']", {
      property: "og:title",
      content: titleWithBrand,
    });
    getOrCreateMeta("meta[property='og:description']", {
      property: "og:description",
      content: descriptionText,
    });
    getOrCreateMeta("meta[property='og:type']", {
      property: "og:type",
      content: type,
    });
    getOrCreateMeta("meta[property='og:url']", {
      property: "og:url",
      content: canonicalUrl,
    });
    getOrCreateMeta("meta[property='og:image']", {
      property: "og:image",
      content: imageUrl,
    });
    getOrCreateMeta("meta[name='twitter:card']", {
      name: "twitter:card",
      content: "summary_large_image",
    });
    getOrCreateMeta("meta[name='twitter:title']", {
      name: "twitter:title",
      content: titleWithBrand,
    });
    getOrCreateMeta("meta[name='twitter:description']", {
      name: "twitter:description",
      content: descriptionText,
    });
    getOrCreateMeta("meta[name='twitter:image']", {
      name: "twitter:image",
      content: imageUrl,
    });

    const canonicalLink = getOrCreateCanonicalLink();
    canonicalLink.href = canonicalUrl;

    const structuredDataScript = getOrCreateStructuredDataScript();
    structuredDataScript.textContent = structuredData
      ? JSON.stringify(structuredData).replace(/</g, "\\u003c")
      : "";
  }, [canonical, description, image, keywords, noindex, path, robots, structuredData, title, type]);

  return null;
}
