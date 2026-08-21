## Why

Recent work was applied in a checkout different from the branch being served by the local app. The target branch was also attached to another worktree, which made merges appear complete while leaving the active checkout and browser behind. The repository needs one explicit, repeatable workflow for mapping branches to worktrees before changing or publishing anything.

## What Changes

- Add a repository rule requiring agents to identify the active checkout, branch, worktree path, and remote tracking state before branch operations.
- Require branch ancestry and ahead/behind checks before and after merges, pulls, cherry-picks, and pushes.
- Require protected branches to be updated through pull requests, never by direct push or force push.
- Define the correct workflow for bringing changes from a task/worktree into `feat/app-sidebar` and for keeping local servers tied to the intended checkout.
- Require explicit handling of dirty trees, attached branches, stale local refs, and server processes running from another worktree.
- Keep contributor documentation and agent rules synchronized with the new workflow.

## Capabilities

### New Capabilities

- `branch-safety`: Provides an auditable branch/worktree verification and integration workflow for contributors and coding agents.

### Modified Capabilities

- None.

## Impact

- Affects `.agents/rules/git-workflow-rule.md`, `CONTRIBUTING.md`, and related OpenSpec governance documentation.
- Changes the required preflight and postflight checks for Git operations; it does not change application runtime APIs or production code.
