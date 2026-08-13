## Why

Working branches are part of the repository's review surface. Agent-specific, personal, localized, or vague branch names make pull request history harder to scan and weaken the protected-branch workflow documented for `stag`.

The project already documents a dedicated branch-per-task workflow in `CONTRIBUTING.md`, but it needs an explicit OpenSpec requirement and an agent-facing reminder so future work starts from an industry-standard branch name.

## What Changes

- Add repository governance requirements for conventional branch naming.
- Require task branches to use a change-type prefix and short English kebab-case description.
- Document that agents and contributors must check the branch naming rule before creating or renaming a working branch.
- Keep `CONTRIBUTING.md` as the canonical human-facing workflow document.
- Add an `AGENTS.md` reminder so future agents discover branch naming, OpenSpec, shell, branch-flow, and verification expectations before repository work.

## Capabilities

### New Capabilities

- `repository-governance`: Defines durable repository workflow expectations that affect branch naming, contributor workflow, and agent behavior.

## Non-Goals

- Rename protected branches.
- Add automated branch-name enforcement in CI before a pull request naming policy is chosen.
- Duplicate the full contributor workflow inside `AGENTS.md`.
- Change the existing `stag -> working branch -> PR -> stag` flow.
