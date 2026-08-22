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

### Requirement: Evidence-backed parity completion
The change SHALL be considered complete only after source checks and browser evidence confirm the same required states.

#### Scenario: Browser parity suite runs
- **WHEN** the implementation is evaluated at 1536px, 1280px, 1024px, 768px, 480px, and 390px
- **THEN** real-browser checks SHALL cover default, hover, focus-visible, selected, menu, submenu, post-click, mobile-overlay, and reduced-motion states
- **AND** computed geometry/style assertions SHALL supplement screenshots
- **AND** the browser console SHALL contain no implementation errors.

#### Scenario: Final source verification runs
- **WHEN** implementation tasks are ready to complete
- **THEN** focused tests, TypeScript, lint/format checks, production build, locale coverage, strict OpenSpec validation, and route HTTP checks SHALL pass
- **AND** any pre-existing or unrelated failure SHALL be reported without modifying unrelated files.
