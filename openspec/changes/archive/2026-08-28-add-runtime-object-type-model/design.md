## Context

The current workspace has four competing object-type sources: `objectTypeDefinitions` for visual metadata, `ObjectTypeId` plus `creationFlowByType` for domain behavior, transient sidebar/controller rows, and object-type studio presets. Runtime custom types therefore disappear on reload and cannot be instantiated by the reducer. Documents and quotes already use `BlockEditorDocument` in snapshot v2, while active uncommitted `add-block-editor` work still owns shared editor, entity/storage, locale, and test files.

Current Capacities documentation identifies Object Types as Structures. Each object references a `structureId`; Structures own stable property definitions, singular/plural names, color, and collections. Built-in Structures use stable semantic ids while custom Structures use generated ids. The required primary WACZ/JSONL/completeness inputs are absent from this machine, so they cannot substantiate domain semantics; only the checked-in derived artifact may inform already-recorded visual states. Official product/API documentation is the normative source for this domain slice.

## Goals / Non-Goals

**Goals:**

- Establish one persistent runtime Structure registry as the source of truth for type identity, metadata, schema, lifecycle resolution, and UI projections.
- Separate built-in Structures from suggested custom presets without rewriting existing object content.
- Allow new custom Structure ids at runtime without editing a TypeScript union.
- Migrate v2 snapshots compatibly and preserve every existing `BlockEditorDocument` exactly.
- Define deterministic, testable lifecycle and deletion invariants before UI integration.

**Non-Goals:**

- Implement typed property values/renderers, tag and collection identity, backlinks, conversion, query expansion, or views.
- Refactor or extend the block editor.
- Copy Capacities account data or implement cloud/API/OAuth/MCP/AI services.
- Finish the remaining `align-workspace-with-current-capacities` UI tasks in this change.

## Decisions

### A neutral domain owner stores serializable Structure data

Add `src/lib/workspace-object-types.ts` as the neutral owner for `StructureId`, `WorkspaceStructure`, `PropertyDefinition`, lifecycle kinds, validation, built-in definitions, preset templates, and pure mutations. The icon registry remains a UI adapter from persisted `iconName` to a React component; React nodes and localized labels never enter snapshots.

Alternative: extend `object-icons.tsx` into the domain registry. Rejected because it is a client/UI module, mixes React components with data, and cannot be a persistence boundary.

### Structure ids become open strings while lifecycle behavior remains discriminated

Entity `objectTypeId` is retained as the reference field for compatibility but becomes a `StructureId` rather than a closed union. Specialized entity kinds remain discriminated, and each Structure carries a validated `lifecycleKind` (`document`, `quote`, `table`, `task`, `url`, `tag`, `query`, or `file`) that selects the current creation/editor family.

Alternative: immediately replace every specialized entity with a generic property map. Rejected because that belongs to the typed-property slice and would combine several high-risk migrations.

### Local built-in ids remain stable; presets become templates

Current local semantic ids for true built-ins remain stable so existing objects are not rewritten merely to mirror vendor API strings. A future platform adapter may map them to Capacities ids such as `RootPage`; platform parity is out of scope. Book, Person, Meeting, Project, and similar definitions move to immutable `ObjectTypePreset` templates. Confirming a preset clones its defaults into a new custom Structure with `crypto.randomUUID()`.

Existing objects with legacy preset ids are not silently converted. The v2 migration creates deterministic `legacy` custom Structures using those same ids, so references remain valid while all newly selected presets generate fresh ids.

Alternative: rewrite all existing preset ids during migration. Rejected because it creates unnecessary reference churn and risks data loss before relations are normalized.

### Property definitions are introduced before property values

`WorkspaceStructure.propertyDefinitions` stores ordered definitions with stable ids, name, supported public type, writability, multiplicity, label options, and entity target constraints. This slice persists and mutates the schema container only; existing ad hoc entity fields remain the value source until the next typed-property change.

