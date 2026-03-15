import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Rocket, Trophy, Brain, Briefcase } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CharacterHero } from "@/components/CharacterHero";
import { WaitlistForm } from "@/components/WaitlistForm";
import { useAuth } from "@/hooks/use-auth";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -right-[10%] -top-[20%] h-[70vw] w-[70vw] rounded-full bg-blue-900/20 blur-[120px]"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -left-[20%] top-[40%] h-[60vw] w-[60vw] rounded-full bg-cyan-900/20 blur-[120px]"
        />
      </div>

      <section className="relative z-10 min-h-screen px-4 pb-14 pt-24 sm:px-6 md:px-10 md:pb-20 md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:min-h-[82vh] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-card mb-5 inline-flex items-center gap-2 rounded-full border-cyan-500/30 px-3 py-2 sm:px-4"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-100 sm:text-sm">Your Gateway to Tech Opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5 text-[2.9rem] font-bold leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              Discover Your
              <span className="mt-2 block text-gradient">Next Opportunity</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              Hackathons, competitions, learning resources, internships, and emerging tech all in one place. Stop searching across websites and find what matters to your journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex w-full justify-center lg:justify-start"
              id="join"
            >
              {isAuthenticated ? (
                <a
                  href={isAuthenticated ? "/profile" : "/login"}
                  className="rounded-2xl bg-cyan-500 px-8 py-4 font-display font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  Continue to Platform
                </a>
              ) : (
                <WaitlistForm buttonText="Get Early Access" />
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="relative w-full"
          >
            <div id="landingDiv" className="relative mx-auto h-[420px] w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(20,66,180,0.28),transparent_40%),linear-gradient(180deg,rgba(3,11,27,0.98),rgba(5,14,28,0.94))] sm:h-[500px] md:rounded-[2.5rem] lg:h-[620px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_right,rgba(59,130,246,0.1),transparent_35%)]" />

              <div className="absolute left-5 top-5 z-20 hidden max-w-[190px] text-left sm:block md:left-10 md:top-12 md:max-w-[220px] lg:max-w-[240px]">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">CodeUpPath</p>
                <h3 className="mt-4 text-2xl font-bold text-white md:text-4xl">
                  Curated
                  <span className="mt-1 block text-gradient">tech pathways</span>
                </h3>
                <p className="mt-4 text-xs leading-6 text-muted-foreground md:text-sm">
                  Discover hackathons, internships, learning, AI roadmaps, and the next best move for your profile.
                </p>
              </div>

              <div className="absolute right-4 top-5 z-20 hidden w-[170px] text-left sm:block md:right-8 md:top-12 md:w-[210px] lg:right-10 lg:w-[220px]">
                <div className="glass-card rounded-[1.5rem] border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Profile Strength</p>
                  <p className="mt-2 text-2xl font-display text-white">Elite</p>
                </div>
                <div className="mt-3 glass-card rounded-[1.5rem] border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Opportunity Sync</p>
                  <p className="mt-2 text-2xl font-display text-white">Realtime</p>
                </div>
                <div className="mt-3 glass-card rounded-[1.5rem] border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Global Reach</p>
                  <p className="mt-2 text-2xl font-display text-white">42 Regions</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 top-[24px] z-10 w-[92%] max-w-[360px] -translate-x-1/2 sm:bottom-[96px] sm:top-[96px] sm:w-[54%] sm:min-w-[280px] sm:max-w-[420px] md:bottom-[108px] md:top-[82px] md:w-[50%] lg:left-[55%] lg:top-[76px] lg:w-[46%] lg:-translate-x-1/2">
                <CharacterHero />
              </div>

              <div className="absolute bottom-4 left-1/2 z-20 hidden w-[94%] max-w-3xl -translate-x-1/2 rounded-[1.6rem] border border-cyan-400/20 bg-black/30 px-4 py-4 backdrop-blur-xl sm:block md:bottom-6 md:px-6 md:py-5">
                <div className="grid gap-3 text-left md:grid-cols-3">
                  {[
                    { label: "Hackathons", value: "128 Live Opportunities" },
                    { label: "Courses", value: "500+ Free + Affordable Picks" },
                    { label: "AI Roadmap", value: "Adaptive learning guidance" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-400">{item.label}</p>
                      <p className="mt-2 text-sm text-white md:text-base">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/10 bg-black/35 p-4 text-left backdrop-blur-xl sm:hidden">
                <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-400">Live Platform</p>
                <p className="mt-2 text-sm text-white">Hackathons, courses, and AI roadmaps in one member-first platform.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-white/5 bg-black/20 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              What You Can <span className="text-cyan-400">Discover</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Your complete hub for tech opportunities, learning, and collaboration in one centralized ecosystem.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Trophy, title: "Hackathons & Competitions", desc: "Find and compete in hackathons, tech competitions, and coding challenges worldwide." },
              { icon: Briefcase, title: "Internships & Jobs", desc: "Explore internship programs and career opportunities from top tech companies." },
              { icon: Brain, title: "Learning Resources", desc: "Access curated courses, certifications, and training from industry leaders." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card group cursor-default rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 transition-colors group-hover:bg-cyan-500/20">
                  <feature.icon className="h-7 w-7 text-blue-400 transition-colors group-hover:text-cyan-400" />
                </div>
                <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="community" className="relative z-10 border-y border-white/5 bg-black/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"
          >
            {[
              { number: "500+", label: "Opportunities" },
              { number: "100K+", label: "Community Members" },
              { number: "50+", label: "Tech Companies" },
              { number: "10K+", label: "Courses Available" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="mb-2 bg-gradient-to-br from-white to-white/50 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  {stat.number}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-cyan-400 md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden px-6 py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-full max-h-96 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-blue-600/20 blur-[150px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="glow-primary relative mx-auto max-w-4xl rounded-[2.5rem] border border-cyan-500/20 glass-panel p-12 text-center md:p-20"
        >
          <Rocket className="mx-auto mb-8 h-16 w-16 animate-pulse text-cyan-400" />
          <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Your Tech Journey <br className="hidden md:block" /> Starts Here
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Join CodeUpPath and unlock thousands of opportunities, connect with peers, and grow your career in tech.
          </p>

          <div className="flex w-full justify-center">
            <WaitlistForm buttonText="Reserve My Spot" className="max-w-lg" />
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
