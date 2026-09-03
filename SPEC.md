# Application Specification: Unified Study & Knowledge Management System

## 1. Executive Summary
A local-first, zero-operating-cost web application unifying the core superpowers of:
- **Capacities**: Object-based architecture, typed properties, bi-directional backlinks, and relational knowledge graph.
- **Readwise / Reader**: Document ingestion (PDF, Markdown, EPUB), distraction-free reader view, and non-mutating text highlighting.
- **Anki + Goal Pacing**: Modern FSRS spaced repetition with goal-driven burndown calculations to pace reviews ahead of exam deadlines.
- **Grounded AI Generation**: Client-orchestrated flashcard extraction from text chunks, automatically synthesizing `Highlight` entities and linking cards to source quotes.

---

## 2. Infrastructure & Cost Model ($0.00 MVP)
- **Hosting**: Firebase Hosting (serving Next.js static export bundle via CDN).
- **Backend Services (Firebase Spark Plan)**:
  - **Auth**: Firebase Auth (Email/Password, Google OAuth).
  - **Database**: Cloud Firestore (Metadata & synchronization, staying under 50k reads / 20k writes per day).
  - **Storage**: Firebase Cloud Storage (PDF/EPUB blobs, staying under 5GB total / 1GB daily transfer).
  - **Remote Config**: Dynamic feature flagging without code redeployments.
- **Client Runtime**:
  - Browser IndexedDB via **Dexie.js** as the single source of truth for reads and writes.
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

  constructor() {
    super('KnowledgeOS_DB');
    this.version(1).stores({
      entities: 'id, type, title, createdAt, updatedAt, *tags',
      files: 'id, fileType, fileHash, parsingStatus, createdAt',
      highlights: 'id, fileId, color, createdAt',
      flashcards: 'id, fileId, sourceHighlightId, targetGoalId, srs.state, srs.dueDate, createdAt',
      studyGoals: 'id, targetExamDate, createdAt',
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

### 6.1 Client-Orchestrated BYOK Flow
1. User provides Google Gemini API key or Groq API key in Settings (stored in local IndexedDB).
2. Document text is chunked into logical units (~1,500 words or Markdown sections).
3. Directly queries Google Gemini 2.0 Flash (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`) with `response_mime_type: "application/json"`.

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

### 6.3 Automatic Anchor Synthesis
1. Client searches chunk text for `exactQuote`.
2. Calculates `startOffset`, `endOffset`, and contextual `prefix`/`suffix`.
3. Creates `Highlight` entity in Dexie.js.
4. Generates `Flashcard` entity with `sourceHighlightId = highlight.id` and initial FSRS state (`state = 'new'`).
5. Displays cards in the **Staging Drawer** for user verification and acceptance.

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
- **Pane 3: Right Inspector Panel (`w-80 border-l border-neutral-200 dark:border-neutral-800`)**:
  - **Properties Sheet**: Object type icon, title, tags, custom attributes.
  - **Relations & Backlinks**: Outgoing links and incoming backlinks with excerpt previews.
  - **Local Canvas Graph**: Interactive 2D mini force-directed graph centered on the active object.

---

## 8. Firebase Background Sync & Conflict Resolution (`lib/sync/`)
1. **Local-First Write**: Every user action (create highlight, review card, edit note) immediately mutates Dexie.js with `_syncStatus = 'pending'`.
2. **Sync Queue**: An offline mutation queue records `entityId`, `operation` (`set` | `delete`), and `timestamp`.
3. **Online Listener**: When `navigator.onLine` is true:
   - Batches mutations into Firestore `writeBatch()` (up to 500 operations per batch).
   - Resolves conflicts using Last-Write-Wins (LWW) based on ISO `updatedAt` timestamps.
   - Updates local `_syncStatus = 'synced'`.

---

## 9. Implementation Roadmap
1. **Phase 1: Project Setup & Storage Core**
   - Initialize Next.js App Router with `output: 'export'`, Tailwind CSS, and Lucide icons.
   - Configure Dexie.js database tables, TypeScript types, and `firebase.json` SPA rewrites.
2. **Phase 2: 3-Pane Capacities Shell & Navigation**
   - Build Sidebar, Command Palette (`Cmd+K`), Split View container, and Right Inspector.
   - Connect Zustand state store with Dexie `useLiveQuery`.
3. **Phase 3: Reader Engine & Non-Mutating Highlighting**
   - Implement `pdfjs-dist` PDF viewer and Markdown reader.
   - Integrate CSS Custom Highlight API and floating selection toolbar.
4. **Phase 4: AI Generation Pipeline**
   - Implement client-side BYOK API settings (Gemini 2.0 Flash / Groq).
   - Build chunker, structured output handler, and automatic anchor/highlight synthesizer.
   - Implement AI Staging Drawer.
5. **Phase 5: FSRS Spaced Repetition & Exam Burndown Dashboard**
   - Implement FSRS mathematical state machine.
   - Build interactive flashcard study session (Again, Hard, Good, Easy keyboard shortcuts `1-4`, Space to flip).
   - Build Exam Goal Pacing Dashboard with burndown chart.
6. **Phase 6: Firebase Sync & Deployment**
   - Implement Firebase Auth and Firestore background synchronization.
   - Deploy static export to Firebase Hosting.
