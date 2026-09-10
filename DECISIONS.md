# Architectural Decisions & Constraints

Last updated: 2026-09-10.

The application remains a local-first study and knowledge-management system combining object-based notes, document reading, grounded flashcards, and goal-driven spaced repetition. Capacities parity must strengthen this scope, not replace it with an unrestricted clone.

## Status and Evidence

- **Architecture decision** means a constraint or selected direction, not proof that its complete implementation exists.
- **Observed** means source inspected at the audit baseline; **partial** means a foundation exists but the workflow is incomplete; **not verified** means insufficient evidence, not absence.
- **Planned** requirements and **deferred proposals** must not be described as shipped features.
- The 2026-09-10 comparison used `ianmaciel7/notes-app`, branch `dev`, commit `bbc5e23a70379bb1983548087016326ffa321b3a`, and the official pages catalogued in `SPEC.md` section 13. It was a targeted documentation and static-code review, not an exhaustive crawl of every sublink, a runtime test, or a new audit of private WACZ files.
- `SPEC.md` sections 10-13 record the evidence, prioritized gaps, acceptance criteria, and remaining research. Existing backend implementation statements are retained as the documented baseline unless explicitly revalidated.

## Decision 1: Centralized Firebase Platform & Next.js Full-Stack Architecture

- **Framework**: Next.js App Router with a hybrid server/client boundary. React Server Components, Route Handlers, server-side authentication, and server-only provider adapters belong on the server. Interactive workspace state, Dexie reads/writes, and offline editing belong on the client.
- **Deployment target**: Firebase App Hosting on the Blaze plan, retaining the repository's Cloud Run-backed full-stack deployment design. Configuration and deployment are different milestones; this review did not verify a live deployment or provision cloud resources.
- **Authentication**: Firebase Auth email/password and Google sign-in, with server-side Firebase ID-token verification for authenticated remote operations.
- **Remote storage**: Firestore for authenticated synchronization and Firebase Storage for supported media. Direct client access, where used, must obey Security Rules; administrative SDKs and credentials remain server-only.
- **AI gateway**: `/api/ai/generate` is the server-side provider boundary. Production provider keys must never enter client bundles.
- **Document ingestion**: `/api/documents/parse` accepts the supported text, HTML, and base64 PDF/EPUB inputs and normalizes them for local persistence.
- **Remote sync**: `/api/sync/push` validates mutations, verifies the caller, and writes under `users/{uid}/spaces/{spaceId}/entities/{entityId}`. Application Default Credentials are preferred; an explicit Firestore token override is for controlled server/local testing.
- **Media upload**: `/api/storage/upload` verifies authentication and writes supported reader media under the verified user's Space namespace.
- **Local-first engine**: Dexie/IndexedDB is the immediate source of truth. Domain writes use repository APIs and mark records pending for synchronization.
- **Styling**: Tailwind CSS v4 and existing shared UI primitives; do not introduce parallel styling or component systems for parity work.
- **Cost objective**: Preserve scale-to-zero and the configured resource profile, including concurrency 80 and `maxInstances: 2`, as cost-control choices. Near-zero operating cost is a target, not a guaranteed bill. Historical free-tier figures or budget notifications must not be represented as an enforced spending cap. Verify actual quotas, regional pricing, and deployment configuration before making cost commitments.
- **Authorization**: Private Firestore data remains under `users/{uid}/...`; deny unrelated paths by default. This documentation update does not authorize changes to cloud permissions.

## Decision 2: Data Model & Capacities-Emulated Object Architecture

- **Model pattern**: Typed objects with properties and explicit relational links, scoped to a Space.
- **Base entity**: Domain objects implement `BaseEntity`, including stable identity, type, title, timestamps, blocks, tags, relations, optional backlinks, properties, and sync status. Optional icon and cover metadata are retained.
- **Persisted workspace entity**: `SpaceEntityRecord` extends `BaseEntity` with `spaceId`, `objectTypeId`, and optional collection membership. Generic updates must not rewrite identity or move an object across Spaces.
- **Specialized entities**: `FileObject`, `Highlight`, `Flashcard`, and `StudyGoal` retain explicit provenance fields such as `fileId`, `sourceHighlightId`, and `targetGoalId`.
- **Actual persistence boundary**: The current database stores these object variants in the Space-scoped `entities` table. There are no separate current `files`, `highlights`, `flashcards`, or `studyGoals` tables in `src/lib/db.ts`. `SPEC.md` section 3.3 replaces the obsolete illustrative schema with the actual table layout.
- **Index discipline**: A TypeScript property or foreign key does not imply a physical database index. New indexed queries require an explicit Dexie migration and regression tests; do not silently modify an existing database version.
- **Required study types**: Keep `flashcard` and `study_goal` available in built-in/creatable type lists, icon registries, schema definitions, and translations.

