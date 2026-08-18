## Why

The repository has practical documentation files (e.g., AGENTS.md, Contributing, and project docs), but teams and agents still need a consistent way to evolve these documents safely and reproducibly. This change formalizes how documentation updates are proposed, scoped, reviewed, and synced in OpenSpec so process improvements are traceable and repeatable.

## What Changes

- Define a dedicated documentation-capability for practical repository documentation updates.
- Require proposal and spec artifacts for changes that alter documentation behavior, structure, or contributor workflow.
- Clarify exception handling for non-functional editorial updates versus doc-structure decisions.
- Add task patterns for updating markdown docs and keeping `docs/project-guidelines` aligned to the documented process.
- Add a staleness guard so practical documentation (AGENTS and workflow docs) must be kept synchronized with the authoritative change decisions.

## Capabilities

### New Capabilities
- `docs/practical-workflow`: Define how practical repository documentation and contributor-facing docs are proposed, validated, and applied through OpenSpec.

### Modified Capabilities
- none

## Impact

- Changes the repository governance around documentation updates.
- Affects how future doc PRs are planned and reviewed.
- No changes to runtime code, APIs, data models, or product behavior.
