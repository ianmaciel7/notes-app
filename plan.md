# Implementation Plan: Recall — Collaborative Private Space & Exam Prep Platform

- **Document Purpose:** Engineering implementation plan for the Recall platform, defining technical architecture, phased execution roadmap, testing matrix, and verification boundaries.
- **Scope:** Greenfield production implementation of multi-tenant private Spaces, dynamic object modeling (Questions, Notes, Citations, Exams, Tags, Collections), TipTap rich text serialization, bidirectional knowledge graph links/backlinks, server-authoritative SM-2 spaced repetition engine, timed simulated exam sessions, and Space-scoped Model Context Protocol (MCP) read server.
- **Status:** Approved — incorporating resolved architectural specifications from [spec.md](./spec.md) and [intent.md](./intent.md); ready for Build stage.
- **Derived From:** [intent.md](./intent.md), [spec.md](./spec.md), [DESING.md](./DESING.md)

---

## 1. Architecture & Dependency Boundaries

### 1.1 Architectural Layers
Recall follows a layered, server-authoritative architecture built on Next.js 16 (App
Router, React 19) and Firebase — the plan was originally approved against Next.js 15;
§8 records the `middleware.ts` → `proxy.ts` consequence of the actual Next.js 16 pin:
- **Presentation Layer (`src/app/`, `src/components/`):** React Server Components (RSC) and Client Components styled with Tailwind CSS v4 and shadcn Base UI (`base-nova` neutral palette with object-type accent tokens, 61 installed primitives). View state (modals, active tabs, search queries, sidebar peek) is strictly separated from persisted domain state. Component composition follows `.agents/rules/shadcn.md`, spec.md §5.6, and §1.3 below: Base UI's `render`/`nativeButton` API (not Radix `asChild`), `FieldGroup`/`Field` for forms, semantic tokens/variants over raw Tailwind colors, and no external shadcn registry without review.
- **Action & Mutation Boundary (`src/actions/`):** Next.js Server Actions execute all business mutations using the server-only `firebase-admin` SDK. Direct client-side Firestore writes are completely disabled by security rules. Every Server Action resolves the caller session, verifies tenant membership, validates schema constraints, and executes atomic batched writes.
- **Domain Services (`src/domain/`):** Pure, framework-agnostic business logic decoupled from transport and database drivers. Contains the SM-2 spaced repetition calculator, graph relationship invariants, exam attempt evaluators, and validation rules for question formats.
- **Data & Security Layer (`firestore.rules`, `src/lib/firebase-admin/`):** Firestore NoSQL database enforcing multi-tenant isolation by `spaceId`. Centralized `object_links` collection tracks graph edges with strict endpoint symmetry. API keys are stored hashed in `/api_keys` and are accessible solely via the Admin SDK.
- **MCP Integration Layer (`src/app/api/mcp/route.ts`):** High-performance JSON-RPC 2.0 Route Handler providing read-only access for external AI clients. Authenticated via Space-scoped SHA-256 hashed API keys (`rcl_live_...`).

### 1.2 System Boundary Rules
- **No Direct Client Writes:** Clients must never invoke Firestore `.set()`, `.update()`, or `.delete()` directly. All mutations route through Server Actions.
- **Zero Cross-Space Leakage:** Queries must always filter by `spaceId`. Link edges must verify that both `sourceId` and `targetId` share the exact same `spaceId`.
- **Worktree Isolation:** The repository worktrees (`.worktrees/`) are historical reference checkouts only. Runtime code must never import from or reference `.worktrees/`.
- **Path Portability:** All documentation and configuration must strictly use repository-relative paths (e.g. `./src/domain/recall.ts`). Absolute machine paths are strictly prohibited.

### 1.3 shadcn/ui Component Architecture & Design System Requirements
Recall implements a strict shadcn Base UI architecture (`base-nova` style, Lucide icon set, Tailwind CSS v4, `components.json` with `registries: {}`), governed by `.agents/rules/shadcn.md` and spec.md §5.6. All 61 installed primitives under `src/components/ui/` and all consuming features must satisfy these contracts:

1. **Base UI Primitive Discipline (vs. Radix):**
   - Composition uses Base UI's `render={<X />}` prop on triggers and dismissal controls, paired with `nativeButton={false}` when replacing buttons with anchors or custom elements. Never use Radix `asChild`.
   - `Select` requires an `items` array on the root and a `{ value: null }` placeholder item (never bare `SelectValue placeholder="..."`).
   - `ToggleGroup` and `Accordion` accept array values and a `multiple` boolean; scalar values and `type="single"` are invalid.
   - `Slider` single thumb accepts a plain number.

2. **Form Controls & Layout Standards:**
   - Every input is wrapped in `<FieldGroup>` and `<Field>` alongside semantic `<FieldLabel>`, `<FieldDescription>`, and `<FieldError>`. Raw `div` wrappers with `space-y-*` or `grid gap-*` are prohibited.
   - Composite inputs use `<InputGroup>` wrapping `<InputGroupInput>` or `<InputGroupTextarea>`, paired with `<InputGroupAddon>` for buttons or icons.
   - Mutually exclusive options (2–7 choices) compose `<ToggleGroup>` + `<ToggleGroupItem>`.
   - Checkbox and radio clusters require `<FieldSet>` + `<FieldLegend>`.
   - Validation uses `data-invalid` on `<Field>` and `aria-invalid` on the control; disabled states use `data-disabled` on `<Field>` and `disabled` on the control.

