## 1. Shared Contracts

- [x] 1.1 Add failing trigger-arbitration tests for `+`, `#`, Markdown headings, words, URLs, code/math/table contexts, overlapping suggestions, and IME.
- [x] 1.2 Extend the shared suggestion contract without adding trigger-specific document listeners or persistence paths.

## 2. Plus Trigger

- [x] 2.1 Add failing tests for supported block actions, runtime Structure creation, exact range replacement, cancel, failure, and one canonical transaction.
- [x] 2.2 Implement the `+` adapter over the shared block catalog and existing object-creation owner.
- [x] 2.3 Verify created objects are Space-local, rename-safe, undoable at the editor boundary, and indexed exactly once.

## 3. Tag Trigger

- [x] 3.1 Add failing tests for normalized tag lookup, duplicate labels, exact match, create eligibility, invalid labels, cancel, and cross-Space rejection.
- [x] 3.2 Implement the `#` adapter and canonical tag create-or-reuse command.
- [x] 3.3 Verify tag references/properties, search, persistence, focus, and undo/redo update exactly once.

## 4. Acceptance

- [x] 4.1 Run the full `/`, `+`, `#`, `@`, `[[`, and `((` suggestion suite in sequence.
- [ ] 4.2 Run browser, accessibility, responsive, reduced-motion, IME, performance, and console checks.
- [ ] 4.3 Run repository verification and `openspec validate add-editor-object-and-tag-triggers --strict`.
