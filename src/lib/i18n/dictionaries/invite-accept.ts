import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface InviteAcceptDictionary {
  missingToken: string;
  acceptFailed: string;
  couldNotJoin: string;
  goToDashboard: string;
  joining: string;
}

export const inviteAcceptDictionary: Record<LocaleCode, InviteAcceptDictionary> = {
  en: {
    missingToken: "This link is missing its invitation token.",
    acceptFailed: "Failed to accept this invitation.",
    couldNotJoin: "Couldn't join the workspace",
    goToDashboard: "Go to my dashboard",
    joining: "Joining the workspace…",
  },
  fr: {
    missingToken: "Ce lien ne contient pas de jeton d'invitation.",
    acceptFailed: "Échec de l'acceptation de cette invitation.",
    couldNotJoin: "Impossible de rejoindre l'espace de travail",
    goToDashboard: "Aller à mon tableau de bord",
    joining: "Adhésion à l'espace de travail…",
  },
};
