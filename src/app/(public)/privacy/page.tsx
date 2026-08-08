import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy — Linqis",
  description: "How Linqis collects, uses, and protects your meeting data.",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-30%] left-[10%] w-[450px] h-[450px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[820px] mx-auto px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-lg bg-success-bg flex items-center justify-center text-success mx-auto mb-4">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-text-secondary">Last updated {LAST_UPDATED}</p>
        </div>
      </div>

      <main className="max-w-[820px] mx-auto px-6 py-16">
        <Card className="p-8 md:p-10 space-y-10">
          <p className="text-sm leading-relaxed text-text-secondary">
            Linqis AI Inc. (&quot;Linqis&quot;, &quot;we&quot;, &quot;us&quot;) builds an AI meeting summarizer that
            turns your recordings into transcripts, executive summaries, decisions, and action items. This policy
            explains what we collect, why, and how you stay in control of it.
          </p>

          <Section title="1. Information we collect">
            <p><strong className="text-text-primary">Account information:</strong> name, email address, and profile photo, whether you sign up with email/password or Google OAuth.</p>
            <p><strong className="text-text-primary">Meeting content:</strong> the audio/video files or recordings you upload, plus the transcripts, AI-generated summaries, decisions, and action items derived from them.</p>
            <p><strong className="text-text-primary">Integration data:</strong> if you connect Google Calendar, Zoom, Notion, or Slack, we store the minimum OAuth tokens or API credentials needed to sync events, import recordings, or export summaries to those services.</p>
            <p><strong className="text-text-primary">Workspace &amp; usage data:</strong> workspace membership, roles (owner/admin/member), and usage metrics such as meetings analyzed, hours transcribed, and action-item completion, used to power your dashboard analytics.</p>
            <p><strong className="text-text-primary">Billing data:</strong> if you upgrade to Pro, payments are processed by Stripe. We store your plan and subscription status, not your card details.</p>
          </Section>

          <Section title="2. How we use your information">
            <p>We use your data to: transcribe and summarize your meetings; surface action items and analytics; keep your workspace and team in sync; send transactional emails (password resets, invites); and process billing for paid plans.</p>
            <p>We do not sell your meeting content or personal data to third parties.</p>
          </Section>

          <Section title="3. AI processing &amp; third-party models">
            <p>
              Transcription and summarization are performed using AI language models. By default we use our shared
              processing pipeline; if you add your own OpenAI API key in <Link href="/dashboard/settings" className="text-success hover:underline">Settings</Link>,
              your meetings are processed through your own key instead, and billed directly to your OpenAI account.
            </p>
            <p>AI-generated summaries and action items are produced automatically and may occasionally be inaccurate — see our <Link href="/terms" className="text-success hover:underline">Terms of Service</Link> for details.</p>
          </Section>

          <Section title="4. Data retention &amp; deletion">
            <p>We retain your meeting content and account data for as long as your account is active, or as needed to provide the service (e.g. the Free plan retains 30 days of history).</p>
            <p>
              You control deletion directly from <Link href="/dashboard/settings" className="text-success hover:underline">Settings → Danger Zone</Link>: &quot;Wipe All History&quot;
              permanently removes all transcripts and summaries, and &quot;Delete Account&quot; permanently deactivates your profile. Both actions are irreversible.
            </p>
          </Section>

          <Section title="5. Data sharing">
            <p>We share data only with the services required to run Linqis: Stripe (billing), our email provider (transactional email), our cloud hosting and database providers, and the third-party integrations you explicitly connect (Google Calendar, Zoom, Notion, Slack). Each of those providers processes data under their own privacy policy.</p>
          </Section>

          <Section title="6. Security">
            <p>Integration credentials are stored encrypted at rest. Access to your workspace is governed by role-based permissions (owner/admin/member), and authentication uses industry-standard session tokens. No method of transmission or storage is 100% secure, but we work to protect your data at every layer.</p>
          </Section>

          <Section title="7. Your rights">
            <p>Depending on your location, you may have the right to access, correct, export, or delete your personal data. You can self-serve most of this from Settings; for anything else, reach out via our <Link href="/contact" className="text-success hover:underline">Contact page</Link>.</p>
          </Section>

          <Section title="8. Cookies &amp; local storage">
            <p>We use local storage (not third-party tracking cookies) to remember session state, your active workspace, and your language preference.</p>
          </Section>

          <Section title="9. Children's privacy">
            <p>Linqis is not directed at individuals under 16, and we do not knowingly collect data from them.</p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>We may update this policy as the product evolves. Material changes will be reflected by updating the &quot;Last updated&quot; date above.</p>
          </Section>

          <Section title="11. Contact us">
            <p>Questions about this policy? Reach us via our <Link href="/contact" className="text-success hover:underline">Contact page</Link>.</p>
          </Section>
        </Card>
      </main>
    </div>
  );
}
