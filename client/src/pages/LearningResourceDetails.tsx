import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, BookOpen, ExternalLink, GraduationCap, Layers3, Sparkles } from "lucide-react";
import type { LearningResourceResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { Seo } from "@/components/Seo";
import { getLearningResourceDetailUrl } from "@/lib/content";
import NotFound from "@/pages/not-found";

export default function LearningResourceDetails() {
  const [matched, params] = useRoute("/learning-resources/:slug");
  const slug = matched ? params.slug : "";

  const { data: resource, isLoading } = useQuery<LearningResourceResponse>({
    queryKey: [getLearningResourceDetailUrl(slug)],
    enabled: Boolean(slug),
  });

  if (!matched) {
    return <NotFound />;
  }

  if (!isLoading && !resource) {
    return <NotFound />;
  }

  return (
    <>
      {resource ? (
        <Seo
          title={resource.name}
          description={resource.description}
          path={`/learning-resources/${resource.slug}`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Course",
            name: resource.name,
            description: resource.description,
            provider: {
              "@type": "Organization",
              name: resource.provider,
            },
            url: `${window.location.origin}/learning-resources/${resource.slug}`,
          }}
        />
      ) : null}
      <PageShell
        badge="Learning resource details page"
        title={resource?.name ?? "Loading resource"}
        subtitle="resource brief"
        description="Yahan user learning resource ki full details, outcomes, provider information, aur direct learning link dekh sakta hai."
        metrics={[
          { label: "Category", value: resource?.category ?? "Loading" },
          { label: "Provider", value: resource?.provider ?? "..." },
          { label: "Duration", value: resource?.duration ?? "..." },
        ]}
        ctaHref={resource?.platformUrl ?? "/learning-resources"}
        ctaLabel={resource ? "Start Learning" : "Back To Learning"}
      >
        <section className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl space-y-8">
            <Link
              href="/learning-resources"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learning Resources
            </Link>

            <div className="rounded-[2rem] border border-white/10 glass-panel p-6 sm:p-8">
              {isLoading ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 text-slate-300">
                  Loading resource details from database...
                </div>
              ) : null}

              {resource ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Category</span>
                      </div>
                      <p className="mt-3 text-white">{resource.category}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Layers3 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Provider</span>
                      </div>
                      <p className="mt-3 text-white">{resource.provider}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Duration</span>
                      </div>
                      <p className="mt-3 text-white">{resource.duration}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.28em]">Description</span>
                    </div>
                    <p className="mt-4 max-w-4xl text-slate-300">{resource.description}</p>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">What You Get</p>
                    <ul className="mt-4 space-y-3 text-slate-300">
                      {resource.outcomes.map((outcome) => (
                        <li key={outcome} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={resource.platformUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Start Learning
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                      You'll be redirected to the course platform to start or continue your learning journey.
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
