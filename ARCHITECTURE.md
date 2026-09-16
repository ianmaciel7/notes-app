# Architecture

This document describes the implemented architecture of Revisa, a local-first web application for creating flashcard decks, studying with FSRS scheduling, and exporting or restoring browser-local data.

## Product Shape

The application provides four core workflows:

- Create, edit, and delete decks.
- Create, edit, and delete cards within a deck.
- Study due cards and record review ratings.
- Export and restore the complete library as a validated JSON backup.

The browser is the system of record. There is no server database or remote synchronization layer in the current implementation.

## Runtime Architecture

```text
Browser
  Next.js 16 App Router (src/app/)
  React 19 client components & providers (src/components/)
  Dexie IndexedDB database (src/data/db.ts)
  Domain engines: FSRS scheduler, queue, goals, error analysis (src/domain/)
  JSON backup / restore (src/data/backup.ts)
  Firebase Authentication & Auth Emulator (src/integrations/firebase.ts)
  Optional WebMCP tool registration (src/integrations/webmcp.ts)
```

Routes are composed in `src/app/` and delegate interactive behavior to client components in `src/components/`. Browser-only APIs and persistence stay behind client boundaries.

## Route and UI Layers

The application uses these route surfaces:

- `/` — deck library (`LibraryShell`).
- `/decks/[deckId]` — deck detail and card management (`DeckDetail`).
- `/study/[deckId]` — study session for a deck (`StudySession`).
- `/analytics` — learning analytics and performance dashboard (`AnalyticsDashboard`).
- `/backup` — export and restore controls (`BackupManager`).

`SpaceLayout` provides shared navigation, responsive shell layout, and authentication status. Feature components own local form state, dialogs, study interactions, and browser event handling. Product-facing copy remains in Brazilian Portuguese (`pt-BR`).

## Domain Model

The domain is organized under `src/domain/` and `src/data/`:

- `DeckRecord` stores a deck name, description, and timestamps.
- `CardRecord` stores front/back content, its `deckId`, and timestamps.
- `CardSchedule` stores FSRS state for one card, keyed by `cardId`.
- `ReviewLogRecord` stores each rating and the previous schedule snapshot.
- `DailyGoalRecord` stores goal tracking configurations and progress.

Cards belong to exactly one deck. Deleting a card removes its schedule and review history. Deleting a deck removes the deck, its cards, their schedules, and their review history in one transaction.

## Local Persistence

`src/data/db.ts` defines the Dexie database named `revisa` with these tables:

- `decks` — indexed by `id`, `name`, and `updatedAt`.
- `cards` — indexed by `id`, `deckId`, `createdAt`, and `updatedAt`.
- `schedules` — keyed by `cardId`, indexed by `due` and `state`.
- `reviewLogs` — indexed by `id`, `cardId`, `deckId`, and `reviewedAt`.
- `dailyGoals` — indexed by `id`, `date`.

Domain mutations should use the exported database functions in `src/data/db.ts`. Those functions trim and validate user input, generate IDs and timestamps, and use Dexie transactions when multiple tables must change together.

## Study Scheduling & Domain Engines

- **FSRS Scheduler (`src/domain/scheduler.ts`)**: Adapts `ts-fsrs` to convert schedules to/from FSRS cards, preview next intervals for `Again`, `Hard`, `Good`, or `Easy`, and produce append-only review logs.
- **Study Queue (`src/domain/study-queue.ts`)**: Manages due cards, learning queues, and session order.
- **Goals Engine (`src/domain/goals.ts`)**: Computes daily retention and study volume targets.
- **Error Analysis (`src/domain/error-analysis.ts`)**: Analyzes card lapse patterns and difficulty trends.

Study UI code calls the domain functions and persists results through `saveReview`; it does not duplicate scheduling calculations.

## Backup and Restore

Backups use the versioned `BackupEnvelope` type in `src/data/types.ts`:

- `schemaVersion` is currently `1`.
- The envelope contains decks, cards, schedules, and review logs.
- `parseBackup` in `src/data/backup.ts` validates JSON with Zod before it reaches the database.
- `replaceDatabase` replaces library data in a single Dexie transaction.

Any future backup schema change must add an explicit migration or version-handling path rather than silently accepting incompatible data.

## Integrations

### Firebase Authentication (`src/integrations/firebase.ts`)
- Configures Firebase Auth with Google Authentication support (`AuthProvider` in `src/components/auth-provider.tsx`).
- Supports local development via the Firebase Auth Emulator (`pnpm emulators`, `pnpm dev:all`).
- User authentication state is surfaced via React Context without coupling local IndexedDB storage to remote servers.

### WebMCP Integration (`src/integrations/webmcp.ts`)
- Optionally registers browser tools when `document.modelContext` is available:
  - `list_decks`: read-only deck inventory and card counts.
  - `create_deck`: validates input with Zod and creates decks.
- WebMCP is purely additive; the application operates standalone when `modelContext` is unavailable.

## Security and Trust Boundaries

The primary boundary is between user-controlled browser input and local persistence:

- Validate backup files with Zod before replacing local data.
- Validate WebMCP inputs before invoking domain mutations.
- Keep IndexedDB access, Firebase client instances, and browser APIs in client components or client-only modules.
- Do not store secrets or service account keys in client code; use public configuration with emulators for local testing.

## Development Conventions

- Use `pnpm` with the pinned package manager version (`pnpm@11.20.0`).
- Keep route composition in `src/app/`, reusable UI in `src/components/`, domain logic in `src/domain/`, persistence in `src/data/`, and external bridges in `src/integrations/`.
- Preserve the existing Tailwind CSS v4 tokens and accessibility/focus behavior.
- Keep user-facing copy in `pt-BR`; use English for identifiers, tests, comments, and internal errors.
- Consult the installed Next.js guides before changing App Router-sensitive behavior.

## Evolution Rules

Update this document when a change alters:

- Route or client/server boundaries.
- IndexedDB tables, domain invariants, or repository-style mutation functions.
- FSRS scheduling, study-queue, or review-log semantics.
- Backup schema or restore behavior.
- Firebase integration or WebMCP tools.
- The introduction of cloud sync, server APIs, or remote persistence.
