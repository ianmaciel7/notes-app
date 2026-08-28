## Context

At 1153x912 on August 26, 2026, the authenticated Capacities state used a 288px expanded sidebar, a 46px top rail, a main surface beginning at x=298 after a 10px gutter, and a route-sensitive contextual panel. The matched localhost state used a 224px sidebar, a 58px rail, almost no left gutter, and a wider always-generic Explore panel. At 390x844 both avoided horizontal overflow, but the local surface still missed the reference rail and outer-spacing composition. These measurements supersede the earlier claim that 224px was a universal current-reference baseline; panel width remains resizable and may be persisted, so acceptance must compare matched states.

The behavioral audit found higher-severity gaps than the geometry drift. The object-type New disclosure creates an object, import targets a legacy input, Explore actions are inert, empty Table rendering omits reference actions, Customize is inaccessible or inert, and Page linking can produce editor JSON that crashes on reload because `objectLink` is absent from the active schema. The repository already has modular shell/header/sidebar owners, but current routes still mix production views with legacy or placeholder behavior.

This change overlaps active shell/header/sidebar changes. The untracked `add-block-editor` change separately owns block document types, editor persistence, and a storage version migration, so this change must not edit those contracts.

## Goals / Non-Goals

**Goals:**

- Converge all existing workspace routes on matched current-reference geometry and interaction outcomes while preserving local data.
- Make desktop, cramped, and mobile shell states deterministic and testable.
- Centralize repeated visual states in shared semantic variants and keep accessible primary/nested targets distinct.
- Add real-browser regression coverage alongside existing source-level tests.
- Make Page and Table the first complete vertical acceptance flows, including every visible command and post-interaction render state.
- Remove production demo/fixture naming and localized hardcodes touched by this change.

**Non-Goals:**

- Copying Capacities account data, counts, object types, or content.
- Changing the localStorage schema/version, entity body types, block editor, backend, import data model, or public workspace APIs.
- Replacing shadcn/Base UI primitives, Tailwind v4 tokens, the object icon registry, or the App Router boundary.
- Treating pixel screenshots alone as proof of behavioral parity.

## Decisions

### Matched live states override fixed historical measurements

The authenticated reference measured during this change is authoritative only when viewport, route, selected object/type, panel state, and persisted resize state are recorded together. The August 26 reference measured 288px at 1153x912, while the local default measured 224px. Existing semantic tokens remain the implementation mechanism; timestamped geometry and computed styles document expected output without turning one session's resizable width into a universal constant.

Alternative: keep asserting 224px at every desktop checkpoint. Rejected because the matched live state disproves that claim and the panel is resizable/persisted.

### AppShell remains the only geometry owner

`AppShell` will own the expanded-width default and persistence policy, fluid main/panel tracks, collapse thresholds, mobile overlay state, gutters, rail height, and stable triggers. Feature sidebars and content components will not create competing desktop grids or off-canvas implementations. Acceptance records both the clean/default state and any persisted resize state before comparison. At 768px the shell will collapse auxiliary content before shrinking the main tab/content region below a usable bound. Below 768px, mobile overlay open and closed states are both first-class acceptance states and the primary surface retains the measured outer spacing.

Alternative: use CSS overrides at each route. Rejected because it would duplicate geometry and reproduce the current drift.

### Preserve public APIs and local persistence

The provider's external contract, entity model, storage key, and snapshot version remain unchanged. Presentation and transient navigation/panel state may be separated into internal reducers/helpers to enable deterministic tests. Files owned by `add-block-editor` may receive only conflict-free composition changes after coordination; body types and storage code are excluded.

Alternative: combine parity and block-editor refactoring. Rejected because the storage migration and 3,000-line content owner create avoidable merge and validation risk.

### URL is the default workspace navigation state

The local workspace will mirror Capacities' route shape while retaining client-side rendering: `/<locale>/<space-id>` identifies the active workspace, `/<locale>/<space-id>/<target-id>` identifies an object or object type, and supported global sections use `?section=calendar`, `?section=search`, or `?section=explore`. Native history updates keep transitions shallow and preserve the existing provider and localStorage contracts. On initial load and browser back/forward, the URL is authoritative; subsequent in-app selections update the URL without a full reload.

Alternative: keep navigation only in React state and localStorage. Rejected because deep links, reloads, and browser history would not reproduce the selected Capacities state.

### Shared variants own repeated interactive appearance

Sidebar rows, tabs, chips, compact menu rows/surfaces, submenus, and small actions will consume named variants/helpers under the existing shared UI layer. Call sites retain placement and behavior props but do not own popup widths, row heights, borders, radii, shadows, or transition timings. Object icons continue to come from the central registry.

Alternative: copy measured Tailwind strings into each feature. Rejected by the workspace parity rule and because it prevents global convergence.

### Primary and nested actions use non-overlapping DOM regions

Tabs and compound chips will expose a stable primary target and sibling nested action region. Nested actions stop propagation as needed, but layout—not event cancellation alone—must keep the primary center reachable. E2E hit testing will assert that the tab midpoint selects and dedicated action coordinates pin/close or disclose.

Alternative: preserve overlapping absolute actions and rely on users clicking the label. Rejected because more than half of the current 64px tab can be intercepted on hover.

### Browser tests complement source tests

Playwright will cover pointer, keyboard, focus, Escape, click-outside, transitions, overlay states, containment, and computed geometry at fixed viewports. Existing `node:test` coverage remains for reducers, storage invariants, and source contracts. Reference screenshots are runtime evidence and are not committed as vendor-image fixtures; stable local baselines and numeric contracts are used for regression checks.

Alternative: continue regex-only source tests. Rejected because they cannot validate hover, hit targets, focus, post-click state, or responsive geometry.

### Behavior inventory gates visual completion

