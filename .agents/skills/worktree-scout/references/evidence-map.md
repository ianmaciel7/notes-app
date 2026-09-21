# Worktree Evidence Map

Authoritative index mapping historical `.worktrees/old-*` branches to subsystems, architectural patterns, and companion test suites.

## Worktree Matrix

| Worktree | Branch / Primary Subsystem | Key Files to Inspect | Companion Contract & Unit Tests | Best Used For |
|---|---|---|---|---|
| `.worktrees/old-9` | **Domain, Auth & Tenancy Baseline** | `src/data/action-auth.ts`<br>`src/data/spaces.ts`<br>`src/data/objects.ts`<br>`src/data/object-relations.ts`<br>`src/domain/study/fsrs-scheduler.ts` | `src/domain/questions/grade-question.test.ts`<br>`src/domain/exams/exam.test.ts`<br>`src/data/security-rules.firebase.test.ts`<br>`src/data/spaces.firebase.test.ts`<br>`src/data/study.firebase.test.ts` | Server authorization boundary, Space tenancy enforcement, object revisions lifecycle, FSRS reference math. |
| `.worktrees/old-4` | **Block Editor, Graph & Contracts** | `src/components/app-sidebar*.tsx`<br>`src/components/app-shell.tsx`<br>`src/editor/` (block editor + query engine) | `tests/block-editor-contract.test.mjs`<br>`tests/object-lifecycle-contract.test.mjs`<br>`tests/rules-compliance-contract.test.mjs`<br>`tests/runtime-object-types.test.mjs`<br>`tests/e2e/` | Rich block editor architecture, slash command menus, query engine, micro-contract test suites. |
| `.worktrees/old-5` | **Sync Queue, AI & Interaction Parity** | `src/lib/db.ts`<br>`src/lib/ai/`<br>`src/lib/sidebar-navigation-trace.ts` | `tests/sidebar-scroll-parity.spec.ts`<br>`tests/space-isolation.spec.ts`<br>`tests/focus-mode-parity.spec.ts`<br>`tests/new-content-command-dialog.spec.ts` | Offline-first sync queues, document extraction/AI ingestion, UI interaction telemetry and parity assertions. |
| `.worktrees/old-2` | **Responsive Nav & Accessibility** | `src/components/workspace-shell.tsx`<br>`src/lib/workspace-navigation.ts` | `__tests__/workspace-shell.test.tsx`<br>`tabelas-aria.json` | ARIA landmarks, mobile drawer focus traps, Escape key dismissal, active-item matching, reduced-motion. |
| `.worktrees/old-6` | **Space Shell & Plate Editor** | `src/components/space/space-shell.tsx`<br>`src/lib/dexie/` | Plate v53 editor tests / stories | Alternative Plate.js rich-text editor, IndexedDB Dexie repositories with composite `[spaceId+id]` keys. |
| `.worktrees/old-8` | **Study UI & Card Viewer** | `src/components/study/`<br>`src/domain/study/` | Study session tests, card viewer specs | Question card flip UX, study session state machines, queue review interface. |
| `.worktrees/old-7` | **Plugin Integrations** | `.agents/plugins/firebase/`<br>`.agents/plugins/vercel/` | Plugin-specific test fixtures | Firebase and Vercel AI SDK integration patterns. |
| `.worktrees/old-3` | **Capacities-style Sidebar** | `src/components/capacities-sidebar.tsx` | Historical tests | Superseded prototype — reference only if comparing sidebar layouts. |
| `.worktrees/old` | **Initial Monolithic Shell** | `src/components/` | `__tests__/page.test.tsx` | Historical baseline — superseded by `old-2` and `old-4`. |

---

## Cross-Cutting Architecture Rules

When scouting worktrees, prioritize these proven design decisions:
1. **Auth Boundary**: Every server read/write must first authenticate the user, verify Space membership, and then execute (`.worktrees/old-9/src/data/action-auth.ts`).
2. **Revisions vs Updates**: Object edits append immutable revisions; publishing or archiving is an explicit status transition (`.worktrees/old-9/src/data/objects.ts`).
3. **Relation Tenancy**: Relations carry `spaceId`; both endpoints must belong to the same Space. Backlinks filter by active Space (`.worktrees/old-9/src/data/object-relations.ts`).
4. **Minimal Test per Code**: Every pure domain calculation or parser must have a 1:1 deterministic test companion without mocks.
