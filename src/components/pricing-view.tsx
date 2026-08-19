"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FreeCardAction, ProCardAction } from "@/components/pricing-actions";
import { useDictionary } from "@/lib/i18n/locale-context";
import { pricingDictionary } from "@/lib/i18n/dictionaries/pricing";

interface PricingViewProps {
  isLoggedIn: boolean;
  currentPlan: "FREE" | "PRO" | null;
}

export function PricingView({ isLoggedIn, currentPlan }: PricingViewProps) {
  const t = useDictionary(pricingDictionary);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="pt-12 pb-24 px-6 max-w-[1440px] mx-auto min-h-screen">
        {/* Hero */}
        <section className="text-center mb-24">
          <h1 className="text-5xl font-semibold mb-4 tracking-tighter">{t.hero.title}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-sm text-text-secondary">{t.hero.monthly}</span>
            <div className="relative w-14 h-8 bg-surface rounded-full border border-border p-1">
              <div className="w-6 h-6 bg-success rounded-full shadow-md" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">{t.hero.yearly}</span>
              <Badge variant="success">{t.hero.save}</Badge>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* Free */}
          <Card className="flex flex-col hover:border-border-hover transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">{t.plans.free.name}</h3>
              <p className="text-sm text-text-secondary">{t.plans.free.description}</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$0</span>
                <span className="text-text-secondary">{t.plans.free.priceSuffix}</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              {t.plans.free.features.map((feature, i) => (
                <li key={feature} className={`flex items-center gap-2 ${i === t.plans.free.features.length - 1 ? "opacity-50" : ""}`}>
                  <span className={i === t.plans.free.features.length - 1 ? "text-text-muted" : "text-success"}>
                    {i === t.plans.free.features.length - 1 ? "" : "✓"}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <FreeCardAction isLoggedIn={isLoggedIn} currentPlan={currentPlan} />
          </Card>

          {/* Pro */}
          <Card className="relative flex flex-col border-2 border-success scale-105 z-10 shadow-2xl shadow-success/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-success text-background font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">{t.plans.pro.mostPopular}</div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">{t.plans.pro.name}</h3>
              <p className="text-sm text-text-secondary">{t.plans.pro.description}</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$29</span>
                <span className="text-text-secondary">{t.plans.pro.priceSuffix}</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              {t.plans.pro.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <ProCardAction isLoggedIn={isLoggedIn} currentPlan={currentPlan} />
          </Card>

          {/* Team */}
          <Card className="flex flex-col hover:border-border-hover transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-1">{t.plans.team.name}</h3>
              <p className="text-sm text-text-secondary">{t.plans.team.description}</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$79</span>
                <span className="text-text-secondary">{t.plans.team.priceSuffix}</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-8">
              {t.plans.team.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button variant="secondary" className="w-full">{t.plans.team.contactSales}</Button>
            </Link>
          </Card>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group bg-surface/80 backdrop-blur-md rounded-lg overflow-hidden border border-border">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-surface transition-all">
                  <span className="text-lg font-semibold">{item.q}</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="p-6 pt-0 text-text-secondary leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
