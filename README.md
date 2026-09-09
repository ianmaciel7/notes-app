# Notes App: Unified Study & Knowledge Management System

A local-first, zero-operating-cost web application unifying the core superpowers of:
- **Capacities**: Object-based note architecture, typed properties, bi-directional backlinks, and relational knowledge graph.
- **Readwise / Reader**: Document ingestion (PDF, Markdown, EPUB), distraction-free reading, and non-mutating text highlighting.
- **Anki + Goal Pacing**: Modern FSRS (Free Spaced Repetition Scheduler) spaced repetition with goal-driven burndown calculations to pace reviews ahead of exam deadlines.
- **Grounded AI Generation**: Server-side proxy for Google Gemini 2.0 Flash / Groq LLMs extracting flashcards from source quotes with automatic highlight anchor synthesis.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Database**: Dexie.js (IndexedDB local-first single source of truth)
- **Cloud Backend**: Google Firebase (App Hosting on Cloud Run, Firebase Auth, Cloud Firestore, Cloud Storage)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **State Management**: Zustand (transient UI) + Dexie `useLiveQuery` (database reactivity)
- **SRS Review**: Local-first flashcard review deck backed by real Dexie entities and FSRS review persistence.
- **Grounded AI Persistence**: Provider cards are persisted only when their `exactQuote` matches source text and can create real Highlight + Flashcard records.
- **Server Routes**: `/api/ai/generate`, `/api/documents/parse`, `/api/sync/push`, and `/api/storage/upload`.
- **Deployment Config**: Firebase App Hosting via `apphosting.yaml` and `firebase.json`.
- **Security Rules**: Firestore rules in `firestore.rules` restrict private data to `users/{uid}`.
- **Linter & Formatter**: Biome
- **Package Manager**: `pnpm`

---

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Backend Environment
```bash
GEMINI_API_KEY=
GROQ_API_KEY=
FIRESTORE_DATABASE_ID=(default)
FIREBASE_STORAGE_BUCKET=
```

`/api/sync/push` uses Google Application Default Credentials in hosted Firebase/App Hosting environments. For local server testing, an explicit `FIRESTORE_ACCESS_TOKEN` may be provided. `/api/storage/upload` writes authenticated PDF/EPUB blobs through Firebase Admin Storage; set `FIREBASE_STORAGE_BUCKET` when the default bucket is not configured by the hosting environment.

### 4. Code Quality Checks
```bash
# Check formatting and linting (with auto-fix)
pnpm check

# Check linting only
pnpm lint

# Format files
pnpm format

# Focused backend unit tests
pnpm test:unit src/lib
```

---

## Firebase App Hosting

The repository includes:

```text
apphosting.yaml
firebase.json
firestore.rules
.env.example
```

Before deploying to Firebase App Hosting, connect/select the real Firebase project, make sure it is on the Blaze plan, and create the referenced secrets:

```bash
npx -y firebase-tools@latest apphosting:secrets:set geminiApiKey
npx -y firebase-tools@latest apphosting:secrets:set groqApiKey
npx -y firebase-tools@latest deploy
```

Firestore private data is scoped under `users/{uid}` and protected by `firestore.rules`.
Storage blob paths are also scoped under `users/{uid}/spaces/{spaceId}/media/...`.

---

## Documentation

- [SPEC.md](SPEC.md) — Comprehensive functional specification, entity schemas, FSRS math, and implementation roadmap.
- [DECISIONS.md](DECISIONS.md) — Architectural decision records (ADRs) covering Firebase, Dexie, FSRS, AI Gateway, and Reader engine.
- [AGENTS.md](AGENTS.md) — Coding conventions, negative constraints, and instructions for AI pairing agents.
- [CLAUDE.md](CLAUDE.md) — Agent entrypoint for Claude Code.
