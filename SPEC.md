# Application Specification: Unified Study & Knowledge Management System

## 1. Executive Summary
A local-first, zero-operating-cost web application unifying the core superpowers of:
- **Capacities**: Object-based architecture, typed properties, bi-directional backlinks, and relational knowledge graph.
- **Readwise / Reader**: Document ingestion (PDF, Markdown, EPUB), distraction-free reader view, and non-mutating text highlighting.
- **Anki + Goal Pacing**: Modern FSRS spaced repetition with goal-driven burndown calculations to pace reviews ahead of exam deadlines.
- **Grounded AI Generation**: Client-orchestrated flashcard extraction from text chunks, automatically synthesizing `Highlight` entities and linking cards to source quotes.

---

## 2. Infrastructure & Cost Model (Firebase Blaze Plan - Pay-as-you-go)
- **Hosting & Compute**: **Firebase App Hosting** (running on Google Cloud Run + Cloud CDN for Full-Stack Next.js App Router with Server-Side Rendering, Server Components, and Route Handlers).
- **App Hosting Config**: Implemented `apphosting.yaml` using the resource profile previously present in old branches (`cpu: 1`, `memoryMiB: 512`, `minInstances: 0`, `maxInstances: 2`, `concurrency: 80`) plus runtime env/secrets for Firestore database id, Firebase Storage bucket, and AI provider keys.
- **Billing Plan**: **Firebase Blaze Plan (Pay-as-you-go)**:
  - *Official Firebase Requirement*: As documented by Firebase, server-side compute instances (Cloud Run / Cloud Functions / App Hosting) and Secret Manager require the Blaze Plan.
  - *Cost Control*: The Blaze plan retains substantial free-tier allowances (2M Cloud Run requests/mo, 180k vCPU-sec, 360k GiB-sec, 50k Firestore reads / 20k writes daily, 5GB Cloud Storage, 50k MAU Firebase Auth). With scale-to-zero (`minInstances: 0`) and Cloud Budget alert limits, operating cost stays virtually $0.00 at MVP scale.
- **Backend Services & Server Runtime**:
  - **Auth**: Firebase Auth (Email/Password, Google OAuth) with server-side token verification boundary and Firebase Admin-compatible ID token adapter implemented.
  - **Database**: Cloud Firestore (Metadata & synchronization, staying within free quotas).
  - **Storage**: Firebase Cloud Storage (PDF/EPUB blobs, staying within free quotas).
  - **Server Endpoints**: Next.js Route Handlers (`/api/ai/generate` for secure AI proxy, `/api/documents/parse` for server-side document parsing, `/api/sync/push` for authenticated remote Firestore sync, `/api/storage/upload` for authenticated PDF/EPUB blob storage).
  - **Secret Management**: Google Cloud Secret Manager / Firebase App Hosting environment secrets for AI API keys; Firestore remote sync uses Application Default Credentials via `google-auth-library` with optional explicit `FIRESTORE_ACCESS_TOKEN` override for local/server testing.
  - **Remote Data Scope**: Authenticated Firestore entity sync is namespaced under `users/{uid}/spaces/{spaceId}/entities/{entityId}` and Storage uploads are namespaced under `users/{uid}/spaces/{spaceId}/media/{blobId}` so one user's private objects and blobs are not written into a global shared Space collection.
  - **Firestore Rules**: Implemented `firestore.rules` allowing reads/writes only when `request.auth.uid` matches the top-level `users/{uid}` namespace and denying all other document paths by default.
- **Client Runtime**:
  - Browser IndexedDB via **Dexie.js** as the local-first source of truth for zero-latency reads and writes.
  - **Zustand** for transient UI state (split panes, active drawer, search queries).
  - **Tailwind CSS** + `@tailwindcss/typography` for zero-runtime styling.

---

## 3. Data Architecture & Complete Schema (`types/schema.ts`)

### 3.1 Base Entity Interface
All objects in the system implement `BaseEntity`:

