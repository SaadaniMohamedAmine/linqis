import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface UploadDictionary {
  title: string;
  subtitle: string;
  dropZoneHint: string;
  clickToBrowse: string;
  maxFileSize: string;
  linkCalendarLabel: string;
  none: string;
  linkCalendarHint: string;
  uploading: string;
  processingHint: string;
  upgradeToPro: string;
  cancel: string;
  processing: string;
  processMeeting: string;
  unsupportedFileType: (ext: string, accepted: string) => string;
  fileTooLarge: string;
  processingFailed: string;
  uploadFailed: string;
  stageLabels: { connected: string; transcribing: string; analyzing: string; saving: string };
  stepSelect: string;
  stepLink: string;
  stepProcess: string;
  stepDone: string;
}

export const uploadDictionary: Record<LocaleCode, UploadDictionary> = {
  en: {
    title: "Ingest Meeting Data",
    subtitle: "Upload a recording for AI analysis.",
    dropZoneHint: "Drop MP3, MP4, WAV, M4A, MOV or WebM",
    clickToBrowse: "or click to browse from device",
    maxFileSize: "Max file size: 100MB",
    linkCalendarLabel: "Link to calendar event (optional)",
    none: "None",
    linkCalendarHint: "Pre-fills the meeting title from the event and keeps them linked.",
    uploading: "Uploading...",
    processingHint: "This can take a few minutes for longer recordings.",
    upgradeToPro: "Upgrade to Pro",
    cancel: "Cancel",
    processing: "Processing...",
    processMeeting: "Process Meeting",
    unsupportedFileType: (ext, accepted) => `Unsupported file type "${ext}". Accepted: ${accepted}`,
    fileTooLarge: "File exceeds the 100MB limit.",
    processingFailed: "Processing failed.",
    uploadFailed: "Upload failed. Is the backend running?",
    stageLabels: {
      connected: "Connected to processing pipeline...",
      transcribing: "Transcribing audio...",
      analyzing: "Extracting decisions, action items & mood...",
      saving: "Saving results...",
    },
    stepSelect: "Select",
    stepLink: "Link event",
    stepProcess: "Process",
    stepDone: "Done",
  },
  fr: {
    title: "Ingestion de données de réunion",
    subtitle: "Envoyez un enregistrement pour analyse IA.",
    dropZoneHint: "Déposez un fichier MP3, MP4, WAV, M4A, MOV ou WebM",
    clickToBrowse: "ou cliquez pour parcourir votre appareil",
    maxFileSize: "Taille maximale : 100 Mo",
    linkCalendarLabel: "Lier à un événement du calendrier (optionnel)",
    none: "Aucun",
    linkCalendarHint: "Pré-remplit le titre de la réunion à partir de l'événement et les garde liés.",
    uploading: "Envoi en cours...",
    processingHint: "Cela peut prendre quelques minutes pour les enregistrements plus longs.",
    upgradeToPro: "Passer à Pro",
    cancel: "Annuler",
    processing: "Traitement...",
    processMeeting: "Traiter la réunion",
    unsupportedFileType: (ext, accepted) => `Type de fichier non pris en charge « ${ext} ». Formats acceptés : ${accepted}`,
    fileTooLarge: "Le fichier dépasse la limite de 100 Mo.",
    processingFailed: "Le traitement a échoué.",
    uploadFailed: "Échec de l'envoi. Le serveur est-il bien démarré ?",
    stageLabels: {
      connected: "Connexion au pipeline de traitement...",
      transcribing: "Transcription de l'audio...",
      analyzing: "Extraction des décisions, actions et ambiance...",
      saving: "Enregistrement des résultats...",
    },
    stepSelect: "Sélection",
    stepLink: "Lier l'événement",
    stepProcess: "Traitement",
    stepDone: "Terminé",
  },
};