3. **Structural & Overlay Accessibility Contracts:**
   - Sub-items must always reside inside their semantic group (`SelectItem` in `SelectGroup`, `DropdownMenuItem` in `DropdownMenuGroup`, `CommandItem` in `CommandGroup`).
   - Transient surfaces (`Dialog`, `Sheet`, `Drawer`) must render a corresponding `*Title` element (`DialogTitle`, `SheetTitle`, `DrawerTitle`), visually hidden with `className="sr-only"` when needed.
   - Cards require complete semantic decomposition (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
   - Button loading states compose `<Spinner data-icon="inline-start" />` with `disabled` (no `isPending`/`isLoading` prop on Button).
   - Tabs strictly require `<TabsTrigger>` inside `<TabsList>`.
   - `<Avatar>` must render `<AvatarFallback>`.

4. **Component Selection & Semantic Enforcement:**
   - Callouts use `<Alert>`, empty states use `<Empty>`, toasts use `@/components/ui/toast` (Base UI), dividers use `<Separator>`, loading shells use `<Skeleton>` (maintaining CLS < 0.05), status indicators use `<Badge>`.
   - Hand-rolled replacements for these primitives are prohibited.

5. **Icon & Styling Guardrails:**
   - Icons are strictly from `lucide-react`. Inside `<Button>`, icons must carry `data-icon="inline-start"` or `data-icon="inline-end"` with no internal sizing classes (`size-4`). Icons are passed as component references.
   - `className` is reserved for layout and positioning. Component color, fill, and font overrides are prohibited.
   - `space-x-*` and `space-y-*` are prohibited; layout stacks use `gap-*`.
   - Equal dimensions use `size-*`. Truncated strings use `truncate`.
   - The palette is defined by semantic OKLCH tokens; raw Tailwind colors (`bg-blue-500`, `text-emerald-600`) and manual `dark:*` overrides are prohibited.
   - Overlays manage their own stacking; manual `z-index` classes are prohibited.

6. **Component Surface Mapping (61 Installed Primitives):**
   - **Workspace & Navigation Shell:** `sidebar.tsx`, `breadcrumb.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `pagination.tsx`, `resizable.tsx`, `scroll-area.tsx`, `tabs.tsx`.
   - **Actions & Controls:** `button.tsx`, `button-group.tsx`, `toggle.tsx`, `toggle-group.tsx`.
   - **Form & Input Elements:** `field.tsx`, `input.tsx`, `textarea.tsx`, `input-group.tsx`, `select.tsx`, `native-select.tsx`, `combobox.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx`, `calendar.tsx`, `input-otp.tsx`, `questionnaire.tsx`, `label.tsx`.
   - **Overlays & Transients:** `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`, `dropdown-menu.tsx`, `context-menu.tsx`, `command.tsx`.
   - **Data Display & Feedback:** `card.tsx`, `badge.tsx`, `avatar.tsx`, `table.tsx`, `chart.tsx`, `progress.tsx`, `skeleton.tsx`, `spinner.tsx`, `alert.tsx`, `empty.tsx`, `toast.tsx`, `kbd.tsx`, `item.tsx`, `separator.tsx`, `aspect-ratio.tsx`, `carousel.tsx`, `collapsible.tsx`, `direction.tsx`.
   - **Scaffolded Residue (Unmounted):** `message.tsx`, `message-scroller.tsx`, `bubble.tsx`, `attachment.tsx`, `marker.tsx` (chat primitives preserved from scaffold but inactive).

---

## 2. File Inventory Across Phases

The implementation plan introduces and modifies the following files across the 6 phases:

| Phase | Path | Action | Description |
|---|---|---|---|
| **Phase 1** | `src/lib/firebase/config.ts` | Create | Client Firebase SDK initialization for Auth |
| **Phase 1** | `src/lib/firebase-admin/app.ts` | Create | Server-only Firebase Admin SDK initialization |
| **Phase 1** | `src/domain/auth.ts` | Create | User session, space membership, and role validation types |
| **Phase 1** | `src/actions/auth.ts` | Create | Server Actions for sign-in, session cookies, and space switching |
| **Phase 1** | `src/actions/spaces.ts` | Create | Space creation, membership management, and invitation actions |
| **Phase 1** | `firestore.rules` | Modify | Strict multi-tenant security rules enforcing space membership |
| **Phase 1** | `src/middleware.ts` | Create | Edge session verification protecting all `/workspace/*` routes |
| **Phase 1** | `src/components/workspace/space-switcher.tsx` | Create | Multi-space selector and space creation dialog |
| **Phase 2** | `src/domain/recall.ts` | Create | Domain models for Questions, Notes, Citations, Exams, Tags, Collections |
| **Phase 2** | `src/domain/relations.ts` | Create | Graph edge invariants, relation types, and bidirectional validator |
| **Phase 2** | `src/actions/objects.ts` | Create | Atomic CRUD Server Actions with immutable revision history |
| **Phase 2** | `src/actions/relations.ts` | Create | Server Actions for creating/removing symmetrical `object_links` |
| **Phase 2** | `src/components/editor/tiptap-editor.tsx` | Create | Headless TipTap editor with JSON serialization and object chips |
| **Phase 2** | `src/components/objects/object-detail.tsx` | Create | Universal object detail layout with links rail and backlinks panel |
| **Phase 2** | `src/components/objects/question-editor.tsx` | Create | Authoring UI for single/multi-choice, fill-blank, matching formats |
| **Phase 2** | `src/components/objects/backlinks-panel.tsx` | Create | Reactive backlinks inspector querying incoming `object_links` |
| **Phase 3** | `src/lib/srs/sm2.ts` | Create | Pure SM-2 spaced repetition algorithm (interval, easeFactor, dates) |
| **Phase 3** | `src/domain/study.ts` | Create | Study record definitions, review queues, and rating models (0-5) |
| **Phase 3** | `src/actions/study.ts` | Create | Idempotent study review submission and queue resolution |
| **Phase 3** | `src/components/study/review-queue.tsx` | Create | Interactive review queue runner with card flip and grade triggers |
| **Phase 3** | `src/components/study/retry-queue-banner.tsx` | Create | Optimistic offline submission banner and retry sync manager |
| **Phase 4** | `src/domain/exam.ts` | Create | Exam session configuration, question shuffling, and grading rules |
| **Phase 4** | `src/actions/exam.ts` | Create | Simulated exam start, answer recording, and timeout auto-submit |
| **Phase 4** | `src/components/exam/simulated-exam-runner.tsx` | Create | Timed exam interface without per-question feedback |
| **Phase 4** | `src/components/exam/exam-timer.tsx` | Create | Resilient countdown timer dispatching submit on `00:00` |
| **Phase 4** | `src/components/exam/exam-results.tsx` | Create | Post-exam detailed scorecard, analytics, and miss-queue enrollment |
| **Phase 5** | `src/domain/api-keys.ts` | Create | Space-scoped API key specifications, hashing, and permission types |
| **Phase 5** | `src/actions/api-keys.ts` | Create | API key generation (`rcl_live_...`), listing, and revocation |
| **Phase 5** | `src/app/api/mcp/route.ts` | Create | Next.js JSON-RPC 2.0 Route Handler for MCP tools |
| **Phase 5** | `src/lib/mcp/tools.ts` | Create | Read-only tool implementations (`list_objects`, `get_object`, etc.) |
| **Phase 5** | `src/components/settings/api-keys-card.tsx` | Create | Workspace settings panel for generating and managing API keys |
| **Phase 6** | `src/components/ui/skeleton.tsx` | Modify | Layout-stable skeletons (CLS < 0.05) for cards, tree, prompts |
| **Phase 6** | `src/components/workspace/empty-state.tsx` | Create | Concrete empty states for new spaces, empty queues, 0-match search |
| **Phase 6** | `tests/unit/sm2.test.ts` | Create | Deterministic SM-2 mathematical test vectors |
| **Phase 6** | `tests/unit/api-keys.test.ts` | Create | Cryptographic SHA-256 validation and token generation tests |
| **Phase 6** | `tests/integration/rules.test.ts` | Create | Firebase emulator rules suite verifying strict tenant isolation |
| **Phase 6** | `tests/e2e/workspace-flow.spec.ts` | Create | Playwright E2E suite covering auth, object graph, study, and exam |

---

## 3. Phased Implementation Roadmap

### Phase 1: Auth & Tenant Isolation
- **Objectives:** Establish the multi-tenant isolation foundation on Firebase Auth and Firestore. Ensure zero data leakage between private Spaces.
- **Tasks:**
  1. Initialize Firebase Client SDK in `src/lib/firebase/config.ts` and Firebase Admin SDK in `src/lib/firebase-admin/app.ts`.
  2. Implement session management using HttpOnly, Secure session cookies verified via Next.js Edge Middleware (`src/middleware.ts`).
  3. Define Firestore schema and security rules in `firestore.rules`:
     - Allow read/write access to `/spaces/{spaceId}` and `/spaces/{spaceId}/**` only to users listed in `members` map.
     - Unconditionally deny client-side reads/writes to `/api_keys`.
  4. Build Server Actions in `src/actions/spaces.ts` to create spaces, invite members, and switch active space context.
  5. Implement `SpaceSwitcher` component in the workspace header with clear membership indicators and space creation modals.
- **Verification:** Integration tests against Firebase Emulator confirming unauthorized users receive permission denied when attempting to access a foreign space.

### Phase 2: Dynamic Object CRUD, TipTap Editor & Graph
- **Objectives:** Deliver polymorphic object modeling, rich content editing, bidirectional knowledge graph links, and backlinks navigation.
- **Tasks:**
  1. Implement domain types in `src/domain/recall.ts` for all 6 MVP object types: `question`, `exam`, `tag`, `collection`, `note`, `citation`. Enforce server-side rule: at most one `exam` object per user (FR-10).
  2. Reserve discriminator slots for `ordering`, `hotspot`, `simulation` but reject creation via Server Action guards (FR-4).
  3. Implement headless TipTap editor in `src/components/editor/tiptap-editor.tsx` supporting clean JSON serialization, formatting marks, block quotes, and inline mention chips for graph objects.
  4. Create Server Actions in `src/actions/objects.ts` with immutable revision history: modifying an object creates a new revision record and updates the head document within an atomic Firestore batch.
  5. Build graph relationship engine in `src/actions/relations.ts`:
     - Mutates `/object_links` collection.
     - Verifies `spaceId` match across both `sourceId` and `targetId` before persisting edges.
  6. Implement universal object detail view with real-time "Linked Objects" drawer and reactive "Backlinks" panel (FR-8).
- **Verification:** Create a Question, link to Citation and Note, and verify bidirectional navigation in under 100ms. Unit test verifying rejection of a second Exam object for the same user.

### Phase 3: SM-2 Spaced Repetition Engine
- **Objectives:** Implement server-authoritative spaced repetition scheduling adhering strictly to the SM-2 algorithm specification.
- **Tasks:**
  1. Implement pure SM-2 algorithm in `src/lib/srs/sm2.ts`:
     - Formula: $EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$. Minimum $EF = 1.3$.
     - Interval progression: $I(1) = 1$ day, $I(2) = 6$ days, $I(n) = I(n-1) \times EF'$.
     - If grade $q < 3$, reset repetitions to 0, $I = 1$.
  2. Implement `study_records` store tracking `userId`, `objectId`, `nextReviewDate`, `interval`, `easeFactor`, and historical attempt logs.
  3. Create review queue query resolver returning due items (`nextReviewDate <= now`) scoped to the active Space.
  4. Implement interactive review runner (`src/components/study/review-queue.tsx`) with card flip, grade buttons (0: Blackout, 1: Incorrect, 2: Hard, 3: Good, 4: Easy, 5: Perfect), and keyboard shortcuts (1-5, Space).
  5. Build client-side optimistic submission queue with exponential backoff retry and non-blocking status banner for offline/flaky connections.
- **Verification:** Deterministic unit tests covering known SuperMemo/SM-2 mathematical test vectors. Verification of automatic queue enrollment upon an incorrect grade.

### Phase 4: Simulated Exam Engine & Timers
- **Objectives:** Implement configurable study sessions, separating instant-feedback practice mode from strict, timed simulated exams.
- **Tasks:**
  1. Implement Study Session configuration surface (`src/app/study/page.tsx`): select scope (all due, or filtered by Exam/Tag/Collection), question count, and mode (`practice` vs. `simulated_exam`).
  2. In `practice` mode: retain immediate per-question grading, answer explanations, and direct SM-2 feedback.
  3. In `simulated_exam` mode:
     - Require time limit (e.g. 60 minutes).
     - Shuffle questions deterministically.
     - Suppress all per-question feedback and answer reveals during the active session.
     - Provide full-screen exam runner with question flag/review drawer and running timer (`src/components/exam/exam-timer.tsx`).
  4. Implement expiration boundary: on countdown reaching `00:00`, client dispatches auto-submission and freezes inputs.
  5. Server Action in `src/actions/exam.ts` validates submission against started timestamp with a strict 15-second grace window (`duration + 15s`).
  6. Render post-exam summary (`src/components/exam/exam-results.tsx`) with score percentage, time spent, breakdown by Tag, and one-click enrollment of missed questions into the SM-2 review queue.
- **Verification:** E2E test proving timer expiration auto-submits answers and computes final grade without score loss.

### Phase 5: Space-Scoped API Keys & MCP Server
- **Objectives:** Expose a secure, read-only Model Context Protocol (MCP) server for external AI tools, gated by hashed Space API keys.
- **Tasks:**
  1. Implement API key domain model in `src/domain/api-keys.ts` with prefix `rcl_live_<base62>` (32 random chars).
  2. Create Server Actions in `src/actions/api-keys.ts`:
     - Generate raw key, compute SHA-256 hash, store document in `/api_keys` with `spaceId`, `createdBy`, `createdAt`, `scopes: ['read']`.
     - Display raw key once in workspace settings; never store raw key in database.
     - Revocation action setting `revokedAt: timestamp`.
  3. Build Next.js Route Handler at `src/app/api/mcp/route.ts` supporting JSON-RPC 2.0 and Server-Sent Events (SSE).
  4. Implement authentication middleware in route handler:
     - Extract `Authorization: Bearer <key>`.
     - Hash token with SHA-256 and query `/api_keys` by `keyHash`.
     - Verify `revokedAt == null` and creator has active Space membership.
     - Return `-32001` (Unauthorized) or `-32003` (Forbidden) on violation.
  5. Implement 4 core read-only MCP tools in `src/lib/mcp/tools.ts`:
     - `list_objects`: paginated query of objects within `spaceId`.
     - `get_object`: full TipTap content, outbound links, and backlinks for an object.
     - `search_space_content`: lexical query across titles and text in `spaceId`.
     - `get_study_summary`: aggregate study statistics and retention metrics.
- **Verification:** Integration tests verifying valid keys return tool responses, revoked keys return `-32001`, and attempts to query foreign space objects return `-32003`.

### Phase 6: E2E Hardening & Verification
- **Objectives:** Harden user experience, ensure zero layout shifts, polish accessibility, and prove complete SDLC compliance.
- **Tasks:**
  1. Implement skeleton loading states across all views, ensuring Cumulative Layout Shift (CLS) is strictly < 0.05.
  2. Build concrete empty states:
     - New Space: welcome guide, schema intro, quick object creation triggers.
     - Review Queue: celebratory "All caught up!" screen with countdown to next review.
     - Question Search: clear filter trigger and quick-create action.
  3. Enforce 404 Not Found (instead of 403) on cross-Space object URLs to prevent tenant enumeration attacks.
  4. Audit keyboard navigation and accessibility (WCAG 2.1 AA): focus traps in dialogs, focus restoration on dismissal, side-aware sidebar shortcuts (`[` / `]`), 4.5:1 text contrast.
  5. Finalize end-to-end automated test suites in Playwright.
- **Verification:** Production build succeeds (`pnpm build`), Biome linting clean, 100% pass rate across Vitest and Playwright test suites.

---

## 4. Automated Testing Matrix

| Level | Framework | Scope & Test Cases | Execution Command | Target Metric |
|---|---|---|---|---|
| **Unit** | Vitest | - SM-2 calculation vectors (grades 0-5, interval & EF transitions)<br>- Question format schema validation & reserved format rejection<br>- One-Exam-per-user constraint validation<br>- API key SHA-256 hashing & format parsing<br>- TipTap JSON serialization and content node extractors | `pnpm exec vitest run tests/unit` | 100% pure function coverage |
| **Integration** | Vitest + Firebase Emulator | - Firestore security rules multi-tenant isolation<br>- Unauthenticated read/write rejection<br>- Cross-space link creation rejection (endpoint symmetry)<br>- `/api_keys` client-side access denial<br>- Server Action atomic batch rollback on failure | `pnpm exec vitest run tests/integration` | 0 rule leaks, 100% tenant isolation |
| **E2E** | Playwright | - User authentication & Space creation<br>- Question authoring with linked Note & Citation<br>- Backlinks panel navigation<br>- Review queue card flip, grading & SM-2 interval update<br>- Simulated exam timer countdown & auto-submit on `00:00`<br>- MCP JSON-RPC protocol query with `rcl_live_...` key | `pnpm exec playwright test` | 100% critical user path verification |
| **A11y & UI** | Biome + Playwright | - Base UI `render` prop enforcement (zero `asChild`)<br>- Mandatory `*Title` elements on all transient dialogs/sheets/drawers<br>- Form field `FieldGroup` + `Field` structure enforcement<br>- Layout-stable skeletons (CLS < 0.05) & focus restoration on dismissal | `pnpm lint && pnpm test:e2e` | 100% component compliance & zero regressions |

---

## 5. Risks, Breakage Points & Mitigations

| Risk / Breakage Point | Severity | Impact | Mitigation Strategy |
|---|---|---|---|
| **Cross-Space Link Edge Leakage** | High | A malicious user attempts to link an object in Space A to an object in Space B, leaking private metadata. | Enforce link creation strictly through `src/actions/relations.ts` with atomic transaction checking that `source.spaceId === target.spaceId === session.spaceId`. Reject client Firestore link writes. |
| **Exam Timer Submission Lag** | Medium | User submits exam at 00:00 but network latency delays arrival at server, causing rejected submission. | Server Action enforces a strict 15-second grace window (`nominalDuration + 15s`). Submissions within grace window are accepted; late attempts are trimmed or rejected. |
| **Layout Shift (CLS) on Streaming Panels** | Medium | Object detail page shifts layout when asynchronous backlinks or graph metadata load. | Use layout-stable card and sidebar skeletons matching bounding dimensions exactly. Isolate async sidebars in React Suspense boundaries with CLS < 0.05. |
| **Focus Loss on Dialog / Drawer Dismiss** | Medium | Closing a modal, sidebar drawer, or command palette drops focus to the body element, failing WCAG AA. | Implement custom focus restoration hook returning focus to the triggering button upon Escape or outside click. Maintain regression tests in Playwright. |
| **API Key Plaintext Leakage** | Critical | API key exposed in logs or database compromises Space privacy. | Generate keys with high-entropy base62; display raw key to creator exactly once upon creation. Store only SHA-256 hash in Firestore. Never log authorization headers. |
| **Duplicate Review Submission** | Low | Flaky connection causes rapid retries of card grading, skewing SM-2 intervals. | Every review submission includes an idempotency key (`${userId}_${questionId}_${attemptTimestamp}`). Server Action deduplicates repeated payloads. |

---

## 6. Traceability Matrix

| Intent Success Target / Spec Requirement | Implementation Phase | Primary Code Artifacts | Verification Method |
|---|---|---|---|
| **FR-1 / NFR-1:** Space Isolation & Multi-tenancy | Phase 1 | `firestore.rules`, `src/actions/spaces.ts`, `src/middleware.ts` | Firebase Emulator Rules suite (`rules.test.ts`) |
| **FR-2 / FR-3:** Polymorphic Objects & TipTap Content | Phase 2 | `src/domain/recall.ts`, `src/components/editor/tiptap-editor.tsx` | Object CRUD tests & TipTap serialization unit tests |
| **FR-4:** Supported & Reserved Question Formats | Phase 2 | `src/domain/recall.ts`, `src/actions/objects.ts` | Unit tests rejecting `ordering`/`hotspot`/`simulation` |
| **FR-5:** Spaced Repetition (SM-2) Engine | Phase 3 | `src/lib/srs/sm2.ts`, `src/actions/study.ts`, `review-queue.tsx` | Mathematical test vectors in `sm2.test.ts` & queue E2E |
| **FR-6 / FR-9:** Collaborative Private Spaces & Moderation | Phase 1, Phase 2 | `src/actions/spaces.ts`, `src/actions/objects.ts` | Multi-user permission and report-and-hide tests |
| **FR-7:** Space-Scoped MCP Read Server | Phase 5 | `src/app/api/mcp/route.ts`, `src/lib/mcp/tools.ts`, `api-keys.ts` | JSON-RPC API tests with valid/revoked keys |
| **FR-8:** Bidirectional Links & Backlinks | Phase 2 | `src/actions/relations.ts`, `src/components/objects/backlinks-panel.tsx` | Graph traversal Playwright test |
| **FR-10:** One Exam per User Rule | Phase 2 | `src/actions/objects.ts`, `src/domain/recall.ts` | Action unit test attempting to create a second exam |
| **FR-11:** Practice & Simulated Exam Modes | Phase 4 | `src/domain/exam.ts`, `src/actions/exam.ts`, `exam-runner.tsx` | Timed exam E2E test with auto-submission |
| **FR-12 / NFR-5:** Space Shell & Interaction Contracts | Phase 6 | `src/components/workspace/*`, `src/components/ui/*` | Focus, keyboard, and accessibility inspection tests |
| **NFR-3:** Accessibility & WCAG 2.1 AA | Phase 6 | `src/components/ui/skeleton.tsx`, `globals.css` | Lighthouse accessibility audit & Playwright a11y suite |
| **Intent Target 1:** Bidirectional Graph Traversal | Phase 2 | `src/components/objects/object-detail.tsx` | Playwright Question ↔ Citation ↔ Note workflow |
| **Intent Target 2:** Automated Spaced Repetition Queue | Phase 3 | `src/actions/study.ts`, `src/lib/srs/sm2.ts` | Incorrect answer queue enrollment integration test |
| **Intent Target 3:** Zero-Paywall Core Study Loop | Phase 1, 3, 4 | Space member access across all object and study views | Tenant member access verification |
| **Intent Target 4:** Tenant-Isolated MCP Integration | Phase 5 | `src/app/api/mcp/route.ts`, `src/domain/api-keys.ts` | MCP cross-space query 403 rejection test |
| **Intent Target 5:** Deterministic Exam Simulation | Phase 4 | `src/components/exam/simulated-exam-runner.tsx` | Timer expiration & grace window verification test |

---

## 7. Approval & Sign-Off Gate

- [x] Technical architecture, security boundaries, and data models are fully specified.
- [x] All 6 implementation phases have explicit file targets and actionable deliverables.
- [x] Automated testing matrix covers Unit (Vitest), Integration (Emulator), and E2E (Playwright).
- [x] All previously open questions from `intent.md` and `spec.md` are resolved and mapped.
- [x] Ready to proceed with Phase 1 execution in the Build stage.

## 8. Recorded drift from this plan (2026-09-20)

The actual Build-stage implementation on `prototype` diverges from §2's per-phase file
inventory in ways worth recording here rather than silently, per this repo's
`anthropic-sdlc` skill (rule: material implementation drift updates `plan.md` in the
same change):

- **`middleware.ts` → `proxy.ts`.** Next.js 16 (the version pinned in this repo,
  confirmed against `node_modules/next/dist/docs/`) renamed the `middleware.js`
  convention to `proxy.js`; `middleware.ts` is deprecated and no longer the correct
  file name. Route protection for `/space`, `/question`, `/study`, `/review`, and
  the reverse redirect off `/login`, now live in `src/proxy.ts` (`export function
  proxy`), doing a cheap cookie-presence check only — Next's own guidance is that
  Proxy is for optimistic redirects, not a full session/authorization boundary, and
  every Server Action already re-verifies the session cookie itself
  (`src/lib/firebase/session.ts`'s `user()`/`authorized()` — corrected 2026-09-21;
  this paragraph previously pointed at `src/actions/recall.ts`, which was already
  stale against the file-move this same §8 records further down under "Firebase
  configuration is one `src/lib/firebase/` directory").
- **Consolidated domain/action files, not one file per concern.** Auth, Spaces,
  polymorphic objects + links, moderation (archive/report/resolve), and the study/exam
  session engine (Phases 1–4 of §2/§3) are implemented in two files —
  `src/domain/recall.ts` and `src/actions/recall.ts` — instead of the
  `auth.ts`/`spaces.ts`/`objects.ts`/`relations.ts`/`study.ts`/`exam.ts` split in §2's
  file inventory. Functionally these cover: session cookies, Space create/invite,
  object CRUD with immutable numbered revisions, `object_links` edges with same-Space
  enforcement, the one-Exam-per-user rule (FR-10), report-and-hide moderation (FR-9),
  and configurable practice/simulated-exam sessions (FR-11) with server-side grading
  and scheduling.
- **`firestore.rules` is a blanket `allow read, write: if false`,** not the granular
  per-collection rules §1.1/§8 describe. This is intentional, not a gap: every read and
  write goes through a Server Action on the Admin SDK (which bypasses rules), and there
  is no direct-client Firestore path anywhere in the current code, so there is nothing
  for a granular allow-rule to safely permit.
- **Spaced-repetition scheduling (`schedule()` in `src/domain/recall.ts`) was
  initially a simplified SM-2-family algorithm; it now implements §3 Phase 3 literally.**
  Resolved in the second pass below — `schedule()` takes a 0–5 quality grade and applies
  `EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))` with a 1.3 floor and the
  1 / 6 / `I(n-1) × EF'` interval ladder. Because auto-graded formats have no independent
  self-assessment step, `autoQuality()` maps a machine verdict onto that scale (4 correct,
  1 incorrect) and the learner can override it in practice mode.
- **Component locations:** the Space switcher lives at
  `src/components/recall/space-switcher.tsx` (next to the other Recall domain
  components), not `src/components/workspace/space-switcher.tsx` from §2's Phase 1 row.
- **Firebase configuration is one `src/lib/firebase/` directory, not the
  `src/lib/firebase/config.ts` + `src/lib/firebase-admin/app.ts` split §1.1/§2's Phase 1
  rows describe.** Client init is `src/lib/firebase/client.ts` (`browserAuth()`), Admin
  init is `src/lib/firebase/admin.ts` (`firebase()` returning `{ auth, db }`), and
  session helpers are `src/lib/firebase/session.ts` (`user()`/`authorized()`, described
  above). Checked against Context7 docs for the pinned SDK versions
  (`firebase@12.19.0`, `firebase-admin@14.4.0`):
  - Both `client.ts` and `admin.ts` guard `initializeApp` with `getApps()[0] ?? ...` —
    required under Next.js dev-mode module reloads, which would otherwise call
    `initializeApp` twice on the same default app.
  - `client.ts` guards `connectAuthEmulator` with `!auth.emulatorConfig` before calling
    it. This isn't defensive style: the SDK's emulator connector throws
    `auth/emulator-config-failed` on a second call in the same session unless the
    config is identical, so an unguarded call breaks on Fast Refresh.
  - `admin.ts` sets `FIREBASE_AUTH_EMULATOR_HOST` / `FIRESTORE_EMULATOR_HOST` at module
    load, before `firebase()` ever calls `getAuth()`/`getFirestore()`. The Admin SDK
    reads the emulator host env var once, at first construction, so setting it any
    later than this would silently fall through to production Firebase.
  - `client.ts` reads `NEXT_PUBLIC_FIREBASE_API_KEY` / `_PROJECT_ID` / `_AUTH_DOMAIN`
    with `demo-recall` fallbacks so local dev needs no `.env` file; `admin.ts` reads
    `FIREBASE_PROJECT_ID` with no explicit credential (Application Default
    Credentials apply in a real deployment) and refuses to start against a non-`demo-`
    project unless the emulator host is set, so a misconfigured environment cannot
    accidentally write to a live project.
  - spec.md §10's directory tree is updated alongside this entry to match.
- **Alternative considered and rejected: FirebaseUI for `src/app/login/page.tsx`.**
  Firebase ships two libraries under this name, checked against Context7/official docs
  (`firebase.google.com/docs/auth/web/firebaseui`):
  - `react-firebaseui` / `firebaseui-web` (Context7's top match by snippet count) wraps
    the legacy v8 **compat** SDK (`firebase/compat/app`) and is incompatible with this
    repo's modular-only `firebase@12.19.0` usage — adopting it would mean installing a
    second, deprecated copy of the Auth SDK.
  - `@firebase-oss/ui-react@beta` + `@firebase-oss/ui-core` is the current rewrite: built
    on the modular SDK, and installable through the shadcn registry
    (`npx shadcn@latest add @firebase/sign-in-auth-screen @firebase/google-sign-in-button`),
    which fits this repo's existing shadcn/Base UI stack.
  - This second package is not hypothetical here — `.worktrees/old-9` already used it
    (`FirebaseUIProvider`/`initializeUI` in
    `.worktrees/old-9/src/components/auth/firebase-provider.tsx`, documented in
    `.worktrees/old-9/docs/FIREBASE_AUTHENTICATION.md`): FirebaseUI signs in client-side,
    then the client POSTs the ID token to a route that verifies it with the Admin SDK and
    sets an HttpOnly session cookie — evidence only, per spec.md §9.13, not something the
    root branch imports.
  - **Not adopted**, because it assumes the client SDK owns persistent Auth state (the
    component keeps the user signed in after the widget completes), while this repo's
    Phase 1 design deliberately does the opposite: `src/app/login/page.tsx` calls
    `signInWithEmailAndPassword`/`createUserWithEmailAndPassword` only to mint an ID
    token, exchanges it for the `recall-session` cookie via the `login()` Server Action,
    then immediately `signOut()`s the client SDK — Firebase Auth state is never persisted
    client-side, matching `firestore.rules`' blanket-deny and the server-only Admin SDK
    boundary above. Wiring FirebaseUI's screen components to that pattern would mean
    overriding their built-in state ownership for a two-field form that already works.

### What this pass actually closed out (Build stage, Phase 1 + UI wiring)

Before this pass, `src/actions/recall.ts` and `src/domain/recall.ts` already implemented
the backend above, and `src/components/recall/object-editor.tsx` and
`study-panel.tsx` already implemented a real create/edit dialog and a real
practice/simulated-exam runner — but nothing rendered them: `/space`, `/question`,
`/study`, and `/review` were static mockups with hardcoded fake data, there was no
`recall-session` cookie route protection, and there was no Space switcher. This pass:

- added `src/proxy.ts` (route protection, described above);
- added `src/lib/space.ts` (`requireSnapshot()`, the shared authenticated
  Space-scoped data loader for all four space pages);
- added `src/components/recall/space-switcher.tsx` (switch/create Space, invite a
  member — Phase 1's last missing piece) and wired it, plus sign-out and a "New
  object" dialog, into `src/components/space-frame.tsx`;
- rewired `/space`, `/question` (now a real object list via new
  `src/components/recall/object-list.tsx`, with edit/archive/restore/report/resolve),
  `/study`, and `/review` (via new `src/components/recall/study-session.tsx`) to real,
  authenticated, Space-scoped data instead of static mockups.

### What the second pass closed out (Build stage, Phases 2–6)

- **Phase 2 (FR-8) — object detail.** `src/app/question/[id]/page.tsx` plus
  `src/components/recall/object-detail.tsx` render any object kind with a Linked
  objects rail and a reactive Backlinks panel, both navigable. A foreign Space's
  object answers 404, never 403 (§6 Phase 6 item 3, spec.md §2.4.3).
- **Phase 3 — literal SM-2.** As described above, plus the 0–5 self-grade UI in
  `study-panel.tsx` (keyboard 0–5) backed by a new `rateAttempt()` action. Each
  attempt stores the study record as it stood *before* it, so a self-grade recomputes
  the schedule from that base rather than compounding on the auto-graded one.
- **Phase 5 — API keys + MCP server, complete.** `src/domain/api-keys.ts`
  (`rcl_live_` + 32 base62 chars by rejection sampling, SHA-256, bearer parsing),
  `src/actions/api-keys.ts` (owner-only issue/list/revoke; the raw key is returned
  once and never stored), `src/lib/mcp/tools.ts` (all four §7.2.3 tools), and
  `src/app/api/mcp/route.ts` (JSON-RPC 2.0 over JSON or SSE). `/settings` exposes
  key management.
- **Phase 6 — partial.** CLS-stable `loading.tsx` skeletons for every space
  segment via `SpaceSkeleton` (mirrors `SpaceFrame`'s box model exactly), a
  real `not-found.tsx`, and a working mobile navigation drawer (the header button
  was previously inert) with Escape-to-close and a labelled backdrop.

Deliberate deviation from §2's file inventory, same rationale as the consolidation
note above: `user()`/`authorized()` moved out of `src/actions/recall.ts` into
`src/lib/firebase/session.ts` so `src/actions/api-keys.ts` could share them. They
cannot simply be exported from a `"use server"` module — that would publish them to
the browser as callable Server Actions.

### Phase 6 verification suite (third pass)

`tests/e2e/` is now a Playwright suite (Chromium) covering authoring with
links and backlinks (FR-8), practice grading with the 0–5 self-grade, the simulated
exam, archiving removing a question from scope, route protection across all five
space routes, the cross-Space 404, and the full MCP key lifecycle — issue in
`/settings`, drive all four tools over HTTP, then revoke and confirm `-32001`.

**Deviation from §4's testing matrix:** §4 names Vitest for the unit and integration
rows. Vitest is deliberately not installed. `node:test` (via `tsx`) already covers the
pure-domain unit row, and Playwright covers the integration row as well as E2E — the
MCP server authenticates with a bearer key rather than a session cookie, so
Playwright's `request` fixture drives it directly, in the same suite, against the same
emulators. A third runner would add configuration surface without adding coverage.
The Firestore-rules row of §4 is moot while `firestore.rules` is a blanket deny (see
the drift note above): there are no granular rules to assert.

Two non-obvious traps were found and are written up in `TESTING.md` so they are not
rediscovered: Next 16 blocks `/_next/*` dev resources for `127.0.0.1` (the page renders
but **never hydrates**, silently), and saving an object navigates between two
`/question/<id>` URLs, so a path-pattern URL wait returns the previous id.

### TipTap rich text (fourth pass)

§3 Phase 2's headless TipTap editor now exists (`src/components/recall/rich-text.tsx`,
`@tiptap/react` + StarterKit): a toolbar, markdown input rules, and a read-only renderer
that shares the same extension set and `.rich-text` styles, so authored and displayed
content cannot drift. `objectInput.text` was replaced by `objectInput.body`, the
ProseMirror document, and `text` is now derived server-side via `plainText(body)` —
clients no longer send it, so the projection cannot be desynced from the document. The
document is validated as untrusted input (`richDoc`) with a depth cap rather than trusted
because TipTap produced it.

Two bugs were found and fixed while wiring this up, both covered by the new E2E case:
passing the parent's state back in as `content` re-applied it on every keystroke and
silently reverted structure the editor had just created (the editor now owns its
document via `defaultValue`), and the toolbar's active states re-rendered the editor
until they were moved to `useEditorState`.

Not done: inline object mention chips inside the editor (§3 Phase 2 lists them; linking
is done through the Linked objects selector instead).

### Command palette (fifth pass)

The sidebar's "Search space" button was inert, like the mobile nav button before
it. It now opens a command palette (Cmd/Ctrl+K), built on the existing `cmdk` primitive:
fuzzy search across the Space's unarchived objects, plus navigation and a hand-off to
the create dialog. Per FR-12, opening or focusing it mutates nothing — every item either
navigates or opens an explicit create surface.

It is composed from `Dialog` + `Command` rather than the generated `CommandDialog`,
which renders its header outside `DialogContent` and therefore crashes with
`Cannot read properties of undefined (reading 'subscribe')` — the generated
`src/components/ui/` primitives are not all sound, and `CONVENTIONS.md` says to work
around them rather than hand-edit generated output.

Still not done (later Build-stage work): space tabs and the context panel from
spec.md §5.5 (FR-12's remaining surfaces), the full reduced-motion/focus-restoration
matrix and an axe/visual-regression pass, and a CI workflow file.

**Verification run for the second pass:** `pnpm exec tsc --noEmit` (clean), `pnpm lint`
(clean, same single non-blocking `noDocumentCookie` warning), `pnpm test` (18/18
passing — 12 in `tests/recall.test.ts`, 6 in the new `tests/api-keys.test.ts`),
`pnpm run build` (succeeds; `/api/mcp` and `/settings` both appear in the route
manifest). `/api/mcp` was additionally driven end-to-end against the local emulators
with seeded Space/object/key fixtures, confirming every contract in spec.md §7.2.4:
`initialize` and `tools/list` succeed; all four tools return their specified shapes
(including `get_object`'s links and backlinks); a missing or revoked key gives
`-32001`; a key whose creator is no longer a Space member gives `-32003`; passing a
foreign `spaceId` gives `-32003`; a foreign object id gives `-32004`; out-of-range
params give `-32602`; an unknown tool gives `-32601`; malformed JSON gives `-32700`;
a bad envelope gives `-32600`; a notification returns 202 with no body; and an
`Accept: text/event-stream` request returns the same payload as an SSE frame.
`/settings` redirects to `/login` (307) when unauthenticated. Not verified in this
pass: the create-Space/save-object/study mutation flows through an actual browser,
which still needs a Playwright or `/qa` pass.

**Verification run for the first pass:** `pnpm exec tsc --noEmit` (clean), `pnpm run lint`
(clean, one non-blocking `noDocumentCookie` warning), `pnpm test` (8/8 passing,
unchanged), `pnpm run build` (succeeds; `/space`, `/question`, `/study`, `/review`
now render dynamically per-request as expected once they read cookies). Additionally
verified live against the local Firebase emulators (`pnpm run emulators` +
`pnpm run dev`): an unauthenticated request to `/space` and `/study` redirects to
`/login` (307); a request to `/login` carrying a valid `recall-session` cookie
redirects to `/space` (307); a request to `/space` with a valid session cookie
for a freshly created emulator user returns 200 and renders the real "Create your first
Space" empty state. Not verified in this pass: the create-Space/save-object/study
mutation flows through an actual browser (would need a Playwright/qa pass, since these
are Server Actions and not easily driven from curl).

### Transient-surface contract, space tabs, and context panel (sixth pass)

The fifth pass left two §5.5 items open: the context panel and space tabs, plus
the full reduced-motion/focus-restoration matrix. Both are now closed:

- **Context panel (`src/components/recall/context-panel.tsx`).** The object detail
  page's two stacked cards became one panel with a named `tablist` (Links / Backlinks
  / Details), semantic `tab`/`tabpanel` roles, one selected tab, arrow-key traversal
  with Enter to activate, and a reversible collapse — all view state, mutating nothing
  in the graph, per spec.md §5.5's "Context-panel tabs" row.
- **Space tabs (`src/components/recall/space-tabs.tsx`, `src/domain/tabs.ts`).**
  Visited objects open as closable tabs in the space header, persisted via a capped
  cookie (`parseTabs`/`serializeTabs`, unit-tested in `tests/tabs.test.ts`); closing the
  active tab selects a deterministic neighbour (`nextActiveTab`).
- **Focus restoration.** The mobile nav drawer and the context panel's collapse
  control now hand focus back to the control that replaces them on close/collapse —
  previously only the Base UI dialogs did this, and spec.md §5.5 names focus loss a
  required regression case.
- **Reduced motion.** A `prefers-reduced-motion: reduce` block in `src/app/globals.css`
  drops nonessential transitions while preserving final state.
- **`Mod+P`** now opens the same command dialog as `Mod+K`.

All of the above is covered by `tests/e2e/interaction.spec.ts`. Still not done from
§6's Phase 6 list: an axe/visual-regression pass (no `axe-core` dependency is
installed), and a CI workflow file (no `.github/workflows/`).

**Note:** the commits for this pass (`1c8d62b2`, `94610cc0`) landed without a
`plan.md` update in the same change, contrary to this repo's own drift-recording rule
stated at the top of §8; this entry backfills that gap.

**Verification run for this pass:** `pnpm exec tsc --noEmit` (clean), `pnpm run lint`
(clean, 2 instances of the same pre-accepted non-blocking `noDocumentCookie` warning),
`pnpm test` (28/28 passing), `pnpm run build` (succeeds, all 10 routes compile). Not
run live in this pass: the Playwright E2E suite (needs Firebase emulators + `next dev`
up together).

**Verification run 2026-09-21 (`/anthropic-sdlc` verify pass): `pnpm test:e2e` run
live.** First attempt failed at the `webServer` step — two Firebase emulator processes
(`java`, `node`) were already bound to ports 8080/9099/4000 from an earlier session and
never shut down; Playwright's `reuseExistingServer` health check didn't recognize them
as ready, so it tried to start a second instance and hit "port taken." Stopped the
stale processes and reran: **16/17 `tests/e2e/` specs passed.** The one failure —
`interaction.spec.ts` › "closing a transient surface returns focus to its opener" — was
a `page.waitForURL("**/space")` timeout inside the shared `signUp()` helper
(`tests/e2e/helpers.ts:48`), not a failure of the focus-restoration assertion the test
never reached. Re-running that spec alone reproduced the same setup-step timeout,
confirming it's a cold-start cost (Turbopack compiling `/login` and `/space` on
their first-ever hit against a freshly started `next dev`) rather than flake-by-chance
or a product regression: every other spec that calls the same `signUp()` helper,
including two other focus-restoration specs in the same file (the mobile drawer and the
context panel), passed once those routes were warm. Follow-up, not yet done: give the
first E2E test a longer timeout or add a `webServer`-adjacent warm-up request so a cold
Turbopack compile can't exceed Playwright's default 30s test timeout.

