import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface PricingDictionary {
  hero: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    save: string;
  };
  plans: {
    free: { name: string; description: string; priceSuffix: string; features: string[] };
    pro: { name: string; description: string; priceSuffix: string; mostPopular: string; features: string[] };
    team: { name: string; description: string; priceSuffix: string; features: string[]; contactSales: string };
  };
  actions: {
    currentPlan: string;
    getStarted: string;
    redirecting: string;
    upgradeToPro: string;
    couldNotStartCheckout: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
}

export const pricingDictionary: Record<LocaleCode, PricingDictionary> = {
  en: {
    hero: {
      title: "Simple pricing. Real value.",
      subtitle: "High-fidelity AI meeting intelligence for individuals and teams who demand clarity without the fluff.",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
    },
    plans: {
      free: {
        name: "Free",
        description: "For individuals getting started.",
        priceSuffix: "/mo",
        features: ["5 Meetings / Month", "AI Summaries (Standard)", "30-day History", "CRM Integrations"],
      },
      pro: {
        name: "Pro",
        description: "Deep insights for power users.",
        priceSuffix: "/mo",
        mostPopular: "Most Popular",
        features: ["Unlimited Meetings", "Advanced AI Analytics", "Action Item Tracking", "Standard Integrations"],
      },
      team: {
        name: "Team",
        description: "Scale efficiency across the org.",
        priceSuffix: "/mo",
        features: ["Up to 10 Seats included", "Centralized Workspace", "Custom AI Prompts", "SSO & Security"],
        contactSales: "Contact Sales",
      },
    },
    actions: {
      currentPlan: "Current plan",
      getStarted: "Get Started",
      redirecting: "Redirecting...",
      upgradeToPro: "Upgrade to Pro",
      couldNotStartCheckout: "Could not start checkout.",
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "How does Linqis AI handle data security?",
          a: "Security is our top priority. All meeting transcriptions and data are encrypted at rest and in transit using enterprise-grade AES-256 encryption. We are SOC-2 Type II compliant and never train our public models on your private data.",
        },
        {
          q: "Can I cancel my subscription at any time?",
          a: "Yes, you can cancel your monthly or yearly plan at any point through your dashboard. You will maintain access to your plan's features until the end of the current billing cycle.",
        },
        {
          q: "Does Linqis work with all video platforms?",
          a: "Linqis seamlessly integrates with Zoom, Microsoft Teams, Google Meet, and Cisco Webex. You can also upload raw audio/video files directly for post-meeting analysis.",
        },
      ],
    },
  },
  fr: {
    hero: {
      title: "Des tarifs simples. Une vraie valeur.",
      subtitle: "Une intelligence de réunion IA haute-fidélité pour les particuliers et les équipes qui exigent de la clarté sans blabla.",
      monthly: "Mensuel",
      yearly: "Annuel",
      save: "Économisez 20 %",
    },
    plans: {
      free: {
        name: "Free",
        description: "Pour bien démarrer, en solo.",
        priceSuffix: "/mois",
        features: ["5 réunions / mois", "Résumés IA (Standard)", "Historique 30 jours", "Intégrations CRM"],
      },
      pro: {
        name: "Pro",
        description: "Des analyses poussées pour les power users.",
        priceSuffix: "/mois",
        mostPopular: "Le plus populaire",
        features: ["Réunions illimitées", "Analyses IA avancées", "Suivi des actions", "Intégrations standard"],
      },
      team: {
        name: "Team",
        description: "Une efficacité à l'échelle de l'organisation.",
        priceSuffix: "/mois",
        features: ["Jusqu'à 10 sièges inclus", "Espace de travail centralisé", "Prompts IA personnalisés", "SSO & Sécurité"],
        contactSales: "Contacter les ventes",
      },
    },
    actions: {
      currentPlan: "Plan actuel",
      getStarted: "Commencer",
      redirecting: "Redirection...",
      upgradeToPro: "Passer à Pro",
      couldNotStartCheckout: "Impossible de démarrer le paiement.",
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        {
          q: "Comment Linqis AI gère-t-il la sécurité des données ?",
          a: "La sécurité est notre priorité absolue. Toutes les transcriptions et données de réunion sont chiffrées au repos et en transit avec un chiffrement AES-256 de niveau entreprise. Nous sommes conformes SOC-2 Type II et n'entraînons jamais nos modèles publics sur vos données privées.",
        },
        {
          q: "Puis-je annuler mon abonnement à tout moment ?",
          a: "Oui, vous pouvez annuler votre plan mensuel ou annuel à tout moment depuis votre tableau de bord. Vous conserverez l'accès aux fonctionnalités de votre plan jusqu'à la fin du cycle de facturation en cours.",
        },
        {
          q: "Linqis fonctionne-t-il avec toutes les plateformes vidéo ?",
          a: "Linqis s'intègre parfaitement à Zoom, Microsoft Teams, Google Meet et Cisco Webex. Vous pouvez aussi envoyer directement des fichiers audio/vidéo bruts pour une analyse post-réunion.",
        },
      ],
    },
  },
};
