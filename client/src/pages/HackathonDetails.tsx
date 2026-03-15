import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, ExternalLink, Globe2, ScrollText, Trophy } from "lucide-react";
import type { HackathonResponse } from "@shared/routes";
import { PageShell } from "@/components/PageShell";
import { Seo } from "@/components/Seo";
import { getHackathonDetailUrl } from "@/lib/content";
import NotFound from "@/pages/not-found";

const formatPrize = (value: number) => `$${value.toLocaleString()}`;

export default function HackathonDetails() {
  const [matched, params] = useRoute("/hackathons/:slug");
  const slug = matched ? params.slug : "";

  const { data: hackathon, isLoading } = useQuery<HackathonResponse>({
    queryKey: [getHackathonDetailUrl(slug)],
    enabled: Boolean(slug),
  });

  if (!matched) {
    return <NotFound />;
  }

  if (!isLoading && !hackathon) {
    return <NotFound />;
  }

  const metrics = hackathon
    ? [
        { label: "Mode", value: hackathon.mode },
        { label: "Prize", value: formatPrize(hackathon.prize) },
        {
          label: "Deadline",
          value: new Date(hackathon.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ]
    : [
        { label: "Mode", value: "Loading" },
        { label: "Prize", value: "..." },
        { label: "Deadline", value: "..." },
      ];

  return (
    <>
      {hackathon ? (
        <Seo
          title={hackathon.name}
          description={hackathon.description}
          path={`/hackathons/${hackathon.slug}`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: hackathon.name,
            description: hackathon.description,
            organizer: {
              "@type": "Organization",
              name: hackathon.organizer,
            },
            eventAttendanceMode:
              hackathon.mode === "Offline"
                ? "https://schema.org/OfflineEventAttendanceMode"
                : "https://schema.org/OnlineEventAttendanceMode",
            url: `${window.location.origin}/hackathons/${hackathon.slug}`,
          }}
        />
      ) : null}
      <PageShell
        badge="Hackathon details page"
        title={hackathon?.name ?? "Loading hackathon"}
        subtitle="full brief"
        description="Yahan user full hackathon details, rules, timeline, aur direct registration action dekh sakta hai."
        metrics={metrics}
        ctaHref={hackathon?.registrationUrl ?? "/hackathons"}
        ctaLabel={hackathon ? "Register Now" : "Back To Hackathons"}
      >
        <section className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl space-y-8">
            <Link
              href="/hackathons"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hackathons
            </Link>

            <div className="rounded-[2rem] border border-white/10 glass-panel p-6 sm:p-8">
              {isLoading ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 text-slate-300">
                  Loading hackathon details from database...
                </div>
              ) : null}

              {hackathon ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Globe2 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Organizer</span>
                      </div>
                      <p className="mt-3 text-white">{hackathon.organizer}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Prize Pool</span>
                      </div>
                      <p className="mt-3 text-white">{formatPrize(hackathon.prize)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Deadline</span>
                      </div>
                      <p className="mt-3 text-white">
                        {new Date(hackathon.deadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">Description</p>
                    <p className="mt-4 max-w-4xl text-slate-300">{hackathon.description}</p>
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <ScrollText className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Rules</span>
                      </div>
                      <ul className="mt-4 space-y-3 text-slate-300">
                        {hackathon.rules.map((rule) => (
                          <li key={rule} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.24em]">Timeline</span>
                      </div>
                      <ul className="mt-4 space-y-3 text-slate-300">
                        {hackathon.timeline.map((item) => (
                          <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={hackathon.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Registration
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                      You'll be taken to the official hackathon website to complete your registration.
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