```typescript
export type SystemEntityType =
  | 'page'
  | 'file'
  | 'highlight'
  | 'flashcard'
  | 'study_goal'
  | 'tag'
  | (string & {});

export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bullet_list' | 'numbered_list' | 'code' | 'callout' | 'quote' | 'divider';
  content: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    color?: string;
  };
  metadata?: Record<string, any>;
}

export interface EntityRelation {
  propertyId: string;
  propertyName: string;
  targetEntityId: string;
  targetEntityType: string;
  createdAt: string;
}

export interface EntityBacklink {
  sourceEntityId: string;
  sourceEntityType: string;
  sourceTitle: string;
  propertyId?: string;
  propertyName?: string;
}

export interface BaseEntity {
  id: string;
  type: SystemEntityType;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  coverImage?: string;
  blocks: ContentBlock[];
  tags: string[];
  relations: EntityRelation[];
  backlinks?: EntityBacklink[];
  properties: Record<string, any>;
  _syncStatus?: 'synced' | 'pending' | 'conflict';
}
```

### 3.1.1 Local Repository Write Contract
- Dexie-backed repository methods are the canonical write path for backend/local-first behavior.
- `createEntity(spaceId, objectTypeId, title)` creates normal object entities and materializes special backend defaults for system study types:
  - `flashcard`: initializes `cardType`, `front`, `back`, provenance placeholders, `aiGenerated = false`, and initial `srs`.
  - `study_goal`: initializes `targetExamDate`, `targetRetentionRate`, `totalCards`, `dailyNewCardsQuota`, `expectedDailyReviews`, and `targetFileIds`.
- `updateEntity(spaceId, entityId, update)` persists editable entity fields, refreshes `updatedAt`, and marks `_syncStatus = 'pending'`.
- Identity fields are immutable through generic updates: `id`, `spaceId`, `objectTypeId`, and `createdAt` cannot be rewritten by `updateEntity`.
- `deleteEntity(spaceId, entityId)` removes the entity, removes same-Space relations where it is the source or target, and enqueues a `delete` sync mutation with the deleted entity snapshot.
- `createHighlightEntity(spaceId, input)` creates backend/local-first `Highlight` records with `fileId`, `exactText`, optional quote context (`prefix`, `suffix`), color, location metadata, and `cardCount = 0`.
- `createFlashcardEntity(spaceId, input)` requires a source `Highlight` in the same Space for non-manual provenance and increments that highlight's `cardCount` when a card is created.
- `createGroundedFlashcardFromQuote(spaceId, input)` validates that `exactQuote` exists verbatim inside the provided source text, synthesizes `startOffset`, `endOffset`, `prefix`, and `suffix`, creates the source `Highlight`, creates the linked `Flashcard`, and returns both records with `cardCount` synchronized.
- `createTextFileEntity(spaceId, objectTypeId, input)` persists extracted document text as a backend/local-first `File` entity with inferred file type, SHA-256 `fileHash`, `sizeBytes`, `extractedText`, `parsingStatus = 'completed'`, and a sync mutation.
- `buildEntityBacklinks(...)` and `buildLocalEntityGraph(...)` provide backend/local derived knowledge graph data from stored entities and same-Space relations. UI presentation remains deferred.
- Current implementation focus is backend/local persistence. Dedicated UI editors for `front/back`, goal date, retention target, and pacing settings are deferred.

### 3.2 Specific Typed Entities

```typescript
export interface FileObject extends BaseEntity {
  type: 'file';
  fileType: 'pdf' | 'epub' | 'markdown' | 'web_article';
  originalName: string;
  sourceUrl?: string;
  localBlobKey?: string;
  sizeBytes: number;
  fileHash: string;
  extractedText?: string;
  parsingStatus: 'pending' | 'processing' | 'completed' | 'error';
  pageCount?: number;
}

export interface Highlight extends BaseEntity {
  type: 'highlight';
  fileId: string; // Foreign key to FileObject
  exactText: string;
  prefix?: string;
  suffix?: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple';
  location: {
    pageNumber?: number;
    startOffset?: number;
    endOffset?: number;
    cfi?: string;
    domSelector?: string;
  };
  userNote?: string;
  cardCount?: number;
}

export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export interface SRSState {
  state: CardState;
  dueDate: string; // ISO 8601
  lastReviewedAt?: string;
  interval: number; // in days
  easeFactor: number;
  repetitionCount: number;
  lapses: number;
  stability?: number; // FSRS S
  difficulty?: number; // FSRS D
}

export interface Flashcard extends BaseEntity {
  type: 'flashcard';
  cardType: 'basic' | 'cloze' | 'reversed';
  fileId: string;
  sourceHighlightId: string; // Direct provenance link
  sourceQuoteSnippet: string;
  targetGoalId?: string;
  front: string;
  back: string;
  clozeContent?: string;
  srs: SRSState;
  aiGenerated: boolean;
  aiPromptContext?: string;
}

export interface StudyGoal extends BaseEntity {
  type: 'study_goal';
  targetExamDate: string; // ISO 8601
  targetRetentionRate: number; // e.g. 0.90
  totalCards: number;
  dailyNewCardsQuota: number;
  expectedDailyReviews: number;
  targetFileIds: string[];
}

export interface TagEntity extends BaseEntity {
  type: 'tag';
  color?: string;
  description?: string;
  usageCount: number;
}
```

