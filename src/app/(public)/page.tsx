"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageCircle, Mail, Calendar, Video, ShieldCheck, Lock, Trash2, KeyRound } from "lucide-react";
import { useDictionary } from "@/lib/i18n/locale-context";
import { homeDictionary } from "@/lib/i18n/dictionaries/home";

const INTEGRATIONS = [
  { icon: FileText, name: "Notion" },
  { icon: MessageCircle, name: "Slack" },
  { icon: Mail, name: "Email" },
  { icon: Calendar, name: "Google Calendar" },
  { icon: Video, name: "Zoom" },
];

// Icons are paired with the security dictionary items by index -- lucide
// components aren't translatable data, so they stay out of the dictionary.
const SECURITY_ICONS = [Lock, ShieldCheck, KeyRound, Trash2];

export default function Home() {
  const t = useDictionary(homeDictionary);

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
              <span className="text-xs text-success">{t.hero.badge}</span>
            </motion.div>

            <h1 className="text-6xl leading-[1.1] font-extrabold tracking-tighter mb-6">
              {t.hero.titlePrefix} <span className="text-success">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-lg mb-12">
              {t.hero.subtitle}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/sign-up">
                <Button variant="primary" size="lg">{t.hero.ctaPrimary}</Button>
              </Link>
              <Button variant="secondary" size="lg">{t.hero.ctaSecondary}</Button>
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
                  <span className="text-sm font-medium">{t.mockup.label}</span>
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
                    <p className="text-sm font-medium">{t.mockup.task1}</p>
                    <p className="text-xs text-text-secondary">{t.mockup.task1Owner}</p>
                  </div>
                  <Badge variant="danger">{t.mockup.task1Badge}</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-background p-4 rounded-lg border border-border flex items-center gap-4 opacity-60"
                >
                  <span className="text-text-secondary">○</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.mockup.task2}</p>
                    <p className="text-xs text-text-secondary">{t.mockup.task2Status}</p>
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
            <h2 className="text-3xl font-semibold mb-4">{t.featuresSection.title}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t.featuresSection.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.featuresSection.items.map((feature, i) => (
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

      {/* Integrations Section */}
      <section id="integrations" className="py-20 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-sm text-text-secondary uppercase tracking-widest">{t.integrations.title}</h2>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 bg-surface border border-border rounded-full px-5 py-3 text-text-secondary hover:border-success/40 hover:text-text-primary transition-colors"
              >
                <integration.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{integration.name}</span>
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
                {t.steps.title}
              </motion.h2>
              <div className="space-y-12">
                {t.steps.items.map((step, i) => (
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
                        {i + 1}
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
                  <p className="font-medium">{t.steps.demo.title}</p>
                  <p className="text-xs text-text-secondary">{t.steps.demo.duration}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ask Your Meetings Section */}
      <section id="ask" className="py-24 bg-surface/50 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="success" className="mb-4">{t.ask.badge}</Badge>
            <h2 className="text-3xl font-semibold mb-4">{t.ask.title}</h2>
            <p className="text-text-secondary max-w-md mb-6">
              {t.ask.desc}
            </p>
            <Link href="/pricing">
              <Button variant="primary">{t.ask.cta}</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 rounded-xl bg-surface/80 backdrop-blur-md border-border">
              <div className="flex justify-end mb-4">
                <div className="bg-success/10 border border-success/20 rounded-lg rounded-tr-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm">{t.ask.question}</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-lg rounded-tl-none px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-text-secondary mb-2">
                    {t.ask.answer}
                  </p>
                  <Link href="#" className="text-xs text-success hover:underline">{t.ask.source}</Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Use Cases by Role Section */}
      <section id="use-cases" className="py-24 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">{t.useCasesSection.title}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t.useCasesSection.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.useCasesSection.items.map((uc, i) => (
              <motion.div
                key={uc.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full p-6 border-border hover:border-success/40 transition-colors">
                  <p className="text-xs font-semibold text-success uppercase tracking-widest mb-3">{uc.role}</p>
                  <h3 className="text-base font-semibold mb-2">{uc.headline}</h3>
                  <p className="text-sm text-text-secondary">{uc.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-surface/50 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">{t.security.title}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t.security.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.security.items.map((point, i) => {
              const Icon = SECURITY_ICONS[i];
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full p-6 border-border">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-4 border border-border">
                      <Icon className="w-5 h-5 text-success" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">{point.title}</h3>
                    <p className="text-sm text-text-secondary">{point.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold mb-12 text-center"
          >
            {t.faq.title}
          </motion.h2>

          <div className="flex flex-col gap-3">
            {t.faq.items.map((faq) => (
              <details key={faq.q} className="group bg-surface border border-border rounded-lg px-5 py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-text-primary">
                  {faq.q}
                  <span aria-hidden="true" className="text-text-secondary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-text-secondary mt-3">{faq.a}</p>
              </details>
            ))}
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
          <h2 className="text-5xl font-semibold mb-6">{t.cta.title}</h2>
          <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <div className="flex justify-center items-center gap-4">
            <Link href="/sign-up">
              <Button variant="primary" size="lg">{t.cta.primary}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">{t.cta.secondary}</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
