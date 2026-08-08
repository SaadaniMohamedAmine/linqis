"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type LocaleCode = "en" | "fr";

export const LOCALE_STORAGE_KEY = "linqis-locale";

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// UI-only preference (no server-rendered translations, no locale-prefixed
// routes) -- switching just re-renders the current page's dictionary. Shares
// the same localStorage key the LanguageSwitcher has always used, so existing
// stored preferences keep working.
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "fr") setLocaleState(stored);
  }, []);

  const setLocale = (next: LocaleCode) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

// Picks the current locale's copy out of a { en, fr } dictionary.
export function useDictionary<T>(dictionary: Record<LocaleCode, T>): T {
  const { locale } = useLocale();
  return dictionary[locale];
}
