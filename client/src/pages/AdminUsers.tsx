import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminUsers } from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";

export default function AdminUsers() {
  const { accessToken } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchAdminUsers(accessToken),
    enabled: Boolean(accessToken),
  });

  return (
    <AdminLayout pageTitle="Users" activeSection="Users">
      <section className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <table className="w-full table-auto border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Full name</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      {Array.from({ length: 4 }).map((cell, col) => (
                        <td key={col} className="px-3 py-3">
                          <Skeleton className="h-3 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.items.map((user) => (
                    <tr key={user.id} className="bg-black/30">
                      <td className="px-3 py-3 font-semibold text-white">{user.email}</td>
                      <td className="px-3 py-3 text-muted-foreground">{user.fullName}</td>
                      <td className="px-3 py-3 text-muted-foreground">{user.country || "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{user.userRole || "user"}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