### 3.3 Dexie.js Schema Configuration (`lib/db.ts`)
```typescript
import Dexie, { Table } from 'dexie';

export class AppDatabase extends Dexie {
  entities!: Table<BaseEntity, string>;
  files!: Table<FileObject, string>;
  highlights!: Table<Highlight, string>;
  flashcards!: Table<Flashcard, string>;
  studyGoals!: Table<StudyGoal, string>;
  syncMutations!: Table<SyncMutation, string>;

  constructor() {
    super('KnowledgeOS_DB');
    this.version(1).stores({
      entities: 'id, type, title, createdAt, updatedAt, *tags',
      files: 'id, fileType, fileHash, parsingStatus, createdAt',
      highlights: 'id, fileId, color, createdAt',
      flashcards: 'id, fileId, sourceHighlightId, targetGoalId, srs.state, srs.dueDate, createdAt',
      studyGoals: 'id, targetExamDate, createdAt',
      syncMutations: 'id, status, [status+updatedAt], spaceId, entityId, entityType, operation, updatedAt',
    });
  }
}

export const db = new AppDatabase();
```

---

## 4. FSRS & Dynamic Goal Pacing Engine (`lib/srs/fsrs.ts`)

### 4.1 FSRS Mathematical Principles
- **Retrievability $R(t)$**:
  $$R(t) = \left(1 + \text{FACTOR} \cdot \frac{t}{S}\right)^{\text{DECAY}}$$
  where $\text{FACTOR} = \frac{19}{81}$, $\text{DECAY} = -0.5$, $t$ is days elapsed, and $S$ is memory stability.
- **Interval Calculation**:
  $$\text{Interval} = \frac{S}{\text{FACTOR}} \cdot \left(R_{\text{target}}^{1/\text{DECAY}} - 1\right)$$
- **Four Rating Options**:
  - `Again` (1): Complete lapse ($R < 0.2$). Stability resets, lapse counter increments.
  - `Hard` (2): Successful recall with difficulty. Low stability multiplier ($1.2\times$).
  - `Good` (3): Normal recall. Standard stability update.
  - `Easy` (4): Effortless recall. High stability bonus ($1.8\times$).

### 4.2 Dynamic Goal Burndown Formula
Given an exam target date $T_{\text{exam}}$:
1. **Days Remaining**:
   $$D_{\text{remaining}} = \max\left(1, \left\lfloor \frac{T_{\text{exam}} - \text{now}}{86400000} \right\rfloor\right)$$
2. **Buffer Days ($D_{\text{buffer}}$)**: Defaults to 7 days (or 20% of $D_{\text{remaining}}$ if under 30 days) reserved strictly for deck-wide consolidation before the exam.
3. **Daily New Card Quota**:
   $$\text{DailyNewQuota} = \left\lceil \frac{N_{\text{unlearned}}}{\max(1, D_{\text{remaining}} - D_{\text{buffer}})} \right\rceil$$
4. **Pacing Status Indicators**:
   - $\text{ExpectedCompleted} = \text{TotalCards} \cdot \left(\frac{D_{\text{elapsed}}}{D_{\text{total}}}\right)$
   - If $\text{ActualCompleted} \ge \text{ExpectedCompleted} \cdot 1.05 \implies$ **Ahead 🚀**
   - If $\text{ActualCompleted} \ge \text{ExpectedCompleted} \cdot 0.95 \implies$ **On Track ✅**
   - If $\text{ActualCompleted} < \text{ExpectedCompleted} \cdot 0.95 \implies$ **Behind ⚠️**

---

## 5. Reader UI & Highlighting Engine (`components/reader/`)

