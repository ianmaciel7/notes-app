# AGENTS.md Template

## Document Purpose

`AGENTS.md` is a tool-agnostic repository onboarding and routing file for AI coding
agents. The open AGENTS.md convention describes it as a dedicated README for agents,
complementary to the human-facing `README.md`. It is plain Markdown with no required
schema, so optimize for clarity and repository-specific usefulness rather than
boilerplate.

Among the 11 control-document pillars governed by this skill, `AGENTS.md` should be
one of the shortest. Its job is to route an agent to the right tools, skills, docs,
commands, constraints, and verification path — not to duplicate their full manuals.

Frameworks or CLIs may inject marked generated blocks. Never edit inside those
regions. Preserve them verbatim and place project-authored guidance outside them.

## Scope and precedence

- A root `AGENTS.md` applies across the repository.
- A nearer nested `AGENTS.md` may add or override instructions for its subtree.
- Nested files should state only local differences instead of copying the root.
- The nearest applicable file wins on conflict; explicit user instructions take
  precedence over repository guidance.
- In a monorepo or large repository, prefer nested files for package- or
  directory-specific rules.

## Instruction-size budget

Keep the root file compact enough to leave room for generated and nested
instructions:

- Target: `<= 12,000` characters.
- Soft ceiling: `<= 16,000` UTF-8 bytes.
- Treat upstream agent discovery/context limits as ceilings, not size targets.
- If the root exceeds the target, move procedures to Skills, dedicated docs, or
  nested `AGENTS.md` files and leave concise triggers/pointers behind.
- Avoid restating content already canonical in `CONVENTIONS.md`, `TESTING.md`,
  `DESIGN.md`, `SECURITY.md`, `ARCHITECTURE.md`, or a `SKILL.md`.

These are project-quality recommendations, not requirements of the AGENTS.md open
format itself.

## Documentation ownership

Treat repository documentation as bounded contexts. Every rule or fact has exactly
one canonical owner; other files may route to it but must not restate it.

A project using the standard control-doc set should normally assign ownership like:

| Subject | Canonical owner |
| --- | --- |
| Human onboarding | `README.md` |
| Product intent and non-goals | `INTENT.md` |
| Domain vocabulary | `CONTEXT.md` |
| System structure and boundaries | `ARCHITECTURE.md` |
| Code-writing conventions | `CONVENTIONS.md` |
| UI/UX system | `DESIGN.md` |
| Test/verification strategy | `TESTING.md` |
| Security posture | `SECURITY.md` |
| Contribution/PR workflow | `CONTRIBUTING.md` |
| Non-regression quality floors | `CONSTRAINTS.md` |
| Agent routing, autonomy, precedence, completion | `AGENTS.md` |
| Specialized agent procedure | matching `SKILL.md` |
| Machine-readable agent configuration | `.agents/agents.json` |

If detailed responsibility boundaries are needed, keep them in the repository's
documentation-governance source (for this skill, `SKILL.md`) and keep the root
`AGENTS.md` to a compact subject-to-owner routing table.

## Canonical structure

Use only sections that materially help the repository. A strong root file usually
looks like this:

```markdown
# AGENTS.md

<!-- Preserve generated blocks verbatim. -->

## Scope and precedence
[Where this file applies, nested-file behavior, precedence.]

## Instruction budget
[Project size target and progressive-disclosure rule.]

## Project contract
[Non-negotiable invariants and links to relevant control documents.]

## Tool routing
[Need -> preferred/required tool. State triggers, not full manuals.]

## Skill routing
[How to select the most specific applicable project skill.]

## Change workflow
[Short before/while rules and safe autonomy boundaries.]

## Verification routing
[Point to the canonical quality/test/contribution owners; do not copy their command matrices.]

## Definition of done
[What must be true before the agent reports completion.]

## Maintenance
[Anti-drift and when to split content into skills/docs/nested files.]
```

Setup or PR sections may be added when they provide agent-specific information, but
prefer pointers to `README.md` and `CONTRIBUTING.md` when those documents are already
canonical.

## Governance rules

1. **Router, not encyclopedia**
   Keep always-on instructions to project invariants, routing, dangerous gotchas,
   and completion criteria. Put step-by-step procedures in their owning Skill or
   dedicated control document.

