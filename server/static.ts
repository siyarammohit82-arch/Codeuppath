import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getSeoForPath, injectSeoIntoHtml } from "./seo";

export function serveStatic(app: Express) {
  const distPath = process.env.VERCEL
    ? path.resolve(process.cwd(), "public")
    : path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  if (!process.env.VERCEL) {
    app.use(express.static(distPath));
  }

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", async (req, res, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      const seo = await getSeoForPath(req.path);
      res.status(200).set({ "Content-Type": "text/html" }).send(injectSeoIntoHtml(template, seo));
    } catch (error) {
      next(error);
    }
  });
}