Schema replacement validates ids and types atomically. Rename/delete/type-change policies that could invalidate future or existing values return explicit errors; no value coercion is attempted here.

Alternative: leave `propertyDefinitions` as an untyped record until the next slice. Rejected because the Structure would not yet be a real schema and downstream work would need another storage migration.

### Workspace state owns Structures and derives counts

`WorkspaceObjectState` gains an ordered `structures` array. Creation resolves the requested Structure and its lifecycle kind; counts remain derived from canonical entities by Structure id. Sidebar, studio, and palette consumers migrate to selectors over the same array rather than maintaining separate editable type rows.

Alternative: persist Structures in a second localStorage key. Rejected because two records would need transactional coordination and could hydrate incompatible versions.

### Snapshot v3 migrates v2 atomically

The existing storage key remains unchanged. Snapshot v3 adds `structures`; v2 parsing first validates every current entity and BlockEditorDocument, builds deterministic built-in/legacy Structures for every referenced id, then returns one complete v3 state. Serialization strips ephemeral file preview URLs as today. A failed Structure or entity validation rejects the whole snapshot and uses the existing recovery path.

Rollback retains a parser/fixture for v2 during the change. Reverting v3 code cannot consume newly written v3 data, so implementation must provide an explicit test-only downgrade/export helper or document that rollback requires clearing only the local derived workspace snapshot after user confirmation; it must never delete data automatically.

### Implementation waits for the block-editor ownership gate

No domain or UI implementation begins in the current dirty checkout. Apply starts only after `add-block-editor` commits or otherwise stabilizes its v2 entity/storage contract, followed by a fresh `git status`, scoped diff, and rebase/ownership audit. A dedicated worktree/branch is preferred because the slice touches `workspace-objects.ts`, storage, locales, and eventually `workspace-content.tsx`.

Alternative: edit the currently clean portions of shared files now. Rejected because ownership is architectural and the active change is expected to revisit those files.

## Risks / Trade-offs

- [Open Structure ids weaken compile-time exhaustiveness] → Keep entity `kind` and Structure `lifecycleKind` closed and validate their combinations at boundaries.
- [Legacy preset ids remain non-UUID] → Mark migrated definitions as `legacy`, preserve references, and require only newly created custom Structures to use generated ids.
- [Schema deletion could orphan future values] → Start with atomic replacement validation and block unsafe removal/type changes until the typed-property migration defines value handling.
- [Parallel migrations corrupt snapshots] → Serialize the work after `add-block-editor` v2 stabilizes and cover v1→v2→v3 plus direct v2→v3 fixtures.
- [UI registries drift during staged integration] → Add source tests forbidding fixed preset ids in the domain union and proving sidebar/studio/palette consume selectors before removing compatibility adapters.
- [Primary WACZ evidence is unavailable] → Mark WACZ-only functional claims UNKNOWN and base this domain contract on official current documentation and local source evidence.

## Migration Plan

1. Finish or isolate active `add-block-editor` work and record a clean ownership baseline.
2. Add the neutral Structure domain module, built-in registry, preset templates, validation, and pure lifecycle tests without changing UI.
3. Add Structures to workspace state and resolve creation through `lifecycleKind`, retaining compatibility adapters for existing callers.
4. Implement and test atomic snapshot v3 migration, including preservation of v2 block documents and legacy preset ids.
5. Migrate object-type studio, sidebar, palette, chips, and counts to canonical selectors; then remove parallel mutable registries.
6. Add browser coverage for custom type creation, two instances, rename/appearance propagation, reload, and guarded deletion.
7. Run focused tests, TypeScript, lint/format check, Playwright, production build, strict OpenSpec validation, and HTTP checks before checking tasks complete.

## Open Questions

None for this slice. Full property-value migration, relation identity, conversion policy, and presentation configuration behavior remain explicitly deferred to their ordered changes.
