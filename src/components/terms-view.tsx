"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDictionary } from "@/lib/i18n/locale-context";
import { termsDictionary } from "@/lib/i18n/dictionaries/terms";

const LAST_UPDATED = "August 8, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-text-secondary">{children}</div>
    </section>
  );
}

export function TermsView() {
  const t = useDictionary(termsDictionary);

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
          <h1 className="text-4xl font-semibold tracking-tight mb-3">{t.pageTitle}</h1>
          <p className="text-text-secondary">{t.lastUpdatedPrefix} {LAST_UPDATED}</p>
        </div>
      </div>

      <main className="max-w-[820px] mx-auto px-6 py-16">
        <Card className="p-8 md:p-10 space-y-10">
          <p className="text-sm leading-relaxed text-text-secondary">{t.intro}</p>

          <Section title={t.section1.title}><p>{t.section1.text}</p></Section>
          <Section title={t.section2.title}><p>{t.section2.text}</p></Section>
          <Section title={t.section3.title}><p>{t.section3.text}</p></Section>
          <Section title={t.section4.title}><p>{t.section4.text}</p></Section>
          <Section title={t.section5.title}><p>{t.section5.text}</p></Section>
          <Section title={t.section6.title}><p>{t.section6.text}</p></Section>
          <Section title={t.section7.title}><p>{t.section7.text}</p></Section>
          <Section title={t.section8.title}><p>{t.section8.text}</p></Section>
          <Section title={t.section9.title}><p>{t.section9.text}</p></Section>
          <Section title={t.section10.title}><p>{t.section10.text}</p></Section>

          <Section title={t.section11.title}>
            <p>
              {t.section11.prefix}{" "}
              <Link href="/contact" className="text-success hover:underline">{t.section11.contactLink}</Link>
              {t.section11.suffix}
            </p>
          </Section>
        </Card>
      </main>
    </div>
  );
}
