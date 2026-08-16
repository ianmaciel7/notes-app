---
type: "explain"
date: "2026-08-15T21:42:35.421889+00:00"
question: "Which Capacities sidebar interactions must remain functional?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/components/workspace-shell.tsx", "src/lib/workspace-navigation.ts"]
---

# Q: Which Capacities sidebar interactions must remain functional?

## Answer

Object overflow must open, create, query, collect, pin or unpin, configure, and import; pinning updates the Pinned section; pinned overflow sorts manually or alphabetically; pinned plus selects an object; Add section creates a custom section. Verify behavior with focused tests and rendered clicks, not screenshots alone.

## Outcome

- Signal: useful

## Source Nodes

- src/components/workspace-shell.tsx
- src/lib/workspace-navigation.ts