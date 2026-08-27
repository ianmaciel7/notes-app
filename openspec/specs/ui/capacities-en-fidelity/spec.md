# capacities-en-fidelity Specification

## Purpose
Define the route-level visual, behavioral, responsive, and evidence-backed acceptance contract for the Capacities-fidelity workspace while preserving local Notes App data.

## Requirements

### Requirement: Deterministic Capacities fidelity acceptance surface
The system SHALL render every supported locale workspace as a deterministic composition matching the current authenticated Capacities interaction and visual contracts while using the user's local Notes App entities, counts, and content.

#### Scenario: Desktop acceptance state
- **WHEN** a user opens a supported locale route at a desktop checkpoint
- **THEN** the page SHALL render the current shell, sidebar, header, selected local object or object-type view, and any route-appropriate contextual surface
- **AND** geometry and states SHALL follow the live reference rather than an earlier fixed `/en` demo composition
- **AND** differences caused solely by local objects, counts, titles, or content SHALL NOT be treated as fidelity failures.

#### Scenario: Acceptance state remains production-owned
- **WHEN** the acceptance composition handles target-state interactions
- **THEN** data and callbacks SHALL use the production workspace provider and local persistence contracts
- **AND** production source SHALL NOT depend on `demo`, `fixture`, product-name-prefixed, or locale-suffixed APIs.

### Requirement: Evidence-governed visual convergence
The implementation MUST resolve visual and behavioral mismatches using the live target first, captured WACZ/JSONL evidence when available, current `dev` contracts, and historical donor branches in that order.

#### Scenario: Conflicting evidence
- **WHEN** a historical donor value conflicts with a measurable live target value
- **THEN** the implementation SHALL use the live value and SHALL document that the donor was not reused for that property.

#### Scenario: Captured corpus unavailable
- **WHEN** the requested WACZ/JSONL files cannot be located
- **THEN** the evaluation SHALL record the evidence gap and SHALL NOT invent bundle-derived measurements or claim that captured-source verification passed.

### Requirement: Canonical modular architecture preservation
The implementation SHALL preserve the current `dev` component architecture, public component APIs, `data-slot` contracts, Base UI/shadcn `base-nova` primitives, Tailwind CSS 4 conventions, configured icon libraries, and neutral shared component ownership.

#### Scenario: Historical donor reuse
- **WHEN** useful behavior or measurements are found in `old`, `old-2`, `old-3`, or `feat/app-sidebar`
- **THEN** only the narrow compatible behavior SHALL be ported into current owners
- **AND** no historical monolith SHALL replace `AppShell` or the split sidebar/header components.

#### Scenario: Primitive customization
- **WHEN** a Capacities-specific mismatch can be corrected in a composition-level component
- **THEN** the correction SHALL stay with the owning application component or a named shared variant
- **AND** low-level primitive defaults SHALL NOT be globally restyled solely for a one-off parity mismatch.

### Requirement: Measured shell and surface fidelity
The expanded desktop composition SHALL match the current target's material geometry, typography, surfaces, spacing, borders, and radii while retaining accessible resize, collapse, and route-dependent panel behavior.

#### Scenario: Expanded desktop shell
- **WHEN** a supported locale renders at 1536px, 1280px, 1024px, or 768px
- **THEN** the sidebar SHALL use the 224px live-reference baseline
- **AND** header rails SHALL use 46px height
- **AND** primary surfaces SHALL use 10px outer or inter-panel spacing, approximately 0.8px semantic borders, and 12px radii
- **AND** long-form content SHALL use a fluid column capped near 800px with current-reference typography
- **AND** `scrollWidth` SHALL equal `clientWidth`.

#### Scenario: Contextual panel visibility changes
- **WHEN** the current route or workspace state does not require a contextual panel
- **THEN** the primary surface SHALL consume the released width
- **AND WHEN** the user opens a supported contextual entry
- **THEN** the panel SHALL appear within valid bounded dimensions without compressing the main surface below its usable minimum.

#### Scenario: Panel resize and collapse
- **WHEN** a user resizes, collapses, or re-expands the sidebar or contextual panel
- **THEN** transitions SHALL remain smooth, triggers SHALL remain usable, content SHALL NOT flash or disappear unexpectedly, and the layout SHALL return to a valid bounded size.

### Requirement: Complete interaction and responsive preservation
The fidelity work MUST preserve keyboard navigation, focus visibility, ARIA semantics, hover/active behavior, menus/popovers/tooltips, tab operations, reduced-motion behavior, and explicit open and closed mobile overlay states.

