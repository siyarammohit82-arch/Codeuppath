import {
  AdminBlogCreateInput,
  AdminHackathonCreateInput,
  AdminHackathonUpdateInput,
  AdminLearningResourceCreateInput,
  AdminProductCreateInput,
} from "@shared/routes";
import { learningResources, products, profiles } from "@shared/schema";

export type AdminOverview = {
  users: number;
  hackathons: number;
  resources: number;
  blogs: number;
  products: number;
};

export type AdminHackathon = {
  id: number;
  name: string;
  slug: string;
  organizer: string;
  mode: string;
  location: string;
  prize: number;
  deadline: string;
  description: string;
  registrationUrl: string;
  bannerImage: string;
  tags: string[];
  isPublished: boolean;
};

export type AdminBlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  description: string;
  highlights: string[];
  isPublished: boolean;
};

export type AdminListResponse<T> = {
  items: T[];
  total: number;
};

export type AdminLearningResource = typeof learningResources.$inferSelect;
export type AdminProduct = typeof products.$inferSelect;
export type AdminUser = typeof profiles.$inferSelect;

async function adminRequest<T>(
  path: string,
  token: string | null,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    expectNoBody?: boolean;
  },
): Promise<T> {
  if (!token) {
    throw new Error("Missing authentication token.");
  }

  const response = await fetch(path, {
    method: options?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(text);
  }

  if (options?.expectNoBody || response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export function fetchAdminOverview(token: string | null) {
  return adminRequest<AdminOverview>("/api/admin/overview", token);
}

export function fetchAdminHackathons(token: string | null) {
  return adminRequest<AdminListResponse<AdminHackathon>>("/api/admin/hackathons", token);
}

export function fetchAdminBlogPosts(token: string | null) {
  return adminRequest<AdminListResponse<AdminBlogPost>>("/api/admin/blog-posts", token);
}

export function createHackathon(token: string | null, input: AdminHackathonCreateInput) {
  return adminRequest<AdminHackathon>("/api/admin/hackathons", token, {
    method: "POST",
    body: input,
  });
}

export function updateHackathon(token: string | null, id: number, input: AdminHackathonUpdateInput) {
  return adminRequest<AdminHackathon>(`/api/admin/hackathons/${id}`, token, {
    method: "PUT",
    body: input,
  });
}

export function deleteHackathon(token: string | null, id: number) {
  return adminRequest<void>(`/api/admin/hackathons/${id}`, token, {
    method: "DELETE",
    expectNoBody: true,
  });
}

export function createBlogPost(token: string | null, input: AdminBlogCreateInput) {
  return adminRequest<AdminBlogPost>("/api/admin/blog-posts", token, {
    method: "POST",
    body: input,
  });
}

export function updateBlogPost(token: string | null, id: number, input: AdminBlogCreateInput) {
  return adminRequest<AdminBlogPost>(`/api/admin/blog-posts/${id}`, token, {
    method: "PUT",
    body: input,
  });
}

export function fetchAdminLearningResources(token: string | null) {
  return adminRequest<AdminListResponse<AdminLearningResource>>("/api/admin/learning-resources", token);
}

export function fetchAdminProducts(token: string | null) {
  return adminRequest<AdminListResponse<AdminProduct>>("/api/admin/products", token);
}

export function fetchAdminUsers(token: string | null) {
  return adminRequest<AdminListResponse<AdminUser>>("/api/admin/users", token);
}
