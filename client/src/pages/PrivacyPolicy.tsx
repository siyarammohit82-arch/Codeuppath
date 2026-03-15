import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Introduction",
      content: (
        <p>
          CodeUpPath (“we”, “our”, “us”) is a technology opportunity platform that helps students and developers discover
          internships, hackathons, learning resources, projects, and career guidance. This Privacy Policy explains how we
          collect, use, store, and protect your information when you use our website, mobile application, or services.
        </p>
      ),
    },
    {
      title: "Information We Collect",
      content: (
        <div className="space-y-3">
          <p>We collect data that powers personalization, analytics, and secure access:</p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Personal: full name, email, phone (optional), resume/portfolio, and support requests.</li>
            <li>App & technical: IP address, device type, browser/app usage, pages visited, session duration, referrals.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Account & Authentication",
      content: <p>Accounts unlock tracking, dashboards, saved listings, and community features. Authentication data only powers secure login and functionality.</p>,
    },
    {
      title: "App Permissions",
      content: (
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Internet access for core discovery, filters, and updates.</li>
          <li>Notifications for opportunity alerts or roadmap prompts.</li>
          <li>Storage access for resume uploads or downloads.</li>
          <li>We disclose any new permissions before they are required.</li>
        </ul>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Provide platform features, opportunity recommendations, and premium services.</li>
          <li>Improve performance, usability, and AI outputs.</li>
          <li>Communicate updates, offers, or support notices.</li>
          <li>Monitor fraud, security risks, and abuse patterns.</li>
        </ul>
      ),
    },
    {
      title: "Analytics & Crash Reporting",
      content: <p>We collect anonymous analytics and crash logs to improve stability, reliability, and feature quality.</p>,
    },
    {
      title: "Advertising & Promotions",
      content: <p>CodeUpPath may display ads or sponsored content. Third parties may use limited data to surface relevant promotions.</p>,
    },
    {
      title: "Payments & Premium Features",
      content: <p>Paid features and subscriptions require payment. Pricing, billing, and refund conditions are communicated before purchase.</p>,
    },
    {
      title: "Third-Party Services",
      content: <p>We rely on trusted providers (hosting, auth, analytics, payments, community tools). They process limited data for operational purposes, and we do not sell or rent personal data.</p>,
    },
    {
      title: "Data Security",
      content: <p>We implement reasonable technical and organizational safeguards. No digital system guarantees complete security, so share data at your discretion.</p>,
    },
    {
      title: "Data Retention & User Rights",
      content: (
        <div className="space-y-3">
          <p>We keep data only as long as needed for account functionality, service delivery, compliance, and platform improvements.</p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>You can request access, corrections, deletion, or withdraw consent via support.</li>
            <li>Deletion requests process through support or (future) settings.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "External Links & Children",
      content: (
        <div className="space-y-3">
          <p>Our platform links to third-party providers. We are not responsible for their privacy practices.</p>
          <p>CodeUpPath is intended for users aged 13 years and above. We do not knowingly collect data from younger children.</p>
        </div>
      ),
    },
    {
      title: "Policy Updates & Contact",
      content: (
        <div className="space-y-2">
          <p>We may update this policy periodically. Continued use means you accept the changes.</p>
          <p>Contact Support — <a href="mailto:support@codeuppath.com" className="text-cyan-300 underline">support@codeuppath.com</a></p>
        </div>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      description="Learn what we collect, how we use it, and how you stay in control across the CodeUpPath platform."
      sections={sections}
    />
  );
}
