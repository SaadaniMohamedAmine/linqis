import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface InviteDictionary {
  invalidOrExpired: string;
  unavailableTitle: string;
  backToLinqis: string;
  loadingInvitation: string;
  invitedToJoin: (workspaceName: string) => string;
  collaboratePrefix: string;
  roleLabel: { OWNER: string; ADMIN: string; MEMBER: string };
  signInWith: string;
  signInSuffix: string;
  createAccount: string;
  alreadyHaveAccount: string;
  expiresNotice: string;
}

export const inviteDictionary: Record<LocaleCode, InviteDictionary> = {
  en: {
    invalidOrExpired: "This invitation is invalid, has expired, or was already used.",
    unavailableTitle: "Invitation unavailable",
    backToLinqis: "Back to Linqis",
    loadingInvitation: "Loading invitation…",
    invitedToJoin: (workspaceName) => `You've been invited to join ${workspaceName}`,
    collaboratePrefix: "Collaborate on meeting summaries, decisions and action items as a",
    roleLabel: { OWNER: "owner", ADMIN: "admin", MEMBER: "member" },
    signInWith: "Sign in with",
    signInSuffix: "to accept.",
    createAccount: "Create an account",
    alreadyHaveAccount: "I already have an account",
    expiresNotice: "This invitation expires 7 days after it was sent.",
  },
  fr: {
    invalidOrExpired: "Cette invitation est invalide, a expiré, ou a déjà été utilisée.",
    unavailableTitle: "Invitation indisponible",
    backToLinqis: "Retour à Linqis",
    loadingInvitation: "Chargement de l'invitation…",
    invitedToJoin: (workspaceName) => `Vous avez été invité(e) à rejoindre ${workspaceName}`,
    collaboratePrefix: "Collaborez sur les résumés de réunion, décisions et actions en tant que",
    roleLabel: { OWNER: "propriétaire", ADMIN: "admin", MEMBER: "membre" },
    signInWith: "Connectez-vous avec",
    signInSuffix: "pour accepter.",
    createAccount: "Créer un compte",
    alreadyHaveAccount: "J'ai déjà un compte",
    expiresNotice: "Cette invitation expire 7 jours après son envoi.",
  },
};
