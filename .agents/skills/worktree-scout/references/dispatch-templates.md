# Subagent Dispatch Templates

Use these templates when invoking subagents via `invoke_subagent` to scout `.worktrees/old-*`.

---

## 1. Domain & Security Scout Template

```markdown
Role: Worktree Domain Scout
Type: research

Task:
Investigate authentication, authorization boundaries, and domain model implementations in .worktrees/old-9 and .worktrees/old-5.

Objectives:
1. Locate how space-membership authorization is enforced on server actions (inspect `.worktrees/old-9/src/data/action-auth.ts`).
2. Identify how object revisions and relation edges maintain tenant isolation (`spaceId`).
3. Extract companion test cases from `src/domain/` and `.firebase.test.ts` files.
4. Report back concise code patterns (maximum 15 lines per citation), exact file paths, and test invariants.
5. Do NOT modify any files. Do NOT suggest importing directly from .worktrees/ at runtime.
```

---

## 2. UI Shell & Navigation Scout Template

```markdown
Role: Worktree Shell Scout
Type: research

Task:
Investigate sidebar composition, responsive drawers, and keyboard accessibility patterns in .worktrees/old-2 and .worktrees/old-4.

Objectives:
1. Inspect `.worktrees/old-2/src/components/workspace-shell.tsx` and `.worktrees/old-2/src/lib/workspace-navigation.ts` for ARIA attributes, focus restoration, and Escape dismissal.
2. Inspect `.worktrees/old-4/src/components/app-sidebar*.tsx` for multi-section sidebar composition and active state matching.
3. Review `__tests__/workspace-shell.test.tsx` and extract minimal test assertions.
4. Synthesize the findings with exact line references and key CSS/accessibility patterns.
5. Do NOT modify any files.
```

---

## 3. Editor & Query Engine Scout Template

```markdown
Role: Worktree Editor Scout
Type: research

Task:
Analyze rich text and block editor implementations across .worktrees/old-4 (custom block editor) and .worktrees/old-6 (Plate.js v53).

Objectives:
1. Inspect `.worktrees/old-4/src/editor/` to evaluate block schema, slash commands, and the query engine.
2. Inspect `.worktrees/old-6/src/components/space/` to evaluate Plate v53 editor integration.
3. Compare the tradeoffs between both approaches (dependencies, bundle size, schema stability).
4. Extract test patterns from `.worktrees/old-4/tests/block-editor-contract.test.mjs`.
5. Report back findings with citations and recommended adoption path for the prototype runtime.
```

---

## 4. Spaced Repetition & Study Flow Scout Template

```markdown
Role: Worktree Study Scout
Type: research

Task:
Evaluate study scheduling and session workflows across .worktrees/old-9, .worktrees/old-8, and .worktrees/old-5.

Objectives:
1. Inspect FSRS algorithm implementations in `.worktrees/old-9/src/domain/study/fsrs-scheduler.ts` and compare with SM-2 mathematical test vectors.
2. Review study queue state machines and question card interfaces in `.worktrees/old-8`.
3. Extract deterministic test vectors from companion test files (`fsrs-scheduler.test.ts` or `study-queue.test.ts`).
4. Report back architectural findings and recommendations.
```
