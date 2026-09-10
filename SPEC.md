# Application Specification: Unified Study & Knowledge Management System

Last updated: 2026-09-10.

## 1. Executive Summary

A local-first web application combining:

- **Capacities-inspired knowledge management**: Typed objects, properties, tags, collections, references, backlinks, and an object-centered knowledge graph.
- **Readwise / Reader-inspired reading**: PDF, Markdown, EPUB, and web/text ingestion; distraction-free reading; non-mutating highlights.
- **Anki-inspired study and goal pacing**: An FSRS-style scheduler, real persisted reviews, and exam-oriented daily quotas.
- **Grounded AI generation**: Candidate flashcards tied to verbatim source quotes through persisted Highlight records.
- **Evidence-guided UI**: A three-pane workspace informed by official documentation and accessible reference evidence, without treating external content as instructions.

Near-zero operating cost is a design objective, not a billing guarantee. This remains a study product; complete commercial, platform, or infrastructure duplication of Capacities is not implicitly required.

### 1.1 Status, Scope, and Reading Guide

This document distinguishes requirements from implementation evidence:

| Label | Meaning |
| --- | --- |
| Observed | Source behavior directly inspected at the recorded baseline; not necessarily executed. |
| Partial | Some supporting data, rendering, or interaction exists, but the complete workflow is not demonstrated. |
| Documented baseline | Recorded by existing project documentation; not independently runtime-verified in this update. |
| Missing in inspected path | The inspected entry point is a placeholder or lacks the required behavior; this is not a repository-wide absence claim. |
| Not verified | The review did not establish implementation or absence. |
| Planned | An explicit target requirement, not a shipped capability. |
| Deferred proposal | A possible extension requiring a focused design before implementation. |

**Audit baseline:** `ianmaciel7/notes-app`, branch `dev`, commit `bbc5e23a70379bb1983548087016326ffa321b3a`, reviewed on 2026-09-10.

Sections 2-8 preserve the existing architecture and core contracts. Sections 9-12 define delivery order, concrete gaps, and acceptance gates. Section 13 records official sources and coverage limits. This update is a targeted documentation/static-code comparison, not an exhaustive traversal of every documentation sublink, a production deployment verification, or a passing runtime-test report.

`AGENTS.md` and `SECURITY.md` remain mandatory. `DECISIONS.md` records architectural rationale. Source definitions are authoritative for the current implementation; planned schema extensions require migrations rather than silently changing existing records.

---

## 2. Infrastructure & Cost Model

### 2.1 Server and Cloud Boundary

Retain the Firebase Blaze / Firebase App Hosting design for a full-stack Next.js App Router application, with server-rendered surfaces and server Route Handlers. The recorded deployment profile is `cpu: 1`, `memoryMiB: 512`, `minInstances: 0`, `maxInstances: 2`, and `concurrency: 80`; verify actual deployment state separately.

Firebase Auth provides the account boundary. Firestore stores remotely synchronized metadata, and Firebase Storage stores supported document media. Production secrets belong in server environment/Secret Manager/App Hosting configuration, not browser bundles.

| Route | Existing documented contract |
| --- | --- |
| `/api/ai/generate` | Server provider adapter for structured card candidates; credentials remain server-only. |
| `/api/documents/parse` | Validate supported text, HTML, and base64 PDF/EPUB inputs; return normalized file metadata and grounded chunks. |
| `/api/sync/push` | Verify Firebase ID tokens, validate mutation payloads, and push user-scoped Firestore writes. |
| `/api/storage/upload` | Verify Firebase ID tokens and upload supported PDF/EPUB media under the authenticated user's Space namespace. |

Remote entity paths remain `users/{uid}/spaces/{spaceId}/entities/{entityId}`. Media paths remain under `users/{uid}/spaces/{spaceId}/media/`, with generated blob identifiers and sanitized file names. Ownership must come from the verified token, never a caller-supplied user ID.

Use Application Default Credentials for hosted Firestore access. `FIRESTORE_ACCESS_TOKEN` is only an explicit server/testing override. Keep Firestore rules user-scoped and deny unrelated paths by default. New sharing or cross-user features require a separate authorization design.

### 2.2 Client and Cost Constraints

Dexie/IndexedDB is the immediate local source of truth. Zustand owns transient UI state. Use Tailwind CSS v4, the existing shared component system, and the repository's pnpm/Biome toolchain.

Scale-to-zero and instance limits support cost control, but do not establish a zero bill or a universal spending ceiling. Historical free-tier figures are not current pricing commitments. Verify the selected project's quotas, pricing, secrets, rules, and billing configuration before deployment. This update did not provision or deploy cloud services.

---

## 3. Data Architecture and Persistence Contracts

Canonical definitions: `src/types/schema.ts`, `src/lib/spaces/space-types.ts`, and `src/lib/db.ts`.

### 3.1 Base Entity Contract

The existing domain contract includes:

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
  type:
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'bullet_list'
    | 'numbered_list'
    | 'code'
    | 'callout'
    | 'quote'
    | 'divider';
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

The persisted workspace extension, observed in `src/lib/spaces/space-types.ts`, is:

```typescript
export type SpaceEntityRecord = BaseEntity & {
  spaceId: string;
  objectTypeId: string;
  collections?: string[];
};
```

