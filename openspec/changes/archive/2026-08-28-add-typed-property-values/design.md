## Context

The current Structure model declares property definitions while object instances still persist family-specific fields. Official Capacities sources distinguish default/system properties from normal configurable properties and document title, aliases, description, icon, created/updated metadata, tags, text, cover image, number, checkbox, blocks/rich text, datetime, labels, and object selection semantics.

The project archive is used for observable UI/source evidence only; private storage details remain unknown.

## Goals / Non-Goals

**Goals:** canonical typed values, default-vs-normal metadata, custom-Structure round trips, schema-driven fields, and non-destructive value/schema migration.

**Non-Goals:** tag/collection identity, backlinks, query engine, cloud sync, API, AI, or bidirectional Object Select wiring (owned by P2).

## Decisions

- `propertyValues` keyed by property-definition id is the canonical configurable value store; definitions remain Structure-owned.
- Property definitions distinguish system/default metadata from normal configurable properties and carry stable id, name, optional description/icon metadata, value type, writability, multiplicity, and constraints.
- Title, aliases, description, icon/cover, created/updated timestamps, tags, and other system/default values have explicit ownership rules rather than being treated as arbitrary user-created fields.
- Values use a closed discriminated union and enforce type, multiplicity, label options, Object Select targets, and writability.
- Created/updated timestamps are system-owned and cannot be forged by generic editors.
- Property type changes that could lose information use an explicit conversion/migration plan; unsafe conversions SHALL preserve the source value/property until the user resolves or confirms the migration.
- Existing specialized entity fields may survive temporarily only as compatibility adapters during migration.

## Risks / Trade-offs

- System/default metadata can drift if duplicated into both entity fields and property maps -> define one canonical owner and temporary adapters only.
- Type conversion can lose information -> never silently coerce/destructively overwrite incompatible values.
- Migration touches every entity family -> fixtures must prove ids, blocks, Structures, and visible values are preserved.

## Migration Plan

1. Extend PropertyDefinition metadata and typed-value validation.
2. Define canonical ownership for default/system properties and compatibility adapters.
3. Raise the snapshot version and migrate every existing entity family atomically.
4. Add a safe property conversion planner before enabling destructive type/schema changes.
5. Move runtime custom Structures to generic property accessors first, then built-ins.
6. Remove compatibility reads only after round-trip/browser evidence passes.

## Open Questions

None for planning.
