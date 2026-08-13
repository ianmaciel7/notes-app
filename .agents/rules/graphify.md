---
trigger: always_on
description: Consult the Graphify knowledge graph when graphify-out/ and the Graphify CLI are present and current.
---

## Graphify

Use Graphify as the primary codebase navigation and architecture discovery layer when `graphify-out/` and the Graphify CLI are present and current.

Rules:
- Before broad repository exploration, prefer `graphify query`, `graphify explain`, or `graphify path` when the graph exists and is current.
- Use Graphify to narrow candidate files, then read the actual source before changing behavior.
- Raw repository search remains allowed for exact symbols, missing graph coverage, stale graph evidence, Graphify failures, and source-code verification.
- Graph maintenance should be handled by repository hooks and CI once those files are restored; do not perform unnecessary full rebuilds.
