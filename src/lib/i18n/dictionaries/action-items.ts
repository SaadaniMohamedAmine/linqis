import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ActionItemsDictionary {
  title: string;
  subtitle: string;
  statLabels: { total: string; todo: string; done: string };
  searchPlaceholder: string;
  filters: { all: string; todo: string; done: string };
  loading: string;
  loadFailed: string;
  emptyTitle: string;
  emptyDesc: string;
  noMatch: string;
  clearFilters: string;
  unassigned: string;
  priorityLabel: { high: string; medium: string; low: string };
}

export const actionItemsDictionary: Record<LocaleCode, ActionItemsDictionary> = {
  en: {
    title: "Action Items",
    subtitle: "Every task extracted from your meetings, in one place.",
    statLabels: { total: "Total Tasks", todo: "Todo", done: "Done" },
    searchPlaceholder: "Search tasks...",
    filters: { all: "all", todo: "todo", done: "done" },
    loading: "Loading action items...",
    loadFailed: "Failed to load action items.",
    emptyTitle: "No action items yet",
    emptyDesc: "Once a meeting is processed, every decision and task the AI finds shows up here automatically.",
    noMatch: "No action items match this view.",
    clearFilters: "Clear search & filters",
    unassigned: "Unassigned",
    priorityLabel: { high: "HIGH", medium: "MEDIUM", low: "LOW" },
  },
  fr: {
    title: "Actions",
    subtitle: "Toutes les tâches extraites de vos réunions, au même endroit.",
    statLabels: { total: "Tâches totales", todo: "À faire", done: "Terminées" },
    searchPlaceholder: "Rechercher des tâches...",
    filters: { all: "toutes", todo: "à faire", done: "terminées" },
    loading: "Chargement des actions...",
    loadFailed: "Échec du chargement des actions.",
    emptyTitle: "Pas encore d'action",
    emptyDesc: "Une fois une réunion traitée, chaque décision et tâche détectée par l'IA apparaît ici automatiquement.",
    noMatch: "Aucune action ne correspond à cette vue.",
    clearFilters: "Réinitialiser la recherche et les filtres",
    unassigned: "Non assigné",
    priorityLabel: { high: "HAUTE", medium: "MOYENNE", low: "BASSE" },
  },
};