Do not confuse the extensible `type` discriminator with the Space-specific `objectTypeId`. The permissive property record is not a substitute for runtime validation against a type's property definitions.

### 3.1.1 Local Repository Write Contract

Repository methods remain the canonical domain write path:

- `createEntity(spaceId, objectTypeId, title)` creates normal objects and initializes study defaults. Flashcards receive card content/provenance fields, initial SRS state, and `aiGenerated = false`; study goals receive date, retention, quota, and target-file defaults.
- `updateEntity(spaceId, entityId, update)` refreshes `updatedAt`, marks the entity pending, and does not rewrite `id`, `spaceId`, `objectTypeId`, or `createdAt` through a generic update.
- `deleteEntity(spaceId, entityId)` removes the entity, cleans same-Space source/target relations, and enqueues a delete mutation with the deleted snapshot. This contract alone does not prove recoverable trash or remote tombstone convergence.
- `createHighlightEntity(spaceId, input)` persists file identity, exact text, optional quote context, color, location, and initial `cardCount = 0`.
- `createFlashcardEntity(spaceId, input)` requires same-Space Highlight provenance for non-manual source-based cards and maintains the source highlight's card count.
- `createGroundedFlashcardFromQuote(spaceId, input)` verifies the source quote verbatim, calculates offsets and context, and creates the linked Highlight and Flashcard records.
- `createTextFileEntity(spaceId, objectTypeId, input)` persists normalized extracted text, inferred file type, SHA-256 hash, byte size, completed parsing status, and a pending sync mutation.
- `recordFlashcardReview` persists ratings through the scheduler and repository rather than a disconnected UI queue.
- `buildEntityBacklinks(...)` and `buildLocalEntityGraph(...)` derive same-Space knowledge context from stored relations. Their documented existence does not mean the current inspector is wired to them.

These methods are retained from the documented backend baseline. Their complete runtime behavior was not rerun during this documentation update. Dedicated authoring and configuration screens remain subject to the gap matrix.

### 3.2 Specialized Domain Entities

All specialized objects extend `BaseEntity`; their workspace persistence additionally requires `SpaceEntityRecord` scope.

| Entity | Required domain fields and semantics |
| --- | --- |
| `FileObject` | `type: 'file'`; `fileType` is PDF, EPUB, Markdown, or web article; `originalName`, optional `sourceUrl` and `localBlobKey`, `sizeBytes`, `fileHash`, optional `extractedText` and `pageCount`; `parsingStatus` is pending, processing, completed, or error. |
| `Highlight` | `type: 'highlight'`; `fileId`, `exactText`, optional `prefix`/`suffix`; color yellow, blue, green, pink, or purple; location may contain page number, start/end offsets, EPUB CFI, or DOM selector; optional user note and card count. |
| `Flashcard` | `type: 'flashcard'`; card kind basic, cloze, or reversed; `fileId`, `sourceHighlightId`, `sourceQuoteSnippet`, optional `targetGoalId`; `front`, `back`, optional `clozeContent`; `srs`, `aiGenerated`, optional `aiPromptContext`. Generated cards require valid grounded provenance. |
| `StudyGoal` | `type: 'study_goal'`; `targetExamDate`, `targetRetentionRate`, `totalCards`, `dailyNewCardsQuota`, `expectedDailyReviews`, and `targetFileIds`. |
| `TagEntity` | Domain tag shape with optional color/description and usage count. Do not confuse it with the currently persisted lightweight `SpaceTagRecord`. |

`SRSState` contains state (new, learning, review, relearning), ISO `dueDate`, optional `lastReviewedAt`, interval in days, ease factor, repetition count, lapses, and optional stability/difficulty values.

Observed structural records include:

- `SpaceCollectionRecord`: `id`, `spaceId`, `structureId`, `name`.
- `SpaceTagRecord`: `id`, `spaceId`, `name`.
- `SpaceRelationRecord`: `id`, `spaceId`, `sourceId`, `targetId`, `propertyId`, `createdAt`.
- `SpaceMediaRecord`: media identity, Space, name, MIME type, optional blob key, and timestamps.
- `SpaceSettingRecord`: `id`, `spaceId`, `key`, `value`, `updatedAt`.
- `SpaceTrashRecord`: `id`, `spaceId`, `entityId`, labels, `trashedAt`, `purgeAfter`. The inspected type contains metadata, not a full restoration snapshot.
- `SyncMutationRecord`: identity, Space/entity/type, set/delete operation, pending/syncing/synced/failed status, optional payload/error, and timestamps.

### 3.3 Actual Dexie Schema

**Correction:** The previous specification's separate `files`, `highlights`, `flashcards`, and `studyGoals` tables were not the current implementation. `src/lib/db.ts` defines `KnowledgeDatabase`, default name `KnowledgeOS_DB`, with this layout:

