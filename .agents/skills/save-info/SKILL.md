---
name: save-info
description: Decide when, where, and how to persist new information so it is not lost to context compaction — rules, docs, ADRs, memories, execution plans, AGENTS.md, CONTEXT.md, or a new skill. Use when the user says "save this", "remember this", "never do X again", "always do Y", "document this", or corrects your approach; when a decision, domain term, constraint, or gotcha is resolved that future work depends on; or before creating a skill. Read the owner docs first; create a skill last.
metadata:
  short-description: Route new knowledge to its single canonical owner
---

# Save Info

Conversation memory does not survive compaction. Anything non-trivial that future work depends on must be written to disk, in **exactly one canonical owner**, after reading that owner. Ownership boundaries are canonical in `.agents/skills/context-manager/SKILL.md`; do not restate them elsewhere.

## Order of operations

1. **Decide** whether the information should be saved at all.
2. **Read** the candidate owner doc(s) and search for an existing statement.
3. **Choose** one destination from the table below.
4. **Write** the full fact there, and only a pointer anywhere else.
5. **Sync and verify** what you touched.
6. **Skill last:** create a skill only after steps 1–3 show that no doc, rule, or memory can hold it.

Never skip step 2. Writing before reading is how duplicates, contradictions, and wrong-owner rules get created.

## 1. When to save

Save when any of these happen:

- The user corrects your approach or states a standing rule ("never…", "always…", "save this").
- A decision, constraint, or gotcha is resolved that future sessions would otherwise rediscover.
- A domain term is approved, renamed, or ruled out.
- A repeatable procedure with a clear trigger emerges.
- Multi-session work needs its state kept.

Do **not** save:

- Anything derivable from the code, `package.json`, config, or git history.
- Ephemeral task detail that only matters to this conversation.
- Secrets, tokens, or credentials.
- Absolute machine paths; use repo-relative paths (`.agents/rules/path-portability.md`).
- A fact its owner already states. Update it in place, or do nothing.

## 2. Read before writing

- Read the candidate owner in full, or the relevant section of a long one.
- Search for an existing statement first: `rtk rg -n "<key term>" --glob '!node_modules' --glob '!graphify-out'`.
- If the subject fits no owner cleanly, read the ownership table in `context-manager` before deciding.
- Read the format and guidance files when the destination has one:
  - `.agents/skills/domain-modeling/CONTEXT-FORMAT.md`
  - `.agents/skills/domain-modeling/ADR-FORMAT.md`
  - `docs/exec-plans/template.md`
  - `docs/agents/issue-tracker.md` and `docs/agents/domain.md`

## 3. Where to save

Pick by the **subject** of the fact, not by where you happen to be working.

