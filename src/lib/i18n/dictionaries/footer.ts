import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface FooterDictionary {
  copyright: string;
  github: string;
  privacyPolicy: string;
  termsOfService: string;
  contact: string;
}

export const footerDictionary: Record<LocaleCode, FooterDictionary> = {
  en: {
    copyright: "© 2026 Linqis AI Inc.",
    github: "GitHub",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contact: "Contact",
  },
  fr: {
    copyright: "© 2026 Linqis AI Inc.",
    github: "GitHub",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    contact: "Contact",
  },
};
