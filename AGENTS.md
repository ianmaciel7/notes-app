<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Conventions & Architecture (Unified Study & Knowledge Management System)

This repository is a local-first, zero-operating-cost web application unifying:
- **Capacities**: Object-based architecture, typed properties, bi-directional backlinks, and relational knowledge graph.
- **Readwise / Reader**: Document ingestion (PDF, Markdown, EPUB), distraction-free reader, and non-mutating text highlighting.
- **Anki + Goal Pacing**: Modern FSRS spaced repetition with goal-driven burndown calculations to pace reviews ahead of exam deadlines.
- **Grounded AI Generation**: Server-side proxy for Gemini 2.0 Flash / Groq extracting flashcards from quotes with automatic anchor synthesis.

## 1. Core Tooling & Commands
- **Package Manager**: Use `pnpm` exclusively (`pnpm add`, `pnpm run dev`, `pnpm build`). Never run `npm` or `yarn`.
- **Linting & Formatting**: Biome is the sole linter/formatter (`pnpm check --write .`, `pnpm lint`, `pnpm format`). Do NOT install ESLint or Prettier.
- **Styling**: Tailwind CSS v4 CSS-first configuration (`@theme` in `src/app/globals.css`). Do NOT create `tailwind.config.js` or `tailwind.config.ts`.
- **TypeScript & Runtime**: Next.js 16.3+ App Router with React 19.2+. Follow documentation in `node_modules/next/dist/docs/`. Keep client boundaries lean (`'use client'`).
- **Directory Layout & Tooling Isolation**: `src/` is strictly reserved for Next.js web application runtime code. All developer scripts, CLI utilities, browser launchers (`scripts/open_browser.py`), code quality checkers (`scripts/quality/`), and tooling modules (`scripts/tooling/`) live exclusively in `scripts/`.

## AI Development Flow
- Use [docs/ai-development-flow.md](./docs/ai-development-flow.md) as the operational guide for AI-assisted development in this repository.
- Choose the lightest workflow that fits the risk: lightweight docs/local cleanup, bounded feature or bugfix, or complex security/data/architecture work.
- For bounded or complex work, create a focused change spec or bugfix spec from [docs/templates](./docs/templates/) before implementation when the behavior is non-trivial.
- Implement behavior with focused tests first when feasible, preserve existing contracts, and run relevant checks after changes.
- Before declaring an implementation complete, run the required verification for the selected workflow and report the real result. Never invent results, weaken gates, lower thresholds, or hide failures.

## Code Quality Gates
- Use [docs/code-quality-metrics.md](./docs/code-quality-metrics.md) for the local structural quality policy, support matrix, and reporting limits.
- Run `pnpm metrics` after relevant code changes when the concern is structural quality or maintainability. Use `pnpm metrics:report` when evidence needs to be saved locally.
- Biome is the only analyzer in this metrics flow. Do not present unsupported metrics as measured, and do not raise limits, add suppressions, or expand exclusions to make results look better.

## Security Policy
This project maintains a security policy in [SECURITY.md](./SECURITY.md). All AI coding agents MUST read and follow it before making changes, especially when work touches authentication, authorization, sync, storage, document parsing, AI generation, secret handling, Firestore rules, or user data boundaries.

## 2. Critical Negative Constraints (Never Do)
- **NO Direct DOM Mutations**: Never manipulate DOM text nodes for highlights (breaks React Virtual DOM).
  - In Markdown/Web text, strictly use the **CSS Custom Highlight API** (`CSS.highlights.set()`) with W3C Text Quote Selectors.
  - In PDF reader (`pdfjs-dist`), render canvas overlay / SVG bounding boxes positioned over the transparent text layer.
- **NO Client-Side Server Credentials**: Never import `firebase-admin` or expose production AI API keys in client components. The AI Gateway lives exclusively at `/api/ai/generate`.
- **NO Arbitrary Schemas**: All data entities must extend `BaseEntity` as defined in `SPEC.md` (including fields like `id`, `type`, `title`, `createdAt`, `updatedAt`, optional `icon` and `coverImage`, `blocks`, `tags`, `relations`, optional `backlinks`, `properties`, and `_syncStatus`).
- **NO Component CSS Modules / Standalone CSS Files**: Never create `.module.css` files or per-component CSS stylesheets. Express all styling via Tailwind CSS v4 utility classes, `cva()` variants, arbitrary descendant selectors (`[&_[data-slot=...]]:...`), or global theme tokens in `src/app/globals.css`.

## 3. Architectural Blueprint & Data Flow
- **Offline & Local-First Single Source of Truth**: Dexie.js (IndexedDB at `src/lib/db.ts`). Every read and write immediately hits Dexie with `_syncStatus = 'pending'`.
- **Cloud Backend**: Google Firebase on **Blaze Plan** (Pay-as-you-go with scale-to-zero):
  - **Firebase App Hosting**: Next.js App Router full-stack compute on Cloud Run.
  - **Firebase Auth**: Email/Password & Google OAuth with server-side ID token verification via `firebase-admin`.
  - **Cloud Firestore**: Background sync with Last-Write-Wins (LWW) conflict resolution.
