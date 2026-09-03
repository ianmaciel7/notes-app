---
trigger: always_on
description: Use Graphify knowledge graph at graphify-out/ for codebase navigation, architecture queries, and dependency tracing.
---

# Graphify Codebase Knowledge Graph

Consult the Graphify knowledge graph at `graphify-out/` for codebase and architecture questions.

## Usage Guidelines

Use Graphify as the primary codebase navigation and architecture discovery layer.

- Before broad repository exploration, prefer running `graphify query "<question>"`, `graphify explain "<concept>"`, or `graphify path`.
- Use Graphify to narrow candidate files, then read the actual source before modifying behavior.
- Raw repository search (`grep_search`, `find_by_name`) remains authoritative for exact symbols, missing graph coverage, and direct code verification.
- Treat the graph as stale when the recorded source commit in `graphify-out/GRAPH_REPORT.md` does not match the active code revision.
- Refresh the graph using `graphify update .` or repository graph scripts after material architectural changes.
