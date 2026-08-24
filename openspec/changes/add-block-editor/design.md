## Context

Page, Atomic note, and Quote persist a Notes App-owned structured document behind a client-only Tiptap boundary. The authenticated Capacities reference exposes semantic blocks, selection tools, a two-part top-level block handle, insertion/reordering, and a slash command menu that can open after existing text followed by whitespace. The current public documentation and archived source also confirm Heading 4, Small text, and multiple ordered-list styles.

The project archive is UI/source evidence, not proof of Capacities' private editor or storage implementation. The block-handle evidence is preserved in `docs/references/capacities-block-handle.md`. The slash-menu evidence is preserved in `docs/references/capacities-slash-menu.md` together with the user-supplied screenshot asset and archive-backed labels.

## Goals / Non-Goals

**Goals:**

- Keep a validated, versioned document contract independent of rendered HTML and Tiptap types.
- Support paragraph, Small text, H1-H4, first-slice marks, bullet/numerical/alphabetical/roman/task lists, quotes, code, horizontal rule, Markdown interchange, and keyboard behavior.
- Open `/` at block start or after whitespace, including `aaa /`, while rejecting a mid-word slash.
- Match the confirmed leading slash-menu order and visual surface.
- Preserve selection through formatting and link editing.
- Match the confirmed two-part desktop block-handle interaction while retaining non-drag creation on touch/mobile.
- Render semantic read-only content without mutation affordances.
- Keep input responsive by avoiding React state updates and extension reconfiguration on every editor transaction.

**Non-Goals:**

- Toggles, highlights, Mermaid/math, editor tables, multi-column/group blocks, media/object embeds, comments, collaboration, or AI. These remain a separate follow-up after stable BlockIds/linking.
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

### Evidence and acceptance

Source/contract tests guard slash trigger semantics, command ordering, small/list-style persistence, localization, geometry, screenshot hashes, and scope boundaries. Browser acceptance must still prove slash-after-text, command execution, persistence, mobile behavior, focus/reduced motion, no overflow, and a clean console before archive.

## Risks / Trade-offs

- Small text has no standard Markdown representation -> export it as a normal paragraph and keep richer JSON canonical.
- Slash matching can become too permissive -> allow only start-of-text or whitespace prefixes, never a mid-word trigger.
- Advanced block parity is deferred -> never report this slice as complete Capacities block parity.

## Migration Plan

1. Preserve current document/storage migrations and exact dependency pins.
2. Extend neutral validation for Small text and typed ordered-list styles.
3. Replace the start-of-line-only slash matcher with whitespace-aware activation and align the slash menu to the reference screenshot.
4. Run browser, repository, OpenSpec, Graphify, and protected-publication gates before checking acceptance tasks complete.

## Open Questions

None for this first slice.
