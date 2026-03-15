import { useEffect } from "react";

const KEEPER_INTERVAL_MS = 3 * 60 * 1000; // every 3 minutes
const KEEP_ALIVE_PATH = "/api/keep-alive";

export function KeepAlivePing() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      return undefined;
    }

    let cancelled = false;
    const ping = async () => {
      if (cancelled) {
        return;
      }

      try {
        await fetch(KEEP_ALIVE_PATH, { cache: "no-store" });
      } catch {
        // Ignore any errors; the purpose is just to keep the server awake.
      }
    };

    ping();
    const intervalId = window.setInterval(ping, KEEPER_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
