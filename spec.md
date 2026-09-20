# Technical Specification: Recall — Community Exam Prep Platform

- Author: Project team
- Created: 2026-09-19
- Updated: 2026-09-19 (implementation and screen audit)
- Status: approved — product owner approved 2026-09-19; implementation remains in progress (see §9 and §12)
- Related: [Intent](intent.md)

## 1. Summary & Scope

This specification turns [intent.md](intent.md) into requirements and a design/technical plan that engineering can build from. It covers the MVP object model (`Questions`, `Exams`, `Tags`, `Collections`, `Notes`, `Citations`), the Space-based multi-tenant architecture, the spaced-repetition study loop, the read-only MCP surface, and the sidebar, tab, dialog, popover, menu, and context-panel interaction contracts recovered from the historical worktrees. It does **not** cover monetization, voting, discussion threads, or the deferred question formats (`ordering`, `hotspot`, `simulation`) beyond reserving their schema slot.

**Updated 2026-09-19:** Spaces are now private-only (intent.md Constraints) — there is no public/anonymous browsing surface anywhere in this spec. This resolves what used to be §9's biggest open tension (public visibility vs. tenant isolation), at the cost of a new one: intent.md's Proposed outcome still calls this "crowdsourced," which is now an open question there, not assumed resolved here.

A companion visual exploration (Space Home, Question object detail with links/backlinks, Study Session, Spaced-Repetition Review Queue) is being produced alongside this document as a Design artifact for the same review pass.

## 2. Requirements

### 2.1 Functional

