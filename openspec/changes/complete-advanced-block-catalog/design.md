## Context

The current document boundary is Notes App-owned and already supports stable block IDs, headings, lists, tasks, quotes, code, links, and object/block references. The next schema version must preserve that boundary while adding advanced behavior documented in the reference.

## Schema

The new neutral node/attribute families are:

- text interfaces: `toggle`, optional `emoji`, existing hierarchy/list/quote/task combinations;
- `highlightBlock`: source metadata, quote content, optional note, color;
- `codeBlock`: language, code, rendering mode with Mermaid option;
- `mathBlock`: TeX source and display mode;
- `columnLayout`: width, layout mode, ordered columns with child blocks;
- `groupBlock`: width, appearance, child blocks;
- `objectBlock`: target ID and view kind, with media display variant where supported.

Table nodes are explicitly excluded and arrive through `add-table-block-editor`.

## Migration

`schemaVersion: 3` migration is pure and idempotent. Existing v2 nodes preserve IDs and semantics. Unknown advanced nodes from future versions fail validation into a safe read-only unsupported representation rather than being deleted. Markdown/export records lossiness for layouts and interactive embeds.

## Rendering and Editing

Editable and read-only renderers consume the same neutral nodes. Toggle state is presentation state unless explicitly persisted by the document contract. Mermaid is rendered from sanitized source without executable HTML. Invalid Mermaid or TeX preserves editable source and exposes an error fallback. Transclusion routes edits to the canonical target and detects recursive embeds.

Columns collapse to a linear accessible order at constrained widths and in reduced-capability export. Group and column operations are block transactions preserving child IDs and selection.

## Security

- No raw HTML execution from Mermaid, code, math, highlights, or embeds.
- Recursive/cyclic object or block embeds are bounded and reported.
- External media uses existing safe URL and storage policies.
- Clipboard import validates size, node depth, and supported attributes.

## Testing

Contract tests cover migration, validation, serialization, identity, undo/redo, copy/paste, export lossiness, rendering, keyboard/drag operations, responsive order, accessibility, recursion, invalid source, performance, and persistence.
