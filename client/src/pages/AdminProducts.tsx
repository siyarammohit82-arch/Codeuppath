import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminProducts } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchAdminProducts(accessToken),
    enabled: Boolean(accessToken),
  });

  return (
    <AdminLayout pageTitle="Products" activeSection="Products">
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Products</p>
            <h2 className="text-2xl font-semibold text-white">Monetization</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Product management", description: "Build features soon." })}
          >
            Add product
          </Button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
              : data?.items.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-white">{product.name}</p>
                      <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                        {product.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{product.description}</p>
                    <p className="mt-2 text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