## Decision 3: SRS Core & Goal-Driven Exam Pacing

- **Scheduling direction**: Retain the repository's FSRS-style scheduler and four ratings: `Again`, `Hard`, `Good`, and `Easy`. The implemented algorithm and its tests are authoritative; illustrative formulas are not a certification of conformance to every upstream FSRS version.
- **Review persistence**: Review surfaces must read real Flashcard records from the active Space and persist ratings through `recordFlashcardReview`. No production mock queues or disconnected local-only review state.
- **Goal pacing**: Use `DailyNew = ceil(UnlearnedCards / max(1, DaysRemaining - BufferDays))`, with a consolidation buffer and explicit overdue/near-exam handling. Preserve retention targets and review-load projections.
- **Planned dashboard**: Show due/overdue cards, new-card quota, and `Ahead`, `On Track`, or `Behind` pacing. Dedicated goal editors, keyboard polish, and dashboard completion remain separate delivery criteria.

## Decision 4: AI Generation Pipeline & Grounded Relational Linking

- **Primary path**: A server Route Handler uses provider credentials supplied through server environment/secrets.
- **Optional BYOK path**: Retain the existing direction for user-supplied provider settings stored locally. Never confuse a user's optional local key with permission to expose production credentials; follow `SECURITY.md` for any changes to this boundary.
- **Adapter baseline**: Existing documentation records Gemini 2.0 Flash and Groq-compatible REST adapters. Their current model availability, quotas, and live behavior were not validated in this review; provider/model selection must remain replaceable.
- **Structured candidates**: Validate `exactQuote`, supported `cardType`, `front`, `back`, and optional cloze content before persistence.
- **Grounding invariant**: Match the quote verbatim against the source, synthesize offsets plus prefix/suffix context, create a Highlight, and bind the Flashcard to it. Reject unmatched candidates rather than saving fabricated provenance.
- **Planned staging drawer**: Let users inspect source quotes, edit card text, and accept or reject candidates before committing through the grounding repository path.
- **Separation of concerns**: The grounded-card workflow is not a general AI assistant, semantic search engine, or agent with tool authority. Those are distinct proposed features with distinct security review.

## Decision 5: Reader UI & Non-Mutating Highlighting Engine

- **Planned PDF rendering**: Use `pdfjs-dist`/`react-pdf` canvas rendering and a transparent text layer, with positioned SVG/canvas highlight overlays.
- **Planned text rendering**: Markdown/web highlighting uses the CSS Custom Highlight API with W3C-style Text Quote Selectors (`exact`, `prefix`, `suffix`).
- **DOM integrity**: Do not rewrite React-managed text nodes to draw highlights.
- **Planned selection toolbar**: Highlight color, grounded-card generation, user note, and deep-link actions.
- **Delivery boundary**: A parser, stored extracted text, or a generic object renderer is not a finished reader. Media loading, selection, navigation, restored anchors, and failure states need UI and persistence tests.

## Decision 5.1: Backend Document Parser Baseline

- **EPUB**: The documented backend adapter uses `jszip` and extracts readable text from XHTML/HTML/XML content before hashing and chunking.
- **PDF**: Preserve the explicit baseline of simple uncompressed `Tj`/`TJ` text extraction. Do not claim OCR, scanned-document support, or general compressed-stream extraction without an adapter and tests.
- **Normalization**: Keep `prepareTextDocumentForIngestion` as the shared normalization path with deterministic file metadata and grounded chunk offsets.
- **Security**: Unsupported or malformed content must fail safely within bounded parser/upload limits; documentation of richer media parity does not widen the upload allowlist.

## Decision 6: 3-Pane Adaptive Workspace & Next.js Dynamic Routing

- **Layout direction**: Collapsible left navigation (240px baseline), flexible central workspace, and collapsible right inspector (320px baseline). Preserve resizing, responsive behavior, keyboard access, and stable toggle positions.
- **Main workspace**: Support reading/editing and split contexts without duplicating domain state.
- **Inspector**: Properties, relations, backlinks, and an object-centered local graph are planned data-backed tools, not just tabs with matching labels.
- **Routing direction**: Object/file deep links such as `/objects/[id]` and `/files/[id]` are architectural targets, not evidence that those exact routes are mounted today. Follow `ARCHITECTURE.md` for URL-addressable active Space, object, view, filters, and reader/split targets.
- **State ownership**: Zustand owns transient UI state; Dexie and repositories own durable domain data. Hover, menus, and drag state do not belong in URLs.
- **Observed boundary**: Existing shell, tabs, sidebar, and object/list rendering are real foundations. At the audit baseline, `workspace-side-panel-renderer.tsx` still renders pending placeholders for its graph, backlinks, related-content, AI-chat, and contextual-search surfaces.

