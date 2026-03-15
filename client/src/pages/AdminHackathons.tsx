import { FormEvent, useMemo, useState } from "react";
import { BookOpen, Calendar, FileText, Sparkles, Tag, Users, Zap } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  createHackathon,
  deleteHackathon,
  fetchAdminBlogPosts,
  fetchAdminHackathons,
  fetchAdminOverview,
  type AdminHackathon,
  updateHackathon,
} from "@/lib/admin";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { AdminHackathonCreateInput } from "@shared/routes";

const hackathonsPerPage = 6;

type FilterStatus = "all" | "published" | "draft";

type HackathonFormState = Omit<AdminHackathonCreateInput, "tags"> & {
  tagsInput: string;
};

const emptyFormState: HackathonFormState = {
  name: "",
  slug: "",
  organizer: "",
  mode: "",
  location: "",
  prize: 0,
  deadline: "",
  description: "",
  registrationUrl: "",
  bannerImage: "",
  isPublished: true,
  tagsInput: "",
};

const badgeColor = "bg-white/10 text-cyan-300 border border-white/5";

export default function AdminHackathons() {
  const { accessToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminHackathon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingHackathon, setEditingHackathon] = useState<AdminHackathon | null>(null);
  const [formState, setFormState] = useState<HackathonFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchAdminOverview(accessToken),
    enabled: Boolean(accessToken),
  });

  const hackathonsQuery = useQuery({
    queryKey: ["admin-hackathons"],
    queryFn: () => fetchAdminHackathons(accessToken),
    enabled: Boolean(accessToken),
  });

  const blogQuery = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: () => fetchAdminBlogPosts(accessToken),
    enabled: Boolean(accessToken),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: {
      mode: "create" | "edit";
      id?: number;
      input: AdminHackathonCreateInput;
    }) => {
      if (payload.mode === "create") {
        return createHackathon(accessToken, payload.input);
      }

      if (payload.id) {
        return updateHackathon(accessToken, payload.id, { ...payload.input, id: payload.id });
      }

      throw new Error("Missing hackathon ID.");
    },
    onSuccess: () => {
      toast({
        title: modalMode === "create" ? "Hackathon created" : "Hackathon updated",
        description: "Changes were saved successfully.",
      });
      setIsModalOpen(false);
      setEditingHackathon(null);
      setFormState(emptyFormState);
      queryClient.invalidateQueries({ queryKey: ["admin-hackathons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "Unable to save hackathon.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!deleteCandidate) {
        throw new Error("No hackathon selected.");
      }

      return deleteHackathon(accessToken, deleteCandidate.id);
    },
    onSuccess: () => {
      toast({
        title: "Hackathon removed",
        description: "The listing was deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-hackathons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setDeleteCandidate(null);
    },
  });

  const stats = useMemo(() => {
    const overview = overviewQuery.data;
    return [
      {
        label: "Total Users",
        value: overview ? overview.users.toLocaleString() : "—",
        icon: Users,
        accent: "from-blue-500 to-cyan-400",
        meta: "Members onboarded",
      },
      {
        label: "Hackathons",
        value: overview ? overview.hackathons.toLocaleString() : "—",
        icon: Sparkles,
        accent: "from-purple-500 to-pink-500",
        meta: "Curated listings",
      },
      {
        label: "Resources",
        value: overview ? overview.resources.toLocaleString() : "—",
        icon: BookOpen,
        accent: "from-emerald-500 to-lime-400",
        meta: "Learning cards",
      },
      {
        label: "Blogs",
        value: overview ? overview.blogs.toLocaleString() : "—",
        icon: FileText,
        accent: "from-orange-500 to-amber-400",
        meta: "Stories live",
      },
      {
        label: "Revenue",
        value: overview ? `$${(overview.products * 1200).toLocaleString()}` : "—",
        icon: Zap,
        accent: "from-cyan-400 to-blue-600",
        meta: "Subscription pipeline",
      },
    ];
  }, [overviewQuery.data]);

  const recentActivity = useMemo(() => {
    const hackathonEntries = hackathonsQuery.data?.items
      .slice(0, 3)
      .map((item) => ({
        title: item.name,
        description: `Deadline ${new Date(item.deadline).toLocaleDateString()}`,
        icon: Calendar,
      })) ?? [];
    const blogEntries = blogQuery.data?.items
      .slice(0, 2)
      .map((post) => ({
        title: post.title,
        description: `New blog: ${post.category}`,
        icon: FileText,
      })) ?? [];

    return [...hackathonEntries, ...blogEntries].slice(0, 4);
  }, [hackathonsQuery.data, blogQuery.data]);

  const filteredHackathons = useMemo(() => {
    const items = hackathonsQuery.data?.items ?? [];
    const normalized = searchTerm.trim().toLowerCase();
    const statusMatches = (item: AdminHackathon) => {
      if (statusFilter === "all") {
        return true;
      }

      return statusFilter === "published" ? item.isPublished : !item.isPublished;
    };

    return items.filter((item) => {
      const matchesSearch =
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.organizer.toLowerCase().includes(normalized);

      return matchesSearch && statusMatches(item);
    });
  }, [hackathonsQuery.data, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredHackathons.length / hackathonsPerPage));
  const startIndex =
    filteredHackathons.length === 0 ? 0 : (page - 1) * hackathonsPerPage + 1;
  const endIndex =
    filteredHackathons.length === 0 ? 0 : Math.min(page * hackathonsPerPage, filteredHackathons.length);

  const pageHackathons = filteredHackathons.slice(
    (page - 1) * hackathonsPerPage,
    page * hackathonsPerPage,
  );

  const quickActions = [
    {
      label: "Add Hackathon",
      description: "Surface a curated event quickly.",
      icon: Sparkles,
      action: () => openModal("create"),
    },
    {
      label: "Publish Blog",
      description: "Share a study guide or fresh update.",
      icon: FileText,
      action: () =>
        toast({
          title: "Blog publishing",
          description: "Blog editor is on the roadmap.",
        }),
    },
    {
      label: "Add Learning Resource",
      description: "Bring a new course or guide to learners.",
      icon: Tag,
      action: () =>
        toast({
          title: "Resources",
          description: "Learning resource module in progress.",
        }),
    },
    {
      label: "Send Newsletter",
      description: "Keep the community informed and motivated.",
      icon: Zap,
      action: () =>
        toast({
          title: "Newsletter",
          description: "Mailer automation will sync soon.",
        }),
    },
  ];

  function openModal(mode: "create" | "edit", record?: AdminHackathon) {
    setModalMode(mode);
    setFormError(null);
    setEditingHackathon(mode === "edit" && record ? record : null);
    if (record) {
      setFormState({
        name: record.name,
        slug: record.slug,
        organizer: record.organizer,
        mode: record.mode,
        location: record.location,
        prize: record.prize,
        deadline: record.deadline,
        description: record.description,
        registrationUrl: record.registrationUrl,
        bannerImage: record.bannerImage,
        isPublished: record.isPublished,
        tagsInput: record.tags?.join(", ") ?? "",
      });
    } else {
      setFormState(emptyFormState);
    }
    setIsModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const tags = formState.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: AdminHackathonCreateInput = {
      ...formState,
      tags,
    };

    saveMutation.mutate({
      mode: modalMode,
      id: editingHackathon?.id,
      input: payload,
    });
  }

  const beginDelete = (item: AdminHackathon) => {
    setDeleteCandidate(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout
      pageTitle="Dashboard"
      activeSection="Dashboard"
      searchValue={searchTerm}
      onSearchChange={(value) => {
        setSearchTerm(value);
        setPage(1);
      }}
    >
      <section className="space-y-6">
        {overviewQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]"
              >
                <Skeleton className="h-4 w-28 rounded-lg" />
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-10 w-32 rounded-xl" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(3,6,23,0.65)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {stat.label}
                  </span>
                  <stat.icon className="h-6 w-6 text-cyan-300" />
                </div>
                <p className="mt-6 text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300">{stat.meta}</p>
                <div
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.accent} opacity-40`}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Activity</p>
              <h2 className="text-2xl font-bold text-white">Recent activity</h2>
            </div>
            <div className={badgeColor}>
              {recentActivity.length} updates
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {recentActivity.length ? (
              recentActivity.map((entry) => (
                <div
                  key={entry.title}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 transition hover:border-cyan-400/40 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <entry.icon className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-white">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70">Live</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No activity to show yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Actions</p>
              <h2 className="text-xl font-semibold text-white">Quick tasks</h2>
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-between border-white/10 text-white"
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-4 w-4 text-cyan-300" />
                  <span>{action.label}</span>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Go</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Management</p>
            <h2 className="text-2xl font-bold text-white">Hackathons</h2>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as FilterStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44 text-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All updates</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search hackathons"
              className="max-w-md border-white/20 bg-black/30 text-white placeholder:text-white/60"
            />
            <button
              type="button"
              className="rounded-2xl border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:border-cyan-400/70 hover:text-white"
              onClick={() => openModal("create")}
            >
              Add new
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Organizer</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2">Deadline</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hackathonsQuery.isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={`loading-${index}`} className="animate-pulse">
                        <td className="px-3 py-4">
                          <Skeleton className="h-3 w-32" />
                        </td>
                        <td className="px-3 py-4">
                          <Skeleton className="h-3 w-24" />
                        </td>
                        <td className="px-3 py-4">
                          <Skeleton className="h-3 w-16" />
                        </td>
                        <td className="px-3 py-4">
                          <Skeleton className="h-3 w-20" />
                        </td>
                        <td className="px-3 py-4">
                          <Skeleton className="h-3 w-16" />
                        </td>
                        <td className="px-3 py-4 text-right">
                          <Skeleton className="h-8 w-24 rounded-full" />
                        </td>
                      </tr>
                    ))
                  : pageHackathons.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6">
                          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-black/30 py-10 text-center">
                            <Sparkles className="h-6 w-6 text-cyan-300" />
                            <p className="text-lg font-semibold text-white">No hackathons yet</p>
                            <p className="text-sm text-muted-foreground">Add your first curated event.</p>
                            <Button
                              variant="default"
                              onClick={() => openModal("create")}
                            >
                              Add new
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                    : pageHackathons.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-3 py-3 font-semibold text-white">{item.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">{item.organizer}</td>
                        <td className="px-3 py-3 text-muted-foreground">{item.mode}</td>
                        <td className="px-3 py-3 text-muted-foreground">{item.deadline}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.isPublished ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openModal("edit", item)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => beginDelete(item)}
                            >
                              Delete
                            </Button>
                            <Button size="sm" variant="secondary" asChild>
                              <a
                                href={`/hackathons/${item.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>
              Showing {startIndex} - {endIndex} of {filteredHackathons.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalMode === "create" ? "Add Hackathon" : "Edit Hackathon"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Save deadlines, organizers, and application links.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Title</label>
                <Input
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Global buildathon"
                  className="border-white/20 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Slug</label>
                <Input
                  value={formState.slug}
                  onChange={(event) => setFormState((prev) => ({ ...prev, slug: event.target.value }))}
                  placeholder="global-buildathon"
                  className="border-white/20 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Organizer</label>
                <Input
                  value={formState.organizer}
                  onChange={(event) => setFormState((prev) => ({ ...prev, organizer: event.target.value }))}
                  className="border-white/20 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mode</label>
                <Input
                  value={formState.mode}
                  onChange={(event) => setFormState((prev) => ({ ...prev, mode: event.target.value }))}
                  placeholder="Online / Offline"
                  className="border-white/20 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Location</label>
                <Input
                  value={formState.location}
                  onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
                  className="border-white/20 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Prize</label>
                <Input
                  type="number"
                  value={formState.prize}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, prize: Number(event.target.value) || 0 }))
                  }
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Deadline</label>
                <Input
                  type="date"
                  value={formState.deadline}
                  onChange={(event) => setFormState((prev) => ({ ...prev, deadline: event.target.value }))}
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Apply link</label>
                <Input
                  type="url"
                  value={formState.registrationUrl}
                  onChange={(event) => setFormState((prev) => ({ ...prev, registrationUrl: event.target.value }))}
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Banner image</label>
                <Input
                  type="url"
                  value={formState.bannerImage}
                  onChange={(event) => setFormState((prev) => ({ ...prev, bannerImage: event.target.value }))}
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Description</label>
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                placeholder="Outline mission, perks, and judging criteria."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tags</label>
                <Input
                  value={formState.tagsInput}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tagsInput: event.target.value }))}
                  placeholder="remote, beginner, ai"
                  className="border-white/20 bg-black/30 text-white"
                />
                <p className="text-xs text-muted-foreground">Comma separated for quick filtering.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status</label>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formState.isPublished}
                    onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isPublished: checked }))}
                  />
                  <span className="text-sm text-white">
                    {formState.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>

            {formError ? <p className="text-sm text-rose-400">{formError}</p> : null}

            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : modalMode === "create"
                    ? "Create Hackathon"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setDeleteCandidate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm removal</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the selected hackathon from the directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate();
                setIsDeleteDialogOpen(false);
              }}
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
