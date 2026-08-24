# Graphify Rule

trigger: always_on

Consult the Graphify knowledge graph at `graphify-out/` for codebase and architecture questions.

## Graphify

Use Graphify as the primary codebase navigation and architecture discovery layer.

- Before broad repository exploration, prefer `graphify query`, `graphify explain`, or `graphify path`.
- Use Graphify to narrow candidate files, then read the actual source before changing behavior.
- Raw repository search remains allowed for exact symbols, missing graph coverage, stale graph evidence, Graphify failures, and source-code verification.
- Graph maintenance is handled by repository hooks and CI; do not perform unnecessary full rebuilds.
