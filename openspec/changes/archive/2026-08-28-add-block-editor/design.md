## Context

Page, Atomic note, and Quote persist a Notes App-owned structured document behind a client-only Tiptap boundary. The authenticated Capacities reference exposes semantic blocks, selection tools, a two-part top-level block handle, insertion/reordering, and a slash command menu that can open after existing text followed by whitespace. The current public documentation and archived source also confirm Heading 4, Small text, multiple ordered-list styles, rearrangeable blocks, and six-dot block controls.

The project archive is UI/source evidence, not proof of Capacities' private editor or storage implementation. The block-handle evidence is preserved in `docs/references/capacities-block-handle.md` and `docs/references/block-handle-drag-tooltip-regressions.md`. The slash-menu evidence is preserved in `docs/references/capacities-slash-menu.md` together with the user-supplied screenshot asset and archive-backed labels.

## Goals / Non-Goals

**Goals:**

- Keep a validated, versioned document contract independent of rendered HTML and Tiptap types.
- Support paragraph, Small text, H1-H4, first-slice marks, bullet/numerical/alphabetical/roman/task lists, quotes, code, horizontal rule, Markdown interchange, and keyboard behavior.
- Open `/` at block start or after whitespace, including `aaa /`, while rejecting a mid-word slash.
- Match the confirmed leading slash-menu order and visual surface.
- Preserve selection through formatting and link editing.
- Match the confirmed two-part desktop block-handle interaction while retaining non-drag creation on touch/mobile.
- Keep the visible six-dot grip draggable without allowing its click-menu trigger to consume the drag gesture.
- Render semantic read-only content without mutation affordances.
- Keep input responsive by avoiding React state updates and extension reconfiguration on every editor transaction.

**Non-Goals:**

- Toggles, highlights, Mermaid/math, editor tables, multi-column/group blocks, media/object embeds, comments, collaboration, or AI. These remain a separate follow-up after stable BlockIds/linking.
- Lateral column-drop semantics before a matching neutral layout-block schema exists.
- Claims about Capacities' private framework, protocol, or persistence format.

## Decisions

### Vendor-neutral document and editor boundary

Tiptap remains internal. Public editor props use only `BlockEditorDocument`, localized labels, editability, and application callbacks. JSON remains canonical; Markdown is interchange only.

### Small text as paragraph presentation metadata

Small text is represented as a paragraph attribute owned by the neutral document (`size: "small"`). A Tiptap global-attribute extension renders it as `data-text-size="small"`. This avoids inventing a second paragraph node type and keeps Small text compatible with the reference's hierarchy-style behavior. Markdown export degrades Small text to an ordinary paragraph because standard Markdown has no equivalent syntax.

### Ordered-list style as typed ordered-list metadata

The pinned Tiptap ordered-list extension supports an HTML list `type` attribute. Notes App preserves numerical/default, alphabetical (`a`), and roman (`i`) styles in the neutral document validator. Changing one ordered-list style updates the same list rather than toggling it off.

### Slash trigger semantics

The previous `startOfLine: true` configuration was too restrictive and explains the reported `aaa /` failure. The Suggestion matcher now uses `startOfLine: false` with whitespace-only prefixes. This admits block-start `/` and whitespace-prefixed `/`, while preventing a slash in the middle of a word from opening the block menu.

### Slash-menu visual contract

The supplied screenshot confirms a rounded white menu around 440px wide with a neutral border, approximately 40px rows, unboxed neutral icons, an active-row background, title `Criar um bloco`, and a keyboard legend footer. The leading order is Default, Small, H1-H4, Bullet list, Alphabetical list; the archive additionally confirms Numerical and Roman list commands.

### Grip drag and context-menu activation are separate gestures

The Capacities archive renders the visible six-dot surface itself with `draggable="true"`; click remains a separate block-options action. Notes App follows that observable contract: the visible grip starts the native drag, while Tiptap's DragHandle plugin remains responsible for selecting and moving the document node.

The Base UI menu trigger opens on `mousedown`. Wrapping the draggable grip directly in that trigger consumed the pointer gesture, locked the Tiptap handle, and prevented `dragstart`. The block menu therefore uses a controlled, non-interactive anchor at the grip position. The visible grip opens the menu only from its completed click handler, after post-drag click suppression has ruled out a drag.

Drag start must not dispatch `lockDragHandle`. The source block is instead preserved in a ref used by `getReferencedVirtualElement`, while `onNodeChange` is ignored for the duration of the drag. This keeps the handle visually anchored without turning the draggable element off before Tiptap processes the drag event.

### Drop feedback

The first slice uses Tiptap's top-level reorder behavior and a one-pixel neutral drop cursor. It does not simulate Capacities' multi-column lateral drops because the current neutral document does not yet support layout blocks.

### Evidence and acceptance

Source/contract tests guard slash trigger semantics, command ordering, small/list-style persistence, localization, geometry, screenshot hashes, draggable ownership, menu-trigger separation, and scope boundaries. Browser acceptance must still prove slash-after-text, command execution, actual block reordering from the visible grip, persistence, mobile behavior, focus/reduced motion, no overflow, and a clean console before archive.

## Risks / Trade-offs

- Small text has no standard Markdown representation -> export it as a normal paragraph and keep richer JSON canonical.
- Slash matching can become too permissive -> allow only start-of-text or whitespace prefixes, never a mid-word trigger.
- A menu trigger attached directly to the grip cancels drag -> keep menu anchoring detached from the native draggable surface.
- Advanced block parity is deferred -> never report this slice as complete Capacities block parity.

## Migration Plan

1. Preserve current document/storage migrations and exact dependency pins.
2. Extend neutral validation for Small text and typed ordered-list styles.
3. Replace the start-of-line-only slash matcher with whitespace-aware activation and align the slash menu to the reference screenshot.
4. Make the visible six-dot control the native drag origin, detach menu activation from `mousedown`, and keep source positioning through a drag-source virtual anchor.
5. Run browser, repository, OpenSpec, Graphify, and protected-publication gates before checking acceptance tasks complete.

## Open Questions

None for this first slice.