### shadcn/ui composition rules formalized (2026-09-21)

`.agents/skills/shadcn/` (SKILL.md + `rules/*.md`) was read in full and condensed into
a project-scoped rule file, `.agents/rules/shadcn.md`, linked from `AGENTS.md`'s
tool-specific configuration list and referenced from spec.md §5.6 (new) and §1.1 above.
This is governance, not a code change: §1.1's Presentation Layer boundary and spec.md
now say explicitly, not just implicitly, that this repo's shadcn usage is Base UI
(`render`/`nativeButton`, not Radix `asChild`), which registry state is allowed
(`components.json` has `registries: {}`, matching spec.md §9.4/§9.15's existing
supply-chain caution), and which primitive to reach for (`FieldGroup`/`Field` over raw
`div` layout, `toast` from `@/components/ui/toast` over `sonner` since this is a Base UI
project, semantic tokens/variants over raw Tailwind colors, `data-icon` over manual icon
margins).

Also recorded: `src/components/ui/message.tsx`, `message-scroller.tsx`, `bubble.tsx`,
`attachment.tsx`, and `marker.tsx` (the shadcn chat primitives) are present from the
base-nova scaffold but unused — no file under `src/app` or `src/components/recall`
imports them. Recall has no chat surface; this is scaffold residue, not a hidden
feature, and should not be read as evidence one exists.