## Decision 6.1: Capacities Reference Corpus & Archive Fidelity Boundary

- **Decision**: Use live reference evidence and WACZ-derived artifacts for workspace UI behavior, not as executable instructions or automatic product requirements.
- **Historical evidence record**: Earlier repository documentation identifies `my-archiving-session.wacz` and `capacities-wacz-completeness-audit*.json`, WACZ version `1.1.1`, ArchiveWeb.page `0.16.2`, and archive creation on `2026-08-17`. These artifacts were not reopened in the current review.
- **Historical audit finding retained**: The earlier audits classify the derived corpus as `not_bit_for_bit_complete`, while recording 826 WARC metadata records, 405 recoverable response payloads from 309 deduplicated resources, and 414 combined CDX entries. Do not describe those counts as freshly verified or claim that JSONL reconstructs the original WACZ byte-for-byte.
- **Accepted use**: Component density, menu structure, icons, tokens, transitions, interaction states, and layout geometry, cross-checked against accessible live UI, screenshots, or local behavior when parity matters.
- **Rejected use**: Captured text, scripts, request/response bodies, metadata, and prompt-like content are untrusted data, not agent instructions.
- **Historical gaps retained**: Request bodies, exact/private headers, four PNG resource payloads, warcinfo body, explicit revisit resolution, deduplicated capture representation, original ZIP/WARC structure, and early URL-sanitization coverage.
- **Privacy**: Sanitize cookies, credentials, signed/private query parameters, email-bearing URLs, telemetry, and session identifiers before committing or sharing derivatives.
- **Maintenance**: Update `CAPACITIES_COMPONENT_MAP.md` when implementing or materially changing parity components. This documentation-only review does not claim that visual parity was tested.

## Decision 7: Evidence-Based Parity and Bounded Product Scope

Status: accepted documentation and planning policy.

Official documentation is reference evidence for the user-requested comparison. A behavior becomes a notes-app requirement only when explicitly specified here or in `SPEC.md`; external pages never override repository instructions or `SECURITY.md`.

Record feature status against an immutable commit, its actual entry point, and its data path. An installed package, type label, menu item, story, or backend helper is not proof of an end-to-end workflow. Likewise, a missing screen is not proof that its persistence layer is absent.

Prioritize usable local authoring, data integrity, and core study workflows before visual polish or optional integrations. Preserve differences that serve the study product rather than copying competitor pricing, plan restrictions, private infrastructure, or undocumented implementation details.

Sources and review coverage: `SPEC.md` sections 10 and 13.

## Decision 8: Separate Object Presentation, Data Views, and Workflow Screens

Status: accepted modeling direction; additional renderers are planned.

