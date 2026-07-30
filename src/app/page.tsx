import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
        <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
          <Link href="/" className="text-xl font-bold tracking-tight text-success">
            Lynqis
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-text-secondary hover:text-success transition-colors">
              Dashboard
            </Link>
            <Link href="/meetings" className="text-text-secondary hover:text-success transition-colors">
              Meetings
            </Link>
            <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">
              Pricing
            </Link>
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

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[800px] flex items-center px-6 max-w-[1440px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col justify-center py-12 z-10">
              <div className="inline-flex items-center gap-2 bg-surface px-4 py-1 rounded-full border border-border mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success">NEW: AI Summary V2.0</span>
              </div>
              <h1 className="text-6xl leading-[1.1] font-extrabold tracking-tighter mb-6">
                Every meeting, <span className="text-success">decoded.</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-lg mb-12">
                Lynqis transforms chaotic conversations into structured action items. Use AI-driven intelligence to capture every insight, automatically.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/sign-up">
                  <Button variant="primary" size="lg">Start free</Button>
                </Link>
                <Button variant="secondary" size="lg">See how it works</Button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative flex items-center justify-center pt-12 md:pt-0">
              <Card className="p-6 rounded-xl w-full max-w-[580px] shadow-2xl animate-float relative z-10 bg-surface/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-success">📊</span>
                    <span className="text-sm font-medium">Meeting Analysis: Q3 Strategy</span>
                  </div>
                  <span className="text-xs text-text-secondary">04:32 / 18:45</span>
                </div>
                <div className="h-20 flex items-end gap-[3px] mb-6 px-1">
                  {[30, 60, 80, 50, 90, 100, 70, 40, 60, 20, 70, 30].map((h, i) => (
                    <div key={i} className="flex-1 bg-success/20 h-[30%] rounded-full" style={{ height: `${h}%`, background: h > 70 ? 'var(--color-success)' : h > 40 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.3)' }} />
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg border border-border flex items-center gap-4">
                    <span className="text-success">✓</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Finalize Q4 roadmap by Friday</p>
                      <p className="text-xs text-text-secondary">Assigned to Sarah K.</p>
                    </div>
                    <Badge variant="danger">URGENT</Badge>
                  </div>
                  <div className="bg-background p-4 rounded-lg border border-border flex items-center gap-4 opacity-60">
                    <span className="text-text-secondary">○</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Schedule sync with dev team</p>
                      <p className="text-xs text-text-secondary">Pending... (AI Tag: Ops)</p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-success/10 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface/50">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="mb-24 text-center">
              <h2 className="text-3xl font-semibold mb-4">Superpowered by Intelligence</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">Focused on speed, privacy, and actionable outcomes for high-performance teams.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:border-success/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-border group-hover:border-success/30 transition-colors">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Transcription</h3>
                <p className="text-sm text-text-secondary">Proprietary neural engines convert speech to text with 99.4% accuracy in real-time, handling 40+ languages natively.</p>
              </Card>
              <Card className="hover:border-success/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-border group-hover:border-success/30 transition-colors">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Summary</h3>
                <p className="text-sm text-text-secondary">Get concise executive summaries and bulleted action items generated by a custom GPT model trained on business contexts.</p>
              </Card>
              <Card className="hover:border-success/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-border group-hover:border-success/30 transition-colors">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Anywhere</h3>
                <p className="text-sm text-text-secondary">One-click integrations with Notion, Slack, Jira, and GitHub. Sync your meeting insights directly to your workspace.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-24">
              <div className="flex-1">
                <h2 className="text-3xl font-semibold mb-12">From voice to value in seconds.</h2>
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-success text-background flex items-center justify-center font-bold">1</div>
                      <div className="w-px h-16 bg-border" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Upload</h4>
                      <p className="text-sm text-text-secondary">Record live or drag and drop any video or audio file. We support all major formats including MP4, MP3, and WAV.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface border border-text-secondary text-text-primary flex items-center justify-center font-bold">2</div>
                      <div className="w-px h-16 bg-border" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Process</h4>
                      <p className="text-sm text-text-secondary">Our AI engine analyzes the transcript, identifies speakers, and extracts key decisions using semantic understanding.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface border border-text-secondary text-text-primary flex items-center justify-center font-bold">3</div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Export</h4>
                      <p className="text-sm text-text-secondary">Review your dashboard and push the results to your favorite tools. Your knowledge base grows with every meeting.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-surface rounded-2xl overflow-hidden border border-border relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-success/20 p-4 rounded-full inline-flex mb-4">
                      <span className="text-success text-4xl">▶</span>
                    </div>
                    <p className="font-medium">Watch product demo</p>
                    <p className="text-xs text-text-secondary">2:14 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-success/5">
          <div className="max-w-[1440px] mx-auto px-6 text-center">
            <h2 className="text-5xl font-semibold mb-6">Ready to stop taking notes?</h2>
            <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto">Join 50,000+ teams who use Lynqis to stay aligned without the manual effort.</p>
            <div className="flex justify-center items-center gap-4">
              <Link href="/sign-up">
                <Button variant="primary" size="lg">Start your free trial</Button>
              </Link>
              <Button variant="secondary" size="lg">Contact Sales</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-success">Lynqis</span>
              <span className="text-xs text-text-secondary">© 2024 Lynqis AI Inc.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <Link href="#" className="hover:text-success transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-success transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-success transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-success transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
