# Real Workspace Features Implementation Plan

**Goal:** Replace confirmed nonfunctional local workspace interactions with persisted behavior.
**Architecture:** Keep per-type detail composition. Add small domain helpers and reusable
edit/action controls, backed by the existing repository and reactive Dexie queries.
**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript, Dexie, Base UI/shadcn, Vitest.
**Spec:** `docs/specs/2026-09-11-real-workspace-features.md`.

## Global Constraints

Use pnpm 11.20.0. No new runtime dependencies; missing D3 types and axe
development dependencies repair existing typecheck imports. No new suppressions or weaker quality gates.
Do not overwrite concurrent dev changes. Temporary audit workflows are not product changes.

## Execution

- [x] Add and run failing repository tests for atomic updates, trash/restore and search.
  Files: `src/lib/spaces/space-runtime-regressions.test.ts`, repository, projections.
  Run `pnpm test:unit src/lib/spaces/space-runtime-regressions.test.ts`.
- [x] Implement scoped transactional domain operations in small modules; preserve schema IDs.
  Assert rollback leaves original data intact when a queued write fails.
- [x] Add edit controls and specialized task/flashcard/goal behavior using existing primitives.
  Files: `src/components/objects/detail/`, `src/components/objects/types/`.
  Assert saved data survives a new database connection and reviews change SRS state.
- [x] Add tab-target regression tests; resolve collection and duplicated tabs without placeholders.
  Files: workspace main content and scoped tab target model.
- [x] Connect inspector queries and clipboard actions to real data; distinguish valid empty
  states from unsupported integrations. Verify no success notification after rejected writes.
- [x] Run focused tests, full suite, formatting, lint, metrics, typecheck/build and browser
  checks. Record observed failures separately from integration/environment limitations.
- [x] Review data isolation and diff; update component parity map with implemented behavior.
## Publication gate

Publish only reviewed product changes, tests and documentation after exact-source
checks. Verify the current remote parent and use fast-forward updates only. Remote
commit/ref verification is the evidence of publication, not this plan checklist.

## Observed results and remaining gaps

See `docs/audits/2026-09-11-real-workspace-features.md`. Unit/type/build checks passed;
repository-wide formatting/metrics debt and the blocked local browser attempt are
reported separately. The latest baseline includes concurrent Ladle work. No claim
is made that unsupported integrations or all planned features are complete.
