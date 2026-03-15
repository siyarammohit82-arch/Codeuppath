import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaitlistForm } from "@/components/WaitlistForm";

type HeroMetric = {
  label: string;
  value: string;
};

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type SpotlightCard = {
  eyebrow: string;
  title: string;
  description: string;
};

type TimelineItem = {
  title: string;
  description: string;
};

interface SectionPageProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: HeroMetric[];
  featureCards: FeatureCard[];
  spotlightCards: SpotlightCard[];
  timeline: TimelineItem[];
  ctaTitle: string;
  ctaDescription: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function SectionPage({
  badge,
  title,
  subtitle,
  description,
  metrics,
  featureCards,
  spotlightCards,
  timeline,
  ctaTitle,
  ctaDescription,
}: SectionPageProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[-10%] top-[-18%] h-[44rem] w-[44rem] rounded-full bg-blue-700/15 blur-[140px]" />
        <div className="absolute left-[-12%] top-[38%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-[160px]" />
      </div>

      <main className="relative z-10">
        <section className="px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="glass-card mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>{badge}</span>
              </div>
              <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
                {title}
                <span className="block text-gradient">{subtitle}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
                {description}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#join"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  Join CodeUpPath
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#highlights"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-display font-semibold text-white transition-all hover:border-cyan-400/40 hover:bg-white/10"
                >
                  Explore Highlights
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-[2rem] border border-white/10 glass-panel p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">CodeUpPath</p>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">Intelligence for students and developers</p>
                </div>
                <div className="h-14 w-14 rounded-2xl border border-cyan-400/30 bg-cyan-400/10" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-display font-bold text-white">{metric.value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.25em] text-cyan-400">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B101E] p-5 font-mono text-sm text-slate-200">
                <p className="text-cyan-400">const path = await CodeUpPath.find();</p>
                <p className="mt-3 text-slate-400">// curated opportunities + learning + community</p>
                <p className="mt-2 text-blue-300">path.signal(<span className="text-green-400">&quot;high-value&quot;</span>);</p>
                <p className="mt-2 text-blue-300">path.track(<span className="text-green-400">&quot;latest&quot;</span>);</p>
                <p className="mt-2 text-blue-300">path.connect(<span className="text-green-400">&quot;builders&quot;</span>);</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="highlights" className="border-y border-white/5 bg-black/20 px-6 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Highlights</p>
              <h2 className="mt-4 text-3xl md:text-5xl">Built for focused discovery</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08, duration: 0.6 }}
                  className="glass-card rounded-3xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                    <card.icon className="h-7 w-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl text-white">{card.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 glass-panel p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Editorial Lens</p>
              <h2 className="mt-4 text-3xl md:text-4xl">Signals that matter, not noise</h2>
              <div className="mt-8 grid gap-5">
                {spotlightCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">{card.eyebrow}</p>
                    <h3 className="mt-3 text-xl text-white">{card.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Pathway</p>
              <h2 className="mt-4 text-3xl md:text-4xl">How this page helps users move</h2>
              <div className="mt-8 space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-display text-cyan-300">
                        {index + 1}
                      </div>
                      {index < timeline.length - 1 ? <div className="mt-3 h-full w-px bg-gradient-to-b from-cyan-400/40 to-transparent" /> : null}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-xl text-white">{item.title}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="px-6 pb-28 md:px-10">
          <div className="glass-panel relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-cyan-400/20 p-10 md:p-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-[140px]" />
            <div className="relative text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Join the network</p>
              <h2 className="mt-5 text-4xl md:text-5xl">{ctaTitle}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{ctaDescription}</p>
              <div className="mt-10 flex justify-center">
                <WaitlistForm buttonText="Get Early Access" className="max-w-lg" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