#### Scenario: Keyboard and pointer states
- **WHEN** a user navigates sidebar actions, tabs, type chips, menus, submenus, and panel controls using keyboard or pointer input
- **THEN** the same actions SHALL remain reachable
- **AND** idle, hover, focus-visible, pressed, open, selected, post-click, and closed states SHALL be perceivable without duplicate accessible names or primary-target interception.

#### Scenario: Responsive desktop layout
- **WHEN** the workspace is evaluated at 1536px, 1280px, 1024px, or 768px
- **THEN** content SHALL remain usable without unintended page overflow
- **AND** desktop panels SHALL collapse or use bounded sizing before the main content or tab strip becomes unusable.

#### Scenario: Responsive mobile layout with navigation closed
- **WHEN** the workspace is evaluated at 480px or 390px with navigation closed
- **THEN** the primary surface SHALL retain approximately 10px outer spacing and a positive usable width
- **AND** navigation and contextual content SHALL remain available from explicit overlay controls.

#### Scenario: Responsive mobile layout with navigation open
- **WHEN** the workspace is evaluated at 480px or 390px with navigation open
- **THEN** navigation SHALL render as a bounded overlay or Sheet above the main surface
- **AND** closing it SHALL restore the full main surface
- **AND** neither state SHALL depend on the zero-sized desktop shell for visible content.

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** resize, collapse, tab, hover, menu, and surface transitions SHALL avoid unnecessary animation while preserving state changes.

### Requirement: Shared reusable workspace components
The workspace SHALL express repeated Capacities-style UI through reusable shared components or named variants before applying them to feature surfaces.

#### Scenario: Shared lifecycle and interaction components are consumed
- **WHEN** sidebar rows, tabs, type chips, creation menus, object option rows, capture surfaces, editors, projection rows/cards, compact menus, popovers, tooltips, and small actions are rendered
- **THEN** they SHALL consume shared component contracts or named variants for geometry, typography, icon treatment, hover, focus-visible, pressed, selected, open, post-click, Escape, outside-click, and reduced-motion behavior
- **AND** production code SHALL NOT duplicate equivalent reference-derived class strings across object-specific components.

#### Scenario: Shared component drift is tested
- **WHEN** implementation is ready for parity acceptance
- **THEN** tests SHALL verify that all modified consumers use the shared contracts and that at least one representative consumer proves each shared state in the browser
- **AND** a component-specific override SHALL be allowed only when current reference evidence proves that the component is intentionally distinct.

### Requirement: Current-reference compound controls
The workspace SHALL reproduce compound-control behavior in which the primary action and disclosure action have separate targets and outcomes.

#### Scenario: Object-type chip text is activated
- **WHEN** the user activates the textual portion of an object-type chip
- **THEN** the workspace SHALL navigate to or activate that type's overview
- **AND** the corresponding sidebar row and workspace tab SHALL become selected.

#### Scenario: Object-type chip disclosure is activated
- **WHEN** the user activates the chip's separate disclosure arrow
- **THEN** a searchable approximately 256px popover SHALL open without navigating
- **AND** its scale or translate transition SHALL complete in approximately 250ms unless reduced motion is preferred.

### Requirement: Shared compact-menu interaction contract
Workspace overflow menus SHALL use one shared visual and behavioral contract for menu surfaces, rows, grouping, shortcuts, destructive actions, focus, and nested submenus.

#### Scenario: Overflow menu opens and closes
- **WHEN** a user opens a workspace overflow menu
- **THEN** the surface SHALL use the shared approximately 268-269px width, 12px radius, 6px padding, and 32px rows
- **AND** initial focus, outside click, and Escape behavior SHALL follow the owning accessible menu primitive
- **AND** opening or closing the menu SHALL NOT mutate workspace data by itself.

#### Scenario: Nested submenu is hovered or focused
- **WHEN** a menu item with nested commands receives hover or keyboard focus
- **THEN** the submenu SHALL open adjacent to the parent after the shared transition
- **AND** the parent SHALL retain its highlighted/open state while the user moves into the submenu
- **AND** destructive items SHALL retain semantic destructive styling.

### Requirement: Shared object-type listing structure
Every selectable object type SHALL use one reusable listing composition with a type header, `Overview` and `All` view controls, and Capacities-style overview sections for recently opened content, collections, and queries.

#### Scenario: Empty object-type overview
- **WHEN** a user opens any object type that has no matching created entities, collections, or queries
- **THEN** `Overview` SHALL be selected and the recently opened, collections, and queries sections SHALL render their localized empty states and creation affordances.

#### Scenario: Recently created object
- **WHEN** an ephemeral object has been created for the selected object type
- **THEN** its title and type badge SHALL appear in the recently opened section and selecting it SHALL reactivate its existing editor tab.

