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
- One rule or fact has one canonical owner. Other files may route to it but MUST NOT
  restate or independently redefine it.
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

The complete ownership/boundary map is canonical in
`.agents/skills/context-manager/SKILL.md`.

## Tool routing

Use the smallest specialized project-configured tool that fits the task. Do not
replace it with a broader manual workflow for convenience, familiarity, speed, or
token savings.

| Need | Route |
| --- | --- |
| File discovery / exact text | `rg --files`, then `rg` |
| Cross-file architecture / dependencies | Graphify when its graph exists |
| Unfamiliar source outline | `ast-grep outline` |
| Structural syntax | `ast-grep` |
| Symbols / references / semantic edits | Serena |
| Local project commands | RTK; details in `RTK.md` |
| MCPs / integrations / agent config | `agents` CLI; source is `.agents/agents.json` |
| Current library / API documentation | matching documentation skill / Context7 |
| Broad portable repository snapshot | Repomix with `repomix.config.json` |
| Reusable UI isolation | Ladle |
| Focused local edit | `apply_patch` when available |

When the active agent exposes a matching configured MCP, use it rather than creating
parallel configuration. A required tool may be bypassed only when unavailable,
broken, incompatible, or under investigation; state the reason and use the narrowest
fallback.

## Skill routing

Project skills live under `.agents/skills/`. Load the most specific skill whose
documented trigger matches the task; do not preload vaguely related skills.

Treat project-owned skills and `skills-lock.json` as controlled configuration.
Do not add, refresh, replace, or remove remote skills unless explicitly requested.
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
- When an execution plan is active, update its progress and decision log as material
  facts change; move it to `docs/exec-plans/completed/` only after verification.

## Decision boundaries

Agents may inspect the repository, make requested local edits, run relevant local
checks, and fix failures introduced by their own changes without repeated approval.

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

## Maintenance

Remove obsolete instructions instead of accumulating them. Move detailed procedures
to their owning Skill/doc and leave only routing here. Prefer nested `AGENTS.md`
files for subtree-specific rules.
