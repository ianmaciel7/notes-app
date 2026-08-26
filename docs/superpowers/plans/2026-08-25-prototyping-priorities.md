# Prototyping Priorities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the OpenSpec changes required for the Notes App prototype from P0 through P7 without pulling production-only platform work forward.

**Architecture:** Preserve the existing local-first reducer/controller architecture and the runtime Structure registry. Close each OpenSpec change in dependency order, preferring shared lifecycle contracts and existing shadcn/Next.js surfaces over parallel registries or object-specific forks. Reference evidence is re-confirmed before fidelity-sensitive work, and block-editor/storage ownership remains with its dedicated changes.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5, shadcn, Tailwind CSS v4, Tiptap 3.30.2, Node 22 tests, Playwright 1.62.1, OpenSpec.

**Spec:** `openspec/CAPACITIES_PARITY_ROADMAP.md` plus the active change specs under `openspec/changes/`.

## Global Constraints

- Prototype scope is P0 through P7 only; P8+ platform/integration work stays deferred.
- Re-confirm `docs/references/` and `artifacts/capacities-reference/` before fidelity-sensitive changes.
- Do not invent behavior marked `UNKNOWN` by the reference contract.
- Preserve the current workspace storage key/schema unless the owning OpenSpec explicitly changes it.
- Preserve `add-block-editor` ownership of block document types/body persistence/migrations.
- Reuse the runtime Structure registry; do not introduce a second mutable object-type registry.
- Keep Archive reserved/non-creatable.
- Prefer existing shadcn primitives and shared variants over object-specific styling forks.

---

### Task 1: Close P0 lifecycle coverage

**Files:**
- Create: `src/lib/workspace-object-lifecycle.ts`
- Modify: `src/lib/workspace-objects.ts`
- Modify: `tests/object-lifecycle-contracts.test.mjs`
- Modify: `openspec/changes/align-workspace-with-current-capacities/tasks.md`

**Interfaces:**
- Consumes: `WorkspaceStructure.lifecycleKind`, `WorkspaceStructure.ownership`, `getCreationFlow()` and the existing workspace reducer.
- Produces: `WorkspaceObjectLifecycleScenario`, `getWorkspaceObjectLifecycleScenario(structure)` and one explicit scenario for every creatable built-in/preset/custom Structure.

- [ ] **Step 1: Add a failing source-contract test** proving every documented P0 object family is represented, Archive is excluded, and custom Structures derive behavior from `lifecycleKind`.
- [ ] **Step 2: Run `node --test tests/object-lifecycle-contracts.test.mjs`** and confirm the new assertions fail before implementation.
- [ ] **Step 3: Implement `workspace-object-lifecycle.ts`** as the single mapping from lifecycle kind to creation surface/write surface/activation behavior; keep named object ids as evidence metadata rather than a second domain registry.
- [ ] **Step 4: Make `workspace-objects.ts` consume the lifecycle helper** when choosing instant creation versus task/url/file capture, preserving current reducer outputs and storage schema.
- [ ] **Step 5: Run the focused unit/source tests and update only evidence-backed P0 task checkboxes.**
- [ ] **Step 6: Commit the P0 lifecycle slice.**

### Task 2: Verify and finish block-editor P0

**Files:**
- Verify/modify only as failures require: `src/components/block-editor*.tsx`, `src/editor/**`, `tests/block-editor-contract.test.mjs`, `tests/slash-*.test.mjs`, `tests/e2e/**`
- Reference: `docs/references/capacities-block-handle.md`, `docs/references/capacities-slash-menu.md`
- Modify: `openspec/changes/add-block-editor/tasks.md`

**Interfaces:**
- Consumes: stable editor document API and existing Tiptap integration.
- Produces: verified slash-menu positioning, handle geometry/reorder/menu behavior, reduced-motion/read-only/mobile behavior and browser coverage.

- [ ] **Step 1: Re-confirm both block-editor reference files and ownership boundaries.**
- [ ] **Step 2: Run focused Node tests and Playwright block-editor coverage.**
- [ ] **Step 3: Fix only observed failures, adding regression tests before each code fix.**
- [ ] **Step 4: Run `pnpm verify`, relevant Playwright tests, `git diff --check`, and strict OpenSpec validation.**
- [ ] **Step 5: Update only passing task checkboxes and commit.**

