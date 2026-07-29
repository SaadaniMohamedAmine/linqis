import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* TopNavBar */}
      <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-6">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">Lynqis</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-text-secondary hover:text-success transition-colors">Dashboard</Link>
              <Link href="/dashboard/meetings" className="text-text-secondary hover:text-success transition-colors">Meetings</Link>
              <Link href="/dashboard/action-items" className="text-text-secondary hover:text-success transition-colors">Action Items</Link>
              <Link href="/dashboard/integrations" className="text-text-secondary hover:text-success transition-colors">Integrations</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2"><span></span></Button>
            <Button variant="ghost" size="sm" className="gap-2"><span></span></Button>
            <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9vyT_d_KkmO6WqrhsRI8jx4gD0xErO_HmqM0h_bC1U9ydtDxbkrf-jJ25xMilDRqwiXPnuZDpuaJqT1gdj61lhpUjgiMu_l01Mn755FSXzdPElcHVrXCT8t7r3jdedrRGGevRsdvGv2vbnEFlI1Lc5oT-Zg2D8IdJpdFslVANicm69jjL8fNIkWgFWHVq05m-qNjuv7IupXMHBWc20CdXIbMcbKnDfESM0ndtUq38toYGtGAik28" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-warning/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="container max-w-[1000px] px-6 py-12 z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Ingest Meeting Data</h1>
            <p className="text-text-secondary">Upload recordings or paste meeting links for AI analysis.</p>
          </div>

          {/* Upload Zone */}
          <Card className="p-6 flex flex-col gap-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* File Upload */}
              <div className="flex flex-col gap-4">
                <label className="font-medium text-text-secondary">RECORDING FILE</label>
                <div className="border-2 border-dashed border-border rounded-lg h-64 flex flex-col items-center justify-center gap-4 hover:bg-surface/50 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-success/20 group-hover:text-success transition-all">
                    <span className="text-2xl"></span>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-text-primary">Drop MP3, MP4, or WAV</p>
                    <p className="text-sm text-text-secondary">or click to browse from device</p>
                  </div>
                  <p className="text-xs text-text-secondary opacity-60">Max file size: 500MB</p>
                </div>
              </div>

              {/* Link Integration */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <label className="font-medium text-text-secondary">MEETING LINK</label>
                  <div className="relative">
                    <Input placeholder="Zoom, Meet, or Teams URL..." className="pr-10" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <span className="text-text-secondary"><span></span></span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">Bot will join and transcribe in real-time.</p>
                </div>

                {/* Active Upload State */}
                <div className="bg-surface-low border border-border rounded-lg p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-success"><span></span></span>
                      <span className="font-medium text-text-primary">Product_Sync_Q3.mp4</span>
                    </div>
                    <span className="text-xs text-text-secondary">14s remaining</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden relative">
                    <div className="h-full bg-success w-[72%] rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-success text-sm"><span></span></span>
                      <span className="text-xs text-text-primary opacity-80">Encryption handshake established</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                      </div>
                      <span className="text-xs text-text-primary">Transferring to secure AI pipeline...</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-30">
                      <span className="text-sm"><span></span></span>
                      <span className="text-xs">Audio diarization and summary drafting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-border/30 pt-6 flex justify-end items-center gap-6">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Process Meeting</Button>
            </div>
          </Card>

          {/* Recent Uploads */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
              <Link href="#" className="text-success font-medium hover:underline">View all uploads</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Card className="p-4 flex items-center justify-between group hover:border-border-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-surface-high flex items-center justify-center text-success">
                    <span></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Design_Review_Jan12.mp3</h3>
                    <p className="text-sm text-text-secondary">Processed • 4 speakers identified • 24 mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-text-secondary">Yesterday, 4:20 PM</span>
                  <button className="text-text-secondary hover:text-success transition-colors opacity-0 group-hover:opacity-100">
                    <span></span>
                  </button>
                </div>
              </Card>
              <Card className="p-4 flex items-center justify-between group hover:border-border-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-surface-high flex items-center justify-center text-warning">
                    <span></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Client_Onboarding_Alpha.mp4</h3>
                    <p className="text-sm text-text-secondary">Processed • 2 speakers identified • 45 mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-text-secondary">Jan 11, 11:05 AM</span>
                  <button className="text-text-secondary hover:text-success transition-colors opacity-0 group-hover:opacity-100">
                    <span></span>
                  </button>
                </div>
              </Card>
              <Card className="p-4 flex items-center justify-between group hover:border-border-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-surface-high flex items-center justify-center text-info">
                    <span></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Bot Recording: Weekly Sync</h3>
                    <p className="text-sm text-text-secondary">Processed • 8 speakers identified • 58 mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-text-secondary">Jan 10, 9:00 AM</span>
                  <button className="text-text-secondary hover:text-success transition-colors opacity-0 group-hover:opacity-100">
                    <span></span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
