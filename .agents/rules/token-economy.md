# Rule: Token Economy & Inspection Hierarchy

## Description
Enforce token-efficient code inspection, architecture discovery, and verification workflows. Agents must use the most specialized and concise tool available before falling back to full file reads or broad test suites.

## Mandatory Guidelines

1. **Symbol-First Code Inspection (Serena MCP)**:
   - When inspecting function implementations, types, or declarations, use Serena MCP (`find_symbol`, `get_symbols_overview`, `find_referencing_symbols`) before reading whole source files.
   - Avoid executing repetitive `view_file` calls across large multi-hundred line files when only a specific function or type is needed.
   - Serena is a read tool. Do not store project facts, procedures, or decisions in `.serena/memories/`; they are machine-local. Save them through the `save` skill.

2. **Architecture Discovery (Graphify MCP)**:
   - Use Graphify MCP (`query_graph`, `get_neighbors`, `shortest_path`) to analyze cross-module dependencies, relationships, and caller hierarchies.
   - Do not manually crawl imports across multiple directories when answering architectural questions.
   - `graphify-out/` is generated and can be stale after large changes: rebuild it with `/graphify` before trusting it, and never write facts into it.
   - If Serena or Graphify fails to connect, fall back to `rg` and targeted reads and say so.

3. **Targeted Verification During Development**:
   - During code iteration, use targeted checks (`pnpm run verify:changed`, `pnpm run test:changed`, `pnpm run lint:changed`) to test and lint only modified files.
   - Reserve full suite gates (`pnpm run verify:fast`, `pnpm run test:coverage`) for task-end completion or pre-merge verification.

4. **Third-Party Documentation (Context7)**:
   - Always query library and SDK documentation via Context7 MCP (`resolve-library-id` and `query-docs`) before conducting generic web searches.
   - Follow best practices detailed in [./context7.md](./context7.md).

5. **Subagent Delegation for Deep Exploration**:
   - Delegate broad exploratory tasks or multi-directory searches to subagents (`research`) to keep the primary orchestrator context window concise.

6. **Check Before Re-Deriving, Save After Deciding**:
   - Before researching, designing or re-reading docs, look for an existing record: `GLOSSARY.md`, `docs/adr/`, `DER.md`, `ARCHITECTURE.md`, `docs/`, then agent memory. Reuse and link to it; do not re-derive a settled decision or repeat a finished investigation.
   - When something important is settled or found (a decision, a non-obvious finding, a workaround, a rule), save it once through the `save` skill so the next session finds it instead of rebuilding it. Update the existing entry instead of adding a duplicate.
   - Do not save what code, `git log` or library docs (Context7) already answer.
