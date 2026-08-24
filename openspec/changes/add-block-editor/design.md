## Context

Page, Atomic note, and Quote already persist a Notes App-owned structured document behind a client-only Tiptap boundary. The reference exposes semantic blocks, selection tools, a two-part top-level block handle, insertion/reordering, and read-only rendering. The current public documentation also includes Heading 4 and a broader advanced-block catalog than this first slice.

The project archive is UI/source evidence, not proof of Capacities' private editor or storage implementation. The verified reference handle uses separate `18x22px` plus and grip controls: normal plus click inserts below, Shift-click inserts above, the grip drags, and grip click opens block options.

## Goals / Non-Goals

**Goals:**

- Keep a validated, versioned document contract independent of rendered HTML and Tiptap types.
- Support paragraph, H1-H4, first-slice marks/lists/quotes/code/horizontal rule, Markdown interchange, and keyboard behavior.
- Preserve selection through formatting and link editing.
- Match the confirmed two-part desktop block-handle interaction while retaining non-drag creation on touch/mobile.
- Render semantic read-only content without mutation affordances.
- Keep input responsive by avoiding React state updates and extension reconfiguration on every editor transaction.

**Non-Goals:**

- Small text, toggles, highlights, Mermaid/math, editor tables, multi-column/group blocks, media/object embeds, comments, collaboration, or AI. These remain a separate follow-up after stable BlockIds/linking.
- Claims about Capacities' private framework, protocol, or persistence format.

## Decisions

### Vendor-neutral document and editor boundary

Tiptap remains internal. Public editor props use only `BlockEditorDocument`, localized labels, editability, and application callbacks. JSON remains canonical; Markdown is interchange only.

### Exact first-slice content

Allow paragraph, heading levels 1-4, bullet/ordered/task lists, blockquote, code block, horizontal rule, hard break, bold, italic, inline code, and validated links. Unsupported content is rejected rather than silently coerced.

### Responsive controlled updates

`useEditor` explicitly disables transaction-wide React rerenders. Editor updates are buffered in refs and committed after a short delay, blur, or unmount; no React draft state is updated per keystroke. External documents are compared and applied with `emitUpdate: false` and invalid-content rejection.

The BubbleMenu uses `useEditorState` selectors for the small reactive formatting state and disables the default position/update debounce so selection controls appear immediately.

### Drag-handle integration for pinned Tiptap 3.30.2

The pinned React DragHandle wrapper registers `DragHandlePlugin` directly; it does not register the base DragHandle extension commands. Therefore `editor.commands.lockDragHandle()` and `unlockDragHandle()` are invalid in this integration. Menu locking uses the same transaction metadata consumed by the official plugin: `editor.commands.setMeta("lockDragHandle", boolean)`.

The plus control inserts an empty paragraph below on normal click and above on Shift-click. The grip remains the draggable surface and opens a local block-options menu on click. Nested content is not an independent drag target (`nested={false}`). Touch/coarse-pointer layouts do not mount the drag plugin and retain slash/keyboard creation.

### Selection and link preservation

Formatting controls capture the text range before focus moves into local menus/popovers, clamp it against the current document, restore it before commands, and extend an existing link mark when editing/removing a link.

### Evidence and acceptance

Source/contract tests guard the exact dependency versions, missing-command regression, no per-keystroke React draft state, localization, geometry, and scope boundary. Browser acceptance must still prove the interaction sequence, persistence, mobile behavior, focus/reduced motion, no overflow, and a clean console before archive.

## Risks / Trade-offs

- Drag/drop behavior varies by browser -> keep the plugin isolated, top-level-only, and require browser evidence before completion.
- Popovers can collapse selections -> retain explicit range capture/restore and zero-delay BubbleMenu tests.
- Buffered persistence can race external updates -> cancel pending local commits before accepting a different external document.
- Advanced block parity is deferred -> keep the follow-up explicit and never report this slice as complete Capacities block parity.

## Migration Plan

1. Preserve current document/storage migrations and exact dependency pins.
2. Replace invalid DragHandle commands with plugin metadata and align plus/grip behavior with reference evidence.
3. Remove per-keystroke React draft state and make toolbar state narrowly reactive.
4. Expand localized copy and regression tests.
5. Run browser, repository, OpenSpec, Graphify, and protected-publication gates before checking acceptance tasks complete.

## Open Questions

None for this first slice.
