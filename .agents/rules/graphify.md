# Graphify Rules

- For codebase questions, use `graphify query` when `graphify-out/graph.json` exists.
- Use `graphify path` for relationships and `graphify explain` for focused concepts.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation.
- Do not skip Graphify because its generated files are dirty; skip only for stale/incorrect graph-output tasks or when explicitly requested.
- After modifying code, run `graphify update .`.
