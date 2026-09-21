# Worktree Code Quality Control Synthesis

Comprehensive comparative analysis of testing strategies, quality gates, linters, complexity limits, and verification mechanics across historical worktrees (`.worktrees/old` through `.worktrees/old-9`).

---

## Executive Evolution of Code Quality Control

Across the 10 historical branches, code quality enforcement evolved through five distinct architectural phases:

1. **Phase 1: Shell & Accessibility Foundations (`old`, `old-1`, `old-2`)**
   - **Mechanism**: React Testing Library component integration tests (`__tests__/page.test.tsx`, `__tests__/workspace-shell.test.tsx`) asserting semantic ARIA landmarks (`navigation`, `main`, `complementary`, `dialog`), focus traps, and keyboard shortcuts (`Escape`, `ArrowDown`, `Control+[`).
   - **Tooling**: Biome linter/formatter (`biome.json`), Vitest (jsdom), and custom Graphify artifact validator (`scripts/check-graphify.mjs`) forbidding dangling edges, secrets, and absolute user paths.

2. **Phase 2: Formal Specifications & Complexity Gates (`old-3`)**
   - **Mechanism**: OpenSpec change governance (`openspec/changes/enforce-quality-thresholds`), strict Vitest coverage floors (80% lines, 80% functions, 70% branches), cognitive complexity limit of 15 (Biome), and an AST cyclomatic complexity gate (max 10 via TypeScript Compiler API).
   - **Agent Automation**: Lefthook hooks triggering `agent-validate` (`biome:ci`, `complexity`, `test:coverage`) on AI agent `Stop` events.

3. **Phase 3: Source-Inspecting Micro-Contracts & Multi-Viewport Parity (`old-4`)**
   - **Mechanism**: Micro-contract test suites (`tests/*-contract.test.mjs`) using Node's native test runner (`node:test`). Tests read source files from disk to mechanically forbid anti-patterns (e.g. `dangerouslySetInnerHTML`, unbuffered inputs, un-deferred values).
   - **Layout Verification**: 5,491-line Playwright parity suite (`tests/e2e/workspace-parity.spec.ts`) and audit scripts testing pixel-precise layouts across 6 responsive viewports (1536px to 390px).

4. **Phase 4: Telemetry, Parity Specs & Offline Multi-Tenancy (`old-5`, `old-6`)**
   - **Mechanism**: Dedicated maintainability telemetry pipeline (`scripts/quality/biome-metrics.mjs`) emitting JSON metric reports; granular interaction parity specs (`sidebar-scroll-parity`, `focus-mode-parity`, `floating-interaction-parity`); in-memory IndexedDB testing (`fake-indexeddb/auto`) with compound primary keys `[spaceId, id]`.
   - **Editor Verification**: Plate.js v53 / Slate AST bidirectional round-tripping tests (`document-schema.test.ts`), depth-limits (`MAX_BLOCK_DOCUMENT_DEPTH = 8`), and Ladle storybook workbenches (`editor.stories.tsx`).

5. **Phase 5: Pure Domain Math & Zero-Trust Security Emulators (`old-7`, `old-8`, `old-9`)**
   - **Mechanism**: Pure domain unit tests without mocks (`gradeQuestion`, `validateExamForPublication`, `fsrs-scheduler`), executing in microseconds via table-driven `it.each`.
   - **Security Boundary**: Serial Firebase emulator testing (`vitest.firebase.config.ts`, `maxWorkers: 1`, REST cleanup between tests), proving default-deny Firestore rules (direct client REST blocked with HTTP 403), and enforcing tenant isolation + HttpOnly cookie authentication (`requireActionUser`, constant-time space lookup).

---

## Detailed Matrix: Quality Control Per Worktree

