import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminLearningResources } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLearningResources() {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-learning-resources"],
    queryFn: () => fetchAdminLearningResources(accessToken),
    enabled: Boolean(accessToken),
  });

  const resources = data?.items ?? [];

  return (
    <AdminLayout pageTitle="Learning Resources" activeSection="Learning Resources">
      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Management</p>
            <h2 className="text-2xl font-semibold text-white">Learning resources</h2>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search resources"
              className="max-w-sm border-white/20 bg-black/30 text-white placeholder:text-white/60"
            />
            <Button
              onClick={() =>
                toast({
                  title: "Coming soon",
                  description: "Editing and creation flows for learning resources land soon.",
                })
              }
            >
              Add resource
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, col) => (
                          <td key={col} className="px-3 py-3">
                            <Skeleton className="h-3 w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : resources.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">
                          No resources yet.
                        </td>
                      </tr>
                    )
                    : resources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-white/5">
                        <td className="px-3 py-3 font-semibold text-white">{resource.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">{resource.provider}</td>
                        <td className="px-3 py-3 text-muted-foreground">{resource.category}</td>
                        <td className="px-3 py-3 text-muted-foreground">{resource.duration}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {resource.isPublished ? "Published" : "Draft"}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
