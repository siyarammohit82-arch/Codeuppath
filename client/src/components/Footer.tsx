import { Link } from "wouter";
import { Terminal, Github, Twitter, Disc } from "lucide-react";
import logoUrl from "@assets/0001-189647679367628502_1773166458634.png";
import { useAuth } from "@/hooks/use-auth";
import { navItems, privateNav, profileNav } from "@/lib/site";

export function Footer() {
  const { isAuthenticated, isProfileComplete } = useAuth();
  const items = isAuthenticated ? (isProfileComplete ? privateNav : profileNav) : navItems;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/50 pb-10 pt-20">
      <div className="absolute left-1/2 top-0 h-1 w-[1000px] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <img src={logoUrl} alt="CodeUpPath" className="h-8 w-auto md:h-10" />
            </div>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Discover hackathons, internships, learning resources, tech updates, and community connections in one focused platform for students and developers.
            </p>
            <div className="flex items-center gap-4">
              <button className="rounded-lg bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white">
                <Github className="h-5 w-5" />
              </button>
              <button className="rounded-lg bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="rounded-lg bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-indigo-400">
                <Disc className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-white">Navigation</h4>
            <ul className="space-y-3">
              {items.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground transition-colors hover:text-cyan-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-cyan-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground transition-colors hover:text-cyan-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground transition-colors hover:text-cyan-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="mb-4 text-sm text-muted-foreground md:mb-0">
            (c) {new Date().getFullYear()} CodeUpPath. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-muted-foreground transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-muted-foreground transition-colors hover:text-white">
              Refund Policy
            </Link>
            <Link href="/play-store" className="text-muted-foreground transition-colors hover:text-white">
              Play Store Listing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
