import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface UserMenuDictionary {
  ariaLabel: string;
  settings: string;
  signOut: string;
}

export const userMenuDictionary: Record<LocaleCode, UserMenuDictionary> = {
  en: {
    ariaLabel: "User menu",
    settings: "Settings",
    signOut: "Sign Out",
  },
  fr: {
    ariaLabel: "Menu utilisateur",
    settings: "Paramètres",
    signOut: "Se déconnecter",
  },
};
