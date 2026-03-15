import { PolicyLayout } from "@/components/PolicyLayout";

export default function RefundPolicy() {
  const sections = [
    {
      title: "Scope & Purpose",
      content: <p>This policy covers refunds for services, digital products, and subscriptions purchased through CodeUpPath.</p>,
    },
    {
      title: "Refund Eligibility Conditions",
      content: (
        <div className="space-y-3">
          <p>Eligibility varies by product type:</p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong>Professional services:</strong> Refunds apply only if delivery has not yet begun. Once work initiates or a session is completed, tickets are prorated or credited.
            </li>
            <li>
              <strong>Digital products:</strong> Refunds allowed within 14 days if the asset has not been downloaded or consumed. Access marks the sale as final.
            </li>
            <li>
              <strong>Subscriptions:</strong> Cancel within the first billing cycle (14 days) for a refund. After that, you may cancel but charges are non-refundable unless due to error.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Refund Request Process",
      content: (
        <div className="space-y-3">
          <p>Send the following to <a href="mailto:support@codeuppath.com" className="text-cyan-300 underline">support@codeuppath.com</a>:</p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Full name, email, and order or subscription ID.</li>
            <li>Reason for request and any supporting evidence.</li>
          </ul>
          <p>We acknowledge within 2 business days, request any clarification, and confirm approval or denial. Approved refunds are issued within 5–7 business days.</p>
        </div>
      ),
    },
    {
      title: "Non-Refundable Situations",
      content: (
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Services already delivered, completed, or attended (e.g., mentoring calls, live workshops).</li>
          <li>Digital downloads or course modules marked as “Delivered” or accessed.</li>
          <li>Abuse, policy violations, or fraudulent claims.</li>
          <li>Failure to cancel recurring plans at least 48 hours before the next billing date.</li>
        </ul>
      ),
    },
    {
      title: "Chargeback & Dispute Handling",
      content: (
        <div className="space-y-3">
          <p>Contact support before initiating a chargeback. Provide transaction details so we can resolve quickly.</p>
          <p>We cooperate with payment partners using logs and communication history. Repeated chargebacks may lead to account restrictions.</p>
        </div>
      ),
    },
    {
      title: "Processing Timeline",
      content: (
        <div className="space-y-2">
          <p>Once approved, refunds reach the original payment method within 5–7 business days.</p>
          <p>Card issuers may take up to 10 business days. We email confirmation with a reference number when the refund is issued.</p>
        </div>
      ),
    },
    {
      title: "Contact & Escalation",
      content: (
        <div className="space-y-2">
          <p>If the outcome is unclear, reply to the confirmation email or reach out to <a href="mailto:support@codeuppath.com" className="text-cyan-300 underline">support@codeuppath.com</a>. A specialist responds within 48 hours.</p>
        </div>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="Refund Policy"
      description="Understand when refunds are possible, how to request them, and what to expect after approval."
      sections={sections}
    />
  );
}
