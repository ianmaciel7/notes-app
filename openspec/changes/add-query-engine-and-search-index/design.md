## Context

Capacities documents Object Type, Search, Tag, and Variable Queries with typed filters, sorting, grouping, limits, object/block result kinds, contextual variables, and additional result-selection behaviors. Search spans titles/aliases and richer content modes. Private semantic ranking/embeddings are not specified and are not parity requirements.

## Goals / Non-Goals

**Goals:** serializable QueryDefinition AST, deterministic typed evaluation, explicit query source families, backlink-aware filters, variable/context queries, deterministic/randomized result selection where configured, and rebuildable local indexes.

**Non-Goals:** reproducing private semantic ranking or implementing P6 layout rendering.

## Decisions

- QueryDefinition is canonical; human text may compile into it but cannot define persisted semantics implicitly.
- Query source/kind explicitly distinguishes Object Type, Search, Tag, and Variable query semantics where behavior differs.
- Operators are type-directed; backlinks/relations are explicit filter operands rather than hidden side effects.
- Sort/group/limit are ordered declarative clauses. Optional randomized selection uses an explicit mode/seed policy suitable for deterministic tests instead of accidental array shuffling.
- Search indexes are derived/rebuildable from canonical objects, aliases, properties, links, and stable blocks.
- Variable queries resolve against an explicit host object/context and expose unresolved state when context is absent.

## Risks / Trade-offs

- Complex filters require normalization, short-circuiting, and performance budgets.
- Schema changes can invalidate saved queries -> preserve explicit invalid state, never silently change meaning.
- Random result behavior can make tests flaky -> inject deterministic seed/source during tests.

## Migration Plan

1. Define AST, query kinds, operators, backlinks/relations operands, selection/sort/group/limit, validation, and evaluator.
2. Migrate current simple QueryEntity state where equivalent.
3. Add title/alias/full-text indexes with incremental updates.
4. Add query-builder/search UI and contextual variables.
5. Add performance/browser acceptance before P6 consumes the engine.

## Open Questions

None for planning.
