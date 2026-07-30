import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
        <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
          <Link href="/" className="text-xl font-bold text-success">Lynqis</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-text-secondary hover:text-success transition-colors">Dashboard</Link>
            <Link href="/meetings" className="text-text-secondary hover:text-success transition-colors">Meetings</Link>
            <Link href="/pricing" className="text-success border-b-2 border-success pb-1">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto min-h-screen">
        {/* Hero */}
        <section className="text-center mb-24">
          <h1 className="text-5xl font-semibold mb-4 tracking-tighter">Simple pricing. Real value.</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            High-fidelity AI meeting intelligence for individuals and teams who demand clarity without the fluff.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-sm text-text-secondary">Monthly</span>
            <div className="relative w-14 h-8 bg-surface rounded-full border border-border p-1">
              <div className="w-6 h-6 bg-success rounded-full shadow-md" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Yearly</span>
              <Badge variant="success">Save 20%</Badge>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* Free */}
          <Card className="flex flex-col hover:border-border-hover transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">Free</h3>
              <p className="text-sm text-text-secondary">For individuals getting started.</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$0</span>
                <span className="text-text-secondary">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>5 Meetings / Month</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>AI Summaries (Standard)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>30-day History</span>
              </li>
              <li className="flex items-center gap-2 opacity-50">
                <span className="text-text-muted"></span>
                <span>CRM Integrations</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full">Get Started</Button>
          </Card>

          {/* Pro */}
          <Card className="relative flex flex-col border-2 border-success scale-105 z-10 shadow-2xl shadow-success/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-success text-background font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">Most Popular</div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">Pro</h3>
              <p className="text-sm text-text-secondary">Deep insights for power users.</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$29</span>
                <span className="text-text-secondary">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Unlimited Meetings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Advanced AI Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Action Item Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Standard Integrations</span>
              </li>
            </ul>
            <Button variant="primary" className="w-full font-bold">Upgrade to Pro</Button>
          </Card>

          {/* Team */}
          <Card className="flex flex-col hover:border-border-hover transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">Team</h3>
              <p className="text-sm text-text-secondary">Scale efficiency across the org.</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$79</span>
                <span className="text-text-secondary">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Up to 10 Seats included</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Centralized Workspace</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Custom AI Prompts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>SSO & Security</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full">Contact Sales</Button>
          </Card>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group bg-surface/80 backdrop-blur-md rounded-lg overflow-hidden border border-border">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-surface transition-all">
                <span className="text-lg font-semibold">How does Lynqis AI handle data security?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-6 pt-0 text-text-secondary leading-relaxed">
                Security is our top priority. All meeting transcriptions and data are encrypted at rest and in transit using enterprise-grade AES-256 encryption. We are SOC-2 Type II compliant and never train our public models on your private data.
              </div>
            </details>
            <details className="group bg-surface/80 backdrop-blur-md rounded-lg overflow-hidden border border-border">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-surface transition-all">
                <span className="text-lg font-semibold">Can I cancel my subscription at any time?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-6 pt-0 text-text-secondary leading-relaxed">
                Yes, you can cancel your monthly or yearly plan at any point through your dashboard. You will maintain access to your plan's features until the end of the current billing cycle.
              </div>
            </details>
            <details className="group bg-surface/80 backdrop-blur-md rounded-lg overflow-hidden border border-border">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-surface transition-all">
                <span className="text-lg font-semibold">Does Lynqis work with all video platforms?</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-6 pt-0 text-text-secondary leading-relaxed">
                Lynqis seamlessly integrates with Zoom, Microsoft Teams, Google Meet, and Cisco Webex. You can also upload raw audio/video files directly for post-meeting analysis.
              </div>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface mt-24">
        <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-success">Lynqis</span>
            <span className="text-sm text-text-secondary">© 2024 Lynqis Intelligence Inc.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-text-secondary hover:text-success transition-colors text-sm">Privacy Policy</Link>
            <Link href="#" className="text-text-secondary hover:text-success transition-colors text-sm">Terms of Service</Link>
            <Link href="#" className="text-text-secondary hover:text-success transition-colors text-sm">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
