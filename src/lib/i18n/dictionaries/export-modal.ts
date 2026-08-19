import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ExportModalDictionary {
  title: string;
  subtitle: string;
  notion: string;
  slack: string;
  slackWebhookPlaceholder: string;
  slackChannelPlaceholder: string;
  emailRecap: string;
  emailPlaceholder: string;
  cancel: string;
  exportNow: string;
  exporting: string;
  exportedSuccessfully: string;
  upgradeToPro: string;
  enterSlackWebhook: string;
  enterRecipientEmail: string;
  exportFailed: string;
  toastNotion: string;
  toastSlackWithChannel: (channel: string) => string;
  toastSlackNoChannel: string;
  toastEmail: (email: string) => string;
}

export const exportModalDictionary: Record<LocaleCode, ExportModalDictionary> = {
  en: {
    title: "Export Meeting",
    subtitle: "Choose your destination.",
    notion: "Notion",
    slack: "Slack",
    slackWebhookPlaceholder: "https://hooks.slack.com/services/...",
    slackChannelPlaceholder: "Channel name (optional, e.g. #général)",
    emailRecap: "Email Recap",
    emailPlaceholder: "Enter recipient email...",
    cancel: "Cancel",
    exportNow: "Export Now",
    exporting: "Exporting...",
    exportedSuccessfully: "Exported successfully.",
    upgradeToPro: "Upgrade to Pro →",
    enterSlackWebhook: "Enter a Slack webhook URL.",
    enterRecipientEmail: "Enter a recipient email.",
    exportFailed: "Export failed.",
    toastNotion: "Your meeting info was exported to Notion.",
    toastSlackWithChannel: (channel) => `Your meeting info was exported to Slack — ${channel}`,
    toastSlackNoChannel: "Your meeting info was exported to Slack.",
    toastEmail: (email) => `Your meeting info was exported to ${email}.`,
  },
  fr: {
    title: "Exporter la réunion",
    subtitle: "Choisissez votre destination.",
    notion: "Notion",
    slack: "Slack",
    slackWebhookPlaceholder: "https://hooks.slack.com/services/...",
    slackChannelPlaceholder: "Nom du canal (optionnel, ex. #général)",
    emailRecap: "Récap par email",
    emailPlaceholder: "Entrez l'email du destinataire...",
    cancel: "Annuler",
    exportNow: "Exporter",
    exporting: "Export en cours...",
    exportedSuccessfully: "Exporté avec succès.",
    upgradeToPro: "Passer à Pro →",
    enterSlackWebhook: "Entrez une URL de webhook Slack.",
    enterRecipientEmail: "Entrez l'email du destinataire.",
    exportFailed: "Échec de l'export.",
    toastNotion: "Les informations de la réunion ont été exportées vers Notion.",
    toastSlackWithChannel: (channel) => `Les informations de la réunion ont été exportées vers Slack — ${channel}`,
    toastSlackNoChannel: "Les informations de la réunion ont été exportées vers Slack.",
    toastEmail: (email) => `Les informations de la réunion ont été exportées vers ${email}.`,
  },
};
