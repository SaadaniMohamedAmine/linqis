"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center px-6 max-w-[1440px] mx-auto overflow-hidden">
        {/* Background Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-success/10 rounded-full blur-[120px] -z-10"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center py-12 z-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-surface px-4 py-1 rounded-full border border-border mb-6 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success">NEW: AI Summary V2.0</span>
            </motion.div>
            
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
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center pt-12 md:pt-0 perspective-1000"
          >
            <Card className="p-6 rounded-xl w-full max-w-[580px] shadow-2xl relative z-10 bg-surface/80 backdrop-blur-md border-border hover:border-success/30 transition-colors duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-success"></span>
                  <span className="text-sm font-medium">Meeting Analysis: Q3 Strategy</span>
                </div>
                <span className="text-xs text-text-secondary">04:32 / 18:45</span>
              </div>
              <div className="h-20 flex items-end gap-[3px] mb-6 px-1">
                {[30, 60, 80, 50, 90, 100, 70, 40, 60, 20, 70, 30].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-success/20 rounded-full" 
                    style={{ background: h > 70 ? 'var(--color-success)' : h > 40 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.3)' }} 
                  />
                ))}
              </div>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-background p-4 rounded-lg border border-border flex items-center gap-4"
                >
                  <span className="text-success">✓</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Finalize Q4 roadmap by Friday</p>
                    <p className="text-xs text-text-secondary">Assigned to Sarah K.</p>
                  </div>
                  <Badge variant="danger">URGENT</Badge>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-background p-4 rounded-lg border border-border flex items-center gap-4 opacity-60"
                >
                  <span className="text-text-secondary">○</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Schedule sync with dev team</p>
                    <p className="text-xs text-text-secondary">Pending... (AI Tag: Ops)</p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface/50">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">Superpowered by Intelligence</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Focused on speed, privacy, and actionable outcomes for high-performance teams.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Instant Transcription", desc: "Proprietary neural engines convert speech to text with 99.4% accuracy in real-time, handling 40+ languages natively." },
              { icon: "✨", title: "AI Summary", desc: "Get concise executive summaries and bulleted action items generated by a custom GPT model trained on business contexts." },
              { icon: "🔗", title: "Export Anywhere", desc: "One-click integrations with Notion, Slack, Jira, and GitHub. Sync your meeting insights directly to your workspace." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full p-6 border-border hover:border-success/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-300 group cursor-default">
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-border group-hover:border-success/30 group-hover:bg-success/10 transition-colors">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-success transition-colors">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-24 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="flex-1">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-semibold mb-12"
              >
                From voice to value in seconds.
              </motion.h2>
              <div className="space-y-12">
                {[
                  { num: 1, title: "Upload", desc: "Record live or drag and drop any video or audio file. We support all major formats including MP4, MP3, and WAV." },
                  { num: 2, title: "Process", desc: "Our AI engine analyzes the transcript, identifies speakers, and extracts key decisions using semantic understanding." },
                  { num: 3, title: "Export", desc: "Review your dashboard and push the results to your favorite tools. Your knowledge base grows with every meeting." }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-success text-background' : 'bg-surface border border-text-secondary text-text-primary'}`}
                      >
                        {step.num}
                      </motion.div>
                      {i < 2 && <div className="w-px h-16 bg-border mt-2" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-text-secondary">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="aspect-video bg-surface rounded-2xl overflow-hidden border border-border relative flex items-center justify-center group cursor-pointer hover:border-success/50 transition-colors">
                <div className="text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-success/20 p-4 rounded-full inline-flex mb-4"
                  >
                    <span className="text-success text-4xl group-hover:text-white transition-colors">▶</span>
                  </motion.div>
                  <p className="font-medium">Watch product demo</p>
                  <p className="text-xs text-text-secondary">2:14 min</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-success/5">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <h2 className="text-5xl font-semibold mb-6">Ready to stop taking notes?</h2>
          <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto">Join 50,000+ teams who use Lynqis to stay aligned without the manual effort.</p>
          <div className="flex justify-center items-center gap-4">
            <Link href="/sign-up">
              <Button variant="primary" size="lg">Start your free trial</Button>
            </Link>
            <Button variant="secondary" size="lg">Contact Sales</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
