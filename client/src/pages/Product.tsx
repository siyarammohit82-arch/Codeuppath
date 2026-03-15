import { Layers, Radar, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaitlistForm } from "@/components/WaitlistForm";

const heroStats = [
  { label: "Signals processed", value: "3.4K" },
  { label: "Builders activated", value: "1.2K" },
  { label: "Avg. time saved", value: "16 hrs/wk" },
];

const featureCards = [
  {
    icon: Layers,
    title: "Launch-ready decks",
    description: "Connect your Play Store assets, timelines, and insights so every stakeholder sees the same launch story.",
  },
  {
    icon: Radar,
    title: "Live product radar",
    description: "Track live signals across community, usage, and partners without leaving a single screen.",
  },
  {
    icon: ShieldCheck,
    title: "Trust infrastructure",
    description: "Verified partners, curated metrics, and readiness checks for a confident product release.",
  },
];

const moduleCards = [
  {
    title: "Play Store readiness",
    description: "Checklist, screenshots, icons, and release notes aligned with the live launch plan.",
  },
  {
    title: "Life product watch",
    description: "Monitor real-world usage, Discord + feedback, and collaborator check-ins in one stream.",
  },
  {
    title: "Signal synth",
    description: "AI summaries turn metrics into narratives for investors, mentors, and product teams.",
  },
];

const adoptionSteps = [
  {
    title: "1. Define the story",
    description: "Align KPIs for downloads, retention, and life-product impact so the dashboard reflects what matters.",
  },
  {
    title: "2. Layer your signals",
    description: "Drop Play Store stats, community highlights, and launch alerts into one living canvas.",
  },
  {
    title: "3. Ship with clarity",
    description: "Share the release room, collect confirmations, and close the loop with analytics + follow-ups.",
  },
];

export default function ProductPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 md:px-8">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:grid-cols-[0.9fr_0.6fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Play Store + Life Product</p>
            <h1 className="text-4xl font-bold text-white">CodeUpPath Product launch room</h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Product launch rituals inspired by the highest-converting commerce experiences. Share assets, track signals, and keep momentum in one room.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#details"
                className="rounded-md bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Launch details
              </a>
              <a href="#waitlist" className="rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white">
                Reserve a walkthrough
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                  <p className="uppercase tracking-[0.3em] text-cyan-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Quick specs</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>- Live Play Store launches</li>
              <li>- Life-product telemetry</li>
              <li>- Community + investor-ready briefs</li>
            </ul>
          </div>
        </section>

        <section id="details" className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-black/30 p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Launch cockpit</p>
            <h2 className="text-3xl font-bold text-white">High-converting format</h2>
            <p className="text-sm text-muted-foreground">
              The layout mirrors top retail launches: hero + quick CTAs, feature grid, detailed benefits, and spec list so your audience can scan everything quickly.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {moduleCards.map((module) => (
                <div key={module.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{module.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Adoption Steps</p>
            <div className="mt-6 space-y-5">
              {adoptionSteps.map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0c1530] to-[#041120] p-10">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { value: "24", label: "Live agility meetings" },
              { value: "8", label: "Partner tracks" },
              { value: "42%", label: "Faster launches" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-display text-white">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="waitlist" className="rounded-[2rem] border border-white/10 bg-black/60 p-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Waitlist</p>
            <h2 className="text-3xl font-bold text-white">Schedule a Play Store + life product walkthrough</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tell us your launch targets and we will reserve a slot for a guided tour, Play Store checklist, and life-product readiness review.
            </p>
          </div>
          <div className="mt-6">
            <WaitlistForm buttonText="Reserve my slot" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
