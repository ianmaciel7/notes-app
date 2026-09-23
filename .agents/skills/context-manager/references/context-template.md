# CONTEXT.md Template

## Document Purpose
Unlike `AGENTS.md`, there is no formal external spec for a file named `CONTEXT.md` — it's an informal but real community convention (see e.g. the GitHub Discussions thread ["Context is King"](https://github.com/orgs/community/discussions/191257)). In practice it's a **codebase briefing doc for AI agents**: the structural, domain, and operational facts an assistant would otherwise have to re-derive every session by reading migrations, routes, and config from scratch. Default to the full briefing structure below.

**Narrower variant**: some repos intentionally scope `CONTEXT.md` down to just a ubiquitous-language glossary (term → definition → rejected synonyms), leaving repo layout/domain model/commands to `ARCHITECTURE.md`/`AGENTS.md` instead. That's a legitimate, deliberate choice — not a broken or incomplete `CONTEXT.md`. When auditing an existing repo, treat whichever variant is already in place as source of truth; don't flag a glossary-only `CONTEXT.md` as "missing sections" just because it doesn't match the fuller template. Only recommend expanding it if the user asks or if the glossary-only version is clearly a stub no one has revisited.

---

## Canonical Structure (full "codebase briefing" variant — the default when starting fresh)

```markdown
# [Project Name]

[One-sentence description, matching INTENT.md's framing.]

## Project Overview
[Tech stack and purpose, ideally as a table — what this is, in terms an agent can act on immediately.]

## Repository Layout
[An annotated directory tree — structural landmarks, not every file, each with a one-line purpose.]

## Domain Model
[Entities, primary keys, foreign-key relationships, cascade rules — an ASCII ER diagram if it helps. Saves the assistant from parsing every migration file to infer this.]

## API Surface
[Route prefixes, HTTP methods, response/error conventions — if the project has one.]

## Architectural Patterns & Conventions
[Where business logic lives, data access patterns, error handling, naming conventions — "route handlers are thin controllers that delegate to repositories" is the kind of sentence that belongs here.]

## Build, Run, and Test Commands
[Exact commands, not descriptions — enough for an agent to validate its own work.]

## Environment Variables
[Config options, defaults, what each one does.]

## Testing Strategy
[Tools, file locations, mocking approach, fixture patterns.]

## Known Gaps and Constraints
[Intentional limitations or missing infrastructure — "no auth layer yet," "this dependency is pinned old on purpose." Explicit "never use Y because of Z" beats positive guidance: agents already know common patterns, they don't know your specific constraints.]
```

## Canonical Structure (narrower "glossary" variant — valid when a repo deliberately scopes CONTEXT.md this way)

```markdown
# [Project Name]

[One-sentence description of what this repository is, matching INTENT.md's framing.]

## Language

**[Term]**:
[One or two sentences defining the term precisely, grounded in how it's actually used in the code — reference the file/module/component that embodies it where useful.]
_Avoid_: [Synonym 1, Synonym 2, Synonym 3 — terms an agent or contributor might reach for instead, that should NOT be used]
```

Each entry should be a term that actually appears (or should appear) in code, comments, commit messages, or PR discussion — not generic industry jargon. If a term isn't grounded in the repo, it doesn't belong here yet.

---

## Governance Rules

1. **Ground Every Section/Term in Code**:
   Whichever variant is in use, every claim must trace to something real — a migration, a route file, a component. A glossary entry or "domain model" fact with no corresponding code is a proposal, not documentation — flag it as such.
2. **Known Gaps Beat Silence**:
   For the full variant, explicit negative constraints ("never use Y because of Z", "no auth layer yet") carry more signal than positive descriptions, since agents already know common patterns but not your specific exceptions.
3. **`_Avoid_` Lists Prevent Drift** (glossary variant):
   The rejected-synonyms list stops a future PR (human or agent) from introducing a second name for the same concept. Keep it specific to terms actually used or likely to be reached for.
4. **Cross-Document Coherence**:
   Don't duplicate what `ARCHITECTURE.md` or `AGENTS.md` already own — if this repo has both a full `ARCHITECTURE.md` and a full-variant `CONTEXT.md`, reconcile which one is authoritative for topology/commands rather than maintaining two competing copies.
5. **Repository Location**:
   Placed at the repository root as `CONTEXT.md`.
