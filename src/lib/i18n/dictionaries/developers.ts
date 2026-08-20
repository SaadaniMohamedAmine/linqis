import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface DevelopersDictionary {
  never: string;
  heroTitle: string;
  heroSubtitle: string;
  revealCopyNow: (label: string) => string;
  copied: string;
  copy: string;
  apiKeyLabel: string;
  signingSecretLabel: string;
  apiKeys: {
    title: string;
    createKey: string;
    authHintPrefix: string;
    authHintWith: string;
    loading: string;
    empty: string;
    active: string;
    unused: string;
    createdLastUsed: (created: string, lastUsed: string) => string;
    revoke: string;
  };
  webhooks: {
    title: string;
    createWebhook: string;
    hintPrefix: string;
    hintSuffix: string;
    loading: string;
    empty: string;
    active: string;
    inactive: string;
    created: (date: string) => string;
    remove: string;
  };
  keyModal: { title: string; nameLabel: string; namePlaceholder: string; cancel: string; creating: string; create: string };
  hookModal: {
    title: string;
    urlLabel: string;
    urlPlaceholder: string;
    firesOn: (event: string) => string;
    cancel: string;
    creating: string;
    create: string;
  };
  errors: {
    loadFailed: string;
    createKeyFailed: string;
    revokeKeyFailed: string;
    createHookFailed: string;
    deleteHookFailed: string;
  };
}

export const developersDictionary: Record<LocaleCode, DevelopersDictionary> = {
  en: {
    never: "Never",
    heroTitle: "Developers",
    heroSubtitle: "Read-only REST API and outbound webhooks for building your own integrations on top of Linqis.",
    revealCopyNow: (label) => `Copy this ${label} now -- you won't see it again.`,
    copied: "Copied!",
    copy: "Copy",
    apiKeyLabel: "API key",
    signingSecretLabel: "signing secret",
    apiKeys: {
      title: "API Keys",
      createKey: "Create key",
      authHintPrefix: "Authenticate requests to",
      authHintWith: "with",
      loading: "Loading keys…",
      empty: "No API keys yet.",
      active: "Active",
      unused: "Unused",
      createdLastUsed: (created, lastUsed) => `Created ${created} · Last used ${lastUsed}`,
      revoke: "Revoke",
    },
    webhooks: {
      title: "Webhooks",
      createWebhook: "Create webhook",
      hintPrefix: "Get a signed",
      hintSuffix: "POST whenever a meeting finishes processing.",
      loading: "Loading webhooks…",
      empty: "No webhooks yet.",
      active: "Active",
      inactive: "Inactive",
      created: (date) => `Created ${date}`,
      remove: "Remove",
    },
    keyModal: {
      title: "Create API key",
      nameLabel: "Name",
      namePlaceholder: "e.g. CI pipeline",
      cancel: "Cancel",
      creating: "Creating...",
      create: "Create",
    },
    hookModal: {
      title: "Create webhook",
      urlLabel: "Endpoint URL",
      urlPlaceholder: "https://example.com/webhooks/linqis",
      firesOn: (event) => `Fires on ${event}.`,
      cancel: "Cancel",
      creating: "Creating...",
      create: "Create",
    },
    errors: {
      loadFailed: "Could not load your developer settings.",
      createKeyFailed: "Failed to create the API key.",
      revokeKeyFailed: "Failed to revoke this key.",
      createHookFailed: "Failed to create the webhook.",
      deleteHookFailed: "Failed to remove this webhook.",
    },
  },
  fr: {
    never: "Jamais",
    heroTitle: "Développeurs",
    heroSubtitle: "API REST en lecture seule et webhooks sortants pour construire vos propres intégrations au-dessus de Linqis.",
    revealCopyNow: (label) => `Copiez ${label} maintenant -- vous ne le reverrez plus.`,
    copied: "Copié !",
    copy: "Copier",
    apiKeyLabel: "cette clé API",
    signingSecretLabel: "ce secret de signature",
    apiKeys: {
      title: "Clés API",
      createKey: "Créer une clé",
      authHintPrefix: "Authentifiez vos requêtes vers",
      authHintWith: "avec",
      loading: "Chargement des clés…",
      empty: "Pas encore de clé API.",
      active: "Active",
      unused: "Inutilisée",
      createdLastUsed: (created, lastUsed) => `Créée le ${created} · Dernière utilisation ${lastUsed}`,
      revoke: "Révoquer",
    },
    webhooks: {
      title: "Webhooks",
      createWebhook: "Créer un webhook",
      hintPrefix: "Recevez un POST signé",
      hintSuffix: "chaque fois qu'une réunion termine son traitement.",
      loading: "Chargement des webhooks…",
      empty: "Pas encore de webhook.",
      active: "Actif",
      inactive: "Inactif",
      created: (date) => `Créé le ${date}`,
      remove: "Retirer",
    },
    keyModal: {
      title: "Créer une clé API",
      nameLabel: "Nom",
      namePlaceholder: "ex. pipeline CI",
      cancel: "Annuler",
      creating: "Création...",
      create: "Créer",
    },
    hookModal: {
      title: "Créer un webhook",
      urlLabel: "URL du endpoint",
      urlPlaceholder: "https://exemple.com/webhooks/linqis",
      firesOn: (event) => `Se déclenche sur ${event}.`,
      cancel: "Annuler",
      creating: "Création...",
      create: "Créer",
    },
    errors: {
      loadFailed: "Impossible de charger vos paramètres développeur.",
      createKeyFailed: "Échec de la création de la clé API.",
      revokeKeyFailed: "Échec de la révocation de cette clé.",
      createHookFailed: "Échec de la création du webhook.",
      deleteHookFailed: "Échec de la suppression de ce webhook.",
    },
  },
};
