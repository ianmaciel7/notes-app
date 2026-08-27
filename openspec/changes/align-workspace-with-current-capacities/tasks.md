## 1. Baseline and ownership

- [ ] 1.1 Refresh the timestamped live-reference geometry and state matrix with the August 26 matched-state evidence, including 288px reference versus 224px local at 1153x912, and verify the documentation distinguishes clean defaults from persisted resize state.
- [x] 1.2 Audit the current dirty tree and active shell/header/sidebar changes, reserve block document/entity/storage ownership for `add-block-editor`, and define a focused file/staging boundary before implementation.
- [x] 1.3 Add a read-only parity audit workflow that captures local screenshots plus computed geometry/styles without committing authenticated Capacities screenshots or mutating workspace data.

## 2. Shell and responsive layout

- [ ] 2.1 Update `AppShell` to match the recorded reference/default resize policy, 46px rails, 10px gutters, 12px primary-surface radii, and fluid tracks; verify 1153x912 geometry against both live pages.
- [ ] 2.2 Make contextual-panel visibility and body content route/state-driven, using the default `/<locale>/<space>/<target>` and `?section=...` route contract, and verify every panel entry renders its selected view on desktop and mobile.
- [ ] 2.3 Correct and verify explicit mobile navigation/context overlay open and closed states at 480px and 390px, including approximately 10px primary-surface outer spacing and focus restoration.
- [x] 2.4 Verify `scrollWidth === clientWidth` and positive main-surface dimensions at all six viewport checkpoints.

## 3. Shared interaction contracts

- [x] 3.1 Add or extend named shared variants for sidebar rows, tabs, compound chips, compact menu surfaces/rows, submenus, tooltips, and small actions using semantic tokens and the measured 150/200/250ms timings.
- [x] 3.2 Migrate sidebar primary, pinned, object-type, section, and utility rows to full-row primary targets with non-shifting hover/focus/selected action reveals and distinct nested actions.
- [x] 3.3 Refactor main and side-panel tabs so the midpoint and at least a 44x32 primary region always select the tab while Pin and Close remain sibling, non-overlapping, distinctly named controls.
- [x] 3.4 Implement compound object-type chips whose text navigates and whose separate arrow opens the approximately 256px searchable selector without navigation.
- [x] 3.5 Converge workspace overflow menus on the shared 268-269px/32px-row contract with grouped shortcuts, destructive styling, hover/focus submenus, initial focus, outside-click, and Escape behavior.
- [x] 3.6 Apply `motion-reduce` behavior to shell, tab, row, menu, popover, tooltip, and surface transitions without suppressing the resulting state changes.

## 4. Workspace content and localization

- [ ] 4.1 Apply and browser-verify the current surface, typography, spacing, card, listing, Page editor, Table, collection, query, and empty-state contracts while retaining local entities and counts.
- [x] 4.2 Extract deterministic transient navigation/panel helpers from the workspace controller where required for testing, without changing public provider APIs, entity bodies, storage keys, or snapshot version.
- [ ] 4.3 Remove remaining production placeholders and hardcoded Page/side-panel copy, update `next-intl` catalogs for `/en`, `/es`, and `/pt-BR`, and verify locale-specific browser text.
- [x] 4.4 Confirm no implementation hunk changes block-editor document types, body persistence, storage migration, or other areas reserved by `add-block-editor`.
- [ ] 4.5 Implement the revised per-object creation/click/write contracts, starting with complete Page and Table vertical flows, and verify each named command performs its specified outcome.
- [ ] 4.6 Verify each changed object updates the active tab, editor, counts, projections, selected/post-click visuals, and persisted entity exactly once, including deletion cleanup and buffered-edit flush boundaries.
- [x] 4.7 Treat Archive as a reserved/non-creatable registry type unless a separate requirement makes it user-instantiable.
- [x] 4.8 Define and consume reusable lifecycle contracts for `ObjectCreationTrigger`, `ObjectCreationMenu`, `ObjectTypeOptionRow`, `ObjectCaptureSurface`, `ObjectEditorShell`, `EditableObjectTitle`, `EditableObjectBody`, `ObjectField`, `ObjectFieldGroup`, `ObjectValidationMessage`, `ObjectAttachmentControl`, `ObjectTab`, `ObjectProjectionRow`, `ObjectProjectionCard`, `ObjectCountBadge`, `ObjectTypePresetCard`, `ObjectTypeDetailsPanel`, `CustomObjectTypeForm`, and `ObjectIconTonePreview`.
- [x] 4.9 Remove duplicated lifecycle geometry, typography, icon treatment, focus, hover, pressed, selected, open, post-click, validation, Escape, outside-click, and transition styling from object-specific components touched by this change.