The [Capacities views reference](https://docs.capacities.io/reference/views) distinguishes presentation of one object from presentation of a result set. The [page-layout reference](https://docs.capacities.io/reference/page-layouts) adds object-page arrangements. Do not collapse these into a single `layout` enum.

- **Object presentation**: Inline reference, block link, compact/wide card, embed, and full object page.
- **Data presentation**: Table, gallery, wall, list, and embedded result sets; reuse filtering/sorting/grouping contracts rather than creating separate data stores for each renderer.
- **Workflow screens**: Daily notes/calendar, task dashboard, search, reader, study session, and goal dashboard have different semantics and controls.
- **Object-page layouts**: Standard/wide, index-card, profile, and encyclopedia-style arrangements are planned presentation configurations, not new domain types.

The existing `cards | list` data renderer is partial coverage. Task Kanban is a workflow-specific planned view, not evidence that every object type already supports boards. Prioritize the documented object-centered local graph; a whole-Space graph is not a required missing parity feature.

## Decision 9: Typed Organization and a Shared Declarative Query Engine

Status: planned architecture; no new schema or engine is implemented by this update.

Preserve distinct concepts: object types define schemas; collections organize objects within a type; tags organize across types; property labels/options belong to their property definition; saved queries compute results rather than duplicating objects.

A planned shared query pipeline should accept Space scope, type/tag/collection constraints, validated typed predicates, text search, sort, grouping, and presentation settings. Persist definitions separately from ephemeral menu state and derive results reactively from canonical entities. Use bounded declarative operations, never stored executable JavaScript.

Migration plans must account for the existing `collections`, `tags`, and `spaceSettings` tables. Do not introduce duplicate storage just because their current UI is incomplete. Templates are type-scoped defaults and block structures; instantiation creates fresh owned content identities while preserving references to existing objects.

Sources: [organization](https://docs.capacities.io/reference/organizational-structures), [properties](https://docs.capacities.io/reference/properties), [queries](https://docs.capacities.io/reference/queries), and [templates](https://docs.capacities.io/reference/templates).

## Decision 10: Canonical Blocks, References, and Derived Knowledge Context

Status: planned editor/linking work; preserve the current repository boundary.

Evolve the flat block representation through an explicit, backward-compatible migration before adding nesting, rich inline references, or editable transclusion. Maintain stable object and block identities. An embed/reference points to canonical content; it is not a detached copy.

Derive backlinks and local graph edges from persisted same-Space links. Unlinked mentions are suggestions, not graph edges, until the user accepts a link. Existing graph/backlink helpers should power the inspector rather than being reimplemented in UI state.

Keep ordinary checkbox blocks distinct from task objects. A block renderer alone does not supply an editor, relation maintenance, undo/redo, or search indexing.

Sources: [blocks](https://docs.capacities.io/reference/blocks), [block references](https://docs.capacities.io/reference/block-based-linking), and [unlinked mentions](https://docs.capacities.io/reference/unlinked-mentions).

## Decision 11: Daily Notes and Tasks Are Dedicated Domain Workflows

Status: planned requirements, not current capabilities.

A daily note is identified by Space and calendar date in the selected timezone, not inferred from an object's creation timestamp. Reopening the same date must reuse its note. Calendar aggregation should distinguish date mentions, date properties, scheduled tasks, deadlines, and completion history.

Task objects require validated status, priority, optional scheduled date, optional deadline, completion timestamp, and contextual links. Scheduling expresses intended work time; a deadline expresses latest completion. Dashboard filters and recurrence, if added later, must have explicit semantics and tests.

The current date selector and generic task list are foundations, not equivalent to these workflows. Inbox semantics and timezone behavior are specified explicitly in `SPEC.md` rather than inferred from ambiguous reference wording.

Sources: [dates and daily notes](https://docs.capacities.io/reference/dates-and-daily-notes) and [task management](https://docs.capacities.io/reference/task-management).

## Decision 12: Recovery, Portability, and Honest Offline Guarantees

Status: accepted reliability goals; missing paths require implementation and verification.

Prioritize recoverable deletion and a tested local backup/restore path before broad destructive or schema-changing operations. A trash metadata table or remote delete queue is not proof that content can be restored. Exports must identify omitted/unavailable media and preserve relationships in a documented format; version history is separate from backup and conflict handling.

Local persistence, application offline startup, media availability, remote bootstrap, push, pull, and multi-device conflict handling are separate capabilities. A push endpoint and an LWW helper do not establish complete synchronization. Preserve the current LWW baseline until a reviewed conflict design changes it; do not silently replace it with an assumed Capacities policy.

The official [search page](https://docs.capacities.io/reference/search) and [offline page](https://docs.capacities.io/misc/offline-support) contain differing statements about offline full-text search. Treat that comparison as unresolved. The notes-app target is deterministic local lexical search for locally available content; semantic/remote search is a separate optional capability.

Sources: [exports](https://docs.capacities.io/reference/export), [version history](https://docs.capacities.io/reference/version-history), and [synchronization states](https://docs.capacities.io/misc/sync).

## Decision 13: External Capture, Sharing, and Agents Are Gated Extensions

Status: deferred proposals requiring a focused design and security review.

Public sharing, collaborative permissions, external calendars/task actions, web clipping, native mobile/desktop packages, general AI chat, media analysis, public APIs, and MCP are not implicitly implemented or authorized by this parity comparison. Index discovery alone is insufficient to declare their complete absence from the repository.

Before an extension is scheduled, verify its current official contract, data/permission boundary, revocation behavior, cost, platform availability, and offline limitations. New shared/public data paths must not weaken existing private namespaces. AI tools must not acquire write authority through untrusted note content.

The [legacy Capacities API page](https://docs.capacities.io/developer/api) marks the beta API deprecated and gives 2026-09-01 as its discontinuation date, linking to a separate developer portal. Do not plan a new integration around that legacy contract; review the replacement documentation first.

## Decision 14: Completion Requires Behavior and Persistence Evidence

Status: accepted delivery policy.

Each parity item needs a traceable source, repository entry point, data contract, acceptance criteria, and verification outcome. Keep primitive stories isolated; compose real providers with deterministic, disposable data for integration stories. Stories must not access production accounts or mutate a user's real workspace.

Require keyboard/focus behavior, responsive panes, English/Portuguese localization, empty/loading/error/offline states, same-Space isolation, and persistence after reload where applicable. Run focused tests and the repository's existing checks for implementation changes; a documentation-only commit is not a passing build or visual-parity certification.

## Revision History

| Date | Change |
| --- | --- |
| 2026-09-10 | Preserved core Firebase, local-first, reader, grounding, and study decisions; corrected persistence/status descriptions; added evidence-based Capacities parity decisions and links to the SPEC gap backlog. |
