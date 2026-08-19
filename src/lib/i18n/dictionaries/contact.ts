import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ContactDictionary {
  sentTitle: string;
  sentDescription: string;
  title: string;
  description: string;
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  messageLabel: string;
  errorMessage: string;
  sending: string;
  sendButton: string;
}

export const contactDictionary: Record<LocaleCode, ContactDictionary> = {
  en: {
    sentTitle: "Message sent",
    sentDescription: "We'll get back to you within one business day.",
    title: "Get in touch",
    description:
      "Questions about your workspace, billing, or an integration? Tell us what's going on — we usually reply within one business day.",
    nameLabel: "Full name",
    emailLabel: "Work email",
    companyLabel: "Company (optional)",
    messageLabel: "What are you looking to solve?",
    errorMessage: "Something went wrong. Try again.",
    sending: "Sending...",
    sendButton: "Send message",
  },
  fr: {
    sentTitle: "Message envoyé",
    sentDescription: "Nous vous répondrons sous un jour ouvré.",
    title: "Contactez-nous",
    description:
      "Des questions sur votre espace de travail, la facturation ou une intégration ? Dites-nous ce qui vous préoccupe — nous répondons généralement sous un jour ouvré.",
    nameLabel: "Nom complet",
    emailLabel: "Email professionnel",
    companyLabel: "Entreprise (optionnel)",
    messageLabel: "Que souhaitez-vous résoudre ?",
    errorMessage: "Une erreur est survenue. Réessayez.",
    sending: "Envoi...",
    sendButton: "Envoyer le message",
  },
};
