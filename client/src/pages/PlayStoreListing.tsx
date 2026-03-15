import { PolicyLayout } from "@/components/PolicyLayout";

const features = [
  "Live opportunity feed with hackathons, internships, scholarships, and certifications.",
  "Curated learning paths and AI-driven roadmaps that adapt to your goals.",
  "Product studio add-ons, mentor-ready summaries, and community alerts.",
  "Push notifications for deadlines, exclusive launches, and Discord events.",
];

export default function PlayStoreListing() {
  const sections = [
    {
      title: "Title",
      content: <p>CodeUpPath — Hackathons, Internships &amp; AI Roadmaps</p>,
    },
    {
      title: "Short Description",
      content: <p>All-in-one discovery for hackathons, learning, and career boosts with AI support.</p>,
    },
    {
      title: "Full Description",
      content: (
        <div className="space-y-3">
          <p>
            CodeUpPath surfaces the highest-impact opportunities for students and early-career builders. Browse verified hackathons,
            internships, scholarships, and curated learning resources with smart filters and instant reminders. Generate AI-ready roadmaps,
            track deadlines, and share progress with mentors.
          </p>
          <div>
            <p className="text-sm text-muted-foreground">Features:</p>
            <ul className="list-inside list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <p>Download CodeUpPath to stop searching and start building.</p>
        </div>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Play Store Listing"
      description="Title, short description, and full store copy ready to publish."
      sections={sections}
    />
  );
}
