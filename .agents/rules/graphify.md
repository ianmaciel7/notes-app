# Graphify Rule

trigger: always_on

Consult the Graphify knowledge graph at `graphify-out/` for codebase and architecture questions.

## Graphify

Use Graphify as the primary codebase navigation and architecture discovery layer.

- Before broad repository exploration, prefer `graphify query`, `graphify explain`, or `graphify path`.
- Use Graphify to narrow candidate files, then read the actual source before changing behavior.
- Raw repository search remains allowed for exact symbols, missing graph coverage, stale graph evidence, Graphify failures, and source-code verification.
- Treat the graph as stale when the recorded source commit in `graphify-out/GRAPH_REPORT.md` does not match the code revision being analyzed.
- Before relying on stale graph output for changed code, refresh it with the repository Graphify scripts or explicitly fall back to source-code verification.
- Graph maintenance is not guaranteed by CI. Do not assume hooks or workflows refreshed the graph unless the repository configuration proves it for the current revision.
- Avoid unnecessary full rebuilds when `graphify update .` or the repository's incremental Graphify scripts are sufficient.
