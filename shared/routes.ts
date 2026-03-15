import { z } from "zod";
import {
  blogPosts,
  contactRequests,
  hackathons,
  insertContactRequestSchema,
  insertWaitlistSchema,
  learningResources,
  products,
  profiles,
  siteContents,
  upsertProfileSchema,
  upsertSiteContentSchema,
  waitlist,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

const createHackathonSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  organizer: z.string().min(3, "Organizer is required"),
  mode: z.string().min(3, "Mode is required"),
  location: z.string().min(3, "Location is required"),
  prize: z.coerce.number().min(0).default(0),
  deadline: z.string().min(5, "Deadline is required"),
  description: z.string().min(25, "Description needs more detail"),
  registrationUrl: z.string().url("Provide a valid apply link"),
  bannerImage: z.string().url().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().default(true),
});

const updateHackathonSchema = createHackathonSchema.extend({
  id: z.coerce.number().min(1),
});

const createBlogSchema = z.object({
  title: z.string().min(5, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  category: z.string().min(3, "Category is required"),
  summary: z.string().min(10, "Summary required"),
  readTime: z.string().min(3),
  description: z.string().min(25, "Description needs more detail"),
  highlights: z.array(z.string()).optional().default([]),
  seoTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  featuredImage: z.string().url().optional().default(""),
  isPublished: z.boolean().default(true),
});

const updateBlogSchema = createBlogSchema.extend({
  id: z.coerce.number().min(1),
});

const createLearningResourceSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  category: z.string().min(3),
  provider: z.string().min(3),
  duration: z.string().min(2),
  level: z.string().min(3),
  description: z.string().min(25),
  outcomes: z.array(z.string()).optional().default([]),
  platformUrl: z.string().url(),
  thumbnail: z.string().url().optional().default(""),
  isPublished: z.boolean().default(true),
});

const updateLearningResourceSchema = createLearningResourceSchema.extend({
  id: z.coerce.number().min(1),
});

const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  features: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true),
});

const updateProductSchema = createProductSchema.extend({
  id: z.coerce.number().min(1),
});