#### Scenario: All objects view
- **WHEN** the user selects `All`
- **THEN** the composition SHALL switch to the complete-list state while preserving the active object-type header and shared actions.

#### Scenario: Reused across object types
- **WHEN** the user switches between different sidebar object types
- **THEN** the same semantic structure and interaction contract SHALL remain present while the label, icon, tone, count, and matching recent entities update for the selected type.

### Requirement: Functional object-type creation and import actions
The object-type listing SHALL connect its visible `New` and `Import file(s)` affordances to the local workspace lifecycle rather than rendering decorative controls.

#### Scenario: Create from the active object type
- **WHEN** a user activates `New` in either the object-type header or empty complete-list state
- **THEN** the workspace SHALL start the existing creation flow for the active object type and SHALL create or request the fields required by that type.

#### Scenario: Import compatible local files
- **WHEN** a user activates `Import file(s)` and selects one or more compatible files
- **THEN** the workspace SHALL create one local entity per accepted file under the active object type, update its count and listing, and activate the last imported entity.

#### Scenario: Reject an incompatible import
- **WHEN** a selected file does not satisfy the active file-backed type's accepted format
- **THEN** the workspace SHALL preserve existing entities, expose a localized error, and allow the user to select a different file.

#### Scenario: Operate the listing toolbar
- **WHEN** a user activates search, collapse, filter, sort, list, grid, recent expansion, settings, or either menu
- **THEN** the associated visible list state SHALL update and every enabled command SHALL perform a concrete local state transition
- **AND** feedback alone SHALL NOT satisfy the command.

#### Scenario: Match listing toolbar glyphs
- **WHEN** the reusable object-type toolbar renders Overview or All state
- **THEN** its view, add, count, filter, sort, list, grid, caret, and settings controls SHALL use the target-measured semantic Phosphor glyph, size, tone, and alignment without changing their accessible names or stateful behavior.

#### Scenario: Configure overview sections
- **WHEN** a user opens overview settings and toggles a visible or hidden section
- **THEN** the corresponding overview section SHALL hide or reappear immediately while the settings control remains keyboard accessible.

#### Scenario: Expand recently opened
- **WHEN** a user activates the recent-section expand control
- **THEN** the composition SHALL open the dedicated complete-list state for recent objects and preserve an accessible path back to Overview.

#### Scenario: Create collection or query
- **WHEN** a user activates the Collection or Query affordance
- **THEN** an untitled sequential local entry SHALL be created, selected, and opened for editing without persistence or backend mutation.

#### Scenario: Pin and open the global New palette
- **WHEN** a user pins the active type or chooses New object from the split menu
- **THEN** the active type SHALL be added to or removed from the provider-owned pinned list, or the existing sidebar New palette SHALL open, respectively.

### Requirement: Evidence-backed parity completion
The change SHALL be considered complete only after source checks and browser evidence confirm the same required states.

### Requirement: Inline Page metadata selection
Page tags and collections SHALL use their visible metadata label as the selector's text-entry control rather than opening a separate generic search dialog.

#### Scenario: Page metadata selector is searched inline
- **WHEN** the user focuses or types in the visible Tags or Collections metadata control
- **THEN** that control SHALL remain the focused inline text input and its selector SHALL open below it without rendering a second search field
- **AND** the selector SHALL use a compact result surface, render only applicable choices and named actions, and avoid a generic empty-state dialog
- **AND** Escape or outside interaction SHALL close the selector and restore focus without mutating the Page.

#### Scenario: Per-iteration rubric
- **WHEN** a visual evaluation iteration completes
- **THEN** each required dimension SHALL record `PASS` or `FAIL`, supporting evidence, the remaining mismatch, and the owning file before the next root-cause fix is selected.

#### Scenario: Convergence stop condition
- **WHEN** all material dimensions pass or five iterations have completed
- **THEN** the loop SHALL stop and any unresolved mismatch SHALL be reported explicitly with evidence rather than hidden.

#### Scenario: Browser parity suite runs
- **WHEN** the implementation is evaluated at 1536px, 1280px, 1024px, 768px, 480px, and 390px
- **THEN** real-browser checks SHALL cover default, hover, focus-visible, selected, menu, submenu, post-click, mobile-overlay, and reduced-motion states
- **AND** computed geometry/style assertions SHALL supplement screenshots
- **AND** the browser console SHALL contain no implementation errors.

#### Scenario: Final source verification runs
- **WHEN** implementation tasks are ready to complete
- **THEN** focused tests, TypeScript, lint/format checks, production build, locale coverage, strict OpenSpec validation, and route HTTP checks SHALL pass
- **AND** any pre-existing or unrelated failure SHALL be reported without modifying unrelated files.
