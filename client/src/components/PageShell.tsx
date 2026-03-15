import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Metric {
  label: string;
  value: string;
}

interface PageShellProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: Metric[];
  ctaHref?: string;
  ctaLabel?: string;
  children: React.ReactNode;
}

export function PageShell({
  badge,
  title,
  subtitle,
  description,
  metrics,
  ctaHref = "#content",
  ctaLabel = "Explore",
  children,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-[-12%] top-[-18%] h-[44rem] w-[44rem] rounded-full bg-blue-700/15 blur-[140px]" />
        <div className="absolute left-[-12%] top-[36%] h-[38rem] w-[38rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-[160px]" />
      </div>

      <main className="relative z-10">
        <section className="px-4 pb-16 pt-28 sm:px-6 md:px-10 md:pb-28 md:pt-40">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 px-3 py-2 text-xs text-cyan-100 sm:px-4 sm:text-sm">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>{badge}</span>
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
                {title}
                <span className="block text-gradient">{subtitle}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-display text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:px-6 sm:text-base"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-[1.75rem] border border-white/10 glass-panel p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">CodeUpPath</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground sm:text-sm">Career growth platform for builders</p>
                </div>
                <div className="h-14 w-14 rounded-2xl border border-cyan-400/30 bg-cyan-400/10" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <p className="text-2xl font-display font-bold text-white sm:text-3xl">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400 sm:text-sm">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0B101E] p-4 font-mono text-xs text-slate-200 sm:mt-6 sm:p-5 sm:text-sm">
                <p className="text-cyan-400">const profile = await CodeUpPath.optimize();</p>
                <p className="mt-3 text-slate-400">// resume score + recommendations + learning paths</p>
                <p className="mt-2 text-blue-300">profile.score(<span className="text-green-400">&quot;live&quot;</span>);</p>
                <p className="mt-2 text-blue-300">profile.match(<span className="text-green-400">&quot;hackathons and courses&quot;</span>);</p>
                <p className="mt-2 text-blue-300">profile.build(<span className="text-green-400">&quot;career roadmap&quot;</span>);</p>
              </div>
            </motion.div>
          </div>
        </section>

        <div id="content">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
