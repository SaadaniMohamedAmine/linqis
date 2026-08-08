import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service — Linqis",
  description: "The terms that govern your use of Linqis.",
};

const LAST_UPDATED = "August 8, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-text-secondary">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-30%] right-[10%] w-[450px] h-[450px] bg-info/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[820px] mx-auto px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-lg bg-info-bg flex items-center justify-center text-info mx-auto mb-4">
            <FileText size={22} />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-text-secondary">Last updated {LAST_UPDATED}</p>
        </div>
      </div>

      <main className="max-w-[820px] mx-auto px-6 py-16">
        <Card className="p-8 md:p-10 space-y-10">
          <p className="text-sm leading-relaxed text-text-secondary">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of Linqis, the AI meeting
            summarizer operated by Linqis AI Inc. (&quot;Linqis&quot;, &quot;we&quot;, &quot;us&quot;). By creating an
            account or using the service, you agree to these Terms.
          </p>

          <Section title="1. The service">
            <p>Linqis records or ingests your meetings and uses AI to generate transcripts, executive summaries, decisions, and action items, and lets you search, share, export, and analyze that content across your workspace.</p>
          </Section>

          <Section title="2. Accounts &amp; workspaces">
            <p>You must provide accurate information to create an account and are responsible for activity under it. Workspaces have roles (owner, admin, member) that control who can manage billing, integrations, and team members — owners and admins are responsible for managing access within their workspace.</p>
          </Section>

          <Section title="3. Plans &amp; billing">
            <p>Linqis offers a Free plan (limited meetings per month, 30-day history, no exports) and a Pro plan billed via Stripe. Subscriptions renew automatically until cancelled; you can manage or cancel your subscription anytime from Settings → Billing. Fees are non-refundable except where required by law.</p>
          </Section>

          <Section title="4. Acceptable use">
            <p>You agree not to: upload content you don&apos;t have the right to record or share; use the service to violate any law or third party&apos;s rights (including recording-consent laws in your jurisdiction); attempt to reverse-engineer, disrupt, or abuse the service; or share API keys/credentials issued to your account with unauthorized parties.</p>
          </Section>

          <Section title="5. Your content">
            <p>You retain ownership of the meetings, recordings, and content you upload. You grant Linqis a limited license to process, store, and transform that content solely to provide the service to you and your workspace (transcription, summarization, search, exports). We do not use your content to train third-party models beyond what&apos;s required to generate your summaries.</p>
          </Section>

          <Section title="6. AI-generated content">
            <p>Transcripts, summaries, decisions, and action items are generated automatically by AI language models and may contain inaccuracies, omissions, or misattributions. You&apos;re responsible for reviewing AI-generated output before relying on it for decisions, compliance, or record-keeping.</p>
          </Section>

          <Section title="7. Third-party integrations">
            <p>Features that connect to Google Calendar, Zoom, Notion, Slack, or your own OpenAI API key rely on those third parties' services and are subject to their own terms. Linqis isn&apos;t responsible for outages, changes, or data handling on their end.</p>
          </Section>

          <Section title="8. Termination">
            <p>You may delete your account at any time from Settings → Danger Zone. We may suspend or terminate accounts that violate these Terms or pose a security risk to the service or other users.</p>
          </Section>

          <Section title="9. Disclaimer &amp; limitation of liability">
            <p>Linqis is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, Linqis AI Inc. is not liable for indirect, incidental, or consequential damages arising from your use of the service, including decisions made based on AI-generated summaries.</p>
          </Section>

          <Section title="10. Changes to these terms">
            <p>We may update these Terms as the product evolves. Continued use of Linqis after an update constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="11. Contact us">
            <p>Questions about these Terms? Reach us via our <Link href="/contact" className="text-success hover:underline">Contact page</Link>.</p>
          </Section>
        </Card>
      </main>
    </div>
  );
}
