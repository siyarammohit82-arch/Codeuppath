import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  blogPosts,
  hackathons,
  learningResources,
  products,
  profiles,
} from "../../shared/schema";
import {
  AdminBlogCreateInput,
  AdminBlogUpdateInput,
  AdminHackathonCreateInput,
  AdminHackathonUpdateInput,
  AdminLearningResourceCreateInput,
  AdminLearningResourceUpdateInput,
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "../../shared/routes";

export type PaginationParams = {
  limit?: number;
  offset?: number;
  search?: string;
};

function ensureDb() {
  if (!db) {
    throw new Error("Database unavailable");
  }
  return db;
}
export async function getAdminOverview() {
  if (!db) {
    throw new Error("Database unavailable");
  }

  const database = ensureDb();
  const [users, hackathonList, resourceList, blogList, productList] = await Promise.all([
    database.select().from(profiles),
    database.select().from(hackathons),
    database.select().from(learningResources),
    database.select().from(blogPosts),
    database.select().from(products),
  ]);

  return {
    users: users.length,
    hackathons: hackathonList.length,
    resources: resourceList.length,
    blogs: blogList.length,
    products: productList.length,
  };
}

function applyPagination<T>(query: { limit: (value: number) => any; offset: (value: number) => any }, params: PaginationParams) {
  const { limit = 20, offset = 0 } = params;
  return query.limit(limit).offset(offset);
}

export async function listHackathons(params: PaginationParams) {
  const database = ensureDb();
  const query = database.select().from(hackathons).orderBy(desc(hackathons.createdAt));
  const limitQuery = applyPagination(query, params);
  const items = await limitQuery;
  return { items, total: (await database.select().from(hackathons)).length };
}

export async function listLearningResources(params: PaginationParams) {
  const database = ensureDb();
  const query = database.select().from(learningResources).orderBy(desc(learningResources.createdAt));
  const limitQuery = applyPagination(query, params);
  const items = await limitQuery;
  return { items, total: (await database.select().from(learningResources)).length };
}

export async function listBlogPosts(params: PaginationParams) {
  const database = ensureDb();
  const query = database.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  const limitQuery = applyPagination(query, params);
  const items = await limitQuery;
  return { items, total: (await database.select().from(blogPosts)).length };
}

export async function listProducts(params: PaginationParams) {
  const database = ensureDb();
  const query = database.select().from(products).orderBy(desc(products.createdAt));
  const limitQuery = applyPagination(query, params);
  const items = await limitQuery;
  return { items, total: (await database.select().from(products)).length };
}

export async function listUsers(params: PaginationParams) {
  const database = ensureDb();
  const query = database.select().from(profiles).orderBy(desc(profiles.createdAt));
  const limitQuery = applyPagination(query, params);
  const items = await limitQuery;
  return { items, total: (await database.select().from(profiles)).length };
}

export async function createHackathon(input: AdminHackathonCreateInput) {
  const database = ensureDb();
  const [created] = await database
    .insert(hackathons)
    .values({
      name: input.name,
      slug: input.slug,
      organizer: input.organizer,
      mode: input.mode,
      location: input.location,
      prize: input.prize,
      deadline: input.deadline,
      description: input.description,
      rules: [],
      timeline: [],
      registrationUrl: input.registrationUrl,
      bannerImage: input.bannerImage ?? "",
      tags: input.tags ?? [],
      isPublished: input.isPublished,
    })
    .returning();

  return created;
}

export async function updateHackathon(input: AdminHackathonUpdateInput) {
  const database = ensureDb();
  const [updated] = await database
    .update(hackathons)
    .set({
      name: input.name,
      slug: input.slug,
      organizer: input.organizer,
      mode: input.mode,
      location: input.location,
      prize: input.prize,
      deadline: input.deadline,
      description: input.description,
      registrationUrl: input.registrationUrl,
      bannerImage: input.bannerImage ?? "",
      tags: input.tags ?? [],
      isPublished: input.isPublished,
    })
    .where(eq(hackathons.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Hackathon not found");
  }

  return updated;
}

export async function deleteHackathon(id: number) {
  const database = ensureDb();
  await database.delete(hackathons).where(eq(hackathons.id, id));
}

export async function createBlogPost(input: AdminBlogCreateInput) {
  const database = ensureDb();
  const [created] = await database
    .insert(blogPosts)
    .values({
      title: input.title,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      readTime: input.readTime,
      description: input.description,
      highlights: input.highlights ?? [],
      seoTitle: input.seoTitle ?? "",
      metaDescription: input.metaDescription ?? "",
      featuredImage: input.featuredImage ?? "",
      isPublished: input.isPublished,
    })
    .returning();

  return created;
}

export async function updateBlogPost(input: AdminBlogUpdateInput) {
  const database = ensureDb();
  const [updated] = await database
    .update(blogPosts)
    .set({
      title: input.title,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      readTime: input.readTime,
      description: input.description,
      highlights: input.highlights ?? [],
      seoTitle: input.seoTitle ?? "",
      metaDescription: input.metaDescription ?? "",
      featuredImage: input.featuredImage ?? "",
      isPublished: input.isPublished,
    })
    .where(eq(blogPosts.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Blog post not found");
  }

  return updated;
}

export async function deleteBlogPost(id: number) {
  const database = ensureDb();
  await database.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function createLearningResource(input: AdminLearningResourceCreateInput) {
  const database = ensureDb();
  const [created] = await database
    .insert(learningResources)
    .values({
      name: input.name,
      slug: input.slug,
      category: input.category,
      provider: input.provider,
      duration: input.duration,
      level: input.level,
      description: input.description,
      outcomes: input.outcomes ?? [],
      platformUrl: input.platformUrl,
      thumbnail: input.thumbnail ?? "",
      isPublished: input.isPublished,
    })
    .returning();

  return created;
}

export async function updateLearningResource(input: AdminLearningResourceUpdateInput) {
  const database = ensureDb();
  const [updated] = await database
    .update(learningResources)
    .set({
      name: input.name,
      slug: input.slug,
      category: input.category,
      provider: input.provider,
      duration: input.duration,
      level: input.level,
      description: input.description,
      outcomes: input.outcomes ?? [],
      platformUrl: input.platformUrl,
      thumbnail: input.thumbnail ?? "",
      isPublished: input.isPublished,
    })
    .where(eq(learningResources.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Resource not found");
  }

  return updated;
}

export async function deleteLearningResource(id: number) {
  const database = ensureDb();
  await database.delete(learningResources).where(eq(learningResources.id, id));
}

export async function createProduct(input: AdminProductCreateInput) {
  const database = ensureDb();
  const [created] = await database
    .insert(products)
    .values({
      name: input.name,
      description: input.description,
      price: input.price,
      features: input.features ?? [],
      isActive: input.isActive,
    })
    .returning();

  return created;
}

export async function updateProduct(input: AdminProductUpdateInput) {
  const database = ensureDb();
  const [updated] = await database
    .update(products)
    .set({
      name: input.name,
      description: input.description,
      price: input.price,
      features: input.features ?? [],
      isActive: input.isActive,
    })
    .where(eq(products.id, input.id))
    .returning();

  if (!updated) {
    throw new Error("Product not found");
  }

  return updated;
}

export async function deleteProduct(id: number) {
  const database = ensureDb();
  await database.delete(products).where(eq(products.id, id));
}
