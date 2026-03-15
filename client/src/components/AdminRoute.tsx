import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
      navigate("/");
      return;
    }
  }, [isAuthLoading, isAuthenticated, navigate, user]);

  if (isAuthLoading || !isAuthenticated || !user?.email) {
    return null;
  }

  if (!adminEmails.includes(user.email.toLowerCase())) {
    return null;
  }

  return <>{children}</>;
}
