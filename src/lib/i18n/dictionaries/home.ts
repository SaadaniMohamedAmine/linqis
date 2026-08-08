import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface HomeDictionary {
  nav: {
    features: string;
    useCases: string;
    security: string;
    pricing: string;
    signOut: string;
    dashboard: string;
    signIn: string;
    getStarted: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  mockup: {
    label: string;
    task1: string;
    task1Owner: string;
    task1Badge: string;
    task2: string;
    task2Status: string;
  };
  featuresSection: {
    title: string;
    subtitle: string;
    items: { icon: string; title: string; desc: string }[];
  };
  integrations: { title: string };
  steps: {
    title: string;
    items: { title: string; desc: string }[];
    demo: { title: string; duration: string };
  };
  ask: {
    badge: string;
    title: string;
    desc: string;
    cta: string;
    question: string;
    answer: string;
    source: string;
  };
  useCasesSection: {
    title: string;
    subtitle: string;
    items: { role: string; headline: string; desc: string }[];
  };
  security: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; subtitle: string; primary: string; secondary: string };
}

export const homeDictionary: Record<LocaleCode, HomeDictionary> = {
  en: {
    nav: {
      features: "Features",
      useCases: "Use Cases",
      security: "Security",
      pricing: "Pricing",
      signOut: "Sign Out",
      dashboard: "Dashboard",
      signIn: "Sign In",
      getStarted: "Get Started",
    },
    hero: {
      badge: "AI-powered meeting intelligence",
      titlePrefix: "Every meeting,",
      titleHighlight: "decoded.",
      subtitle: "Linqis transforms chaotic conversations into structured action items. Use AI-driven intelligence to capture every insight, automatically.",
      ctaPrimary: "Start free",
      ctaSecondary: "See how it works",
    },
    mockup: {
      label: "Meeting Analysis: Q3 Strategy",
      task1: "Finalize Q4 roadmap by Friday",
      task1Owner: "Assigned to Sarah K.",
      task1Badge: "URGENT",
      task2: "Schedule sync with dev team",
      task2Status: "Pending... (AI Tag: Ops)",
    },
    featuresSection: {
      title: "Superpowered by Intelligence",
      subtitle: "Focused on speed, privacy, and actionable outcomes for high-performance teams.",
      items: [
        { icon: "⚡", title: "Instant Transcription", desc: "Speech-to-text powered by Whisper, with speaker labeling and a summary ready minutes after upload." },
        { icon: "✨", title: "AI Summary", desc: "Get a concise executive summary, decisions, and bulleted action items — extracted automatically, not written by hand." },
        { icon: "🔗", title: "Export Anywhere", desc: "One-click export to Notion, Slack, or email on the Pro plan. Sync your meeting insights directly to the tools your team already uses." },
      ],
    },
    integrations: { title: "Works with the tools you already use" },
    steps: {
      title: "From voice to value in seconds.",
      items: [
        { title: "Upload", desc: "Record live or drag and drop any video or audio file. We support all major formats including MP4, MP3, and WAV." },
        { title: "Process", desc: "Our AI engine analyzes the transcript, identifies speakers, and extracts key decisions using semantic understanding." },
        { title: "Export", desc: "Review your dashboard and push the results to your favorite tools. Your knowledge base grows with every meeting." },
      ],
      demo: { title: "Watch product demo", duration: "2:14 min" },
    },
    ask: {
      badge: "Pro",
      title: "Ask your meetings anything.",
      desc: "Stop scrolling through transcripts. Linqis searches across every meeting you've processed and answers in plain English — with a link back to exactly where it came from. Available on the Pro plan.",
      cta: "See Pro plans",
      question: "What did we decide about the Q3 budget?",
      answer: "You approved a 12% increase for the design team, contingent on the Q2 hiring plan closing on time.",
      source: 'Source: "Q3 Strategy" — Aug 3',
    },
    useCasesSection: {
      title: "Built for how you actually work.",
      subtitle: "Whatever the meeting, Linqis adapts to what you need out of it.",
      items: [
        { role: "Product Manager", headline: "Never lose a decision in a doc nobody reopens.", desc: "Every decision and action item is extracted automatically and stays searchable across every meeting you've ever had." },
        { role: "Engineering Lead", headline: "Keep async teammates in the loop without a recap meeting.", desc: "Send a clean summary to Slack in one click after a meeting ends, so nobody has to sit through the recording." },
        { role: "Founder / Executive", headline: "Ask a question, get an answer from every meeting at once.", desc: 'Ask a plain-English question like "What did we decide about pricing last month?" and get an answer with sources, not a transcript to skim.' },
        { role: "Designer", headline: "Spot the disagreements before they become rework.", desc: "Linqis flags tension and unresolved disagreement in design reviews, so you follow up before it turns into a Monday surprise." },
      ],
    },
    security: {
      title: "Your meetings stay yours.",
      subtitle: "Meeting content is sensitive. Linqis is built to keep it that way.",
      items: [
        { title: "Your data, isolated", desc: "Every meeting, transcript, and summary is scoped to your account. No other user can query or list your data, ever." },
        { title: "Encrypted in transit", desc: "All traffic between your browser, Linqis, and its AI providers runs over HTTPS/TLS." },
        { title: "You control exports", desc: "On Pro, connect your own Notion workspace in Settings, or start exporting right away with ours." },
        { title: "Delete anytime", desc: "Remove a meeting and its transcript, summary, and action items are gone — no soft-delete limbo." },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What file formats can I upload?", a: "MP3, MP4, WAV, M4A, MOV, and WebM — audio or video, Linqis extracts the audio automatically." },
        { q: "Is my meeting data private?", a: "Yes. Meetings are scoped to your account only — no other user can see, search, or export your data, unless you explicitly create a public share link for a meeting. You can delete any meeting permanently at any time." },
        { q: "What happens when I hit the Free plan limit?", a: "You'll get a clear message before anything fails, with the option to upgrade to Pro for unlimited meetings and longer recordings." },
        { q: "Can I export to tools I already use?", a: "On the Pro plan, yes — one click sends a summary to Notion, Slack, or email. Notion exports use your own account by default, or ours if you haven't connected one yet." },
        { q: 'How does "Ask your meetings" work?', a: "It's a chat that searches across every meeting you've processed and answers using only what was actually said, with links back to the source meeting." },
      ],
    },
    cta: {
      title: "Ready to stop taking notes?",
      subtitle: "Join teams who use Linqis to stay aligned without the manual effort.",
      primary: "Start your free trial",
      secondary: "Contact Sales",
    },
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      useCases: "Cas d'usage",
      security: "Sécurité",
      pricing: "Tarifs",
      signOut: "Se déconnecter",
      dashboard: "Tableau de bord",
      signIn: "Se connecter",
      getStarted: "Commencer",
    },
    hero: {
      badge: "L'intelligence des réunions par l'IA",
      titlePrefix: "Chaque réunion,",
      titleHighlight: "décryptée.",
      subtitle: "Linqis transforme des conversations chaotiques en actions structurées. Une intelligence pilotée par l'IA pour capturer chaque insight, automatiquement.",
      ctaPrimary: "Essayer gratuitement",
      ctaSecondary: "Voir comment ça marche",
    },
    mockup: {
      label: "Analyse de réunion : Stratégie T3",
      task1: "Finaliser la roadmap T4 avant vendredi",
      task1Owner: "Assigné à Sarah K.",
      task1Badge: "URGENT",
      task2: "Planifier une synchro avec l'équipe dev",
      task2Status: "En attente... (Tag IA : Ops)",
    },
    featuresSection: {
      title: "Boosté par l'intelligence artificielle",
      subtitle: "Pensé pour la rapidité, la confidentialité et des résultats concrets pour des équipes performantes.",
      items: [
        { icon: "⚡", title: "Transcription instantanée", desc: "Reconnaissance vocale propulsée par Whisper, avec identification des intervenants et un résumé prêt quelques minutes après l'envoi." },
        { icon: "✨", title: "Résumé par IA", desc: "Obtenez un résumé exécutif concis, les décisions prises et les actions à mener — extraits automatiquement, jamais rédigés à la main." },
        { icon: "🔗", title: "Export où vous voulez", desc: "Export en un clic vers Notion, Slack ou email avec le plan Pro. Synchronisez vos insights directement dans les outils que votre équipe utilise déjà." },
      ],
    },
    integrations: { title: "Compatible avec les outils que vous utilisez déjà" },
    steps: {
      title: "De la voix à la valeur, en quelques secondes.",
      items: [
        { title: "Envoyez", desc: "Enregistrez en direct ou glissez-déposez n'importe quel fichier audio ou vidéo. Tous les formats majeurs sont supportés : MP4, MP3, WAV." },
        { title: "L'IA traite", desc: "Notre moteur IA analyse la transcription, identifie les intervenants et extrait les décisions clés grâce à la compréhension sémantique." },
        { title: "Exportez", desc: "Consultez votre tableau de bord et envoyez les résultats vers vos outils préférés. Votre base de connaissances grandit à chaque réunion." },
      ],
      demo: { title: "Voir la démo produit", duration: "2:14 min" },
    },
    ask: {
      badge: "Pro",
      title: "Posez n'importe quelle question à vos réunions.",
      desc: "Fini de faire défiler des transcriptions. Linqis recherche dans toutes les réunions que vous avez traitées et répond en langage clair — avec un lien direct vers la source. Disponible avec le plan Pro.",
      cta: "Voir les plans Pro",
      question: "Qu'avons-nous décidé pour le budget du T3 ?",
      answer: "Vous avez validé une augmentation de 12 % pour l'équipe design, sous réserve de la clôture du plan de recrutement du T2 dans les temps.",
      source: 'Source : « Stratégie T3 » — 3 août',
    },
    useCasesSection: {
      title: "Conçu pour votre façon de travailler.",
      subtitle: "Quelle que soit la réunion, Linqis s'adapte à ce dont vous avez besoin.",
      items: [
        { role: "Chef de produit", headline: "Ne perdez plus jamais une décision dans un doc que personne ne rouvre.", desc: "Chaque décision et chaque action sont extraites automatiquement et restent consultables dans toutes vos réunions passées." },
        { role: "Lead technique", headline: "Gardez vos coéquipiers asynchrones dans la boucle sans réunion de récap.", desc: "Envoyez un résumé clair sur Slack en un clic après la réunion, sans que personne n'ait à regarder l'enregistrement." },
        { role: "Fondateur / Dirigeant", headline: "Posez une question, obtenez une réponse issue de toutes vos réunions à la fois.", desc: "Posez une question simple comme « Qu'avons-nous décidé sur le pricing le mois dernier ? » et obtenez une réponse sourcée, pas une transcription à parcourir." },
        { role: "Designer", headline: "Repérez les désaccords avant qu'ils ne deviennent du travail refait.", desc: "Linqis signale les tensions et désaccords non résolus dans les revues de design, pour que vous puissiez les traiter avant qu'ils ne deviennent une surprise le lundi." },
      ],
    },
    security: {
      title: "Vos réunions restent les vôtres.",
      subtitle: "Le contenu des réunions est sensible. Linqis est conçu pour qu'il le reste.",
      items: [
        { title: "Vos données, isolées", desc: "Chaque réunion, transcription et résumé est rattaché à votre compte. Aucun autre utilisateur ne peut consulter ou lister vos données, jamais." },
        { title: "Chiffré en transit", desc: "Tout le trafic entre votre navigateur, Linqis et ses fournisseurs d'IA transite en HTTPS/TLS." },
        { title: "Vous contrôlez les exports", desc: "En Pro, connectez votre propre espace Notion dans les Paramètres, ou commencez à exporter tout de suite avec le nôtre." },
        { title: "Suppression à tout moment", desc: "Supprimez une réunion et sa transcription, son résumé et ses actions disparaissent — pas de suppression douce qui traîne." },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Quels formats de fichiers puis-je envoyer ?", a: "MP3, MP4, WAV, M4A, MOV et WebM — audio ou vidéo, Linqis extrait l'audio automatiquement." },
        { q: "Mes données de réunion sont-elles privées ?", a: "Oui. Les réunions sont rattachées uniquement à votre compte — aucun autre utilisateur ne peut les voir, les rechercher ou les exporter, sauf si vous créez explicitement un lien de partage public. Vous pouvez supprimer définitivement n'importe quelle réunion à tout moment." },
        { q: "Que se passe-t-il quand j'atteins la limite du plan Free ?", a: "Vous recevrez un message clair avant tout blocage, avec la possibilité de passer au plan Pro pour des réunions illimitées et des enregistrements plus longs." },
        { q: "Puis-je exporter vers les outils que j'utilise déjà ?", a: "Oui, avec le plan Pro — un clic envoie un résumé vers Notion, Slack ou par email. Les exports Notion utilisent votre propre compte par défaut, ou le nôtre si vous n'en avez pas encore connecté." },
        { q: "Comment fonctionne « Ask your meetings » ?", a: "C'est un chat qui recherche dans toutes les réunions que vous avez traitées et répond en s'appuyant uniquement sur ce qui a été dit, avec des liens vers la réunion source." },
      ],
    },
    cta: {
      title: "Prêt à arrêter de prendre des notes ?",
      subtitle: "Rejoignez les équipes qui utilisent Linqis pour rester alignées sans effort manuel.",
      primary: "Démarrer votre essai gratuit",
      secondary: "Contacter les ventes",
    },
  },
};
