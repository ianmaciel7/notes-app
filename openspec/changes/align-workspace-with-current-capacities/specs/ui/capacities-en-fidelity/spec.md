## MODIFIED Requirements

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

## ADDED Requirements

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
The Page surface SHALL reproduce the matched reference's editable header, body, metadata, commands, contextual navigation, and post-interaction rendering while preserving valid local documents and buffered input performance.

#### Scenario: Page title, body, tags, and collections are edited
- **WHEN** the user edits a Page title or body, or adds/removes tags or collections
- **THEN** the active control SHALL update without keystroke-time persistence work
- **AND** valid pending changes SHALL flush on the bounded idle interval, blur, navigation, unmount, or explicit submit boundary
- **AND** the header, tab, projections, and re-opened Page SHALL render the committed values without duplicate metadata controls.

#### Scenario: Page collections control is activated
- **WHEN** the user activates the visible “Collections” metadata control with pointer or keyboard input
- **THEN** an accessible collection-selection surface SHALL open without navigating away or mutating the Page merely because it opened
- **AND** selecting a collection SHALL add it to the Page exactly once and update the header, collection projection, and persisted entity
- **AND** removing or deselecting a collection SHALL update the same surfaces and persisted entity without leaving a stale chip
- **AND** the control SHALL expose a distinct accessible name and a perceivable open, selected, and empty state.

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
Object-type surfaces, with Table as the first acceptance slice, SHALL render and operate the matched Overview, All, toolbar, empty, import, and destination states through the production-owned route.

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
The contextual panel SHALL render content selected by its tab, menu, or Explore action instead of displaying one static catalog for every route and state.

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
The workspace SHALL use the URL as the default serializable navigation state while preserving local provider and persistence contracts.

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
Every visible interactive control in the accepted Page, Table, object-type, header, sidebar, and contextual surfaces SHALL have a stable accessible name and an observable outcome consistent with that name.

#### Scenario: Command matrix is exercised
- **WHEN** parity acceptance runs
- **THEN** the test evidence SHALL inventory each visible command, activate it by pointer and keyboard where applicable, and assert its post-click render state
- **AND** destructive commands SHALL use isolated disposable fixtures
- **AND** no command SHALL pass solely because a menu opened, a label changed, a legacy selector matched, or a placeholder rendered.

#### Scenario: Interaction survives re-opening
- **WHEN** an action changes canonical object or presentation state
- **THEN** the test SHALL navigate away, reload when persistence is expected, and re-open the affected surface
- **AND** the resulting state SHALL remain usable with no implementation console errors.

### Requirement: Evidence-backed parity completion
The change SHALL be considered complete only after source checks and browser evidence confirm the same required states.

#### Scenario: Browser parity suite runs
- **WHEN** the implementation is evaluated at 1536px, 1280px, 1024px, 768px, 480px, and 390px
- **THEN** real-browser checks SHALL cover default, hover, focus-visible, selected, menu, submenu, post-click, mobile-overlay, and reduced-motion states
- **AND** computed geometry/style assertions SHALL supplement screenshots
- **AND** the browser console SHALL contain no implementation errors.
- **AND** selectors SHALL target the production-owned Page and object-type views without accepting legacy or placeholder fallbacks.

#### Scenario: Final source verification runs
- **WHEN** implementation tasks are ready to complete
- **THEN** focused tests, TypeScript, lint/format checks, production build, locale coverage, strict OpenSpec validation, and route HTTP checks SHALL pass
- **AND** any pre-existing or unrelated failure SHALL be reported without modifying unrelated files.
