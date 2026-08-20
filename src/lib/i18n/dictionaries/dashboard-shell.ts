import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface DashboardShellDictionary {
  upload: string;
  openMenu: string;
  closeMenu: string;
}

export const dashboardShellDictionary: Record<LocaleCode, DashboardShellDictionary> = {
  en: {
    upload: "Upload",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  fr: {
    upload: "Envoyer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
};
