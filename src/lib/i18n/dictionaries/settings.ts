import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface SettingsDictionary {
  heroTitle: string;
  heroSubtitle: string;
  tabs: { profile: string; preferences: string; apiKeys: string; billing: string; dangerZone: string };
  profile: {
    title: string;
    subtitle: string;
    uploadNew: string;
    remove: string;
    fullNameLabel: string;
    emailLabel: string;
    noName: string;
  };
  preferences: {
    title: string;
    subtitle: string;
    summaryLengthTitle: string;
    summaryLengthDesc: string;
    summaryOptions: { concise: string; standard: string; detailed: string };
    emailNotifTitle: string;
    emailNotifDesc: string;
  };
  apiKeys: {
    title: string;
    subtitle: string;
    openaiTitle: string;
    openaiDesc: string;
    comingSoon: string;
    notConfigured: string;
    connected: string;
    updateConnection: string;
    setupIntegration: string;
    notionTitle: string;
    notionDesc: string;
    slackTitle: string;
    slackDesc: string;
  };
  billing: {
    title: string;
    subtitle: string;
    proPlan: string;
    freePlan: string;
    renewsOn: (date: string) => string;
    activeSubscription: string;
    statusLabel: (status: string) => string;
    unknownStatus: string;
    freeLimits: string;
    manageBilling: string;
    loading: string;
    upgradeToPro: string;
  };
  danger: {
    title: string;
    clearDataTitle: string;
    clearDataDesc: string;
    wipeButton: string;
    deleteAccountTitle: string;
    deleteAccountDesc: string;
    deleteButton: string;
  };
  saveBar: { saved: string; saving: string; saveChanges: string };
  notionModal: {
    title: string;
    description: string;
    apiKeyLabel: string;
    apiKeyHelp: string;
    databaseIdLabel: string;
    cancel: string;
  };
  slackModal: {
    title: string;
    description: string;
    webhookLabel: string;
    webhookHelp: string;
    channelLabel: string;
    channelHelpText: string;
    cancel: string;
  };
  toasts: { settingsSaved: string; notionSaved: string; slackSaved: string };
}

