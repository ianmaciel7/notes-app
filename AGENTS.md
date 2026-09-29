<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Scope and precedence

This file applies repository-wide unless a nearer `AGENTS.md` exists. Nested files
inherit these rules and contain only local additions or overrides; the nearest file
wins on conflict. Explicit user instructions take precedence.

Preserve marked tool-generated blocks verbatim.

## Operating contract

- Treat the repository as ground truth; inspect before assuming.
- Keep this file routing-oriented. Target <= 12,000 characters; hard maximum
  16,000 UTF-8 bytes.
- Ownership rules (one fact, one canonical owner): `.agents/skills/context-manager/SKILL.md`.
- All documentation, specs, and execution plans MUST be written in English unless explicitly requested otherwise by the user (`CONTRIBUTING.md`).
- Do not weaken quality controls, tests, thresholds, hooks, or suppressions merely
  to make a task pass.

## Context routing

Read only the owner relevant to the task:

| Need | Canonical owner |
| --- | --- |
| Human setup and project entry point | `README.md` |
| Product scope, goals, non-goals | `INTENT.md` |
| Detailed product requirements, invariants, phases, decisions | `docs/product-specs/index.md` |
| Complex multi-step work state | `docs/exec-plans/README.md` |
| Domain language and concepts | `CONTEXT.md` |
| Architecture and boundaries | `ARCHITECTURE.md` |
| Code-writing rules | `CONVENTIONS.md` |
| UI/UX system | `DESIGN.md` |
| Testing and verification strategy | `TESTING.md` |
| Security posture | `SECURITY.md` |
| Blocking quality floors | `CONSTRAINTS.md` |
| Contribution, Git, and PR workflow | `CONTRIBUTING.md` |
| Tool catalog & capabilities | `TOOLING.md` |
| Search, discovery, and navigation hierarchy | `.agents/rules/search-and-discovery.md` |
| Lead Orchestrator & subagent execution | `.agents/rules/orchestration.md` |

The complete ownership/boundary map is canonical in
`.agents/skills/context-manager/SKILL.md`.

## Tool routing

Use the smallest specialized project-configured tool that fits the task. Do not
replace it with a broader manual workflow for convenience, familiarity, speed, or
token savings.

| Need | Route |
| --- | --- |
| **Any shell command** | **`rtk <command>`** — see `RTK.md`; direct execution is the fallback only under conditions documented there |
| File discovery / exact text | **Serena MCP** (`search_for_pattern`, `find_file`), Filesystem MCP, then `rtk rg` |
| Cross-file architecture / dependencies | **Graphify first** when `graphify-out/` exists; see `.agents/skills/graphify/skill.md` |
| Broad portable repository snapshot | **Repomix** with `repomix.config.json`; do not manually concatenate files |
| Unfamiliar source outline | `ast-grep outline` — structural map before reading full source |
| Structural AST pattern search | `ast-grep run` / `ast-grep scan`; see `.agents/skills/ast-grep/SKILL.md` |
| Symbols / references / rename / semantic edits | **Serena MCP** (`mcp-server-serena`); falls back to `rg` only when Serena is unavailable |
| Git operations | **git MCP** (`mcp-server-git`); falls back to `rtk git <command>` |
| File read / write via MCP | **filesystem MCP** (`@modelcontextprotocol/server-filesystem`) |
| HTTP fetch / web content | **fetch MCP** (`mcp-server-fetch`) |
| Lint / format / import organization | `rtk pnpm lint` (Biome); see `.agents/skills/biome/SKILL.md` |
| Add / search / update shadcn components | `rtk pnpm dlx shadcn@latest`; see `.agents/skills/shadcn/SKILL.md` |
| Module boundary / circular-dep check | `rtk pnpm run deps:check` (dependency-cruiser); see `.agents/skills/dependency-cruiser/SKILL.md` |
| Security / bug pattern scan | Semgrep; see `.agents/skills/semgrep/SKILL.md` |
| MCPs / integrations / agent config | `agents` CLI; source is `.agents/agents.json` |
| Current library / API documentation | Context7 (`ctx7 library` → `ctx7 docs`); see `.agents/skills/context7-cli/SKILL.md` |
| Reusable UI isolation / story preview | Ladle (`rtk pnpm ladle`); see `.agents/skills/ladle/SKILL.md` |
| Focused local edit | `apply_patch` when available |

### Command execution invariant

Detailed command, search, and tool invariants are canonical in `.agents/rules/command-invariants.md` and `.agents/rules/search-and-discovery.md`.

- **RTK**: Mandatory for all shell commands; exceptions and fallback conditions are documented in `RTK.md`.
- **Graphify**: `graphify-out/` MUST be queried before manually tracing cross-file architecture or call graphs (see `.agents/skills/graphify/skill.md`).
- **Repomix**: `repomix.config.json` MUST be used for broad repository snapshots.
- **Context7**: `ctx7 library` → `ctx7 docs` MUST be used before writing code against third-party library APIs (see `.agents/skills/context7-cli/SKILL.md`).

When the active agent exposes a matching configured MCP, use it rather than creating
parallel configuration. A required tool may be bypassed only when unavailable,
broken, incompatible, or under investigation; state the reason and use the narrowest
fallback.

## Skill routing

Project skills live under `.agents/skills/`. Load the most specific skill whose
documented trigger matches the task; do not preload vaguely related skills.
Before invoking or applying a skill, read its SKILL.md instructions. Never infer
skill behavior from its name alone.

