# Execution Plan: Lean ExamTopics Feed and Domain Model

**Status:** Active  
**Owner:** Lead Orchestrator  
**Started:** 2026-10-03  
**Last Updated:** 2026-10-03

## Objective

Implement the active recall certification study engine and continuous question feed defined in ADR 0017, featuring polymorphic Firestore entity representation (`DER.md` schemaVersion 4), single-record graph relations (`INV-10`), append-only practice attempts (`INV-11`), instant click-to-validate feedback with conditional grounded explanation reveal, and semantic design tokens (`DESIGN.md`).

## Scope

- In:
  - TypeScript types and schema definitions for Exam, Question, QuestionOption, GroundedExplanation, and Attempt under `src/types/`.
  - Validation schemas with error codes for internationalization under `src/lib/validators/`.
  - Firestore composite index specification in `firestore.indexes.json` and registration in `firebase.json`.
  - Application components for continuous question feed: `ExamFeedView` (`useExamFeed`) and `QuestionCard` (`useQuestionCard`).
  - Instant click-to-validate interaction with semantic visual tokens (`DESIGN.md`) and conditional explanation expansion.
  - Companion card atomic dual-write (Attempt creation + Card FSRS update).
  - App Router route: space-scoped exam view under `src/app/[spaceId]/`.
  - Unit tests with Vitest (>=80% coverage) and component stories with Ladle.
- Out:
  - Phase 2 complex multi-column TypeDashboard (deferred to future milestone).
  - High-stakes serverless proctored examination grading.

## Canonical Context

- Product intent: `INTENT.md` (`G-3`, `G-5`, `INV-8`, `INV-9`, `INV-10`, `INV-11`, `INV-13`)
- Product requirement IDs: `knowledge-learning-workspace.md` (Phase 1, `INV-9`, `INV-10`, `INV-11`)
- Architecture / ADRs: `ARCHITECTURE.md`, `docs/adr/0017-lean-exam-topics-domain-model-and-typedashboard.md`, `docs/adr/0016-prefer-simple-domain-components-and-dedicated-hooks.md`
- Design system: `DESIGN.md` (shadcn `base-nova`, Base UI primitives, OKLCH variables)
- Constraints / security / testing: `CONSTRAINTS.md`, `SECURITY.md`, `TESTING.md`, `firestore.rules`

## Plan

- [ ] Step 1: Types and validators (Exam and Question types in `src/types/` and validation schemas in `src/lib/validators/`)
- [ ] Step 2: Firestore composite indexes (`firestore.indexes.json`, `firebase.json`)
- [ ] Step 3: Domain hooks and FSRS dual-write integration (`useExamFeed`, `useQuestionCard` in `src/hooks/`)
- [ ] Step 4: UI components with instant click-to-validate feedback (`ExamFeedView`, `QuestionCard`, `ScrollToTopButton` in `src/components/notes-app/`)
- [ ] Step 5: Route integration (exam feed page under `src/app/[spaceId]/`)
- [ ] Step 6: Vitest unit tests, Ladle stories, and Playwright verification
- [ ] Step 7: Quality gates pass and documentation synchronization

## Progress

- 2026-10-03 — Authored and refined ADR 0017; verified architecture rules, domain invariants, and instant click-to-validate feedback model; created active execution plan.

## Decision Log

- 2026-10-03 — Adopted direct click-to-validate feedback on options with automatic grounded explanation expansion (when available) for zero-friction active recall, replacing multi-step button interactions.

## Verification

- [ ] `rtk pnpm run check:fast`
- [ ] `rtk pnpm run verify:docs`
- [ ] `rtk pnpm run check:docs`
- [ ] Unit tests pass with >= 80% coverage

## Recovery / Rollback

If validation fails or breaks existing space operations, revert new exam-specific types and components. Existing Space and Auth models remain isolated.

## Completion

**Completed:** —  
**Result:** —  
