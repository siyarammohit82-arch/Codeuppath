import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import logoUrl from "@assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { navItems, privateNav } from "@/lib/site";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user, isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const items = isAuthLoading ? [] : isAuthenticated ? privateNav : navItems;
  const profileLabel = user?.fullName || user?.email || "Profile";
  const avatarFallback = useMemo(() => {
    const source = user?.fullName?.trim() || user?.email?.trim() || "CU";
    const parts = source.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
  }, [user?.email, user?.fullName]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="glass-panel fixed left-0 right-0 top-0 z-50 border-x-0 border-t-0"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img src={logoUrl} alt="CodeUpPath" className="h-7 w-auto md:h-9" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {items.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium transition-colors ${
                  active ? "text-cyan-400" : "text-muted-foreground hover:text-cyan-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-white transition-all hover:border-cyan-400/50 hover:bg-white/10"
                >
                  <Avatar className="h-9 w-9 border border-cyan-400/20">
                    <AvatarImage src={user?.avatarUrl} alt={profileLabel} />
                    <AvatarFallback className="bg-cyan-400/15 text-xs font-semibold text-cyan-200">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#08111f]/95 text-white">
                <DropdownMenuLabel className="space-y-1">
                  <p className="text-sm font-semibold text-white">{profileLabel}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={async () => {
                    if (isLoggingOut) {
                      return;
                    }

                    setIsLoggingOut(true);

                    try {
                      await logout();
                      toast({
                        title: "Logged out",
                        description: "You are now signed out.",
                      });
                      navigate("/");
                    } catch (error) {
                      toast({
                        title: "Logout failed",
                        description: error instanceof Error ? error.message : "Unable to log out.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoggingOut(false);
                    }
                  }}
                  className="cursor-pointer text-slate-200 focus:bg-white/10 focus:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-[13px] font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:border-cyan-400/50 hover:bg-white/10 lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 px-6 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {items.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border border-transparent bg-white/0 text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  void logout();
                  setIsOpen(false);
                }}
                className="mt-2 rounded-xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </motion.header>
  );
}