## 5. Automated interaction coverage

- [x] 5.1 Add a focused Playwright configuration and scripts for the existing Next.js app without adding another component-test framework.
- [ ] 5.2 Cover tab midpoint selection, nested targets, both object-type compound controls, menu focus/close behavior, collapse/expand names, and post-click selected state against production-owned views.
- [ ] 5.3 Cover matched 1536/1280/1153/1024/768 desktop states plus 480/390 overlay states, including recorded resize state, gutters, rail height, containment, overflow, and usable dimensions.
- [ ] 5.4 Cover reduced motion, keyboard focus, truthful accessible names, Page link/embed reload safety, and zero browser-console implementation errors.
- [x] 5.5 Extend fast unit/source tests for extracted reducers/helpers, provider invariants, locale completeness, shared-variant consumption, and unchanged localStorage schema/version.
- [ ] 5.6 Add focused browser coverage that opens `Novo`, distinguishes primary creation from disclosure, exercises Page/Table click and write flows, reloads persisted outcomes, and asserts post-click state without count duplication.
- [x] 5.7 Add source or browser coverage that audits central registry ids and proves every creatable id has an explicit lifecycle scenario while reserved ids are documented.
- [x] 5.8 Add source checks proving repeated lifecycle surfaces consume the reusable contracts, plus browser checks for at least one representative consumer of each contract.

## 6. Verification and OpenSpec completion

- [ ] 6.1 Run focused tests, production-view Playwright interaction/parity tests, TypeScript, lint/format checks, production build, route HTTP checks, and verify no accepted click produces a runtime error.
- [ ] 6.2 Repeat the three-front final review with matched live states: read-only Capacities confirmation, localhost click/render comparison, and source/OpenSpec ownership/test audit.
- [ ] 6.3 Validate this change strictly, update only evidence-backed checkboxes, sync approved deltas, and reconcile superseded shell/header/sidebar requirements after the repeated browser review passes.
- [x] 6.4 Refresh Graphify through the repository workflow only after material source changes, then verify graph integrity/freshness without staging unrelated pre-existing Graphify edits.

## 7. Functional and rendering remediation

- [x] 7.1 Fix the object-type split New control so disclosure opens options without mutation and primary New creates exactly once; verify entity, tab, and count deltas in Playwright.
- [ ] 7.2 Connect object-type Import to the production-owned route and verify accepted, rejected, and cancelled file selections without legacy input fallback.
- [x] 7.3 Implement Table zero-item rendering with reference-aligned illustration, explanatory copy, Import, New, and meaningful selected-layout structure; verify Overview and All separately.
- [ ] 7.4 Make search, filter, sort, grouping, layout, collapse, type settings, template, collection, and query commands render their named outcomes; verify the Atomic note Overview/All surface, Escape-closed transient rows, separate New targets, and distinct list/gallery post-click projections; remove test acceptance of `view not ready` placeholders.
- [ ] 7.5 Dispatch contextual panel entries and Explore actions to context-specific bodies on desktop/mobile; verify graph, backlinks, inside objects, related content, AI chat, search, and entity entries, including reversible Show less/Show more, settings toggles, pointer drag/pan with center reset, zoom out/in, object-node, and empty object-type graph states.
- [ ] 7.6 Make Page Customize keyboard-accessible and persistent, unify Page collections rendering, and verify tags/collections add, remove, empty, reload, and header synchronization states, including activation of the visible Collections control.
- [x] 7.7 Ensure Page link/embed actions emit schema-valid editor documents and verify edit, navigate, reload, and re-open without `Invalid JSON content` or console errors.
- [ ] 7.8 Derive related Page content from an explicit relation rule, fix collapse/expand naming and focus, and reconcile successful deletion with tabs and fallback selection.
- [ ] 7.9 Replace legacy-or-current selector fallbacks with production-view assertions and generate an `action -> reference -> localhost -> verdict -> evidence` command matrix covering idle, hover, focus-visible, pointer, keyboard, open, Escape-closed, post-click render, reload, reversible presentation toggles, and truthful unavailable states.
- [ ] 7.10 Add production-view browser coverage for the Page Collections metadata control and overflow button: assert distinct accessible names, open/close behavior, no mutation on open, collection add/remove synchronization, functional Customize outcome, focus recovery, reload persistence, and zero console errors.
