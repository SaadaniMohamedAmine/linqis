"use client";

import Link from "next/link";
import { useDictionary } from "@/lib/i18n/locale-context";
import { footerDictionary } from "@/lib/i18n/dictionaries/footer";

export function PublicFooter() {
  const t = useDictionary(footerDictionary);

  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-success">Linqis</span>
            <span className="text-xs text-text-secondary">{t.copyright}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="#" className="hover:text-success transition-colors">{t.github}</Link>
            <Link href="/privacy" className="hover:text-success transition-colors">{t.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-success transition-colors">{t.termsOfService}</Link>
            <Link href="/contact" className="hover:text-success transition-colors">{t.contact}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