### 5.1 PDF Rendering
- Utilizes `pdfjs-dist` inside a Web Worker.
- Renders page canvas at physical device pixel ratio (`window.devicePixelRatio`).
- Transparent DOM text layer overlay aligned via standard CSS transform scale.
- Selection listener (`selectionchange`) reads coordinates and transforms them via `viewport.convertToViewportRectangle` to generate non-mutating SVG highlight overlays.

### 5.2 Markdown & Web Articles
- Rendered using `@tailwindcss/typography` (`prose prose-neutral dark:prose-invert`).
- Implements the **CSS Custom Highlight API**:
  ```typescript
  const highlightRange = new Range();
  highlightRange.setStart(startNode, startOffset);
  highlightRange.setEnd(endNode, endOffset);
  const customHighlight = new Highlight(highlightRange);
  CSS.highlights.set(`hl-${highlightId}`, customHighlight);
  ```
- No DOM mutation; zero conflict with React virtual DOM diffing.

### 5.3 Selection Context Toolbar
Floating bar anchored above text selection providing:
1. **Color Chips**: Yellow (`#FEF08A`), Blue (`#BAE6FD`), Green (`#BBF7D0`), Pink (`#FBCFE8`).
2. **"Generate Cards" Button**: Opens the AI Staging Drawer pre-loaded with the selected text.
3. **"Add Note"**: Attaches user annotation directly to the quote.

---

## 6. AI Card Generation Engine (`lib/ai/generator.ts`)

### 6.1 Dual-Engine Generation Architecture (Server Route Handler + Client BYOK)
1. **Server-Side Gateway (`/api/ai/generate`)**:
   - Implemented Next.js Route Handler running on the server runtime.
   - Credentials securely stored as environment secrets (Google Cloud Secret Manager / Firebase App Hosting).
   - Document text chunk is sent via POST request to `/api/ai/generate`.
   - Implemented REST adapters for Google Gemini 2.0 Flash and Groq-compatible chat completions; server responses are parsed through the structured generated-card validator before returning cards.
2. **Client-Side BYOK Fallback**:
   - Implemented local IndexedDB settings store for personal Google Gemini or Groq API keys and preferred provider selection.
   - If configured, queries Google Gemini 2.0 Flash or Groq Llama 3.3 directly from the browser.
   - Remaining UI work: expose secure input controls for editing these settings.

### 6.2 Structured Output Schema
```json
{
  "type": "object",
  "properties": {
    "cards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "exactQuote": { "type": "string", "description": "Verbatim quote copied directly from the text chunk" },
          "cardType": { "type": "string", "enum": ["basic", "cloze"] },
          "front": { "type": "string", "description": "Concise testable prompt or question" },
          "back": { "type": "string", "description": "Direct, clear answer" },
          "clozeContent": { "type": "string", "description": "Cloze format text using {{c1::hidden}}" }
        },
        "required": ["exactQuote", "cardType", "front", "back"]
      }
    }
  },
  "required": ["cards"]
}
```

The local structured output parser is implemented in `lib/ai/card-generation.ts` and accepts either parsed objects or JSON strings. It validates `cards`, required `exactQuote`, `cardType`, `front`, and `back` fields, rejects unsupported provider card types, trims user-visible card text, and drops provider noise fields before repository persistence.

### 6.3 Automatic Anchor Synthesis
1. Client or local orchestration searches chunk text for `exactQuote`.
2. Repository calculates `startOffset`, `endOffset`, and contextual `prefix`/`suffix`.
3. Repository creates a `Highlight` entity in Dexie.js.
4. Repository generates a `Flashcard` entity with `sourceHighlightId = highlight.id` and initial FSRS state (`state = 'new'`).
5. Generated-card provider responses are persisted through the grounding orchestrator only when `exactQuote` matches the source text. Staging Drawer presentation remains deferred UI work.

### 6.4 Text Chunking Contract
- Implemented backend chunking helper splits extracted source text into bounded chunks for provider prompts.
- Chunks carry stable `id`, `text`, `startOffset`, and `endOffset` metadata so accepted cards can be grounded back to the original document text.
- Overlap is supported for continuity and adjusted to avoid starting chunks in the middle of a word.

