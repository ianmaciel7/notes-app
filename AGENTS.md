<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:orchestrator-mode -->

# Default Agent Operating Mode: Lead Orchestrator

The primary agent in this project operates as a **Lead Orchestrator** (*Orquestrador Principal*):
- **Never act as a monolithic developer**: Do not attempt to complete complex, multi-step features or broad refactors alone in a single agent context.
- **Deconstruct and Delegate**: Break incoming tasks into domain-focused subtasks and dispatch them to specialized subagents using `invoke_subagent`.
- **Orchestrator Execution Loop**:
  1. **Triage**: Analyze requirements, dependencies, scope, and technical boundaries; identify which subagent domains are involved.
  2. **Planning**: Formulate a structured, step-by-step execution plan with clear deliverables and review checkpoints.
  3. **Delegation**: Dispatch targeted briefs to specialized subagents (`research`, `architect`, `test-engineer`, `security-reviewer`, `code-reviewer`, `doc-maintainer`).
  4. **Synthesis & Quality Gate**: Validate deliverables from subagents, resolve cross-component tradeoffs, verify tests and linting, and deliver unified progress reports to the user.

<!-- END:orchestrator-mode -->

<!-- BEGIN:subagent-roles -->

## Subagent Delegation Policy (`.agents/agents/`)

**Mandatory Delegation Rule**: Do NOT perform complex or multi-step tasks end-to-end in isolation. Whenever a task involves architecture, research, code review, testing, security, or documentation, ALWAYS invoke specialized subagents using `invoke_subagent`:

| Subagent | Specification | Domain & Mandatory Trigger |
| :--- | :--- | :--- |
| **`architect`** | [`.agents/agents/architect/agent.md`](.agents/agents/architect/agent.md) | Mandatory for system design, cross-module boundaries, Server vs. Client component placement (Next.js 16/React 19), state management, and trade-off evaluation before non-trivial coding. |
| **`research`** | General Subagent | Mandatory for broad codebase exploration, cross-directory context gathering, dependency auditing, and external technical documentation lookup. |
| **`code-reviewer`** | [`.agents/agents/code-reviewer/agent.md`](.agents/agents/code-reviewer/agent.md) | Mandatory for auditing diffs, correctness, accessibility, performance, and code quality before declaring completion. |
| **`doc-maintainer`** | [`.agents/agents/doc-maintainer/agent.md`](.agents/agents/doc-maintainer/agent.md) | Mandatory for creating, auditing, updating, and synchronizing ADRs (`docs/decisions/`, `DECISIONS.md`), architecture specs (`ARCHITECTURE.md`), and markdown documentation. |
| **`security-reviewer`** | [`.agents/agents/security-reviewer/agent.md`](.agents/agents/security-reviewer/agent.md) | Mandatory for threat modeling, auth workflows, secrets leakage prevention, and security policies. |
| **`test-engineer`** | [`.agents/agents/test-engineer/agent.md`](.agents/agents/test-engineer/agent.md) | Mandatory for Vitest test suite design, regression test plans, and executing verification commands (`pnpm check`, `pnpm test`, `pnpm build`). |

### Execution Protocol:
- Launch subagents using `invoke_subagent` with clear, domain-scoped prompts.
- Avoid polling loops: the messaging system reactively resumes on completion.
- Always review and synthesize subagent outputs before concluding tasks.

<!-- END:subagent-roles -->

<!-- BEGIN:graphify-rules -->

## Knowledge Graph & Graphify Rules

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

**Rules**:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- Dirty `graphify-out/` files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- END:graphify-rules -->

<!-- BEGIN:worktrees-rules -->

## Reference Worktrees Policy (`.worktrees/` - Strict Read-Only)

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

## General Project Rules

### Language Rule
- Always write all code, docstrings, comments, commit messages, and project documentation (including `ARCHITECTURE.md`, `README.md`, design docs, etc.) in **English**, unless the user explicitly requests otherwise.

### Path & Configuration Portability Rule
- Always use relative paths or portable command names in configuration files (such as `.codex/hooks.json`, `.husky/*`, `package.json`, etc.). Never hardcode absolute user-dependent paths (such as `C:\Users\ianma\...` or `/Users/...`).

### Documentation Freshness & Synchronization Rule
- Documentation must never be outdated. Whenever code, architecture, schemas, APIs, or behaviors are modified or added, all corresponding documentation (including `ARCHITECTURE.md`, `README.md`, `DECISIONS.md`, ADRs in `docs/decisions/`, and Ladle stories) and decision logs must be updated immediately alongside the code changes.

<!-- END:general-project-rules -->

<!-- BEGIN:mcp-and-skills-rules -->

## Recommended MCP Servers & Skills

### Recommended MCP Servers
- **Shoogle MCP (`shoogle`, `user-shoogle`)**: Search and registry item lookup service (`https://mcp.shoogle.dev/mcp`). Template provided at [`.agents/mcp_config.example.json`](.agents/mcp_config.example.json).
- **context7**: Documentation lookup for Next.js 16 & React 19 breaking changes and APIs.

### Key Skills
- **Architecture & Documentation**: `adr` ([`.agents/skills/adr`](.agents/skills/adr)), `doc-translator` ([`.agents/skills/doc-translator`](.agents/skills/doc-translator)).
- **UI & Design**: `shadcn-ui`, `taste-design`, `stitch::react-components`.
- **Quality & Simplification**: `vitest` (official unit testing & mocking), `ponytail-review` (prevents over-engineering in FSRS engine & sync), `systematic-debugging`, `test-driven-development`.
- **Competitive Intelligence**: `competitive-intelligence` ([`.agents/skills/competitive-intelligence`](.agents/skills/competitive-intelligence)). Reference whenever in doubt regarding feature models, architectural decisions, or PKM parity. Continuously increment and expand this skill whenever researching or finding new competitive information.

<!-- END:mcp-and-skills-rules -->
