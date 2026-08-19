import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface DashboardShellDictionary {
  upload: string;
  meetingList: string;
  meetingListSubtitle: string;
  newMeeting: string;
}

export const dashboardShellDictionary: Record<LocaleCode, DashboardShellDictionary> = {
  en: {
    upload: "Upload",
    meetingList: "Meeting List",
    meetingListSubtitle: "AI-summarized sessions",
    newMeeting: "New Meeting",
  },
  fr: {
    upload: "Envoyer",
    meetingList: "Liste des réunions",
    meetingListSubtitle: "Sessions résumées par IA",
    newMeeting: "Nouvelle réunion",
  },
};
