import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, GraduationCap, Layers3, Sparkles } from "lucide-react";
import type { LearningResourcesResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { getLearningResourcesUrl } from "@/lib/content";

const categories = ["All", "Web Development", "AI", "Programming", "Free Certifications"] as const;

export default function LearningResources() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  const listUrl = useMemo(() => getLearningResourcesUrl({ category }), [category]);

  const { data = [], isLoading } = useQuery<LearningResourcesResponse>({
    queryKey: [listUrl],
  });

  return (
    <PageShell
      badge="Learning resources workflow"
      title="Explore curated"
      subtitle="learning resources"
      description="Browse curated courses, certifications, and guides across Web Development, AI, Programming, and more. Click any resource to see details and go directly to the platform."
      metrics={[
        { label: "Categories", value: "4" },
        { label: "Resources", value: `${data.length}` },
        { label: "Source", value: "Database" },
      ]}
      ctaHref="#learning-resources-content"
      ctaLabel="View Resources"
    >
      <section id="learning-resources-content" className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-wrap gap-3 rounded-[1.75rem] border border-white/10 glass-panel p-5">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === item
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                Loading learning resources from database...
              </div>
            ) : null}

            {!isLoading && data.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                No learning resources found in the database for this category.
              </div>
            ) : null}

            {data.map((resource) => (
              <article
                key={resource.id}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {resource.category}
                  </span>
                  <GraduationCap className="h-5 w-5 text-cyan-300" />
                </div>

                <h3 className="mt-5 text-2xl text-white">{resource.name}</h3>
                <p className="mt-3 text-sm text-slate-400">{resource.description}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <Layers3 className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">Provider</p>
                      <p className="text-white">{resource.provider}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.24em]">Duration</span>
                    </div>
                    <p className="mt-2 text-white">{resource.duration}</p>
                  </div>
                </div>

                <Link
                  href={`/learning-resources/${resource.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
