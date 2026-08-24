## Context

The merged object lifecycle stores Page, Atomic note, and Quote bodies as structured documents behind a narrow client editor boundary. The authenticated reference exposes semantic blocks, block commands, selection tools, top-level insertion/reordering, and read-only rendering. The current public Capacities documentation also documents Heading 4 and a broader advanced-block catalog than this first slice.

The implementation must stay inside a narrow client boundary in Next.js/React, keep titles and metadata outside the document, and avoid leaking an editor vendor into the Notes App domain API.

## Goals / Non-Goals

**Goals:**

- Own a validated, versioned JSON document contract independent of rendered HTML and Tiptap types.
- Provide a structured editor for Page, Atomic note, and Quote with the first-slice block/mark set and keyboard workflows.
- Support headings H1-H4 in the first slice so the supported contract matches the documented heading range already accepted by the current neutral schema.
- Preserve Markdown as a validated interchange format and Markdown-style input shortcuts without storing Markdown strings as canonical content.
- Render an accessible semantic document with no mutation affordances when `editable` is false.

**Non-Goals:**

- Advanced Capacities-style blocks such as small text, toggles, highlight blocks, Mermaid/math, editor tables, multi-column/group blocks, media/object embeds, arbitrary nesting, comments, collaboration, or AI. These require a dedicated follow-up change after stable BlockIds/linking prerequisites.
- Raw Markdown source mode, arbitrary embedded HTML, or storing Markdown instead of the versioned block document.
- Converting Task, URL, Table notes, titles, tags, collections, or query descriptions into block documents.

## Decisions

### Vendor-neutral editor boundary

Use the pinned Tiptap packages only behind Notes App-owned editor APIs. Public domain types contain no Tiptap names. JSON remains canonical storage and Markdown remains interchange only.

### First-slice supported content

Allow doc, paragraph, heading levels 1-4, text, bullet list, ordered list, list item, task list, task item, blockquote, hard break, code block, and horizontal rule. Allow bold, italic, inline code, and validated link marks.

The broader documented Capacities block catalog is intentionally not absorbed into this change because block identity, object/block linking, transclusion, tables/media semantics, and advanced layout nodes have separate dependencies.

### Markdown interchange

Markdown input/import/export covers headings `#` through `####`, paragraphs, supported marks/links, lists, task lists, blockquotes, fenced code, horizontal rule where supported, and hard breaks. Parsed JSON must validate before entering workspace state.

### Controlled update loop and interaction surfaces

Internal updates emit validated JSON. External values use non-emitting synchronization only when structurally different. Slash menu, selection toolbar, and top-level handles reuse local primitives and preserve focus/selection. Touch layouts hide drag affordances while retaining command and keyboard alternatives.

### Persistence and evidence

The existing versioned workspace migration remains non-destructive. Reference measurements remain evidence-backed and screenshot-only values remain labeled approximations. The project WACZ/JSONL corpus is UI/source evidence, not proof of private editor/storage implementation.

## Risks / Trade-offs

- Schema drift between neutral validation and editor extensions -> one allowlist plus contract tests.
- Advanced blocks are deferred -> record them explicitly so this first slice is not misreported as complete Capacities block parity.
- Controlled updates can reset selection -> suppress recursive emission and compare normalized documents.

## Migration Plan

1. Keep exact dependency/vendor boundaries and validation tests.
2. Align neutral schema, Markdown conversion, slash catalog, and keyboard tests with H1-H4.
3. Complete read-only rendering, BubbleMenu/link editing, top-level insertion/drag, localization, accessibility, and reference checks.
4. Record advanced block types as a separate follow-up before claiming full block parity.
5. Sync/validate/archive only after the existing acceptance gates pass.

## Open Questions

None for this first slice.
