# Graphify Rules

- For codebase questions, use `graphify query` when `graphify-out/graph.json` exists (use `--dfs` to trace linear execution/call chains, or default BFS for broad subsystem context).
- Use `graphify path` for relationships and `graphify explain` for focused concepts.
- Check `graphify-out/GRAPH_REPORT.md` for pre-extracted community clusters, god nodes, and architecture patterns.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation.
- For multi-step codebase exploration or architectural investigation, delegate to the `research` subagent (`code-researcher`).
- Do not skip Graphify because its generated files are dirty; skip only for stale/incorrect graph-output tasks or when explicitly requested.
- After modifying code, run `graphify update .`.

