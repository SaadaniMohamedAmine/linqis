import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface OnboardingDictionary {
  stepTitles: { role: string; teamSize: string; useCase: string };
  roles: { id: string; label: string }[];
  teamSizes: { id: string; label: string }[];
  useCases: { id: string; label: string }[];
  skip: string;
  saving: string;
  getStarted: string;
  next: string;
  saveError: string;
}

export const onboardingDictionary: Record<LocaleCode, OnboardingDictionary> = {
  en: {
    stepTitles: {
      role: "What's your role?",
      teamSize: "How big is your team?",
      useCase: "What will you use Linqis for?",
    },
    roles: [
      { id: "product-manager", label: "Product Manager" },
      { id: "engineering-lead", label: "Engineering Lead" },
      { id: "founder-executive", label: "Founder / Executive" },
      { id: "designer", label: "Designer" },
      { id: "other", label: "Other" },
    ],
    teamSizes: [
      { id: "just-me", label: "Just me" },
      { id: "2-10", label: "2-10" },
      { id: "11-50", label: "11-50" },
      { id: "50-plus", label: "50+" },
    ],
    useCases: [
      { id: "decisions", label: "Track decisions & action items" },
      { id: "async", label: "Keep async teammates in the loop" },
      { id: "clients", label: "Summarize client calls" },
      { id: "compliance", label: "Keep a searchable record" },
    ],
    skip: "Skip",
    saving: "Saving...",
    getStarted: "Get started",
    next: "Next",
    saveError: "Something went wrong saving your answers. Please try again.",
  },
  fr: {
    stepTitles: {
      role: "Quel est votre rôle ?",
      teamSize: "Quelle est la taille de votre équipe ?",
      useCase: "Pour quoi allez-vous utiliser Linqis ?",
    },
    roles: [
      { id: "product-manager", label: "Chef de produit" },
      { id: "engineering-lead", label: "Lead technique" },
      { id: "founder-executive", label: "Fondateur / Dirigeant" },
      { id: "designer", label: "Designer" },
      { id: "other", label: "Autre" },
    ],
    teamSizes: [
      { id: "just-me", label: "Juste moi" },
      { id: "2-10", label: "2-10" },
      { id: "11-50", label: "11-50" },
      { id: "50-plus", label: "50+" },
    ],
    useCases: [
      { id: "decisions", label: "Suivre les décisions et les actions" },
      { id: "async", label: "Tenir les coéquipiers asynchrones informés" },
      { id: "clients", label: "Résumer les appels clients" },
      { id: "compliance", label: "Garder un registre consultable" },
    ],
    skip: "Passer",
    saving: "Enregistrement...",
    getStarted: "Commencer",
    next: "Suivant",
    saveError: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
  },
};
