import { useMemo } from "react";
import { BookOpen, FileText, Sparkles, Users, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { fetchAdminOverview } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
  {
    label: "Create Hackathon",
    description: "Add curated events for students.",
  },
  {
    label: "Publish Blog",
    description: "Share insights or launch notes.",
  },
  {
    label: "Add Learning Resource",
    description: "Bring a course, guide, or certification.",
  },
];

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchAdminOverview(accessToken),
    enabled: Boolean(accessToken),
  });

  const stats = useMemo(() => {
    const overview = overviewQuery.data;
    return [
      {
        label: "Users",
        value: overview ? overview.users.toLocaleString() : "—",
        meta: "Active members",
        icon: Users,
        accent: "from-blue-500 to-cyan-400",
      },
      {
        label: "Hackathons",
        value: overview ? overview.hackathons.toLocaleString() : "—",
        meta: "Curated events",
        icon: Sparkles,
        accent: "from-purple-500 to-pink-500",
      },
      {
        label: "Resources",
        value: overview ? overview.resources.toLocaleString() : "—",
        meta: "Learnings live",
        icon: BookOpen,
        accent: "from-emerald-500 to-lime-400",
      },
      {
        label: "Stories",
        value: overview ? overview.blogs.toLocaleString() : "—",
        meta: "Blog posts",
        icon: FileText,
        accent: "from-orange-500 to-amber-400",
      },
      {
        label: "Revenue",
        value: overview ? `$${(overview.products * 1200).toLocaleString()}` : "—",
        meta: "Projected worth",
        icon: Zap,
        accent: "from-cyan-400 to-blue-600",
      },
    ];
  }, [overviewQuery.data]);

  const handleQuickAction = (label: string) => {
    toast({
      title: label,
      description: "Feature landing soon.",
    });
  };

  return (
    <AdminLayout pageTitle="Dashboard" activeSection="Dashboard">
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)] transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>{stat.label}</span>
                <stat.icon className="h-5 w-5 text-cyan-300" />
              </div>
              <p className="mt-4 text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-300">{stat.meta}</p>
              <span
                className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.accent} opacity-50`}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Spotlight</p>
                <h2 className="text-2xl font-bold text-white">Platform health snapshot</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => handleQuickAction("Refresh stats")}
              >
                Refresh
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Monitor adoption, traffic, and conversion velocity with a quick glance at your core signals.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Profile completion</p>
                <p className="text-3xl font-semibold text-white">78%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Conversion rate</p>
                <p className="text-3xl font-semibold text-white">12.4%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">New signups (30d)</p>
                <p className="text-3xl font-semibold text-white">1,842</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Quick actions</p>
            <h2 className="text-xl font-semibold text-white">Launchpad</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleQuickAction(action.label)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:border-cyan-400"
                >
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