### Task 3: Verify runtime object-type P0

**Files:**
- Verify/modify only as failures require: `src/lib/workspace-object-types.ts`, `src/lib/workspace-object-storage.ts`, runtime Structure consumers, `tests/runtime-object-types.test.mjs`
- Modify: `openspec/changes/add-runtime-object-type-model/tasks.md`

**Interfaces:**
- Consumes: canonical runtime `WorkspaceStructure` registry.
- Produces: verified Structure persistence, mutation guards, routes/UI consumers and refreshed graph evidence.

- [ ] **Step 1: Run focused domain/storage/UI tests and TypeScript/lint checks.**
- [ ] **Step 2: Run relevant Playwright and production route/build checks.**
- [ ] **Step 3: Refresh Graphify only after material source changes.**
- [ ] **Step 4: Record the deferred follow-up order exactly as required by the OpenSpec and update passing checkboxes.**
- [ ] **Step 5: Commit.**

### Task 4: P1 typed property values

**Files:**
- Verify/modify: `src/lib/workspace-property-values.ts`, Structure property definitions, property editor consumers and focused tests.
- Modify: `openspec/changes/add-typed-property-values/tasks.md`

**Interfaces:**
- Consumes: runtime Structures and entity persistence.
- Produces: validated writable/default/system property values used by relations, queries, views and tasks.

- [ ] **Step 1: Run property-family and conversion tests.**
- [ ] **Step 2: Add regression tests for any uncovered ownership/validation/conversion failure.**
- [ ] **Step 3: Fix only failing behavior.**
- [ ] **Step 4: Run browser reload/keyboard/mobile/locale checks plus `pnpm verify`, build and OpenSpec validation.**
- [ ] **Step 5: Update tasks and commit.**

### Task 5: P2 domain identities and relations

**Files:**
- Modify: relation/domain selector modules and current picker/chip/count/collection consumers identified by the active spec.
- Test: focused relation/domain tests and Playwright coverage.
- Modify: `openspec/changes/add-domain-identities-and-relations/tasks.md`

**Interfaces:**
- Consumes: typed property values and stable Structure/entity ids.
- Produces: ID-based selectors, memberships, constrained object selection and optional paired two-way relations.

- [ ] **Step 1: Write failing tests for ID-based picker/chip/count/collection behavior.**
- [ ] **Step 2: Replace label/index-based identity paths with stable ids using existing domain APIs.**
- [ ] **Step 3: Add two-way/fixed-set/deletion/reload regression coverage.**
- [ ] **Step 4: Run focused tests, Playwright, `pnpm verify`, build and OpenSpec validation.**
- [ ] **Step 5: Update tasks and commit.**

### Task 6: P3 stable block document identity

**Files:**
- Modify: `src/editor/document.ts` and owning editor persistence/conversion modules.
- Test: `tests/editor-document.test.mjs` plus focused browser coverage.
- Modify: `openspec/changes/complete-block-document-model/tasks.md`

**Interfaces:**
- Consumes: completed P0 block editor.
- Produces: stable BlockIds/schema versioning, safe migration, preserved ids for edits/reorder/split/merge and fresh ids for insertion/duplication/import/paste.

- [ ] **Step 1: Add failing BlockId validation/migration/preservation tests.**
- [ ] **Step 2: Implement schema/id helpers in the document model without introducing UI-specific state.**
- [ ] **Step 3: Wire editor transforms to preserve or allocate ids according to the spec.**
- [ ] **Step 4: Run document/editor/browser tests, `pnpm verify`, build, parity and OpenSpec validation.**
- [ ] **Step 5: Update tasks and commit.**

### Task 7: P4 object/block linking

**Files:**
- Verify/modify only as failures require: current link/backlink/transclusion/mention/context-graph modules and tests.
- Modify: `openspec/changes/add-object-and-block-linking/tasks.md`

