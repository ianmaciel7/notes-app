## 1. Baseline and ownership

- [x] 1.1 Record the timestamped live-reference geometry, colors, typography, state timings, and 1536/1280/1024/768/480/390 viewport matrix in the canonical Capacities reference documentation, replacing stale 288px-sidebar claims with the current 224px baseline.
- [x] 1.2 Audit the current dirty tree and active shell/header/sidebar changes, reserve block document/entity/storage ownership for `add-block-editor`, and define a focused file/staging boundary before implementation.
- [x] 1.3 Add a read-only parity audit workflow that captures local screenshots plus computed geometry/styles without committing authenticated Capacities screenshots or mutating workspace data.

## 2. Shell and responsive layout

- [x] 2.1 Update `AppShell` to use a 224px expanded sidebar baseline, 46px rails, 10px gutters, 12px primary-surface radii, and fluid tracks while preserving existing public exports, resizable controls, and stable triggers.
- [x] 2.2 Make contextual-panel visibility route/state-driven and collapse or overlay auxiliary content before the main surface and tab strip fall below their usable bounds.
- [x] 2.3 Implement and verify explicit mobile navigation/context overlay open and closed states at 480px and 390px, preserving a visible usable main surface and focus restoration.
- [x] 2.4 Verify `scrollWidth === clientWidth` and positive main-surface dimensions at all six viewport checkpoints.

## 3. Shared interaction contracts

- [x] 3.1 Add or extend named shared variants for sidebar rows, tabs, compound chips, compact menu surfaces/rows, submenus, tooltips, and small actions using semantic tokens and the measured 150/200/250ms timings.
- [x] 3.2 Migrate sidebar primary, pinned, object-type, section, and utility rows to full-row primary targets with non-shifting hover/focus/selected action reveals and distinct nested actions.
- [x] 3.3 Refactor main and side-panel tabs so the midpoint and at least a 44x32 primary region always select the tab while Pin and Close remain sibling, non-overlapping, distinctly named controls.
- [x] 3.4 Implement compound object-type chips whose text navigates and whose separate arrow opens the approximately 256px searchable selector without navigation.
- [x] 3.5 Converge workspace overflow menus on the shared 268-269px/32px-row contract with grouped shortcuts, destructive styling, hover/focus submenus, initial focus, outside-click, and Escape behavior.
- [x] 3.6 Apply `motion-reduce` behavior to shell, tab, row, menu, popover, tooltip, and surface transitions without suppressing the resulting state changes.

## 4. Workspace content and localization

- [x] 4.1 Apply the current surface, typography, spacing, card, listing, editor-wrapper, collection, query, and empty-state contracts across existing workspace routes while retaining local entities and counts.
- [x] 4.2 Extract deterministic transient navigation/panel helpers from the workspace controller where required for testing, without changing public provider APIs, entity bodies, storage keys, or snapshot version.
- [ ] 4.3 Remove production `demo`/`fixture` APIs touched by this change, move touched user-visible copy to `next-intl`, update every locale catalog, and keep object icons sourced from the central registry.
- [ ] 4.4 Confirm no implementation hunk changes block-editor document types, body persistence, storage migration, or other areas reserved by `add-block-editor`.
- [ ] 4.5 Specify and implement per-object creation/click/write contracts for Page, Atomic note, Quote, Table, Task, Weblink, Tweet, Tag, Query, Image, PDF, Audio, File, Book, Person, Area, Meeting, Definition, Idea, Place, Project, Organization, Media, Travel, AI chat, and custom object types while preserving local data.
- [ ] 4.6 Verify each created object updates the active tab, editor, sidebar/object-type count, search/query/list projections, selected/post-click visuals, and persisted entity exactly once.
- [x] 4.7 Treat Archive as a reserved/non-creatable registry type unless a separate requirement makes it user-instantiable.
- [ ] 4.8 Define and consume reusable lifecycle contracts for `ObjectCreationTrigger`, `ObjectCreationMenu`, `ObjectTypeOptionRow`, `ObjectCaptureSurface`, `ObjectEditorShell`, `EditableObjectTitle`, `EditableObjectBody`, `ObjectField`, `ObjectFieldGroup`, `ObjectValidationMessage`, `ObjectAttachmentControl`, `ObjectTab`, `ObjectProjectionRow`, `ObjectProjectionCard`, `ObjectCountBadge`, `ObjectTypePresetCard`, `ObjectTypeDetailsPanel`, `CustomObjectTypeForm`, and `ObjectIconTonePreview`.
- [ ] 4.9 Remove duplicated lifecycle geometry, typography, icon treatment, focus, hover, pressed, selected, open, post-click, validation, Escape, outside-click, and transition styling from object-specific components touched by this change.

## 5. Automated interaction coverage

- [x] 5.1 Add a focused Playwright configuration and scripts for the existing Next.js app without adding another component-test framework.
- [x] 5.2 Cover tab midpoint selection, dedicated Pin/Close targets, sidebar full-row/nested targets, type-chip text/disclosure behavior, menu/submenu focus, Escape, outside-click, and post-click selected state.
- [x] 5.3 Cover 1536/1280/1024/768 desktop geometry plus 480/390 overlay-open and overlay-closed states, tab-strip containment, no horizontal overflow, and positive usable content dimensions.
- [x] 5.4 Cover reduced-motion state completion, keyboard focus visibility, distinct accessible names, and zero browser-console implementation errors.
- [x] 5.5 Extend fast unit/source tests for extracted reducers/helpers, provider invariants, locale completeness, shared-variant consumption, and unchanged localStorage schema/version.
- [ ] 5.6 Add focused browser coverage that opens `Novo`, verifies idle/hover/focus/pressed/open/Escape/outside-click states, instantiates each object family, writes type-appropriate content, clicks the resulting projection, and asserts post-click selected state without count duplication.
- [x] 5.7 Add source or browser coverage that audits central registry ids and proves every creatable id has an explicit lifecycle scenario while reserved ids are documented.
- [ ] 5.8 Add source checks proving repeated lifecycle surfaces consume the reusable contracts, plus browser checks for at least one representative consumer of each contract.

## 6. Verification and OpenSpec completion

- [x] 6.1 Run focused tests, Playwright parity tests, TypeScript, lint/format checks without rewriting unrelated files, production build, and route HTTP checks; record any proven pre-existing failure separately.
- [x] 6.2 Run the three-front final review: read-only Capacities reference confirmation, localhost browser comparison, and source/OpenSpec ownership/test audit.
- [x] 6.3 Validate this change strictly, update only evidence-backed task checkboxes, sync the approved deltas, and reconcile superseded shell/header/sidebar requirements without archiving unrelated active changes.
- [x] 6.4 Refresh Graphify through the repository workflow only after material source changes, then verify graph integrity/freshness without staging unrelated pre-existing Graphify edits.
