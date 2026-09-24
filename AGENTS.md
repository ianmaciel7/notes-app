<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Scope and precedence

This file applies to the whole repository unless a nearer `AGENTS.md` exists.
Nested `AGENTS.md` files inherit these rules and should contain only local additions
or overrides; the nearest file wins on conflict. Explicit user instructions take
precedence over repository guidance.

Do not edit tool-generated instruction blocks. Treat marked generated regions as
read-only ground truth and place project-authored guidance outside them.

## Instruction budget

Keep the root `AGENTS.md` short, high-signal, and routing-oriented:

- Target: no more than 12,000 characters.
- Soft ceiling: 16,000 UTF-8 bytes; exceeding it requires splitting content.
- Leave headroom for nested agent instructions and tool-generated blocks.
- Move task-specific procedures to Skills, dedicated control docs, or nested
  `AGENTS.md` files instead of duplicating them here.
- Prefer precise pointers and triggers over copied manuals.

## Project contract

Treat the repository as the source of truth. Inspect files and run tools rather than
assuming a command, path, dependency, or behavior exists.

Before writing code, read `CONSTRAINTS.md`. It owns the project's non-negotiable
quality floor. Do not weaken a threshold, delete or soften a test, add a suppression,
disable a hook, or create an exception merely to make a task pass.

### Documentation ownership

Each rule or fact MUST have exactly one canonical owner. Other documents may point
to that owner, but MUST NOT restate or independently redefine the same rule.

| Context / question | Canonical owner |
| --- | --- |
| What is the project and how does a human start it? | `README.md` |
| Why does the product exist; what is in/out of scope? | `INTENT.md` |
| What domain terms and concepts mean | `CONTEXT.md` |
| How the system is structured and where boundaries live | `ARCHITECTURE.md` |
| How code is written | `CONVENTIONS.md` |
| How the UI should look and behave | `DESIGN.md` |
| How behavior is tested and verified | `TESTING.md` |
| How the system is protected | `SECURITY.md` |
| How humans contribute, commit, branch, and submit PRs | `CONTRIBUTING.md` |
| What quality floors may never regress | `CONSTRAINTS.md` |
| How agents navigate docs, tools, skills, scope, and completion | `AGENTS.md` |
| How RTK itself is used | `RTK.md` |
| Machine-readable agent/MCP/integration configuration | `.agents/agents.json` |
| How to execute a specialized agent workflow | matching `.agents/skills/*/SKILL.md` |
| Locked provenance/state of remote skills | `skills-lock.json` |

Detailed responsibility boundaries and explicit out-of-scope ownership are canonical
in `.agents/skills/context-manager/SKILL.md`. Read only the owner relevant to the
task; do not preload every document.

## Tool routing

Use the smallest specialized project-configured tool that directly answers the need.
When a specialized tool applies, do not replace it with a broader manual workflow
for convenience, familiarity, speed, or token savings.

| Need | Required/default route |
| --- | --- |
| File discovery or exact text search | `rg --files`, then `rg` |
| Codebase/architecture relationships | Graphify first when `graphify-out/graph.json` exists |
| Outline unfamiliar source files | `ast-grep outline` |
| Structural syntax search | `ast-grep` |
| Symbols, definitions, references, semantic edits | Serena |
| Local project commands | `rtk <command>` |
| MCPs, skills, integrations, profiles, generated agent config | `agents` CLI |
| Library/framework/SDK/API/CLI/cloud documentation | `context7-cli` skill / Context7 |
| Portable broad repository snapshot | Repomix with `repomix.config.json` |
| Reusable UI isolation/visual verification | Ladle |
| Focused local edits | `apply_patch` when available |

Configured MCP servers in `.agents/agents.json` are canonical. When the active agent
exposes a matching specialized MCP (Filesystem, Git, Fetch, Serena), use it instead
of inventing parallel configuration or a less direct workflow.

A required tool may be bypassed only when it is unavailable, broken, incompatible
with the operation, or under investigation. State the reason, use the narrowest
fallback, and preserve equivalent validation where possible.

## Skill routing

Project-local skills live under `.agents/skills/`. Inspect skill descriptions and
load the most specific applicable skill; do not load every vaguely related skill.
When a skill's documented trigger clearly matches the task, follow it rather than
silently substituting generic behavior.

Treat `.agents/skills/` and `skills-lock.json` as project-owned configuration:

- Do not refresh or replace remote skill content only because upstream is newer.
- Reinstall or refresh a remote skill only when explicitly requested.
- Do not add discovered remote skills unless explicitly requested and recorded.
- Creating, installing, removing, or updating a locked skill requires
  `rtk npx skills update -p -y` and verification of the resulting lock diff.

## Change workflow

### Before changing code

1. Inspect `git status --short`, the relevant files, `package.json`, and
   `CONSTRAINTS.md`.
2. Use the tool-routing rules above to narrow context before broad file reads.
3. Read only the control documents and skills relevant to the task.
4. Follow the generated Next.js instructions at the top of this file when Next.js
   behavior is in scope.
5. For third-party library or API behavior, route through the applicable documentation
   skill rather than duplicating its procedure here.

### While changing code

- Prefer existing project patterns and follow `CONVENTIONS.md` and, for UI,
  `DESIGN.md`; do not duplicate those detailed rules here.
- Use focused patches; do not rewrite whole files or use shell redirection merely
  to avoid a targeted edit.
- Never edit generated agent outputs directly. Change `.agents/agents.json` or the
  owning source and regenerate with `rtk agents sync`.
- Keep affected control documentation aligned with significant implementation
  changes instead of leaving documentation drift for a later task.

### Decision boundaries

Agents may inspect the repository, make requested local edits, run relevant local
checks, and fix failures caused by their own changes without asking for permission
at every step.

Do not perform destructive history rewrites, deployments, secret rotation, billing
changes, or other external side effects unless the user explicitly requests them.
Do not weaken quality or safety controls to avoid a failure.

## Verification routing

`CONSTRAINTS.md` owns blocking quality floors, `TESTING.md` owns test strategy and
verification procedures, and `CONTRIBUTING.md` owns the pre-PR checklist. Use the
smallest risk-appropriate checks required by those owners; do not duplicate their
command matrices here.

Quality controls remain non-bypassable. Do not use `--no-verify`, disable hooks,
lower thresholds, remove checks, delete/soften tests, or add suppressions merely to
obtain a pass.

## Definition of done

A task is complete only when:

- the requested change is implemented and scoped correctly;
- relevant tests/checks for the change have passed, or any blocker is reported;
- failures introduced by the change have been fixed;
- Graphify is refreshed after code changes when available;
- affected control documentation is synchronized;
- generated configuration was regenerated from its source when applicable;
- the final diff was reviewed for unintended changes and quality-floor regressions.

Correct code that bypasses required project tooling or validation is incomplete.

## Maintenance

Keep this file current and remove obsolete instructions. If a section becomes a
detailed manual, move that procedure to its owning Skill or control document and
leave a concise trigger/pointer here. Prefer nested `AGENTS.md` files for rules that
apply only to a specific subtree.

For RTK-specific details, see `RTK.md`. For documentation ownership and boundary
definitions, `.agents/skills/context-manager/SKILL.md` is canonical.
