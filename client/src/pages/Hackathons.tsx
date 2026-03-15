import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, Globe2, Trophy } from "lucide-react";
import type { HackathonsResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { getHackathonsUrl } from "@/lib/content";

const formatPrize = (value: number) => `$${value.toLocaleString()}`;

export default function Hackathons() {
  const [modeFilter, setModeFilter] = useState<"All" | "Online" | "Offline">("All");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [prizeFilter, setPrizeFilter] = useState("");

  const listUrl = useMemo(
    () => getHackathonsUrl({ mode: modeFilter, deadline: deadlineFilter, minPrize: prizeFilter }),
    [deadlineFilter, modeFilter, prizeFilter],
  );

  const { data = [], isLoading } = useQuery<HackathonsResponse>({
    queryKey: [listUrl],
  });

  return (
    <PageShell
      badge="Hackathon discovery workflow"
      title="Discover and filter"
      subtitle="top hackathons"
      description="Browse live hackathon listings filtered by format, deadline, and prize pool. Click any listing to view full details, rules, timeline, and registration link."
      metrics={[
        { label: "Live Listings", value: `${data.length}` },
        { label: "Formats", value: "Online + Offline" },
        { label: "Source", value: "Database" },
      ]}
      ctaHref="#hackathons-content"
      ctaLabel="View Listings"
    >
      <section id="hackathons-content" className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="grid gap-4 rounded-[1.75rem] border border-white/10 glass-panel p-5 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Format</p>
              <div className="flex flex-wrap gap-2">
                {(["All", "Online", "Offline"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setModeFilter(option)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      modeFilter === option
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Deadline</p>
              <Input
                type="date"
                value={deadlineFilter}
                onChange={(event) => setDeadlineFilter(event.target.value)}
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Prize Pool</p>
              <Input
                type="number"
                min="0"
                step="1000"
                value={prizeFilter}
                onChange={(event) => setPrizeFilter(event.target.value)}
                placeholder="Minimum prize in USD"
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0B101E] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Results</p>
              <p className="mt-3 text-3xl font-semibold text-white">{isLoading ? "..." : data.length}</p>
              <p className="mt-2 text-sm text-slate-400">Matching hackathons</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                Loading hackathons from database...
              </div>
            ) : null}

            {!isLoading && data.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
                No hackathons found for the selected filters. Try adjusting the mode, deadline, or prize filter to see more results.
              </div>
            ) : null}

            {data.map((hackathon) => (
              <article
                key={hackathon.id}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {hackathon.mode}
                  </span>
                  <span className="text-sm text-slate-400">{hackathon.location}</span>
                </div>

                <h3 className="mt-5 text-2xl text-white">{hackathon.name}</h3>
                <p className="mt-3 text-sm text-slate-400">{hackathon.description}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <Globe2 className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">Organizer</p>
                      <p className="text-white">{hackathon.organizer}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Prize</span>
                      </div>
                      <p className="mt-2 text-white">{formatPrize(hackathon.prize)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Deadline</span>
                      </div>
                      <p className="mt-2 text-white">
                        {new Date(hackathon.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/hackathons/${hackathon.slug}`}
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
