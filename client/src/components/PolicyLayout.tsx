import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface PolicySection {
  title: string;
  content: ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  description?: string;
  sections: PolicySection[];
}

export function PolicyLayout({ title, description, sections }: PolicyLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-4xl space-y-10 px-4 pb-24 pt-32 sm:px-6 md:px-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          {description ? <p className="text-base text-muted-foreground">{description}</p> : null}
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <div className="space-y-3 text-base leading-relaxed text-muted-foreground">{section.content}</div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
