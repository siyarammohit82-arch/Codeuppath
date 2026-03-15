import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { publicIndexablePaths } from "../shared/site-config";

const DEFAULT_SITE_URL = "https://www.codeuppath.online";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getBaseSiteUrl() {
  const configured = process.env.VITE_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return DEFAULT_SITE_URL;
}

export async function generateSitemap() {
  const siteUrl = getBaseSiteUrl();
  const today = new Date().toISOString().split("T")[0];
  const urls = publicIndexablePaths.map((pathname) => {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `<url><loc>${escapeXml(`${siteUrl}${normalizedPath}`)}</loc><lastmod>${today}</lastmod></url>`;
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");

  const outputDir = path.resolve(process.cwd(), "client", "public");
  await mkdir(outputDir, { recursive: true });
  const sitemapPath = path.join(outputDir, "sitemap.xml");
  await writeFile(sitemapPath, xml + "\n", "utf-8");
}

if ((import.meta as { main?: boolean }).main) {
  await generateSitemap();
}
