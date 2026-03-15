import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "./db";
import {
  blogPosts,
  contactRequests,
  hackathons,
  learningResources,
  profiles,
  siteContents,
  waitlist,
  type BlogPost,
  type ContactRequest,
  type Hackathon,
  type InsertContactRequest,
  type InsertWaitlist,
  type LearningResource,
  type Profile,
  type SiteContent,
  type UpsertProfileInput,
  type UpsertSiteContentInput,
  type WaitlistResponse,
} from "../shared/schema";

type HackathonFilters = {
  mode?: string;
  deadline?: string;
  minPrize?: number;
};

type LearningResourceFilters = {
  category?: string;
};

type BlogPostFilters = {
  category?: string;
};

export interface IStorage {
  createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistResponse>;
  getProfileByAuthUserId(authUserId: string): Promise<Profile | undefined>;
  upsertProfile(authUserId: string, email: string, input: UpsertProfileInput): Promise<Profile>;
  getHackathons(filters: HackathonFilters): Promise<Hackathon[]>;
  getHackathonBySlug(slug: string): Promise<Hackathon | undefined>;
  getLearningResources(filters: LearningResourceFilters): Promise<LearningResource[]>;
  getLearningResourceBySlug(slug: string): Promise<LearningResource | undefined>;
  getBlogPosts(filters: BlogPostFilters): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getSiteContents(): Promise<SiteContent[]>;
  upsertSiteContent(pageKey: string, input: UpsertSiteContentInput): Promise<SiteContent>;
  createContactRequest(input: InsertContactRequest): Promise<ContactRequest>;
}

export class DatabaseStorage implements IStorage {
  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistResponse> {
    if (!db) {
      throw new Error("Database unavailable");
    }

    const [created] = await db.insert(waitlist).values(entry).returning();
    return created;
  }

  async getProfileByAuthUserId(authUserId: string): Promise<Profile | undefined> {
    if (!db) {
      return undefined;
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.authUserId, authUserId));
    return profile;
  }

  async upsertProfile(authUserId: string, email: string, input: UpsertProfileInput): Promise<Profile> {
    if (!db) {
      throw new Error("Database unavailable");
    }

    const [profile] = await db
      .insert(profiles)
      .values({
        authUserId,
        email,
        fullName: input.fullName,
        country: input.country,
        college: input.college,
        role: input.role,
        skills: input.skills,
        bio: input.bio,
        resumeLink: input.resumeLink,
        experience: input.experience,
        projects: input.projects,
        achievements: input.achievements,
        certifications: input.certifications,
      })
      .onConflictDoUpdate({
        target: profiles.authUserId,
        set: {
          email,
          fullName: input.fullName,
          country: input.country,
          college: input.college,
          role: input.role,
          skills: input.skills,
          bio: input.bio,
          resumeLink: input.resumeLink,
          experience: input.experience,
          projects: input.projects,
          achievements: input.achievements,
          certifications: input.certifications,
          updatedAt: new Date(),
        },
      })
      .returning();

    return profile;
  }

  async getHackathons(filters: HackathonFilters): Promise<Hackathon[]> {
    if (!db) {
      throw new Error("Database not configured. Set DATABASE_URL environment variable.");
    }

    const conditions = [eq(hackathons.isPublished, true)];

    if (filters.mode && filters.mode !== "All") {
      conditions.push(eq(hackathons.mode, filters.mode));
    }

    if (filters.deadline) {
      conditions.push(lte(hackathons.deadline, filters.deadline));
    }

    if (typeof filters.minPrize === "number" && !Number.isNaN(filters.minPrize)) {
      conditions.push(gte(hackathons.prize, filters.minPrize));
    }

    return db
      .select()
      .from(hackathons)
      .where(and(...conditions))
      .orderBy(hackathons.deadline, desc(hackathons.createdAt));
  }

  async getHackathonBySlug(slug: string): Promise<Hackathon | undefined> {
    if (!db) {
      return undefined;
    }

    const [item] = await db
      .select()
      .from(hackathons)
      .where(and(eq(hackathons.slug, slug), eq(hackathons.isPublished, true)));

    return item;
  }

  async getLearningResources(filters: LearningResourceFilters): Promise<LearningResource[]> {
    if (!db) {
      throw new Error("Database not configured. Set DATABASE_URL environment variable.");
    }

    const conditions = [eq(learningResources.isPublished, true)];

    if (filters.category && filters.category !== "All") {
      conditions.push(eq(learningResources.category, filters.category));
    }

    return db
      .select()
      .from(learningResources)
      .where(and(...conditions))
      .orderBy(desc(learningResources.createdAt));
  }

  async getLearningResourceBySlug(slug: string): Promise<LearningResource | undefined> {
    if (!db) {
      return undefined;
    }

    const [item] = await db
      .select()
      .from(learningResources)
      .where(and(eq(learningResources.slug, slug), eq(learningResources.isPublished, true)));

    return item;
  }

  async getBlogPosts(filters: BlogPostFilters): Promise<BlogPost[]> {
    if (!db) {
      throw new Error("Database not configured. Set DATABASE_URL environment variable.");
    }

    const conditions = [eq(blogPosts.isPublished, true)];

    if (filters.category) {
      conditions.push(eq(blogPosts.category, filters.category));
    }

    return db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (!db) {
      return undefined;
    }

    const [item] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)));

    return item;
  }

  async getSiteContents(): Promise<SiteContent[]> {
    if (!db) {
      throw new Error("Database unavailable");
    }

    return db
      .select()
      .from(siteContents)
      .where(eq(siteContents.isPublished, true))
      .orderBy(siteContents.pageKey);
  }

  async upsertSiteContent(pageKey: string, input: UpsertSiteContentInput): Promise<SiteContent> {
    if (!db) {
      throw new Error("Database unavailable");
    }

    const [content] = await db
      .insert(siteContents)
      .values({
        pageKey,
        heroTitle: input.heroTitle,
        heroSubtitle: input.heroSubtitle,
        body: input.body,
        modules: input.modules,
        faq: input.faq,
        isPublished: input.isPublished,
      })
      .onConflictDoUpdate({
        target: siteContents.pageKey,
        set: {
          heroTitle: input.heroTitle,
          heroSubtitle: input.heroSubtitle,
          body: input.body,
          modules: input.modules,
          faq: input.faq,
          isPublished: input.isPublished,
          updatedAt: new Date(),
        },
      })
      .returning();

    return content;
  }

  async createContactRequest(input: InsertContactRequest): Promise<ContactRequest> {
    if (!db) {
      throw new Error("Database unavailable");
    }

    const [created] = await db.insert(contactRequests).values(input).returning();
    return created;
  }
}

