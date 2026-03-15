import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { api, type ProfileResponse, type UpsertProfileInput } from "@shared/routes";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  provider?: string;
  profile: UpsertProfileInput | null;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isAuthLoading: boolean;
  isSupabaseConfigured: boolean;
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  completeProfile: (profile: UpsertProfileInput) => Promise<void>;
  logout: () => Promise<void>;
  resumeScore: number;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function calculateResumeScore(profile: UpsertProfileInput | null) {
  if (!profile) {
    return 0;
  }

  const fields = [
    profile.fullName,
    profile.country,
    profile.college,
    profile.role,
    profile.skills,
    profile.bio,
    profile.resumeLink,
  ];

  const completed = fields.filter((field) => field.trim().length > 0).length;
  return Math.round((completed / fields.length) * 100);
}

function toProfileFields(profile: ProfileResponse | null): UpsertProfileInput | null {
  if (!profile) {
    return null;
  }

  return {
    fullName: profile.fullName,
    country: profile.country ?? "",
    college: profile.college ?? "",
    role: profile.role ?? "",
    skills: profile.skills ?? "",
    bio: profile.bio ?? "",
    resumeLink: profile.resumeLink ?? "",
    experience: profile.experience ?? "",
    projects: profile.projects ?? "",
    achievements: profile.achievements ?? "",
    certifications: profile.certifications ?? "",
  };
}

async function fetchProfile(accessToken: string) {
  const response = await fetch(api.profile.me.path, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to load profile" }));
    throw new Error(error.message || "Failed to load profile");
  }

  const json = await response.json();
  return api.profile.me.responses[200].parse(json);
}

function buildUser(sessionUser: SupabaseUser, profile: UpsertProfileInput | null): User | null {
  if (!sessionUser.email) {
    return null;
  }

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    fullName: sessionUser.user_metadata.full_name,
    avatarUrl: sessionUser.user_metadata.avatar_url || sessionUser.user_metadata.picture,
    provider: sessionUser.app_metadata.provider,
    profile,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function syncSession(session: Session | null) {
      if (!isSupabaseConfigured || !supabase) {
        if (!cancelled) {
          setUser(null);
          setIsAuthLoading(false);
        }
        return;
      }

      if (!session?.user) {
        if (!cancelled) {
          setUser(null);
          setAccessToken(null);
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        const profileRecord = await fetchProfile(session.access_token);
        const nextUser = buildUser(session.user, toProfileFields(profileRecord));

        if (!cancelled) {
          setUser(nextUser);
          setAccessToken(session?.access_token ?? null);
        }
      } catch (error) {
        console.error(error);
        const nextUser = buildUser(session.user, null);

        if (!cancelled) {
          setUser(nextUser);
          setAccessToken(session?.access_token ?? null);
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      return;
    }

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return syncSession(data.session);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) {
          setUser(null);
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthLoading(true);
      void syncSession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const resumeScore = calculateResumeScore(user?.profile ?? null);

    return {
      isAuthenticated: Boolean(user),
      isProfileComplete: Boolean(user?.profile),
      isAuthLoading,
      isSupabaseConfigured,
      user,
      login: async (email: string, password: string) => {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error("Supabase auth is not configured.");
        }

        if (!email.trim() || !password.trim()) {
          throw new Error("Please enter email and password.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }
      },
      loginWithGoogle: async () => {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error("Supabase auth is not configured.");
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) {
          throw error;
        }
      },
      completeProfile: async (profile: UpsertProfileInput) => {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error("Supabase auth is not configured.");
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.access_token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const response = await fetch(api.profile.upsert.path, {
          method: api.profile.upsert.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: "Failed to save profile" }));
          throw new Error(error.message || "Failed to save profile");
        }

        const savedProfile = api.profile.upsert.responses[200].parse(await response.json());
        const nextProfile = toProfileFields(savedProfile);

        setUser((currentUser) =>
          currentUser
            ? {
                ...currentUser,
                fullName: nextProfile?.fullName || currentUser.fullName,
                profile: nextProfile,
              }
            : currentUser,
        );
      },
      logout: async () => {
        if (supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) {
            throw error;
          }
        }

        setUser(null);
        setAccessToken(null);
      },
      resumeScore,
      accessToken,
    };
  }, [isAuthLoading, user, accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
