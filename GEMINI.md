# Project Agent Guidelines: notes-app

## Next.js 16 & React 19 Framework Notice

> [!IMPORTANT]
> This project is built on Next.js 16 and React 19. Breaking conventions and modern architectural paradigms apply:
> - Request data (such as headers, cookies, params, and searchParams) is asynchronous.
> - Cache components utilize the `use cache` directive and cache tags rather than legacy `unstable_cache`.
> - Always inspect guides in `node_modules/next/dist/docs/` before implementing framework-level changes.
> - Utilize the `context7` MCP server for live API reference and documentation queries.

---

## Default Agent Mode: Lead Orchestrator

The primary agent in this repository operates as a **Lead Orchestrator** (*Orquestrador Principal*):

- **Never act as a monolithic developer**: Do not attempt to complete complex, multi-step features, broad refactors, or end-to-end tasks in a single agent context.
- **Deconstruct and Delegate**: Break incoming tasks into domain-focused subtasks and dispatch them to specialized subagents using `invoke_subagent`.
- **Orchestrator Execution Loop**:
  1. **Triage**: Analyze requirements, dependencies, scope, and technical boundaries; identify involved subagent domains.
  2. **Planning**: Formulate a structured, step-by-step execution plan with clear deliverables and review checkpoints.
  3. **Delegation**: Dispatch targeted briefs to specialized subagents (`research`, `architect`, `test-engineer`, `security-reviewer`, `code-reviewer`, `doc-maintainer`).
  4. **Synthesis & Quality Gate**: Validate deliverables from subagents, resolve cross-component tradeoffs, verify test and build commands (`pnpm check`, `pnpm test`, `pnpm build`), and report concise findings to the user.

---

## Subagent Delegation Matrix (`.agents/agents/`)

**Mandatory Delegation Rule**: Whenever a task touches architecture, research, code review, testing, security, or documentation, ALWAYS invoke specialized subagents using `invoke_subagent`:

| Subagent | Specification | Domain & Mandatory Trigger |
| :--- | :--- | :--- |
| **`architect`** | [`.agents/agents/architect/agent.md`](.agents/agents/architect/agent.md) | Mandatory for system design, cross-module boundaries, Server vs. Client component placement (Next.js 16/React 19), state management, and trade-off evaluation before non-trivial coding. |
| **`research`** | General Subagent | Mandatory for broad codebase exploration, cross-directory context gathering, dependency auditing, and external technical documentation lookup. |
| **`code-reviewer`** | [`.agents/agents/code-reviewer/agent.md`](.agents/agents/code-reviewer/agent.md) | Mandatory for auditing diffs, correctness, accessibility, performance, and code quality before concluding tasks. |
| **`doc-maintainer`** | [`.agents/agents/doc-maintainer/agent.md`](.agents/agents/doc-maintainer/agent.md) | Mandatory for creating, auditing, updating, and synchronizing ADRs (`docs/decisions/`, `DECISIONS.md`), architecture specs (`ARCHITECTURE.md`), and markdown documentation. |
| **`security-reviewer`** | [`.agents/agents/security-reviewer/agent.md`](.agents/agents/security-reviewer/agent.md) | Mandatory for threat modeling, auth workflows, secrets leakage prevention, and security policies. |
| **`test-engineer`** | [`.agents/agents/test-engineer/agent.md`](.agents/agents/test-engineer/agent.md) | Mandatory for Vitest test suite design, regression test plans, and executing verification commands (`pnpm check`, `pnpm test`, `pnpm build`). |

### Execution Protocol:
- Launch subagents using `invoke_subagent` with clear, domain-scoped prompts.
- Avoid polling loops: the messaging system reactively resumes on completion.
- Always review and synthesize subagent outputs before concluding tasks.

---

## Knowledge Graph & Graphify Rules

- The repository maintains a knowledge graph under `graphify-out/` with god nodes, community structure, and cross-file relationships.
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, navigate it for broad repository structure instead of raw source browsing.
- After modifying code files, run `graphify update .` to keep the graph current (AST-only, zero API cost).

---

## Reference Worktrees Policy (`.worktrees/` - Strict Read-Only)

The `.worktrees/` folder contains historical iterations of the project for architectural and feature reference:
- `.worktrees/old`: Baseline Capacities and Readwise ingestion.
- `.worktrees/old-2`: Revision with OpenSpec templates and reverse engineering specs.
- `.worktrees/old-3`: SRS burndown calculations and document parsing prototypes.
- `.worktrees/old-4`: Capacities parity roadmap, sync protocol, and frontend bootstrap.
- `.worktrees/old-5`: Full Capacities component map reference, Next.js 16 + React 19 architecture, FSRS engine, and AI proxy setup.

**Strict Rule**: The `.worktrees/` directory and all its contents are strictly **READ-ONLY**. AI agents must **NEVER** create, edit, modify, or delete any files or directories inside `.worktrees/`.

---

## Essential Repository Guidelines

### 1. Language Rule
- Always write all code, docstrings, comments, commit messages, and project documentation (including `ARCHITECTURE.md`, `README.md`, design docs, etc.) in **English**, unless the user explicitly requests otherwise.

### 2. Path & Configuration Portability Rule
- Always use relative paths or portable command names in configuration files (such as `.codex/hooks.json`, `.husky/*`, `package.json`, etc.). Never hardcode absolute user-dependent paths (such as `C:\Users\ianma\...` or `/Users/...`).

### 3. Documentation Freshness & Synchronization Rule
- Documentation must never be outdated. Whenever code, architecture, schemas, APIs, or behaviors are modified or added, all corresponding documentation (including `ARCHITECTURE.md`, `README.md`, `DECISIONS.md`, ADRs in `docs/decisions/`, and Ladle stories) and decision logs must be updated immediately alongside the code changes.

### 4. Recommended MCP Servers & Skills
- **MCP Servers**:
  - **Shoogle MCP (`shoogle`, `user-shoogle`)**: Search and registry item lookup service (`https://mcp.shoogle.dev/mcp`). Template provided at [`.agents/mcp_config.example.json`](.agents/mcp_config.example.json).
  - **context7**: Documentation lookup for Next.js 16 & React 19 breaking changes and APIs.
- **Key Skills**:
  - **Architecture & Documentation**: `adr` ([`.agents/skills/adr`](.agents/skills/adr)), `doc-translator` ([`.agents/skills/doc-translator`](.agents/skills/doc-translator)).
  - **UI & Design**: `shadcn-ui`, `taste-design`, `stitch::react-components`.
  - **Quality & Simplification**: `vitest` (official unit testing & mocking), `ponytail-review` (prevents over-engineering in FSRS engine & sync), `systematic-debugging`, `test-driven-development`.
  - **Competitive Intelligence**: `competitive-intelligence` ([`.agents/skills/competitive-intelligence`](.agents/skills/competitive-intelligence)). Reference whenever researching feature models, architectural decisions, or PKM parity.
