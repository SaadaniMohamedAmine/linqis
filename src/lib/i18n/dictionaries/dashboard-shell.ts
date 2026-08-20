import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface DashboardShellDictionary {
  upload: string;
}

export const dashboardShellDictionary: Record<LocaleCode, DashboardShellDictionary> = {
  en: {
    upload: "Upload",
  },
  fr: {
    upload: "Envoyer",
  },
};
