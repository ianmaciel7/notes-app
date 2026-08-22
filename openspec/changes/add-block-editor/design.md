## Context

The merged object lifecycle stores Page and Atomic note bodies in `DocumentEntity.body` and Quote bodies in `QuoteEntity.body` as strings. Their shared workspace surface still uses a textarea, while the authenticated Capacities reference exposes a semantic document area with block commands, selection tools, top-level insertion/reordering, and read-only rendering. The change crosses the entity model, browser-storage schema, localized client UI, import/export boundaries, tests, and reference evidence.

The implementation must stay inside a narrow client boundary in Next.js 16/React 19, keep titles and metadata outside the document, and avoid leaking an editor vendor into the Notes App domain API.

## Goals / Non-Goals

**Goals:**

- Own a validated, versioned JSON document contract independent of rendered HTML and Tiptap types.
- Provide a structured editor for Page, Atomic note, and Quote with the first-slice block/mark set and keyboard workflows.
- Preserve Markdown as a validated interchange format and provide Markdown-style input shortcuts without storing Markdown strings as canonical content.
- Migrate version 1 text bodies losslessly enough to preserve paragraphs and empty lines, then persist only version 2 documents.
- Reuse local Button, ToggleGroup, DropdownMenu, Popover, Command, and shared floating styles.
- Match confirmed reference measurements and explicitly label screenshot-only values as approximations.
- Render an accessible semantic document with no mutation affordances when `editable` is false.

**Non-Goals:**

- Collaboration, backend sync, media blocks, editor tables, arbitrary nesting, comments, or AI.
- A raw Markdown source mode, arbitrary embedded HTML, unsupported GFM tables, or storing Markdown instead of the versioned block document.
- Converting Task, URL, Table notes, titles, tags, collections, or query descriptions into block documents.
- Tiptap UI templates, paid/Pro services, collaboration packages, or vendor-hosted features.

## Decisions

### Tiptap 3.30.2 behind a Notes App-owned boundary

Use exact version `3.30.2` for `@tiptap/core`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-list`, `@tiptap/extension-bubble-menu`, `@tiptap/extension-drag-handle-react`, `@tiptap/suggestion`, and `@tiptap/markdown`; pin `@floating-ui/dom` to `1.8.0`. Tiptap is MIT, supports React 19, documents its Next.js client boundary, and leaves markup, menus, and styling under application control. The editor hook will set `immediatelyRender: false`.

Plate 53.3.7 is MIT and compatible but requires a broader plugin stack for this slice. BlockNote 0.54.0 provides more ready-made UX, but its MPL-2.0 license and shadcn adapter constraints add overlapping UI dependencies and no-portal assumptions. These remain documented alternatives, not installed dependencies.

### Public document and component contracts are vendor-neutral

Create a neutral `editor/` module that exports `BlockEditorDocument`, `BlockEditorProps`, `createEmptyBlockDocument`, validation, normalization, plain-text conversion, and text extraction. Public types contain no Tiptap names. `workspace-content.tsx` passes only domain documents and callbacks into the editor component.

`BlockEditorDocument` has `schemaVersion: 1` and a `doc` root. Validation uses an explicit allowlist of nodes, marks, and attributes; unknown values are rejected rather than silently preserved. Rendered HTML is never stored.

### Schema and supported content

Allow doc, paragraph, heading levels 1-3, text, bullet list, ordered list, list item, task list, task item with a boolean checked attribute, blockquote, hard break where required by the editor schema, and code block. Allow bold, italic, inline code, and link marks with validated application-owned attributes. Normalization produces a valid non-empty doc without expanding the allowlist.

### Markdown is a validated interchange contract

Use the official `@tiptap/markdown` parser/serializer behind Notes App-owned `blockDocumentFromMarkdown` and `blockDocumentToMarkdown` APIs. Markdown input and paste support SHALL cover only allowlisted content: `#` through `###` headings, paragraphs, `**bold**`, `_italic_`, inline backticks, validated links, bullet and ordered lists, task lists, blockquotes, fenced code blocks, and hard breaks. Parsed JSON is normalized and validated before it enters workspace state; unknown nodes, unsafe link attributes, raw HTML, and unsupported GFM constructs are rejected or retained as literal safe text according to the documented converter contract. Version 1 migration remains a plain-text migration so existing literal text is not reinterpreted unexpectedly. `.md` import uses the Markdown parser and export uses the serializer.

