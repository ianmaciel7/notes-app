<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Conventions & Architecture

## Core Guidelines
- **Package Manager**: Use `pnpm` exclusively (`pnpm add`, `pnpm run`, etc.). Never use `npm` or `yarn`.
- **Linting & Formatting**: Biome is the project standard (`pnpm check`, `pnpm lint`, `pnpm format`). Do not configure or install ESLint or Prettier.
- **Styling**: Tailwind CSS v4 is used with CSS-first configuration (`@theme` directives in CSS). Do NOT create `tailwind.config.js` or `tailwind.config.ts`.
- **React & Next.js Version**: React 19 and Next.js 16 App Router. Follow the documentation in `node_modules/next/dist/docs/`.
  - Keep client boundaries lean (`'use client'`).
  - Offload heavy operations (e.g. document parsing) to server Route Handlers (`/api/*`).

## Architecture & Data Flow
- **Offline & Local-First**: Dexie.js (`src/lib/db/`) is the local single source of truth for reads and writes.
- **Cloud Backend**: Google Firebase (App Hosting, Firebase Auth, Cloud Firestore).
- **State Management**:
  - UI state: Zustand (`zustand`).
  - Database queries: Dexie `useLiveQuery` for reactive local UI updates.
- **SRS Core**: FSRS (Free Spaced Repetition Scheduler) algorithm for flashcards and study pacing.
- **AI Gateway**: Protected server-side proxy at `/api/ai/generate` for Google Gemini 2.0 Flash and Groq models. API keys must remain on the server (environment variables / Secret Manager).

