# Subagent Dispatch Templates

Use these templates when invoking subagents via `invoke_subagent` to scout `.worktrees/old-*`.

### Invariants for Subagent Invocation:
- **Per-Worktree Scope**: Launch dedicated subagents scoped to 1 worktree each (e.g., Old-9 Scout, Old-4 Scout) rather than bundling multiple worktrees into one prompt.
- **Model Preference**: Always set `"Model": "flash_lite"` (or `"flash"` if deep synthesis is needed) to preserve context and optimize latency.
- **Graphify First**: Run `query_graph` or `graphify query` on the subsystem keyword before dispatching subagents to seed them with known architectural nodes and dependencies.

---

## 1. Domain & Security Scout Template (Old-9)

```markdown
Role: Worktree Old-9 Domain Scout
Type: research
Model: flash_lite

Task:
Investigate authentication, authorization boundaries, and domain model implementations in .worktrees/old-9. Consult Graphify knowledge graph context if available.

Objectives:
1. Locate how space-membership authorization is enforced on server actions (inspect `.worktrees/old-9/src/data/action-auth.ts`).
2. Identify how object revisions and relation edges maintain tenant isolation (`spaceId`).
3. Extract companion test cases from `src/domain/` and `.firebase.test.ts` files.
4. Report back concise code patterns (maximum 15 lines per citation), exact file paths, and test invariants.
5. Do NOT modify any files. Do NOT suggest importing directly from .worktrees/ at runtime.
```

---

## 2. UI Shell & Navigation Scout Template (Old-2)

```markdown
Role: Worktree Old-2 Shell Scout
Type: research
Model: flash_lite

Task:
Investigate sidebar composition, responsive drawers, and keyboard accessibility patterns in .worktrees/old-2. Consult Graphify knowledge graph context if available.

Objectives:
1. Inspect `.worktrees/old-2/src/components/workspace-shell.tsx` and `.worktrees/old-2/src/lib/workspace-navigation.ts` for ARIA attributes, focus restoration, and Escape dismissal.
2. Review `__tests__/workspace-shell.test.tsx` and extract minimal test assertions.
3. Synthesize the findings with exact line references and key CSS/accessibility patterns.
4. Do NOT modify any files.
```

---

## 3. Editor & Query Engine Scout Template (Old-4)

```markdown
Role: Worktree Old-4 Editor Scout
Type: research
Model: flash_lite

Task:
Analyze rich text and block editor implementations in .worktrees/old-4. Consult Graphify knowledge graph context if available.

Objectives:
1. Inspect `.worktrees/old-4/src/editor/` to evaluate block schema, slash commands, and the query engine.
2. Extract test patterns from `.worktrees/old-4/tests/block-editor-contract.test.mjs`.
3. Report back findings with citations and recommended adoption path for the prototype runtime.
4. Do NOT modify any files.
```

---

## 4. Spaced Repetition & Study Flow Scout Template (Old-8)

```markdown
Role: Worktree Old-8 Study Scout
Type: research
Model: flash_lite

Task:
Evaluate study scheduling and session workflows in .worktrees/old-8. Consult Graphify knowledge graph context if available.

Objectives:
1. Review study queue state machines and question card interfaces in `.worktrees/old-8`.
2. Extract deterministic test vectors from companion test files (`fsrs-scheduler.test.ts` or `study-queue.test.ts`).
3. Report back architectural findings and recommendations.
4. Do NOT modify any files.
```