2. **Progressive disclosure**
   Tell the agent *when* to read a document or Skill. Do not require loading every
   project document or every vaguely related Skill before every task.

3. **One canonical owner per context**
   Treat documents as bounded contexts. A rule or fact belongs to exactly one owner.
   Other files may route to it or describe an interface with it, but must not restate
   or independently redefine it.

4. **Precise tool routing**
   Define which specialized tool should handle file search, code structure, symbols,
   documentation research, snapshots, UI verification, or agent configuration.
   Require the specialized tool when its trigger clearly applies, but document a
   narrow fallback for unavailable/broken tools.

5. **Selective skill loading**
   Skill descriptions should have narrow triggers. Load the most specific applicable
   Skill rather than every possibly related Skill. Do not silently ignore a Skill
   whose documented trigger clearly matches the task.

6. **Safe autonomy and decision boundaries**
   State what agents may do without confirmation (inspect, edit locally, run checks,
   fix failures they introduced) and which destructive or external side effects need
   explicit user intent.

7. **Verification routing**
   Keep detailed check matrices in their canonical quality/testing/contribution
   owners. AGENTS.md should route to them and require the smallest risk-appropriate
   set rather than copying commands into always-on context.

8. **Explicit definition of done**
   Completion should require the requested implementation, relevant green checks,
   remediation of introduced failures, synchronized docs/config, and review of the
   final diff. Do not let 'code compiles' be the only completion criterion.

9. **Quality controls are non-bypassable**
   Do not disable hooks, weaken thresholds, delete tests, add suppressions, or create
   exceptions merely to obtain a pass. If a required tool cannot run, report why and
   use the narrowest equivalent fallback.

10. **Generated blocks are read-only**
    Preserve marked framework/tool output exactly. Change the generator or owning
    source configuration instead of editing generated output.

11. **Nested files carry local differences**
    Put package-, component-, or subtree-specific instructions in a nearer
    `AGENTS.md` when they would otherwise bloat the root. Do not repeat inherited
    rules there.

12. **Maintain and prune**
    Remove obsolete instructions when the codebase changes. Review the file when
    tooling, package-manager commands, quality gates, or control-doc ownership
    changes. Shorter accurate guidance is better than accumulated stale guidance.

## Recommended routing pattern

A compact routing table is usually clearer than prose:

```markdown
| Need | Route |
| --- | --- |
| File names / exact text | project text-search tool |
| Cross-file architecture | project graph/architecture tool |
| Structural syntax | AST-aware search |
| Symbols/references | semantic code tool |
| Library/API docs | project documentation-retrieval Skill |
| UI isolation | component preview tool |
| Repository snapshot | configured snapshot tool |
```

The root file should state the trigger and ownership; the linked Skill should explain
the detailed procedure.

## Documentation-routing pattern

Do not say 'read all docs first'. Route by subject instead:

```markdown
| Need | Read |
| --- | --- |
| Architecture/boundaries | `ARCHITECTURE.md` |
| Coding conventions | `CONVENTIONS.md` |
| UI/design system | `DESIGN.md` |
| Testing | `TESTING.md` |
| Security | `SECURITY.md` |
| Contribution/PR process | `CONTRIBUTING.md` |
| Product scope | `INTENT.md` |
```

## Review checklist

Before finalizing an `AGENTS.md` change, verify:

- [ ] Generated blocks are byte-for-byte preserved.
- [ ] Root guidance is <= 12,000 characters when practical and never exceeds 16,000 UTF-8 bytes.
- [ ] No detailed procedure is duplicated from a Skill or control document.
- [ ] Nested scope/precedence is clear where nested files exist.
- [ ] Tool and Skill triggers are specific enough to avoid unnecessary loading.
- [ ] Commands cited by the file actually exist in the repository.
- [ ] Verification routes to canonical owners and avoids duplicated command matrices.
- [ ] Safe autonomy and destructive/external boundaries are explicit.
- [ ] Definition of done is concrete.
- [ ] Obsolete instructions were removed rather than merely appended around.

## Repository location

Place the main file at the repository root as `AGENTS.md`; add nested copies only
where local differences justify them. If another agent-specific file exists
(`CLAUDE.md`, tool-specific instructions, etc.), prefer importing or deferring to the
canonical `AGENTS.md` instead of maintaining divergent copies of the same guidance.