Each Page, Table, object-type, and contextual-panel surface will maintain an acceptance matrix of visible controls, accessible names, preconditions, click/keyboard outcomes, post-click rendering, persistence/reload behavior, and console results. A control is complete only when it performs its named action, truthfully reports an unavailable state, or is absent. Tests must target the production-owned component and may not pass by falling back to a legacy implementation or accepting a placeholder screen.

Alternative: accept visual similarity plus handler presence. Rejected because the current implementation contains named buttons with no handlers, wrong handlers, and state changes that alter only labels.

### Page and Table are vertical parity slices

Page acceptance covers type navigation/conversion, buffered title/body commits, tags and collections, Customize, valid link/embed documents, derived related content, collapse/expand semantics, deletion/tab reconciliation, localization, and contextual views. Table and object-type acceptance covers Overview/All, primary New versus disclosure, import, search, explicit filter/sort criteria, list/gallery/table layouts, zero-item rendering, collapse, type settings, collection/query destinations, and contextual Explore. Shared primitives may be reused, but route-specific rendering and behavior remain explicit.

Alternative: spread partial behavior across every object family first. Rejected because it leaves no complete user workflow and allowed the current 34/34 checklist to mask basic failures.

### Structured editor actions must preserve schema validity

Link, embed, import, conversion, and external-document actions must emit content accepted by the active editor schema. The browser suite will exercise the action, navigate away, reload, and re-open the object while asserting no implementation error. Ownership conflicts with the active block-editor work are resolved before implementation; the behavioral contract is not weakened to avoid the owning module.

Alternative: test only the mutation callback. Rejected because the observed link action mutated state and then made the entire route unloadable.

### Object creation parity is a lifecycle contract, not a screenshot target

Each object that can be instantiated from `Novo` or from the object-type studio presets must carry a type-specific creation, click, write, projection, and persistence contract. The local app keeps its own object data, counts, labels, and custom types, but the surfaces around them follow the current reference: the creation trigger has visible idle/hover/focus/pressed/open states, object option rows are stable full-row targets, intermediate URL/file/task/query capture surfaces close or validate predictably, and committed objects immediately synchronize tabs, sidebar/object-type rows, content, search/query projections, and persisted state. The authenticated reference observed on August 22, 2026 exposed `Queries`, `Etiquetas`, `Tweets`, `Default`, `Weblinks`, `Tabelas`, and `Páginas`; this is used as evidence for required local coverage without copying the account's private content. Central registry coverage also includes `book`, `person`, `area`, `meeting`, `definition`, `idea`, `place`, `project`, `organization`, `media`, `travel`, and `ai-chat`; `archive` remains reserved/non-creatable unless a future requirement changes its ownership.

Alternative: define only a generic "new object" flow. Rejected because it hides regressions where clicking, writing, validation, counts, or selected state work for one object family but fail for another.

### Reusable lifecycle components prevent object-by-object drift

Object creation and editing will be implemented through reusable contracts: `ObjectCreationTrigger`, `ObjectCreationMenu`, `ObjectTypeOptionRow`, `ObjectCaptureSurface`, `ObjectEditorShell`, `EditableObjectTitle`, `EditableObjectBody`, `ObjectField`, `ObjectFieldGroup`, `ObjectValidationMessage`, `ObjectAttachmentControl`, `ObjectTab`, `ObjectProjectionRow`, `ObjectProjectionCard`, `ObjectCountBadge`, `ObjectTypePresetCard`, `ObjectTypeDetailsPanel`, `CustomObjectTypeForm`, and `ObjectIconTonePreview`. These names describe contracts; implementation may map them to existing files or shared variants as long as ownership remains neutral and reusable. The shared contracts own geometry, typography, icon treatment, focus, hover, pressed, selected, open, post-click, Escape, outside-click, validation, and reduced-motion behavior. Object-specific components provide data and field slots only.

Alternative: implement a separate editor/menu/row for every object type. Rejected because it would make parity impossible to maintain and would violate the workspace UI rule against repeated reference-derived class strings.

## Risks / Trade-offs

- [The live product changes again] → Timestamp measured contracts, keep the audit script state-based, and require a fresh reference pass before updating numeric values.
- [Responsive collapse changes user expectations] → Preserve explicit reopen controls, keyboard focus restoration, and both mobile open/closed test paths.
- [Shared primitive changes affect unrelated consumers] → Add named variants instead of changing defaults and test every modified consumer.
- [Playwright introduces runtime cost] → Keep a focused parity project and fixed high-value viewport/state matrix; retain fast unit checks separately.
- [Concurrent `add-block-editor` edits conflict] → Reserve its entity/storage/body contracts, make composition changes in isolated commits, and rebase/coordinate before touching shared content owners.
- [Historical OpenSpec tasks conflict with new measurements] → Validate evidence first, then update/sync superseded requirements rather than marking old checkboxes by assumption.

## Migration Plan

1. Capture reference and localhost baselines without changing data.
2. Introduce the current shell geometry and responsive state policy behind existing component APIs.
3. Move repeated visual states to named shared variants and update shell/sidebar/header consumers.
4. Correct content-level compound controls, panel visibility, localization, and production naming without changing persistence.
5. Add per-object lifecycle coverage for creation, click, write, validation, selected state, projection synchronization, and no duplicate counts.
6. Extract or map reusable lifecycle components and shared variants before applying object-specific behavior.
7. Add unit and Playwright coverage, then run the complete viewport/state matrix.
8. Validate and sync OpenSpec deltas only after browser and source evidence pass.

Rollback is file-level: revert the parity commits while retaining local workspace data because no storage migration occurs.

## Open Questions

None. Mobile navigation open/closed behavior is explicitly stateful, the current authenticated reference is authoritative, and local data remains the content source.
