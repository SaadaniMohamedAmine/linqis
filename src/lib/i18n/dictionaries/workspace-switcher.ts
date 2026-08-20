import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface WorkspaceSwitcherDictionary {
  ariaLabel: string;
  fallbackName: string;
  roleLabel: { owner: string; admin: string; member: string };
}

export const workspaceSwitcherDictionary: Record<LocaleCode, WorkspaceSwitcherDictionary> = {
  en: {
    ariaLabel: "Switch workspace",
    fallbackName: "Workspace",
    roleLabel: { owner: "owner", admin: "admin", member: "member" },
  },
  fr: {
    ariaLabel: "Changer d'espace de travail",
    fallbackName: "Espace de travail",
    roleLabel: { owner: "propriétaire", admin: "admin", member: "membre" },
  },
};