export const api = {
  waitlist: {
    create: {
      method: "POST" as const,
      path: "/api/waitlist" as const,
      input: insertWaitlistSchema,
      responses: {
        201: z.custom<typeof waitlist.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  profile: {
    me: {
      method: "GET" as const,
      path: "/api/profile" as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.internal,
        404: errorSchemas.notFound,
      },
    },
    upsert: {
      method: "PUT" as const,
      path: "/api/profile" as const,
      input: upsertProfileSchema,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal,
      },
    },
  },
  hackathons: {
    list: {
      method: "GET" as const,
      path: "/api/hackathons" as const,
      query: z
        .object({
          mode: z.string().optional(),
          deadline: z.string().optional(),
          minPrize: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.array(z.custom<typeof hackathons.$inferSelect>()),
      },
    },
    detail: {
      method: "GET" as const,
      path: "/api/hackathons/:slug" as const,
      responses: {
        200: z.custom<typeof hackathons.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  learningResources: {
    list: {
      method: "GET" as const,
      path: "/api/learning-resources" as const,
      query: z
        .object({
          category: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.array(z.custom<typeof learningResources.$inferSelect>()),
      },
    },
    detail: {
      method: "GET" as const,
      path: "/api/learning-resources/:slug" as const,
      responses: {
        200: z.custom<typeof learningResources.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  blogPosts: {
    list: {
      method: "GET" as const,
      path: "/api/blog-posts" as const,
      query: z
        .object({
          category: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    detail: {
      method: "GET" as const,
      path: "/api/blog-posts/:slug" as const,
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  contactRequests: {
    create: {
      method: "POST" as const,
      path: "/api/contact-requests" as const,
      input: insertContactRequestSchema,
      responses: {
        201: z.custom<typeof contactRequests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    hackathons: {
      list: {
        method: "GET" as const,
        path: "/api/admin/hackathons" as const,
        responses: {
          200: z.array(z.custom<typeof hackathons.$inferSelect>()),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      create: {
        method: "POST" as const,
        path: "/api/admin/hackathons" as const,
        input: createHackathonSchema,
        responses: {
          201: z.custom<typeof hackathons.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/admin/hackathons/:id" as const,
        input: updateHackathonSchema,
        responses: {
          200: z.custom<typeof hackathons.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/admin/hackathons/:id" as const,
        responses: {
          204: z.undefined(),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
    },
    blogPosts: {
      create: {
        method: "POST" as const,
        path: "/api/admin/blog-posts" as const,
        input: createBlogSchema,
        responses: {
          201: z.custom<typeof blogPosts.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/admin/blog-posts/:id" as const,
        input: updateBlogSchema,
        responses: {
          200: z.custom<typeof blogPosts.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/admin/blog-posts/:id" as const,
        responses: {
          204: z.undefined(),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
    },
    learningResources: {
      create: {
        method: "POST" as const,
        path: "/api/admin/learning-resources" as const,
        input: createLearningResourceSchema,
        responses: {
          201: z.custom<typeof learningResources.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/admin/learning-resources/:id" as const,
        input: updateLearningResourceSchema,
        responses: {
          200: z.custom<typeof learningResources.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/admin/learning-resources/:id" as const,
        responses: {
          204: z.undefined(),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
    },
    products: {
      create: {
        method: "POST" as const,
        path: "/api/admin/products" as const,
        input: createProductSchema,
        responses: {
          201: z.custom<typeof products.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/admin/products/:id" as const,
        input: updateProductSchema,
        responses: {
          200: z.custom<typeof products.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/admin/products/:id" as const,
        responses: {
          204: z.undefined(),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
    },
    contents: {
      list: {
        method: "GET" as const,
        path: "/api/admin/contents" as const,
        responses: {
          200: z.array(z.custom<typeof siteContents.$inferSelect>()),
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
      upsert: {
        method: "PUT" as const,
        path: "/api/admin/contents/:pageKey" as const,
        input: upsertSiteContentSchema,
        responses: {
          200: z.custom<typeof siteContents.$inferSelect>(),
          400: errorSchemas.validation,
          401: errorSchemas.internal,
          403: errorSchemas.internal,
        },
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type WaitlistInput = z.infer<typeof api.waitlist.create.input>;
export type WaitlistResponse = z.infer<typeof api.waitlist.create.responses[201]>;
export type ProfileResponse = z.infer<typeof api.profile.me.responses[200]>;
export type UpsertProfileInput = z.infer<typeof api.profile.upsert.input>;
export type HackathonsResponse = z.infer<typeof api.hackathons.list.responses[200]>;
export type HackathonResponse = z.infer<typeof api.hackathons.detail.responses[200]>;
export type LearningResourcesResponse = z.infer<typeof api.learningResources.list.responses[200]>;
export type LearningResourceResponse = z.infer<typeof api.learningResources.detail.responses[200]>;
export type BlogPostsResponse = z.infer<typeof api.blogPosts.list.responses[200]>;
export type BlogPostResponse = z.infer<typeof api.blogPosts.detail.responses[200]>;
export type ContactRequestInput = z.infer<typeof api.contactRequests.create.input>;
export type ContactRequestResponse = z.infer<typeof api.contactRequests.create.responses[201]>;
export type SiteContentResponse = z.infer<typeof api.admin.contents.list.responses[200]>;
export type SiteContentUpsertResponse = z.infer<typeof api.admin.contents.upsert.responses[200]>;
export type AdminHackathonCreateInput = z.infer<typeof createHackathonSchema>;
export type AdminHackathonUpdateInput = z.infer<typeof updateHackathonSchema>;
export type AdminBlogCreateInput = z.infer<typeof createBlogSchema>;
export type AdminBlogUpdateInput = z.infer<typeof updateBlogSchema>;
export type AdminLearningResourceCreateInput = z.infer<typeof createLearningResourceSchema>;
export type AdminLearningResourceUpdateInput = z.infer<typeof updateLearningResourceSchema>;
export type AdminProductCreateInput = z.infer<typeof createProductSchema>;
export type AdminProductUpdateInput = z.infer<typeof updateProductSchema>;