**Verification:** spot-checked `src/components/recall/` and `src/app/` against the new
rule file — no `space-x-*`/`space-y-*`, no raw Tailwind status colors
(`text-emerald-*`/`bg-blue-*`/etc.), no manually paired `w-N h-N`, and no `asChild`
usage found; `data-icon` is already in use. The codebase already conformed before this
pass — this entry makes the rule explicit and durable rather than fixing a violation.

### Independent verification pass (2026-09-21) — exam timer, idempotency, and moderation-role gaps

A subagent-driven read-only audit (six parallel agents reading `src/` directly, one per
subsystem: auth/tenant, objects/graph/TipTap, SM-2/exam, MCP/API keys, space shell,
and build/test health) checked every material claim in this document and in spec.md
against the actual code on `prototype` at `4d23c6b0`. Build/lint/test health was
reconfirmed clean and unchanged (`tsc --noEmit` clean, `pnpm lint` — the same 2
pre-accepted `noDocumentCookie` warnings, `pnpm test` 28/28, `pnpm run build` — all 10
routes), and every other subsystem's documented behavior matched the code exactly
(auth boundary, object/relations/revision handling, TipTap, all 4 MCP tools and JSON-RPC
error codes, command palette/space-tabs/context-panel/reduced-motion/focus
restoration). Two real gaps were found and are recorded here rather than silently:

