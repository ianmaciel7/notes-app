## Why

The repository currently lacks essential project documentation files referenced in onboarding materials, reducing discoverability for contributors and making maintenance rules hard to find. Adding these files now creates a complete documented baseline and closes the gap between expected and actual repository structure.

## What Changes

- Add missing contributor and governance documentation: CONTRIBUTING.md, SECURITY.md, and AGENTS.md.
- Add missing project documentation hub files: docs/ARCHITECTURE.md, docs/DESIGN.md, docs/TESTING.md, and docs/DEPLOYMENT.md.
- Add operational repository rule files under `.agents/rules` for UI component reuse, Next.js architecture defaults, Git workflow discipline, and graph-aware codebase discovery.
- Tie documentation delivery to the practical documentation workflow so stale files do not drift.
- Ensure each added document points to the repo’s OpenSpec-driven practices.

## Capabilities

### New Capabilities
- `repository/docs-baseline`: Define required repository documentation baseline files and keep them synchronized when process or governance rules change.
- `repository/rules-baseline`: Require and centralize agent/process guidance rules used by contributors and automation.

### Modified Capabilities
- `docs/practical-workflow`: Update documentation freshness requirements to include these baseline files as mandatory practical docs in the same scope when process changes.

## Impact

- No application runtime behavior change.
- Adds repository documentation files used by contributors and contributors agents.
- Improves consistency for PRs and agent handoffs.
