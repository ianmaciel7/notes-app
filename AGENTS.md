<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Reference Worktrees (`.worktrees/`)

The `.worktrees/` folder contains historical iterations of the project for architectural and feature reference:
- `.worktrees/old`: Baseline Capacities and Readwise ingestion.
- `.worktrees/old-2`: Revision with OpenSpec templates and reverse engineering specs.
- `.worktrees/old-3`: SRS burndown calculations and document parsing prototypes.
- `.worktrees/old-4`: Capacities parity roadmap, sync protocol, and frontend bootstrap.
- `.worktrees/old-5`: Full Capacities component map reference, Next.js 16 + React 19 architecture, FSRS engine, and AI proxy setup.

When implementing or refactoring features, inspect these worktrees as authoritative baseline references.

**Strict Rule**: The `.worktrees/` directory and all its contents are strictly **READ-ONLY**. AI agents must **NEVER** create, edit, modify, or delete any files or directories inside `.worktrees/`.

## Language Rule

- Always write all code, docstrings, comments, commit messages, and project documentation (including `ARCHITECTURE.md`, `README.md`, design docs, etc.) in **English**, unless the user explicitly requests otherwise.

## Path & Configuration Rule

- Always use relative paths or portable command names in configuration files (such as `.codex/hooks.json`, `.husky/*`, etc.). Never hardcode absolute user-dependent paths (such as `C:\Users\ianma\...`).

## Recommended MCP Servers

- **Open Design MCP**: Used for UI component design and visual asset synchronization. See [.agents/mcp_config.example.json](.agents/mcp_config.example.json) for an environment configuration template. Ensure the local Open Design desktop application is running on your machine.

## Specialized Subagent Roles (`.agents/agents/`)

When working on complex tasks, subagents can be invoked via `invoke_subagent` to specialize in specific areas:
- **`architect`** ([`.agents/agents/architect/agent.md`](.agents/agents/architect/agent.md)): For system design, cross-module planning, server/client boundaries, and trade-off evaluation before coding.
- **`code-reviewer`** ([`.agents/agents/code-reviewer/agent.md`](.agents/agents/code-reviewer/agent.md)): For auditing diffs, correctness, accessibility, regressions, and code quality.
- **`security-reviewer`** ([`.agents/agents/security-reviewer/agent.md`](.agents/agents/security-reviewer/agent.md)): For threat modeling, auth boundaries, secret leakage prevention, and security policies.
- **`test-engineer`** ([`.agents/agents/test-engineer/agent.md`](.agents/agents/test-engineer/agent.md)): For regression test strategies, verification commands (`pnpm check`, `pnpm build`), and test coverage.



