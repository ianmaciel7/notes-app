## Context

The editor already persists structured documents, but stable ids are required for durable references. Primary references: `https://docs.capacities.io/reference/blocks`, `https://developers.capacities.io/api/concepts/blocks`, and `https://developers.capacities.io/api/concepts/markdown`.

The reference material documents external block semantics, not the private editor framework or storage schema. Notes App therefore keeps a vendor-neutral BlockEditorDocument and clean-room id policy.

## Goals / Non-Goals

**Goals:** stable addressable blocks, vendor-neutral lookup, safe migration, deterministic duplicate/paste behavior.

**Non-Goals:** backlinks, embeds/transclusion, CRDT/OT, or claims about Capacities' editor library.

## Decisions

- Referenceable nodes carry stable ids in the neutral document schema.
- Marks, node conversion, reorder, and ordinary edits preserve identity; duplication/external paste allocates new identity.
- `blockId -> entity/path` indexes are derived and rebuildable.
- Markdown remains a reduced interchange format and does not leak internal ids by default.

## Risks / Trade-offs

- Editor transforms can accidentally clone ids; command-level invariant tests are required.
- Migration touches every structured document, so content equivalence and id stability must be proven.

## Migration Plan

1. Version the document schema and add BlockId validation/generation.
2. Migrate existing documents deterministically.
3. Update editor commands, paste, duplicate, split/merge, and drag behavior.
4. Add lookup selectors and browser acceptance.

## Open Questions

None for planning.