| Version | Table | Key and declared indexes |
| --- | --- | --- |
| 1 | `spaces` | `id, accountId, sortOrder, [accountId+sortOrder], name, createdAt, updatedAt` |
| 1 | `appSettings` | `id` |
| 1 | `objectTypes` | `[spaceId+id], spaceId, id, ownership, lifecycleKind` |
| 1 | `entities` | `[spaceId+id], spaceId, id, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags` |
| 1 | `collections` | `[spaceId+id], spaceId, id, [spaceId+structureId], structureId, name` |
| 1 | `tags` | `[spaceId+id], spaceId, id, [spaceId+name], name` |
| 1 | `relations` | `[spaceId+id], spaceId, id, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId` |
| 1 | `media` | `[spaceId+id], spaceId, id, [spaceId+mimeType], mimeType, updatedAt` |
| 1 | `spaceSettings` | `[spaceId+id], spaceId, id, [spaceId+key], key, updatedAt` |
| 1 | `trash` | `[spaceId+id], spaceId, id, [spaceId+entityId], entityId, purgeAfter, trashedAt` |
| 2 | `syncMutations` | `id, status, [status+updatedAt], spaceId, entityId, entityType, operation, updatedAt` |

The source exports `createKnowledgeDatabase(name?)` and a default `db` instance. The first expression in each index declaration is its primary key. Specialized object variants live in `entities`; extra TypeScript fields are not automatically indexed.

This documentation correction does not alter database versions. Any future query, block, history, or task indexes require a new version and migration tests against existing data.

### 3.4 Planned Extensions, Not Existing Schema

Future implementation must define and validate, before migration:

| Target contract | Required design boundary |
| --- | --- |
| Property definitions and values | Stable property IDs, value kinds, options/cardinality, validation, defaults, and safe type changes. |
| Rich block document | Stable block IDs, nesting/order, rich inline marks and references, serialization version, and migration from current flat text blocks. |
| Object/block references | Canonical target identity, link kind, source context, and same-Space validation; editable embeds must not duplicate the target. |
| Saved query/view definition | Scope, declarative predicates, text query, sort/group, visible fields, and layout preferences; never executable code. |
| Template | Owning object type, default properties, reusable block structure, and safe new-instance identity rules. |
| Daily note | Unique Space/date identity in an explicit timezone; not a query on `createdAt`. |
| Task | Validated status, priority, scheduled date, deadline, completion timestamp, and context relations. |
| Recovery and history | Restorable snapshots, attachment references, retention/purge semantics, and conflict-safe restore behavior. |

Reuse existing repositories and tables where appropriate. Do not create a second database or parallel entity hierarchy simply to add a new renderer.

---

## 4. FSRS and Dynamic Goal Pacing

Canonical implementation path: `src/lib/srs/fsrs.ts`.

### 4.1 Scheduling Contract

Retain the FSRS-style model, persisted stability/difficulty when present, and four ratings (`Again = 1`, `Hard = 2`, `Good = 3`, `Easy = 4`). The original design's illustrative retrievability model is:

```text
R(t) = (1 + FACTOR * t / S) ^ DECAY
FACTOR = 19 / 81
DECAY = -0.5
Interval = S / FACTOR * (R_target ^ (1 / DECAY) - 1)
```

Here `t` and `Interval` are days and `S` is memory stability. These formulas are design context, not proof of exact conformance to a particular upstream FSRS release. Do not replace actual scheduler transitions with fixed UI multipliers. Verify behavior through the implementation and focused tests before changing scheduling.

### 4.2 Goal Pacing Contract

Preserve the original pacing baseline:

```text
DaysRemaining = max(1, floor((ExamDate - now) / 86400000))
DailyNewQuota = ceil(UnlearnedCards / max(1, DaysRemaining - BufferDays))
ExpectedCompleted = TotalCards * (DaysElapsed / TotalDays)
```

The original buffer default is seven days, or a proportion of a short remaining window; configuration may reserve a longer consolidation period. Explicitly handle overdue exams, zero cards, zero-length planning windows, and date/timezone boundaries.

Evaluate status in order: at least 105% of expected progress is `Ahead`; otherwise at least 95% is `On Track`; otherwise `Behind`. Keep due reviews separate from new-card quotas.

### 4.3 Study UI Requirement

A study session must consume the active Space's real cards, select due work, reveal answers, and persist ratings. A goal screen must expose exam date, retention, buffer, target content, quota, due/overdue counts, and pacing. The existing documentation records backend/review foundations; current reachability and end-to-end UI completion were not established by this audit.

---

## 5. Reader and Non-Mutating Highlighting

Status: existing ingestion/anchor contracts with planned reader UI completion.

### 5.1 PDF

Use `pdfjs-dist` in a worker, render at device pixel ratio, and align the transparent text layer with the page viewport. Read selection geometry and render SVG/canvas overlays without changing source text nodes. Persist page/location anchors and restore them across reopening and zoom changes.

The backend's simple uncompressed `Tj`/`TJ` extractor is not the same capability as a visual PDF renderer. Unsupported compressed/scanned extraction must be explicit; no OCR claim is permitted without implementation and tests.

### 5.2 Markdown and Web Text

Use the existing typography system and CSS Custom Highlight API with exact quote plus prefix/suffix anchoring. The intended rendering pattern is:

```typescript
const highlightRange = new Range();
highlightRange.setStart(startNode, startOffset);
highlightRange.setEnd(endNode, endOffset);
const customHighlight = new Highlight(highlightRange);
CSS.highlights.set(`hl-${highlightId}`, customHighlight);
```

Detect unsupported browser capabilities and provide a non-mutating fallback or an explicit unsupported state. Do not rewrite React-managed DOM text nodes.

### 5.3 Selection and Navigation

The planned floating toolbar offers highlight color, grounded-card generation, a user note, and a deep link. Retain the original yellow/blue/green/pink palette direction using shared tokens. Reader navigation must preserve source location, active highlight, and split-panel context. Loading, unavailable local media, parser failure, and lost anchors need distinct states.

