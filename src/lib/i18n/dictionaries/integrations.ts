import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface IntegrationsDictionary {
  heroTitle: string;
  heroSubtitle: string;
  googleCalendar: { active: string; notLinked: string; title: string; desc: string; connected: string; connect: string };
  zoom: { configuredViaEnv: string; notConfigured: string; title: string; desc: string; browseRecordings: string };
  notion: { connected: string; notConfigured: string; title: string; desc: string; configureInSettings: string };
  slack: { connected: string; notConfigured: string; title: string; desc: string; configureInSettings: string };
  upcomingTitle: string;
  loadingEvents: string;
  noEvents: string;
  meetingLinkDetected: string;
  upcomingHint: string;
  webhooksTitle: string;
  webhooksDesc: string;
  manageApiKeys: string;
  webhooksButton: string;
  enterpriseSecurityTitle: string;
  enterpriseSecurityDesc: string;
}

export const integrationsDictionary: Record<LocaleCode, IntegrationsDictionary> = {
  en: {
    heroTitle: "Connected Workspace",
    heroSubtitle: "Streamline your workflow by connecting your essential productivity tools. AI summaries will automatically sync to your calendar and communication channels.",
    googleCalendar: {
      active: "Active",
      notLinked: "Not Linked",
      title: "Google Calendar",
      desc: "Automatically fetch meeting details and update schedule statuses.",
      connected: "Connected",
      connect: "Connect Google Calendar",
    },
    zoom: {
      configuredViaEnv: "Configured via environment",
      notConfigured: "Not configured",
      title: "Zoom",
      desc: "Record meetings directly and generate AI transcripts in real-time.",
      browseRecordings: "Browse recordings",
    },
    notion: {
      connected: "Connected",
      notConfigured: "Not configured",
      title: "Notion",
      desc: "Sync meeting summaries and action items to your workspace databases.",
      configureInSettings: "Configure in Settings",
    },
    slack: {
      connected: "Connected",
      notConfigured: "Not configured",
      title: "Slack",
      desc: "Push summaries to designated channels and tag participants.",
      configureInSettings: "Configure in Settings",
    },
    upcomingTitle: "Upcoming from Google Calendar",
    loadingEvents: "Loading events…",
    noEvents: "No events in the next 7 days.",
    meetingLinkDetected: "Meeting link detected",
    upcomingHint: "Pick any of these when uploading a recording to auto-fill its title -- see the Upload page.",
    webhooksTitle: "Custom Webhooks",
    webhooksDesc: "Build your own workflows. Send Linqis data to any endpoint using our high-performance REST API and secure webhooks.",
    manageApiKeys: "Manage API Keys",
    webhooksButton: "Webhooks",
    enterpriseSecurityTitle: "Enterprise Security",
    enterpriseSecurityDesc: "All integrations use OAuth 2.0 with end-to-end encryption for your workspace data.",
  },
  fr: {
    heroTitle: "Espace de travail connecté",
    heroSubtitle: "Simplifiez votre flux de travail en connectant vos outils de productivité essentiels. Les résumés IA se synchroniseront automatiquement avec votre calendrier et vos canaux de communication.",
    googleCalendar: {
      active: "Actif",
      notLinked: "Non lié",
      title: "Google Calendar",
      desc: "Récupère automatiquement les détails des réunions et met à jour les statuts d'agenda.",
      connected: "Connecté",
      connect: "Connecter Google Calendar",
    },
    zoom: {
      configuredViaEnv: "Configuré via l'environnement",
      notConfigured: "Non configuré",
      title: "Zoom",
      desc: "Enregistre les réunions directement et génère des transcriptions IA en temps réel.",
      browseRecordings: "Parcourir les enregistrements",
    },
    notion: {
      connected: "Connecté",
      notConfigured: "Non configuré",
      title: "Notion",
      desc: "Synchronise les résumés de réunion et les actions vers vos bases de données d'espace de travail.",
      configureInSettings: "Configurer dans les Paramètres",
    },
    slack: {
      connected: "Connecté",
      notConfigured: "Non configuré",
      title: "Slack",
      desc: "Envoie les résumés vers des canaux dédiés et identifie les participants.",
      configureInSettings: "Configurer dans les Paramètres",
    },
    upcomingTitle: "À venir depuis Google Calendar",
    loadingEvents: "Chargement des événements…",
    noEvents: "Aucun événement dans les 7 prochains jours.",
    meetingLinkDetected: "Lien de réunion détecté",
    upcomingHint: "Sélectionnez l'un de ces événements lors de l'envoi d'un enregistrement pour pré-remplir son titre -- voir la page Envoyer.",
    webhooksTitle: "Webhooks personnalisés",
    webhooksDesc: "Construisez vos propres workflows. Envoyez les données Linqis vers n'importe quel endpoint grâce à notre API REST haute performance et nos webhooks sécurisés.",
    manageApiKeys: "Gérer les clés API",
    webhooksButton: "Webhooks",
    enterpriseSecurityTitle: "Sécurité entreprise",
    enterpriseSecurityDesc: "Toutes les intégrations utilisent OAuth 2.0 avec un chiffrement de bout en bout pour les données de votre espace de travail.",
  },
};
