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
  Next.js 16 App Router
  React 19 client components
  Dexie IndexedDB database
  FSRS scheduler
  JSON backup / restore
  Optional WebMCP tool registration
```

Routes are composed in `src/app/` and delegate interactive behavior to client components in `src/components/`. Browser-only APIs and persistence stay behind client boundaries.

## Route and UI Layers

The application uses these route surfaces:

- `/` — deck library.
- `/decks/[deckId]` — deck detail and card management.
- `/study/[deckId]` — study session for a deck.
- `/backup` — export and restore controls.

`AppFrame` provides shared navigation and the responsive application shell. Feature components own local form state, dialogs, study interactions, and browser event handling. Product-facing copy remains in Brazilian Portuguese.

## Domain Model

The domain is intentionally focused on decks and cards:

- `DeckRecord` stores a deck name, description, and timestamps.
- `CardRecord` stores front/back content, its `deckId`, and timestamps.
- `CardSchedule` stores FSRS state for one card, keyed by `cardId`.
- `ReviewLogRecord` stores each rating and the previous schedule snapshot.

Cards belong to exactly one deck. Deleting a card removes its schedule and review history. Deleting a deck removes the deck, its cards, their schedules, and their review history in one transaction.

## Local Persistence

`src/lib/db.ts` defines the Dexie database named `revisa` with these tables:

- `decks` — indexed by `id`, `name`, and `updatedAt`.
- `cards` — indexed by `id`, `deckId`, `createdAt`, and `updatedAt`.
- `schedules` — keyed by `cardId`, indexed by `due` and `state`.
- `reviewLogs` — indexed by `id`, `cardId`, `deckId`, and `reviewedAt`.

Domain mutations should use the exported database functions in `src/lib/db.ts`. Those functions trim and validate user input, generate IDs and timestamps, and use Dexie transactions when multiple tables must change together.

## Study Scheduling

`src/lib/scheduler.ts` adapts the `ts-fsrs` library to the application model. It:

- Converts persisted schedules to and from FSRS cards.
- Previews the next interval for each rating.
- Applies `Again`, `Hard`, `Good`, or `Easy` ratings.
- Returns both the next schedule and an append-only review log.

Study UI code should call the scheduling functions and persist the result through `saveReview`; it should not duplicate FSRS calculations.

## Backup and Restore

Backups use the versioned `BackupEnvelope` type in `src/lib/types.ts`:

- `schemaVersion` is currently `1`.
- The envelope contains decks, cards, schedules, and review logs.
- `parseBackup` validates JSON with Zod before it reaches the database.
- `replaceDatabase` replaces all four tables in a single transaction.

Any future backup schema change must add an explicit migration or version-handling path rather than silently accepting incompatible data.

## WebMCP Integration

`src/lib/webmcp.ts` optionally registers browser tools when `document.modelContext` is available:

- `list_decks` is read-only and reports deck card counts.
- `create_deck` validates input with Zod and delegates to `createDeck`.

WebMCP is an optional integration. The application must continue to work when the host does not expose `modelContext`.

## Security and Trust Boundaries

The primary boundary is between user-controlled browser input and local persistence:

- Validate backup files before replacing local data.
- Validate WebMCP inputs before invoking domain mutations.
- Keep IndexedDB access and browser APIs in client components or client-only modules.
- Do not add secrets, server credentials, or remote persistence without an explicit architectural change.

The current application has no authentication, authorization, server API, cloud sync, or server-side data store.

## Development Conventions

- Use `pnpm` with the pinned package manager version in `package.json`.
- Keep route composition in `src/app/`, reusable UI in `src/components/`, and domain logic in `src/lib/`.
- Preserve the existing Tailwind CSS v4 tokens and accessibility/focus behavior.
- Keep user-facing copy in `pt-BR`; use English for identifiers, tests, comments, and internal errors.
- Consult the installed Next.js guides before changing App Router-sensitive behavior.

## Evolution Rules

Update this document when a change alters:

- Route or client/server boundaries.
- IndexedDB tables, domain invariants, or repository-style mutation functions.
- FSRS scheduling or review-log semantics.
- Backup schema or restore behavior.
- WebMCP tools or their trust boundary.
- The introduction of authentication, server APIs, cloud sync, or remote persistence.