### 6.5 Document Text Ingestion Contract
- Implemented backend/local document text ingestion helper normalizes extracted text, rejects empty extraction output, calculates deterministic SHA-256 hashes, infers file type from MIME type or file name, and prepares grounded chunks for card generation.
- Implemented repository persistence for extracted documents through `createTextFileEntity(...)`, storing a real `File` entity in Dexie and enqueuing a sync mutation.
- Implemented `/api/documents/parse` server route for JSON text, HTML, and base64 binary PDF/EPUB payloads. It validates request JSON, extracts readable text, prepares `File` metadata, and returns grounded chunks.
- Implemented `/api/storage/upload` server route for authenticated PDF/EPUB blob upload through Firebase Admin Storage with user-scoped Storage paths and stable `gs://...` blob keys for File metadata.
- Implemented default backend binary parser adapters:
  - EPUB archives are read with `jszip`, extracting readable text from XHTML/HTML/XML content documents.
  - PDF extraction supports simple uncompressed text operators (`Tj`/`TJ`) as a backend baseline; advanced compressed/scanned PDF OCR remains outside the current non-UI MVP.

### 6.6 Backlinks & Local Graph Data Contract
- Implemented backend helper to derive incoming backlinks from same-Space relations, including source id, source type, source title, property id, and property label.
- Implemented backend helper to build a local one-hop entity graph centered on an entity, returning graph nodes and relation edges for future inspector/canvas rendering.
- Cross-Space entities and relations are excluded from derived backlinks and graph output.

---

## 7. 3-Pane Adaptive Workspace UI (`components/layout/`)

### 7.1 Layout Architecture
- **Pane 1: Left Navigation Sidebar (`w-60 border-r border-neutral-200 dark:border-neutral-800`)**:
  - Global Command Palette (`Cmd+K`).
  - Daily Notes & Calendar.
  - Object Types Directory: Pages, Files, Highlights, Flashcards, Study Goals.
  - Tags Tree.
- **Pane 2: Center Main Workspace (`flex-1 overflow-y-auto`)**:
  - **Single View**: Standard reading or editing view.
  - **Split View (`grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-800`)**:
    - Left Pane: PDF / Reader view with active highlights.
    - Right Pane: Note editor, flashcard review deck, or AI staging drawer.
  - **Flashcard Review Deck**: Reads real `Flashcard` entities from Dexie via reactive workspace data, selects cards whose `srs.dueDate` is due, flips front/back, and persists `Again`, `Hard`, `Good`, `Easy` reviews through the Space repository FSRS path. No mock review data is allowed in this surface.
- **Pane 3: Right Inspector Panel (`w-80 border-l border-neutral-200 dark:border-neutral-800`)**:
  - **Properties Sheet**: Object type icon, title, tags, custom attributes.
  - **Relations & Backlinks**: Outgoing links and incoming backlinks with excerpt previews.
  - **Local Canvas Graph**: Interactive 2D mini force-directed graph centered on the active object.

---

## 8. Firebase Background Sync & Conflict Resolution (`lib/sync/`)
1. **Local-First Write**: Every user action (create highlight, review card, edit note) immediately mutates Dexie.js with `_syncStatus = 'pending'`.
2. **Sync Queue**: Implemented offline mutation queue records `spaceId`, `entityId`, `entityType`, `operation` (`set` | `delete`), `status`, timestamps, and a cloned entity payload.
3. **Repository Integration**: Entity create/update/delete flows, highlight creation, flashcard creation, document ingestion, and flashcard review persistence enqueue `pending` mutations for future Firestore sync.
4. **Online Listener**: When `navigator.onLine` is true:
   - Implemented sync engine contract that consumes pending mutations in batches and sends them through an adapter-compatible writer.
   - Implemented Firestore REST `batchWrite` writer that serializes local entity payloads into Firestore Value format, supports `set` and `delete` mutation operations, and can namespace writes under the authenticated Firebase user id.
   - Implemented Last-Write-Wins (LWW) decision helper based on ISO `updatedAt` timestamps.
   - Implemented local success/failure transitions: successful `set` mutations mark entities `_syncStatus = 'synced'`; failed batches retain pending local entities and record the sync error.
  - Implemented online sync runner that skips safely while offline or missing project/token prerequisites, then connects Firestore REST writer to the sync engine when credentials are ready and can write through the same authenticated user namespace.
   - Implemented Firebase Admin-compatible Auth adapter for server-side ID token verification.
   - Implemented `/api/sync/push` Route Handler that validates request JSON, verifies Firebase ID tokens through `firebase-admin`, sends sync mutations through the server-mediated Firestore writer under `users/{uid}`, and keeps Firestore bearer credentials server-only.
   - Implemented Google Application Default Credentials access-token provider for hosted Firestore REST sync, with optional explicit token override.
   - Implemented Firestore security rules for user-scoped document paths.

