import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface MeetingsListDictionary {
  title: string;
  subtitle: string;
  upload: string;
  searchPlaceholder: string;
  filters: { all: string; processing: string; done: string; failed: string };
  statusBadge: { done: string; processing: string; failed: string };
  loading: string;
  loadFailed: string;
  emptyTitle: string;
  emptyDesc: string;
  uploadFirstMeeting: string;
  noMatchText: string;
  clearFilters: string;
  deleteConfirm: string;
  deleteAriaLabel: string;
}

export const meetingsListDictionary: Record<LocaleCode, MeetingsListDictionary> = {
  en: {
    title: "All Meetings",
    subtitle: "Browse and manage your recorded sessions and AI transcriptions.",
    upload: "Upload",
    searchPlaceholder: "Search by title...",
    filters: { all: "All", processing: "Processing", done: "Done", failed: "Failed" },
    statusBadge: { done: "Processed", processing: "Processing...", failed: "Failed" },
    loading: "Loading meetings...",
    loadFailed: "Failed to load meetings.",
    emptyTitle: "No meetings yet",
    emptyDesc: "Upload a recording to get a transcript, executive summary, decisions, and action items — in minutes.",
    uploadFirstMeeting: "Upload your first meeting",
    noMatchText: "No meetings match your search or filter.",
    clearFilters: "Clear search & filters",
    deleteConfirm: "Delete this meeting? This cannot be undone.",
    deleteAriaLabel: "Delete meeting",
  },
  fr: {
    title: "Toutes les réunions",
    subtitle: "Parcourez et gérez vos sessions enregistrées et vos transcriptions IA.",
    upload: "Envoyer",
    searchPlaceholder: "Rechercher par titre...",
    filters: { all: "Toutes", processing: "En cours", done: "Terminées", failed: "Échouées" },
    statusBadge: { done: "Traitée", processing: "En cours...", failed: "Échec" },
    loading: "Chargement des réunions...",
    loadFailed: "Échec du chargement des réunions.",
    emptyTitle: "Pas encore de réunion",
    emptyDesc: "Envoyez un enregistrement pour obtenir une transcription, un résumé exécutif, des décisions et des actions — en quelques minutes.",
    uploadFirstMeeting: "Envoyer votre première réunion",
    noMatchText: "Aucune réunion ne correspond à votre recherche ou filtre.",
    clearFilters: "Réinitialiser la recherche et les filtres",
    deleteConfirm: "Supprimer cette réunion ? Cette action est irréversible.",
    deleteAriaLabel: "Supprimer la réunion",
  },
};
