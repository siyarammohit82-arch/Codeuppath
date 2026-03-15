import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/0001-189647679367628502_1773166458634.png";
import {
  BarChart3,
  BookOpen,
  ChartLine,
  FileText,
  LayoutDashboard,
  PackagePlus,
  Settings,
  Sparkles,
  Users as UsersIcon,
  Menu as MenuIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const sidebarMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hackathons", href: "/admin/hackathons", icon: Sparkles },
  { label: "Learning Resources", href: "/admin/learning-resources", icon: BookOpen },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Products", href: "/admin/products", icon: PackagePlus },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
  { label: "Analytics", href: "/admin/analytics", icon: ChartLine },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
type AdminLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
  activeSection?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminLayout({
  children,
  pageTitle,
  activeSection = "Dashboard",
  searchValue = "",
  onSearchChange,
}: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarWidthClass = isCollapsed ? "lg:w-20" : "lg:w-72";
  const mainMarginClass = isCollapsed ? "lg:ml-20" : "lg:ml-72";

  const [location] = useLocation();

  const renderNavItems = (isOverlay?: boolean) =>
    sidebarMenu.map((item) => {
      const Icon = item.icon;
      const isActive = location === item.href;
      return (
        <Link
          key={`${item.label}-${isOverlay ? "overlay" : "desktop"}`}
          href={item.href}
          className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            isActive
              ? "bg-white/10 text-cyan-300 shadow-[0_10px_30px_rgba(59,130,246,0.35)]"
              : "text-muted-foreground hover:bg-white/5 hover:text-white"
          }`}
          onClick={() => {
            if (isOverlay) {
              setIsMobileOpen(false);
            }
          }}
        >
          <Icon className="h-5 w-5 text-current transition group-hover:text-cyan-300" />
          {!isCollapsed && !isOverlay ? (
            <span className="truncate">{item.label}</span>
          ) : null}
        </Link>
      );
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative lg:flex">
        <aside
          className={`fixed top-0 left-0 hidden h-full flex-col border-r border-white/5 bg-background/90 px-4 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur lg:flex ${sidebarWidthClass}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="CodeUpPath" className="h-8 w-8" />
              {!isCollapsed ? (
                <span className="text-lg font-display tracking-tight text-white">CodeUpPath</span>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed((value) => !value)}
              className="border border-white/10 text-white hover:border-cyan-400"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="mt-8 space-y-2">{renderNavItems()}</nav>
        </aside>

        <div
          className={`flex w-full flex-col transition-all duration-200 ${mainMarginClass}`}
        >
          <AdminTopbar
            pageTitle={pageTitle}
            onSearchChange={onSearchChange}
            searchValue={searchValue}
            onMobileMenuToggle={() => setIsMobileOpen(true)}
          />
          <main className="relative z-10 min-h-screen px-4 py-6 lg:px-8">{children}</main>
        </div>

        {isMobileOpen ? (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur"
              onClick={() => setIsMobileOpen(false)}
            />
            <aside className="relative z-10 w-72 bg-background/90 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoUrl} alt="CodeUpPath" className="h-8 w-8" />
                  <span className="text-lg font-display text-white">CodeUpPath</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-6 flex flex-col gap-2">{renderNavItems(true)}</nav>
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type AdminTopbarProps = {
  pageTitle: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onMobileMenuToggle: () => void;
};

function AdminTopbar({ pageTitle, searchValue = "", onSearchChange, onMobileMenuToggle }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileLabel = user?.profile?.fullName || user?.fullName || user?.email || "Admin";

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been redirected to the landing page.",
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
  };

  return (
    <div className="glass-panel sticky top-0 z-30 mx-0 mb-6 flex w-full items-center gap-4 border border-white/10 bg-black/60 px-4 py-3 shadow-xl backdrop-blur">
      <button
        type="button"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Open admin menu"
      >
        <MenuIcon className="h-6 w-6 text-white" />
      </button>

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Admin panel</p>
        <h1 className="text-2xl font-display text-white">{pageTitle}</h1>
      </div>

      <div className="flex-1">
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search everything"
          className="w-full max-w-2xl border-white/20 bg-white/5 text-white placeholder:text-white/60"
        />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-400"
            >
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarFallback>{profileLabel.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline">{profileLabel}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 border border-white/10 bg-black/80">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="text-sm font-semibold">{profileLabel}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-sm text-white">
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm text-white">
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