| Trigger | Skill |
| --- | --- |
| Any codebase question; cross-file architecture when `graphify-out/` exists | `graphify` |
| Biome, lint, format, `biome check`, import sort, lint rule config | `biome` |
| shadcn component add / search / style / debug; `components.json` | `shadcn` |
| Search community shadcn registry items by keyword via Shoogle | `search-registry-items` |
| UI component story / Ladle dev / accessibility / visual preview | `ladle` |
| Module boundary violation; circular dependency; `dependency-cruiser` | `dependency-cruiser` |
| Security scan; bug pattern; Semgrep rule; "find vulnerabilities" | `semgrep` |
| Library API docs; unfamiliar SDK; version migration | `context7-cli` |
| AST structural search; pattern matching across files | `ast-grep` |
| Structural map of a file or directory before editing | `ast-grep-outline` |
| Control doc create / audit / sync (`README`, `AGENTS`, `DESIGN`, etc.) | `context-manager` |
| Verify all markdown docs are consistent: links, paths, commands, routing, `docs/` tree | `verify-docs` |
| React composition patterns; compound components; render props | `vercel-composition-patterns` |
| React / Next.js performance; bundle; data fetching | `vercel-react-best-practices` |
| RTK setup / troubleshoot; `RTK.md` integration | `rtk-cli` |
| MCP config/runtime issues; `agents` CLI | `mcp-troubleshooting` |
| Create / edit / eval a skill | `skill-creator` |
| Domain modeling; ubiquitous language; ADR | `domain-modeling` |
| Implement work from a spec or tickets | `implement` |
| Stress-test a plan interactively | `grilling` |
| Code review since a branch/commit | `code-review` |
| Broad repository snapshot; repomix packing; `repomix.config.json` | `repomix` |
| Unit and component testing; Vitest test runner; mocking; coverage | `vitest` |
| Atomic commits, clean commit separation, git branching, release tagging | `git-workflow-and-versioning` |
| Conventional commit messages, diff analysis, intelligent staging | `git-commit` |
| Save/persist a rule, decision, term, or procedure; "save this"; before creating a skill | `save-info` |
| Explore, compare, and extract prior art or contracts from historical worktrees (`.worktrees/old-*`) | `find-worktrees` |
| Guide through engineering skill workflows (idea to ship, triage, diagnosing, wayfinding) | `ask-matt` |
| Scaffold repo configuration for engineering skills (issue tracker, triage, domain docs) | `setup-matt-pocock-skills` |
| Manage multi-agent project configuration and MCP servers via `agents` CLI | `agents-dev-cli` |
| Gather official up-to-date documentation into a concise implementation checklist | `docs-research` |
| Scaffold a shadcn/Base UI component with story, test, and checks | `new-component` |
| Create, organize, and maintain agent skills under `.agents/skills` | `skill-guide` |
| Agent behavioral eval runs, report comparison, regression detection | `eval-harness` |
| Firebase Auth emulator, seeds, and auth test environment | `firebase-setup` |
| Consolidated health check for quality, tests, context, and token savings | `verify-health` |

Treat project-owned skills and `skills-lock.json` as controlled configuration.
Never edit remote skills authored by others or modify installed third-party skills directly.
Do not add, refresh, replace, or remove remote skills unless explicitly requested by the user.
Follow the applicable skill-management workflow for lifecycle and lock updates.

## Change workflow

Before changing code:

1. Inspect the working state and relevant files; read only task-relevant owners/skills.
2. For Next.js work, follow the generated Next.js instructions at the top of this file.
3. For third-party behavior, use the applicable documentation skill before relying on
   memory.

While changing code:

- Follow existing patterns and the canonical owner for the affected context.
- Prefer focused edits; do not edit generated outputs directly.
- Keep affected canonical documentation aligned with the implementation.
- When an execution plan is active, follow the lifecycle in `.agents/skills/implement/SKILL.md`.

## Decision boundaries

Agents may inspect the repository, make requested local edits, run relevant local
checks, and fix failures introduced by their own changes without repeated approval.

Never write hardcoded absolute machine paths into committed files, docs, or scripts.
Use repository-relative paths only (see `.agents/rules/path-portability.md`).

Destructive history rewrites, deployments, secret rotation, billing changes, and
other external side effects require explicit user intent.

## Verification routing

Use `CONSTRAINTS.md` for blocking floors, `TESTING.md` for verification strategy,
and `CONTRIBUTING.md` for pre-PR checks. Run the smallest risk-appropriate set.
Do not duplicate command matrices here.

Do not bypass hooks/checks with `--no-verify`, lowered thresholds, removed tests,
or new suppressions merely to obtain a pass.

## Definition of done

A task is complete when:

- the requested change is correctly scoped and implemented;
- relevant validation passed, or blockers are reported;
- failures introduced by the change are fixed;
- derived/generated artifacts affected by the change are refreshed from their owner;
- affected canonical documentation is synchronized;
- the final diff is reviewed for unintended changes and quality-floor regressions;
- broad or high-risk diffs receive a fresh independent review (human or separate
  agent) before handoff when that review is available and proportionate.

Correct code that bypasses required project tooling or validation is incomplete.

## Agent skills

### Issue tracker

GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context (`CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.

## Maintenance

Remove obsolete instructions instead of accumulating them. Move detailed procedures
to their owning Skill/doc and leave only routing here. Prefer nested `AGENTS.md`
files for subtree-specific rules.

@RTK.md
