import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface SidebarNavDictionary {
  dashboard: string;
  meetings: string;
  actionItems: string;
  team: string;
  integrations: string;
  analytics: string;
  settings: string;
  developers: string;
}

export const sidebarNavDictionary: Record<LocaleCode, SidebarNavDictionary> = {
  en: {
    dashboard: "Dashboard",
    meetings: "Meetings",
    actionItems: "Action Items",
    team: "Team",
    integrations: "Integrations",
    analytics: "Analytics",
    settings: "Settings",
    developers: "Developers",
  },
  fr: {
    dashboard: "Tableau de bord",
    meetings: "Réunions",
    actionItems: "Actions",
    team: "Équipe",
    integrations: "Intégrations",
    analytics: "Statistiques",
    settings: "Paramètres",
    developers: "Développeurs",
  },
};
