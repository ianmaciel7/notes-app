---
name: save
description: Decide where a piece of information belongs and save it there. Use when the user says "save this", "record this", "remember this", "document this", "where should this go", or after a decision, finding, rule, plan or term surfaces that should outlive the conversation. Routes to the right repo document, rule, skill, tracker file, or agent memory instead of creating a new file by default.
---

# Save

Route information to its single correct home, then write it there. Do not
invent a new file when an existing source of truth covers the topic.

## Process

1. **Name the item.** One sentence: what is being saved and who will need it.
2. **Skip if derivable.** Do not save what code, `git log`, or library docs
   (Context7) already answer. If asked anyway, ask what is non-obvious and save
   that.
3. **Pick the home** with the table below. First match wins.
4. **Look for an existing entry** (`Grep` the topic in the target). Update it;
   never duplicate across files. Link instead of copying.
5. **State the destination in one line**, then write. Ask only when two homes
   are genuinely plausible and the choice changes the content.
6. **Verify** (see Checks). Do not commit unless asked.

## Routing table

| The information is... | Save to | Notes |
| --- | --- | --- |
| A hard-to-reverse architecture decision, with trade-offs | `docs/adr/NNNN-<slug>.md` | Next free number; follow `docs/adr/README.md` status rule; add to its index. Use `/domain-modeling` for the ADR shape. |
| How the system is built today | `ARCHITECTURE.md` | Never describe planned work as implemented. |
| Planned data model | `DER.md` | |
| A domain term or definition | `GLOSSARY.md` | Use `/domain-modeling` to challenge fuzzy terms first. |
| Coding policy or style | `CODING_STANDARDS.md` | Naming rules go in `.agents/rules/naming.md`. |
| Test strategy, hook or CI split | `TESTING.md` | Agent-facing test rule: `.agents/rules/test.md`. |
| Security policy | `SECURITY.md` | |
| A hard constraint (protected path, forbidden API, "never do X") | The owning document from this table first, then a one-line entry in `CONSTRAINTS.md` | `CONSTRAINTS.md` is an index that links to the owner; never make it the only home of a rule. |
| Tool, script, hook, MCP server, CI job, skill added or changed | `TOOLING.md` | Keep the matching section and snapshot date current. |
| A workaround for a tool, hook or environment failure (error code, env var, permission fix) | `TOOLING.md`, next to the tool or hook it affects | Every agent hits the same failure. Only the machine-specific value (a local path) may also go in Claude auto-memory. |
| Product behavior (exam-study platform) | `docs/product-specs/<slug>.md` | Copy `template.md`. |
| Multi-step delivery plan | `docs/exec-plans/active/<slug>.md` | Copy `template.md`; move to `completed/` when done. |
| Feature spec, ticket, or triage state | `.scratch/<feature>/spec.md`, `.scratch/<feature>/issues/NN-<slug>.md` | Format in `docs/agents/issue-tracker.md`; use `/to-spec`, `/to-tickets`, `/triage`. |
| Engineering workflow change | `docs/guides/workflows.md` | |
| Guard (Biome/GritQL) coverage | `docs/guards/*-GUARD-COVERAGE.md` | |
| A code rule a tool could check | See "Prose or enforcement?" below | Enforce first, document second. |
| A rule every agent must follow, long or topic-scoped | `.agents/rules/<topic>.md` | Then `agents sync`. |
| A rule every agent must follow, short and core | `AGENTS.md` | Never edit `CLAUDE.md`; it only imports `AGENTS.md`. |
| A reusable multi-step procedure | `.agents/skills/<name>/SKILL.md` | See "Saving through a skill" below, `/skill-guide`, `/writing-for-agents`. Local skills are not in `skills-lock.json`. |
| Research findings with sources | File produced by `/research` | |
| Where the current session stands, for a new session or tool | `/handoff` file | Portable and temporary, not a source of truth. |
| User preference, working style, or feedback to Claude | Claude auto-memory (`memory/` directory in the Claude project folder, plus its `MEMORY.md` index) | Claude-only: never the only home of a fact other agents also need. One fact per file, typed `user`, `feedback`, `project` or `reference`; add a one-line pointer to `MEMORY.md`; update an existing memory instead of adding a duplicate. If other tools need it too, use `.agents/rules/` instead. |
| An external pointer (dashboard, ticket, doc URL) or a non-obvious project constraint | Claude auto-memory, type `reference` or `project` | Only if the repo does not already record it. |
| A new or changed MCP server | `.agents/agents.json`, then `agents sync` | Machine-specific or private overrides go in `.agents/local.json`. Update `TOOLING.md` section 8.2. |
| An automated behavior ("whenever X, do Y") | A hook in `.claude/settings.json` | Claude-only. `.agents/agents.json` has no hooks. `.claude/settings.local.json` is git-ignored and machine-specific. Husky hooks are for git events. |
| How to set up, run or contribute to the project | `README.md` or `CONTRIBUTING.md` | |
| Config for the engineering skills (issue tracker, triage labels, domain docs) | `docs/agents/*.md` | |
| A decision that replaces an earlier ADR | New ADR, and mark the old one `Superseded` | Update the `docs/adr/README.md` index. |
| Symbol or code-navigation notes for local work | Serena memory (`.serena/memories/`) | Git-ignored and machine-local; never the only copy of a project fact. |
| Anything generated (`graphify-out/`, `.agents/generated/`, `.mcp.json`, `.codex/`, `.cursor/`, `.gemini/`) | Do not hand-edit | Change the source, then `agents sync` or rebuild. |
| A secret, token, or credential | Nowhere in the repo | Use local env files that stay git-ignored; rotate if leaked. |

