"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLocale, type LocaleCode } from "@/lib/i18n/locale-context";

const LOCALES: { code: LocaleCode; label: string; Flag: React.ComponentType }[] = [
  { code: "en", label: "English", Flag: FlagGB },
  { code: "fr", label: "Français", Flag: FlagFR },
];

// Drives the shared LocaleProvider, so any page reading useDictionary()
// re-renders with translated copy the moment a locale is picked here.
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Change language"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-border text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors cursor-pointer"
        >
          <span className="w-5 h-3.5 rounded-[2px] overflow-hidden shrink-0">
            <current.Flag />
          </span>
          <span className="text-xs font-medium uppercase">{locale}</span>
          <ChevronDown size={12} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-40 bg-surface border border-border rounded-lg shadow-lg p-1 z-50"
        >
          {LOCALES.map(({ code, label, Flag }) => (
            <DropdownMenu.Item
              key={code}
              onSelect={() => setLocale(code)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none data-[highlighted]:bg-background ${
                code === locale ? "text-success font-medium" : "text-text-primary"
              }`}
            >
              <span className="w-5 h-3.5 rounded-[2px] overflow-hidden shrink-0">
                <Flag />
              </span>
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function FlagFR() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}
