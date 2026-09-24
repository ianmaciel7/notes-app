# CONTEXT.md Template

## Document Purpose

`CONTEXT.md` owns the repository's **ubiquitous language**: domain terms, precise
definitions, relationships between concepts, and rejected synonyms. Structural
topology belongs to `ARCHITECTURE.md`; commands/tools belong to their operational
owners.

Keeping this file glossary-focused avoids turning it into a second architecture,
README, AGENTS, or testing document.

## Canonical Structure

```markdown
# [Project] Context

[One sentence explaining what vocabulary this file governs.]

## Language

**[Canonical Term]**
[Precise definition grounded in the product/domain or repository.]
_Avoid_: [Rejected synonym 1, rejected synonym 2]
```

## Governance Rules

1. Add only terms that materially improve shared language.
2. Ground definitions in real product/domain usage; proposals belong in `INTENT.md`.
3. Use `_Avoid_` to prevent competing names for the same concept.
4. A term may point to another owner for implementation details, but must not copy
   architecture, testing, commands, or code conventions.
5. When a domain term changes, update code/docs that use the old vocabulary in the
   same change.
