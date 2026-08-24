## Context

Capacities distinguishes tags, labels, collections, and Object Select/entity relations. Tags are identities/objects, labels are Structure-owned options, collections are manual groupings, and Object Select can constrain targets and cardinality. Documented linked-property behavior also allows an explicitly paired inverse property for supported custom-object relationships.

The archive is UI/source evidence only; private relationship storage is not inferred.

## Goals / Non-Goals

**Goals:** stable ids, rename-safe membership, single/multiple/fixed-set Object Select constraints, optional paired two-way linked properties, reverse indexes, and guarded deletion.

**Non-Goals:** block references, backlinks UI, query AST, graph rendering, or treating derived backlinks as editable relation properties.

## Decisions

- Identity is independent from mutable display names.
- Tags and label options remain distinct concepts.
- Collections belong to one Structure and objects can belong to multiple collections through stable ids.
- Object Select definitions explicitly model target Structures, cardinality, optional fixed candidate sets, and optional `inversePropertyDefinitionId` for validated two-way linked properties.
- Two-way linked properties commit both sides atomically and prevent recursive double writes.
- Derived backlinks are not persisted as the inverse side of Object Select unless the schema explicitly declares a paired property.
- Reverse indexes are derived/rebuildable from canonical values.

## Risks / Trade-offs

- Legacy strings can collide -> deterministic migration/collision recovery.
- Paired relation updates can recurse -> one transactional command owns both sides.
- Deleting a property/object can orphan its inverse -> guarded unlink/migration policy.

## Migration Plan

1. Create canonical tag/collection registries and relation helpers.
2. Extend Object Select constraints with cardinality/fixed-set/inverse metadata.
3. Migrate legacy string memberships to stable ids.
4. Replace UI string comparisons with id selectors and add paired relation controls.
5. Add guarded rename/delete/unlink and reverse-index tests.

## Open Questions

None for planning.
