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
- **THEN** the sidebar SHALL match the timestamped reference width for the same viewport and recorded resize state, including approximately 288px in the audited 1153x912 state
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

#### Scenario: Object-type New disclosure is activated
- **WHEN** the user activates the separate disclosure segment beside the object-type `Novo` action
- **THEN** the workspace SHALL open the type-specific creation-options surface
- **AND** no entity, tab, count, or persisted projection SHALL change until the user selects a creation command.

#### Scenario: Object-type primary New is activated
- **WHEN** the user activates the primary segment of the object-type `Novo` action
- **THEN** the default object creation flow for that type SHALL run exactly once
- **AND** the disclosure surface SHALL NOT open unless that is the documented default flow for the matched reference state.

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

### Requirement: Functional Page parity
Page editing, metadata, header commands, embedded content, related content, collapse, and deletion SHALL perform concrete local workspace behavior while preserving the current reference's visible interaction states.

#### Scenario: Page title, body, tags, and collections are edited
- **WHEN** the user edits a Page title or body, or adds/removes tags or collections
- **THEN** the active control SHALL update without keystroke-time persistence work
- **AND** valid pending changes SHALL flush on the bounded idle interval, blur, navigation, unmount, or explicit submit boundary
- **AND** the header, tab, projections, and re-opened Page SHALL render the committed values without duplicate metadata controls.

#### Scenario: Page collections control is activated
- **WHEN** the user activates the visible "Collections" metadata control with pointer or keyboard input
- **THEN** an accessible collection-selection surface SHALL open without navigating away or mutating the Page merely because it opened
- **AND** selecting a collection SHALL add it to the Page exactly once and update the header, collection projection, and persisted entity
- **AND** removing or deselecting a collection SHALL update the same surfaces and persisted entity without leaving a stale chip
- **AND** the control SHALL expose a distinct accessible name and a perceivable open, selected, and empty state.

#### Scenario: Page metadata selector is searched inline
- **WHEN** the user focuses or types in the visible Tags or Collections metadata control
- **THEN** that control SHALL remain the focused inline text input and its selector SHALL open below it without rendering a second search field
- **AND** the selector SHALL use the reference-sized compact result surface, render only applicable choices and named actions, and avoid a generic empty-state dialog
- **AND** Escape or outside interaction SHALL close the selector and restore focus without mutating the Page.

#### Scenario: Page Tag selector creates or searches an inline query
- **WHEN** the user types a tag name that has no applicable match in the visible Tags input
- **THEN** the compact selector SHALL offer `New '{query}'` and `Search all Tags` using the same reference-sized surface
- **AND WHEN** the user activates `New '{query}'`
- **THEN** the Page SHALL receive the created tag exactly once, the inline query SHALL clear, and the route SHALL remain on the Page
- **AND WHEN** the user activates `Search all Tags`
- **THEN** the full tag picker SHALL open with the query preserved and without route navigation.

#### Scenario: Applied Page Tag is hovered or activated
- **WHEN** a user hovers an applied Page tag
- **THEN** it SHALL retain the reference tag-chip color, compact geometry, and pointer affordance without shifting neighboring metadata
- **AND WHEN** the user activates the tag label
- **THEN** the corresponding Tag object SHALL open without removing the tag from the Page
- **AND** removing a tag, if supported, SHALL use a distinct explicit control.

#### Scenario: Page header metadata and command icons are rendered
- **WHEN** Collections, Customize, and the Page overflow control render in the Page header
- **THEN** Collections SHALL use the reference collection glyph, Customize SHALL combine the reference sparkle and disclosure glyphs, and overflow SHALL use the reference ellipsis glyph
- **AND** each glyph SHALL use the observed 14px visual size and preserve the owning control's accessible name, hover, focus, and open behavior.

#### Scenario: Page overflow control is activated
- **WHEN** the user activates the visible Page overflow control using pointer or keyboard input
- **THEN** the owning accessible menu SHALL open with its named commands available
- **AND** opening the menu SHALL not mutate the Page or silently perform a command
- **AND** closing it with Escape, outside click, or an unavailable command SHALL leave the Page valid and focused recoverably.

#### Scenario: Page customization is activated
- **WHEN** the user activates the visible Page customization affordance from the header or overflow menu using pointer or keyboard input
- **THEN** an accessible customization surface SHALL open
- **AND** applying a supported option SHALL produce an observable Page presentation change that persists after re-opening
- **AND** the customization command SHALL perform the named action or expose a truthful unavailable state; it SHALL NOT terminate at an instructional hint alone.

