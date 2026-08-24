# Graphify & Graph Engine Navigation

trigger: always_on

All agents and subagents MUST use the Graphify knowledge graph and Graph Engine as the mandatory primary layer for codebase understanding, architecture exploration, dependency mapping, and impact analysis.

## Mandatory Policy

1. **Always Consult Graph Engine First**:
   - Before performing repository exploration, planning changes, or analyzing cross-module dependencies, consult the Graphify knowledge graph at `graphify-out/` and use Graphify tools/commands (`graphify query`, `graphify explain`, `graphify path`).
   - Read `graphify-out/GRAPH_REPORT.md` when high-level architectural context, god nodes, or community boundaries are needed.

2. **Impact & Dependency Analysis**:
   - Trace callers, callees, component relationships, and data flows through the knowledge graph prior to modifying components or server routes.
   - Use the graph engine to prevent unintended side effects across dependent modules.

3. **Narrowing Candidates & Verification**:
   - Use Graphify to locate and narrow candidate files and symbols.
   - Always verify active source files before applying edits.
   - Fall back to exact code grep or symbol search only for exact string verification, test fixtures, or when inspecting code not yet indexed in the graph.

4. **Maintenance**:
   - Keep the knowledge graph up-to-date using `pnpm run graphify:build` or `graphify build` when architectural or file relationships change significantly.
