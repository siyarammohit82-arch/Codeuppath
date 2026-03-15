import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Bot, Cpu, Newspaper, Sparkles } from "lucide-react";
import type { BlogPostsResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { getBlogPostsUrl } from "@/lib/content";

const icons = [Bot, Cpu, Sparkles, Newspaper];

export default function Blog() {
  const { data = [], isLoading } = useQuery<BlogPostsResponse>({
    queryKey: [getBlogPostsUrl({})],
  });

  return (
    <PageShell
      badge="Tech updates and concept blogs"
      title="Read practical"
      subtitle="tech updates"
      description="Read practical posts covering the latest AI updates, developer tools, tech terminology, and industry trends — curated to keep you informed and ahead."
      metrics={[
        { label: "Posts", value: `${data.length}` },
        { label: "Focus", value: "Tech" },
        { label: "Source", value: "Database" },
      ]}
      ctaHref="#blog-content"
      ctaLabel="Read Posts"
    >
      <section id="blog-content" className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
              Loading blog posts from database...
            </div>
          ) : null}

          {!isLoading && data.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
              No blog posts found in the database.
            </div>
          ) : null}

          {data.map((post, index) => {
            const Icon = icons[index % icons.length];

            return (
              <article
                key={post.slug}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/5"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Icon className="h-7 w-7 text-cyan-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{post.category}</p>
                  <span className="text-sm text-slate-400">{post.readTime}</span>
                </div>
                <h3 className="mt-4 text-2xl text-white">{post.title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{post.summary}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