---

## 9. Implementation Roadmap
1. **Phase 1: Project Setup & Storage Core**
   - Initialize Next.js App Router (Full-Stack hybrid), Tailwind CSS, and Lucide icons.
   - Configure Dexie.js database tables, TypeScript types, and `apphosting.yaml` configuration.
   - Implemented Space repository create/update write paths for entities, including protected identity fields and special defaults for `flashcard` and `study_goal`.
   - Implemented Space repository delete path for entities, including same-Space relation cleanup and `delete` sync mutation creation.
   - Implemented backend derived backlinks and local entity graph helpers from same-Space relation records.
2. **Phase 2: Backend Reader Data & Non-Mutating Highlight Model**
   - Backend/local repository can now create `Highlight` entities with quote anchors and validate flashcard provenance.
   - Implemented extracted text storage, deterministic file hashing, file type inference, and chunk metadata for text-based ingestion.
   - Implemented `/api/documents/parse` for text/HTML payloads and base64 binary PDF/EPUB payloads.
   - Implemented server/local binary document parser adapters for PDF and EPUB.
   - Defer visual PDF/Markdown reader surfaces to the final UI phase.
3. **Phase 3: AI Generation Pipeline**
- Implemented backend/local exact-quote grounding from source text into `Highlight` plus linked `Flashcard` records.
- Implemented source text chunking with offsets and structured generated-card response validation.
- Implemented Server Route Handler (`/api/ai/generate`) with server-only Gemini/Groq key usage and REST provider adapters.
- Implemented client-side BYOK API key and preferred-provider persistence logic for Gemini/Groq fallback.
- Implemented generated-card grounding orchestrator that persists accepted provider cards through repository quote grounding and rejects fabricated quotes without persistence.
- Defer AI Staging Drawer to the final UI phase.
4. **Phase 4: FSRS Spaced Repetition & Exam Burndown Backend**
   - Implemented FSRS mathematical state machine.
   - Implemented interactive flashcard study session backed by real Dexie `Flashcard` entities and repository review persistence.
   - Implemented study goal pacing calculations for due cards, new cards, and burndown status.
   - Defer keyboard shortcut polish and dashboard UI refinements to the final UI phase.
5. **Phase 5: Firebase Full-Stack Integration & Deployment**
   - Implemented local sync mutation queue for future Firestore batching.
   - Implemented sync engine batch contract, mutation status transitions, entity `_syncStatus = 'synced'` success path, failure recording, and LWW decision helper.
   - Implemented Firestore REST `batchWrite` writer for real remote mutation commits under user-scoped Firestore document paths.
   - Implemented server-side auth boundary for Bearer token extraction, Firebase Admin-compatible verification, verified user claim normalization, and stable invalid/missing-token errors.
   - Implemented online sync runner that gates Firestore pushes on online state, Firebase project id, and access token availability, with optional `ownerUid` support for user-scoped Firestore document paths.
   - Implemented authenticated remote sync push handler for server-mediated Firestore mutation commits.
   - Implemented `/api/sync/push` Route Handler with `firebase-admin` verification and lazy server-only Firestore bearer token resolution after request JSON and Firebase auth validation.
   - Implemented `/api/storage/upload` Route Handler with `firebase-admin` verification and server-only Firebase Storage writes for PDF/EPUB blobs.
   - Implemented `apphosting.yaml`, `firebase.json`, and `.env.example` for Firebase App Hosting configuration, including runtime secrets for AI providers and Firebase Storage bucket selection.
   - Implemented `firestore.rules` for user-scoped private data access.
   - Deploy full-stack Next.js app to **Firebase App Hosting** on the **Blaze Plan** after selecting/connecting the real Firebase project and provisioning referenced secrets.
6. **Phase 6: Final UI Surfaces & Polish**
   - Build/finish 3-pane Capacities shell, Sidebar, Command Palette (`Cmd+K`), Split View container, and Right Inspector.
   - Implement `pdfjs-dist` PDF viewer, Markdown reader, CSS Custom Highlight API rendering, and floating selection toolbar.
   - Implement AI Staging Drawer.
   - Finish dedicated editors for `front/back`, goal date, retention target, and pacing settings.
   - Finish relations/backlinks inspector and local canvas graph using the implemented backend graph helpers.