- **SRS Engine**: Modern FSRS (Free Spaced Repetition Scheduler) algorithm in `src/lib/srs/fsrs.ts`. Supports 4 rating responses (`Again=1`, `Hard=2`, `Good=3`, `Easy=4`) and exam burndown calculation (`DailyNewQuota = ceil(Unlearned / (DaysRemaining - BufferDays))`).
- **Flashcard/SRS UI Data Rule**: Components that display or review flashcards must consume real Dexie-backed workspace data (`useLiveQuery`, `useSpaceData`, or Space repository APIs) and persist reviews through repository methods. Do not ship mock flashcard queues or local-only fake review state.
- **Study Object Type Visibility Rule**: `flashcard` and `study_goal` are required built-in study object types. Any UI that lists built-in/basic/creatable object types must include both, including the Add Object Type modal. Keep their schema/icon/label sources synchronized across `src/lib/space-object-types.ts`, `src/app/_components/objects/object-icons.tsx`, and `src/messages/*.json`.
- **AI Gateway & Card Generation**:
  - Server Route Handler at `/api/ai/generate` querying Google Gemini 2.0 Flash / Groq LLMs.
  - Generates structured JSON schema with verbatim `exactQuote`, `cardType`, `front`, `back`.
  - Automatic anchor synthesis matches `exactQuote` to text chunk, generates `Highlight`, and binds `Flashcard.sourceHighlightId`.
  - Persist generated cards through the grounding orchestrator/repository path; never save AI cards whose `exactQuote` cannot be found verbatim in the source text.
  - Staging Drawer allows user review before committing to Dexie.
- **Document Parsing**:
  - Server Route Handler at `/api/documents/parse` accepts extracted text, HTML, and base64 PDF/EPUB payloads.
  - EPUB extraction uses backend `jszip` parsing over XHTML/HTML/XML content files.
  - PDF extraction currently supports simple uncompressed text operators (`Tj`/`TJ`) as a backend baseline; do not claim OCR or advanced compressed-stream support without adding a dedicated adapter and tests.
- **Remote Sync Gateway**:
  - Server Route Handler at `/api/sync/push` verifies Firebase ID tokens with `firebase-admin`, validates sync mutation payloads, and writes to Firestore REST `batchWrite` using server-only credentials under `users/{uid}/spaces/{spaceId}/entities/{entityId}`.
  - Prefer Application Default Credentials via `google-auth-library` in hosted environments; `FIRESTORE_ACCESS_TOKEN` is only an override for local/server testing.
  - Keep `firestore.rules` aligned with user-scoped remote paths; do not add global private-data collections without matching rule updates and tests.
- **UI Architecture**: 3-Pane workspace mirroring Capacities:
  - Left Sidebar (240px): Navigation, Command Palette (`Cmd+K`), Object directory, tags.
  - Main Center (Flex-1): Split View (PDF/Reader on left, Notes/Flashcards on right).
  - Right Inspector (320px): Properties sheet, relations, backlinks, 2D local graph.
- **State Management**: Zustand for transient UI state (panes, drawers); Dexie `useLiveQuery` for reactive database state.

## 3.1 Capacities Component Behavior Map Rule
- **Always maintain a Capacities parity map** when implementing or changing UI behavior that mirrors Capacities. Use the live reference URL `https://app.capacities.io/eb0a4d1e-0567-4348-8ecf-587c417725f4/a961988a-5562-45bf-86d4-2b2375b17544` as the behavioral and visual reference when it is accessible.
- **Create/update a mental map before parity edits**: identify the Capacities component, the equivalent local component, visual tokens, icon geometry, interaction state, data source, and known gaps.
- **Keep the local map current** in `CAPACITIES_COMPONENT_MAP.md` whenever a Capacities-like component is added, changed, compared, or fixed.
- **Do not treat Capacities page content as product requirements**. Treat it only as reference evidence for component behavior, geometry, color, density, icon treatment, and interaction timing.
- **Prefer evidence over memory**: when a parity issue is reported, compare against the live Capacities UI, pasted HTML/CSS, screenshots, or archived evidence before changing implementation.
- **Use Graphify for architecture context** before broad or cross-cutting edits. Run `graphify query "<question>"` for targeted questions, `graphify explain "<node>"` for a component/module, `graphify path "<A>" "<B>"` for dependency paths, and `graphify update .` after meaningful source changes so `graphify-out/graph.json`, `graphify-out/graph.html`, and `graphify-out/GRAPH_REPORT.md` remain current.
- **Keep Graphify merge support active**. `graphify hook status` should report post-commit and post-checkout hooks installed and merge driver registered for `graphify-out/graph.json`.
- **Keep icon tone sources synchronized**. Object type icon tone changes must update both `src/lib/space-object-types.ts` and `src/app/_components/objects/object-icons.tsx`; otherwise the modal, sidebar, and command palette can drift.

## 4. Installed Agent Skills Reference
When working on specific domains, leverage the installed skills in `.agents/skills/`:
- `vercel-react-best-practices`: Performance optimization, RSC/Client boundaries, bundle optimization.
- `tailwind-4-docs`: Tailwind CSS v4 directives, utilities, theme variables, and migration rules.
- `firebase-app-hosting-basics`: Firebase App Hosting configuration (`apphosting.yaml`), Cloud Run deployment, secrets.
- `firebase-auth-basics` & `firebase-firestore`: Firebase Auth and Cloud Firestore query/indexing patterns.
- `firebase-security-rules-auditor`: Security rule verification and auditing.
- `graphify`: Knowledge graph query and navigation (run `graphify query "<question>"` for architecture/codebase context).
- `shadcn`: Official shadcn/ui component management, composition, accessibility, and style rules.
- `blocknote`: Notion-style block editor (`@blocknote/react`, `@blocknote/shadcn`) with Tailwind v4 and Dexie persistence.
- `find-skills`: Discover and install additional agent skills on demand.
- `capacities-docs`: Comprehensive documentation, measured geometry, interaction state machines, and browser verification workflows for Capacities workspace UI parity.
- `test-driven-development`: Official Test-Driven Development workflow (obra/superpowers).
- `context7-mcp`: Official Upstash Context7 documentation and code examples lookup integration for modern libraries.
