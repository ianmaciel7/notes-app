# Architectural Decisions & Constraints

## Decision 1: Centralized Firebase Platform & Next.js Full-Stack Architecture
- **Framework**: Next.js App Router configured for **Full-Stack Hybrid (Server-Side & Client-Side)**:
  - **Server-Side (Node.js runtime / Cloud Run)**: React Server Components (RSC), Route Handlers (`/api/*`), Server Actions, dynamic SSR, and server-side token validation (`firebase-admin`).
  - **Client-Side (`'use client'`)**: Offline-first interactive components, Dexie.js (IndexedDB) local cache, PDF/Markdown reader, and instant UI state.
- **Hosting & Infrastructure**: Google Firebase (**Blaze Plan - Pay-as-you-go**):
  - *Official Firebase Requirement*: According to official Firebase documentation, running full-stack Next.js with server-side features (SSR, Server Components, API routes) requires compute instances (Cloud Run / Cloud Functions), which necessitates the **Blaze Plan** (the Spark free plan is strictly limited to static file hosting without compute or outbound networking).
  - **Firebase App Hosting**: Deployed using Firebase App Hosting (built on Google Cloud Run and Cloud CDN) for native Next.js App Router support, streaming SSR, and zero-config caching. Configured with scale-to-zero (`minInstances: 0`) and strict instance caps to remain well within free tier usage allowances ($0.00 - near zero for MVP).
  - **Firebase Authentication**: Email/Password & Google OAuth for user accounts, with server-side ID token verification via `firebase-admin` in Route Handlers.
  - **Cloud Firestore & Firebase Storage**: Direct client access through Firebase Client SDK guarded by Security Rules, plus administrative operations via `firebase-admin` on the server.
- **Server-Side Compute & Security Capabilities**:
  - **Protected AI Gateway (`/api/ai/generate`)**: Server-side REST proxy for Google Gemini 2.0 Flash / Groq-compatible LLMs. Securely utilizes environment secrets (via Google Cloud Secret Manager / Firebase App Hosting) so production API keys are never exposed to the client.
  - **Server-Side Document Ingestion (`/api/documents/parse`)**: Accepts extracted text, HTML, and base64 PDF/EPUB payloads, then performs server-side extraction/chunking to prevent mobile and low-end client UI freezes.
  - **Authenticated Remote Sync (`/api/sync/push`)**: Verifies Firebase ID tokens with `firebase-admin`, validates sync mutation payloads, obtains a Firestore REST bearer token through Google Application Default Credentials with optional explicit override, and commits mutations server-side under `users/{uid}/spaces/{spaceId}/entities/{entityId}`.
- **Styling Engine**: **Tailwind CSS**. Compiles to zero-runtime, atomic CSS, ensuring ultra-light bundle sizes, instant loads, and native dark/light mode.
- **Offline & Local-First Engine**: Dexie.js (IndexedDB) retained as the single source of truth for reads and writes. Immediate local UI feedback, with background sync to Firestore and server API routes when online.
- **Cost Guardrails**: Cloud Run concurrency (80 requests/container), `maxInstances: 2`, and Google Cloud Budget Alerts at $1.00 thresholds to prevent unexpected charges while leveraging generous Blaze free allowances (2M Cloud Run requests/mo, 50k Firestore reads/day).
- **Firestore Security Rules**: Remote private data lives under `users/{uid}/...`; Firestore rules allow access only when `request.auth.uid == uid` and deny every other path by default.


## Decision 2: Data Model & Capacities-Emulated Object Architecture
- **Model Pattern**: Hybrid Typed-Relational Model with Capacities Graph Semantics.
- **Base Entity**: Every entity implements `BaseEntity` (`id`, `type`, `title`, `icon`, `coverImage`, `blocks`), bidirectional relations/backlinks graph engine, tag references, and dynamic `properties: Record<string, any>`.
- **Indexed Relational Links**: Specialized entities (`FileObject`, `Highlight`, `Flashcard`, `StudyGoal`) inherit `BaseEntity` while maintaining explicit indexed foreign keys (`fileId`, `sourceHighlightId`, `targetGoalId`) in Dexie.js and Firestore.

