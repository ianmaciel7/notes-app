## 1. Ownership and evidence gate

- [x] 1.1 Confirm `add-block-editor` has committed or otherwise stabilized its v2 entity/storage migration, then record `git status`, scoped diffs, branch ownership, and a conflict-free file boundary before implementation.
- [x] 1.2 Record the current official Structures, Properties, Objects, and Object Types documentation URLs plus the unavailable WACZ/JSONL/completeness inputs; keep unsupported corpus claims marked `UNKNOWN`.
- [x] 1.3 Add failing focused tests for canonical Structure identity, built-in/custom separation, runtime ids, preset cloning, guarded deletion, schema validation, and v2 migration invariants before domain implementation.

## 2. Runtime Structure domain

- [x] 2.1 Add a neutral `workspace-object-types` module with serializable `StructureId`, `WorkspaceStructure`, `PropertyDefinition`, lifecycle kind, icon name, tone, collection references, and reserved presentation types.
- [x] 2.2 Define and validate the true built-in Structure registry separately from immutable suggested custom-type preset templates and reserved system Structures.
- [x] 2.3 Implement pure create, rename, appearance-update, schema-replace, and guarded-delete operations with explicit domain errors and no partial mutation.
- [x] 2.4 Implement preset instantiation so repeated use creates independent custom Structures with generated ids while existing legacy preset ids remain supported only through migration definitions.

## 3. Workspace state and creation lifecycle

- [x] 3.1 Add canonical Structures to `WorkspaceObjectState` and replace the closed `ObjectTypeId` domain union with validated Structure references while retaining specialized entity-kind exhaustiveness.
- [x] 3.2 Resolve entity creation through the referenced Structure's lifecycle kind, rejecting unknown or incompatible Structure ids without changing entities, selection, tabs, or counts.
- [x] 3.3 Keep counts derived exactly once from canonical entities by Structure id and add selectors for built-in, custom, creatable, reserved, and preset projections.
- [x] 3.4 Preserve compatibility adapters only where required by existing callers, with source tests preventing new fixed preset ids or parallel mutable registries.

## 4. Snapshot v3 migration

- [x] 4.1 Extend the existing workspace snapshot with canonical Structures without changing the storage key or persisting React components, localized labels, or ephemeral file preview URLs.
- [x] 4.2 Implement atomic v2-to-v3 migration that injects deterministic built-in and legacy Structures while preserving entity ids, active selection, next id, specialized fields, and every `BlockEditorDocument`.
- [x] 4.3 Validate v3 Structures and object references as one record, rejecting invalid or future data through the existing non-destructive recovery state without partial hydration.
- [x] 4.4 Add round-trip and migration fixtures covering built-ins, legacy preset objects, runtime custom Structures, multiple instances, property definitions, unknown references, and block-document byte-equivalent content.

## 5. UI integration

- [x] 5.1 Make the object-type studio create canonical custom Structures from presets and custom input instead of appending transient visual rows.
- [x] 5.2 Derive sidebar object-type rows, creation palette options, type chips, listing headings, icon/tone projections, and counts from canonical Structure selectors.
- [x] 5.3 Remove obsolete mutable object-type state and fixed preset domain registries only after all production consumers use the canonical Structure source.
- [x] 5.4 Move touched validation/status copy to every `next-intl` catalog and keep persisted Structure metadata locale-neutral.

## 6. Behavioral acceptance

- [x] 6.1 Add Playwright coverage that creates a custom Structure, creates two objects for it, writes content, selects/reopens projections, reloads, and proves Structure/object ids and counts do not duplicate.
- [ ] 6.2 Cover preset creation twice, rename and appearance propagation, unknown Structure rejection, guarded deletion, keyboard focus, Escape/outside-click where applicable, and zero console implementation errors.
- [ ] 6.3 Re-run the six existing shell viewports and interaction checks to prove the Structure integration does not regress the 224px sidebar, 46px rails, 10px gaps, 12px radii, tab/sidebar targets, overlays, reduced motion, or horizontal-overflow contract.

## 7. Verification and handoff

- [ ] 7.1 Run focused domain/storage/UI tests, TypeScript, lint/format check without rewriting unrelated files, relevant Playwright projects, production build, and route HTTP checks.
- [ ] 7.2 Run strict OpenSpec validation and a three-front source/browser/reference review; check off only tasks supported by current evidence.
- [ ] 7.3 Refresh Graphify only after material source changes and stage only the dedicated Structure/ObjectType change files, excluding pre-existing editor work and temporary artifacts.
- [ ] 7.4 Record deferred follow-up changes in checklist order: typed property values, block editor completion, tag/collection identity, links/backlinks, conversion, lifecycle components, and queries.