| Subject | Destination | How |
| --- | --- | --- |
| Domain term, definition, or forbidden synonym | `CONTEXT.md` (or `src/<context>/CONTEXT.md` in multi-context) | Glossary only, no implementation detail. One or two sentences plus `_Avoid_`. Follow `domain-modeling` and `docs/agents/domain.md`. |
| Product goal, non-goal, success criterion | `INTENT.md` | Keep it concise. Detailed requirements, invariants, and phases go in `docs/product-specs/` under their stable IDs. |
| Module boundary, layering, data flow | `ARCHITECTURE.md` | Intent lives here. Machine enforcement lives in `.dependency-cruiser.cjs`. |
| Hard-to-reverse, surprising, real trade-off | `docs/adr/NNNN-slug.md` (or `src/<context>/docs/adr/` in multi-context) | Only if all three hold. Next number is highest existing plus one. Follow `ADR-FORMAT.md`. Flag conflicts with existing ADRs. |
| Agent skills setup (issue tracker, domain docs, triage) | `docs/agents/*.md` (`issue-tracker.md`, `domain.md`, `triage-labels.md`) | Follow `setup-matt-pocock-skills`. Route one-line pointer under `## Agent skills` in `AGENTS.md`. |
| Feature ticket, task, or tracer bullet | Configured issue tracker (GitHub Issues via `gh` CLI, or `.scratch/<feature>/issues/<ticket>.md`) | Follow `to-tickets` and `docs/agents/issue-tracker.md`. Always declare blocking edges (native issue dependencies or `Blocked by` lines). |
| Feature spec synthesized from discussion | Issue tracker issue (per `to-spec`) or `docs/product-specs/` | Follow `to-spec` template (Problem, Solution, User Stories, Implementation/Testing Decisions). Trim ephemeral code. |
| Throwaway prototype, spike, or exploratory UI/state | `prototype/<name>` git branch off `main` | Primary source kept on branch. Link gist and branch from ticket/spec. Follow `/prototype`. |
| Portable session or phase handoff | `.scratch/<feature>/handoff.md` (or task path) | Portable markdown summary between phases/sessions. Follow `/handoff`. |
| Code-writing rule (naming, file shape, patterns) | `CONVENTIONS.md` | Tool-owned rules stay with the tool config. |
| UI tokens, visual or interaction rules | `DESIGN.md` | Frontmatter tokens are normative. |
| Verification strategy, test commands | `TESTING.md` | |
| Security posture, secrets, validation | `SECURITY.md` | |
| Blocking floor or measurable threshold | `CONSTRAINTS.md` | Needs a real checker. Never lower a floor to pass. Exceptions need owner, reason, expiry. |
| Human setup, branch, commit, PR workflow | `CONTRIBUTING.md` / `README.md` | README gets only basic start commands. |
| Always-on agent invariant or enforcement rule | `.agents/rules/<topic>.md` | Plus one routing line in `AGENTS.md`. |
| Which doc, tool, or skill to route to | `AGENTS.md` | Routing only. Edit outside any tool-generated block. Stay under its size budget. |
| Tool catalog, capabilities & tool decision flows | `TOOLING.md` | Comprehensive inventory of project tools, scripts, guards, and MCP servers. |
| Tool configuration & machine-enforced rules | Tool config files (e.g. `.dependency-cruiser.cjs`, `biome.json`, `tsconfig.json`) | Enforced directly by tools; explain intent in owner doc (`ARCHITECTURE.md`, `CONVENTIONS.md`, `TESTING.md`). |
| Multi-session task state | `docs/exec-plans/active/<name>.md` | Copy `template.md`. Deferred debt goes in `tech-debt-tracker.md`. |
| Operational directive for all coding agents | `.serena/memories/<topic>/<name>.md` | Use Serena `write_memory`. Git-tracked. |
| MCP servers, integrations, targets | `.agents/agents.json` | Use the `agents` CLI (`agents-dev-cli`). |
| Personal preference or Claude-only feedback | Claude auto-memory | Not visible to Codex, Gemini, or Antigravity. |
| Repeatable procedure with a trigger | `.agents/skills/<name>/SKILL.md` | Last resort. See section 6. |

Prefer a repo-owned destination whenever the fact applies to more than one agent or tool. This repo runs Claude, Codex, Gemini, and Antigravity together, so a rule kept only in one tool's private memory is invisible to the rest.

## 4. How to write

- Full rule in the owner only. Elsewhere, a short pointer.
- Ground every claim in the repo. State missing capabilities plainly; do not invent content.
- For rules and feedback, record **why** and **how to apply**, not only the rule.
- Never edit inside a tool-generated block (for example the Next.js block in `AGENTS.md`).
- Keep `AGENTS.md` routing-oriented; move any procedure to its owning skill or doc.
- Name files by function, never by consuming tool (no `claude-` prefix).

## 5. Sync and verify

Run only what you touched, each prefixed with `rtk`:

| Touched | Run |
| --- | --- |
| Any control doc, `AGENTS.md`, or `docs/agents/` | `rtk pnpm run check:docs` |
| `.agents/` skills, agents, or `agents.json` | `rtk node scripts/run-agents-cli.mjs sync`, then `rtk pnpm run check:agents` |
| Scripts | `rtk pnpm run check:lint`, `rtk pnpm run test:guards` |
| Anything | `rtk pnpm run check:floor` |

Report the result in one line: what was saved, to which path, and why that owner.

## 6. Create a skill last

Create a skill only when **all** of these hold:

1. You already completed steps 1–3 and read the owner docs.
2. The information is a **procedure** (trigger plus steps), not a fact a doc or rule could hold.
3. It will repeat, and it has a clear trigger.
4. No existing skill in `.agents/skills/` covers it. Extend that one instead.

Then:

1. Read `.agents/skills/skill-guide/SKILL.md` and, for non-trivial skills, `skill-creator`.
2. Create `.agents/skills/<name>/SKILL.md`. The directory name matches the kebab-case `name`; name it by function.
3. Write frontmatter `name` and a `description` that says exactly when to use it. Keep the body concise and put large references in separate files.
4. Run `rtk agents sync` and `rtk pnpm run check:agents`.
5. Add a row to the `AGENTS.md` skill-routing table if it should be routed.
6. Follow the `skills-lock.json` rule in `context-manager`. `AGENTS.md` treats the lock as controlled configuration, so do not refresh remote skills without the user's explicit request.

## Verification

- [ ] The owner was read, and the fact was not already stated.
- [ ] Exactly one destination holds the full rule.
- [ ] No secrets, absolute paths, or edits inside generated blocks.
- [ ] The relevant checks passed, or blockers are reported.
- [ ] A skill was created only as a last resort.
