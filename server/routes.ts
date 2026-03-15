import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { api } from "../shared/routes";
import { publicIndexablePaths } from "../shared/site-config";
import { z } from "zod";
import { getAccessTokenFromRequest, getSupabaseUser, isSupabaseServerConfigured } from "./supabase";
import { getAbsoluteSiteUrl } from "./seo";
import { storage } from "./storage";
import {
  createBlogPost,
  createHackathon,
  createLearningResource,
  createProduct,
  deleteBlogPost,
  deleteHackathon,
  deleteLearningResource,
  deleteProduct,
  getAdminOverview,
  listBlogPosts,
  listHackathons,
  listLearningResources,
  listProducts,
  listUsers,
  updateBlogPost,
  updateHackathon,
  updateLearningResource,
  updateProduct,
} from "./services/adminService";

type AuthenticatedSupabaseUser = {
  id: string;
  email: string;
};

function handleError(err: unknown, res: Response) {
  console.error("[api] route error", err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: err.errors[0].message,
      field: err.errors[0].path.join("."),
    });
  }

  if (err instanceof Error) {
    if (err.message.includes("unique constraint")) {
      return res.status(400).json({
        message: "Record already exists",
      });
    }

    if (err.message.includes('relation "profiles" does not exist')) {
      return res.status(500).json({
        message: "Profiles table missing. Run supabase/schema.sql in your Supabase SQL editor.",
      });
    }

    if (err.message.includes("getaddrinfo ENOENT db.") && err.message.includes(".supabase.co")) {
      return res.status(500).json({
        message: "Supabase direct DB host is not reachable from this environment. Use the Session pooler connection string from Supabase Connect instead of db.<project-ref>.supabase.co.",
      });
    }

    if (err.message.includes("Tenant or user not found")) {
      return res.status(500).json({
        message:
          "Supabase pooler connection string is incorrect. Use the Session pooler URI from Supabase Connect exactly as shown, including the postgres.<project-ref> username.",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  return res.status(500).json({ message: "Internal server error" });
}

async function requireSupabaseUser(req: Request, res: Response): Promise<AuthenticatedSupabaseUser | null> {
  if (!isSupabaseServerConfigured()) {
    res.status(500).json({ message: "Supabase auth is not configured on the server." });
    return null;
  }

  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    res.status(401).json({ message: "Missing access token." });
    return null;
  }

  const user = await getSupabaseUser(accessToken);
  if (!user?.id || !user.email) {
    res.status(401).json({ message: "Invalid or expired session." });
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

async function requireAdminUser(req: Request, res: Response): Promise<AuthenticatedSupabaseUser | null> {
  const user = await requireSupabaseUser(req, res);
  if (!user) {
    return null;
  }

  const profile = await storage.getProfileByAuthUserId(user.id);
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const isAdminEmail = admins.includes(user.email.toLowerCase());
  const isAdminRole = profile?.userRole === "admin";

  if (!isAdminEmail && !isAdminRole) {
    res.status(403).json({ message: "Unauthorized access" });
    return null;
  }

  return user;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return undefined;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /login",
        "Disallow: /profile",
        "Disallow: /dashboard",
        "Disallow: /ai-roadmap",
        `Sitemap: ${getAbsoluteSiteUrl("/sitemap.xml")}`,
      ].join("\n"),
    );
  });

  app.get("/api/keep-alive", (_req, res) => {
    res.json({ status: "ok", now: new Date().toISOString() });
  });

  app.get("/sitemap.xml", async (_req, res) => {
    const staticEntries: Array<{ loc: string; lastmod?: string }> = publicIndexablePaths.map((pathname) => ({
      loc: getAbsoluteSiteUrl(pathname),
    }));

    const dynamicEntries: Array<{ loc: string; lastmod?: string }> = [];

    try {
      const [hackathonItems, learningItems, blogItems] = await Promise.all([
        storage.getHackathons({}),
        storage.getLearningResources({}),
        storage.getBlogPosts({}),
      ]);

      dynamicEntries.push(
        ...hackathonItems.map((item) => ({
          loc: getAbsoluteSiteUrl(`/hackathons/${item.slug}`),
          lastmod: toIsoDate(item.updatedAt) || toIsoDate(item.createdAt),
        })),
      );
      dynamicEntries.push(
        ...learningItems.map((item) => ({
          loc: getAbsoluteSiteUrl(`/learning-resources/${item.slug}`),
          lastmod: toIsoDate(item.updatedAt) || toIsoDate(item.createdAt),
        })),
      );
      dynamicEntries.push(
        ...blogItems.map((item) => ({
          loc: getAbsoluteSiteUrl(`/blog/${item.slug}`),
          lastmod: toIsoDate(item.updatedAt) || toIsoDate(item.createdAt),
        })),
      );
    } catch (error) {
      console.error("[sitemap] failed to load dynamic content", error);
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...[...staticEntries, ...dynamicEntries].map(
        (entry) =>
          `<url><loc>${escapeXml(entry.loc)}</loc>${
            entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""
          }</url>`,
      ),
      "</urlset>",
    ].join("");

    res.type("application/xml").send(xml);
  });

  app.get("/api/admin/overview", async (_req, res) => {
    try {
      const admin = await requireAdminUser(_req, res);
      if (!admin) {
        return;
      }

      const overview = await getAdminOverview();
      res.json(overview);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.admin.hackathons.create.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const input = api.admin.hackathons.create.input.parse(req.body);
      const created = await createHackathon(input);
      res.status(201).json(created);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.admin.hackathons.update.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const payload = { ...req.body, id: req.params.id };
      const input = api.admin.hackathons.update.input.parse(payload);
      const updated = await updateHackathon(input);
      res.json(updated);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.delete(api.admin.hackathons.delete.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      await deleteHackathon(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/api/admin/hackathons", async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const { limit, offset } = req.query;
      const data = await listHackathons({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.json(data);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/api/admin/learning-resources", async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const { limit, offset } = req.query;
      const data = await listLearningResources({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.json(data);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.admin.learningResources.create.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const input = api.admin.learningResources.create.input.parse(req.body);
      const created = await createLearningResource(input);
      res.status(201).json(created);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.admin.learningResources.update.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const payload = { ...req.body, id: req.params.id };
      const input = api.admin.learningResources.update.input.parse(payload);
      const updated = await updateLearningResource(input);
      res.json(updated);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.delete(api.admin.learningResources.delete.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      await deleteLearningResource(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/api/admin/blog-posts", async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const { limit, offset } = req.query;
      const data = await listBlogPosts({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.json(data);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.admin.blogPosts.create.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const input = api.admin.blogPosts.create.input.parse(req.body);
      const created = await createBlogPost(input);
      res.status(201).json(created);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.admin.blogPosts.update.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const payload = { ...req.body, id: req.params.id };
      const input = api.admin.blogPosts.update.input.parse(payload);
      const updated = await updateBlogPost(input);
      res.json(updated);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.delete(api.admin.blogPosts.delete.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      await deleteBlogPost(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const { limit, offset } = req.query;
      const data = await listProducts({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.json(data);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.admin.products.create.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const input = api.admin.products.create.input.parse(req.body);
      const created = await createProduct(input);
      res.status(201).json(created);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.admin.products.update.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const payload = { ...req.body, id: req.params.id };
      const input = api.admin.products.update.input.parse(payload);
      const updated = await updateProduct(input);
      res.json(updated);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.delete(api.admin.products.delete.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      await deleteProduct(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const { limit, offset, search } = req.query;
      const data = await listUsers({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        search: typeof search === "string" ? search : undefined,
      });
      res.json(data);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.admin.contents.list.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const contents = await storage.getSiteContents();
      res.json(contents);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.admin.contents.upsert.path, async (req, res) => {
    try {
      const admin = await requireAdminUser(req, res);
      if (!admin) {
        return;
      }

      const input = api.admin.contents.upsert.input.parse(req.body);
      const { pageKey } = req.params;
      const content = await storage.upsertSiteContent(pageKey, input);
      res.json(content);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.profile.me.path, async (req, res) => {
    try {
      const user = await requireSupabaseUser(req, res);
      if (!user) {
        return;
      }

      const profile = await storage.getProfileByAuthUserId(user.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.put(api.profile.upsert.path, async (req, res) => {
    try {
      const user = await requireSupabaseUser(req, res);
      if (!user) {
        return;
      }

      const input = api.profile.upsert.input.parse(req.body);
      const profile = await storage.upsertProfile(user.id, user.email, input);
      res.json(profile);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.waitlist.create.path, async (req, res) => {
    try {
      const input = api.waitlist.create.input.parse(req.body);
      const entry = await storage.createWaitlistEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.hackathons.list.path, async (req, res) => {
    try {
      const query = api.hackathons.list.query?.parse(req.query) ?? {};
      const items = await storage.getHackathons({
        mode: query.mode,
        deadline: query.deadline,
        minPrize: query.minPrize ? Number(query.minPrize) : undefined,
      });
      res.json(items);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.hackathons.detail.path, async (req, res) => {
    try {
      const item = await storage.getHackathonBySlug(req.params.slug);

      if (!item) {
        return res.status(404).json({ message: "Hackathon not found" });
      }

      res.json(item);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.learningResources.list.path, async (req, res) => {
    try {
      const query = api.learningResources.list.query?.parse(req.query) ?? {};
      const items = await storage.getLearningResources({ category: query.category });
      res.json(items);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.learningResources.detail.path, async (req, res) => {
    try {
      const item = await storage.getLearningResourceBySlug(req.params.slug);

      if (!item) {
        return res.status(404).json({ message: "Learning resource not found" });
      }

      res.json(item);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.blogPosts.list.path, async (req, res) => {
    try {
      const query = api.blogPosts.list.query?.parse(req.query) ?? {};
      const items = await storage.getBlogPosts({ category: query.category });
      res.json(items);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get(api.blogPosts.detail.path, async (req, res) => {
    try {
      const item = await storage.getBlogPostBySlug(req.params.slug);

      if (!item) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(item);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post(api.contactRequests.create.path, async (req, res) => {
    try {
      const input = api.contactRequests.create.input.parse(req.body);
      const item = await storage.createContactRequest(input);
      res.status(201).json(item);
    } catch (err) {
      return handleError(err, res);
    }
  });

  return httpServer;
}
