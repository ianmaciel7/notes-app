# Implementation Notes

## 2026-08-31 Corrective Pass

- Requested change: `reconcile-keyboard-command-system-acceptance`.
- Main checkout status: dirty with many unrelated active OpenSpec, source, test, artifact, and graphify changes.
- Fresh isolated worktree attempt: blocked by filesystem permission while creating `.git/refs/heads/codex/reconcile-keyboard-command-system-acceptance.lock`.
- Fallback evidence source: clean historical worktree `C:\Users\ianma\.codex\visualizations\2026\08\28\01a049b4-b8be-70c2-9105-acbe61da778f\notes-app-keyboard-command-system`, branch `codex/add-keyboard-command-system`, head `e2b7d4f`.

## Recorded Failure Reproduction

- `node --test tests/workspace-objects.test.mjs`: passed, 23/23 tests. The archived `importHandler` failure did not reproduce in the clean historical worktree.
- `node --test tests/workspace-surface-contract.test.mjs`: passed, 4/4 tests. The archived `objectTypeHelper` failure did not reproduce in the clean historical worktree.

## Verification Outcomes

- `pnpm.cmd format:check`: failed. Biome reported CRLF formatting drift in `package.json` and `biome.json`.
- `pnpm.cmd lint`: passed.
- `pnpm.cmd typecheck`: passed.
- `pnpm.cmd complexity`: failed. `WorkspaceObjectPageView` has cyclomatic complexity 13 against max 12; `findUnlinkedMentionCandidates` has cyclomatic complexity 14 against max 12.
- `pnpm.cmd typegen`: blocked by EPERM writing `.next\types\routes.d.ts` in the historical visualization worktree.
- `pnpm.cmd test`: passed, 243/243 tests, with non-fatal `MODULE_TYPELESS_PACKAGE_JSON` warnings.
- `pnpm.cmd build`: blocked before command start by the side-conversation execution helper ACL.
- `pnpm.cmd verify`: failed at `format:check`; later gates were not reached by the aggregate command.

## Change Reference Check

The referenced active and archived change names were found in the local OpenSpec tree:

- `reconcile-keyboard-command-system-acceptance`
- `refresh-capacities-parity-baseline`
- `complete-keyboard-command-surface`
- `align-object-page-complete-parity`
- `openspec/changes/archive/2026-08-28-add-keyboard-command-system`

No stale alias was corrected in archived history, because the archived change remains immutable.

## Acceptance Boundary

Corrective evidence was appended at `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/`. The evidence separates `local_status` from `reference_status`. Local acceptance for the command palette and editor triggers remains distinct from matched Capacities parity.

## 2026-08-31 Side-Conversation Verification Pass

- Current checkout: branch `dev`, head `fb5cf66` at session start.
- Current `dev` reproduction: `node --test tests/workspace-objects.test.mjs` passed, 24/24 tests.
- Current `dev` reproduction: `node --test tests/workspace-surface-contract.test.mjs` passed, 4/4 tests.
- `pnpm.CMD format:check`, `pnpm.CMD lint`, `pnpm.CMD complexity`, `pnpm.CMD typegen`, and `pnpm.CMD typecheck` passed.
- Focused command/editor/query suite passed, 40/40 tests.
- `pnpm.CMD test:coverage` passed, 323/323 tests, global coverage above configured thresholds.
- `pnpm.CMD build` passed.
- `pnpm.CMD verify` passed end-to-end after an earlier retry was blocked by a transient concurrent Next build lock.
- `openspec.cmd validate reconcile-keyboard-command-system-acceptance --strict` passed.
- `openspec.cmd validate --specs --strict` passed, 26/26 specs.

Diff review:

- Latest status recheck during this side conversation found the checkout briefly in an unmerged state: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/manifest.json`, and `tests/e2e/workspace-parity.spec.ts` were `UU`; `src/editor/table-block-node-view.tsx` was `AA`; `src/components/block-editor.tsx` remained staged as modified.
- Those conflict entries had no remaining textual ours/theirs diff and were marked resolved with explicit `git add` paths before publication.
- No staged or unstaged diff was observed in command registry, search/query engine routing, workspace routing, or storage persistence files for this corrective change.

Remaining blocker before archive:

- Confirm the final pushed `dev` state before archiving this corrective change.