- **Simulated-exam grace window and `SESSION_EXPIRED` (spec.md §2.4.3) are not
  implemented.** `startSession` (`src/actions/recall.ts`) hardcodes a 90-second-per-
  question deadline rather than the user-configured time limit FR-11 describes, and
  there is no server-side grace window: `saveSessionAnswer` throws a generic error the
  instant `Date.now() >= deadline`, with zero tolerance, and `finishSession` has no
  deadline check at all (it will score and persist whenever called, before or long
  after expiry). Grepping `src/` for `SESSION_EXPIRED`, `examDurationSeconds`, and
  `grace` returns nothing. spec.md §2.4.3/FR-11 are corrected to describe this as a
  known simplification, not a passing contract, until the grace window and configurable
  limit are actually built.
- **The documented client retry-queue and idempotency-key format (spec.md §2.4.3
  "Network Interruption...") were never built.** `src/components/study/` (the
  `retry-queue-banner.tsx` row from §2's file inventory) does not exist; there is no
  offline mutation queue, exponential backoff, or "amber status pill." Deduplication is
  real but uses a simpler mechanism than documented: a deterministic
  `attemptId = "${session.id}_${question.id}"` plus a transactional exists-check
  (`src/actions/recall.ts`), not the `${userId}_${questionId}_${attemptTimestamp}` key
  spec.md names. This meets the no-duplicate-history goal through a different key shape
  (session+question, scoped by the Firestore path rather than by an explicit timestamp),
  so it is not a regression — spec.md's wording is corrected to match what actually
  ships rather than left describing an unbuilt design.
- **FR-9 "Space's admin or a platform admin" overstates the implemented role model.**
  `changeObject`'s `"resolve"` action (`src/actions/recall.ts`) requires
  `space.ownerId === caller.uid` — there is no separate Space-admin or platform-admin
  role anywhere in the domain model. spec.md FR-9 is corrected to say "the Space's
  owner," matching intent.md's actual constraint (a report-and-hide model that never
  itself specified a role distinct from ownership).

