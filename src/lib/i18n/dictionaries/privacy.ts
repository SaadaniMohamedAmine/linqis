import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface PrivacyDictionary {
  pageTitle: string;
  lastUpdatedPrefix: string;
  intro: string;
  section1: {
    title: string;
    accountLabel: string;
    accountText: string;
    meetingLabel: string;
    meetingText: string;
    integrationLabel: string;
    integrationText: string;
    workspaceLabel: string;
    workspaceText: string;
    billingLabel: string;
    billingText: string;
  };
  section2: { title: string; usage: string; noSell: string };
  section3: {
    title: string;
    aiPrefix: string;
    settingsLink: string;
    aiSuffix: string;
    inaccuratePrefix: string;
    termsLink: string;
    inaccurateSuffix: string;
  };
  section4: {
    title: string;
    retention: string;
    controlPrefix: string;
    settingsDangerLink: string;
    controlMid: string;
    wipeQuoted: string;
    controlMid2: string;
    deleteQuoted: string;
    controlSuffix: string;
  };
  section5: { title: string; text: string };
  section6: { title: string; text: string };
  section7: { title: string; prefix: string; contactLink: string; suffix: string };
  section8: { title: string; text: string };
  section9: { title: string; text: string };
  section10: { title: string; text: string };
  section11: { title: string; prefix: string; contactLink: string; suffix: string };
}

