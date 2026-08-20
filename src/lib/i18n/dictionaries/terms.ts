import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface TermsDictionary {
  pageTitle: string;
  lastUpdatedPrefix: string;
  intro: string;
  section1: { title: string; text: string };
  section2: { title: string; text: string };
  section3: { title: string; text: string };
  section4: { title: string; text: string };
  section5: { title: string; text: string };
  section6: { title: string; text: string };
  section7: { title: string; text: string };
  section8: { title: string; text: string };
  section9: { title: string; text: string };
  section10: { title: string; text: string };
  section11: { title: string; prefix: string; contactLink: string; suffix: string };
}

export const termsDictionary: Record<LocaleCode, TermsDictionary> = {
  en: {
    pageTitle: "Terms of Service",
    lastUpdatedPrefix: "Last updated",
    intro:
      'These Terms of Service ("Terms") govern your access to and use of Linqis, the AI meeting summarizer operated by Linqis AI Inc. ("Linqis", "we", "us"). By creating an account or using the service, you agree to these Terms.',
    section1: {
      title: "1. The service",
      text: "Linqis records or ingests your meetings and uses AI to generate transcripts, executive summaries, decisions, and action items, and lets you search, share, export, and analyze that content across your workspace.",
    },
    section2: {
      title: "2. Accounts & workspaces",
      text: "You must provide accurate information to create an account and are responsible for activity under it. Workspaces have roles (owner, admin, member) that control who can manage billing, integrations, and team members — owners and admins are responsible for managing access within their workspace.",
    },
    section3: {
      title: "3. Plans & billing",
      text: "Linqis offers a Free plan (limited meetings per month, 30-day history, no exports) and a Pro plan billed via Stripe. Subscriptions renew automatically until cancelled; you can manage or cancel your subscription anytime from Settings → Billing. Fees are non-refundable except where required by law.",
    },
    section4: {
      title: "4. Acceptable use",
      text: "You agree not to: upload content you don't have the right to record or share; use the service to violate any law or third party's rights (including recording-consent laws in your jurisdiction); attempt to reverse-engineer, disrupt, or abuse the service; or share API keys/credentials issued to your account with unauthorized parties.",
    },
    section5: {
      title: "5. Your content",
      text: "You retain ownership of the meetings, recordings, and content you upload. You grant Linqis a limited license to process, store, and transform that content solely to provide the service to you and your workspace (transcription, summarization, search, exports). We do not use your content to train third-party models beyond what's required to generate your summaries.",
    },
    section6: {
      title: "6. AI-generated content",
      text: "Transcripts, summaries, decisions, and action items are generated automatically by AI language models and may contain inaccuracies, omissions, or misattributions. You're responsible for reviewing AI-generated output before relying on it for decisions, compliance, or record-keeping.",
    },
    section7: {
      title: "7. Third-party integrations",
      text: "Features that connect to Google Calendar, Zoom, Notion, Slack, or your own OpenAI API key rely on those third parties' services and are subject to their own terms. Linqis isn't responsible for outages, changes, or data handling on their end.",
    },
    section8: {
      title: "8. Termination",
      text: "You may delete your account at any time from Settings → Danger Zone. We may suspend or terminate accounts that violate these Terms or pose a security risk to the service or other users.",
    },
    section9: {
      title: "9. Disclaimer & limitation of liability",
      text: 'Linqis is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Linqis AI Inc. is not liable for indirect, incidental, or consequential damages arising from your use of the service, including decisions made based on AI-generated summaries.',
    },
    section10: {
      title: "10. Changes to these terms",
      text: "We may update these Terms as the product evolves. Continued use of Linqis after an update constitutes acceptance of the revised Terms.",
    },
    section11: {
      title: "11. Contact us",
      prefix: "Questions about these Terms? Reach us via our",
      contactLink: "Contact page",
      suffix: ".",
    },
  },
  fr: {
    pageTitle: "Conditions d'utilisation",
    lastUpdatedPrefix: "Dernière mise à jour le",
    intro:
      "Ces Conditions d'utilisation (« Conditions ») régissent votre accès à et votre utilisation de Linqis, le résumeur de réunions par IA exploité par Linqis AI Inc. (« Linqis », « nous »). En créant un compte ou en utilisant le service, vous acceptez ces Conditions.",
    section1: {
      title: "1. Le service",
      text: "Linqis enregistre ou ingère vos réunions et utilise l'IA pour générer des transcriptions, résumés exécutifs, décisions et actions, et vous permet de rechercher, partager, exporter et analyser ce contenu à l'échelle de votre espace de travail.",
    },
    section2: {
      title: "2. Comptes et espaces de travail",
      text: "Vous devez fournir des informations exactes pour créer un compte et êtes responsable de l'activité qui s'y déroule. Les espaces de travail disposent de rôles (propriétaire, admin, membre) qui contrôlent qui peut gérer la facturation, les intégrations et les membres de l'équipe — les propriétaires et admins sont responsables de la gestion des accès au sein de leur espace de travail.",
    },
    section3: {
      title: "3. Plans et facturation",
      text: "Linqis propose un plan Free (nombre de réunions limité par mois, historique de 30 jours, pas d'export) et un plan Pro facturé via Stripe. Les abonnements se renouvellent automatiquement jusqu'à annulation ; vous pouvez gérer ou annuler votre abonnement à tout moment depuis Paramètres → Facturation. Les frais ne sont pas remboursables sauf lorsque la loi l'exige.",
    },
    section4: {
      title: "4. Utilisation acceptable",
      text: "Vous vous engagez à ne pas : envoyer un contenu que vous n'avez pas le droit d'enregistrer ou de partager ; utiliser le service pour enfreindre une loi ou les droits d'un tiers (y compris les lois sur le consentement à l'enregistrement dans votre juridiction) ; tenter de faire de l'ingénierie inverse, de perturber ou d'abuser du service ; ou partager les clés API/identifiants émis pour votre compte avec des tiers non autorisés.",
    },
    section5: {
      title: "5. Votre contenu",
      text: "Vous conservez la propriété des réunions, enregistrements et contenus que vous envoyez. Vous accordez à Linqis une licence limitée pour traiter, stocker et transformer ce contenu uniquement afin de vous fournir le service, à vous et à votre espace de travail (transcription, résumé, recherche, exports). Nous n'utilisons pas votre contenu pour entraîner des modèles tiers au-delà de ce qui est nécessaire pour générer vos résumés.",
    },
    section6: {
      title: "6. Contenu généré par IA",
      text: "Les transcriptions, résumés, décisions et actions sont générés automatiquement par des modèles de langage IA et peuvent contenir des inexactitudes, omissions ou attributions erronées. Vous êtes responsable de la relecture du contenu généré par IA avant de vous y fier pour des décisions, de la conformité ou la tenue de registres.",
    },
    section7: {
      title: "7. Intégrations tierces",
      text: "Les fonctionnalités connectées à Google Calendar, Zoom, Notion, Slack ou à votre propre clé API OpenAI dépendent des services de ces tiers et sont soumises à leurs propres conditions. Linqis n'est pas responsable des pannes, changements ou du traitement des données de leur côté.",
    },
    section8: {
      title: "8. Résiliation",
      text: "Vous pouvez supprimer votre compte à tout moment depuis Paramètres → Zone de danger. Nous pouvons suspendre ou résilier les comptes qui enfreignent ces Conditions ou présentent un risque de sécurité pour le service ou d'autres utilisateurs.",
    },
    section9: {
      title: "9. Avertissement et limitation de responsabilité",
      text: "Linqis est fourni « en l'état » sans garantie d'aucune sorte. Dans la mesure maximale permise par la loi, Linqis AI Inc. n'est pas responsable des dommages indirects, accessoires ou consécutifs découlant de votre utilisation du service, y compris les décisions prises sur la base de résumés générés par IA.",
    },
    section10: {
      title: "10. Modifications de ces conditions",
      text: "Nous pouvons mettre à jour ces Conditions à mesure que le produit évolue. La poursuite de l'utilisation de Linqis après une mise à jour vaut acceptation des Conditions révisées.",
    },
    section11: {
      title: "11. Nous contacter",
      prefix: "Des questions sur ces Conditions ? Contactez-nous via notre",
      contactLink: "page Contact",
      suffix: ".",
    },
  },
};
