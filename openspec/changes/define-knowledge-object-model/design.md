## Context

Objects are not files. Every object has stable identity, type, properties, content, collections, relationships, authorization, and revisions.

## Decisions

### Use typed objects as the unit of knowledge

The model should support built-in and custom object types without degrading everything into generic pages.

### Validate mutations before durability

Creation, updates, moves, archive, restore, delete, duplicate, import, export, and share operations need authorization and revision semantics before commit.

### Version object type schemas

Changing a type schema is a domain migration, not a cosmetic preference. Existing object data must be previewed, mapped, preserved, or explicitly converted before a schema version becomes active.

## Risks / Trade-offs

- A too-generic model loses type-specific behavior.
- A too-rigid model blocks custom object types.
- Silent schema migration can corrupt user knowledge and exports.
