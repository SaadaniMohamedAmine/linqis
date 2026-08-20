import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface AnalyticsDictionary {
  title: string;
  subtitle: string;
  kpiLabels: { totalMeetings: string; hoursAnalyzed: string; avgDuration: string; actionItemsDone: string };
  loadFailed: string;
  loading: string;
  upgradePromptTitle: string;
  upgradePromptDesc: string;
  upgradeToPro: string;
  meetingsPerWeek: string;
  moodDistribution: string;
  notEnoughData: string;
  topOwners: string;
  moodLabel: { positive: string; neutral: string; tense: string };
}

export const analyticsDictionary: Record<LocaleCode, AnalyticsDictionary> = {
  en: {
    title: "Analytics",
    subtitle: "Track trends across every meeting your team runs.",
    kpiLabels: {
      totalMeetings: "Total meetings",
      hoursAnalyzed: "Hours analyzed",
      avgDuration: "Avg. duration",
      actionItemsDone: "Action items done",
    },
    loadFailed: "Failed to load analytics.",
    loading: "Loading analytics...",
    upgradePromptTitle: "Trends & insights are a Pro feature",
    upgradePromptDesc: "Upgrade to see meeting trends, mood insights, and team performance at a glance.",
    upgradeToPro: "Upgrade to Pro",
    meetingsPerWeek: "Meetings per week",
    moodDistribution: "Mood distribution",
    notEnoughData: "Not enough data yet.",
    topOwners: "Top action item owners",
    moodLabel: { positive: "Positive", neutral: "Neutral", tense: "Tense" },
  },
  fr: {
    title: "Statistiques",
    subtitle: "Suivez les tendances de toutes les réunions de votre équipe.",
    kpiLabels: {
      totalMeetings: "Réunions totales",
      hoursAnalyzed: "Heures analysées",
      avgDuration: "Durée moyenne",
      actionItemsDone: "Actions terminées",
    },
    loadFailed: "Échec du chargement des statistiques.",
    loading: "Chargement des statistiques...",
    upgradePromptTitle: "Les tendances et analyses sont une fonctionnalité Pro",
    upgradePromptDesc: "Passez à Pro pour voir les tendances de réunion, l'analyse d'ambiance et la performance de l'équipe en un coup d'œil.",
    upgradeToPro: "Passer à Pro",
    meetingsPerWeek: "Réunions par semaine",
    moodDistribution: "Répartition des ambiances",
    notEnoughData: "Pas encore assez de données.",
    topOwners: "Principaux responsables d'actions",
    moodLabel: { positive: "Positive", neutral: "Neutre", tense: "Tendue" },
  },
};
