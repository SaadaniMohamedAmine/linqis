# Linqis

Every meeting, decoded.

Linqis turns a raw meeting recording into a searchable, actionable record: full transcript, executive summary, decisions, action items with owners, detected disagreements, and overall mood -- generated automatically and pushed wherever your team already works.

**Live demo:** [linqis.vercel.app](https://linqis.vercel.app/)

## Features

- **Upload -> transcript -> insights, automatically.** Drop an MP3/MP4/WAV/M4A/MOV/WebM file (or pull a Zoom cloud recording directly), and Linqis extracts audio, transcribes with speaker diarization, and runs AI analysis in the background with live progress.
- **Structured output, not just a wall of text.** Executive summary, decisions, action items (owner/priority), detected disagreements, and a mood read on the meeting -- each in its own tab on the meeting page.
- **Ask your meetings.** Full-text search across every transcript, plus a RAG chat that answers questions grounded in your own meeting history (embeddings-based retrieval, no vector DB required).
- **Calendar-aware.** Connect Google Calendar to see upcoming events, auto-detect Zoom/Meet links in them, and link an upload to its calendar event so the title and context carry over.
- **Share & export.** Public read-only share links, PDF export, and one-click push of a summary to Notion, Slack, or email.
- **Multi-tenant workspaces.** Team invites, role-based access (owner/admin/member), and per-workspace usage limits tied to a real Stripe subscription (Free vs. Pro, test mode).
- **Built for adoption, not just for me.** Onboarding flow + guided product tour, English/French i18n throughout, and a public developer API (API keys + webhooks) for teams who want to build on top of it.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js + Express (deployed separately from the frontend)
- **AI**: Hugging Face Whisper (transcription), Gemini + Groq (summary/decisions/action items/disagreements/mood/chat, with automatic fallback between providers)
- **DB**: PostgreSQL (Neon) + Prisma
- **Queue**: BullMQ + Redis (async processing for uploads/transcription/analysis)
- **Billing**: Stripe (subscriptions, test mode)
- **Integrations**: Zoom, Google Calendar, Notion, Slack, SMTP email
- **Auth**: NextAuth (Google OAuth + email/password), signed JWT bridge to the Express API
- **Deploy**: Vercel (frontend) + Railway (backend)

## Architecture

The Next.js app and the Express API are two separate deployables (Vercel + Railway) that don't share a runtime, so a couple of things follow from that:

- The frontend never talks to Postgres/Redis directly -- everything goes through the Express API.
- NextAuth's session cookie is Vercel-only, so the frontend mints a short-lived signed JWT (`BACKEND_JWT_SECRET`) on each request for the Express API to verify.
- A BullMQ worker (Redis-backed) does the actual transcription/analysis off the request path, streaming progress back over SSE.

## Getting Started

```bash
git clone <this-repo>
cd Linqis-meeting-summarizer
npm install

cp .env.example .env        # fill in DB, AI provider, and integration keys
npx prisma generate
npx prisma migrate deploy

npm run dev:all             # runs Next.js (:3000) + Express (:4000) together
```

See `.env.example` for the full list of required environment variables (database, Google OAuth, AI providers, Zoom, Google Calendar, Stripe test keys, SMTP).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev:all` | Frontend + backend together, for local development |
| `npm run build` | Production build of the Next.js app |
| `npm run build:server` | Compiles the Express server |
| `npm run typecheck` | TypeScript check across the frontend |
| `npm run test:server` | Backend test suite (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