export const settingsDictionary: Record<LocaleCode, SettingsDictionary> = {
  en: {
    heroTitle: "Settings",
    heroSubtitle: "Manage your profile, preferences, API keys, billing, and workspace data.",
    tabs: { profile: "Profile", preferences: "Preferences", apiKeys: "API Keys", billing: "Billing", dangerZone: "Danger Zone" },
    profile: {
      title: "Profile",
      subtitle: "Update your photo and personal details.",
      uploadNew: "Upload New",
      remove: "Remove",
      fullNameLabel: "Full Name",
      emailLabel: "Email Address",
      noName: "—",
    },
    preferences: {
      title: "Preferences",
      subtitle: "Customize your workspace experience.",
      summaryLengthTitle: "AI Summary Length",
      summaryLengthDesc: "Choose how detailed your automatic summaries should be.",
      summaryOptions: { concise: "Concise", standard: "Standard", detailed: "Detailed" },
      emailNotifTitle: "Email Notifications",
      emailNotifDesc: "Receive summaries directly in your inbox after meetings.",
    },
    apiKeys: {
      title: "API Keys",
      subtitle: "Connect your own AI models and export destinations.",
      openaiTitle: "OpenAI Key",
      openaiDesc: "Bring your own key for custom AI processing.",
      comingSoon: "Coming soon",
      notConfigured: "Not configured",
      connected: "Connected",
      updateConnection: "Update connection",
      setupIntegration: "Set up integration",
      notionTitle: "Notion",
      notionDesc: "Export meeting summaries to your own Notion workspace.",
      slackTitle: "Slack",
      slackDesc: "Save a default webhook so exports pre-fill automatically.",
    },
    billing: {
      title: "Billing",
      subtitle: "Manage your plan and subscription.",
      proPlan: "Pro plan",
      freePlan: "Free plan",
      renewsOn: (date) => `Renews on ${date}`,
      activeSubscription: "Active subscription",
      statusLabel: (status) => `Status: ${status}`,
      unknownStatus: "unknown",
      freeLimits: "5 meetings/month, 30 min max, no exports.",
      manageBilling: "Manage billing",
      loading: "Loading...",
      upgradeToPro: "Upgrade to Pro",
    },
    danger: {
      title: "Danger Zone",
      clearDataTitle: "Clear Data",
      clearDataDesc: "Remove all meeting transcripts and AI summaries from our servers. This action is irreversible.",
      wipeButton: "Wipe All History",
      deleteAccountTitle: "Delete Account",
      deleteAccountDesc: "Permanently deactivate your Linqis profile and forfeit any remaining subscription balance.",
      deleteButton: "Delete Permanently",
    },
    saveBar: { saved: "Saved ✓", saving: "Saving...", saveChanges: "Save Changes" },
    notionModal: {
      title: "Notion Integration",
      description: "Export meeting summaries to your own Notion workspace instead of the shared default.",
      apiKeyLabel: "Notion API Key",
      apiKeyHelp: "How to get your Notion API key?",
      databaseIdLabel: "Notion Database ID",
      cancel: "Cancel",
    },
    slackModal: {
      title: "Slack Integration",
      description: "Save a default webhook so exports pre-fill instead of asking every time.",
      webhookLabel: "Slack Webhook URL",
      webhookHelp: "How to create a Slack incoming webhook?",
      channelLabel: "Channel Name",
      channelHelpText: "Display only -- the webhook itself is already bound to a channel when you create it in Slack.",
      cancel: "Cancel",
    },
    toasts: {
      settingsSaved: "Settings saved.",
      notionSaved: "Notion integration saved.",
      slackSaved: "Slack integration saved.",
    },
  },
  fr: {
    heroTitle: "Paramètres",
    heroSubtitle: "Gérez votre profil, vos préférences, vos clés API, votre facturation et les données de votre espace de travail.",
    tabs: { profile: "Profil", preferences: "Préférences", apiKeys: "Clés API", billing: "Facturation", dangerZone: "Zone de danger" },
    profile: {
      title: "Profil",
      subtitle: "Mettez à jour votre photo et vos informations personnelles.",
      uploadNew: "Changer la photo",
      remove: "Retirer",
      fullNameLabel: "Nom complet",
      emailLabel: "Adresse email",
      noName: "—",
    },
    preferences: {
      title: "Préférences",
      subtitle: "Personnalisez votre expérience d'espace de travail.",
      summaryLengthTitle: "Longueur des résumés IA",
      summaryLengthDesc: "Choisissez le niveau de détail de vos résumés automatiques.",
      summaryOptions: { concise: "Concis", standard: "Standard", detailed: "Détaillé" },
      emailNotifTitle: "Notifications par email",
      emailNotifDesc: "Recevez les résumés directement dans votre boîte mail après les réunions.",
    },
    apiKeys: {
      title: "Clés API",
      subtitle: "Connectez vos propres modèles IA et destinations d'export.",
      openaiTitle: "Clé OpenAI",
      openaiDesc: "Utilisez votre propre clé pour un traitement IA personnalisé.",
      comingSoon: "Bientôt disponible",
      notConfigured: "Non configuré",
      connected: "Connecté",
      updateConnection: "Mettre à jour la connexion",
      setupIntegration: "Configurer l'intégration",
      notionTitle: "Notion",
      notionDesc: "Exportez les résumés de réunion vers votre propre espace Notion.",
      slackTitle: "Slack",
      slackDesc: "Enregistrez un webhook par défaut pour que les exports se pré-remplissent automatiquement.",
    },
    billing: {
      title: "Facturation",
      subtitle: "Gérez votre plan et votre abonnement.",
      proPlan: "Plan Pro",
      freePlan: "Plan Free",
      renewsOn: (date) => `Renouvellement le ${date}`,
      activeSubscription: "Abonnement actif",
      statusLabel: (status) => `Statut : ${status}`,
      unknownStatus: "inconnu",
      freeLimits: "5 réunions/mois, 30 min max, pas d'export.",
      manageBilling: "Gérer la facturation",
      loading: "Chargement...",
      upgradeToPro: "Passer à Pro",
    },
    danger: {
      title: "Zone de danger",
      clearDataTitle: "Effacer les données",
      clearDataDesc: "Supprime toutes les transcriptions de réunion et résumés IA de nos serveurs. Cette action est irréversible.",
      wipeButton: "Effacer tout l'historique",
      deleteAccountTitle: "Supprimer le compte",
      deleteAccountDesc: "Désactive définitivement votre profil Linqis et fait perdre tout solde d'abonnement restant.",
      deleteButton: "Supprimer définitivement",
    },
    saveBar: { saved: "Enregistré ✓", saving: "Enregistrement...", saveChanges: "Enregistrer" },
    notionModal: {
      title: "Intégration Notion",
      description: "Exportez les résumés de réunion vers votre propre espace Notion au lieu de l'espace partagé par défaut.",
      apiKeyLabel: "Clé API Notion",
      apiKeyHelp: "Comment obtenir votre clé API Notion ?",
      databaseIdLabel: "ID de base de données Notion",
      cancel: "Annuler",
    },
    slackModal: {
      title: "Intégration Slack",
      description: "Enregistrez un webhook par défaut pour que les exports se pré-remplissent au lieu de le redemander à chaque fois.",
      webhookLabel: "URL du webhook Slack",
      webhookHelp: "Comment créer un webhook entrant Slack ?",
      channelLabel: "Nom du canal",
      channelHelpText: "Affichage uniquement -- le webhook est déjà associé à un canal au moment de sa création dans Slack.",
      cancel: "Annuler",
    },
    toasts: {
      settingsSaved: "Paramètres enregistrés.",
      notionSaved: "Intégration Notion enregistrée.",
      slackSaved: "Intégration Slack enregistrée.",
    },
  },
};
