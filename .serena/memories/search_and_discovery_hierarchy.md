# Search and Discovery Tool Hierarchy

Canonical hierarchy and strict tool preference for the `notes-app` project:

1. **Text Patterns, Symbols, and Semantic Edits**: Serena MCP (`search_for_pattern`, `find_symbol`, `find_referencing_symbols`, `get_symbols_overview`, `replace_content`). ALWAYS prioritized for code inspection and edits without relying on shell subprocesses.
2. **Third-Party Official Documentation**: Context7 CLI (`npx ctx7 library` -> `ctx7 docs`). MANDATORY before implementing or modifying integrations with external libraries and SDKs.
3. **Architecture and Dependency Relationships**: Graphify MCP (`query_graph`, `shortest_path`, `get_neighbors`, `graphify-out/`).
4. **Broad Snapshots and Multi-File Context**: Repomix (`repomix.config.json` / `repomix`). MANDATORY for multi-file exports without manual concatenation.
5. **Version Control**: Git MCP (`git_status`, `git_diff`, `git_log`, `git_commit`).
6. **Build and Test Commands**: RTK CLI (`rtk pnpm build`, `rtk pnpm test`, `rtk pnpm vitest`) ONLY when terminal subprocesses are strictly necessary.

Formally documented in `.agents/rules/command-invariants.md` and `.agents/rules/search-and-discovery.md`.
All memories and control documentation MUST be written in English.