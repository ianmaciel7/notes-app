## 1. Dependencies and public contracts

- [x] 1.1 Keep the exact pinned editor dependency set and vendor-neutral public boundary.
- [x] 1.2 Keep neutral document validation, normalization, conversion, and persistence contracts.

## 2. Workspace document model and persistence

- [x] 2.1 Preserve structured Page/Atomic note/Quote bodies and existing migration/round-trip behavior.

## 3. Core editor integration

- [x] 3.1 Align supported first-slice commands and Markdown input/import/export with paragraph, headings H1-H4, bold, italic, inline code, link, bullet/ordered/task list, blockquote, code block, horizontal rule, undo/redo, and keyboard behavior.
- [x] 3.2 Render `editable={false}` as semantic read-only content without mutation callbacks, cursor affordances, menus, or handles.

## 4. Block interaction surfaces

- [x] 4.1 Preserve shared slash-command catalog behavior.
- [x] 4.2 Complete the selection BubbleMenu/link-editing contract while preserving selection.
- [x] 4.3 Complete top-level insertion/drag handles with touch/mobile alternatives.
- [x] 4.4 Keep neutral data slots and local shared primitives.

## 5. Workspace integration, styling, and copy

- [x] 5.1 Apply confirmed editor typography/measure/handle contracts and label unverified values as approximations.
- [x] 5.2 Complete editor copy, tooltips, ARIA, and empty states in `en`, `es`, and `pt-BR`.
- [ ] 5.3 Verify focus, reduced motion, mobile overflow, read-only semantics, and clean console behavior.
- [x] 5.4 Record advanced documented blocks (small text, toggles, highlights, Mermaid/math, tables, multi-column/group, media/object embeds) as an explicit follow-up; do not mark this slice as complete block parity.

## 6. Automated and browser acceptance

- [x] 6.1 Extend contract/keyboard/formatting tests to H4 and horizontal rule where supported.
- [ ] 6.2 Validate Markdown shortcuts/paste, selection preservation, top-level insertion/reordering, desktop/mobile persistence, accessibility, and reference DOM/screenshots.

## 7. Completion and protected publication

- [ ] 7.1 Sync specs, run strict OpenSpec validation, Graphify workflow, `pnpm verify`, `git diff --check`, and staged-file review.
- [ ] 7.2 Archive/publish only after every evidence-backed criterion passes; keep advanced-block follow-up separate.
