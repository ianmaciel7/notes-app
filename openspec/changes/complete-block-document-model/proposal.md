## Why

Future block references, backlinks, embeds, and exact block patches require stable block identity. Editing, formatting, or reordering an existing logical block must not change its identity.

## What Changes

- Add stable ids to referenceable persisted blocks and validate uniqueness.
- Preserve ids through edit/reorder/undo while allocating new ids for new, duplicated, or external pasted blocks.
- Add neutral block lookup selectors and migrate existing BlockEditorDocument records.

## Capabilities

### New Capabilities

- `domain/block-document-model`: Stable referenceable block identity, lookup, migration, and editor invariants.

### Modified Capabilities

- None.

## Impact

- Priority: **P3**.
- Depends on completion of the active `add-block-editor` contract.
- Changes block-document schema/migration and editor normalization but does not yet add backlinks or transclusion.