## Decision 3: SRS Core & Goal-Driven Exam Pacing
- **Algorithm**: Modern FSRS (Free Spaced Repetition Scheduler). Superior to SM-2 in stability modeling, retrievability decay, and preventing review backlogs.
- **Review Persistence**: Flashcard review UI reads real Dexie entities from the active Space and records `Again`, `Hard`, `Good`, `Easy` ratings through `recordFlashcardReview`, keeping Dexie as the single source of truth and marking changed records with pending local sync state.
- **Dynamic Goal Burndown**:
  - Daily new card quota formula: `DailyNew = ceil(UnlearnedCards / (DaysRemaining - BufferDays))`, with a default pre-exam consolidation buffer (7–14 days).
  - Review load projection based on FSRS stability decay.
- **UI Pacing Visualizer**: Live Exam Dashboard featuring a burndown chart with real-time status indicators (`On Track`, `Behind`, `Ahead`) and pending/overdue counters.

## Decision 4: AI Generation Pipeline & Grounded Relational Linking
- **Architecture**: **Dual-Engine AI Pipeline (Server Route Handler + Client BYOK Fallback)**:
  - **Server-Side AI Gateway (`/api/ai/generate`)**: Primary mode utilizing Next.js Route Handlers. Uses server-side API keys injected via Secret Manager / Firebase App Hosting, preventing sensitive credentials from leaking into client browser bundles.
  - **Client-Side BYOK Fallback**: Optional user-supplied API key stored locally in Dexie/localStorage for users who prefer using their personal quotas.
- **Supported Providers**: Google Gemini 2.0 Flash and Groq-compatible chat completions through REST adapters, with responses parsed through a local structured JSON validator before persistence.
- **Structured Output**: Enforced JSON Schema requiring verbatim `exactQuote`, `front`, `back`, and optional `clozeContent`.
- **Automatic Anchor & Highlight Synthesis**: Repository methods match `exactQuote` against the active document chunk, calculate exact offsets and text quote context, generate a `Highlight` entity, and relationally bind the `Flashcard` to the `Highlight`.
- **Provider Response Persistence**: Accepted generated-card responses pass through a local grounding orchestrator that persists only cards whose `exactQuote` can be found verbatim in the source chunk; fabricated quotes are returned as rejected items and are not saved.
- **Staging Drawer**: Interactive review UI allowing users to verify, edit, or reject AI-generated cards against live highlighted source text before committing to the database.

## Decision 5: Reader UI & Non-Mutating Highlighting Engine
- **PDF Rendering**: `pdfjs-dist` / `react-pdf` rendering canvas with a transparent text layer. Highlights rendered as SVG/Canvas overlay bounding boxes calculated from glyph viewport coordinates.
- **Markdown & Web Reader**: Native **CSS Custom Highlight API** (`CSS.highlights.set()`) with W3C Text Quote Selectors (`exact`, `prefix`, `suffix`).
- **DOM Integrity**: Zero DOM mutation—leaves React virtual DOM and text nodes completely untouched, eliminating reconciliation bugs and supporting multi-paragraph selections.
- **Floating Action Toolbar**: Contextual selection menu with color picker, "Generate Flashcard with AI", "Add Note", and "Copy Deep Link".

## Decision 5.1: Backend Document Parser Baseline
- **EPUB Extraction**: Backend parses EPUB ZIP archives with `jszip` and extracts readable text from XHTML/HTML/XML content documents before hashing, chunking, and persistence.
- **PDF Extraction**: Backend supports a baseline PDF text extractor for simple uncompressed text operators (`Tj`/`TJ`). Advanced compressed PDF streams and scanned/OCR workflows are intentionally outside the current non-UI MVP and can be added behind the same adapter contract later.
- **Ingestion Contract**: All document routes ultimately normalize text through the same `prepareTextDocumentForIngestion` path, producing deterministic hashes, file metadata, and grounded chunks.

## Decision 6: 3-Pane Adaptive Workspace & Next.js Dynamic Routing
- **Layout**: 3-Pane workspace mirroring Capacities:
  - Collapsible Left Sidebar (240px): Quick switcher (`Cmd+K`), Daily Notes/Calendar, Object Types list, Tags.
  - Main Workspace (Flex-1): Split View support (e.g. PDF reader on the left, Flashcards/Notes on the right) with Tailwind typography styling.
  - Collapsible Right Inspector (320px): Object Properties, Outgoing Relations, Incoming Backlinks, and interactive 2D Local Graph preview.
- **Full-Stack Routing**: Native Next.js App Router dynamic routes (`/objects/[id]`, `/files/[id]`) with React Server Components providing fast initial server-side hydration and dynamic metadata, while child components leverage `'use client'` for local-first Dexie reactivity.
- **State Management**: **Zustand** combined with Dexie `useLiveQuery` for zero-overhead reactive local state.
