import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface DashboardOverviewDictionary {
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  meetingsTracked: (count: number, openActionItems: number) => string;
  noMeetingsSubtitle: string;
  uploadMeetingButton: string;
  statLabels: { meetings: string; hoursAnalyzed: string; actionItemsOpen: string; completionRate: string };
  recentMeetingsTitle: string;
  viewAll: string;
  noMeetingsText: string;
  uploadFirstMeeting: string;
  statusLabel: { processing: string; done: string; failed: string };
  dueSoonTitle: string;
  allCaughtUp: string;
  noDeadline: string;
  quickUploadTitle: string;
  quickUploadDesc: string;
  uploadButton: string;
  askTitle: string;
  askDesc: string;
}

export const dashboardOverviewDictionary: Record<LocaleCode, DashboardOverviewDictionary> = {
  en: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    meetingsTracked: (count, openActionItems) =>
      `${count} meeting${count === 1 ? "" : "s"} tracked · ${openActionItems} action item${openActionItems === 1 ? "" : "s"} open`,
    noMeetingsSubtitle: "Upload your first meeting to get a transcript, summary, and action items.",
    uploadMeetingButton: "Upload meeting",
    statLabels: {
      meetings: "Meetings",
      hoursAnalyzed: "Hours analyzed",
      actionItemsOpen: "Action items open",
      completionRate: "Completion rate",
    },
    recentMeetingsTitle: "Recent meetings",
    viewAll: "View all",
    noMeetingsText: "No meetings yet. Upload a recording to get a transcript, executive summary, decisions, and action items.",
    uploadFirstMeeting: "Upload your first meeting",
    statusLabel: { processing: "Processing", done: "Done", failed: "Failed" },
    dueSoonTitle: "Due soon",
    allCaughtUp: "Nothing outstanding. You're all caught up.",
    noDeadline: "No deadline",
    quickUploadTitle: "Upload a meeting",
    quickUploadDesc: "Get a transcript and summary in minutes.",
    uploadButton: "Upload",
    askTitle: "Ask your meetings",
    askDesc: "Search across everything you've transcribed.",
  },
  fr: {
    greetingMorning: "Bonjour",
    greetingAfternoon: "Bon après-midi",
    greetingEvening: "Bonsoir",
    meetingsTracked: (count, openActionItems) =>
      `${count} réunion${count > 1 ? "s" : ""} suivie${count > 1 ? "s" : ""} · ${openActionItems} action${openActionItems > 1 ? "s" : ""} en cours`,
    noMeetingsSubtitle: "Envoyez votre première réunion pour obtenir une transcription, un résumé et des actions.",
    uploadMeetingButton: "Envoyer une réunion",
    statLabels: {
      meetings: "Réunions",
      hoursAnalyzed: "Heures analysées",
      actionItemsOpen: "Actions en cours",
      completionRate: "Taux de complétion",
    },
    recentMeetingsTitle: "Réunions récentes",
    viewAll: "Tout voir",
    noMeetingsText: "Pas encore de réunion. Envoyez un enregistrement pour obtenir une transcription, un résumé exécutif, des décisions et des actions.",
    uploadFirstMeeting: "Envoyer votre première réunion",
    statusLabel: { processing: "En cours", done: "Terminé", failed: "Échec" },
    dueSoonTitle: "À traiter bientôt",
    allCaughtUp: "Rien en attente. Vous êtes à jour.",
    noDeadline: "Pas d'échéance",
    quickUploadTitle: "Envoyer une réunion",
    quickUploadDesc: "Obtenez une transcription et un résumé en quelques minutes.",
    uploadButton: "Envoyer",
    askTitle: "Interrogez vos réunions",
    askDesc: "Recherchez dans tout ce que vous avez transcrit.",
  },
};
