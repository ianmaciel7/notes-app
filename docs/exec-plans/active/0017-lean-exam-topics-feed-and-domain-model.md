# Execution Plan: Lean ExamTopics Feed and Domain Model

**Status:** Active  
**Owner:** Lead Orchestrator  
**Started:** 2026-10-03  
**Last Updated:** 2026-10-03

## Objective

Implement the active recall certification study engine and continuous question feed defined in ADR 0017, featuring polymorphic Firestore entity representation (`DER.md` schemaVersion 4), single-record graph relations (`INV-10`), append-only practice attempts (`INV-11`), instant click-to-validate feedback with conditional grounded explanation reveal, and semantic design tokens (`DESIGN.md`).

## Scope

- In:
  - TypeScript types and schema definitions for Exam, Question, QuestionOption, GroundedExplanation, Card, FsrsSnapshot, and Attempt under `src/types/`.
  - Validation schemas with localized error codes under `src/lib/validators/`.
  - Message catalog entries in `src/messages/en.json`, `src/messages/es.json`, `src/messages/pt-BR.json` for exam feed, question cards, explanations, and accessibility labels.
  - Firestore composite index specification in `firestore.indexes.json` and registration in `firebase.json`.
  - Application components in `src/components/notes-app/` with approved role suffixes: `ExamList` (`useExamList`), `QuestionCard` (`useQuestionCard`), and `ScrollToTopButton`.
  - Instant click-to-validate feedback with semantic visual tokens (`DESIGN.md`: `primary` for correct, `destructive` for incorrect) and non-color accessible indicators.
  - Companion card atomic dual-write (Attempt creation + Card FSRS update via `writeBatch`).
  - App Router route: space-scoped exam view (e.g. `src/app/[spaceId]/exams/[examId]/page.tsx`) as an async Server Component with Next.js 15 `PageProps`.
  - Vitest unit tests (≥ 80% coverage across lines, functions, branches, statements), Ladle component stories, and Playwright E2E verification (e.g. `e2e/exam-feed.spec.ts`).
- Out:
  - Phase 2 complex multi-column TypeDashboard (deferred to future milestone).
  - High-stakes serverless proctored examination grading.

## Canonical Context

- Product intent: `INTENT.md` (`G-3`, `G-5`)
- Feature specification: `docs/product-specs/exam-topics-feed.md` (User Stories 1–15, Decisions 1–4)
- Domain model invariants: `docs/product-specs/knowledge-learning-workspace.md` (`INV-8`, `INV-9`, `INV-10`, `INV-11`, `INV-13`, `R-SRS`, `R-ASSESS`)
- Architecture / ADRs: `ARCHITECTURE.md`, `docs/adr/0017-lean-exam-topics-domain-model-and-typedashboard.md`, `docs/adr/0016-prefer-simple-domain-components-and-dedicated-hooks.md`
- Design system: `DESIGN.md` (shadcn `base-nova`, Base UI primitives, OKLCH variables)
- Constraints / security / testing: `CONSTRAINTS.md`, `SECURITY.md`, `TESTING.md`, `firestore.rules`

## Plan

- [ ] Step 1: Types, validators, and i18n messages (Exam, Question, Card, Attempt in `src/types/`, validation schemas in `src/lib/validators/`, and localized strings in `src/messages/*.json`)
- [ ] Step 2: Firestore composite indexes (`firestore.indexes.json`, registered in `firebase.json` and documented in `DER.md`)
- [ ] Step 3: Domain hooks and FSRS dual-write integration (`useExamList`, `useQuestionCard` in `src/hooks/`), owning all state, effects, and atomic batch writes
- [ ] Step 4: UI components with instant click-to-validate feedback (`ExamList`, `QuestionCard`, `ScrollToTopButton` in `src/components/notes-app/`) adhering to single-component-per-file, canonical props typing, trailing exports, `data-slot`, non-color indicators, and zero emojis
- [ ] Step 5: Route integration (e.g. `src/app/[spaceId]/exams/[examId]/page.tsx` as async Server Component with Next.js 15 `await params`)
- [ ] Step 6: Testing & Quality Verification (e.g. validator unit tests in `src/lib/validators/`, dedicated hook tests in `src/hooks/`, component tests and Ladle stories in `src/components/notes-app/`, route tests with `params: Promise.resolve(...)`, Firebase emulator dual-write tests in `src/lib/firebase/`, and Playwright E2E in `e2e/`)
- [ ] Step 7: Quality gates pass and documentation synchronization

## Progress

- 2026-10-03 — Authored and refined ADR 0017; audited active execution plan with specialized subagent team; aligned plan with `CONSTRAINTS.md`, `CONVENTIONS.md`, `DESIGN.md`, and `DER.md`.

## Decision Log

- 2026-10-03 — Adopted direct click-to-validate feedback on options with automatic grounded explanation expansion (when available) for zero-friction active recall, replacing multi-step button interactions.
- 2026-10-03 — Adopted `ExamList` (`useExamList`) in `src/components/notes-app/exam-list.tsx` to comply with `guard-component-naming.mjs` and `guard-notes-app-pattern.mjs` archetype suffixes.

## Verification

- [ ] Relevant deterministic checks (`rtk pnpm run check:fast`, `rtk pnpm run test:firebase-emulator`, `rtk pnpm run test:coverage` for ≥ 80% across lines, functions, branches, statements)
- [ ] Behavioral/runtime verification when applicable (`rtk pnpm run test:e2e`, Ladle stories for `QuestionCard` states)
- [ ] Final diff review
- [ ] Documentation synchronized (`rtk pnpm run verify:docs`, `rtk pnpm run check:docs`)

## Recovery / Rollback

If validation fails or breaks existing space operations, revert new exam-specific types and components. Existing Space and Auth models remain isolated.

## Completion

**Completed:** —  
**Result:** —  
