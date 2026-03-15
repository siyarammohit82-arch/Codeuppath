import { Activity, Award, BarChart3, CheckCircle2, FileSearch, Gauge, Lightbulb, Sparkles, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/hooks/use-auth";

function getSkillsList(skills: string) {
  return skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Dashboard() {
  const { user, resumeScore } = useAuth();
  const profile = user?.profile;

  const skills = getSkillsList(profile?.skills ?? "");
  const hasResume = Boolean(profile?.resumeLink?.trim());
  const hasRole = Boolean(profile?.role?.trim());
  const hasBio = Boolean(profile?.bio?.trim());
  const bioLength = profile?.bio?.trim().length ?? 0;

  const keywordCoverage = Math.min(100, skills.length * 14 + (hasRole ? 16 : 0) + (bioLength >= 80 ? 14 : bioLength >= 40 ? 8 : 0));
  const portfolioStrength = Math.min(100, (hasResume ? 55 : 0) + (bioLength >= 120 ? 20 : bioLength >= 60 ? 10 : 0) + Math.min(skills.length, 5) * 5);
  const participantScore = Math.round(resumeScore * 0.45 + keywordCoverage * 0.35 + portfolioStrength * 0.2);

  const participantFit =
    participantScore >= 85
      ? "High fit for global hackathons"
      : participantScore >= 70
        ? "Strong fit for competitive events"
        : participantScore >= 55
          ? "Moderate fit, improve positioning"
          : "Low fit, profile needs more proof";

  const participationLevel =
    participantScore >= 85
      ? "Leader / finalist potential"
      : participantScore >= 70
        ? "Core builder potential"
        : participantScore >= 55
          ? "Contributor potential"
          : "Preparation stage";

  const currentStatus =
    resumeScore >= 85
      ? "Profile optimized and ready for premium opportunities"
      : resumeScore >= 65
        ? "Profile active, but still missing stronger proof points"
        : "Profile incomplete for strong recommendations";

  const analyticsCards = [
    {
      icon: Award,
      value: `${resumeScore}%`,
      label: "Live resume score",
      detail: "Based on complete profile fields",
    },
    {
      icon: Users,
      value: `${participantScore}%`,
      label: "Participant fit score",
      detail: participantFit,
    },
    {
      icon: Gauge,
      value: `${keywordCoverage}%`,
      label: "Keyword coverage",
      detail: `${skills.length} skill keywords detected`,
    },
    {
      icon: Sparkles,
      value: `${portfolioStrength}%`,
      label: "Portfolio strength",
      detail: hasResume ? "Resume/portfolio linked" : "Portfolio link missing",
    },
  ];

  const summaryCards = [
    { label: "Name", value: profile?.fullName || "Not added" },
    { label: "Skills", value: skills.length ? skills.join(", ") : "Not added" },
    { label: "Country", value: profile?.country || "Not added" },
    { label: "Primary role", value: profile?.role || "Not added" },
    { label: "Participation level", value: participationLevel },
    { label: "Resume proof", value: hasResume ? "Attached" : "Missing" },
  ];

  const recommendations = [
    !hasResume ? "Add a resume or portfolio link to improve your portfolio strength and build participant trust." : "Resume link is present. Make sure your live demos and project links are up to date.",
    skills.length < 4
      ? "Add specific skill keywords to your profile, such as React, Node.js, Python, ML, UI/UX, or Cloud."
      : "Your skills section looks strong. Focus on role-specific keywords and improving your achievement descriptions.",
    bioLength < 80
      ? "Expand your bio with more details: mention your projects, outcomes, interests, and key strengths."
      : "Good bio depth. Next step is to add measurable outcomes and shipped work examples.",
  ];

  return (
    <PageShell
      badge="Live member dashboard"
      title="Your profile"
      subtitle="analytics and growth status"
      description="Your dashboard analytics are calculated from your actual profile data. Resume score, keyword quality, portfolio strength, and participant fit update dynamically as your profile grows."
      metrics={[
        { label: "Resume Score", value: `${resumeScore}%` },
        { label: "Participant Fit", value: `${participantScore}%` },
        { label: "Status", value: resumeScore >= 70 ? "Active" : "Needs Work" },
      ]}
      ctaHref="#dashboard-content"
      ctaLabel="View Dashboard"
    >
      <section id="dashboard-content" className="border-y border-white/5 bg-black/20 px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-white/10 glass-panel p-5 sm:p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <BarChart3 className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Dynamic analytics</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
                {analyticsCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                      <Icon className="h-6 w-6 text-cyan-400" />
                      <p className="mt-4 text-2xl font-display font-bold text-white sm:text-3xl">{card.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400 sm:text-sm">{card.label}</p>
                      <p className="mt-3 text-sm text-slate-400">{card.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#0B101E] p-5 sm:p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <Activity className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Current status</p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Status</p>
                  <p className="mt-3 text-white">{currentStatus}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Participant outlook</p>
                  <p className="mt-3 text-white">{participationLevel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Profile proof</p>
                  <p className="mt-3 text-white">
                    {hasResume ? "Resume link attached and profile ready for opportunity matching" : "Resume or portfolio proof not attached yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#0B101E] p-5 sm:p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <FileSearch className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Profile summary</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {summaryCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{item.label}</p>
                    <p className="mt-3 text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 glass-panel p-5 sm:p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Participation readiness</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display font-bold text-white">{skills.length}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400">Detected skills</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display font-bold text-white">{bioLength}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400">Bio depth chars</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display font-bold text-white">{hasResume ? "Yes" : "No"}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-400">Resume proof</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#0B101E] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">How this is calculated</p>
                <p className="mt-4 text-slate-300">
                  Participant fit score is calculated by combining resume completeness, skill keyword count, bio quality, role clarity, and portfolio proof.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 glass-panel p-5 sm:p-8">
            <div className="flex items-center gap-3 text-cyan-400">
              <Lightbulb className="h-5 w-5" />
              <p className="text-sm uppercase tracking-[0.35em]">Recommendations to improve more</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
              {recommendations.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-muted-foreground sm:p-5">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
