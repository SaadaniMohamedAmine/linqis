# Linqis — Enrichissement de la Homepage

**Branche à créer** : `feat/homepage-enrichment` (depuis `main`)
**Fichiers concernés** : `src/app/(public)/page.tsx` (réécriture complète), `src/components/public-navbar.tsx` (ajout d'ancres)

## Contexte

La homepage actuelle (`src/app/(public)/page.tsx`) ne contient que 4 sections (Hero, Features x3, Steps x3, CTA final) — trop peu pour refléter tout ce que le produit fait réellement (auth, Stripe, recherche full-text, chat RAG, partage public, analytics, intégrations Notion/Slack/Email/Zoom/Google Calendar). Cette tâche ajoute 4 sections concrètes, ancrées dans les vraies fonctionnalités du produit, et corrige des chiffres marketing inventés déjà présents dans le code.

### Chiffres/claims inventés à corriger (vérifiés contre le code actuel)

1. `"Proprietary neural engines convert speech to text with 99.4% accuracy in real-time, handling 40+ languages natively."` → `99.4%` et `40+ languages` sont inventés, aucune mesure ni configuration de langues réelle dans le produit.
2. `"One-click integrations with Notion, Slack, Jira, and GitHub."` → **Jira et GitHub n'existent pas dans le produit.** Les intégrations d'export réelles sont Notion, Slack et Email (`server/src/routes/exports.ts`, `server/src/services/export/{notion,slack,email}.ts`).
3. `"Join 50,000+ teams who use Linqis..."` → chiffre inventé, aucune donnée d'usage réelle ne le justifie.
4. Badge `"NEW: AI Summary V2.0"` → aucun versionnement "V2.0" du résumé IA n'existe, badge cosmétique trompeur.

Tous corrigés ci-dessous par des formulations honnêtes qui ne perdent rien en punch marketing.

### Vérification des nouvelles affirmations (faite avant validation du spec)

- **Zoom** : confirmé réel — `server/src/services/integrations/zoom.ts` + `server/src/routes/integrations.ts` implémentent un import complet des recordings Zoom (téléchargement, extraction audio, chunking, pipeline de transcription). Zoom peut donc figurer légitimement dans le bandeau Intégrations.
- **Google Calendar** : présent côté service (`getGoogleAuthUrl`, `getGoogleCalendarEvents` dans `server/src/services/integrations/google-calendar.ts`).
- **Notion/Slack/Email export** : confirmés réels et fonctionnels dans `server/src/routes/exports.ts`.
- **Rôles onboarding** : `Product Manager`, `Engineering Lead`, `Founder / Executive`, `Designer` matchent exactement `ROLES` dans `src/app/onboarding/page.tsx:9` (le 5ᵉ rôle, `Other`, est volontairement omis des cartes marketing).
- **Détail `details > summary::-webkit-details-marker { display: none; }`** : confirmé présent et inutilisé dans `src/app/globals.css:72` — le pattern FAQ natif était prévu mais jamais exploité.
- **Correction apportée après revue** : l'affirmation initiale *"Notion exports use your own API key, stored on your account — not a shared workspace"* était inexacte. Le code (`server/src/routes/exports.ts:30-33`) montre un fallback vers une clé Notion partagée (`process.env.NOTION_API_KEY`) quand l'utilisateur n'a pas connecté son propre compte. Reformulé ci-dessous pour rester honnête.

---

## Nouvelles sections ajoutées (dans l'ordre d'apparition sur la page)

1. Hero (conservé, copie corrigée)
2. Features (conservé, copie corrigée)
3. **Intégrations** (nouveau) — bandeau des vrais outils supportés (Notion, Slack, Email, Google Calendar, Zoom)
4. Steps (conservé tel quel, déjà correct)
5. **Ask your meetings** (nouveau) — met en avant le chat RAG, le différenciateur le plus fort du produit
6. **Cas d'usage par rôle** (nouveau) — 4 cartes alignées sur les rôles de l'onboarding : Product Manager, Engineering Lead, Founder/Executive, Designer
7. **Sécurité & confidentialité** (nouveau) — 4 points de confiance ancrés dans ce qui est réellement construit
8. **FAQ** (nouveau) — accordéon natif `<details>/<summary>`
9. CTA final (conservé, copie corrigée)

---

## Fichier complet : `src/app/(public)/page.tsx`

Remplacer tout le fichier par :

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, MessageCircle, Mail, Calendar, Video, ShieldCheck, Lock, Trash2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INTEGRATIONS = [
  { icon: FileText, name: "Notion" },
  { icon: MessageCircle, name: "Slack" },
  { icon: Mail, name: "Email" },
  { icon: Calendar, name: "Google Calendar" },
  { icon: Video, name: "Zoom" },
];

const USE_CASES = [
  {
    role: "Product Manager",
    headline: "Never lose a decision in a doc nobody reopens.",
    desc: "Every decision and action item is extracted automatically and stays searchable across every meeting you've ever had.",
  },
  {
    role: "Engineering Lead",
    headline: "Keep async teammates in the loop without a recap meeting.",
    desc: "Push a clean summary straight to Slack the moment a meeting ends, so nobody has to sit through the recording.",
  },
  {
    role: "Founder / Executive",
    headline: "Ask a question, get an answer from every meeting at once.",
    desc: "Ask your meetings anything — \"What did we decide about pricing last month?\" — and get an answer with sources, not a transcript to skim.",
  },
  {
    role: "Designer",
    headline: "Spot the disagreements before they become rework.",
    desc: "Linqis flags tension and unresolved disagreement in design reviews, so you follow up before it turns into a Monday surprise.",
  },
];

const SECURITY_POINTS = [
  { icon: Lock, title: "Your data, isolated", desc: "Every meeting, transcript, and summary is scoped to your account. No other user can query or list your data, ever." },
  { icon: ShieldCheck, title: "Encrypted in transit", desc: "All traffic between your browser, Linqis, and its AI providers runs over HTTPS/TLS." },
  { icon: KeyRound, title: "You control exports", desc: "Connect your own Notion workspace in Settings, or start exporting right away with ours." },
  { icon: Trash2, title: "Delete anytime", desc: "Remove a meeting and its transcript, summary, and action items are gone — no soft-delete limbo." },
];

const FAQS = [
  { q: "What file formats can I upload?", a: "MP3, MP4, WAV, M4A, MOV, and WebM — audio or video, Linqis extracts the audio automatically." },
  { q: "Is my meeting data private?", a: "Yes. Meetings are scoped to your account only — no other user can see, search, or export your data. You can delete any meeting permanently at any time." },
  { q: "What happens when I hit the Free plan limit?", a: "You'll get a clear message before anything fails, with the option to upgrade to Pro for unlimited meetings and longer recordings." },
  { q: "Can I export to tools I already use?", a: "Yes — one click sends a summary to Notion, Slack, or email. Notion exports use your own account by default, or ours if you haven't connected one yet." },
  { q: "How does \"Ask your meetings\" work?", a: "It's a chat that searches across every meeting you've processed and answers using only what was actually said, with links back to the source meeting." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center px-6 max-w-[1440px] mx-auto overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-success/10 rounded-full blur-[120px] -z-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center py-12 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-surface px-4 py-1 rounded-full border border-border mb-6 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success">AI-powered meeting intelligence</span>
            </motion.div>

            <h1 className="text-6xl leading-[1.1] font-extrabold tracking-tighter mb-6">
              Every meeting, <span className="text-success">decoded.</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-lg mb-12">
              Linqis transforms chaotic conversations into structured action items. Use AI-driven intelligence to capture every insight, automatically.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/sign-up">
                <Button variant="primary" size="lg">Start free</Button>
              </Link>
              <Button variant="secondary" size="lg">See how it works</Button>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center pt-12 md:pt-0 perspective-1000"
          >
            <Card className="p-6 rounded-xl w-full max-w-[580px] shadow-2xl relative z-10 bg-surface/80 backdrop-blur-md border-border hover:border-success/30 transition-colors duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-success">●</span>
                  <span className="text-sm font-medium">Meeting Analysis: Q3 Strategy</span>
                </div>
                <span className="text-xs text-text-secondary">04:32 / 18:45</span>
              </div>
              <div className="h-20 flex items-end gap-[3px] mb-6 px-1">
                {[30, 60, 80, 50, 90, 100, 70, 40, 60, 20, 70, 30].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-success/20 rounded-full"
                    style={{ background: h > 70 ? 'var(--color-success)' : h > 40 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.3)' }}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-background p-4 rounded-lg border border-border flex items-center gap-4"
                >
                  <span className="text-success">✓</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Finalize Q4 roadmap by Friday</p>
                    <p className="text-xs text-text-secondary">Assigned to Sarah K.</p>
                  </div>
                  <Badge variant="danger">URGENT</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-background p-4 rounded-lg border border-border flex items-center gap-4 opacity-60"
                >
                  <span className="text-text-secondary">○</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Schedule sync with dev team</p>
                    <p className="text-xs text-text-secondary">Pending... (AI Tag: Ops)</p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface/50">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">Superpowered by Intelligence</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Focused on speed, privacy, and actionable outcomes for high-performance teams.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Instant Transcription", desc: "Speech-to-text powered by Whisper, with automatic speaker separation and a summary ready minutes after upload." },
              { icon: "✨", title: "AI Summary", desc: "Get a concise executive summary, decisions, and bulleted action items — extracted automatically, not written by hand." },
              { icon: "🔗", title: "Export Anywhere", desc: "One-click export to Notion, Slack, or email. Sync your meeting insights directly to the tools your team already uses." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full p-6 border-border hover:border-success/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-300 group cursor-default">
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-border group-hover:border-success/30 group-hover:bg-success/10 transition-colors">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-success transition-colors">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm text-text-secondary uppercase tracking-widest">Works with the tools you already use</p>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 bg-surface border border-border rounded-full px-5 py-3 text-text-secondary hover:border-success/40 hover:text-text-primary transition-colors"
              >
                <integration.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-24 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-semibold mb-12"
              >
                From voice to value in seconds.
              </motion.h2>
              <div className="space-y-12">
                {[
                  { num: 1, title: "Upload", desc: "Record live or drag and drop any video or audio file. We support all major formats including MP4, MP3, and WAV." },
                  { num: 2, title: "Process", desc: "Our AI engine analyzes the transcript, identifies speakers, and extracts key decisions using semantic understanding." },
                  { num: 3, title: "Export", desc: "Review your dashboard and push the results to your favorite tools. Your knowledge base grows with every meeting." }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-success text-background' : 'bg-surface border border-text-secondary text-text-primary'}`}
                      >
                        {step.num}
                      </motion.div>
                      {i < 2 && <div className="w-px h-16 bg-border mt-2" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-text-secondary">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="aspect-video bg-surface rounded-2xl overflow-hidden border border-border relative flex items-center justify-center group cursor-pointer hover:border-success/50 transition-colors">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-success/20 p-4 rounded-full inline-flex mb-4"
                  >
                    <span className="text-success text-4xl group-hover:text-white transition-colors">▶</span>
                  </motion.div>
                  <p className="font-medium">Watch product demo</p>
                  <p className="text-xs text-text-secondary">2:14 min</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ask Your Meetings Section */}
      <section id="ask" className="py-24 bg-surface/50 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="success" className="mb-4">New</Badge>
            <h2 className="text-3xl font-semibold mb-4">Ask your meetings anything.</h2>
            <p className="text-text-secondary max-w-md mb-6">
              Stop scrolling through transcripts. Linqis searches across every meeting you've processed and answers in plain English — with a link back to exactly where it came from.
            </p>
            <Link href="/sign-up">
              <Button variant="primary">Try it free</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 rounded-xl bg-surface/80 backdrop-blur-md border-border">
              <div className="flex justify-end mb-4">
                <div className="bg-success/10 border border-success/20 rounded-lg rounded-tr-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm">What did we decide about the Q3 budget?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-lg rounded-tl-none px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-text-secondary mb-2">
                    You approved a 12% increase for the design team, contingent on the Q2 hiring plan closing on time.
                  </p>
                  <Link href="#" className="text-xs text-success hover:underline">Source: "Q3 Strategy" — Aug 3</Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Use Cases by Role Section */}
      <section id="use-cases" className="py-24 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">Built for how you actually work.</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Whatever the meeting, Linqis adapts to what you need out of it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={uc.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full p-6 border-border hover:border-success/40 transition-colors">
                  <p className="text-xs font-semibold text-success uppercase tracking-widest mb-3">{uc.role}</p>
                  <h3 className="text-base font-semibold mb-2">{uc.headline}</h3>
                  <p className="text-sm text-text-secondary">{uc.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-surface/50 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-semibold mb-4">Your meetings stay yours.</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Meeting content is sensitive. Linqis is built to keep it that way.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECURITY_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full p-6 border-border">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-4 border border-border">
                    <point.icon className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{point.title}</h3>
                  <p className="text-sm text-text-secondary">{point.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold mb-12 text-center"
          >
            Frequently asked questions
          </motion.h2>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group bg-surface border border-border rounded-lg px-5 py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-text-primary">
                  {faq.q}
                  <span className="text-text-secondary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-text-secondary mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-success/5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <h2 className="text-5xl font-semibold mb-6">Ready to stop taking notes?</h2>
          <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto">Join teams who use Linqis to stay aligned without the manual effort.</p>
          <div className="flex justify-center items-center gap-4">
            <Link href="/sign-up">
              <Button variant="primary" size="lg">Start your free trial</Button>
            </Link>
            <Button variant="secondary" size="lg">Contact Sales</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
```

### Notes d'implémentation

- `Badge variant="success"` (badge "New" de la section Ask) existe déjà dans `src/components/ui/badge.tsx` (`success`/`warning`/`danger`/`info`/`neutral`) — aucune modification du composant partagé nécessaire.
- Les icônes `lucide-react` utilisées (`FileText`, `MessageCircle`, `Mail`, `Calendar`, `Video`, `ShieldCheck`, `Lock`, `Trash2`, `KeyRound`) sont des icônes génériques, pas des logos de marque — volontaire pour éviter toute question de droit sur la reproduction de logos Notion/Slack/Zoom/Google. Si une version plus proche des vraies identités visuelles est voulue plus tard, utiliser des SVG officiels téléchargés depuis les brand kits respectifs plutôt que de les redessiner à la main.
- Le lien "Source: ..." dans le mockup de chat (section Ask) est un `href="#"` volontairement inerte — c'est un mockup marketing, pas une vraie réponse du chat RAG.
- La carte "You control exports" (section Sécurité) et la réponse FAQ correspondante ont été reformulées pour refléter le fallback réel vers une clé Notion partagée (voir section Vérification ci-dessus).

## Fichier modifié : `src/components/public-navbar.tsx`

Ajouter des ancres à la navigation (le nombre de sections augmente, `Steps`/`Action` de la nav actuelle sont retirés au profit d'ancres plus représentatives) :

```tsx
<nav className="hidden md:flex items-center gap-8">
  <Link href="/#features" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Features</Link>
  <Link href="/#use-cases" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Use Cases</Link>
  <Link href="/#security" className="text-text-secondary hover:text-success transition-colors cursor-pointer">Security</Link>
  <Link href="/pricing" className="text-text-secondary hover:text-success transition-colors">Pricing</Link>
</nav>
```

Steps et CTA restent accessibles au scroll normal, sans ancre dédiée dans la nav (4 items grand max pour rester lisible).

## Avant de terminer

1. `npm run dev`, vérifier visuellement les 4 nouvelles sections sur `http://localhost:3000`
2. Vérifier que `Badge variant="success"` s'affiche correctement
3. `npm run design-audit` pour confirmer l'absence de couleurs en dur dans les nouvelles sections
4. `npm run typecheck`
5. Commit, PR vers `main`
