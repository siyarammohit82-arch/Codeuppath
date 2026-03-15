import express, { type NextFunction, type Request, type Response } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

export const app = express();
export const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

let setupPromise: Promise<void> | null = null;

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined;

  const originalResJson = res.json;
  res.json = function json(bodyJson, ...args) {
    capturedJsonResponse = bodyJson as Record<string, unknown> | undefined;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

export async function setupApp() {
  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = (async () => {
    await registerRoutes(httpServer, app);

    app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
      const status =
        typeof err === "object" && err && "status" in err
          ? Number((err as { status?: number }).status) || 500
          : typeof err === "object" && err && "statusCode" in err
            ? Number((err as { statusCode?: number }).statusCode) || 500
            : 500;
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message || "Internal Server Error")
          : "Internal Server Error";

      console.error("Internal Server Error:", err);

      if (res.headersSent) {
        return next(err as never);
      }

      return res.status(status).json({ message });
    });

    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
      return;
    }

    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  })();

  return setupPromise;
}

function startSelfPing(port: number) {
  const PING_INTERVAL_MS = 4 * 60 * 1000;
  const pingUrl = `http://localhost:${port}/api/keep-alive`;

  setInterval(async () => {
    try {
      const { default: http } = await import("http");
      http.get(pingUrl, (res) => {
        res.resume();
      }).on("error", () => {});
    } catch {}
  }, PING_INTERVAL_MS);

  log(`self-ping active — pinging ${pingUrl} every 4 min`);
}

export async function startServer() {
  await setupApp();

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
      startSelfPing(port);
    },
  );
}

export default app;
