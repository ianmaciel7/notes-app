## 1. Repository guidance

- [x] Update `.agents/rules/git-workflow-rule.md` with the branch/worktree preflight, protected-branch, integration, and server-provenance rules.
- [x] Update `CONTRIBUTING.md` with the canonical working-branch → pull-request workflow and the required verification commands.
- [x] Keep `AGENTS.md`, `CLAUDE.md`, and the practical Git guidance aligned without duplicating long explanations.

## 2. Verification

- [x] Validate the OpenSpec change with `openspec validate enforce-worktree-branch-safety --strict`.
- [x] Verify the rule references only existing commands and branch names.
- [x] Exercise the documented preflight commands in the repository checkout and record clean/blocked examples in the implementation notes.

## 3. Completion

- [x] Sync the finalized capability spec and archive the completed OpenSpec change.
