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
- **Cloud Backend**: Google Firebase (App Hosting on Cloud Run, Firebase Auth, Cloud Firestore)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **State Management**: Zustand (transient UI) + Dexie `useLiveQuery` (database reactivity)
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

### 3. Code Quality Checks
```bash
# Check formatting and linting (with auto-fix)
pnpm check

# Check linting only
pnpm lint

# Format files
pnpm format
```

---

## Documentation

- [SPEC.md](SPEC.md) — Comprehensive functional specification, entity schemas, FSRS math, and implementation roadmap.
- [DECISIONS.md](DECISIONS.md) — Architectural decision records (ADRs) covering Firebase, Dexie, FSRS, AI Gateway, and Reader engine.
- [AGENTS.md](AGENTS.md) — Coding conventions, negative constraints, and instructions for AI pairing agents.
- [CLAUDE.md](CLAUDE.md) / [.cursorrules](.cursorrules) — Agent entrypoints for Claude Code and Cursor.