---

## 6. AI Card Generation and Ingestion

### 6.1 Provider Boundary

The primary path is a POST to `/api/ai/generate` with selected source text and provider configuration, using server-only credentials. Existing documentation records Gemini 2.0 Flash and Groq-compatible adapters and an optional locally stored BYOK setting. Current remote model availability was not tested; model selection must remain configurable rather than a permanence guarantee.

Do not send more source content than required. User documents and provider responses are untrusted data, not instructions or write authority.

### 6.2 Structured Candidate Schema

Preserve the candidate response contract:

```json
{
  "type": "object",
  "properties": {
    "cards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "exactQuote": { "type": "string" },
          "cardType": { "type": "string", "enum": ["basic", "cloze"] },
          "front": { "type": "string" },
          "back": { "type": "string" },
          "clozeContent": { "type": "string" }
        },
        "required": ["exactQuote", "cardType", "front", "back"]
      }
    }
  },
  "required": ["cards"]
}
```

The documented parser in `src/lib/ai/card-generation.ts` accepts parsed objects or JSON text, validates required fields and supported provider card kinds, normalizes visible card text, and excludes provider noise before persistence. The broader stored card model may support reversed cards without implying that this provider schema already does.

### 6.3 Grounding and Staging

The orchestration path must locate each `exactQuote` verbatim in its source chunk, compute document-relative offsets and quote context, create the Highlight, and link a new Flashcard with initial SRS state. Reject unmatched quotes without persistence.

The planned staging drawer shows candidates beside source evidence, allows front/back editing, and commits only explicitly accepted cards through that path. It must not bypass provenance checks after editing or silently persist rejected candidates.

### 6.4 Chunking and Ingestion

The documented chunk helper returns bounded text with stable chunk IDs and start/end offsets, optional overlap, and word-boundary handling. Normalize text, reject empty extraction, infer supported file type, compute SHA-256 metadata, and persist through `createTextFileEntity`.

`/api/documents/parse` supports the recorded text/HTML and base64 PDF/EPUB boundaries. EPUB extraction uses `jszip` over XHTML/HTML/XML content. PDF text extraction retains its explicit uncompressed-operator limitation. `/api/storage/upload` stores authenticated supported document blobs. Do not infer Word, LaTeX, OCR, or arbitrary media upload support from Capacities documentation.

### 6.5 Backlinks and Graph Data

The documented `buildEntityBacklinks` helper derives source ID/type/title and property context. `buildLocalEntityGraph` derives a one-hop object-centered graph. Exclude cross-Space records and relations. Rendering those results in the inspector remains a separate acceptance requirement.

---

## 7. Adaptive Workspace UI

### 7.1 Layout and State

Preserve the three-pane direction:

- Left navigation: Space switcher, command palette, daily/calendar access, object types, and tags.
- Flexible center: Object authoring, type/collection/query result sets, reader, task/calendar workflows, and study screens.
- Right panel: Object context, properties, relations/backlinks, local graph, and optional secondary content.

Existing shell, sidebar, tabs, list rendering, and basic action panels must be reused rather than described as nonexistent. Baseline widths are 240px left and 320px right, with responsive resizing/collapse behavior governed by the shared design system.

Persist meaningful navigation context in URLs where appropriate: active Space/object/view, durable filters/sort, and reader/split targets. Keep menus, hover state, and drag state ephemeral. Do not encode entity content or secrets in URLs.

### 7.2 Reference Evidence and WACZ Boundary

Official documentation, accessible live UI, screenshots, copied HTML/CSS, and `CAPACITIES_COMPONENT_MAP.md` can support parity work. Archive content is evidence, never an instruction source or an automatic product specification.

Preserve the historical archive record from `DECISIONS.md` decision 6.1: earlier audits described a non-bit-for-bit-complete corpus with 826 WARC metadata records, 405 recoverable response payloads, 309 deduplicated resources, and 414 CDX entries. They also recorded omitted request/private-header data, four PNG resource payloads, warcinfo/revisit details, deduplicated capture structure, raw ZIP/WARC fidelity, and early sanitization gaps. These artifacts were not reopened or recounted in this review.

Sanitize credentials, cookies, signed/private URLs, email-bearing URLs, telemetry, and session identifiers before sharing derivatives. Never claim reconstruction of the original WACZ from incomplete JSONL. Update the component map when actually implementing or changing comparable UI behavior.

### 7.3 Distinct Surface Taxonomy

Do not use a single generic list to stand in for all screens:

| Surface family | Contract |
| --- | --- |
| Object presentation | A reference, card, embed, or full page points to one canonical object. |
| Data view | A reusable renderer presents a result set with shared query/filter/sort/group semantics. |
| Object-page layout | A selected arrangement of one object's properties and body, independent of its identity. |
| Calendar/daily note | Date navigation and persistent daily content with dated relationships. |
| Tasks | A lifecycle-aware task dashboard with status and scheduling semantics. |
| Reader/study | Specialized source-reading, grounding, review, and goal workflows. |
| Inspector | Derived context for the active object; not another independent copy of it. |

