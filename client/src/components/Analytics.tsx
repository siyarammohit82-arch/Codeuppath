import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag(measurementId: string) {
  if (window.gtag) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export function Analytics() {
  const [location] = useLocation();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    ensureGtag(measurementId);

    if (document.getElementById("google-analytics-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "google-analytics-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    ensureGtag(measurementId);

    window.requestAnimationFrame(() => {
      window.gtag?.("event", "page_view", {
        page_path: `${window.location.pathname}${window.location.search}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
  }, [location, measurementId]);

  return null;
}
