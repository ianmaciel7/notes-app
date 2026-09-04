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

## 2. Critical Negative Constraints (Never Do)
- **NO Direct DOM Mutations**: Never manipulate DOM text nodes for highlights (breaks React Virtual DOM).
  - In Markdown/Web text, strictly use the **CSS Custom Highlight API** (`CSS.highlights.set()`) with W3C Text Quote Selectors.
  - In PDF reader (`pdfjs-dist`), render canvas overlay / SVG bounding boxes positioned over the transparent text layer.
- **NO Client-Side Server Credentials**: Never import `firebase-admin` or expose production AI API keys in client components. The AI Gateway lives exclusively at `/api/ai/generate`.
- **NO Arbitrary Schemas**: All data entities must extend `BaseEntity` (`id`, `type`, `title`, `blocks`, `tags`, `relations`, `properties`) defined in `SPEC.md`. Local database name is `KnowledgeOS_DB`.
- **NO Component CSS Modules / Standalone CSS Files**: Never create `.module.css` files or per-component CSS stylesheets. Express all styling via Tailwind CSS v4 utility classes, `cva()` variants, arbitrary descendant selectors (`[&_[data-slot=...]]:...`), or global theme tokens in `src/app/globals.css`.

## 3. Architectural Blueprint & Data Flow
- **Offline & Local-First Single Source of Truth**: Dexie.js (IndexedDB at `src/lib/db.ts`). Every read and write immediately hits Dexie with `_syncStatus = 'pending'`.
- **Cloud Backend**: Google Firebase on **Blaze Plan** (Pay-as-you-go with scale-to-zero):
  - **Firebase App Hosting**: Next.js App Router full-stack compute on Cloud Run.
  - **Firebase Auth**: Email/Password & Google OAuth with server-side ID token verification via `firebase-admin`.
  - **Cloud Firestore**: Background sync with Last-Write-Wins (LWW) conflict resolution.
- **SRS Engine**: Modern FSRS (Free Spaced Repetition Scheduler) algorithm in `src/lib/srs/fsrs.ts`. Supports 4 rating responses (`Again=1`, `Hard=2`, `Good=3`, `Easy=4`) and exam burndown calculation (`DailyNewQuota = ceil(Unlearned / (DaysRemaining - BufferDays))`).
- **AI Gateway & Card Generation**:
  - Server Route Handler at `/api/ai/generate` querying Google Gemini 2.0 Flash / Groq LLMs.
  - Generates structured JSON schema with verbatim `exactQuote`, `cardType`, `front`, `back`.
  - Automatic anchor synthesis matches `exactQuote` to text chunk, generates `Highlight`, and binds `Flashcard.sourceHighlightId`.
  - Staging Drawer allows user review before committing to Dexie.
- **UI Architecture**: 3-Pane workspace mirroring Capacities:
  - Left Sidebar (240px): Navigation, Command Palette (`Cmd+K`), Object directory, tags.
  - Main Center (Flex-1): Split View (PDF/Reader on left, Notes/Flashcards on right).
  - Right Inspector (320px): Properties sheet, relations, backlinks, 2D local graph.
- **State Management**: Zustand for transient UI state (panes, drawers); Dexie `useLiveQuery` for reactive database state.

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

