import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ErrorBoundaryDictionary {
  title: string;
  dashboardFallback: string;
  globalFallback: string;
  tryAgain: string;
}

export const errorBoundaryDictionary: Record<LocaleCode, ErrorBoundaryDictionary> = {
  en: {
    title: "Something went wrong",
    dashboardFallback: "An unexpected error occurred while loading this page.",
    globalFallback: "An unexpected error occurred.",
    tryAgain: "Try again",
  },
  fr: {
    title: "Une erreur est survenue",
    dashboardFallback: "Une erreur inattendue s'est produite lors du chargement de cette page.",
    globalFallback: "Une erreur inattendue s'est produite.",
    tryAgain: "Réessayer",
  },
};
