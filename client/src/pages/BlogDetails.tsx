import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Bot, Cpu, ExternalLink, Newspaper, Sparkles } from "lucide-react";
import type { BlogPostResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { Seo } from "@/components/Seo";
import { getBlogPostDetailUrl } from "@/lib/content";
import NotFound from "@/pages/not-found";

const icons = [Bot, Cpu, Sparkles, Newspaper];

export default function BlogDetails() {
  const [matched, params] = useRoute("/blog/:slug");
  const slug = matched ? params.slug : "";

  const { data: post, isLoading } = useQuery<BlogPostResponse>({
    queryKey: [getBlogPostDetailUrl(slug)],
    enabled: Boolean(slug),
  });

  if (!matched) {
    return <NotFound />;
  }

  if (!isLoading && !post) {
    return <NotFound />;
  }

  const Icon = icons[(post?.id ?? 0) % icons.length];

  return (
    <>
      {post ? (
        <Seo
          title={post.title}
          description={post.summary}
          path={`/blog/${post.slug}`}
          type="article"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            articleSection: post.category,
            mainEntityOfPage: `${window.location.origin}/blog/${post.slug}`,
            publisher: {
              "@type": "Organization",
              name: "CodeUpPath",
            },
          }}
        />
      ) : null}
      <PageShell
        badge="Blog details page"
        title={post?.title ?? "Loading blog post"}
        subtitle="full article brief"
        description="Yahan user selected blog post ki full summary aur key takeaways dekh sakta hai."
        metrics={[
          { label: "Category", value: post?.category ?? "Loading" },
          { label: "Read Time", value: post?.readTime ?? "..." },
          { label: "Type", value: "Insight" },
        ]}
        ctaHref="/blog"
        ctaLabel="Back To Blog"
      >
        <section className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl space-y-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="rounded-[2rem] border border-white/10 glass-panel p-6 sm:p-8">
              {isLoading ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 text-slate-300">
                  Loading blog post from database...
                </div>
              ) : null}

              {post ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                      <Icon className="h-7 w-7 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{post.category}</p>
                      <p className="mt-2 text-sm text-slate-400">{post.readTime}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Overview</p>
                    <p className="mt-4 max-w-4xl text-slate-300">{post.description}</p>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Key Highlights</p>
                    <ul className="mt-4 space-y-3 text-slate-300">
                      {post.highlights.map((highlight) => (
                        <li key={highlight} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      More Posts
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                      User yahan se wapas blog listing par ja sakta hai aur next post explore kar sakta hai.
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
