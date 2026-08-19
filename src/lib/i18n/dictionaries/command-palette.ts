import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface CommandPaletteDictionary {
  ariaLabel: string;
  dialogTitle: string;
  placeholder: string;
  noResults: string;
  navigationLabel: string;
  meetingsLabel: string;
  goToDashboard: string;
  goToMeetings: string;
  goToActionItems: string;
  goToIntegrations: string;
  goToAnalytics: string;
  uploadMeeting: string;
  goToHome: string;
  goToFeatures: string;
  goToUseCases: string;
  goToSecurity: string;
  goToPricing: string;
  signOut: string;
  signIn: string;
  createAccount: string;
}

export const commandPaletteDictionary: Record<LocaleCode, CommandPaletteDictionary> = {
  en: {
    ariaLabel: "Open command palette",
    dialogTitle: "Command palette",
    placeholder: "Type a command or search...",
    noResults: "No results.",
    navigationLabel: "Navigation",
    meetingsLabel: "Meetings",
    goToDashboard: "Go to Dashboard",
    goToMeetings: "Go to Meetings",
    goToActionItems: "Go to Action Items",
    goToIntegrations: "Go to Integrations",
    goToAnalytics: "Go to Analytics",
    uploadMeeting: "Upload a meeting",
    goToHome: "Go to Home",
    goToFeatures: "Go to Features",
    goToUseCases: "Go to Use Cases",
    goToSecurity: "Go to Security",
    goToPricing: "Go to Pricing",
    signOut: "Sign Out",
    signIn: "Sign In",
    createAccount: "Create Account",
  },
  fr: {
    ariaLabel: "Ouvrir la palette de commandes",
    dialogTitle: "Palette de commandes",
    placeholder: "Tapez une commande ou une recherche...",
    noResults: "Aucun résultat.",
    navigationLabel: "Navigation",
    meetingsLabel: "Réunions",
    goToDashboard: "Aller au tableau de bord",
    goToMeetings: "Aller aux réunions",
    goToActionItems: "Aller aux actions",
    goToIntegrations: "Aller aux intégrations",
    goToAnalytics: "Aller aux statistiques",
    uploadMeeting: "Envoyer une réunion",
    goToHome: "Aller à l'accueil",
    goToFeatures: "Aller aux fonctionnalités",
    goToUseCases: "Aller aux cas d'usage",
    goToSecurity: "Aller à la sécurité",
    goToPricing: "Aller aux tarifs",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
  },
};
