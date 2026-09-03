# Architectural Decisions & Constraints

## Decision 1: Centralized Firebase Platform & Next.js Architecture
- **Framework**: Next.js App Router configured for Static Export (`output: 'export'`), ensuring 100% compatibility with Firebase Hosting.
- **Hosting & Infrastructure**: Fully centralized on Google Firebase (**Spark Plan - $0.00 Cost**):
  - **Firebase Hosting**: High-speed CDN hosting for the statically exported Next.js client bundle. `firebase.json` configured with SPA rewrites (`"rewrites": [{"source": "**", "destination": "/index.html"}]`) for smooth client-side routing. Zero Cloud Function overhead.
  - **Firebase Authentication**: Email/Password & Google OAuth for user accounts (free unlimited on Spark).
  - **Cloud Firestore**: Background sync for entities, relations, and SRS states (within 50k reads/20k writes daily free tier).
  - **Firebase Storage**: Ingested document blobs (within 5GB total storage / 1GB daily transfer free tier).
- **Styling Engine**: **Tailwind CSS**. Compiles to zero-runtime, atomic static CSS files, ensuring ultra-light bundle sizes, instant page loads, and native dark/light mode switching.
- **Offline & Local-First Engine**: Dexie.js (IndexedDB) for zero-latency local operations and full offline availability. Reads/writes hit Dexie first; background sync handles Firestore.
- **Feature Flags**: Firebase Remote Config + `NEXT_PUBLIC_*` environment variables for dynamic zero-cost feature toggles without code redeployments.

## Decision 2: Data Model & Capacities-Emulated Object Architecture
- **Model Pattern**: Hybrid Typed-Relational Model with Capacities Graph Semantics.
- **Base Entity**: Every entity implements `BaseEntity` (`id`, `type`, `title`, `icon`, `coverImage`, `blocks`), bidirectional relations/backlinks graph engine, tag references, and dynamic `properties: Record<string, any>`.
- **Indexed Relational Links**: Specialized entities (`FileObject`, `Highlight`, `Flashcard`, `StudyGoal`) inherit `BaseEntity` while maintaining explicit indexed foreign keys (`fileId`, `sourceHighlightId`, `targetGoalId`) in Dexie.js and Firestore.

## Decision 3: SRS Core & Goal-Driven Exam Pacing
- **Algorithm**: Modern FSRS (Free Spaced Repetition Scheduler). Superior to SM-2 in stability modeling, retrievability decay, and preventing review backlogs.
- **Dynamic Goal Burndown**:
  - Daily new card quota formula: `DailyNew = ceil(UnlearnedCards / (DaysRemaining - BufferDays))`, with a default pre-exam consolidation buffer (7–14 days).
  - Review load projection based on FSRS stability decay.
- **UI Pacing Visualizer**: Live Exam Dashboard featuring a burndown chart with real-time status indicators (`On Track`, `Behind`, `Ahead`) and pending/overdue counters.

## Decision 4: AI Generation Pipeline & Grounded Relational Linking
- **Architecture**: Client-Orchestrated Hybrid Pipeline with direct client-to-model streaming (BYOK - user API key stored in browser `localStorage`/Dexie).
- **Supported Providers**: Google Gemini 2.0 Flash (free via Google AI Studio) and Groq Llama 3.3 70B (free tier), togglable via Firebase Remote Config / feature flags.
- **Structured Output**: Enforced JSON Schema requiring verbatim `exactQuote`, `front`, `back`, and optional `clozeContent`.
- **Automatic Anchor & Highlight Synthesis**: The client matches `exactQuote` against the active document chunk, calculates exact offsets/page coordinates, generates a `Highlight` entity, and relationally binds the `Flashcard` to the `Highlight`.
- **Staging Drawer**: Interactive review UI allowing users to verify, edit, or reject AI-generated cards against live highlighted source text before committing to the database.

## Decision 5: Reader UI & Non-Mutating Highlighting Engine
- **PDF Rendering**: `pdfjs-dist` / `react-pdf` rendering canvas with a transparent text layer. Highlights rendered as SVG/Canvas overlay bounding boxes calculated from glyph viewport coordinates.
- **Markdown & Web Reader**: Native **CSS Custom Highlight API** (`CSS.highlights.set()`) with W3C Text Quote Selectors (`exact`, `prefix`, `suffix`).
- **DOM Integrity**: Zero DOM mutation—leaves React virtual DOM and text nodes completely untouched, eliminating reconciliation bugs and supporting multi-paragraph selections.
- **Floating Action Toolbar**: Contextual selection menu with color picker, "Generate Flashcard with AI", "Add Note", and "Copy Deep Link".

## Decision 6: 3-Pane Adaptive Workspace & Clean SPA Routing
- **Layout**: 3-Pane workspace mirroring Capacities:
  - Collapsible Left Sidebar (240px): Quick switcher (`Cmd+K`), Daily Notes/Calendar, Object Types list, Tags.
  - Main Workspace (Flex-1): Split View support (e.g. PDF reader on the left, Flashcards/Notes on the right) with Tailwind typography styling.
  - Collapsible Right Inspector (320px): Object Properties, Outgoing Relations, Incoming Backlinks, and interactive 2D Local Graph preview.
- **Client Routing**: Next.js App Router catch-all static route with Firebase rewrite rules for clean SPA URLs (`/objects/:id`, `/files/:id`).
- **State Management**: **Zustand** combined with Dexie `useLiveQuery` for zero-overhead reactive local state.
