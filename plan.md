# Implementation Plan: Recall — Collaborative Private Workspace & Exam Prep Platform

- **Document Purpose:** Engineering implementation plan for the Recall platform, defining technical architecture, phased execution roadmap, testing matrix, and verification boundaries.
- **Scope:** Greenfield production implementation of multi-tenant private Spaces, dynamic object modeling (Questions, Notes, Citations, Exams, Tags, Collections), TipTap rich text serialization, bidirectional knowledge graph links/backlinks, server-authoritative SM-2 spaced repetition engine, timed simulated exam sessions, and Space-scoped Model Context Protocol (MCP) read server.
- **Status:** Approved — incorporating resolved architectural specifications from [spec.md](./spec.md) and [intent.md](./intent.md); ready for Build stage.
- **Derived From:** [intent.md](./intent.md), [spec.md](./spec.md), [DESING.md](./DESING.md)

---

## 1. Architecture & Dependency Boundaries

### 1.1 Architectural Layers
Recall follows a layered, server-authoritative architecture built on Next.js 15 (App Router, React 19) and Firebase:
- **Presentation Layer (`src/app/`, `src/components/`):** React Server Components (RSC) and Client Components styled with Tailwind CSS v4 and shadcn Base UI (`base-nova` neutral palette with object-type accent tokens). View state (modals, active tabs, search queries, sidebar peek) is strictly separated from persisted domain state.
- **Action & Mutation Boundary (`src/actions/`):** Next.js Server Actions execute all business mutations using the server-only `firebase-admin` SDK. Direct client-side Firestore writes are completely disabled by security rules. Every Server Action resolves the caller session, verifies tenant membership, validates schema constraints, and executes atomic batched writes.
- **Domain Services (`src/domain/`):** Pure, framework-agnostic business logic decoupled from transport and database drivers. Contains the SM-2 spaced repetition calculator, graph relationship invariants, exam attempt evaluators, and validation rules for question formats.
- **Data & Security Layer (`firestore.rules`, `src/lib/firebase-admin/`):** Firestore NoSQL database enforcing multi-tenant isolation by `spaceId`. Centralized `object_links` collection tracks graph edges with strict endpoint symmetry. API keys are stored hashed in `/api_keys` and are accessible solely via the Admin SDK.
- **MCP Integration Layer (`src/app/api/mcp/route.ts`):** High-performance JSON-RPC 2.0 Route Handler providing read-only access for external AI clients. Authenticated via Space-scoped SHA-256 hashed API keys (`rcl_live_...`).

### 1.2 System Boundary Rules
- **No Direct Client Writes:** Clients must never invoke Firestore `.set()`, `.update()`, or `.delete()` directly. All mutations route through Server Actions.
- **Zero Cross-Space Leakage:** Queries must always filter by `spaceId`. Link edges must verify that both `sourceId` and `targetId` share the exact same `spaceId`.
- **Worktree Isolation:** The repository worktrees (`.worktrees/`) are historical reference checkouts only. Runtime code must never import from or reference `.worktrees/`.
- **Path Portability:** All documentation and configuration must strictly use repository-relative paths (e.g. `./src/domain/recall.ts`). Absolute machine paths are strictly prohibited.

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
| **FR-12 / NFR-5:** Workspace Shell & Interaction Contracts | Phase 6 | `src/components/workspace/*`, `src/components/ui/*` | Focus, keyboard, and accessibility inspection tests |
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
