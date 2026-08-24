## 1. Dependencies and public contracts

- [x] 1.1 Keep the exact pinned editor dependency set and vendor-neutral public boundary.
- [x] 1.2 Keep neutral document validation, normalization, conversion, and persistence contracts.
- [x] 1.3 Preserve the user-supplied block-handle screenshot and archive-backed tooltip evidence under `docs/references`.
- [x] 1.4 Preserve the user-supplied slash-menu screenshot and archive-backed command labels/order under `docs/references`.
- [x] 1.5 Preserve slash-menu and block-handle regression screenshots and their acceptance contracts under `docs/references`.

## 2. Workspace document model and persistence

- [x] 2.1 Preserve structured Page/Atomic note/Quote bodies and existing migration/round-trip behavior.
- [x] 2.2 Persist small-text paragraph metadata and typed ordered-list styles (`a`, `i`, decimal) in the neutral document validator.

## 3. Core editor integration

- [x] 3.1 Align supported first-slice commands with paragraph, small text, headings H1-H4, bullet/numerical/alphabetical/roman/task list, blockquote, code block, horizontal rule, and existing marks.
- [x] 3.2 Render `editable={false}` as semantic read-only content without mutation callbacks, cursor affordances, menus, or handles.
- [x] 3.3 Remove per-keystroke React draft state, explicitly disable transaction-wide rerenders, and keep external synchronization non-emitting.

## 4. Block interaction surfaces

- [x] 4.1 Allow slash-command activation both at block start and after whitespace while rejecting mid-word `/`.
- [x] 4.2 Align the slash menu's leading command order, row geometry, icon treatment, title, active state, width, and keyboard legend with the authenticated reference.
- [x] 4.3 Anchor the slash menu to the current caret with `coordsAtPos` fallback, fixed viewport coordinates, edge clamping, and below/above placement fallback.
- [ ] 4.4 Browser-verify slash positioning at ordinary, scrolled, and viewport-edge caret positions with no `(0,0)` fallback.
- [ ] 4.5 Browser-verify the zero-delay selection BubbleMenu/link-editing contract while preserving selection.
- [x] 4.6 Implement independent plus/six-dot controls and explicit insertion selection.
- [x] 4.7 Position the combined 36px handle immediately left of the hovered block using a fixed block-relative virtual element.
- [x] 4.8 Replace native `title` tooltips with localized shared Tooltip surfaces for plus and grip actions.
- [x] 4.9 Configure a subtle one-pixel neutral drop cursor for supported top-level reordering.
- [x] 4.10 Make the visible six-dot grip the native draggable origin while retaining Tiptap as the document-move controller.
- [x] 4.11 Detach block-menu activation from the grip's `mousedown`, open it only from a completed click, and keep post-drag click suppression.
- [x] 4.12 Keep source-handle positioning through a drag-source virtual anchor without dispatching `lockDragHandle` during drag start.
- [ ] 4.13 Browser-verify handle geometry, actual top-level reordering from the visible grip, menu click, no post-drag menu click, tooltip copy, and touch/mobile fallback.

## 5. Workspace integration, styling, and copy

- [x] 5.1 Apply confirmed editor typography/measure/handle/slash-menu contracts.
- [x] 5.2 Complete editor copy in `en`, `es`, and `pt-BR`.
- [ ] 5.3 Verify focus, reduced motion, mobile overflow, read-only semantics, and clean console behavior.
- [x] 5.4 Keep remaining advanced documented blocks, including lateral/column/group drop semantics, as explicit follow-ups until the neutral schema supports them.

## 6. Automated and browser acceptance

- [x] 6.1 Add source-contract coverage for Small text, alphabetical/roman lists, slash-after-text activation, menu order, geometry, caret anchoring, viewport clamping, handle geometry, tooltip primitives, grip-owned drag origin, detached menu anchoring, and dropcursor styling.
- [ ] 6.2 Execute Playwright coverage for slash-after-text, caret anchoring, command execution, selection preservation, handle geometry/tooltips, insertion/reordering, persistence, accessibility, and reference screenshots.

## 7. Completion and protected publication

- [ ] 7.1 Run strict OpenSpec validation, Graphify workflow, `pnpm verify`, `git diff --check`, and staged-file review.
- [ ] 7.2 Archive/publish only after every evidence-backed criterion passes.
