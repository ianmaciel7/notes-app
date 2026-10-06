# Rule: Token Economy & Inspection Hierarchy

## Description
Enforce token-efficient code inspection, architecture discovery, and verification workflows. Agents must use the most specialized and concise tool available before falling back to full file reads or broad test suites.

## Mandatory Guidelines

1. **Symbol-First Code Inspection (Serena MCP)**:
   - When inspecting function implementations, types, or declarations, use Serena MCP (`find_symbol`, `get_symbols_overview`, `find_referencing_symbols`) before reading whole source files.
   - Avoid executing repetitive `view_file` calls across large multi-hundred line files when only a specific function or type is needed.

2. **Architecture Discovery (Graphify MCP)**:
   - Use Graphify MCP (`query_graph`, `get_neighbors`, `shortest_path`) to analyze cross-module dependencies, relationships, and caller hierarchies.
   - Do not manually crawl imports across multiple directories when answering architectural questions.

3. **Targeted Verification During Development**:
   - During code iteration, use targeted checks (`pnpm run verify:changed`, `pnpm run test:changed`, `pnpm run lint:changed`) to test and lint only modified files.
   - Reserve full suite gates (`pnpm run verify:fast`, `pnpm run test:coverage`) for task-end completion or pre-merge verification.

4. **Third-Party Documentation (Context7)**:
   - Always query library and SDK documentation via Context7 MCP (`resolve-library-id` and `query-docs`) before conducting generic web searches.

5. **Subagent Delegation for Deep Exploration**:
   - Delegate broad exploratory tasks or multi-directory searches to subagents (`research`) to keep the primary orchestrator context window concise.
