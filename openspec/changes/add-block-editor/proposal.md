## Why

Page, Atomic note, and Quote bodies are currently persisted and edited as plain strings, so they cannot provide the structured authoring, keyboard workflows, or semantic read-only rendering expected from the Notes App document surface. The object lifecycle foundation is now merged, making this the right point to introduce a versioned block document without expanding Task, URL, Table, or metadata controls.

## What Changes

- Add a Notes App-owned block-editor API and client-side editing surface for Page, Atomic note, and Quote bodies.
- Support paragraphs, H1-H3, bold, italic, inline code, links, bullet and ordered lists, task lists, blockquotes, code blocks, undo/redo, slash commands, selection tools, and top-level block insertion/reordering.
- Support Capacities-style Markdown input shortcuts plus validated bidirectional Markdown import/export for every supported node and mark while keeping structured JSON canonical.
- **BREAKING** Change `DocumentEntity.body` and `QuoteEntity.body` from plain strings to validated `BlockEditorDocument` JSON.
- **BREAKING** Raise the persisted workspace snapshot to version 2 and migrate version 1 text bodies to structured paragraphs while rejecting unknown document content.
- Preserve simple controls for Task and URL bodies, Table notes, titles, tags, collections, and query descriptions.
- Add localized copy, accessibility behavior, contract tests, storage migration coverage, and desktop/mobile browser evidence.

## Capabilities

### New Capabilities

- `ui/block-editor`: Structured block document contracts, editing and read-only behavior, commands, menus, accessibility, and persistence boundaries.

### Modified Capabilities

- `ui/object-lifecycle`: Persist, hydrate, migrate, import, and update structured bodies for Page, Atomic note, and Quote while preserving the remaining simple fields.

## Impact

- Adds Tiptap 3.30.2 packages, including `@tiptap/markdown`, and `@floating-ui/dom` 1.8.0 as exactly pinned runtime dependencies.
- Adds a neutral `editor/` module and integrates it through the shared document workspace without exposing Tiptap names in public Notes App APIs.
- Updates workspace entity types, snapshot parsing/serialization, import/export behavior, translations, tests, browser evidence, OpenSpec contracts, and canonical Graphify artifacts.
- Does not add collaboration, backend synchronization, media blocks, editor tables, arbitrary nesting, comments, AI, arbitrary HTML passthrough, or a raw Markdown source-mode editor.