export const privacyDictionary: Record<LocaleCode, PrivacyDictionary> = {
  en: {
    pageTitle: "Privacy Policy",
    lastUpdatedPrefix: "Last updated",
    intro:
      'Linqis AI Inc. ("Linqis", "we", "us") builds an AI meeting summarizer that turns your recordings into transcripts, executive summaries, decisions, and action items. This policy explains what we collect, why, and how you stay in control of it.',
    section1: {
      title: "1. Information we collect",
      accountLabel: "Account information:",
      accountText: "name, email address, and profile photo, whether you sign up with email/password or Google OAuth.",
      meetingLabel: "Meeting content:",
      meetingText: "the audio/video files or recordings you upload, plus the transcripts, AI-generated summaries, decisions, and action items derived from them.",
      integrationLabel: "Integration data:",
      integrationText: "if you connect Google Calendar, Zoom, Notion, or Slack, we store the minimum OAuth tokens or API credentials needed to sync events, import recordings, or export summaries to those services.",
      workspaceLabel: "Workspace & usage data:",
      workspaceText: "workspace membership, roles (owner/admin/member), and usage metrics such as meetings analyzed, hours transcribed, and action-item completion, used to power your dashboard analytics.",
      billingLabel: "Billing data:",
      billingText: "if you upgrade to Pro, payments are processed by Stripe. We store your plan and subscription status, not your card details.",
    },
    section2: {
      title: "2. How we use your information",
      usage: "We use your data to: transcribe and summarize your meetings; surface action items and analytics; keep your workspace and team in sync; send transactional emails (password resets, invites); and process billing for paid plans.",
      noSell: "We do not sell your meeting content or personal data to third parties.",
    },
    section3: {
      title: "3. AI processing & third-party models",
      aiPrefix: "Transcription and summarization are performed using AI language models. By default we use our shared processing pipeline; if you add your own OpenAI API key in",
      settingsLink: "Settings",
      aiSuffix: ", your meetings are processed through your own key instead, and billed directly to your OpenAI account.",
      inaccuratePrefix: "AI-generated summaries and action items are produced automatically and may occasionally be inaccurate — see our",
      termsLink: "Terms of Service",
      inaccurateSuffix: "for details.",
    },
    section4: {
      title: "4. Data retention & deletion",
      retention: "We retain your meeting content and account data for as long as your account is active, or as needed to provide the service (e.g. the Free plan retains 30 days of history).",
      controlPrefix: "You control deletion directly from",
      settingsDangerLink: "Settings → Danger Zone",
      controlMid: ":",
      wipeQuoted: '"Wipe All History"',
      controlMid2: "permanently removes all transcripts and summaries, and",
      deleteQuoted: '"Delete Account"',
      controlSuffix: "permanently deactivates your profile. Both actions are irreversible.",
    },
    section5: {
      title: "5. Data sharing",
      text: "We share data only with the services required to run Linqis: Stripe (billing), our email provider (transactional email), our cloud hosting and database providers, and the third-party integrations you explicitly connect (Google Calendar, Zoom, Notion, Slack). Each of those providers processes data under their own privacy policy.",
    },
    section6: {
      title: "6. Security",
      text: "Integration credentials are stored encrypted at rest. Access to your workspace is governed by role-based permissions (owner/admin/member), and authentication uses industry-standard session tokens. No method of transmission or storage is 100% secure, but we work to protect your data at every layer.",
    },
    section7: {
      title: "7. Your rights",
      prefix: "Depending on your location, you may have the right to access, correct, export, or delete your personal data. You can self-serve most of this from Settings; for anything else, reach out via our",
      contactLink: "Contact page",
      suffix: ".",
    },
    section8: {
      title: "8. Cookies & local storage",
      text: "We use local storage (not third-party tracking cookies) to remember session state, your active workspace, and your language preference.",
    },
    section9: {
      title: "9. Children's privacy",
      text: "Linqis is not directed at individuals under 16, and we do not knowingly collect data from them.",
    },
    section10: {
      title: "10. Changes to this policy",
      text: 'We may update this policy as the product evolves. Material changes will be reflected by updating the "Last updated" date above.',
    },
    section11: {
      title: "11. Contact us",
      prefix: "Questions about this policy? Reach us via our",
      contactLink: "Contact page",
      suffix: ".",
    },
  },
  fr: {
    pageTitle: "Politique de confidentialité",
    lastUpdatedPrefix: "Dernière mise à jour le",
    intro:
      "Linqis AI Inc. (« Linqis », « nous ») développe un résumeur de réunions par IA qui transforme vos enregistrements en transcriptions, résumés exécutifs, décisions et actions. Cette politique explique ce que nous collectons, pourquoi, et comment vous en gardez le contrôle.",
    section1: {
      title: "1. Informations que nous collectons",
      accountLabel: "Informations de compte :",
      accountText: "nom, adresse email et photo de profil, que vous vous inscriviez avec un email/mot de passe ou via Google OAuth.",
      meetingLabel: "Contenu des réunions :",
      meetingText: "les fichiers audio/vidéo ou enregistrements que vous envoyez, ainsi que les transcriptions, résumés générés par IA, décisions et actions qui en sont extraits.",
      integrationLabel: "Données d'intégration :",
      integrationText: "si vous connectez Google Calendar, Zoom, Notion ou Slack, nous stockons le minimum de jetons OAuth ou d'identifiants API nécessaires pour synchroniser les événements, importer des enregistrements ou exporter des résumés vers ces services.",
      workspaceLabel: "Données d'espace de travail et d'usage :",
      workspaceText: "appartenance à l'espace de travail, rôles (propriétaire/admin/membre), et indicateurs d'usage comme les réunions analysées, les heures transcrites et le taux de complétion des actions, utilisés pour alimenter les statistiques de votre tableau de bord.",
      billingLabel: "Données de facturation :",
      billingText: "si vous passez à Pro, les paiements sont traités par Stripe. Nous stockons votre plan et le statut de votre abonnement, pas les détails de votre carte.",
    },
    section2: {
      title: "2. Comment nous utilisons vos informations",
      usage: "Nous utilisons vos données pour : transcrire et résumer vos réunions ; faire ressortir les actions et statistiques ; garder votre espace de travail et votre équipe synchronisés ; envoyer des emails transactionnels (réinitialisation de mot de passe, invitations) ; et traiter la facturation des plans payants.",
      noSell: "Nous ne vendons ni le contenu de vos réunions ni vos données personnelles à des tiers.",
    },
    section3: {
      title: "3. Traitement par IA et modèles tiers",
      aiPrefix: "La transcription et le résumé sont réalisés à l'aide de modèles de langage IA. Par défaut, nous utilisons notre pipeline de traitement partagé ; si vous ajoutez votre propre clé API OpenAI dans",
      settingsLink: "Paramètres",
      aiSuffix: ", vos réunions sont alors traitées via votre propre clé, et facturées directement sur votre compte OpenAI.",
      inaccuratePrefix: "Les résumés et actions générés par IA sont produits automatiquement et peuvent occasionnellement être inexacts — voir nos",
      termsLink: "Conditions d'utilisation",
      inaccurateSuffix: "pour plus de détails.",
    },
    section4: {
      title: "4. Conservation et suppression des données",
      retention: "Nous conservons le contenu de vos réunions et les données de votre compte tant que votre compte est actif, ou aussi longtemps que nécessaire pour fournir le service (par exemple, le plan Free conserve 30 jours d'historique).",
      controlPrefix: "Vous contrôlez la suppression directement depuis",
      settingsDangerLink: "Paramètres → Zone de danger",
      controlMid: " :",
      wipeQuoted: '« Effacer tout l\'historique »',
      controlMid2: "supprime définitivement toutes les transcriptions et résumés, et",
      deleteQuoted: '« Supprimer le compte »',
      controlSuffix: "désactive définitivement votre profil. Ces deux actions sont irréversibles.",
    },
    section5: {
      title: "5. Partage des données",
      text: "Nous ne partageons les données qu'avec les services nécessaires au fonctionnement de Linqis : Stripe (facturation), notre fournisseur d'email (emails transactionnels), nos hébergeurs cloud et fournisseurs de bases de données, ainsi que les intégrations tierces que vous connectez explicitement (Google Calendar, Zoom, Notion, Slack). Chacun de ces prestataires traite les données selon sa propre politique de confidentialité.",
    },
    section6: {
      title: "6. Sécurité",
      text: "Les identifiants d'intégration sont stockés chiffrés au repos. L'accès à votre espace de travail est régi par des permissions basées sur les rôles (propriétaire/admin/membre), et l'authentification utilise des jetons de session conformes aux standards du secteur. Aucune méthode de transmission ou de stockage n'est sécurisée à 100 %, mais nous travaillons à protéger vos données à chaque niveau.",
    },
    section7: {
      title: "7. Vos droits",
      prefix: "Selon votre localisation, vous pouvez avoir le droit d'accéder, corriger, exporter ou supprimer vos données personnelles. Vous pouvez gérer la plupart de ces actions vous-même depuis les Paramètres ; pour le reste, contactez-nous via notre",
      contactLink: "page Contact",
      suffix: ".",
    },
    section8: {
      title: "8. Cookies et stockage local",
      text: "Nous utilisons le stockage local (et non des cookies de suivi tiers) pour mémoriser l'état de session, votre espace de travail actif et votre préférence de langue.",
    },
    section9: {
      title: "9. Confidentialité des mineurs",
      text: "Linqis ne s'adresse pas aux personnes de moins de 16 ans, et nous ne collectons pas sciemment de données les concernant.",
    },
    section10: {
      title: "10. Modifications de cette politique",
      text: "Nous pouvons mettre à jour cette politique à mesure que le produit évolue. Les changements importants seront reflétés par la mise à jour de la date « Dernière mise à jour » ci-dessus.",
    },
    section11: {
      title: "11. Nous contacter",
      prefix: "Des questions sur cette politique ? Contactez-nous via notre",
      contactLink: "page Contact",
      suffix: ".",
    },
  },
};