class MemoryStorage implements IStorage {
  private waitlistEntries = new Map<string, WaitlistResponse>();
  private profiles = new Map<string, Profile>();
  private contactEntries = new Map<number, ContactRequest>();
  private currentWaitlistId = 1;
  private currentProfileId = 1;
  private currentContactId = 1;

  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistResponse> {
    if (this.waitlistEntries.has(entry.email)) {
      throw new Error("Email already registered");
    }

    const created: WaitlistResponse = {
      id: this.currentWaitlistId++,
      email: entry.email,
      createdAt: new Date(),
    };

    this.waitlistEntries.set(entry.email, created);
    return created;
  }

  async getProfileByAuthUserId(authUserId: string): Promise<Profile | undefined> {
    return this.profiles.get(authUserId);
  }

  async upsertProfile(authUserId: string, email: string, input: UpsertProfileInput): Promise<Profile> {
    const existing = this.profiles.get(authUserId);
    const now = new Date();

    const profile: Profile = {
      id: existing?.id ?? this.currentProfileId++,
      authUserId,
      email,
      fullName: input.fullName,
      country: input.country,
      college: input.college,
      role: input.role,
      skills: input.skills,
      bio: input.bio,
      resumeLink: input.resumeLink,
      experience: input.experience,
      projects: input.projects,
      achievements: input.achievements,
      certifications: input.certifications,
      userRole: existing?.userRole ?? "user",
      isBlocked: existing?.isBlocked ?? false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.profiles.set(authUserId, profile);
    return profile;
  }

  async getHackathons(): Promise<Hackathon[]> {
    return [];
  }

  async getHackathonBySlug(): Promise<Hackathon | undefined> {
    return undefined;
  }

  async getLearningResources(): Promise<LearningResource[]> {
    return [];
  }

  async getLearningResourceBySlug(): Promise<LearningResource | undefined> {
    return undefined;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return [];
  }

  async getBlogPostBySlug(): Promise<BlogPost | undefined> {
    return undefined;
  }

  async getSiteContents(): Promise<SiteContent[]> {
    return [];
  }

  async upsertSiteContent(): Promise<SiteContent> {
    throw new Error("Memory storage cannot persist site content");
  }

  async createContactRequest(input: InsertContactRequest): Promise<ContactRequest> {
    const created: ContactRequest = {
      id: this.currentContactId++,
      name: input.name,
      email: input.email,
      message: input.message,
      createdAt: new Date(),
    };

    this.contactEntries.set(created.id, created);
    return created;
  }
}

export const storage = db ? new DatabaseStorage() : new MemoryStorage();
