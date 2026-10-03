---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- Read graphify-out/GRAPH_REPORT.md for broad architecture review or when query/path/explain do not surface enough context
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
- For multi-step or multi-file work, the graph also drives delegation: `query_graph` seeds, `get_neighbors`/`get_pr_impact` size the blast radius, `get_community` partitions work units, `shortest_path` orders them, and `god_nodes` marks files that must not have parallel writers. The procedure is canonical in `.agents/rules/orchestration.md` (Step 2) and squad dispatch in `.agents/rules/squads.md`
