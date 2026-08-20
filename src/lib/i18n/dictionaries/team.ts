import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface TeamDictionary {
  title: string;
  subtitleWithName: (name: string) => string;
  subtitleGeneric: string;
  membersTitle: string;
  loadingMembers: string;
  noMembers: string;
  you: string;
  roleLabel: { OWNER: string; ADMIN: string; MEMBER: string };
  roleHints: { OWNER: string; ADMIN: string; MEMBER: string };
  remove: string;
  couldNotLoad: string;
  inviteFailed: string;
  removeFailed: string;
  inviteSectionTitle: string;
  inviteDesc: string;
  emailLabel: string;
  emailPlaceholder: string;
  roleFieldLabel: string;
  invitationSent: (email: string) => string;
  sending: string;
  sendInvitation: string;
}

export const teamDictionary: Record<LocaleCode, TeamDictionary> = {
  en: {
    title: "Team",
    subtitleWithName: (name) => `Everyone with access to ${name}.`,
    subtitleGeneric: "Everyone with access to this workspace.",
    membersTitle: "Members",
    loadingMembers: "Loading members…",
    noMembers: "No members yet.",
    you: "(you)",
    roleLabel: { OWNER: "Owner", ADMIN: "Admin", MEMBER: "Member" },
    roleHints: {
      OWNER: "Full access, including billing and members.",
      ADMIN: "Manages members. No access to billing.",
      MEMBER: "Uploads, reads and exports meetings.",
    },
    remove: "Remove",
    couldNotLoad: "Could not load your team.",
    inviteFailed: "Failed to send the invitation.",
    removeFailed: "Failed to remove this member.",
    inviteSectionTitle: "Invite a teammate",
    inviteDesc: "They'll get an email with a link to join. The invite expires in 7 days.",
    emailLabel: "Email address",
    emailPlaceholder: "teammate@company.com",
    roleFieldLabel: "Role",
    invitationSent: (email) => `Invitation sent to ${email} ✓`,
    sending: "Sending...",
    sendInvitation: "Send invitation",
  },
  fr: {
    title: "Équipe",
    subtitleWithName: (name) => `Toutes les personnes ayant accès à ${name}.`,
    subtitleGeneric: "Toutes les personnes ayant accès à cet espace de travail.",
    membersTitle: "Membres",
    loadingMembers: "Chargement des membres…",
    noMembers: "Pas encore de membre.",
    you: "(vous)",
    roleLabel: { OWNER: "Propriétaire", ADMIN: "Admin", MEMBER: "Membre" },
    roleHints: {
      OWNER: "Accès complet, y compris la facturation et les membres.",
      ADMIN: "Gère les membres. Pas d'accès à la facturation.",
      MEMBER: "Envoie, consulte et exporte les réunions.",
    },
    remove: "Retirer",
    couldNotLoad: "Impossible de charger votre équipe.",
    inviteFailed: "Échec de l'envoi de l'invitation.",
    removeFailed: "Échec du retrait de ce membre.",
    inviteSectionTitle: "Inviter un coéquipier",
    inviteDesc: "Il recevra un email avec un lien pour rejoindre l'équipe. L'invitation expire dans 7 jours.",
    emailLabel: "Adresse email",
    emailPlaceholder: "coequipier@entreprise.com",
    roleFieldLabel: "Rôle",
    invitationSent: (email) => `Invitation envoyée à ${email} ✓`,
    sending: "Envoi...",
    sendInvitation: "Envoyer l'invitation",
  },
};
