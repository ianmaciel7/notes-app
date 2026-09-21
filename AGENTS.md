<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AI Tooling

`AGENTS.md` is the shared source of truth for AI coding agents in this repository.

### Mandatory Tooling Enforcement

All AI coding agents MUST strictly enforce and utilize this specialized toolchain:

- **Serena (MANDATORY)**: MUST be used for symbol-level code navigation, references, AST inspection, and targeted edits. Do NOT scan or read full source files when Serena symbol tools can target the code directly.
- **Graphify (MANDATORY)**: MUST be queried first for repository architecture, relationships, and broader codebase understanding whenever `graphify-out/` exists or the Graphify MCP/CLI is active.
- **Context7 (MANDATORY)**: MUST be used (`npx ctx7@latest`) to fetch current documentation whenever inquiring about or implementing external frameworks, libraries, APIs, SDKs, or CLI tools (e.g., Next.js, React, Tailwind, Prisma). Never rely on pre-training assumptions.
- **RTK (MANDATORY)**: MUST prefix all supported terminal commands with `rtk` (e.g., `rtk git status`, `rtk pnpm ...`, `rtk rg`, etc.) to compress output and eliminate token waste.
  - If `rtk` cannot be started by the current shell (notably the WinGet shim on Windows), resolve the installed executable with `Get-Command rtk`, read its `Target`, and invoke that target directly. Do not treat this as a missing dependency when the target executable exists.
- **Repomix**: Permitted ONLY when a compact, comprehensive repository-wide snapshot or token-budget audit is strictly necessary.
- **Targeted Retrieval Policy**: Strictly avoid reading whole files or large repository sections when targeted retrieval via Serena, Graphify, or RTK is possible.

### Proactive Context Efficiency & Anti-Patterns

Agents must proactively eliminate token waste and context bloat:
- **No Indiscriminate Reads**: Do not read entire files just to inspect a type definition, function signature, or component prop; use Serena AST tools.
- **No Unfiltered Diffs/Logs**: Avoid dumping raw diffs or deep logs into context; use `rtk git diff` or `rtk git log -n <limit>`.
- **No Repeated Exploration**: Do not repeatedly search the directory tree for concepts Graphify already indexes; query the graph first.
- **Focused Documentation**: Keep Context7 queries strictly scoped to a single concept rather than pulling multi-topic references.
- **No Repetitive File Reads**: Reuse recently read context within the conversation rather than re-reading unchanged files.

### Token Observability & Harness Audits (On-Demand Only)

- **RTK Savings Metrics**: Run `rtk gain` or `rtk gain --history` to inspect terminal token compression and diagnose verbosity during performance reviews (never after every command).
- **Context-Budget Audits**: Run `repomix --token-count-tree` only when conducting a structured repository token-budget analysis or when context limits are threatened.
- **Harness Engineering Audits**: Use the `measure-ai-proficiency` skill (`.agents/skills/measure-ai-proficiency/SKILL.md` or `uvx measure-ai-proficiency .`) on-demand to audit AI context maturity, primitive discipline, and harness drift. Do not execute automatically during standard coding tasks.

### Deterministic Safety & Optimization Hooks

Mechanical enforcement is decoupled from semantic instructions. The policy lives in exactly two scripts, shared across every connected agent:

- **Command Safety** (`.agents/hooks/command-safety.ps1`): Destructive commands (`git reset --hard`, `git clean -fd`, `rm -rf`, force-pushes) require explicit user confirmation before running.
- **RTK Gatekeeper** (`.agents/hooks/enforce-rtk.ps1`): Commands supported by RTK are intercepted before execution; bypassing RTK is denied, with the exact optimized command suggested.

Each script auto-detects which tool invoked it (Antigravity's `toolCall.name`/`args.CommandLine` shape, or the `tool_name`/`tool_input.command` shape shared by Claude Code, Codex and Gemini CLI — disambiguated by `hook_event_name`) and replies in that tool's expected output format. `@agents-dev/cli` does not manage hooks at all (no schema key, no subcommand) — this wiring is hand-maintained, one native config entry per tool, all pointing at the same two scripts:

| Tool | Wired via | Event name | Tracked in git |
| --- | --- | --- | --- |
| Antigravity | `.agents/hooks.json` | `PreToolUse` | yes |
| Claude Code | `.claude/settings.json` | `PreToolUse` | yes |
| Gemini CLI | `.gemini/settings.json` | `BeforeTool` | yes |
| Codex | `.codex/config.toml` (appended after the `agents-sync managed MCP` block) | `PreToolUse` | **no** — `.codex/` is gitignored as an `agents-dev/cli`-materialized directory; re-add this block by hand after any fresh `agents connect`/`init --force` on a new machine |

Note: Gemini CLI's `BeforeTool` hook output has no "ask" tier (only `allow`/`deny`), so a destructive command that would prompt for confirmation elsewhere is hard-denied there instead.

### Primitive Discipline (Cheapest Primitive First)

Agents must choose the most cost-effective primitive for each task:
- **Always-on Rules (`AGENTS.md`)**: Reserved for universal, compact constraints (zero procedural bloat).
- **Skills (`.agents/skills/`)**: Use for multi-step procedures, runbooks, and specialized knowledge loaded on demand.
- **Hooks (`.agents/hooks/*.ps1`, wired per-tool — see below)**: Use for deterministic, mechanically verifiable guardrails.
- **Subagents**: Use only when context isolation, parallel execution, or specialized roles are required.
- **MCP Tools**: Use for semantic code intelligence (Serena AST, Graphify graph, Context7 docs).
- **Audits (Repomix)**: Reserved for explicit token/context-budget audits; never run in default task loops.

### Tool-specific configuration

Agent-specific integration files may extend these shared instructions:

- `.agents/rules/graphify.md` — Antigravity Graphify integration.
- `.agents/rules/rtk.md` — Antigravity RTK integration.
- `.agents/rules/shadcn.md` — shadcn/ui composition rules for this repo's `base-nova`/Base UI configuration, condensed from `.agents/skills/shadcn/`.
- `GEMINI.md` — Antigravity-specific instructions generated by integrations when required.
- `CLAUDE.md` — Claude Code adapter to this `AGENTS.md`.
- `.claude/settings.json` — Claude Code's own hook wiring (see Deterministic Safety & Optimization Hooks above). Not a duplicate of `AGENTS.md` content.
- `.gemini/settings.json` — belongs to **Gemini CLI specifically** (`geminicli.com`), a different product from Antigravity despite the shared `.gemini/` folder name; holds its own permissions and hook wiring.
- `.agents/agents.json` / `.agents/local.json` — `@agents-dev/cli`'s own scaffold (MCP server sync across tools + skill materialization). Regenerate/extend via the `agents` CLI (`agents doctor`, `agents sync --check`), not by hand, except for the hooks block manually appended to `.codex/config.toml` (that tool has no native hooks support in `@agents-dev/cli`).

Do not duplicate shared rules across agent-specific configuration files unless required by that tool.
