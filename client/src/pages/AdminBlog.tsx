import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminBlogPosts } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlog() {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: () => fetchAdminBlogPosts(accessToken),
    enabled: Boolean(accessToken),
  });

  return (
    <AdminLayout pageTitle="Blog" activeSection="Blog">
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Management</p>
            <h2 className="text-2xl font-semibold text-white">Blog posts</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Blog editor", description: "Coming soon" })}
          >
            Create post
          </Button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
              : data?.items.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-white">{post.title}</p>
                      <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.category}</p>
                    <p className="mt-2 text-sm text-white/70">{post.summary}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
