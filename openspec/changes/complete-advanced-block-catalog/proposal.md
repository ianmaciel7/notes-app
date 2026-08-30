## Why

The canonical editor specification explicitly describes only a first-slice catalog. Current Capacities documentation includes toggle and emoji interfaces, highlight blocks, language-aware code with Mermaid, TeX math, multi-column/grid layouts, group blocks, and richer object block views. Without a dedicated neutral schema, adding these piecemeal would leak editor-library types and create unsafe migrations.

## What Changes

- Extend the Notes App-owned block document schema with toggle, emoji, highlight, math, layout, group, and advanced object/embed semantics.
- Add language-aware code blocks and Mermaid rendering with safe fallback.
- Add multi-column/grid and group layout operations with responsive and read-only behavior.
- Complete object block views for inline, small card, wide card, embed/transclusion, and supported media variants.
- Provide deterministic migration and downgrade/export behavior.
- Keep Table Block and formulas in dedicated dependent changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `domain/block-document-model`: Add versioned neutral advanced block nodes, attributes, validation, and migration.
- `ui/block-editor`: Add creation, editing, rendering, selection, layout, accessibility, and evidence for the advanced catalog.

## Impact

- Editor schema, extensions, renderers, commands, slash/plus catalogs, migrations, export, tests, and documentation.
- Depends on stable block identity and object/block linking.
