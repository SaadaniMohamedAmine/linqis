import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ProductTourDictionary {
  steps: { title: string; description: string }[];
  skipTour: string;
  next: string;
  done: string;
}

export const productTourDictionary: Record<LocaleCode, ProductTourDictionary> = {
  en: {
    steps: [
      { title: "Upload a meeting", description: "Drop an audio or video file here. Linqis transcribes it and extracts the summary automatically." },
      { title: "Your meetings", description: "Every processed meeting shows up here, with real-time status while it's being analyzed." },
      { title: "Action items", description: "All action items across every meeting, in one place, so nothing falls through the cracks." },
      { title: "Export anywhere", description: "Send a summary to Notion, Slack, or by email in one click, once a meeting is ready." },
    ],
    skipTour: "Skip tour",
    next: "Next",
    done: "Done",
  },
  fr: {
    steps: [
      { title: "Envoyez une réunion", description: "Déposez un fichier audio ou vidéo ici. Linqis le transcrit et en extrait le résumé automatiquement." },
      { title: "Vos réunions", description: "Chaque réunion traitée apparaît ici, avec un statut en temps réel pendant son analyse." },
      { title: "Actions", description: "Toutes les actions de toutes vos réunions, au même endroit, pour que rien ne passe à la trappe." },
      { title: "Export où vous voulez", description: "Envoyez un résumé vers Notion, Slack ou par email en un clic, dès qu'une réunion est prête." },
    ],
    skipTour: "Passer la visite",
    next: "Suivant",
    done: "Terminé",
  },
};
