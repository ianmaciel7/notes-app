## 1. Dependencies and public contracts

- [x] 1.1 Keep the exact pinned editor dependency set and vendor-neutral public boundary.
- [x] 1.2 Keep neutral document validation, normalization, conversion, and persistence contracts.
- [x] 1.3 Preserve the user-supplied block-handle screenshot and archive-backed tooltip evidence under `docs/references`.
- [x] 1.4 Preserve the user-supplied slash-menu screenshot and archive-backed command labels/order under `docs/references`.
- [x] 1.5 Preserve the slash-menu viewport-origin regression screenshot and its acceptance contract under `docs/references`.

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
- [x] 4.6 Implement independent plus/six-dot controls, explicit insertion selection, grip-only drag origin, and post-drag click suppression.
- [ ] 4.7 Browser-verify insertion order, actual top-level reordering, grip click, no post-drag menu click, and touch/mobile fallback.

## 5. Workspace integration, styling, and copy

- [x] 5.1 Apply confirmed editor typography/measure/handle/slash-menu contracts.
- [x] 5.2 Complete editor copy in `en`, `es`, and `pt-BR`.
- [ ] 5.3 Verify focus, reduced motion, mobile overflow, read-only semantics, and clean console behavior.
- [x] 5.4 Keep remaining advanced documented blocks as an explicit follow-up.

## 6. Automated and browser acceptance

- [x] 6.1 Add source-contract coverage for Small text, alphabetical/roman lists, slash-after-text activation, menu order, geometry, caret anchoring, viewport clamping, and reference hashes.
- [ ] 6.2 Execute Playwright coverage for slash-after-text, caret anchoring, command execution, selection preservation, insertion/reordering, persistence, accessibility, and reference screenshots.

## 7. Completion and protected publication

- [ ] 7.1 Run strict OpenSpec validation, Graphify workflow, `pnpm verify`, `git diff --check`, and staged-file review.
- [ ] 7.2 Archive/publish only after every evidence-backed criterion passes.
