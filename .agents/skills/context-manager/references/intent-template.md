# INTENT.md Template

## Document Purpose

`INTENT.md` owns product intent: the problem, desired outcome, affected users,
product boundaries, non-goals, success criteria, and unresolved product questions.
It answers **what and why**, not how the repository implements it.

Technical architecture belongs to `ARCHITECTURE.md`, security implementation to
`SECURITY.md`, quality thresholds to `CONSTRAINTS.md`, and code conventions to
`CONVENTIONS.md`.

## Canonical Structure

```markdown
# Intent: [Short product/initiative title]

**Author:** [Name / role]
**Status:** [Draft | Review | Approved]
**Last Updated:** [YYYY-MM-DD]

## Problem
[User/business problem. Avoid implementation framing.]

## Proposed Outcome
[Observable product outcome and success criteria.]

## Affected Users
[Who is impacted and in what context.]

## Product Boundaries
[Explicit in-scope behavior, non-goals, assumptions that must not be made.]

## Open Questions
- [ ] [Unresolved product decision requiring human input]
```

## Governance Rules

1. Do not turn installed dependencies, existing UI scaffolding, or implementation
   details into product requirements.
2. Once Approved, scope changes update this document before implementation proceeds.
3. Route implementation constraints to their canonical engineering owner rather than
   copying them here.
4. Keep unresolved decisions explicit instead of allowing code to answer them by
   accident.
