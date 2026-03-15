import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Chrome, LockKeyhole, LogIn } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login, loginWithGoogle, isAuthenticated, isAuthLoading, isSupabaseConfigured } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [hasWelcomeToast, setHasWelcomeToast] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    navigate("/dashboard");
  }, [isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || hasWelcomeToast) {
      return;
    }

    toast({
      title: "Signed in",
      description: "Welcome back to CodeUpPath.",
    });
    setHasWelcomeToast(true);
  }, [hasWelcomeToast, isAuthLoading, isAuthenticated, toast]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    void login(email, password)
      .catch((authError) => {
        setError(authError instanceof Error ? authError.message : "Unable to sign in.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleGoogleLogin = () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      void loginWithGoogle().catch((authError) => {
        setError(authError instanceof Error ? authError.message : "Google login is not configured.");
        setIsGoogleLoading(false);
      });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google login is not configured.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-[-12%] top-[-18%] h-[44rem] w-[44rem] rounded-full bg-blue-700/15 blur-[140px]" />
        <div className="absolute left-[-12%] top-[36%] h-[38rem] w-[38rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <main className="relative z-10 px-4 pb-20 pt-28 sm:px-6 md:px-10 md:pb-24 md:pt-36">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="pt-4 md:pt-10">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400 sm:text-sm">Member Access</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:mt-5 md:text-7xl">
              Login to open
              <span className="block text-gradient">your dashboard</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Sign in to access your personalized dashboard, track your profile strength, discover hackathons, and unlock curated learning resources.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-3">New to CodeUpPath?</p>
              After signing in, you'll complete your profile to unlock your full dashboard and personalized opportunity feed.
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 glass-panel p-5 sm:p-8">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <LockKeyhole className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl text-white sm:text-3xl">Sign in</h2>
            <p className="mt-3 text-muted-foreground">
              {isSupabaseConfigured
                ? "Use your email and password or continue with Google to sign in."
                : "Authentication is being set up. Please check back shortly."}
            </p>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={!isSupabaseConfigured || isAuthLoading || isGoogleLoading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-display font-semibold text-white transition-all hover:border-cyan-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Chrome className="h-4 w-4" />
                {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <button
                type="submit"
                disabled={!isSupabaseConfigured || isAuthLoading || isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition-all hover:bg-cyan-400"
              >
                {isSubmitting ? "Signing in..." : "Login"}
                <LogIn className="h-4 w-4" />
              </button>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {isAuthLoading ? <p className="text-sm text-cyan-300">Checking auth session...</p> : null}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
