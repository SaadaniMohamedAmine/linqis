import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ShareDictionary {
  linkDisabled: string;
  sharedVia: string;
  decisions: string;
  noDecisions: string;
  actionItems: string;
  noActionItems: string;
  unassigned: string;
}

export const shareDictionary: Record<LocaleCode, ShareDictionary> = {
  en: {
    linkDisabled: "This link is invalid or sharing has been disabled.",
    sharedVia: "Shared via Linqis",
    decisions: "Decisions",
    noDecisions: "No decisions recorded.",
    actionItems: "Action items",
    noActionItems: "No action items recorded.",
    unassigned: "Unassigned",
  },
  fr: {
    linkDisabled: "Ce lien est invalide ou le partage a été désactivé.",
    sharedVia: "Partagé via Linqis",
    decisions: "Décisions",
    noDecisions: "Aucune décision enregistrée.",
    actionItems: "Actions",
    noActionItems: "Aucune action enregistrée.",
    unassigned: "Non assigné",
  },
};
