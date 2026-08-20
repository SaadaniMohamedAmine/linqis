import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface MeetingDetailDictionary {
  loadingMeeting: string;
  loadFailed: string;
  downloadPdfFailed: string;
  meetingNotFound: string;
  speakerCount: (n: number) => string;
  fromCalendar: string;
  stillProcessing: string;
  processingFailed: string;
  share: string;
  publicLink: string;
  copied: string;
  copy: string;
  shareDescription: string;
  export: string;
  downloadPdf: string;
  generatingPdf: string;
  deleteMeeting: string;
  deleteConfirm: string;
  upgradeToPro: string;
  tabs: { transcript: string; summary: string; actions: string; analysis: string };
  noTranscript: string;
  executiveSummary: string;
  summaryNotAvailable: string;
  decisions: string;
  noDecisions: string;
  actionItemsTitle: (count: number) => string;
  noActionItems: string;
  noDeadline: string;
  meetingMood: string;
  moodLabel: { positive: string; neutral: string; tense: string };
  notAnalyzedYet: string;
  detectedDisagreements: string;
  noDisagreements: string;
  closeAudioPlayer: string;
  openAudioPlayer: string;
  priorityLabel: { high: string; medium: string; low: string };
}

export const meetingDetailDictionary: Record<LocaleCode, MeetingDetailDictionary> = {
  en: {
    loadingMeeting: "Loading meeting...",
    loadFailed: "Failed to load meeting.",
    downloadPdfFailed: "Failed to download PDF.",
    meetingNotFound: "Meeting not found.",
    speakerCount: (n) => `${n} speaker${n === 1 ? "" : "s"}`,
    fromCalendar: "From calendar:",
    stillProcessing: "Still processing — this page will refresh automatically.",
    processingFailed: "Processing failed for this meeting.",
    share: "Share",
    publicLink: "Public link",
    copied: "Copied!",
    copy: "Copy",
    shareDescription: "Anyone with the link can view the summary, decisions and action items -- no login required.",
    export: "Export",
    downloadPdf: "Download PDF",
    generatingPdf: "Generating...",
    deleteMeeting: "Delete",
    deleteConfirm: "Delete this meeting? This cannot be undone.",
    upgradeToPro: "Upgrade to Pro →",
    tabs: { transcript: "transcript", summary: "summary", actions: "actions", analysis: "analysis" },
    noTranscript: "No transcript available yet.",
    executiveSummary: "Executive Summary",
    summaryNotAvailable: "Summary not available yet.",
    decisions: "Decisions",
    noDecisions: "No decisions detected.",
    actionItemsTitle: (count) => `Action Items · ${count}`,
    noActionItems: "No action items detected.",
    noDeadline: "No deadline",
    meetingMood: "Meeting Mood",
    moodLabel: { positive: "Positive", neutral: "Neutral", tense: "Tense" },
    notAnalyzedYet: "Not analyzed yet.",
    detectedDisagreements: "Detected Disagreements",
    noDisagreements: "No disagreements detected in this meeting.",
    closeAudioPlayer: "Close audio player",
    openAudioPlayer: "Open audio player",
    priorityLabel: { high: "HIGH", medium: "MEDIUM", low: "LOW" },
  },
  fr: {
    loadingMeeting: "Chargement de la réunion...",
    loadFailed: "Échec du chargement de la réunion.",
    downloadPdfFailed: "Échec du téléchargement du PDF.",
    meetingNotFound: "Réunion introuvable.",
    speakerCount: (n) => `${n} intervenant${n > 1 ? "s" : ""}`,
    fromCalendar: "Depuis le calendrier :",
    stillProcessing: "Traitement en cours — cette page se rafraîchira automatiquement.",
    processingFailed: "Le traitement de cette réunion a échoué.",
    share: "Partager",
    publicLink: "Lien public",
    copied: "Copié !",
    copy: "Copier",
    shareDescription: "Toute personne disposant du lien peut voir le résumé, les décisions et les actions -- aucune connexion requise.",
    export: "Exporter",
    downloadPdf: "Télécharger le PDF",
    generatingPdf: "Génération...",
    deleteMeeting: "Supprimer",
    deleteConfirm: "Supprimer cette réunion ? Cette action est irréversible.",
    upgradeToPro: "Passer à Pro →",
    tabs: { transcript: "transcription", summary: "résumé", actions: "actions", analysis: "analyse" },
    noTranscript: "Aucune transcription disponible pour le moment.",
    executiveSummary: "Résumé exécutif",
    summaryNotAvailable: "Résumé pas encore disponible.",
    decisions: "Décisions",
    noDecisions: "Aucune décision détectée.",
    actionItemsTitle: (count) => `Actions · ${count}`,
    noActionItems: "Aucune action détectée.",
    noDeadline: "Pas d'échéance",
    meetingMood: "Ambiance de la réunion",
    moodLabel: { positive: "Positive", neutral: "Neutre", tense: "Tendue" },
    notAnalyzedYet: "Pas encore analysé.",
    detectedDisagreements: "Désaccords détectés",
    noDisagreements: "Aucun désaccord détecté dans cette réunion.",
    closeAudioPlayer: "Fermer le lecteur audio",
    openAudioPlayer: "Ouvrir le lecteur audio",
    priorityLabel: { high: "HAUTE", medium: "MOYENNE", low: "BASSE" },
  },
};
