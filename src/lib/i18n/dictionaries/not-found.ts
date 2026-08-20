import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface NotFoundDictionary {
  title: string;
  description: string;
  backToDashboard: string;
  goHome: string;
}

export const notFoundDictionary: Record<LocaleCode, NotFoundDictionary> = {
  en: {
    title: "Page not found",
    description: "The AI couldn't find the coordinates for this meeting room. It might have been archived, deleted, or never existed in this timeline.",
    backToDashboard: "Back to Dashboard",
    goHome: "Go Home",
  },
  fr: {
    title: "Page introuvable",
    description: "L'IA n'a pas trouvé les coordonnées de cette salle de réunion. Elle a peut-être été archivée, supprimée, ou n'a jamais existé dans cette chronologie.",
    backToDashboard: "Retour au tableau de bord",
    goHome: "Retour à l'accueil",
  },
};
