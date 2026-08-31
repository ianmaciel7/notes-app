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

Remaining blockers before archive:

- Resolve CRLF formatting drift without broad formatting churn.
- Resolve or formally re-baseline the two complexity findings.
- Run typegen/build in an environment that can write `.next`.
- Run the full verification pipeline after focused gates pass.

