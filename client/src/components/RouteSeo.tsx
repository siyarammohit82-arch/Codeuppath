import { publicIndexablePaths, siteConfig } from "@shared/site-config";
import { SharedStructuredData, buildStructuredDataForPage, getPageMeta, PageMeta } from "@shared/seo-meta";
import { useLocation } from "wouter";
import { Seo } from "@/components/Seo";

function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
  return configuredUrl ? configuredUrl.replace(/\/+$/, "") : window.location.origin;
}

function renderPageSeo(pathname: string): { meta: PageMeta; structuredData: SharedStructuredData } {
  const meta = getPageMeta(pathname);
  const structuredData = buildStructuredDataForPage(getSiteUrl(), pathname, meta);
  return { meta, structuredData };
}

export function RouteSeo() {
  const [location] = useLocation();
  const siteUrl = getSiteUrl();

  const normalizedLocation = location.split("?")[0] || "/";

  if (normalizedLocation === "/") {
    const { meta, structuredData } = renderPageSeo("/");
    return (
    <Seo
      title={meta.title}
      description={meta.description}
      path="/"
      keywords={meta.keywords}
      structuredData={structuredData}
      type={meta.type}
      robots={meta.robots}
    />
    );
  }

  if (normalizedLocation === "/hackathons" || normalizedLocation === "/learning-resources" || normalizedLocation === "/blog" || normalizedLocation === "/contact" || normalizedLocation === "/product" || normalizedLocation === "/ai-roadmap") {
    const { meta, structuredData } = renderPageSeo(normalizedLocation);
    return (
      <Seo
        title={meta.title}
        description={meta.description}
        path={normalizedLocation}
        keywords={meta.keywords}
        structuredData={structuredData}
        type={meta.type}
        robots={meta.robots}
      />
    );
  }

  if (normalizedLocation === "/internships" || normalizedLocation === "/certifications" || normalizedLocation === "/resume-guidance" || normalizedLocation === "/opportunities") {
    const { meta, structuredData } = renderPageSeo(normalizedLocation);
    return (
      <Seo
        title={meta.title}
        description={meta.description}
        path={normalizedLocation}
        keywords={meta.keywords}
        structuredData={structuredData}
        type={meta.type}
        robots={meta.robots}
      />
    );
  }

  if (location === "/login") {
    return (
      <Seo
        title="Login"
        description="Sign in to your CodeUpPath account to access your dashboard, profile, and roadmap tools."
        path={location}
        noindex
      />
    );
  }

  if (location === "/dashboard") {
    return (
      <Seo
        title="Dashboard"
        description="View your private CodeUpPath dashboard analytics and profile-based recommendations."
        path={location}
        noindex
      />
    );
  }

  if (location === "/profile") {
    return (
      <Seo
        title="Complete your profile"
        description="Complete your CodeUpPath profile to unlock personalized recommendations and dashboard insights."
        path={location}
        noindex
      />
    );
  }


  if (/^\/hackathons\/[^/]+$/.test(location)) {
    return (
      <Seo
        title="Hackathon details"
        description="View the full hackathon brief, timeline, rules, and registration link."
        path={location}
      />
    );
  }

  if (/^\/learning-resources\/[^/]+$/.test(location)) {
    return (
      <Seo
        title="Learning resource details"
        description="View the full learning resource description, outcomes, provider details, and direct platform link."
        path={location}
      />
    );
  }

  if (/^\/blog\/[^/]+$/.test(location)) {
    return (
      <Seo
        title="Blog post"
        description="Read the full blog post, summary, and key highlights."
        path={location}
        type="article"
      />
    );
  }


  if (location === "/privacy-policy") {
    return (
      <Seo
        title="Privacy Policy"
        description="Understand how CodeUpPath collects, uses, and protects your data across the platform."
        path={location}
      />
    );
  }

  if (location === "/terms-of-service") {
    return (
      <Seo
        title="Terms of Service"
        description="Legal terms for using CodeUpPath, paying for services, and participating in the community."
        path={location}
      />
    );
  }

  if (location === "/refund-policy") {
    return (
      <Seo
        title="Refund Policy"
        description="Learn when refunds are possible and how to request one if your purchase did not meet expectations."
        path={location}
        noindex
      />
    );
  }

  if (location === "/play-store") {
    return (
      <Seo
        title="Play Store Listing"
        description="Play Store title, description, and feature set for CodeUpPath."
        path={location}
        noindex
      />
    );
  }

  if (publicIndexablePaths.includes(location as (typeof publicIndexablePaths)[number])) {
    return <Seo title={siteConfig.defaultTitle} description={siteConfig.defaultDescription} path={location} />;
  }

  return <Seo title="404 Page Not Found" description="The page you are looking for could not be found." path={location} noindex />;
}
