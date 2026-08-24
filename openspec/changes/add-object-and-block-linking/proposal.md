## Why

A networked knowledge workspace requires durable links, backlinks, block references, embeds, and unlinked-mention workflows. Stable object identities and BlockIds are prerequisites so links do not depend on mutable titles or block positions.

## What Changes

- Add stable object links and block references resolved by canonical ids.
- Derive backlinks and a local contextual graph from forward references.
- Add object/block link pickers, embeds/transclusion, missing-target states, and explicit unlinked-mention conversion.

## Capabilities

### New Capabilities

- `domain/object-and-block-linking`: Stable object/block references, backlinks, transclusion, local graph edges, and unlinked mentions.

### Modified Capabilities

- None.

## Impact

- Priority: **P4**.
- Depends on `add-domain-identities-and-relations` and `complete-block-document-model`.
- Touches editor reference nodes, graph selectors, backlinks UI, search pickers, and deletion handling.
