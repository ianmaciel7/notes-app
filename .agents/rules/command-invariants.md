# Command & Tool Invariants

These rules govern how agents execute commands and utilize repository-configured tools.

## 1. Native MCP and Specialized Tool Preference
- **Mandatory Tool Priority**: Always prefer specialized MCP tools over generic shell commands whenever an MCP is available:
  - **Serena MCP** (`search_for_pattern`, `find_symbol`, `find_referencing_symbols`, `get_symbols_overview`, `replace_content`): Primary tool for code analysis, symbol queries, exact text/regex search, and semantic edits.
  - **Graphify MCP** (`query_graph`, `shortest_path`, `get_neighbors`): Primary tool for architecture and dependency analysis when `graphify-out/` exists.
  - **Git MCP** (`git_status`, `git_diff`, `git_log`, `git_commit`): Primary tool for repository version control status and history.
  - **Context7 CLI** (`ctx7 library` → `ctx7 docs`): Primary tool for official library/SDK documentation.
  - **Repomix** (`repomix.config.json` / `repomix`): Primary tool for broad code snapshots and multi-file aggregation.

## 2. Shell Command Execution with RTK
- **Mandatory RTK Prefix**: When a shell command is strictly required (e.g. `pnpm build`, `pnpm test`, `pnpm lint`), it MUST be prefixed with `rtk` (e.g., `rtk pnpm build`, `rtk pnpm vitest run`).
- **Policy Violation**: Running bare shell commands without `rtk` is a violation of repository policy, equivalent to bypassing a quality gate.
- **Exceptions**: Only RTK diagnostic commands (`rtk --version`, `rtk gain`) and verifiably broken/unavailable RTK states may bypass this rule (see `RTK.md` for details).

## 3. Cross-File Architecture Analysis with Graphify
- **Mandatory Graphify First**: Whenever `graphify-out/` exists, agents MUST query Graphify before manually tracing cross-file architecture, dependency chains, or call graphs.
- **Procedure**: Consult `.agents/skills/graphify/skill.md` for query guidelines before executing queries.

## 4. Repository Snapshots with Repomix
- **Mandatory Repomix**: When a broad, portable repository snapshot or context export is required, agents MUST use Repomix via `repomix.config.json`.
- **Anti-Pattern**: Do NOT manually concatenate files or enumerate multiple full file dumps.

## 5. Third-Party Documentation with Context7
- **Mandatory Verification**: Before writing code against any external library, SDK, framework, or CLI tool, agents MUST fetch current documentation via Context7 (`ctx7 library` → `ctx7 docs`).
- **Anti-Pattern**: Never rely on unverified training-data memory for API signatures, breaking changes, or configuration syntax.
- **Procedure**: Follow `.agents/skills/context7-cli/SKILL.md`.

