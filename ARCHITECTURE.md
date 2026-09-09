# Architecture

This document describes the high-level architecture for the Notes App: a local-first study and knowledge-management system inspired by Capacities, Readwise Reader, and Anki.

## Product Shape

The application combines four core workflows:

- Object-based knowledge management with typed entities, properties, relations, backlinks, and tags.
- Reader and document ingestion for PDF, EPUB, Markdown, HTML, and extracted text.
- Grounded flashcard generation from exact source quotes.
- FSRS spaced repetition with study-goal pacing.

The product is local-first. The browser's IndexedDB database is the immediate source of truth for user actions, while Firebase provides authenticated cloud sync, media storage, and hosted server route handlers.

## Runtime Architecture

```text
Browser
  React 19 / Next.js App Router UI
  Zustand transient state
  Dexie IndexedDB local data
  Reader, highlights, review UI
        |
        | HTTPS / JSON
        v
Next.js Route Handlers on Firebase App Hosting
  /api/ai/generate
  /api/documents/parse
  /api/sync/push
  /api/storage/upload
        |
        +--> Gemini / Groq AI providers
        +--> Firebase Auth verification
        +--> Firestore REST batchWrite
        +--> Firebase Storage uploads
```

## Client Layer

The client layer is responsible for fast interaction and local persistence.

Primary responsibilities:

- Render the 3-pane workspace shell.
- Manage transient UI state such as panes, drawers, command palette state, and active workspace selection.
- Persist workspace data to Dexie immediately.
- Use reactive local queries for workspace views.
- Render highlights without mutating React-managed text nodes.
- Review flashcards from real Dexie-backed data and persist FSRS review state through repository methods.

Client code must not own server authority. It must not import `firebase-admin`, production AI provider keys, Firestore bearer tokens, or any cloud credentials.

## Data Model

All workspace objects derive from a shared base entity model. Core entity types include:

- `page`
- `file`
- `highlight`
- `flashcard`
- `study_goal`
- `tag`

Important invariants:

- Entities are scoped by `spaceId`.
- Repository writes mark local data as pending sync.
- Identity fields such as `id`, `spaceId`, `objectTypeId`, and `createdAt` are immutable through generic updates.
- Flashcards generated from source material must be grounded through a `Highlight`.
- Cross-space graph edges are excluded from derived backlinks and local graph output.

## Local Database

Dexie stores local workspace data in IndexedDB.

Primary tables:

- `spaces`
- `appSettings`
- `objectTypes`
- `entities`
- `collections`
- `tags`
- `relations`
- `media`
- `spaceSettings`
- `trash`
- `syncMutations`

The local database is optimized for immediate user feedback and offline behavior. Every meaningful user write happens locally first, then a pending sync mutation is queued for remote persistence.

## Repository Layer

Repository methods are the canonical write path for workspace behavior.

They are responsible for:

- Creating, updating, and deleting entities.
- Preserving immutable identity fields.
- Creating highlights with quote anchor metadata.
- Creating flashcards with valid source provenance.
- Persisting document text as file entities.
- Applying FSRS review updates.
- Maintaining relation cleanup on delete.
- Enqueuing sync mutations.

UI components should call repository APIs instead of mutating Dexie tables directly for domain behavior.

## Document Ingestion

Document ingestion supports text, HTML, PDF, and EPUB payloads through `/api/documents/parse`.

The ingestion flow:

1. Accept extracted text, HTML, or base64 binary document payload.
2. Infer document type from filename and MIME type.
3. Extract readable text for supported formats.
4. Normalize text and compute metadata such as hash, byte size, and chunks.
5. Return prepared data for local repository persistence.

Current PDF extraction is a backend baseline for simple uncompressed text operators. It is not OCR and should not be represented as advanced PDF extraction without adding a dedicated adapter and tests.

## Highlighting

Reader highlights must be non-mutating.

For web text and Markdown, use the CSS Custom Highlight API with W3C Text Quote Selector-style anchoring. Do not rewrite DOM text nodes.

For PDF rendering, use positioned overlays over the text layer or canvas surface. Highlight geometry must not depend on editing PDF text content.

