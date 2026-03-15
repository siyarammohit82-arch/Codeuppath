import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({
  children,
  requireProfileComplete = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isProfileComplete, isAuthLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (requireProfileComplete && !isProfileComplete) {
      navigate("/profile");
    }
  }, [isAuthLoading, isAuthenticated, isProfileComplete, navigate, requireProfileComplete]);

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireProfileComplete && !isProfileComplete) {
    return null;
  }

  return <>{children}</>;
}
