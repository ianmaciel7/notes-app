## Context

This change is for a repository that already tracks contributor workflow and OpenSpec processes. The bootstrap flow is currently manual and inconsistent across branches.

## Goals / Non-Goals

**Goals:**
- Define a deterministic, documented frontend initialization process that can be executed from the repository root or an explicit folder.
- Add Biome + ESLint + shadcn/ui setup as first-class project initialization requirements.
- Add clear conflict and recovery steps for running `create-next-app` in existing directories.

**Non-Goals:**
- Reworking existing OpenSpec governance unrelated to frontend bootstrap.
- Choosing application architecture, feature architecture, or styling systems beyond baseline project initialization.
- Locking specific UI component sets beyond `shadcn` template selection.

## Decisions

- **Decision: Track bootstrap commands in repository docs rather than embedding in scripts.**
  - Why: Commands depend on local context (`notes-app` root, existing files, user preferences), and docs provide flexibility while keeping explicit traceability.
  - Alternative: Single shell bootstrap script for automation. Rejected because it reduces flexibility when directory conflict handling differs by environment.

- **Decision: Keep both `ESLint` and `Biome` in the baseline workflow.**
  - Why: `create-next-app` already supports ESLint and project teams still rely on it; Biome adds fast formatting/linting and future-ready tooling.
  - Alternative: Replace ESLint with Biome only. Rejected because migration risk is higher and existing teams may still require ESLint-integrated tooling.

- **Decision: Add a conflict-handling step before project creation in existing directories.**
  - Why: Prevent command failures from root-level initialization and preserve current repository files.
  - Alternative: Skip conflict guidance and always create into a subfolder. Rejected because user explicitly asked for root-project support in prior workflow.

## Risks / Trade-offs

- [Risk] `next` scaffolding output evolves over time, causing command behavior drift.
  - Mitigation: Keep commands versioned in docs and refresh periodically via periodic maintenance.
- [Risk] Dual quality tooling (`ESLint` + `Biome`) increases setup overhead.
  - Mitigation: Make scripts and commands explicit; include a short default setup path in docs.
- [Risk] Root-directory bootstrap conflicts with hidden existing files.
  - Mitigation: Explicitly document backup/move strategy before running `create-next-app`.

## Migration Plan

- Publish the new baseline docs in docs/operational area first.
- Validate on a clean environment by executing command sequence and confirming `pnpm run lint` succeeds.
- If conflict or lint behavior diverges, update the bootstrap doc and tasks as part of this change set.
