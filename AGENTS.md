<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:graphify-rules -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- END:graphify-rules -->

<!-- BEGIN:worktrees-rules -->

## Reference Worktrees (`.worktrees/`)

The `.worktrees/` folder contains historical iterations of the project for architectural and feature reference:
- `.worktrees/old`: Baseline Capacities and Readwise ingestion.
- `.worktrees/old-2`: Revision with OpenSpec templates and reverse engineering specs.
- `.worktrees/old-3`: SRS burndown calculations and document parsing prototypes.
- `.worktrees/old-4`: Capacities parity roadmap, sync protocol, and frontend bootstrap.
- `.worktrees/old-5`: Full Capacities component map reference, Next.js 16 + React 19 architecture, FSRS engine, and AI proxy setup.

When implementing or refactoring features, inspect these worktrees as authoritative baseline references.

**Strict Rule**: The `.worktrees/` directory and all its contents are strictly **READ-ONLY**. AI agents must **NEVER** create, edit, modify, or delete any files or directories inside `.worktrees/`.

<!-- END:worktrees-rules -->

<!-- BEGIN:general-project-rules -->

## Language Rule

- Always write all code, docstrings, comments, commit messages, and project documentation (including `ARCHITECTURE.md`, `README.md`, design docs, etc.) in **English**, unless the user explicitly requests otherwise.

## Path & Configuration Rule

- Always use relative paths or portable command names in configuration files (such as `.codex/hooks.json`, `.husky/*`, etc.). Never hardcode absolute user-dependent paths (such as `C:\Users\ianma\...`).

<!-- END:general-project-rules -->

<!-- BEGIN:mcp-and-skills-rules -->

## Recommended MCP Servers & Skills

- **MCP Servers**:
  - **Shoogle MCP (`shoogle`, `user-shoogle`)**: Search and registry item lookup service (`https://mcp.shoogle.dev/mcp`). See [.agents/mcp_config.example.json](.agents/mcp_config.example.json).
  - **context7**: Docs lookup for Next.js 16 & React 19 breaking changes.

- **Key Skills**:
  - **Architecture & Documentation**: `adr` ([`.agents/skills/adr`](.agents/skills/adr)), `doc-translator` ([`.agents/skills/doc-translator`](.agents/skills/doc-translator)).
  - **UI & Design**: `shadcn-ui`, `taste-design`, `stitch::react-components`.
  - **Quality & Simplification**: `vitest` (official unit testing & mocking), `ponytail-review` (prevents over-engineering in FSRS engine & sync), `systematic-debugging`, `test-driven-development`.
  - **Competitive Intelligence**: `competitive-intelligence` ([`.agents/skills/competitive-intelligence`](.agents/skills/competitive-intelligence)). Reference whenever in doubt regarding feature models, architectural decisions, or PKM parity. Continuously increment and expand this skill whenever researching or finding new competitive information.

<!-- END:mcp-and-skills-rules -->

<!-- BEGIN:subagent-roles -->

## Subagent Delegation Policy (`.agents/agents/`)

**Mandatory Delegation Rule**: Do NOT perform complex or multi-step tasks end-to-end in isolation. Whenever a task involves architecture, research, code review, testing, or documentation, ALWAYS invoke specialized subagents using `invoke_subagent`:

- **`architect`** ([`.agents/agents/architect/agent.md`](.agents/agents/architect/agent.md)): Mandatory for system design, cross-module planning, server/client boundaries, and trade-off evaluation before non-trivial coding.
- **`research`**: Mandatory for broad codebase exploration, dependency auditing, or gathering context across multiple directories.
- **`code-reviewer`** ([`.agents/agents/code-reviewer/agent.md`](.agents/agents/code-reviewer/agent.md)): Mandatory for auditing diffs, correctness, accessibility, regressions, and code quality before declaring completion.
- **`doc-maintainer`** ([`.agents/agents/doc-maintainer/agent.md`](.agents/agents/doc-maintainer/agent.md)): Mandatory for creating, auditing, updating, and synchronizing ADRs, architecture specs, and markdown documentation.
- **`security-reviewer`** ([`.agents/agents/security-reviewer/agent.md`](.agents/agents/security-reviewer/agent.md)): Mandatory for threat modeling, auth boundaries, secret leakage prevention, and security policies.
- **`test-engineer`** ([`.agents/agents/test-engineer/agent.md`](.agents/agents/test-engineer/agent.md)): Mandatory for regression test strategies, verification commands (`pnpm check`, `pnpm test`, `pnpm build`), and test coverage.

<!-- END:subagent-roles -->



