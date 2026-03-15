import { PolicyLayout } from "@/components/PolicyLayout";

export default function TermsOfService() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: <p>By accessing or using CodeUpPath website, app, or services you agree to comply with these Terms. If you do not agree, discontinue use immediately.</p>,
    },
    {
      title: "Platform Purpose",
      content: (
        <p>
          CodeUpPath delivers opportunity discovery (internships, hackathons, certifications), curated learning resources, community tools,
          resume/portfolio services, and premium productivity features. We may modify or discontinue any feature at our discretion.
        </p>
      ),
    },
    {
      title: "User Responsibilities",
      content: (
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Provide accurate information and keep profiles current.</li>
          <li>Use services lawfully without disruption, hacking, or abuse.</li>
          <li>Respect intellectual property rights and the community.</li>
        </ul>
      ),
    },
    {
      title: "Account Security",
      content: <p>Users are responsible for keeping login credentials confidential. Report unauthorized access or suspicious activity immediately.</p>,
    },
    {
      title: "Payments & Subscriptions",
      content: (
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Premium features may require payment. Pricing, billing cycles, and refund terms are shown before purchase.</li>
          <li>Fraudulent payments, abusive chargebacks, or policy violations may result in account termination.</li>
        </ul>
      ),
    },
    {
      title: "Opportunity Disclaimer",
      content: <p>We aggregate third-party opportunities. We do not guarantee selection, hiring outcomes, or third-party accuracy. Validate everything independently.</p>,
    },
    {
      title: "Intellectual Property",
      content: <p>All branding, UI, content, and resources belong to CodeUpPath unless stated otherwise. Unauthorized copying or redistribution is prohibited.</p>,
    },
    {
      title: "Third-Party Platforms",
      content: <p>Links to external services are for convenience. We are not responsible for their content, performance, or policies.</p>,
    },
    {
      title: "Service Availability",
      content: <p>We aim for reliability but cannot guarantee uninterrupted access. Maintenance, outages, or technical issues can occur.</p>,
    },
    {
      title: "Limitation of Liability",
      content: <p>CodeUpPath is not liable for missed opportunities, hiring results, data loss, delays, platform downtime, or external damages.</p>,
    },
    {
      title: "Termination",
      content: <p>Accounts that violate Terms may be suspended or terminated.</p>,
    },
    {
      title: "Changes to Terms",
      content: <p>We may update these Terms anytime. Continued use means acceptance.</p>,
    },
    {
      title: "Governing Law & Contact",
      content: (
        <div className="space-y-2">
          <p>These Terms are governed by the laws of India.</p>
          <p>Contact support via <a href="mailto:support@codeuppath.com" className="text-cyan-300 underline">support@codeuppath.com</a></p>
        </div>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Terms of Service"
      description="The legal guardrails for using CodeUpPath, hiring our services, and benefiting from our opportunity engine."
      sections={sections}
    />
  );
}
