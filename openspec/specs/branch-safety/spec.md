# branch-safety Specification

## Purpose

Provide an auditable branch/worktree verification and integration workflow for contributors and coding agents.

## Requirements

### Requirement: Branch and worktree identity is verified before integration
Agents MUST identify the current branch, checkout path, worktree ownership, upstream refs, and dirty-tree state before merging, cherry-picking, pulling, switching, or pushing.

#### Scenario: Target branch is attached to another worktree
- **WHEN** `git worktree list --porcelain` shows the target branch at a different path
- **THEN** the agent MUST operate in that worktree or stop and report the exact path, without force-switching or removing it

#### Scenario: Working tree contains unrelated changes
- **WHEN** preflight reports modified, staged, untracked, or conflicted files outside the requested scope
- **THEN** the agent MUST preserve them and stop before an integration operation unless the user explicitly authorizes the handling

### Requirement: Integration proves ancestry and divergence
Agents MUST compare source and target refs before and after integration and MUST report the commits that exist only on either side.

#### Scenario: Source contains changes missing from the target
- **WHEN** `git rev-list --left-right --count target...source` reports source-only commits
- **THEN** the agent MUST integrate those commits into the intended target worktree and verify the source tip is an ancestor of the resulting target

#### Scenario: Source and target have diverged
- **WHEN** both refs contain commits absent from the other
- **THEN** the agent MUST use a merge, rebase, or pull request appropriate to repository policy and MUST NOT overwrite history with force push

### Requirement: Protected branches use pull requests
Agents MUST NOT push directly or force-push to `dev`, `stag`, or `main`.

#### Scenario: User asks to send work to a protected branch
- **WHEN** the requested target is `dev`, `stag`, or `main`
- **THEN** the agent MUST publish a working branch and create or update a pull request targeting the protected branch

#### Scenario: Feature branch is the requested publication target
- **WHEN** the user requests a feature branch such as `feat/app-sidebar`
- **THEN** the agent MUST verify that branch's worktree and remote state, publish only that branch, and leave protected branches unchanged

### Requirement: Local UI validation identifies the served checkout
Before claiming that a browser reflects a branch integration, agents MUST verify the server endpoint and ensure the running process uses the intended worktree and commit.

#### Scenario: Browser shows an older implementation
- **WHEN** the browser page differs from the integrated source
- **THEN** the agent MUST check the listening process and checkout, then rebuild or restart only the intended local server before revalidating

#### Scenario: Build or runtime validation fails
- **WHEN** typecheck, build, route response, or browser console validation fails
- **THEN** the agent MUST report the exact failure and MUST NOT claim branch or UI parity
