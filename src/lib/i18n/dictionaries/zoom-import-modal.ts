import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ZoomImportModalDictionary {
  title: string;
  loadingRecordings: string;
  loadFailed: string;
  noRecordings: string;
  noFiles: string;
  audioOnly: string;
  importing: string;
  import: string;
  importFailed: string;
}

export const zoomImportModalDictionary: Record<LocaleCode, ZoomImportModalDictionary> = {
  en: {
    title: "Import from Zoom",
    loadingRecordings: "Loading recordings...",
    loadFailed: "Failed to load recordings.",
    noRecordings: "No cloud recordings found in the last 30 days.",
    noFiles: "No downloadable files for this recording.",
    audioOnly: "Audio only",
    importing: "Importing...",
    import: "Import",
    importFailed: "Failed to import recording.",
  },
  fr: {
    title: "Importer depuis Zoom",
    loadingRecordings: "Chargement des enregistrements...",
    loadFailed: "Échec du chargement des enregistrements.",
    noRecordings: "Aucun enregistrement cloud trouvé sur les 30 derniers jours.",
    noFiles: "Aucun fichier téléchargeable pour cet enregistrement.",
    audioOnly: "Audio uniquement",
    importing: "Importation...",
    import: "Importer",
    importFailed: "Échec de l'import de l'enregistrement.",
  },
};
