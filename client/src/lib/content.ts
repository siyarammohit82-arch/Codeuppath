import { api, buildUrl } from "@shared/routes";

function buildQueryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "All") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function getHackathonsUrl(filters: { mode?: string; deadline?: string; minPrize?: string }) {
  return `${api.hackathons.list.path}${buildQueryString(filters)}`;
}

export function getHackathonDetailUrl(slug: string) {
  return buildUrl(api.hackathons.detail.path, { slug });
}

export function getLearningResourcesUrl(filters: { category?: string }) {
  return `${api.learningResources.list.path}${buildQueryString(filters)}`;
}

export function getLearningResourceDetailUrl(slug: string) {
  return buildUrl(api.learningResources.detail.path, { slug });
}

export function getBlogPostsUrl(filters: { category?: string }) {
  return `${api.blogPosts.list.path}${buildQueryString(filters)}`;
}

export function getBlogPostDetailUrl(slug: string) {
  return buildUrl(api.blogPosts.detail.path, { slug });
}