- **FR-1 Spaces** — every object belongs to exactly one Space; a user can own or belong to multiple Spaces.
- **FR-2 Objects** — `question`, `exam`, `tag`, `collection`, `note`, `citation` are first-class, independently addressable objects with a shared content shell (TipTap JSON body).
- **FR-3 Graph linking** — any object can be bidirectionally linked to any other object (e.g. Question ↔ Citation, Question ↔ Note) with a typed relation, without a schema migration per new relation type.
- **FR-4 Question formats** — MVP UI supports `single-choice`, `multiple-choice`, `fill-blank`, `matching`. `ordering`, `hotspot`, `simulation` exist as a reserved discriminator value only — no authoring UI, no study-mode renderer, no Server Action accepts them as a submitted attempt.
- **FR-5 Spaced repetition** — missed questions enter a review queue; the schedule (interval, ease factor, next review date) is computed server-side.
- **FR-6 Space-scoped browsing** *(revised 2026-09-19 — was "Community browsing")* — any signed-in member of a Space can browse and read every object in it, at no cost. There is no anonymous or public read path; "browsing without an account" no longer applies to anything.
- **FR-7 MCP read surface** — an MCP-compatible client can query `Questions`, `Notes`, `Citations` for a study session, scoped to Spaces the authenticated caller belongs to. No write, admin, or user-state tool is exposed in v1.
- **FR-8 Backlinks navigation** — from any object's page, a user can see every other object that links to it, not only the ones it links out to.
- **FR-9 Report-and-hide moderation** *(revised 2026-09-19)* — any member of a Space can report an object in that Space. A reported object is hidden from other members pending review by the Space's admin or a platform admin; the owner keeps edit access. No pre-publish review gate exists. Since nothing is ever public, this is now moderation of shared-Space abuse between members, not community moderation.
- **FR-10 One Exam per user** — a user may own at most one `Exam` object; a Server Action rejects creating a second. Confirmed by the product owner 2026-09-19; flagged in §9 as an unusual constraint worth a sanity check, since it blocks a user preparing for two certifications from authoring two exams — implemented as stated, not second-guessed.
- **FR-11 Study session configuration** *(added 2026-09-19)* — before a Study Session starts, a user configures: **scope** (all due reviews, or narrowed to a specific `Exam`, `Tag`, or `Collection`), **question count**, and **mode** — `practice` (immediate per-question feedback, the existing Study Session behavior) or `simulated_exam` (timed, question order and formatting match the target certification exam, no feedback shown until the session ends, matching FR-10's one-`Exam`-per-user scope). `simulated_exam` additionally requires a time limit. A Server Action resolves {scope, count, mode} into a question set at session start — this is session configuration, not a new persisted object type; no schema change to §6 is implied.
- **FR-12 Workspace interaction surfaces** *(added 2026-09-20)* — dialogs, command palettes, popovers, menus, workspace tabs, and context-panel tabs MUST use semantic roles and one canonical state transition per action. Opening or focusing a transient surface MUST NOT mutate domain data; explicit create, link, rename, delete, or study actions commit through the authenticated mutation boundary.

### 2.2 Non-Functional

- **NFR-1 Tenant isolation** — a user must never be able to read or enumerate another Space's private objects through the UI, Server Actions, or MCP.
- **NFR-2 Document size** — no Firestore document may approach the 1 MiB limit; large relation fan-out lives in `object_links`, never as arrays on the object.
- **NFR-3 Accessibility** — WCAG 2.1 AA: real semantic controls (`button`, `a[href]`, labelled inputs), 4.5:1 text contrast, visible focus states, 44px touch targets.
- **NFR-4 Free tier availability** *(revised 2026-09-19)* — core study features (all object types, spaced repetition, MCP read access) must not require a paid plan for any Space member. No longer framed around "public content," since none exists.
- **NFR-5 Workspace shell behavior** *(added 2026-09-20)* — sidebar open/closed state, mobile drawer state, resize/peek behavior, nested navigation, keyboard shortcuts, hover-revealed row actions, workspace tabs, context-panel tabs, dialogs, popovers, and menus must be deterministic, keyboard-equivalent, and covered by focused interaction tests. Desktop persistence must not leak into mobile drawer state or transient surfaces.


### 2.3 Users and flows

- **Self-study learner:** joins/opens a Space → authors or reviews a Question → links it to a Citation and/or Note → studies via a Study Session → on a miss, the question enters the review queue → reviews it again on its computed schedule (FR-5).
- **Content creator:** creates/manages Spaces, authors Questions/Exams/Notes/Citations, sets object visibility, links objects into the graph (FR-2, FR-3).
- **External MCP client:** authenticates by a mechanism TBD (§7.2, §9.5) → queries `Questions`/`Notes`/`Citations` scoped to what that caller is authorized to see → performs no writes (FR-7).

### 2.4 States and edge cases

#### 2.4.1 Concrete Empty States
- **New Space (0 items):** Renders an onboarding canvas featuring a welcome banner, an overview of the knowledge graph model, and action buttons to create the first `Question`, `Note`, `Citation`, or `Exam`. Includes quick-start templates for common certifications without showing broken tables or blank viewports.
- **Review Queue (0 due items):** Renders a celebratory "All caught up!" milestone card with an illustrated completion badge, displaying the exact timestamp countdown to the next scheduled review. Provides secondary actions to start an ad-hoc practice session, explore new cards, or review items ahead of schedule.
- **Question List / Search (0 matches):** Renders a focused "No matching questions" state reflecting the active filter or query terms. Provides a single-click "Clear filters" button and a contextual "Create new question with this title" action that pre-fills the creation dialog with the current search query.
- **Unlinked Object Panels (0 outbound links / 0 backlinks):** Renders a muted placeholder with an inline "+ Connect related Note or Citation" trigger. Backlinks panel displays a gentle "No references yet — link to this item from any Note or Question" guide.

#### 2.4.2 Skeleton Loading States
- **Card Skeletons (Preserving CLS < 0.05):** Object cards, questions, and feed items render fixed-dimension skeleton placeholders with animated shimmer using neutral design tokens (`--muted`). The bounding box dimensions match the fully rendered typography and badge layout exactly, preventing layout shifts (CLS strictly < 0.05 across desktop and mobile viewports).
- **Sidebar Tree Skeleton:** The navigation hierarchy displays pulsing row placeholders with fixed indentations matching the exact tree depth (Space switcher, pinned objects, collection groups, utility links) to eliminate jank as workspace metadata streams in.
- **Review Prompt Skeleton:** The active question card in review and study sessions renders a skeleton block matching the question prompt height and 4 choice option card skeletons, ensuring the UI remains rock-solid during card transitions and question fetching.
- **Asynchronous Panel Streams:** The main object detail view, "Linked objects" rail, and "Backlinks" inspector load independently via React Suspense boundaries. Failure or slow response in backlinks never delays the primary content editor.

#### 2.4.3 Error, Network & Boundary States
- **Network Interruption During Review Grade Submission:** When a user rates a card in the review queue and the network is unavailable, the client optimistically records the grade locally and enqueues the mutation into an indexed client retry queue. The engine retries submission using exponential backoff with jitter. Mutations include an idempotency key (`${userId}_${questionId}_${attemptTimestamp}`) ensuring duplicate delivery produces the exact same schedule state without duplicate history entries. A non-blocking amber status pill notifies the user if retries are pending.
- **Simulated Exam Timer Expiration:** When the countdown reaches `00:00`, the client-side timer immediately transitions the exam state to `submitted`, locks all option inputs from further editing, and dispatches the answers to the Server Action. The server enforces a strict 15-second network grace window (`examDurationSeconds + 15`). Attempts arriving within the grace window are accepted; attempts submitted beyond the grace window are trimmed to answers recorded prior to expiration or rejected with `SESSION_EXPIRED`. Answers and score breakdown are calculated and revealed only after successful session termination.
- **Cross-Space Authorization & Forbidden Access (404 vs. 403):** If an authenticated user navigates directly via URL or graph link to an object belonging to a Space where they are not a member, the application responds with an explicit **404 Not Found** (not a 403 Forbidden). This prevents cross-tenant enumeration attacks and avoids leaking whether an object ID exists.
- **Atomic Compound Mutations & Partial Failures:** All multi-document operations (e.g. creating an object and its corresponding `object_links` edge) execute inside an atomic Firestore batch (`batch.commit()`). If either write fails, the entire transaction rolls back, preventing orphaned edges or unreachable nodes. Failed Server Actions return structured error payloads `{ success: false, error: string, retryable: boolean }` and preserve user form input in local state.
- **Transient Surface Invariants:** Dialogs, popovers, and menus restore focus to their triggering element upon dismissal (Escape key or backdrop press). Closing a dirty authoring dialog prompts an explicit confirmation modal before discarding input.

## 3. Architecture Overview

The platform is a Next.js (App Router) web application functioning as a graph-based Personal Knowledge Management (PKM) and exam-prep system. It uses a multi-tenant, Space-based architecture on Firebase (Firestore, Auth, App Hosting). The core UI pattern is an object-oriented, block-based editor, in the spirit of Capacities' fluid object navigation.

### 3.1 Historical worktree evidence and migration boundary

The `.worktrees/` directory contains Git linked worktrees, not runtime UI workspaces. Each directory is an independent checkout with its own branch and commit history. Code must not read another worktree at runtime, and a worktree must not be treated as a tenant, Space, or user-visible object.

The current inventory is:

| Worktree | Evidence found | Intended use |
| --- | --- | --- |
| `old`, `old-1`, `old-3`, `old-7` | Early Graphify, planning, shell, and governance experiments | Historical reference; remove only through an explicit cleanup decision |
| `old-2` | Capacities-style `workspace-shell.tsx`, navigation, context tabs, graph panel, tooltip/popover behavior | UI shell reference; port selectively into the localized app |
| `old-4` | Block editor, workspace database/query/graph layers, E2E and interaction evidence matrices | Editor and relationship implementation reference |
| `old-5` | FSRS, AI/document extraction, Firestore sync queue, D3 graph | Study, sync, and intelligence reference |
| `old-6` | Plate editor, Dexie repositories, object controls, local-first data access | Alternative editor and repository reference |
| `old-8` | Revisa study/deck/card viewer and FSRS workflows | Study UI and scheduling reference |
| `old-9` | Current Firebase Auth/i18n, private Spaces, immutable revisions, exams, attempts, and FSRS domain/actions | Most complete application baseline; preferred source for domain and authorization contracts |

The root `prototype` checkout currently contains the Next.js/shadcn scaffold and does not contain the historical workspace shell or application domain modules. Therefore, a feature found only in a worktree is evidence for the design and migration plan, not evidence that it is already available on the root branch. The detailed audit is [`.worktrees/old-9/docs/research/worktrees-audit.md`](.worktrees/old-9/docs/research/worktrees-audit.md), with older visual/interaction evidence in `.worktrees/old-4/artifacts/reference-evidence/`.

#### Sidebar-specific evidence map

The linked worktrees were compared as evidence sources, not as competing runtime implementations. The following map is the source-of-truth order for the sidebar migration:

| Worktree | Sidebar evidence | Authority in this spec | Migration decision |
| --- | --- | --- | --- |
| `old-2` (`7d142092`) | `src/components/workspace-shell.tsx`, `src/lib/workspace-navigation.ts`, focused tests, and the `workspace-sidebar` OpenSpec | Responsive navigation semantics: real links, active parent matching, mobile open/close, Escape, focus order, and reduced motion | Port the navigation contract and labels selectively; do not port the 3,440-line shell wholesale |
| `old-3` (`19105d01`) | `src/components/capacities-sidebar.tsx` and the stock `ui/sidebar.tsx` | Early Capacities layout comparison only | Historical reference; superseded by `old-4`/`old-5` for implementation decisions |
| `old-4` (`2839f410`) | `src/components/app-sidebar*.tsx`, `src/components/app-shell.tsx`, `openspec/specs/ui/app-sidebar`, parity behavior JSON, and E2E matrices | Primary visual/composition contract: workspace selector, pinned/object-type sections, nested actions, stable row geometry, scroll regions, shell ownership, and matched reference measurements | Preferred sidebar composition and parity evidence; port in small slices behind the root shell boundary |
| `old-5` (`0857a997`) | `src/app/_components/workspace/app-sidebar*.tsx`, `app-shell.tsx`, `sidebar-navigation-trace.ts`, and `tests/sidebar-scroll-parity.spec.ts` | Runtime interaction instrumentation and focused browser proof: trace capture, scroll behavior, hover affordances, space-switcher focus, and footer/utility semantics | Port observability and test ideas; do not treat Capacities-specific copy or links as product decisions |
| `old-6` (`f336db18`) | `src/components/space/space-shell.tsx` and its tests/stories | Alternative local-first shell and object-control reference | Secondary architectural reference; not the sidebar source of truth |
| `old-7` (`e5d9048a`) | `src/components/space/space-sidebar.tsx` and shell tests | Intermediate space-shell prototype | Historical reference; superseded |
| `old-8` (`d930d7a7`) | Shared sidebar primitive alongside study/deck screens | Study-route integration context only | Do not use as the primary sidebar contract |
| `old-9` (`dae84427`) | Shared `src/components/ui/sidebar.tsx` plus Firebase/Space application baseline | Domain/authentication baseline, not sidebar parity | Prefer for authorization and route integration; sidebar behavior remains governed by `old-2`/`old-4`/`old-5` evidence |

The current root implementation is only `src/components/ui/sidebar.tsx` and its dependent primitives. It already provides the seven-day desktop cookie, controlled/uncontrolled desktop state, a mobile Sheet, 16rem/18rem widths, and stock collapse variants. It does not yet prove the full contract above: bounded resize, separate non-persistent peek state, side-aware shortcut behavior, nested highlight scope, stable action gutters, or the tested persistence/mobile/reduced-motion matrix. These are requirements to implement and verify, not capabilities inherited from the similarly named primitive.

The merged Graphify evidence used for this audit is `graphify-out/worktrees-merged-graph.json`; it is an analysis artifact and must not be loaded by the application at runtime. No application code may scan `.worktrees/`, import from a linked checkout, or treat a worktree name as a Space, tenant, route, or user-visible object.

#### Sidebar migration and rollout boundary

1. Implement the root shell boundary and the shared navigation model first, using `old-2` for route and mobile semantics.
2. Port `old-4`'s compositional pieces incrementally: workspace selector, primary rows, pinned/object-type sections, nested actions, and footer. Keep `AppShell`/`SidebarProvider` as the sole owner of width, collapse, and mobile presentation.
3. Port `old-5`'s trace hooks and focused browser assertions as observability/test support, adapting labels and routes to Recall rather than copying Capacities-specific content.
4. Verify the root branch at desktop and narrow widths, with keyboard, Escape, reduced-motion, persistence, resize/peek, nested-action, and no-horizontal-overflow checks before calling the sidebar migrated.
5. Keep all linked worktrees and branches until the selected contracts have passed root verification. Any later worktree removal is a separate, explicit cleanup decision; it is not part of sidebar implementation.

#### Cross-worktree subsystem synthesis

The sidebar/dialog audit also exposed important non-visual architecture. These findings are evidence for the root design, not permission to combine incompatible branches wholesale:

| Concern | Strongest evidence | Root specification decision |
| --- | --- | --- |
| Authentication and tenant boundary | `old-9/src/data/action-auth.ts`, `spaces.ts`, `objects.ts`, and Firebase Admin/server-only imports; `old-5/src/lib/auth/firebase-auth.ts` and auth tests | Every server read/write first authenticates the caller, then verifies `spaceId` membership/ownership, then reads or mutates data. Admin SDK and credentials remain server-only. A UI route, dialog, tab, or MCP query must never be its own authorization boundary. |
| Object lifecycle and revisions | `old-9/src/data/objects.ts` implements draft → published → archived transitions, immutable revision records, version increments, and Firestore transactions | Treat object identity and object revision as separate concepts. Edits create a new revision; publishing/archiving is an explicit transition. UI previews and tabs may select a revision but must not publish it implicitly. This supplements §6 and FR-12. |
| Relations and backlinks | `old-9/src/data/object-relations.ts`; `old-5`/`old-6` compound Space-scoped relation stores; `old-5` side-panel renderer tests that exclude foreign-space sources | Relation records must carry and validate `spaceId`, both endpoints must belong to that Space, and backlinks must filter by the active Space before rendering. Relation replacement must be transactional/batched and must not accept cross-Space IDs. |
| Study scheduling | `old-9/src/domain/study/fsrs-scheduler.ts`, `study.ts`, `study-actions.ts`; `old-8` Revisa/FSRS queue and card viewers; `old-5` SRS engine | These branches provide mature FSRS implementations, deterministic scheduling, ratings, queue construction, state versions, and idempotency patterns. They conflict with the product decision for SM-2 in `intent.md`; therefore FSRS is historical implementation evidence and an alternative to evaluate, not a silent replacement for SM-2. The plan must choose one algorithm before build and record migration/versioning consequences. |
| Local-first and sync | `old-5/src/lib/db.ts`, sync queue/writer modules, and sync tests; `old-6` Dexie repositories and compound `[spaceId+id]` keys | Local-first persistence, offline mutation queues, optimistic state, and cloud sync are valuable alternatives but are not assumed for the greenfield root MVP. If adopted, all local keys and queued mutations remain Space-scoped, retries are idempotent, conflicts are observable, and failed mutations remain recoverable. |
| Editor architecture | `old-4/src/editor/` block editor/query engine and E2E suites; `old-6/src/components/editor/` Plate v53 integration and ADR 0012 | Both are references, not simultaneous dependencies. The implementation plan must select one editor/data model, define serialization and migration boundaries, and prove that read-only previews cannot mutate source blocks. |
| AI and document ingestion | `old-5/src/lib/ai/`, grounded-card orchestration, document binary extractors, and provider/error tests | AI generation, provider keys, PDF/EPUB extraction, and grounded card creation are not part of the current MVP requirements. If later added, provider calls must remain behind a server gateway, reject fabricated/un grounded output, and never expose keys or raw upstream secrets. |
| Verification and observability | `old-4/tests/e2e/` and parity artifacts; `old-5/tests/` and sidebar trace; `old-9` Firebase/domain/action tests | Port test fixtures/contracts selectively into the root. Required proof spans unit/domain tests, auth/data isolation tests, interaction tests, and browser tests at desktop/mobile sizes. Reference screenshots and ARIA captures are evidence, not substitutes for executable root tests. |

Important negative finding: no worktree is a complete drop-in implementation for Recall. `old-9` is strongest for authenticated domain actions; `old-4` for editor/workspace parity; `old-5` for local-first/sync/SRS/AI and runtime shell instrumentation; `old-6` for Plate/Dexie; and `old-8` for study UI. The root plan must preserve those boundaries and document every material choice.

## 4. Technology Stack

- **Framework:** Next.js (React 19), App Router.
- **Language:** TypeScript.
- **Package Manager:** pnpm.
- **Styling:** Tailwind CSS v4.
- **Base UI:** shadcn/ui (already scaffolded — see §5) on top of `@base-ui/react` primitives.
- **Rich Text / Block Editor:** TipTap (headless, custom UI).
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth (Email/Password, Magic Link, Google).
- **Hosting & CI/CD:** Firebase App Hosting.

> The originally proposed "Fluid Functionalism" registry and "Shoogle" component library are **not** currently wired into this stack (`components.json` has `"registries": {}`) and are flagged for a supply-chain review in §9 before any adoption.

## 5. Design System & UX Standards

### 5.1 Current baseline (already in the repo — this is the real starting point)

- `components.json`: shadcn `style: "base-nova"`, `baseColor: "neutral"`, CSS variables on, Lucide icons, no external registries configured.
- `src/app/globals.css`: OKLCH token set (`--background`, `--foreground`, `--primary`, `--card`, `--sidebar-*`, `--chart-1..5`, `--radius` with derived `sm/md/lg/xl/2xl/3xl/4xl` scale) plus a `.dark` variant — a neutral, grayscale foundation with no brand hue defined yet.
- `src/components/ui/button.tsx`: a `cva`-driven `Button` on `@base-ui/react`'s primitive, with variants `default | outline | secondary | ghost | destructive | link` and sizes `xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg`, `focus-visible` ring, `aria-invalid` states, and icon-aware padding.

There is no separately documented brand guideline, security policy, or UX standards document in this repository today. This spec therefore treats the tokens and component conventions above as the de facto baseline and extends them, rather than inventing a policy that isn't there — see §9.1.

### 5.2 Proposed extension for object-oriented PKM

- Add a small **object-type accent layer** on top of the neutral base — one semantic token per object type (`--color-object-question`, `--object-exam`, `--object-note`, `--object-citation`, `--object-tag`, `--object-collection`) used only for identity chips, dots, and left-rail icons, never for full-surface theming. This preserves the existing neutral `base-nova` surfaces/typography.
- Capacities-style interaction patterns to build on existing primitives (no new UI kit required for MVP): an object detail page with a "Linked objects" panel and a "Backlinks" section (FR-8), a command palette (⌘K) for quick capture/search, and inline object chips inside the TipTap editor.
- A visual pass covering Space Home, Question object detail, Study Session, and the Spaced-Repetition Review Queue is being delivered as a separate Design artifact for this same review; treat it as illustrative of the layout/interaction direction, not as a pixel-locked spec.
- Accessibility follows NFR-3: every interactive mockup element maps to a real semantic element in implementation.

### 5.3 Interaction state and event logic

The UI must distinguish presentation-only hover from state-changing activation. Hover and focus may reveal an action, but opening a selector or preview must not mutate data until the user explicitly chooses a command and the corresponding Server Action succeeds.

| Surface | Hover/focus behavior | Click/keyboard behavior | State and persistence contract |
| --- | --- | --- | --- |
| Header/context actions | Reserve the action's geometry; fade contextual controls from transparent/inert to visible. `focus-within` must provide the same affordance as hover. | Activate with pointer, Enter, or Space; Escape/outside click closes transient menus. | Reveal is local UI state only; no write on hover or menu open. |
| Object rows and related-content rows | Keep title and type geometry stable. Show row actions without shifting content; the observed local contract is about 200–300 ms for fades. | A disclosure/caret is a separate target from the title. Disclosure toggles an embedded read-only preview; title navigates to the object. | Expansion is reversible local state. Derived relationship panels read data; they do not create a relationship merely by opening. |
| Tags and collections | Keep chip dimensions stable; reveal removal/disclosure affordances on hover and focus. | Click opens the selector; selection is a distinct commit action. | Opening/focusing is non-mutating. Create, rename, add, and remove go through authenticated Server Actions and expose pending/error feedback. |
| Space switcher | Use normal hover/focus treatment for the trigger and menu items. | Click/keyboard opens the menu; create and rename use a labelled form. Successful create navigates to the new Space and refreshes; failure keeps the form open with an error. | Space membership and names are server-authoritative; no client-supplied owner or cross-Space override. |
| Question card | Status styling must remain understandable without hover. | Selecting an answer updates local answer state; Check grades once, Reveal toggles feedback, Reset clears the local attempt, and Bookmark toggles the local optimistic state before awaiting persistence. | Read-only/revealed cards reject answer edits. Attempt and study mutations are idempotent and authenticated. |
| Graph/context panel | Nodes and controls expose selected/focused states; panel controls remain reachable without a pointer. | Node click/Enter selects a node. Background pointer drag pans using pointer capture; pointer up/cancel releases capture. Zoom and connection visibility are bounded local controls. | Pan, zoom, selection, and connection visibility are view state; selecting a node does not mutate the object graph. |
| Icon-only controls and tooltips | Tooltip appears after the shared delay; the control remains keyboard reachable. | The control's accessible name is the action label, not the icon name alone. | Tooltips describe an action and never substitute for an accessible name or visible state. |

Interaction invariants:

- Hover must never be the only way to reach an action; use `focus-within`, `aria-*`, and semantic buttons/links.
- Hover/focus reveals must reserve space or use an overlay so neighboring content does not move.
- Transient UI state (menu open, selected tab, disclosure, preview, pan, zoom) is separate from persisted domain state.
- A pending Server Action disables or otherwise guards duplicate activation and reports failure without discarding user input.
- Respect `prefers-reduced-motion`; preserve the final state while removing nonessential transitions.

The concrete evidence for these rules includes the old-2 `WorkspaceShell` handlers, the old-9 `SpaceSwitcher` and `QuestionCard`, and the old-4 object-page hover/click matrices. These are reference contracts, not a claim that the root scaffold already implements them.

### 5.4 Sidebar contract and Fluid Functionalism reference

The supplied [Fluid Functionalism Sidebar documentation](https://www.fluidfunctionalism.com/docs/sidebar?preset=sa1FQfCxG4) and its [open-source repository](https://github.com/mickadesign/fluid-functionalism) provide useful reference behavior. They are not a dependency decision. The repository supports both Radix and Base UI flavors, while this project already uses Base UI and has no configured external shadcn registry (`components.json` has `registries: {}`). No registry component should be installed or overwrite local primitives without a separate dependency and security review.

Reference behaviors worth carrying into the product contract:

| Concern | Reference behavior | Recall decision |
| --- | --- | --- |
| Open state | Controlled `open`/`onOpenChange` and uncontrolled `defaultOpen` are both supported. | Keep the shell controllable so routing/layout state can own it, while allowing an uncontrolled default for simple surfaces. |
| Persistence | Desktop open state is stored in a `sidebar_state` cookie for seven days; mobile drawer state is temporary. | Persist only the desktop shell state. Do not persist an open mobile drawer or a transient peek. |
| Collapse and peek | The rail can be dragged to resize, clicked to collapse, and configured with `peek: none \| hover \| click`. Peek is a floating overlay, dismissed by Escape or outside press, and never pins or writes the cookie. | Adopt this distinction. `open`, `peek`, and `mobileOpen` must be separate state variables; a peek must never be treated as a durable open state. |
| Resize limits | The documented rail resize range is 160–360px; dragging past the minimum collapses. | Use bounded resize with an explicit min/max and an accessible alternative to dragging. Confirm final values during the visual implementation pass. |
| Responsive behavior | Below a 768px breakpoint, the sidebar becomes a modal drawer with an 18rem width; desktop defaults to 16rem. | Align the shell breakpoint with the existing `useIsMobile` contract, then verify the exact transition and focus trap in browser tests. |
| Shortcuts | The reference uses side-aware `[`/`]` shortcuts, scoped to the innermost provider containing focus. | Adopt side-aware `[`/`]` shortcuts for the shell, prevent conflicts with editor/browser behavior, and test nested providers. The current root `Ctrl/Cmd+B` behavior is a migration gap. |
| Variants | `sidebar`, `floating`, and `inset` variants change surface/geometry; `offcanvas` and `none` describe collapse behavior. | Preserve variants as layout choices, not separate business logic. The active object content remains the stable region while the shell changes around it. |
| Sections and nesting | Group labels can collapse; nested groups own their own hover/active/focus highlight scope. | Parent and child rows must not compete for one highlight. Collapsed groups need keyboard-operable disclosure and stateful `aria-expanded`. |
| Row actions | Actions reveal on the row's own hover/focus, reserve the exact action gutter, and do not appear because a child button is hovered. Active rows expose `aria-current`; unread state includes visually hidden text. | Adopt this as the sidebar row contract. Keep badges, status dots, and actions independently addressable. |
| Icon rail | The reference explicitly warns that a collapsed icon-only rail harms discoverability and nesting comprehension. | Do not make icon-only collapse the default. If an icon rail is retained for desktop power users, it requires labels/tooltips, focus parity, and a product decision recorded before implementation. |

Fluid Functionalism also documents three shared interaction principles that fit this spec: motion should explain state rather than decorate it; one hover highlight should glide between list items instead of blinking off between rows; and font-weight/optical-size compensation or reserved ghost geometry should prevent label reflow when hover or selection changes weight. These remain design guidance until validated against Recall's typography, reduced-motion requirements, and bundle/dependency budget.

Root-branch gap audit: `src/components/ui/sidebar.tsx` already has a seven-day `sidebar_state` cookie, controlled/uncontrolled desktop state, a mobile `Sheet`, 16rem/18rem widths, and the stock `offcanvas`/`icon`/`none` variants. It does **not** yet implement Fluid Functionalism's peek modes, drag-to-resize limits, side-aware bracket shortcuts, separate non-persistent peek state, or the documented nested highlight/status contract. Those are explicit follow-up requirements, not assumed to exist because the shared primitive has a similar name.

### 5.5 Dialog, popover, menu, tab, and context-panel contract

The historical evidence describes one interaction system. These surfaces may be implemented with separate primitives, but they must share the following behavior and must not create parallel action logic.

| Surface | Required behavior | Evidence and verification |
| --- | --- | --- |
| Command dialog / global palette | `Mod+K` and `Mod+P` open one centered command dialog from desktop and mobile. The dialog contains a focused query input, grouped command/navigation/object results, visible active-option state, ArrowUp/ArrowDown navigation, Enter activation, and Escape dismissal. It must not appear as a sidebar popover. | `old-5/tests/new-content-command-dialog.spec.ts`; `old-4/openspec/specs/ui/keyboard-command-system/spec.md`; verify one visible `role=dialog`, centered geometry, no competing popover, and focus restoration. |
| Shortcut dispatch | Dispatch is centralized and contextual: open modal, specialized component, editor, block selection, page, then global application. Editable targets and IME composition suppress unrelated global shortcuts. | `old-4/openspec/specs/ui/keyboard-command-system/spec.md`; verify the same command identity is used by shortcut, palette, menu, and button. |
| Object-type studio dialog | The dialog is viewport-bounded, keeps its header fixed, scrolls only its body, focuses the first meaningful field when opened, closes on Escape/backdrop through native Dialog semantics, restores focus to the trigger, and commits creation only after a confirmation action. | `old-4/tests/e2e/runtime-object-types.spec.ts`, `old-4/tests/e2e/workspace-parity.spec.ts`; verify no mutation on open, cancel, or preset selection alone. |
| Popover and menu | Popovers/menus are anchored to their trigger, have stable focus and keyboard traversal, preserve search focus while filtering, expose truthful empty states, close on Escape/outside action, and keep nested actions separate from the parent row action. | `old-4` sidebar parity specs and nested behavior JSON; `old-2` captured ARIA snapshots; verify opening/focusing is non-mutating and nested activation runs exactly once. |
| Main workspace tabs | Main tabs represent open object/workspace views and use a stable persisted storage key. A restored tab must reopen the same object/document identity; a tab close must update active-tab selection deterministically and must not delete the underlying object. | `old-4/tests/e2e/block-editor.spec.ts`, `old-4/tests/e2e/block-editor-interactions.spec.ts`, `old-4` CI baseline checks; verify reload restoration and close-without-delete. |
| Context-panel tabs | The context panel exposes a named `tablist` (`Abas do painel de contexto` in the captured Portuguese surface), semantic `tab`/`tabpanel` relationships, one selected tab, separate close controls, a `Nova aba` action, and reversible collapse. Tab activation and close are view-state operations, not graph mutations. | `old-2` captured `tipos_tabelas-aria.json` and `__tests__/workspace-shell.test.tsx`; verify `aria-selected`, tab count, close action, new-tab action, and panel collapse. |
| Tab keyboard interaction | ArrowLeft/ArrowRight/Home/End move focus within the tablist; Enter/Space activates; focus is visible; close controls do not accidentally activate the tab; labels and shortcut hints remain stable when hover/focus actions appear. | `old-2/__tests__/workspace-shell.test.tsx`; `old-4/tests/ci-baseline.test.mjs`; verify keyboard parity and reduced-motion behavior. |
| Context side panel | The side panel is a contextual read surface. Object context may expose graph, backlinks, and related content; list context may expose list-safe search/AI tools. Loading, empty, and error states are independent from the main panel. | `old-5/docs/workspace/workspace-side-panel-content.architecture.md`; verify panel changes do not duplicate main-page content or mutate relationships. |
| Focus restoration | Closing a dialog, mobile navigation panel, popover, or context-panel surface returns focus to the opener when it still exists; if the opener is gone, focus moves to a stable visible fallback. No focus may remain on an offscreen control. | `old-2` mobile tests; `old-4` `keyboard-focus.behavior.json` records the existing defect where focus remains on an offscreen “Ocultar painel lateral” control. This is a required regression case. |
| Focus mode | Entering focus mode collapses/hides the app header, sidebar, and side panel while preserving compensated floating controls; leaving restores the normal shell. | `old-5/tests/focus-mode-parity.spec.ts`; verify no hidden region retains the active focus target. |

Interaction invariants for all surfaces:

- Use semantic `dialog`, `alertdialog`, `menu`, `menuitem`, `tablist`, `tab`, `tabpanel`, `button`, and link roles where those roles describe the behavior; icon-only controls require accessible names.
- Opening, hovering, focusing, previewing, selecting a tab, and changing a query are view-state operations. They do not create, delete, link, rename, reorder, or submit domain records.
- Every mutation has one canonical action path, pending/duplicate-activation protection, failure feedback, and input preservation.
- Every dismissal path is tested: explicit close, Escape, outside press where applicable, route change, mobile breakpoint transition, and reduced-motion mode.
- Transient surfaces must not create page-level horizontal overflow or leave hidden/offscreen controls focusable.

## 6. Database Schema (Graph-Ready Firestore)

To support polymorphic relations and bidirectional graph querying without hitting the 1 MiB document limit, the database uses a central edges collection.

### Collections

- `users` — user profile data and settings.
- `spaces` — the top-level tenant container. Every object belongs to a `spaceId`. A user may own/belong to multiple Spaces (FR-1, confirmed Capacities-style, not capped).
- `objects` — the primary content collection. Documents use a `type` discriminator.
  - Types: `question`, `exam`, `tag`, `collection`, `note`, `citation` (plus the reserved-only `ordering`, `hotspot`, `simulation` discriminator values, unused by any writer in v1). At most one `exam`-typed object per `userId` (FR-10), enforced server-side, not by the schema itself.
  - Common fields: `id`, `spaceId`, `type`, `createdAt`, `updatedAt`, `content` (TipTap JSON), `visibility` (`private` | `space`; **revised 2026-09-19 — `public` removed**, since Spaces are now private-only and nothing is ever visible outside its Space's membership).
- `object_links` (the graph edges) — relationships between any two objects.
  - Fields: `sourceId`, `targetId`, `relationType` (e.g. `references`, `belongs_to`), `spaceId`.
  - **Constraint (new):** `spaceId` on an edge MUST match the `spaceId` of both `sourceId` and `targetId`; this is enforced server-side (§9.4), never trusted from client input.

## 6. Database Schema (Graph-Ready Firestore)

To support polymorphic relations and bidirectional graph querying without hitting the 1 MiB document limit, the database uses a central edges collection.

### Collections

- `users` — user profile data and settings.
- `spaces` — the top-level tenant container. Every object belongs to a `spaceId`. A user may own/belong to multiple Spaces (FR-1, confirmed Capacities-style, not capped).
- `objects` — the primary content collection. Documents use a `type` discriminator.
  - Types: `question`, `exam`, `tag`, `collection`, `note`, `citation` (plus the reserved-only `ordering`, `hotspot`, `simulation` discriminator values, unused by any writer in v1). At most one `exam`-typed object per `userId` (FR-10), enforced server-side, not by the schema itself.
  - Common fields: `id`, `spaceId`, `type`, `createdAt`, `updatedAt`, `content` (TipTap JSON), `visibility` (`private` | `space`; **revised 2026-09-19 — `public` removed**, since Spaces are now private-only and nothing is ever visible outside its Space's membership).
- `object_links` (the graph edges) — relationships between any two objects.
  - Fields: `sourceId`, `targetId`, `relationType` (e.g. `references`, `belongs_to`), `spaceId`.
  - **Constraint (new):** `spaceId` on an edge MUST match the `spaceId` of both `sourceId` and `targetId`; this is enforced server-side (§9.4), never trusted from client input.
- `study_records` — tracks a user's spaced-repetition performance.
  - Fields: `userId`, `objectId` (Question ID), `nextReviewDate`, `interval`, `easeFactor`, `history`.

## 7. Interfaces & APIs

#### 7.1 Server Actions (Next.js)

All secure business logic bypasses standard API routes in favor of Next.js Server Actions using the `firebase-admin` SDK.

- **Spaced Repetition Engine** — the client submits a study attempt; a Server Action runs the SM-2 algorithm, calculates `nextReviewDate`, and mutates `study_records` directly from the server.
- **Link mutations** — creating/removing an `object_links` edge is a Server Action, not a direct client Firestore write, so the cross-space constraint in §6 can be enforced in one place.
- Server Actions reject any `question`/study-attempt payload whose format is `ordering`, `hotspot`, or `simulation` (FR-4).

### 7.2 Model Context Protocol (MCP) Server

- **Endpoint:** `/api/mcp/route.ts` (Next.js Route Handler).
- **Transport:** HTTP POST (JSON-RPC 2.0) and Server-Sent Events (SSE) stream support.
- **Scope:** Read-only access strictly bounded to tenant objects within the authenticated Space (`Questions`, `Notes`, `Citations`, and study statistics). No write, admin, or user-state mutation tools are exposed in v1.

#### 7.2.1 Authentication & Key Architecture
- **Key Format:** High-entropy string prefix followed by base62 characters: `rcl_live_<base62>` (32 cryptographically random characters).
- **Storage & Hashing:** The raw API key is presented to the user exactly once upon generation and never stored in plaintext. The SHA-256 hash of the key is stored in the root Firestore `/api_keys` collection:
  ```typescript
  interface ApiKeyDocument {
    id: string; // Document ID (e.g. key prefix or UUID)
    keyHash: string; // SHA-256 hash of raw API key
    spaceId: string; // Explicit Space scope bound to this key
    createdBy: string; // Firebase Auth UID of the creator
    createdAt: string; // ISO 8601 timestamp
    revokedAt: string | null; // Null if active, ISO timestamp if revoked
    label: string; // User-facing key description
    scopes: Array<'read'>; // Strict read-only scope for v1
    lastUsedAt?: string;
  }
  ```

#### 7.2.2 Key Lifecycle
1. **Issuance:** A Space owner or administrator creates an API key in Space Settings via the authenticated Server Action `createSpaceApiKey(spaceId, label)`. The raw key `rcl_live_...` is generated via `crypto.randomBytes()`, hashed via SHA-256, and stored in `/api_keys`. The plaintext key is returned once to the client for display.
2. **Validation:** Inbound MCP requests must provide the key via `Authorization: Bearer rcl_live_...` header. The route handler extracts the token, computes `crypto.createHash('sha256').update(rawKey).digest('hex')`, and queries `/api_keys` where `keyHash == computedHash`.
   - If not found or if `revokedAt != null`, the server immediately responds with JSON-RPC error `-32001` (Unauthorized: Invalid or revoked API key).
3. **Space Membership Verification:** The server verifies that the key's `createdBy` user retains active membership in `keyDoc.spaceId`. If the user was removed from the Space or their account disabled, requests are rejected with `-32003` (Forbidden: Key creator lacks Space access). All tool queries are implicitly scoped to `keyDoc.spaceId`; any attempt to pass or access a foreign `spaceId` is rejected.
4. **Revocation:** A Space administrator can immediately revoke an API key via Server Action `revokeSpaceApiKey(keyId)`. Setting `revokedAt: new Date().toISOString()` invalidates subsequent requests without cache latency.

#### 7.2.3 Exposed Read-Only Tools
1. `list_objects`
   - **Parameters:** `{ spaceId: string, type?: 'question' | 'note' | 'citation' | 'exam', limit?: number, cursor?: string }`
   - **Behavior:** Returns paginated list of active objects belonging to `spaceId`.
   - **Output:** `{ objects: Array<ObjectSummary>, nextCursor: string | null }`
2. `get_object`
   - **Parameters:** `{ spaceId: string, objectId: string }`
   - **Behavior:** Retrieves full TipTap JSON content, metadata, outbound relationships from `object_links`, and backlink references for `objectId`. Verifies `objectId` belongs to `spaceId`.
   - **Output:** `{ object: ObjectDetail, links: Array<LinkEdge>, backlinks: Array<LinkEdge> }`
3. `search_space_content`
   - **Parameters:** `{ spaceId: string, query: string, type?: string, limit?: number }`
   - **Behavior:** Performs lexical search across object titles and TipTap text nodes within the designated `spaceId`.
   - **Output:** `{ matches: Array<{ id: string, title: string, type: string, snippet: string }> }`
4. `get_study_summary`
   - **Parameters:** `{ spaceId: string }`
   - **Behavior:** Aggregates spaced-repetition metrics for the Space: total questions, total cards due for review, accuracy rate over recent attempts, and mastery breakdown.
   - **Output:** `{ totalQuestions: number, dueCount: number, retentionRate: number, masteryBreakdown: Record<string, number> }`

#### 7.2.4 Error & JSON-RPC Protocol Contracts
Responses follow standard JSON-RPC 2.0 specifications:
- `-32700` (Parse error): Invalid JSON payload.
- `-32600` (Invalid Request): Malformed JSON-RPC structure.
- `-32601` (Method not found): Tool name unrecognized or reserved.
- `-32602` (Invalid params): Schema validation failed on input arguments.
- `-32001` (Unauthorized): Missing, malformed, or invalid API key.
- `-32003` (Forbidden): Valid key provided, but target resource/space is outside the key's bound `spaceId`.
- `-32004` (Resource Not Found): Target `objectId` does not exist within the Space.

## 8. Security & Data Isolation

- **Firestore Security Rules** — strict tenant isolation, unconditionally. A user may read/write `objects` and `object_links` only where `spaceId` matches a Space they own or belong to. **Revised 2026-09-19:** there is no exception for public visibility anymore — NFR-1 now holds with no carve-out.
- **Route protection** — Next.js Middleware verifies the Firebase Auth token to protect every Space route (all of them, now — none are public).
- **`object_links` symmetry** — a rule that only checks the edge's own `spaceId` is not sufficient; both endpoints' current Space membership must be checked so a crafted edge can't be used to infer a private object's existence across Spaces (§9.6).
- **API Key storage protection** — the `/api_keys` collection is restricted to Server SDK operations. Firestore security rules unconditionally deny direct client-side reads and writes to `/api_keys`.

## 9. Areas of Concern & Unresolved Conflicts

This section exists because the request behind this spec asked for explicit compliance with brand guidelines, security policy, and UX standards — and those don't exist as separate documents in this repository yet. Rather than inventing them, here is what was found, what's ambiguous, and what needs a decision before engineering starts.

1. **No documented brand/security/UX policy exists in this repo.** The only real "policy" today is the shadcn `base-nova` neutral token set and the `Button` component conventions (§5.1). This spec builds on those. If a brand or security policy exists outside this repository, it wasn't available here and should be reconciled against §5–§8 before implementation begins.
2. **RESOLVED 2026-09-19 — was "'Free community browsing' vs. 'strict tenant isolation' are in tension."** intent.md now states Spaces are private-only, which removes this tension entirely: there is no public visibility left to reconcile with isolation. `visibility` on `objects` is now just `private | space` (§6) — kept only to distinguish "just me" from "anyone in this Space," not to gate public access.
3. **RESOLVED 2026-09-19 — was a recommended default pending sign-off on public-vs-private object defaults.** Moot now that `public` isn't a visibility value at all. `note` and `citation` objects can still default to `private` even within a `space`-visible context, if the product wants personal annotations to stay hidden from other Space members by default — that's a smaller, still-open product question, not the one this item used to describe.
4. **Third-party registries are a supply-chain risk, not yet adopted.** intent.md/the earlier draft named "Fluid Functionalism" (`fluidfunctionalism.com`) and "Shoogle" (`shoogle.dev`) as UI sources. `components.json` currently has `registries: {}` — nothing points at them. Pointing the shadcn CLI at an external registry pulls in and executes that party's components/CSS/build config inside this codebase. **Before adoption:** vet the registry's contents and provenance the same way any new dependency would be reviewed; do not add it to `components.json` as a blanket default without that review. This spec does not assume it will be adopted.
5. **RESOLVED 2026-09-19 — was "MCP auth is an open question in intent.md but a hard requirement here..."** Formally resolved using Space-scoped SHA-256 hashed API keys (`rcl_live_<base62>`) stored in the `/api_keys` collection (§7.2). Keys grant strict read-only access to `Questions`, `Notes`, `Citations`, and study summaries for authorized Space members only, rejecting unauthenticated or cross-Space requests with standard JSON-RPC errors.
6. **`object_links` cross-space leakage.** If an edge's `spaceId` is ever set from client input independently of validating `sourceId`/`targetId`'s own `spaceId`, a crafted edge could link objects across Spaces. §6/§8 require this to be enforced in a Server Action, never in a client-writable path.
7. **Reserved question formats must be excluded end-to-end.** `ordering`, `hotspot`, `simulation` must be unreachable not just in the authoring/study UI but also in Server Action validation and MCP schema output, or they become a de facto unsupported-but-reachable surface.
8. **Spaced-repetition algorithm — resolved: SM-2.** §6/§7.1's SM-2 usage is now the confirmed choice (rationale in intent.md Constraints); intent.md's open question is closed. Still worth a human sign-off pass before Plan Mode, since it was decided here rather than in a dedicated product conversation.
9. **App name and moderation — resolved.** Application name is **Recall** (intent.md). Moderation is a report-and-hide model, no pre-publish gate: see FR-9. Both were decided here rather than by the product owner directly — flag for a quick confirmation pass rather than treating as unchangeable.
10. **No migration/rollout section.** This is a greenfield build with no existing data to migrate — noted explicitly as N/A rather than silently omitted.
11. **RESOLVED 2026-09-19 — was "'Crowdsourced' (intent.md Proposed outcome) now conflicts with private-only Spaces."** Formally resolved by defining collaboration strictly around member-invited private Spaces for study groups and teams. There is zero unauthenticated or public browsing surface. Content contribution is collaborative within a private Space tenant.
12. **FR-10 (one Exam per user) is confirmed but unusual — flagged, not silently trusted.** A learner preparing for two certifications (a real case intent.md's Problem section implies — "learners preparing for certifications," plural) would be blocked from having two Exam objects under this rule. Implemented as explicitly confirmed by the product owner; worth one more explicit check before Plan Mode given how easily "one exam" and "an exam" get confused in fast typing.
13. **Worktree status is historical, not runtime architecture.** The linked checkouts contain several overlapping implementations of the shell, editor, repositories, study engine, and graph UI. The root branch must choose and port contracts deliberately; it must not import behavior by scanning `.worktrees/` or assume that the newest-looking worktree is automatically production-ready.
14. **Interaction parity is evidence-backed but incomplete.** The old-4 matrices verify important hover, disclosure, related-content, and side-panel states, while many keyboard, persistence-after-reload, and destructive paths remain marked not tested. Those paths remain acceptance work, not implicit requirements satisfied by visual similarity.
15. **Fluid Functionalism adoption is intentionally unresolved.** The reference library is relevant because it offers Base UI-compatible components and a detailed sidebar interaction model, but adopting its registry could overwrite local shadcn primitives and add dependencies. Use its docs/repository as design evidence first; adopt code only after reviewing provenance, license, generated files, dependency changes, accessibility behavior, and visual fit.
16. **Current sidebar primitive is only partially aligned.** The root primitive persists desktop open state and provides a mobile drawer, but it currently uses the stock `Ctrl/Cmd+B` shortcut and supports icon collapse rather than the reference's side-aware bracket shortcut, peek modes, bounded resize, and explicit nested highlight scope. These mismatches need a focused implementation decision and tests before the shell can be considered complete.
17. **Transient-surface focus parity is incomplete.** The captured `old-4` focus artifact shows the side-panel hide action retaining focus after it moves offscreen, and full Tab traversal was not reliably captured. Dialog, menu, popover, and tab focus restoration therefore remain acceptance work even where individual component tests pass.
18. **Historical study engines disagree with the current product decision.** `old-8`, `old-5`, and `old-9` contain FSRS implementations, while `intent.md` explicitly selects SM-2. No scheduler code may be ported until the plan records the chosen algorithm, stored-card schema, deterministic test vectors, and migration/versioning strategy.
19. **The historical data layers represent different ownership models.** `old-9` uses server-authorized Firestore object/revision actions; `old-5`/`old-6` use local-first Dexie records and sync queues. The root cannot safely combine their write paths without a single source-of-truth and conflict policy.
20. **Editor selection is unresolved.** The old-4 block editor and old-6 Plate editor both have substantial evidence and tests, but the root branch has not selected either. This decision belongs in the approved plan and must include content serialization, read-only preview, migration, and bundle/accessibility consequences.

## 10. Target Directory Structure

```text
/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Login and Registration routes
│   ├── (dashboard)/      # Protected Space/PKM routes
│   └── api/mcp/          # MCP Server Route Handlers
├── components/           # React Components
│   ├── editor/           # TipTap Custom Nodes and UI
│   └── ui/               # shadcn/ui components (base-nova)
├── lib/                  # Shared utilities
│   ├── firebase/         # Firebase Client SDK initialization
│   ├── firebase-admin/   # Firebase Admin SDK (Server only)
│   └── srs/              # Spaced Repetition Algorithm logic
├── actions/              # Next.js Server Actions
└── types/                # Global TypeScript definitions (Object types, schemas)
```

## 11. Acceptance Summary

- [x] Requirements are traceable to the intent — FR-1..FR-12/NFR-1..5 map to intent.md's constraints and confirmed acceptance targets (§2.1).
- [x] Policy conflicts are resolved — visibility, MCP auth (§7.2, §9.5), registry supply-chain, cross-space edges, and private crowdsourced collaboration (§9.11) are formally resolved.
- [x] Acceptance criteria are testable — FR-1..FR-12 are testable; §§2.4 and §§5.3–5.5 define concrete empty states, skeleton CLS requirements (< 0.05), network retry/grace windows, hover/focus separation, and mutation boundaries.
- [x] Worktree evidence is explicit — each linked worktree is classified as an authoritative contract, secondary reference, or historical-only source, and the root/runtime boundary is stated in §3.1.
- [ ] Worktree migration is complete — port the selected contracts into the root branch and verify that `.worktrees/` is not part of the runtime dependency graph.
- [x] Sidebar parity is explicit — §3.1 and §5.4 select `old-2`/`old-4`/`old-5` as the evidence sources and define the adopted responsive, accessibility, persistence, resize, peek, shortcut, nested-row, and reduced-motion contract.
- [ ] Sidebar parity is implemented and proven — cover desktop, mobile, keyboard, reduced-motion, persistence, resize/peek, and row-action behavior with focused interaction/browser tests.
- [ ] Dialog/tab parity is implemented and proven — cover command dialogs, object-type dialogs, popovers/menus, main tabs, context-panel tabs, focus restoration, persistence, and no-mutation-on-open behavior with focused interaction/browser tests.
- [x] Cross-worktree architecture evidence is synthesized — authentication, revisions, relations, study scheduling, local-first/sync, editor alternatives, AI boundaries, and verification sources are classified in §3.1.
- [x] Architecture choices are approved — SM-2 scheduler, TipTap JSON serialization, server-authoritative Firestore actions, and Space-scoped API keys documented and approved in `plan.md`.

## 12. Implementation and screen verification status

The root branch currently exposes five verified routes: `/`, `/workspace`, `/question`, `/study`, and `/review`. The root includes a responsive Recall entry surface plus static Space Home, Question detail, Study Session setup, and Spaced-Repetition Review Queue screens. These screens use the approved design tokens and shared workspace frame, but their data and mutations are still placeholders.

The following screens and capabilities are specified by this document or the companion design artifact but are not implemented in the root branch:

- authenticated sign-in and Space selection;
- Space Home with authenticated, real object data;
- Question object detail with a real editor, links, and backlinks;
- Note, Citation, Tag, Collection, and Exam object views;
- Study Session execution, answer persistence, and practice mode;
- simulated exam mode and timeout submission;
- spaced-repetition review queue mutations and result state;
- command palette, dialogs, menus, workspace tabs, and context-panel tabs;
- moderation report/hide flows;
- authenticated read-only MCP endpoint.

Verification completed for the implemented routes: TypeScript compilation, production build, targeted Biome checks, and live browser accessibility inspection pass. No automated browser tests, screenshot comparisons, authentication tests, domain tests, or MCP tests exist yet. Full-repository Biome checking still reports diagnostics in untouched generated UI components. The screens are visually present but not product-complete, and the acceptance checkboxes above remain authoritative.

## Related

- [Intent](intent.md)
- [Design exploration (visual canvas)](https://claude.ai/artifact/MvnKK8yfStTNp3DTd5a2Lo) — Space Home, Question detail (links/backlinks), Study Session, Spaced-Repetition Review Queue. Private by default; share it from the page's Share menu before pointing anyone else at it.