| Worktree | Branch / Focus | Linters & Complexity Gates | Test Runners & Harnesses | Unique Verification Mechanisms |
|---|---|---|---|---|
| **`.worktrees/old`** | Monolithic Workspace Shell | Biome 2.4.2 (`biome.json`, `format:check`, `lint`) | Vitest 4.1.10 (jsdom) + React Testing Library | 299-line RTL shell test; `scripts/check-graphify.mjs` verifying graph nodes, manifest, and edge integrity. |
| **`.worktrees/old-1`** | Normative Agent Harness | Normative rules in `AGENTS.md` | None (no application runtime) | Governance via `AGENTS.md` and adversarial pre-planning via `grill-me` skill. |
| **`.worktrees/old-2`** | OpenSpec, CI & Accessibility | Biome 2.4.2 | Vitest + RTL + Playwright (assets capture) | OpenSpec changes (`openspec/changes/*`); focus trap tests (dialog focus, Escape key dismissal and focus restore); ARIA table views in `object-type-workspace.tsx`. |
| **`.worktrees/old-3`** | Complexity Gates & Agent Hooks | Biome (cognitive complexity <= 15) + AST script (`check-complexity.mjs`, cyclomatic <= 10) | Vitest with hard thresholds: 80% lines, 80% functions, 70% branches | `lefthook.yml` triggering `agent-validate` on agent `Stop`; 7-job GitHub Actions CI requiring aggregate `Quality` pass. |
| **`.worktrees/old-4`** | Micro-Contracts & Query Engine | Biome 2.5.8 + AST script (`check-complexity.mjs`, cyclomatic <= 12) | Node native test runner (`node --test tests/*.test.mjs`, coverage gates) + Playwright | Source-reading contract tests (`block-editor-contract`, `rules-compliance-contract`); 5,491 LOC Playwright multi-viewport parity suite across 6 breakpoints. |
| **`.worktrees/old-5`** | Telemetry, Parity & Offline Sync | Biome + `scripts/quality/biome-metrics.mjs` | Vitest (80% coverage) + Playwright + `fake-indexeddb/auto` | Interaction parity specs (`sidebar-scroll-parity`, `floating-interaction-parity`, `focus-mode-parity`); Dexie composite tenant key verification `[spaceId, id]`; LWW conflict resolution tests. |
| **`.worktrees/old-6`** | Plate Editor & Ladle Workbench | Biome 2.5.13 | Vitest (`--dir src`) + Ladle (`@ladle/react`) | Slate AST round-trip and document depth-limit tests (`document-schema.test.ts`); matrix table RFC CSV serialization (`table-model.test.ts`); isolated storybook component verification. |
| **`.worktrees/old-7`** | Static Fixtures & Emulator Probes | Biome check & format | Vitest (jsdom) + RTL | Read-first immutable typed study fixtures (`src/lib/study.ts`); HTTP probe verifying Firebase Auth emulator readiness (`verify-firebase-emulator.mjs`); unified `pnpm check`. |
| **`.worktrees/old-8`** | Study State Machine & Local Sync | ESLint + TypeScript strict | Vitest (`fake-indexeddb/auto`) + Playwright | Card flip state machine keyboard tests (`study-card-anki.tsx`); queue sorting prioritizing overdue cards (`study-queue.test.ts`); browser E2E with horizontal scroll overflow check. |
| **`.worktrees/old-9`** | Pure Domain & Firebase Security Rules | Biome check & format | Dual Vitest runners: unit/domain vs. Firebase Emulator (`vitest.firebase.config.ts`, `maxWorkers: 1`) | Pure domain tests without mocks (`grade-question`, `exam`, `fsrs-scheduler`); default-deny Firestore rules tests (client REST fails with 403); constant-time space tenant isolation (`action-auth.ts`, `spaces.ts`). |

---

## Top 5 Transferable Quality Patterns for the Current Prototype

1. **Pure Domain Math Without Mocks (`old-9`)**:
   Keep pure algorithms (scoring, FSRS scheduling, validation schemas) completely free of framework imports (no React, no Next.js, no Firestore). Test them via table-driven `it.each` vectors for microsecond execution.
2. **Multi-Tenant Composite Primary Keys (`old-5`)**:
   Enforce compound keys `[spaceId, id]` at the storage schema boundary so data leakage between spaces is physically impossible.
3. **AST Complexity Gates (`old-3`, `old-4`, `old-5`)**:
   Run cyclomatic complexity (max 10-12) and Biome cognitive complexity (max 15) in pre-commit/CI pipelines to prevent monolithic function sprawl.
4. **Source-Scanning Contract Tests (`old-4`, `old-5`)**:
   Assert architectural rules (such as banning `dangerouslySetInnerHTML`, forbidding native `title=` attributes, or requiring `useDeferredValue`) directly via tests scanning the source tree.
5. **Default-Deny Security Emulator Testing (`old-9`)**:
   Verify cloud security rules inside emulator containers with hermetic teardown between runs, confirming unauthenticated REST endpoints are rejected with HTTP 403.
