import "dotenv/config";
import type { Request } from "express";

type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
  app_metadata?: {
    provider?: string;
  };
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseServerConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getAccessTokenFromRequest(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim() || null;
}

export async function getSupabaseUser(accessToken: string): Promise<SupabaseAuthUser | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase auth is not configured on the server.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
    },
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json as SupabaseAuthUser;
}
