## 1. Baseline and Domain Contract

- [x] 1.1 Re-audit the dirty worktree and record the exact overlapping changes, current local creation behavior, hydration errors, and authenticated reference flow evidence without overwriting existing work.
- [x] 1.2 Add focused failing tests for unique IDs, type-specific draft/commit behavior, derived counts, edit synchronization, query selection, and storage validation.
- [x] 1.3 Implement the discriminated workspace entity union, creation-flow definitions, pure reducer actions, and derived selectors in neutral domain modules.

## 2. Persistence and Provider Integration

- [x] 2.1 Implement the versioned locale-neutral storage snapshot parser/validator and exclude file bytes and ephemeral preview URLs from serialization.
- [x] 2.2 Integrate reducer state into the route-owned workspace provider while preserving current header/sidebar consumer contracts and the deterministic acceptance seed.
- [x] 2.3 Hydrate storage only after client mount, persist committed transitions, expose recovery status, and verify the route no longer emits the observed hydration mismatch.

## 3. Immediate Editors

- [x] 3.1 Implement the shared document editor family for Atomic note, Quote, and Page with controlled title, body, tags, collections, and type-appropriate fields.
- [x] 3.2 Implement the Table editor with controlled notes and deterministic editable starter cells whose row/column identity survives updates and reloads.
- [x] 3.3 Implement the Tag index and editable title flow, including synchronized tab label and matching-object projection.

## 4. Drafted Creation Flows

- [x] 4.1 Implement the localized accessible Task quick-capture surface, validation, cancel behavior, commit toast/action, and task editor.
- [x] 4.2 Implement the Weblink/Tweet URL capture surface, type-specific validation, deterministic local metadata derivation, cancel behavior, and URL object editor.
- [x] 4.3 Implement Image/PDF/Audio/File chooser contracts, MIME validation, local metadata objects, ephemeral preview handling, and the post-reload reselect state without remote upload.

## 5. Query Workflow and Cross-Surface Synchronization

- [x] 5.1 Implement the Query builder with description input, deterministic local templates, direct object-type/date/tag filters, and local result evaluation.
- [x] 5.2 Synchronize canonical title/data edits with main tabs, sidebar counts, object-type indexes, active selection, and query results without duplicate entities or count inflation.
- [x] 5.3 Reject unknown object definitions atomically and surface a localized non-blocking error without changing workspace projections.

## 6. Localization, Accessibility, and Verification

- [x] 6.1 Add every lifecycle label, placeholder, fallback title, validation message, status, and accessible name to all supported locale catalogs and keep stored control values locale-neutral.
- [x] 6.2 Add focused component/integration tests for keyboard submit/cancel, return focus, dialog/combobox semantics, validation, reload restoration, and every creation family.
- [x] 6.3 Run focused formatting/lint/tests during implementation, then `pnpm typecheck`, `pnpm verify`, and strict OpenSpec validation with precise reporting of any proven pre-existing failure.
- [x] 6.4 Re-run authenticated reference checks as needed and verify local creation, typing, edit synchronization, reload, re-open, counts, responsive/mobile behavior, and a clean browser console; record evidence and remaining limitations.
- [x] 6.5 Run `openspec-verify-change`, obtain an independent fresh-context review, update Graphify through the repository-supported workflow, and sync/archive only after every acceptance check passes.
