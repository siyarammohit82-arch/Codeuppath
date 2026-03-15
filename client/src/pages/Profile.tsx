import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FileUser, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { UpsertProfileInput } from "@shared/routes";

const emptyProfile: UpsertProfileInput = {
  fullName: "",
  country: "",
  college: "",
  role: "",
  skills: "",
  bio: "",
  resumeLink: "",
  experience: "",
  projects: "",
  achievements: "",
  certifications: "",
};

export default function Profile() {
  const { completeProfile, user } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<UpsertProfileInput>(emptyProfile);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.profile?.fullName || user?.fullName || "",
      country: user?.profile?.country || "",
      college: user?.profile?.college || "",
      role: user?.profile?.role || "",
      skills: user?.profile?.skills || "",
      bio: user?.profile?.bio || "",
      resumeLink: user?.profile?.resumeLink || "",
      experience: user?.profile?.experience || "",
      projects: user?.profile?.projects || "",
      achievements: user?.profile?.achievements || "",
      certifications: user?.profile?.certifications || "",
    });
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    void completeProfile(form)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((saveError) => {
        setError(saveError instanceof Error ? saveError.message : "Unable to save profile.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-[-12%] top-[-18%] h-[44rem] w-[44rem] rounded-full bg-blue-700/15 blur-[140px]" />
        <div className="absolute left-[-12%] top-[36%] h-[38rem] w-[38rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <main className="relative z-10 px-4 pb-20 pt-28 sm:px-6 md:px-10 md:pb-24 md:pt-36">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="pt-4 md:pt-10">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400 sm:text-sm">Step 2</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:mt-5 md:text-7xl">
              Complete your
              <span className="block text-gradient">profile resume</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Fill in your details to build your tech resume. A complete profile unlocks your full dashboard, personalized hackathon matches, and AI-driven learning roadmap.
            </p>
            <div className="mt-10 rounded-[2rem] border border-white/10 glass-panel p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Logged in email</p>
              <p className="mt-3 text-xl text-white">{user?.email}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 glass-panel p-5 sm:p-8">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <FileUser className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl text-white sm:text-3xl">Profile update</h2>
            <p className="mt-3 text-muted-foreground">Add your experience, skills, and goals. Your dashboard will update live based on your profile strength.</p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
              <Input
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                placeholder="Full name"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                value={form.country}
                onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
                placeholder="Country"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                value={form.college}
                onChange={(event) => setForm((current) => ({ ...current, college: event.target.value }))}
                placeholder="College / University"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                placeholder="Role: Frontend, AI, Backend..."
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                value={form.skills}
                onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))}
                placeholder="Skills: React, Python, ML..."
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Input
                value={form.resumeLink}
                onChange={(event) => setForm((current) => ({ ...current, resumeLink: event.target.value }))}
                placeholder="Resume or portfolio link"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Textarea
                value={form.experience}
                onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))}
                placeholder="Experience snapshot (internships, roles, hours)"
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Textarea
                value={form.projects}
                onChange={(event) => setForm((current) => ({ ...current, projects: event.target.value }))}
                placeholder="Projects: tools, outcomes, links (bullet-style allowed)"
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Textarea
                value={form.achievements}
                onChange={(event) => setForm((current) => ({ ...current, achievements: event.target.value }))}
                placeholder="Achievements or certifications (badges, builds, awards)"
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Textarea
                value={form.certifications}
                onChange={(event) => setForm((current) => ({ ...current, certifications: event.target.value }))}
                placeholder="Training, certificates, or courses you completed"
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <Textarea
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                placeholder="Short bio about experience, goals, and strengths"
                className="min-h-[160px] rounded-xl border-white/10 bg-white/5 text-white md:col-span-2"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition-all hover:bg-cyan-400 md:col-span-2"
              >
                {isSaving ? "Saving..." : "Save Profile and Continue"}
                <Save className="h-4 w-4" />
              </button>
              {error ? <p className="text-sm text-red-400 md:col-span-2">{error}</p> : null}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
