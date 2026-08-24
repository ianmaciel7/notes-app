## Context

Capacities documentation distinguishes tags, labels, collections, and entity/object relations. Tags are identities/objects, labels are Structure-owned options, and collections are manual groupings. Primary references: `https://docs.capacities.io/reference/organizational-structures`, `https://docs.capacities.io/tutorials/tags-vs-collections`, and `https://developers.capacities.io/api/concepts/properties`.

The archived WACZ/JSONL corpus is treated as UI/source evidence only; private backend relationship storage is not specified and will not be guessed.

## Goals / Non-Goals

**Goals:** stable ids, rename-safe membership, validated entity relations, reverse indexes, guarded deletion.

**Non-Goals:** block references, backlinks UI, query AST, or graph rendering.

## Decisions

- Identity is independent from mutable display names.
- Tags and label options remain distinct concepts.
- Entity property values contain ordered target object ids; reverse relations are derived rather than independently editable.
- Referenced identities require an explicit unlink/migration policy before deletion.

## Risks / Trade-offs

- Legacy strings can collide by case/name; migration must surface collisions deterministically.
- Reverse indexes can drift if persisted independently, so they are rebuildable from canonical values.

## Migration Plan

1. Create canonical tag/collection registries and relation helpers.
2. Migrate string memberships to stable ids with collision handling.
3. Replace UI string comparisons with id selectors.
4. Add guarded rename/delete flows and reverse-index tests.

## Open Questions

None for planning.
