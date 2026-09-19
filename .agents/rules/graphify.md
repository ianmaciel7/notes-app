# Graphify Rules

- **Mandatory search routing**: All repository file searches, symbol lookups, dependency investigations, and architecture questions MUST start with Graphify (`graphify query`, `graphify path`, `graphify explain`, or `graphify affected`) when `graphify-out/graph.json` exists. If the investigation is broad, multi-step, or architectural, delegate it to `.agents/agents/research/agent.md` and require that agent to use the Graphify skill. Direct `rg`, `find`, or equivalent searches are permitted only as targeted verification after Graphify has established the relevant scope, or when Graphify has no matching node.
- For codebase questions, use `graphify query` when `graphify-out/graph.json` exists (use `--dfs` to trace linear execution/call chains, or default BFS for broad subsystem context).
- Use `graphify path` for relationships and `graphify explain` for focused concepts.
- Check `graphify-out/GRAPH_REPORT.md` for pre-extracted community clusters, god nodes, and architecture patterns.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation.
- For multi-step codebase exploration or architectural investigation, delegate to the `research` subagent (`code-researcher`).
- Do not skip Graphify because its generated files are dirty; skip only for stale/incorrect graph-output tasks or when explicitly requested.
- Use the fast path: query an existing `graphify-out/graph.json` before rebuilding, and use `graphify check-update .` or the incremental update command before expensive extraction.
- Before changing a highly connected shared component, service, API, database object, or authentication boundary, consider `graphify affected "<concept>"` and verify important results in source and tests.
- Use God Nodes and community labels for architectural orientation, but treat them as guidance rather than design judgments. Preserve directed relationships when dependency or call direction matters.
- Use Global Graph, repository cloning/merging, PostgreSQL introspection, or Cargo workspace introspection only when cross-project or external schema relationships materially affect the task.
- Respect `.graphifyignore`, protect existing graphs from unexpectedly smaller replacements, and use force/replacement options only after confirming that deletions or refactors make the reduction intentional.
- Prefer local/code-only extraction when project privacy matters; do not send non-code content to an external backend without authorization.
- After modifying code, run `graphify update .`.