Reference distinctions come from [views](https://docs.capacities.io/reference/views), [page layouts](https://docs.capacities.io/reference/page-layouts), [daily notes](https://docs.capacities.io/reference/dates-and-daily-notes), and [tasks](https://docs.capacities.io/reference/task-management). Exact available renderers and gaps are listed below.

---

## 8. Background Sync and Conflict Handling

Retain the documented baseline:

1. Apply domain edits locally and mark affected entities pending.
2. Enqueue cloned set/delete mutations with Space/entity identity, status, payload, and timestamps.
3. Consume pending mutations through a batched writer contract.
4. Serialize supported payloads to Firestore values and use the server-mediated authenticated namespace.
5. Mark acknowledged set records synced; preserve pending local data and record errors on failure.
6. Gate online pushes on connectivity and valid project/authentication prerequisites; resolve server credentials only after request/auth validation.
7. Retain the LWW timestamp helper as the current documented conflict baseline.

**Not established by this review:** complete remote bootstrap, pull/subscription behavior, schema/collection/tag synchronization, attachment caching, account switching, conflict recovery, or multi-device delete convergence. A push route and timestamp helper do not prove these workflows.

Before advertising complete sync, demonstrate two-device create/edit/delete propagation, retry/idempotency, expired authentication, offline edits, and non-resurrection of deleted objects. Protect pending local changes before destructive reset or sign-out. Any revised conflict model or remote namespace requires the security review prescribed in `SECURITY.md`.

---

## 9. Implementation Roadmap

The former setup/backend/reader/AI/SRS/Firebase/UI phases remain historical implementation tracks. Their backend accomplishments are not an automatic completion flag for today's workspace. The following delivery order replaces the idea that all remaining work is merely final UI polish.

| Priority | Delivery slice | Exit condition |
| --- | --- | --- |
| P0 | Usable local authoring and protection | Edit a real object, reload offline, find its text locally, and recover/export its data without losing identity or provenance. |
| P0 | One complete core study path | Ingest a supported source, create a grounded highlight/card, complete a real review, and persist the result. |
| P1 | Object organization and knowledge context | Typed properties, collections/tags, backlinks/local graph, templates, and shared result views operate on canonical data. |
| P1 | Queries, calendar, and task workflows | Persisted query definitions, daily-note identity, and explicit task lifecycle/scheduling pass their acceptance tests. |
| P1 | Portability and verified multi-device behavior | Import/export mapping, recovery, sync states, and cross-device convergence are tested before those capabilities are advertised. |
| P2 | Presentation and optional extensions | Additional page layouts/presentation, semantic search, external capture/integrations, general AI chat, and native packages receive focused designs before implementation. |

P0 means required for a credible local MVP, not an assertion that no supporting code exists. P1 features may be implemented incrementally. No deadline or percentage-complete claim is implied. External deployment remains a separate milestone after project/secrets/rules configuration is verified.

---

## 10. Capacities Comparison: Evidence and Concrete Gaps

### 10.1 Inspected Repository Evidence

All paths below refer to the audit commit in section 1.1.

| Evidence | What was actually inspected |
| --- | --- |
| `src/lib/db.ts` | All declared tables, compound keys, and versions 1/2. |
| `src/lib/spaces/space-types.ts` | Space-scoped record shapes, including collection/tag/relation/media/trash/sync metadata. |
| `src/components/workspace-main-content.tsx` | Search, calendar, task and explorer action panels; object/type dispatch; pending context-menu action mapping. |
| `src/components/workspace-object-data-view.tsx` | Only `cards` and `list` layouts; grouping by none or tag; object preview rendering. |
| `src/components/workspace-object-renderer.tsx` | Generic read-only object rendering, weblink specialization, stored list preferences, and always-empty collection/query overview sections. |
| `src/components/workspace-side-panel-renderer.tsx` | Graph, backlinks, objects-inside, related-content, AI-chat, and local-query labels all resolve to a pending renderer. |
| `AGENTS.md`, `SECURITY.md`, `ARCHITECTURE.md`, previous `DECISIONS.md` and `SPEC.md` | Existing product scope, security constraints, and previously documented backend contracts. |

The repository tree and component presence were also inspected. Tree entries were not treated as proof that every module or test was read or executed.

### 10.2 Gap Matrix

| ID | Area | Evidence-based status at baseline | Remaining work | Priority |
| --- | --- | --- | --- | --- |
| CAP-01 | Object/block authoring | Partial: the inspected generic renderer displays stored blocks and properties without an editing path. | Reachable persistent editor, rich content, undo/redo, safe serialization and migration. | P0 |
| CAP-02 | Typed properties and object lifecycle | Partial: type/record foundations exist; inspected property output is textual, and type-settings/change-type actions are pending. | Validated property editors, aliases/metadata, safe type configuration and conversion. | P0 basic editing; P1 advanced changes |
| CAP-03 | Links, backlinks, and local graph | Backend helpers are documented; inspected inspector surfaces are placeholders. | Wire canonical relations to navigable context; add block references and curated mention linking. | P1 |
| CAP-04 | Data views | Observed cards/list plus limited tag grouping and title/update ordering. | Table, gallery/wall distinctions and embedded result sets using shared query/view semantics. | P1 |
| CAP-05 | Collections and tags | Storage exists. Type overview shows fixed empty collection sections; new-collection action is pending in the inspected route. | Real membership management, tag pages, counts, navigation and empty states derived from data. | P1 |
| CAP-06 | Saved queries | New-query action and overview query section are placeholders. | Persisted declarative definitions, live evaluation, result navigation, validation and embedding. | P1 |
| CAP-07 | Templates | New-from-template action is pending in the inspected route. | Type-scoped template management and safe instantiation of blocks/default properties. | P1 |
| CAP-08 | Daily notes/calendar | Observed single-date picker with component-local state. | Persistent daily note per Space/date, date references, agenda aggregation and day/week/month navigation. | P1 |
| CAP-09 | Task management | Observed filtering by `objectTypeId === 'task'`, generic creation and title/date list. | Real task status/priority/scheduling/completion, context navigation and dashboard filters. | P1 |
| CAP-10 | Search | Inspected action panel searches title, type ID and entity ID only. | Local body/property/alias search, scoped results and source navigation; semantic search is separate. | P0 lexical; P2 semantic |
| CAP-11 | Navigation and contextual panels | Shell/tab foundations exist; side context remains pending. Full URL restoration was not verified. | Refresh/back/forward restoration, coherent split targets and data-backed side context. | P1 |
| CAP-12 | Trash, backup and history | Trash metadata and delete contract exist; complete restoration/history was not verified. | Prove restorable data, add local backup/restore and later revision preview/restore. | P0 basic recovery; P1 history |
| CAP-13 | Import/export workflow | Parser/upload backend is documented; inspected import/export actions are placeholders. | User-facing mapping, progress/error handling, portable output and relationship/media accounting. | P1 |
| CAP-14 | Reader, grounded-card staging and study | Backend contracts are documented; inspected object dispatch only specializes weblinks. Current complete study flow was not verified. | Wire specialized reader/staging/card/goal surfaces without replacing real persisted study data. | P0 one end-to-end path; P1 expansion |
| CAP-15 | Offline/sync readiness | Dexie and push foundations exist; complete bootstrap/pull/media/conflict behavior was not verified. | Explicit readiness/status UI and multi-device/offline acceptance tests. | P1; required before a full-sync claim |
| CAP-16 | Bulk operations and type conversion | Relevant inspected type-change/context actions are pending; batch behavior not established. | Selection, bounded atomic operations, conversion validation and recovery. | P1 after recovery |
| CAP-17 | Page layouts and presentation | Generic page renderer exists; presentation action is pending. | Additional property/body layouts and non-editing presentation mode. | P2 |
| CAP-18 | External capture, integrations, sharing and agents | Documentation-index discovery; implementation not comprehensively audited. | Separate scoped proposals and permission/cost reviews, not blanket absence claims. | P2 deferred |
| CAP-19 | Localization/accessibility/state coverage | Hardcoded Portuguese strings occur in inspected surfaces; complete keyboard/responsive behavior was not tested. | Shared translated messages, focus/keyboard and responsive/error-state verification across delivered workflows. | P0 cross-cutting |

A checkbox block is not a task-management implementation. A local graph is not a whole-Space graph. A generic card is not a complete gallery/wall renderer. A database table is not a complete user workflow. These distinctions must remain explicit when closing gap items.

---

## 11. Planned Requirements and Acceptance Criteria

These are notes-app delivery requirements derived from the comparison, not claims that every detail is already implemented or an exact copy of Capacities.

### CAP-01 / CAP-02: Authoring and Typed Objects

A user can create an object, edit title/body/properties, and reopen the same saved result after reload while offline. All domain writes use repositories and preserve Space/type identity and pending-sync semantics. Expose validation errors without discarding the user's draft.

Start with the current supported blocks and property kinds. Add nesting, richer inline structure, toggles, tables or other blocks only with versioned serialization and old-data migration tests. Property definitions use stable IDs; renaming a label must not orphan values. Type conversion uses an explicit mapping/preview rather than generic identity-field mutation. Required flashcard/study-goal types remain available.

### CAP-03: Canonical Links and Knowledge Context

Creating/removing a same-Space object relation updates incoming and outgoing context without a second UI-owned graph. Backlink entries navigate to the source and show meaningful context. The local graph centers on the active object and handles isolated/deleted targets.

Planned block links preserve target block IDs through unrelated edits. Editable transclusion updates canonical content. Unlinked mentions remain suggestions until accepted. Cross-Space references must not accidentally reveal or mutate another Space's content. Tests cover deletion, reload, duplicate titles, and dangling links.

### CAP-04 / CAP-05 / CAP-06: Organization and Shared Views

Collections, tags and queries retain distinct semantics. A collection manages explicit membership within its owning type; tags can organize across types; a saved query stores rules and computes membership. None of these creates copies of the underlying objects.

Implement a shared, bounded pipeline for Space scope, filters, text search, sort and grouping. View selection must preserve result identity, query and navigation context. Persist appropriate preferences per Space and view. Invalid saved predicates fail visibly; no executable expressions or cross-Space fallback.

Deliver table cells with typed formatting/edit validation, media-appropriate gallery/wall rendering, and embedded query results incrementally. Verify that all renderers produce the same result membership for the same query. Replace fixed empty collections/query sections with real data-dependent states.

### CAP-07: Templates

A template belongs to an object type and contains supported property defaults plus block structure. Instantiation creates fresh IDs for newly owned content while preserving references to existing target objects. Editing an instance does not silently mutate the template or duplicate linked objects. Unsupported properties and dates are validated before persistence. Test repeat instantiation, deletion, and migration of template definitions.

### CAP-08: Daily Notes and Calendar

Define one daily note for each `(spaceId, calendarDate)` in an explicit timezone. Opening a date repeatedly must not create duplicates. Display planned day, multi-day, week and month navigation as separate views of dated data, not alternate generic object lists.

Date mentions/properties should navigate to their date context. Keep the source of each calendar entry explicit: scheduled task, deadline, completion, date property, or mention. Do not classify every object created that day as the day's note. Test timezone changes, local midnight, date-only values and daylight-saving boundaries where applicable.

### CAP-09: Tasks

Define explicit stored status, priority, optional scheduled date, optional deadline, completion timestamp and contextual links. Completing and reopening a task must persist and update every dependent view.

For the notes-app target, **Inbox** means an open task with default/untriaged status and neither scheduled date nor deadline. This explicit rule resolves ambiguous reference wording rather than inheriting it. **Today** includes open work scheduled today, due/overdue work, and in-progress work; completed-today items appear separately. Additional scheduled/open/completed/context/tag views reuse the query engine. A status board, if delivered, updates status rather than creating duplicate tasks. Recurrence and external task actions remain separate proposals.

### CAP-10: Search

Local lexical search indexes available titles, aliases, supported property text and block content within the active Space. A result identifies the matching object/block and opens that context. Changes and deletions update the index. Keep search/pickers consistent without claiming an unimplemented semantic engine.

Test body-only matches, accents and supported locales, duplicate titles, empty results, offline updates and Space switching. The official search and offline-support pages disagree about some offline full-text behavior; notes-app's local lexical target is deliberate and must be tested independently.

### CAP-11 / CAP-17: Navigation and Presentation

Refresh, browser back/forward, and direct links restore the active Space/object/view where supported. Opening side content must not overwrite the main object's identity. Collapse/resize controls remain reachable; menu dismissal restores focus; hover previews must not be the only way to reach information.

Additional standard/wide, index-card, profile, or encyclopedia-style layouts are property/body arrangements, not new entity types. Presentation mode hides editing controls without changing saved content. Exact gesture/animation/geometry parity needs accessible reference evidence and a component-map update during implementation.

### CAP-12: Recovery and History

Before enabling broad destructive operations, demonstrate a local backup that restores objects, types, links, tags, collections, highlights, cards, goals and relevant settings into a clean test database. Preserve identity and provenance; report unsupported or unavailable media rather than silently omitting it.

A trash action must retain enough content to restore the deleted object and define relation/media handling. A label and purge timestamp alone are insufficient. Permanent purge requires explicit user intent. Version history, when implemented, previews and restores a revision as a new change without pretending that remote synchronization is a backup. Specify retention and attachment behavior separately rather than copying competitor limits.

### CAP-13 / CAP-16: Portability and Bulk Operations

Import uses supported adapters with an explicit target Space/type, field mapping, progress, duplicates policy and per-item errors. Preserve links through ID remapping when importing a dataset. Export provides a documented portable representation with properties, local links and a media manifest. Broader Markdown/CSV/HTML exchange can follow the local backup contract; do not promise unimplemented format adapters.

Bulk operations act only on the explicit selected set, validate compatible types/permissions, and define transaction/retry/undo behavior. Type changes must preview unsupported fields and preserve recoverability. Test partial failures and ensure unselected or other-Space objects are untouched.

### CAP-14: Reader and Study Completion

A minimum end-to-end test uses a supported source: ingest and persist it, reopen the reader, create a non-mutating anchored highlight, review a grounded card candidate, save it, rate it, and reopen the persisted review state. Unsupported PDF extraction must be visible rather than mislabeled successful.

Reader/staging/goal interfaces use real repository data. Fabricated quotes are rejected; rejecting a candidate creates no card; accepted provenance remains navigable. Study goal controls persist actual dates, retention and target content. UI delivery must not regress the existing backend contracts or substitute mock review state.

### CAP-15: Offline and Synchronization

Show separate states for local save, pending upload, synchronization in progress, unavailable network/server, authentication failure, conflict and unavailable media. Mark a device offline-ready only after the promised content is actually available. Do not erase pending local work as a recovery shortcut.

Verify remote bootstrap/pull as well as push, repeated requests, interrupted batches, simultaneous edits, schema/type metadata, deletion propagation and media availability. Preserve the current LWW baseline until a reviewed design establishes a safer alternative. Document residual limitations instead of asserting complete offline or multi-device parity.

### CAP-18: Deferred Extensions

Create independent proposals for web clipping/share-sheet capture, external calendars and task actions, broader media/AI analysis, general contextual AI chat, semantic search, public sharing, collaboration, public API/MCP, x-callback links, and native app distribution.

Each proposal must name official contract/version, user benefit, required permissions, revocation, privacy, cost, platform and offline limitations. Index discovery is not an exhaustive feature audit. The deprecated Capacities beta API must not be used as a current integration contract. Nothing in this specification authorizes relaxing private-data rules or granting an AI autonomous tool/write authority.

### CAP-19: Cross-Cutting UX and Test Coverage

New user-visible strings use the existing localization system; verify English and Portuguese without translating stable stored IDs. Render dates/numbers according to locale while storing unambiguous values.

Verify keyboard navigation, focus restoration, accessible names, resize/collapse behavior, reduced-motion handling and touch/keyboard alternatives to hover. Every delivered surface needs meaningful loading, empty, error and offline states. Avoid using a permanent placeholder to represent a functioning empty collection or query.

Use layered Ladle coverage: isolated primitives, composed components with required providers, and deterministic workspace scenarios using disposable data. Do not connect stories to production accounts or the user's live local workspace.

---

## 12. Definition of Done and Maintenance

A gap item is complete only when its reachable UI, repository/data contract, persistence and failure behavior satisfy its acceptance criteria. Record the implementation commit and verification evidence; a matching icon, story or installed dependency is insufficient.

For implementation work, run focused unit/integration tests and the repository's configured checks; add browser-level coverage where interaction or offline behavior requires it. Validate same-Space isolation, existing-data migrations and round trips. Do not claim tests were run merely because test files exist.

Maintain `CAPACITIES_COMPONENT_MAP.md` for actual parity component changes. Keep architectural decisions synchronized when a new data model, permission boundary or conflict policy is accepted. This change updates only `DECISIONS.md` and `SPEC.md`; it does not implement the planned features, migrate data, run the app, or certify visual parity.

---

## 13. Official Source Register and Research Coverage

Access date: 2026-09-10. Sources below were consulted for the indicated topics; inclusion does not assert that every section, linked image, external page, or transitive sublink was exhaustively reviewed. Requirements and prioritization in this document are notes-app design choices, not copied vendor implementation guarantees.

| Source | Review use |
| --- | --- |
| [Documentation home](https://docs.capacities.io/) and [reference index](https://docs.capacities.io/reference) | Navigation and feature-family discovery. |
| [Views](https://docs.capacities.io/reference/views) | Object presentation, result-set layouts and local-graph scope. |
| [Page layouts](https://docs.capacities.io/reference/page-layouts) | Distinction between an object's layout and its data type. |
| [Blocks](https://docs.capacities.io/reference/blocks) | Rich/nested content and object reuse concepts. |
| [Properties](https://docs.capacities.io/reference/properties) | Typed property and alias concepts; not a certified exhaustive property-kind inventory. |
| [Organizational structures](https://docs.capacities.io/reference/organizational-structures) | Types, tags, labels and organizational distinctions. |
| [Queries](https://docs.capacities.io/reference/queries) | Saved reactive result definitions; not a complete operator-by-operator audit. |
| [Templates](https://docs.capacities.io/reference/templates) | Type-scoped defaults and reusable content. |
| [Block-based linking](https://docs.capacities.io/reference/block-based-linking) | Canonical references and transclusion. |
| [Unlinked mentions](https://docs.capacities.io/reference/unlinked-mentions) | Suggested mentions versus committed links. |
| [Dates and daily notes](https://docs.capacities.io/reference/dates-and-daily-notes) | Calendar versus daily-note identity and dated context. |
| [Task management](https://docs.capacities.io/reference/task-management) | Task lifecycle and scheduling; not a complete audit of every task action. |
| [Search and command palette](https://docs.capacities.io/reference/search) | Full-text/navigation requirements and documented search modes. |
| [Import](https://docs.capacities.io/reference/import) | Import workflow and explicit format/platform boundaries. |
| [Export](https://docs.capacities.io/reference/export) | Portable output, relationships, backups and unavailable media. |
| [Version history](https://docs.capacities.io/reference/version-history) | Revision preview/restore as a feature separate from backup. |
| [Offline support](https://docs.capacities.io/misc/offline-support) | Readiness, local media and conflict/availability distinctions. |
| [Synchronization status](https://docs.capacities.io/misc/sync) | User-visible sync and failure states. |
| [Legacy beta API](https://docs.capacities.io/developer/api) | Deprecation notice with discontinuation date 2026-09-01; replacement portal linked but not comprehensively audited. |

### 13.1 Unresolved or Unreviewed Coverage

- The official search page describes offline search availability, while the offline-support page lists restrictions on full-text/extended/search-query behavior. Do not present either statement as universally settled without runtime/platform/version verification.
- Detailed navigation, shortcuts, bulk-action and presentation behavior; complete property/query operators; basic-type/media variants; full template/date behavior; and all visual interaction details still need focused coverage before exact parity claims.
- Integration-specific pages, task actions, calendar providers, AI connectors/media analysis, web extension, native mobile/tablet behavior, sharing/collaboration, API replacement/MCP/x-callback contracts, switching guides, tutorials/use cases, account/billing and policy pages were not all exhaustively audited.
- Private live-workspace interactions and historical WACZ/JSONL artifacts were not accessed in this update. Do not assume future agents can read those files without an accessible attachment or authorized connector.
- Repository-wide runtime tests, deployed cloud state, cross-device sync, and all source modules were not verified. Absence claims in section 10 are intentionally limited to inspected entry points.

A future exhaustive pass must keep a normalized URL inventory with per-page status (read, partial, inaccessible, external, duplicate), record versions/dates, and map newly verified behavior to implementation evidence. Until that exists, do not label this comparison an audit of every sublink or claim 100% Capacities parity.

## Revision History

| Date | Change |
| --- | --- |
| 2026-09-10 | Preserved local-first/Firebase/reader/grounding/study scope; corrected actual Dexie persistence; separated baseline from planned behavior; added 19 gap items, priorities, acceptance criteria, source coverage and explicit verification limits. |