## AI Generation

AI-assisted card generation runs through `/api/ai/generate`.

The server route:

- Accepts a provider and source text.
- Builds a structured card-generation prompt.
- Calls Gemini or Groq using server-side credentials.
- Parses the provider response as structured JSON.
- Returns candidate cards for grounding and review.

Persistence must happen only after grounding:

1. The generated `exactQuote` must match the source text verbatim.
2. A `Highlight` is synthesized from the quote location.
3. A linked `Flashcard` is created with `sourceHighlightId`.
4. Cards whose quotes cannot be found are rejected.

The AI model does not have authority to mutate workspace data, execute tools, access secrets, or bypass user review.

## Spaced Repetition

The SRS engine implements an FSRS-style scheduler with four review ratings:

- `Again`
- `Hard`
- `Good`
- `Easy`

Study goals calculate pacing from exam target dates, remaining unlearned cards, buffer days, expected reviews, and daily new-card quotas.

Flashcard review UI must consume real workspace flashcards and persist review outcomes through repository methods.

## Remote Sync

Remote sync is queued from local writes and pushed through `/api/sync/push`.

The sync route:

- Requires a Firebase ID token.
- Verifies the token server-side.
- Validates sync mutation payloads.
- Writes to Firestore through REST `batchWrite`.
- Scopes writes under `users/{uid}/spaces/{spaceId}/entities/{entityId}`.

Firestore rules must stay aligned with this user-scoped path model and deny all unrelated paths by default.

Conflict resolution currently follows last-write-wins semantics based on entity timestamps.

## Media Storage

Document media uploads use `/api/storage/upload`.

The storage route:

- Requires server-verified Firebase authentication.
- Accepts supported reader document MIME types.
- Parses base64 content.
- Sanitizes file names.
- Stores objects under `users/{uid}/spaces/{spaceId}/media/{blobId}-{fileName}`.

Storage paths must derive the user namespace from the verified token, not from caller-supplied identity fields.

## Firebase Deployment

The cloud backend is designed for Firebase App Hosting on the Blaze plan with scale-to-zero behavior.

Configuration files:

- `apphosting.yaml` defines runtime resources and secret-backed environment variables.
- `firebase.json` points Firebase to hosting and Firestore configuration.
- `firestore.rules` enforces user-scoped access.

Runtime secrets should be provided through Firebase App Hosting secrets, Google Cloud Secret Manager, Application Default Credentials, or local environment files excluded from version control.

## UI Architecture

The app follows a 3-pane workspace model:

- Left sidebar for navigation, command palette, object directories, and tags.
- Center workspace for readers, editors, split view, flashcard review, and staging flows.
- Right inspector for properties, relations, backlinks, and local graph context.

Capacities-like UI behavior should maintain parity evidence in `CAPACITIES_COMPONENT_MAP.md` whenever comparable components are added or changed.

## Security Boundaries

The main security boundaries are:

- Browser to server route handlers.
- Local Dexie data to remote Firestore sync.
- Firebase ID token to server authority.
- User documents to parser and AI prompt context.
- Server runtime to third-party AI providers.
- Firestore and Storage user namespace isolation.
- Dependency and plugin supply chain.

See `SECURITY.md` for the authoritative threat model, secure coding rules, and AI-agent constraints.

## Development Conventions

- Use `pnpm` exclusively.
- Use Biome for linting and formatting.
- Use Tailwind CSS v4 CSS-first configuration.
- Keep Next.js client boundaries lean.
- Read relevant Next.js docs from `node_modules/next/dist/docs/` before changing framework-sensitive code.
- Prefer existing repository APIs and domain patterns over new abstractions.
- Keep security, sync, auth, parser, and AI-grounding changes covered by focused tests or explicit review.

## Evolution Rules

Update this document when changes alter:

- Major runtime boundaries.
- Data persistence or repository contracts.
- Remote sync paths or conflict handling.
- Firebase rules or deployment architecture.
- AI provider behavior or grounding guarantees.
- Document parsing capabilities.
- Workspace layout or core navigation model.
- Security-sensitive trust boundaries.