#### Scenario: Page link or embed action completes
- **WHEN** the user links or embeds another local object in a Page
- **THEN** the produced document SHALL be accepted by the active editor schema
- **AND** the Page SHALL remain editable after navigation, reload, and re-opening
- **AND** the browser console SHALL contain no implementation error.

#### Scenario: Related Page content is rendered
- **WHEN** the Page displays related content
- **THEN** membership and count SHALL derive from an explicit relation, backlink, collection, graph, or documented similarity rule
- **AND** unrelated canonical entities SHALL NOT be presented merely because they occur first in storage order.

#### Scenario: Page editor is collapsed and expanded
- **WHEN** the user collapses the Page editor
- **THEN** the full intended editor region SHALL hide, the command SHALL change to an accurate expand name, and focus SHALL remain recoverable
- **AND WHEN** the user expands it
- **THEN** content, selection, and pending valid edits SHALL be restored without duplication.

#### Scenario: Active Page is deleted
- **WHEN** the user confirms deletion of the active Page
- **THEN** every tab and projection for that entity SHALL be removed
- **AND** the workspace SHALL select an existing valid fallback or the matching object-type view without leaving a stale deleted-object tab.

### Requirement: Functional object-type and Table parity
Object-type overview, complete-list, toolbar, import, table, and destination commands SHALL execute their named local workspace behavior instead of acting as decorative controls.

#### Scenario: Overview and All are selected
- **WHEN** the user selects Overview or All
- **THEN** the selected tab and content SHALL change together
- **AND** Overview SHALL render recently opened, collections, and queries sections as applicable
- **AND** All SHALL render the count and search/filter/sort/layout toolbar applicable to the selected type.

#### Scenario: Atomic note type overview commands are exercised
- **WHEN** the Atomic note type overview is opened from its workspace tab
- **THEN** it SHALL render the type header, separate primary and disclosure New targets, Overview and All tabs, collapse and overflow controls, and the route-appropriate graph panel
- **AND WHEN** search, filter, sort, grouping, or layout is activated
- **THEN** the named input, criterion row, grouping row, or layout menu SHALL appear and produce its corresponding projection state
- **AND** Escape SHALL close transient search, filter, sort, creation, overflow, and layout surfaces without creating an object or changing persisted counts
- **AND** list and gallery selections SHALL produce visibly distinct projections while retaining the same local objects.

#### Scenario: Search, filter, sort, and layout controls are used
- **WHEN** the user activates search, filter, sort, list, gallery, or table controls
- **THEN** each command SHALL expose its named criterion or layout and update the visible projection
- **AND** filter SHALL NOT be a duplicate unlabeled title search
- **AND** sort direction and criterion SHALL remain perceivable after activation.

#### Scenario: Empty Table state is rendered
- **WHEN** the selected Table projection has zero matching objects
- **THEN** the surface SHALL retain the matched reference's centered empty-state illustration, title, explanatory copy, import action, and primary New action
- **AND** choosing table layout SHALL retain meaningful table structure or a documented empty-table affordance rather than bypassing the layout renderer.

#### Scenario: Object-type import is activated
- **WHEN** the user activates Import from the active object-type route
- **THEN** the production-owned view SHALL open the appropriate file chooser
- **AND** accepted, rejected, and cancelled selections SHALL produce localized outcomes without dispatching to a missing legacy input.

#### Scenario: Object-type surface is collapsed and expanded
- **WHEN** the user collapses an object-type surface
- **THEN** the intended toolbar, transient filter/sort controls, and content SHALL hide consistently while preserving state
- **AND WHEN** the user expands it
- **THEN** the prior view, criteria, layout, and focus SHALL be restored.

#### Scenario: Object-type command destination opens
- **WHEN** the user activates type settings, new from template, new collection, or new query
- **THEN** the named destination or workflow SHALL render functional content
- **AND** it SHALL NOT silently reuse ordinary creation or terminate at a `view not ready` placeholder.

### Requirement: Contextual panel dispatch
The workspace SHALL dispatch contextual panel entries through one route-sensitive contract that updates both panel chrome and body content for object and object-type contexts.

#### Scenario: Contextual entry is activated
- **WHEN** the user activates graph, backlinks, objects inside, related content, AI chat, search, or an entity entry
- **THEN** the panel header and body SHALL both switch to the selected contextual view
- **AND** the view SHALL receive the active object or object-type context
- **AND** the same dispatch contract SHALL apply on desktop and mobile overlays.

