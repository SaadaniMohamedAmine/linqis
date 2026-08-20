import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface AskWidgetDictionary {
  title: string;
  subtitle: string;
  closeAriaLabel: string;
  launcherOpenAriaLabel: string;
  launcherCloseAriaLabel: string;
  emptyState: string;
  upgradeToPro: string;
  sources: string;
  thinking: string;
  inputPlaceholder: string;
  ask: string;
  genericError: string;
}

export const askWidgetDictionary: Record<LocaleCode, AskWidgetDictionary> = {
  en: {
    title: "Ask your meetings",
    subtitle: "Ask a question across everything Linqis has transcribed for you.",
    closeAriaLabel: "Close",
    launcherOpenAriaLabel: "Ask your meetings",
    launcherCloseAriaLabel: "Close Ask your meetings",
    emptyState: 'Try something like "What did we decide about the Q3 budget?"',
    upgradeToPro: "Upgrade to Pro →",
    sources: "Sources",
    thinking: "Thinking...",
    inputPlaceholder: "Ask a question about your meetings...",
    ask: "Ask",
    genericError: "Something went wrong answering that.",
  },
  fr: {
    title: "Interrogez vos réunions",
    subtitle: "Posez une question sur tout ce que Linqis a transcrit pour vous.",
    closeAriaLabel: "Fermer",
    launcherOpenAriaLabel: "Interroger vos réunions",
    launcherCloseAriaLabel: "Fermer Interroger vos réunions",
    emptyState: '« Qu\'avons-nous décidé pour le budget du T3 ? »',
    upgradeToPro: "Passer à Pro →",
    sources: "Sources",
    thinking: "Réflexion...",
    inputPlaceholder: "Posez une question sur vos réunions...",
    ask: "Demander",
    genericError: "Une erreur est survenue en répondant à cette question.",
  },
};
