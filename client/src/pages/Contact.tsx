import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, MessageSquare, Share2 } from "lucide-react";
import { api, type ContactRequestInput, type ContactRequestResponse } from "@shared/routes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const links = [
  { label: "Email", value: "hello@codeuppath.com" },
  { label: "Instagram", value: "@codeuppath" },
  { label: "LinkedIn", value: "linkedin.com/company/codeuppath" },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactRequestInput>({
    name: "",
    email: "",
    message: "",
  });

  const mutation = useMutation<ContactRequestResponse, Error, ContactRequestInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.contactRequests.create.path, {
        method: api.contactRequests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to send message" }));
        throw new Error(error.message || "Failed to send message");
      }

      const json = await res.json();
      return api.contactRequests.create.responses[201].parse(json);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Contact request database me save ho gaya hai.",
      });
      setForm({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Unable to send",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 md:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Support & collaboration</p>
          <h1 className="text-4xl font-bold text-white">Contact the CodeUpPath team</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            The contact form is now database-backed. Send support, partnership, or community requests that automatically save to our Supabase table for quick follow-up.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 glass-panel p-8">
            <div className="mb-8 flex items-center gap-3 text-cyan-400">
              <MessageSquare className="h-5 w-5" />
              <p className="text-sm uppercase tracking-[0.35em]">Contact form</p>
            </div>
            <div className="space-y-5">
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Input
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Your email"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
              <Textarea
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Write your message or collaboration request"
                className="min-h-[160px] rounded-xl border-white/10 bg-white/5 text-white"
              />
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-display font-semibold text-slate-950 transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {mutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#0B101E] p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <Mail className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Direct links</p>
              </div>
              <div className="mt-8 space-y-4">
                {links.map((link) => (
                  <div key={link.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{link.label}</p>
                    <p className="mt-3 break-all text-white">{link.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 glass-card p-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <Share2 className="h-5 w-5" />
                <p className="text-sm uppercase tracking-[0.35em]">Collaboration</p>
              </div>
              <p className="mt-5 leading-7 text-muted-foreground">
                Hackathon organizers, event hosts, community leads, and certificate partners can submit collaboration requests here. Each submission saves to our contact table.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
