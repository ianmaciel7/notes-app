## Context

Capacities documents Object Type, Search, Tag, and Variable Queries with typed filters, sort, group, limit, and object/block results, plus full-text and richer search modes. Primary references: `https://docs.capacities.io/reference/queries`, `https://docs.capacities.io/reference/search`, and `https://docs.capacities.io/reference/group-by`.

Private semantic ranking/embeddings are not specified by the archive or public docs and are not treated as parity requirements here.

## Goals / Non-Goals

**Goals:** serializable query AST, deterministic typed evaluation, variable/context queries, local title/full-text indexes, shared consumers.

**Non-Goals:** reproducing private semantic ranking or implementing all P6 view layouts.

## Decisions

- QueryDefinition is canonical; human text may compile into it but cannot define persisted meaning implicitly.
- Operators are type-directed and invalid combinations fail validation.
- Search indexes are derived/rebuildable from canonical objects, properties, and stable blocks.
- Variable queries resolve against an explicit host object/context and fail visibly when required context is absent.

## Risks / Trade-offs

- Complex filters need normalization, short-circuiting, and performance budgets.
- Schema changes can invalidate saved queries; invalid queries remain explicit rather than silently changing meaning.

## Migration Plan

1. Define AST, operators, validation, and evaluator.
2. Migrate current simple query filters where equivalent.
3. Add title/alias and full-text indexes with incremental updates.
4. Add query-builder/search UI and contextual variables.
5. Add performance/browser acceptance before P6 consumes the engine.

## Open Questions

None for planning.
