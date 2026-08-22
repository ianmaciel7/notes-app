## 1. Dependencies and public contracts

- [x] 1.1 Add the exact Tiptap 3.30.2 package set, including `@tiptap/markdown`, and `@floating-ui/dom` 1.8.0, keeping every Tiptap package on the same pinned version and excluding paid, Pro, collaboration, AI, and template packages.
- [x] 1.2 Create the neutral `src/editor/` module and export the Notes App-owned `BlockEditorDocument`, `BlockEditorProps`, `createEmptyBlockDocument`, validation, normalization, plain-text conversion, `blockDocumentFromMarkdown`, and `blockDocumentToMarkdown` APIs without exposing Tiptap names.
- [x] 1.3 Define and test the schema-version-1 allowlist for document nodes, marks, and attributes, rejecting unknown or malformed content.

## 2. Workspace document model and persistence

- [x] 2.1 Change only `DocumentEntity.body` and `QuoteEntity.body` to `BlockEditorDocument`, preserving Task, URL, Table note, titles, tags, collections, and query descriptions as simple controls.
- [x] 2.2 Raise the workspace snapshot to version 2 and implement deterministic version-1 migration that splits text into paragraphs while preserving empty lines.
- [x] 2.3 Implement version-2 serialization, hydration, invalid-document rejection, and plain-text import with round-trip coverage.
- [x] 2.4 Update fixtures and controller actions to create, normalize, edit, and persist structured Page, Atomic note, and Quote bodies.

## 3. Core editor integration

- [x] 3.1 Implement the narrow client-side Tiptap boundary with `immediatelyRender: false`, controlled JSON updates, and external `setContent(..., { emitUpdate: false })` synchronization only when content differs.
- [ ] 3.2 Configure Markdown-style input rules, paste/import/export, paragraph, headings H1-H3, bold, italic, inline code, link, bullet list, ordered list, task list, blockquote, code block, undo/redo, and their native keyboard behavior.
- [ ] 3.3 Render `editable={false}` as semantic read-only content without mutation callbacks, cursor affordances, menus, or handles.

## 4. Block interaction surfaces

- [x] 4.1 Implement a shared block-command catalog and slash menu using Suggestion and Command with filtering, keyboard navigation, Enter, Escape, empty state, and focus restoration.
- [ ] 4.2 Implement the headless BubbleMenu selection toolbar using only local Button, ToggleGroup, DropdownMenu, and Popover primitives while preserving the editor selection for formatting and link editing.
- [ ] 4.3 Implement top-level-only insertion and drag handles with `nested: false`, reuse the slash catalog for insertion, support reordering, and hide drag affordances on touch/mobile.
- [ ] 4.4 Extend the local Popover neutrally only if a virtual anchor is required, and give every exported editor component a neutral English `data-slot`.

## 5. Workspace integration, styling, and copy

- [x] 5.1 Integrate the editor into all document presets and Quote, route `.md` through Markdown conversion and `.txt` through plain-text conversion, and keep title, type, collections, tags, and metadata outside the block document.
- [ ] 5.2 Apply the confirmed Capacities-derived contract: fluid measure, Inter 16px/24px body, Inter 700 30px/33px title, 40px leading inset, link-color selection near 25%, 18x22px handle, and 100ms handle transition; label unverified block styles as approximations.
- [ ] 5.3 Add complete editor placeholders, block labels, actions, tooltips, link copy, ARIA labels, and empty states in English, Spanish, and Brazilian Portuguese.
- [ ] 5.4 Verify visible focus, reduced motion, mobile overflow, semantic read-only rendering, and clean browser console behavior.

## 6. Automated and browser acceptance

- [x] 6.1 Add `node:test` unit coverage for empty documents, schema validation, plain-text and Markdown conversion with deterministic round trips, storage migration v1 to v2, v2 round trips, invalid-content rejection, and textual import.
- [ ] 6.2 Add contract tests for synchronized dependency versions, prohibited-package absence, neutral `data-slot` values, translation completeness, vendor-neutral public APIs, and preservation of simple fields.
- [ ] 6.3 Validate Markdown shortcuts and paste plus desktop keyboard editing: Enter, Backspace at block start, arrows, Tab and Shift+Tab in lists, undo/redo, slash-menu keyboard flow, and Escape.
- [ ] 6.4 Validate desktop formatting and blocks: bold, italic, inline code, links without selection loss, lists, task lists, quotes, code blocks, top-level insertion, and drag reordering.
- [ ] 6.5 Validate desktop and mobile persistence, version-1 migration, visible focus, ARIA, reduced motion, no overflow, and a clean console.
- [ ] 6.6 Compare computed DOM and screenshots against approved JSONL/WACZ evidence and record confirmed measurements separately from approximations.

## 7. Completion and protected publication

- [ ] 7.1 Synchronize the delta specs, verify implementation against this change, run strict OpenSpec validation, and archive `add-block-editor` only after every acceptance criterion passes.
- [ ] 7.2 Regenerate only canonical Graphify artifacts and review the resulting diff for unrelated or temporary files.
- [ ] 7.3 Run focused checks during implementation, then finish with `pnpm verify`, strict OpenSpec validation, `git diff --check`, and an explicit staged-file review.
- [ ] 7.4 Commit and push only the intended files on `feat/block-editor`, open a protected PR to `dev`, resolve reviews, and wait for Quality and Security.
- [ ] 7.5 Squash merge the green PR, confirm `dev` contains the squash commit, fast-forward the local `dev`, and only then remove the feature branch.
- [ ] 7.6 Produce the final report with branches, OpenSpecs, engine/version/license, alternatives, dependencies, files, reused components, evidence, behaviors, deferrals, limitations, test and gate results, PR URLs, commits, and squash-merge confirmation.
