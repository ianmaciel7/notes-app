## Why

The workspace currently represents object types through four disconnected registries: a visual icon catalog, a closed TypeScript union, transient sidebar state, and studio presets. This prevents runtime custom types from acting as persistent schemas and makes the UI, creation lifecycle, and storage depend on hardcoded type cases instead of a canonical Structure model.

## What Changes

- Introduce a persistent runtime Structure/ObjectType aggregate with a stable id, built-in/custom ownership, singular and plural names, serializable icon/tone references, property-definition schema, collection references, lifecycle kind, and reserved presentation configuration.
- Make workspace objects reference a Structure by id while preserving their existing specialized entity payloads and block documents during this slice.
- Separate Capacities-style built-in structures from suggested presets; selecting Book, Person, Meeting, Project, and similar presets creates a real custom Structure with a generated id instead of extending a closed internal union.
- Persist Structures in a new compatible workspace snapshot version and migrate existing v2 snapshots by injecting deterministic legacy definitions without rewriting entity ids or block documents.
- Add pure Structure lifecycle operations for create, rename, appearance updates, schema replacement, and guarded deletion when instances exist.
- Derive the sidebar, studio, creation palette, lifecycle resolution, and counts from the canonical Structure registry in later integration tasks rather than maintaining parallel taxonomies.
- Keep typed property values, tag/collection identity migration, query engine expansion, backlinks, conversion, and editor changes out of this first slice.
- Preserve the active `add-block-editor` ownership boundary; implementation starts only after its entity/storage migration is stable or in a dedicated conflict-free worktree.

## Capabilities

### New Capabilities

- `domain/runtime-object-types`: Persistent Structure/ObjectType identity, schema ownership, built-in/custom separation, preset instantiation, lifecycle resolution, migration, and deletion invariants.

### Modified Capabilities

- `ui/object-lifecycle`: Object creation and custom-type studio flows resolve their lifecycle and projections from the canonical runtime Structure registry instead of a closed list of preset ids.

## Impact

- Affects workspace domain types and reducers, local snapshot parsing/serialization and migration, the object icon catalog boundary, object-type studio/sidebar projections, creation flows, locale catalogs, and focused unit/browser coverage.
- Changes the internal persisted snapshot from v2 to v3 with an explicit backward-compatible migration; the public storage key and existing entity ids/content remain unchanged.
- Does not add cloud services, API/OAuth/MCP/AI behavior, copy Capacities account data, or change the App Router boundary.
- Must be sequenced after or isolated from current uncommitted `add-block-editor` work in `workspace-content.tsx`, entity/storage owners, locale catalogs, and editor tests.