## Prose or enforcement?

Before writing a rule into a document, ask whether a tool can enforce it. A
mechanical mistake becomes a deterministic check; a judgement call becomes
prose in `CODING_STANDARDS.md` (what `/code-review` enforces).

| The rule is... | Enforce with | Then document in |
| --- | --- | --- |
| A syntactic pattern to forbid or require in code | GritQL plugin in `grit/nextjs/` or `grit/shadcn/`, registered in `biome.json` `plugins` | `docs/guards/*-GUARD-COVERAGE.md` |
| Already enforced by Next.js, TypeScript, React Compiler or Biome natively | Nothing new; do not duplicate with GritQL | Guard coverage doc, if the owner is missing |
| An import or layering boundary | `.dependency-cruiser.cjs` | `ARCHITECTURE.md` |
| Unused files, exports or dependencies | `knip.json` | |
| Duplication, complexity or size budget | `.jscpd.json`, `.fallowrc.json`, `.size-limit.json` | |
| A legitimate word flagged by the spell check | `cspell.json` `words` | |
| Behavior that must not regress | A Vitest test (Playwright for flows) | `TESTING.md` if the strategy changes |
| A commit or push check | `.husky/` hook, commitlint, lint-staged | `TOOLING.md` section 5 |
| A CI-only check | `.github/workflows/ci.yml` (ask first) | `TOOLING.md` section 6 |
| A judgement call no tool can check | Prose in `CODING_STANDARDS.md` or `.agents/rules/` | |

Never weaken a check or add a suppression to make something pass; that is not
"saving" anything.

## Saving through a skill

A skill is the right home when the information is a **procedure someone will
run again**: ordered steps, commands, and the traps found the first time. It is
read by every tool that loads `.agents/skills/`, and it is committed, so it
survives machines and sessions.

| If it is... | It belongs in | Not in |
| --- | --- | --- |
| Steps to repeat (a git recovery, a release, a migration, a debugging loop) | A skill | A memory or Serena note |
| A fact or rule ("X is forbidden", "this table means Y") | The owning document (see the routing table) | A skill |
| A preference about how the user works with Claude | Claude auto-memory | A skill |
| Where a symbol lives or how modules connect | Nowhere; query Serena or graphify again | Any file |

To save through a skill:

1. Grep `.agents/skills/` for an existing skill on the topic and extend it
   instead of adding a near-duplicate.
2. Create `.agents/skills/<name>/SKILL.md` with `name` matching the directory
   and a `description` that states exactly when to trigger it. Write it in
   English (`.agents/rules/language.md`) and keep it narrow, with one outcome.
3. Record the destructive or irreversible steps and the confirmation they need;
   include the verification command for each step.
4. Add the name to the list in `TOOLING.md` section 8.3, then run
   `pnpm run verify:agents` (and `agents sync` if rules changed).
5. Do not copy the same steps into a memory; link to the skill instead.

## What the code-intelligence tools are for

- **graphify** (`graphify-out/`) and **Serena** (`.serena/`) are read tools.
  Query them (`graphify explain|path|query`, Serena `find_symbol`) to find
  where something already lives before choosing a home.
- `graphify-out/` is generated and git-ignored: never save facts there. After
  large structural changes, rebuild it with `/graphify`.
- Use them to decide *where* something lives, never as the place to keep it. The
  when-to-use table is in `TOOLING.md` section 8.4.
- Serena memories are machine-local scratch notes. Anything other people or
  other tools need goes to a committed file.

## Hard constraints

`CONSTRAINTS.md` indexes the repository's hard constraints. Read it before
choosing a home, and update it when a saved item adds, changes, or removes one.

- **Single home.** One fact lives in one place; everything else links to it.
- **English only** for repo artifacts (`.agents/rules/language.md`), whatever
  language the user wrote in.
- **Read-only paths:** `src/components/firebase/**`, `.worktrees/**`,
  third-party skills (tracked in `skills-lock.json`; manage with `npx skills`).
- **Do not change** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
  (including `audit.ignore`), `renovate.json`, `.github/workflows/**`, or gate
  configs just to record something; ask first.
- **Library and framework facts** are not saved; fetch them again with
  Context7 when needed.
- **Planned versus current:** label planned items as planned, and verify the
  source tree before recording something as implemented.
- **Multi-tool consistency:** this repo syncs Claude, Codex, Gemini, Antigravity
  and others. Prefer a location every tool reads (`AGENTS.md`, `.agents/`)
  over a Claude-only one when the item affects shared behavior.

## Checks after writing

- Markdown changed: `pnpm run lint:md` and `pnpm run lint:spelling`.
- `.agents/` rules or skills changed: `agents sync`, then `pnpm run verify:agents`.
- Behavior, tooling, or policy changed: confirm the matching source-of-truth
  document in `AGENTS.md` ("Documentation sources of truth") is updated too.
- A constraint was added, changed, or removed: confirm `CONSTRAINTS.md` still
  matches its owning document.

## Report

Reply in one or two lines: what was saved, the path, and anything left
unsaved on purpose (with the reason).
