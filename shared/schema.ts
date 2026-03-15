import { pgTable, text, serial, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  country: text("country").default(""),
  college: text("college").default(""),
  role: text("role").default(""),
  skills: text("skills").default(""),
  bio: text("bio").default(""),
  resumeLink: text("resume_link").default(""),
  experience: text("experience").default(""),
  projects: text("projects").default(""),
  achievements: text("achievements").default(""),
  certifications: text("certifications").default(""),
  userRole: text("user_role").default("user"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  organizer: text("organizer").notNull(),
  mode: text("mode").notNull(),
  location: text("location").notNull(),
  prize: integer("prize").notNull().default(0),
  deadline: text("deadline").notNull(),
  description: text("description").notNull(),
  rules: jsonb("rules").$type<string[]>().notNull().default([]),
  timeline: jsonb("timeline").$type<string[]>().notNull().default([]),
  registrationUrl: text("registration_url").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  bannerImage: text("banner_image").default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull().default("Beginner"),
  description: text("description").notNull(),
  outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
  platformUrl: text("platform_url").notNull(),
  thumbnail: text("thumbnail").default(""),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull().default(0),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  readTime: text("read_time").notNull(),
  description: text("description").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  seoTitle: text("seo_title").default(""),
  metaDescription: text("meta_description").default(""),
  featuredImage: text("featured_image").default(""),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests)
  .pick({
    name: true,
    email: true,
    message: true,
  })
  .extend({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    message: z.string().min(10, "Message should be at least 10 characters"),
  });

export const upsertProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  country: z.string().trim().default(""),
  college: z.string().trim().default(""),
  role: z.string().trim().default(""),
  skills: z.string().trim().default(""),
  bio: z.string().trim().default(""),
  resumeLink: z.string().trim().default(""),
  experience: z.string().trim().default(""),
  projects: z.string().trim().default(""),
  achievements: z.string().trim().default(""),
  certifications: z.string().trim().default(""),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type WaitlistResponse = Waitlist;

export type Profile = typeof profiles.$inferSelect;
export type UpsertProfileInput = z.infer<typeof upsertProfileSchema>;
export type Hackathon = typeof hackathons.$inferSelect;
export type LearningResource = typeof learningResources.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type Product = typeof products.$inferSelect;

export const siteContents = pgTable("site_contents", {
  id: serial("id").primaryKey(),
  pageKey: text("page_key").notNull().unique(),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  body: text("body").notNull(),
  modules: jsonb("modules").$type<{ title: string; description: string }[]>().notNull().default([]),
  faq: jsonb("faq").$type<{ question: string; answer: string }[]>().notNull().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertSiteContentSchema = z.object({
  heroTitle: z.string().min(10, "Hero title is required"),
  heroSubtitle: z.string().min(10, "Hero subtitle is required"),
  body: z.string().min(30, "Body copy needs more detail"),
  modules: z
    .array(
      z.object({
        title: z.string().min(5),
        description: z.string().min(10),
      }),
    )
    .min(1)
    .max(6),
  faq: z
    .array(
      z.object({
        question: z.string().min(10),
        answer: z.string().min(15),
      }),
    )
    .min(1)
    .max(8),
  isPublished: z.boolean().default(true),
});

export type SiteContent = typeof siteContents.$inferSelect;
export type UpsertSiteContentInput = z.infer<typeof upsertSiteContentSchema>;
