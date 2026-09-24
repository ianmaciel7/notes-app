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

Before writing code, read `CONSTRAINTS.md`. It is the quality floor: do not weaken a
threshold, delete or soften a test, add a suppression, disable a hook, or create an
exception merely to make a task pass.

Read other control docs only when their scope is relevant:

| Need | Read |
| --- | --- |
| Product purpose, non-goals, open questions | `INTENT.md` |
| Architecture, boundaries, data flow | `ARCHITECTURE.md` |
| Vocabulary and domain terms | `CONTEXT.md` |
| Coding and framework conventions | `CONVENTIONS.md` |
| UI system, tokens, primitives | `DESIGN.md` |
| Test strategy and quality checks | `TESTING.md` |
| Security-sensitive work | `SECURITY.md` |
| Branch, commit, and PR workflow | `CONTRIBUTING.md` |

Do not preload every document for every task.

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

### Tool-specific triggers

- **RTK**: prefix supported project shell commands with `rtk`. Direct execution is
  allowed only when RTK is unavailable, incompatible with the operation, changes
  required behavior, or is itself being diagnosed.
- **Graphify**: for codebase, dependency, ownership, architecture, or cross-file
  questions, start with `graphify query` when the graph exists. Use the Graphify
  skill for `path`/`explain` details. After code changes, run `graphify update .`
  when Graphify is available.
- **ast-grep**: prefer structural search when text matching can miss equivalent code
  shapes. Use the installed `ast-grep` and `ast-grep-outline` skills for procedure.
- **Serena**: use for symbol-aware retrieval and supported semantic edits; do not
  replace it with broad file scanning when the task is fundamentally about symbols.
- **Context7**: for current library/API behavior, resolve and query documentation
  before relying on model memory. Follow `.agents/skills/context7-cli/SKILL.md`;
  do not duplicate its full procedure here.
- **Agents CLI**: use `rtk agents status`/`doctor` for diagnosis, `rtk agents sync`
  after source configuration changes, and `rtk agents sync --check` for drift.
- **Repomix**: use only when broad portable context or an AI-review bundle is needed;
  do not use it for localized work that narrower tools can answer.
- **Ladle**: use for isolated verification of reusable UI when a relevant story exists
  or the change warrants one; compilation alone is not visual verification.

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
4. For Next.js work, read the applicable guide under `node_modules/next/dist/docs/`
   before relying on remembered APIs.
5. For third-party library or API behavior, use Context7 before implementation.

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

## Verification by risk

Run the smallest set that provides confidence for the change; do not run expensive
checks indiscriminately.

| Change | Minimum verification |
| --- | --- |
| Any source/config change | `rtk pnpm lint`, `rtk pnpm test`, `rtk pnpm check:types` |
| Dependency/import/module change | `rtk pnpm deps:check`, `rtk pnpm knip` |
| Testable logic/quality tooling | `rtk pnpm test:coverage`, `rtk pnpm run check:duplication`; mutation when confidence warrants it |
| Security-sensitive/dependency change | `rtk pnpm check:security`, `rtk pnpm check:osv` |
| UI/route/styling change | `rtk pnpm build`; Ladle and/or `rtk pnpm lighthouse` when visual, accessibility, or performance behavior is in scope |
| GitHub Actions change | `rtk pnpm lint:actions`; use `zizmor --offline .` for workflow security |
| Agent/MCP/skill source change | `rtk agents sync --check`; verify `skills-lock.json` for locked-skill changes |

For a broad task-end gate when the scope warrants it, use `rtk pnpm check:fast`,
`rtk pnpm check:security`, and `rtk pnpm check:osv`.

Husky and `lint-staged` are mandatory local safeguards. Do not use `--no-verify`,
disable hooks, lower thresholds, remove checks, or add suppressions merely to pass.

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

For RTK-specific details, see `RTK.md`.
