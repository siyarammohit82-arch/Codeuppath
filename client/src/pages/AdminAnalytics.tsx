import { useMemo } from "react";
import { ChartLine, TrendingUp, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchAdminOverview } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";

export default function AdminAnalytics() {
  const { accessToken } = useAuth();
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchAdminOverview(accessToken),
    enabled: Boolean(accessToken),
  });

  const insights = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        label: "Growth",
        value: `${data.users.toLocaleString()} members`,
        description: "Monthly active users",
        icon: TrendingUp,
      },
      {
        label: "Opportunities",
        value: `${data.hackathons + data.resources} listings`,
        description: "Fresh curated items",
        icon: ChartLine,
      },
      {
        label: "Revenue",
        value: `$${(data.products * 1200).toLocaleString()}`,
        description: "Projected annual value",
        icon: Zap,
      },
    ];
  }, [data]);

  return (
    <AdminLayout pageTitle="Analytics" activeSection="Analytics">
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-semibold text-white">Insights</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {insights.map((insight) => (
              <div key={insight.label} className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <insight.icon className="h-4 w-4 text-cyan-300" />
                  <span>{insight.label}</span>
                </div>
                <p className="text-xl font-semibold text-white">{insight.value}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