Two smaller, non-blocking observations from the same pass, recorded for completeness
rather than acted on: `saveObject` already refuses to link an archived or reported
object into another object's `links` ("A linked object is unavailable in this Space")
— a stricter, undocumented safety behavior beyond what spec.md §6/FR-3 require, not a
gap; and `finishSession`'s simulated-exam scheduling reads the *current* stored study
record at session end rather than a baseline captured at session start, so a learner
running two concurrent sessions touching the same question could compound scheduling in
an untested way — worth a regression test if concurrent sessions become a supported
scenario, but not addressed here since single-session use is the only flow either
spec.md or plan.md describes.

`tests/e2e/` is 4 spec files (`interaction.spec.ts`, `mcp.spec.ts`, `tenancy.spec.ts`,
`space-flow.spec.ts`) totaling 17 individual test cases — the "9 specs" figure the
third-pass note above used was a stale pre-consolidation file count; the "17" figure
used elsewhere in this document and in spec.md was already correct and needed no
change.

### "Workspace" UI-shell terminology renamed to "Space" (2026-09-21)

Product owner request: rename the app's UI-shell naming ("Workspace") to "Space"
throughout the live app, tests, and this document/spec.md/intent.md. Flagged before
starting: "Space" already names the tenant/organization domain concept (`spaceId`,
the `space-switcher.tsx` Space switcher, private Spaces) — the UI shell was a
*separate* concept (the `/workspace` route and its `WorkspaceFrame`/`WorkspaceTabs`/
`WorkspaceSkeleton` components), so this rename makes both concepts share one word.
Product owner confirmed proceeding anyway, scoped to app code + user-facing text +
the governing docs — not `.worktrees/old-*` (frozen historical checkouts that
spec.md §3.1/§5.5 cite by their *actual* component/file names, e.g. old-2's
`WorkspaceShell`, old-4's workspace database layer — renaming those would make the
citations inaccurate, not just cosmetic) and not this document's own §2/§3 original
approved-plan text (left as originally written, consistent with how `middleware.ts`
is still listed there even though it's actually `src/proxy.ts` — see the top of this
§8). Sanity-checked against `old-9` (spec.md's "most complete application baseline")
before proceeding: it already routes at `/spaces`, not `/workspace`, supporting this
direction.

Renamed (`git mv` + content edits): `src/lib/workspace.ts` → `src/lib/space.ts`
(`WorkspaceData` → `SpaceData`); `src/components/workspace-frame.tsx` →
`src/components/space-frame.tsx` (`WorkspaceFrame` → `SpaceFrame`);
`src/components/recall/workspace-tabs.tsx` → `space-tabs.tsx` (`WorkspaceTabs` →
`SpaceTabs`); `src/components/recall/workspace-skeleton.tsx` → `space-skeleton.tsx`
(`WorkspaceSkeleton` → `SpaceSkeleton`); the `/workspace` route directory
(`src/app/workspace/`) → `src/app/space/`; `tests/e2e/workspace-flow.spec.ts` →
`space-flow.spec.ts`. Every importer (`src/proxy.ts`'s matcher/redirects, all five
page/loading pairs under `src/app/`, `command-palette.tsx`, `not-found.tsx`,
`layout.tsx`'s metadata, the marketing `src/app/page.tsx`, `login/page.tsx`, the
`clear-session` route comment, and `tests/e2e/helpers.ts`/`interaction.spec.ts`/
`tenancy.spec.ts`) and user-facing strings ("Search workspace" → "Search space",
`aria-label="Workspace navigation"` → `"Space navigation"`, "Back to your workspace"
→ "Back to your space") were updated to match. `ARCHITECTURE.md` and
`CONVENTIONS.md` were updated for the new paths/names. `intent.md` and this
document's FR-12/NFR-5 titles, §5.5's "Main workspace tabs" row, and §11/§12's
narrative were updated in spec.md/intent.md to match; §2/§3 here were left alone per
the paragraph above.

**Verification:** `pnpm exec tsc --noEmit` (clean), `pnpm run lint` (clean, the same
2 pre-accepted `noDocumentCookie` warnings as every prior pass — unrelated to this
rename), `pnpm test` (28/28 passing, unchanged), `pnpm run build` (succeeds; `/space`
appears in the route manifest in place of `/workspace`, all 10 routes compile). Not
run live in this pass: the Playwright E2E suite (needs Firebase emulators + `next
dev` running together) — the route/label/aria-name updates inside
`tests/e2e/interaction.spec.ts`, `tenancy.spec.ts`, and the renamed
`space-flow.spec.ts` are mechanically consistent with the app changes but not yet
proven live.

### Complete shadcn/ui Component Inventory & Requirements Harmonization (2026-09-21)

All shadcn/ui design system requirements, primitive constraints, and component
inventories were exhaustively formalized and reconciled across `CONVENTIONS.md`,
`spec.md` (§5.6.1–§5.6.8), and this document (§1.1, §1.3, §4):

- **Comprehensive Inventory Mapping**: Documented all 61 Base UI primitives currently
  installed under `src/components/ui/`, categorizing them into Workspace/Shell navigation,
  Action controls, Form & input controls, Overlays & transients, Data display &
  feedback, and Scaffolded unmounted residue (chat primitives).
- **Enforced Architectural Invariants**:
  - Base UI (`@base-ui/react`) composition: `render={<X />}` prop with `nativeButton={false}`
    when swapping trigger elements; zero `asChild` usage across all components.
  - Form field discipline: `<FieldGroup>` + `<Field>` mandatory for all inputs; composite
    inputs wrapped in `<InputGroup>` + `<InputGroupInput>`/`<InputGroupTextarea>` with
    `<InputGroupAddon>`; 2–7 option sets mapped to `<ToggleGroup>`; validation states
    bound to `data-invalid` / `aria-invalid`.
  - Overlay accessibility: Mandatory `*Title` elements on `<Dialog>`, `<Sheet>`, and `<Drawer>`.
  - Semantic component usage: Mandatory replacement of custom markup with `<Alert>`, `<Empty>`,
    `@/components/ui/toast`, `<Separator>`, `<Skeleton>` (guaranteeing CLS < 0.05), and `<Badge>`.
  - Button loading: Composition via `<Spinner data-icon="inline-start" />` + `disabled`.
  - Styling guardrails: Layout-only `className`, no `space-x-*`/`space-y-*` (strict `gap-*`),
    `size-*` shorthand for equal dimensions, `truncate` for overflow text, and semantic OKLCH
    tokens with zero manual `dark:*` or raw color overrides.
- **Verification**: TypeScript compilation, Biome linting (`biome check src tests`), test suite
  (28/28 passing), and production build (`pnpm run build` compiling all 10 routes) all passed cleanly.