The official Markdown extension is currently beta, so application-owned validation and round-trip fixtures are the acceptance authority. JSON remains canonical storage; Markdown is never persisted in place of `BlockEditorDocument`.

### Controlled update loop

Internal editor updates emit validated JSON through `onChange`. External `value` changes compare normalized documents with the current editor JSON and call `setContent(value, { emitUpdate: false })` only when different. This prevents persistence-driven echo loops and selection loss.

### Menus and block handles use shared application primitives

The slash menu uses `@tiptap/suggestion`, local Command rows, and shared floating/search-row classes. It supports filtering, arrows, Enter, Escape, an empty state, and focus restoration. The selection toolbar uses the headless BubbleMenu extension but renders only local Button, ToggleGroup, DropdownMenu, and Popover components; link editing preserves selection.

The drag handle is restricted to top-level blocks with `nested: false`. Its insertion button opens the same command catalog, and the grip reorders top-level blocks. Touch/mobile hides drag affordances while retaining keyboard and menu creation/transformation.

### Storage version 2 and migration

Raise the workspace snapshot version to 2. Parsing version 1 converts each affected plain-text body into paragraph nodes split on line boundaries and retains empty lines as empty paragraphs. Version 2 parsing validates every block document before hydration. Invalid or future snapshots keep the deterministic seed and existing non-blocking recovery flow.

Rollback restores the pre-change application and clears or ignores version 2 local state; the old application must not attempt to reinterpret version 2 JSON as strings.

### Reference-derived layout

Keep the editor in the current canvas/card geometry and retain title, type, and metadata outside the document. Confirmed values are a `68ch` text measure, `11pt` body, `1.7` line height, headings `1.8/1.5/1.25em`, link-color selection at 25%, an `18x22px` handle, `16px` gutter, and `100ms` transition. Values supported only by screenshots will be recorded as approximations in evidence rather than claimed as parity.

## Risks / Trade-offs

- **Schema drift between domain validation and Tiptap extensions** -> Centralize the allowlist, derive editor configuration from the same supported set where practical, and add invalid-node/mark/attribute contract tests.
- **Controlled updates reset selection or recurse** -> Compare normalized JSON and suppress update emission for external `setContent` calls.
- **SSR hydration mismatch** -> Keep the component client-only, set `immediatelyRender: false`, and render no server-derived editor instance.
- **Drag behavior is brittle on touch and nested lists** -> Limit drag to top-level blocks, hide the affordance on touch, and keep command/keyboard alternatives.
- **Version 1 line splitting cannot reconstruct rich intent** -> Preserve text and empty lines deterministically; do not infer Markdown or formatting.
- **Vendor packages leak into workspace code** -> Restrict all Tiptap imports and extension setup to `editor/` implementation files and enforce a source contract test.

## Migration Plan

1. Add exact dependencies and vendor-boundary contract tests.
2. Implement domain document types, validation, normalization, and text conversion with unit tests.
3. Add version 2 storage parsing/serialization, version 1 migration, and Markdown conversion tests before changing entity body types.
4. Implement the client editor, commands, menus, top-level handles, read-only renderer, and shared styles.
5. Integrate Page, Atomic note, and Quote while preserving every simple field and import/export contract.
6. Validate desktop/mobile keyboard, persistence, migration, accessibility, reduced motion, overflow, console output, and reference measurements.
7. Sync specs, strictly validate, archive, regenerate canonical Graphify artifacts, run `pnpm verify`, and publish through the protected squash-merge flow.

## Open Questions

- None for the first slice; media, collaboration, Markdown, arbitrary nesting, comments, AI, and editor tables remain explicit follow-up work.