**Interfaces:**
- Consumes: stable object ids and BlockIds.
- Produces: links/backlinks/counters/Objects Inside/transclusion/mentions/contextual graph.

- [ ] **Step 1: Run focused source/unit coverage.**
- [ ] **Step 2: Run browser scenarios for rename, reorder, counters, embeds/transclusion, backlinks, missing targets and mention conversion.**
- [ ] **Step 3: Fix failures test-first.**
- [ ] **Step 4: Run full verification/build/OpenSpec checks, update tasks and commit.**

### Task 8: P5 query engine and search index

**Files:**
- Create/modify: focused query-domain and search-index modules under `src/lib/`, then wire existing search/query UI consumers.
- Test: dedicated query/index tests and Playwright search/query flows.
- Modify: `openspec/changes/add-query-engine-and-search-index/tasks.md`

**Interfaces:**
- Consumes: typed values, stable identities/relations and object/block links.
- Produces: `QueryDefinition`, typed filters/operators, sort/group/limit/result mode/variables and object/block full-text search.

- [ ] **Step 1: Add failing evaluator tests for typed/nested/relation/backlink filters and deterministic sort/group/limit.**
- [ ] **Step 2: Implement the pure query evaluator.**
- [ ] **Step 3: Add failing incremental index/search tests and implement title/alias/full-text object/block indexing.**
- [ ] **Step 4: Migrate existing QueryEntity and unified search/picker UI to the new APIs.**
- [ ] **Step 5: Run randomized fixtures, performance checks, Playwright, `pnpm verify`, build and OpenSpec validation.**
- [ ] **Step 6: Update tasks and commit.**

### Task 9: P6 object views and conversion

**Files:**
- Verify/modify only as failures require: `src/components/object-view-*.tsx`, `src/components/data-view-*.tsx`, conversion planner/domain modules and tests.
- Modify: `openspec/changes/add-object-views-and-conversion/tasks.md`

**Interfaces:**
- Consumes: query engine and runtime Structures.
- Produces: Object Views vs Data Views, layouts/templates/context graph handoff and safe type conversion.

- [ ] **Step 1: Run cross-representation and conversion tests.**
- [ ] **Step 2: Add browser coverage for live updates, view switching/reload, layouts/templates/context graph and rollback.**
- [ ] **Step 3: Fix failures test-first.**
- [ ] **Step 4: Run performance/accessibility/parity/verify/build/OpenSpec checks, update tasks and commit.**

### Task 10: P7 task management

**Files:**
- Create/modify: focused task domain modules, task capture/editor/list/Kanban consumers and tests selected from the active spec.
- Modify: `openspec/changes/add-task-management/tasks.md`

**Interfaces:**
- Consumes: typed properties, identities, queries, object views and date model.
- Produces: scheduled date vs deadline, recurrence modes, `TaskOccurrence`, transitions, native list/Kanban/log/stats/capture/editor.

- [ ] **Step 1: Add failing domain tests for recurrence, DST/month-end, completion/skip/excuse transitions.**
- [ ] **Step 2: Implement task metadata and occurrence model.**
- [ ] **Step 3: Wire query-backed native task views and capture/editor UI.**
- [ ] **Step 4: Add browser coverage and run verify/date/query/view regressions, Playwright, build and OpenSpec validation.**
- [ ] **Step 5: Update tasks and commit.**

### Task 11: P7 dates, Daily Notes and calendar

**Files:**
- Verify/modify only as failures require: existing date/Daily Note/calendar projection modules and tests.
- Modify: `openspec/changes/add-dates-daily-notes-and-calendar/tasks.md`

**Interfaces:**
- Consumes: stable entity/task/query model.
- Produces: idempotent Daily Notes, timezone-safe Month/Week/Three-Day/Day projections and Day aggregation.

- [ ] **Step 1: Run idempotency/timezone/date-reference/day-aggregation tests.**
- [ ] **Step 2: Run browser create/reschedule/task/mobile/console scenarios.**
- [ ] **Step 3: Fix failures test-first.**
- [ ] **Step 4: Run verify/query/view/date regressions, build and OpenSpec validation.**
- [ ] **Step 5: Update tasks and commit.**