#### Scenario: Contextual graph controls are exercised
- **WHEN** the graph view is active for an object
- **THEN** the active object SHALL render as the centered node and related local objects SHALL render only when the expanded relation state permits them
- **AND** Show less SHALL hide related nodes without changing canonical relations
- **AND** Show more SHALL restore the available related nodes
- **AND** graph settings SHALL expose completed-task, high-link-object, date, and simplified-graph toggles whose checked states are reversible and do not mutate workspace objects
- **AND** center, zoom out, and zoom in SHALL update the rendered canvas while preserving the active object and relation data
- **AND** pointer dragging SHALL pan the rendered canvas without mutating object or relation data, and center SHALL restore its neutral translation
- **AND WHEN** the graph view is active for an object-type overview with no active object node
- **THEN** the canvas SHALL remain empty while the graph controls remain reachable and functional.

#### Scenario: Explore actions are route-sensitive
- **WHEN** Explore renders for an object-type overview, object editor, or another supported route
- **THEN** it SHALL expose only actions supported by that context, matching the authenticated reference state
- **AND** every visible action SHALL have a working handler or an explicit unavailable state.

### Requirement: Capacities-compatible workspace routes
Workspace navigation SHALL use Capacities-compatible locale and target URLs while keeping section transitions and browser history synchronized with local workspace state.

#### Scenario: Workspace target is addressable
- **WHEN** a supported locale workspace is opened
- **THEN** the route SHALL identify the active space as `/<locale>/<space-id>`
- **AND WHEN** an object or object type is selected
- **THEN** the route SHALL identify it as `/<locale>/<space-id>/<target-id>`
- **AND** reloading that URL SHALL restore the corresponding local selection when the target exists.

#### Scenario: Global section is addressable
- **WHEN** the user opens Calendar, Search, or Explore
- **THEN** the route SHALL preserve the workspace path and encode the section as `?section=calendar`, `?section=search`, or `?section=explore`
- **AND** opening a section SHALL not create or mutate workspace data.

#### Scenario: History navigation restores state
- **WHEN** the user uses browser back or forward after a route transition
- **THEN** the workspace selection and contextual body SHALL follow the resulting URL without a full document reload.

### Requirement: Visible command truthfulness
Visible workspace commands SHALL either perform their named behavior or expose a truthful unavailable state with no hidden data mutation.

#### Scenario: Command matrix is exercised
- **WHEN** parity acceptance runs
- **THEN** the test evidence SHALL inventory each visible command, activate it by pointer and keyboard where applicable, and assert its post-click render state
- **AND** destructive commands SHALL use isolated disposable fixtures
- **AND** no command SHALL pass solely because a menu opened, a label changed, a legacy selector matched, or a placeholder rendered.

#### Scenario: Interaction survives re-opening
- **WHEN** an action changes canonical object or presentation state
- **THEN** the test SHALL navigate away, reload when persistence is expected, and re-open the affected surface
- **AND** the resulting state SHALL remain usable with no implementation console errors.

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

### Requirement: Inline Page metadata selection
Page tags and collections SHALL use their visible metadata label as the selector's text-entry control rather than opening a separate generic search dialog.

#### Scenario: Page metadata selector is searched inline
- **WHEN** the user focuses or types in the visible Tags or Collections metadata control
- **THEN** that control SHALL remain the focused inline text input and its selector SHALL open below it without rendering a second search field
- **AND** the selector SHALL use the reference-sized compact result surface, render only applicable choices and named actions, and avoid a generic empty-state dialog
- **AND** Escape or outside interaction SHALL close the selector and restore focus without mutating the Page.

### Requirement: Evidence-backed parity completion
The change SHALL be considered complete only after source checks and browser evidence confirm the same required states.

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

### Requirement: Reusable Capacities evidence corpus
Capacities fidelity work SHALL reuse a dated, sanitized repository evidence bundle before repeating authenticated live-browser inspection for an already captured component state.

#### Scenario: Existing Capacities bundle covers the comparison
- **WHEN** the bundle matches the target component, viewport, route, persisted resize state, semantic content state, and interaction state
- **THEN** the parity evaluation SHALL use the recorded image, HTML or DOM, computed CSS, and JavaScript behavior evidence
- **AND** SHALL perform live recapture only when freshness or completeness cannot be established.

#### Scenario: Capacities behavior has changed
- **WHEN** live evidence demonstrates that a stored bundle is stale or conflicts with the current reference
- **THEN** the evaluator SHALL preserve the prior capture identity, add or refresh the affected state, update provenance and limitations, and treat the newer confirmed evidence as authoritative.
