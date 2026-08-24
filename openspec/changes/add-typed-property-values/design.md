## Context

The current Structure model already declares property definitions, while objects still store ad hoc family fields. The reference sources document typed properties as Structure-owned schema and object values keyed by stable definitions. Primary references: `https://docs.capacities.io/reference/properties`, `https://developers.capacities.io/api/concepts/properties`, and `https://developers.capacities.io/api/concepts/structures`.

The project WACZ/JSONL audit was re-confirmed on 2026-08-24: captured response payloads are recoverable, but request bodies, private headers, some WARC resources, and private backend details are not complete. This design therefore reproduces supported external semantics without claiming Capacities' private storage implementation.

## Goals / Non-Goals

**Goals:** canonical typed values, custom-Structure round trips, atomic migration, and generic fields.

**Non-Goals:** tag/collection identity, backlinks, query engine, cloud sync, API, and AI.

## Decisions

- `propertyValues` keyed by property-definition id is the canonical value store; definitions remain Structure-owned.
- Values use a closed discriminated union and enforce type, multiplicity, label options, entity targets, and writability.
- Created/updated timestamps are system-owned; generic editors cannot forge them.
- Existing specialized fields may survive temporarily only as explicit compatibility adapters during migration.

## Risks / Trade-offs

- Unsafe schema changes can orphan data; destructive definition edits stay blocked until a migration policy exists.
- The migration touches every entity family; fixtures must prove ids, blocks, Structures, and visible values are preserved.

## Migration Plan

1. Add value types, validators, and tests.
2. Raise the snapshot version and migrate every existing entity family deterministically.
3. Move runtime custom Structures to generic property accessors first, then built-ins.
4. Remove compatibility reads only after round-trip and browser evidence passes.

## Open Questions

None for planning.
