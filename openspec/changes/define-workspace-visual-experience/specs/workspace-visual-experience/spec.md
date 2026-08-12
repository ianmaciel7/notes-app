## ADDED Requirements

### Requirement: Capacities Reference Is Authoritative
The authenticated Capacities route supplied for this change SHALL be the visual and behavioral source of truth. A local behavior or style SHALL NOT be accepted merely because it is similar, aesthetically coherent, or already implemented.

#### Scenario: Reviewer compares the applications
- **WHEN** the reference and localhost are placed side by side in the same viewport and state
- **THEN** every reproducible difference in appearance, wording, geometry, typography, iconography, state, motion, overlay, scrolling, or interaction remains pending work until matched or documented as technically infeasible

#### Scenario: Reference evidence is unavailable
- **WHEN** a state cannot be reached safely or inspected reliably
- **THEN** the state remains explicitly unverified and the implementation does not invent behavior and call it parity

### Requirement: Inspected Desktop Geometry
At the inspected 1536 px desktop width, the workspace SHALL reproduce the measured reference geometry within normal browser subpixel tolerance.

#### Scenario: Authenticated object renders at desktop width
- **WHEN** the target object opens with the graph panel visible
- **THEN** the sidebar is 288 px wide, the top rail is 46 px high, the editor begins near x=298/y=46 at about 772 px width, and the graph begins near x=1080/y=46 at about 446 px width
- **AND** both cards use about 12 px radii, a subtle 0.8 px border, the observed bottom inset, and independent internal behavior

### Requirement: Exact Authenticated Object Presentation
The local target state SHALL reproduce the visible identity and content of the authenticated reference object rather than substitute sample content.

#### Scenario: Target object opens
- **WHEN** the workspace finishes rendering
- **THEN** it shows workspace `Tech`, the wolf object identity, type `Página`, title `ADK 2.0: referência rápida de conceitos, ferramentas e comandos`, the observed properties, the exact visible Portuguese editor content, and the matching graph context

### Requirement: Measured Visual Tokens
The desktop light theme SHALL derive its shell, surfaces, borders, text hierarchy, and hover treatment from directly measured reference values.

#### Scenario: Light workspace renders
- **WHEN** no transient overlay is active
- **THEN** the shell/sidebar background is `oklch(0.9856 0.0016 67)`, editor/graph surfaces are `oklch(1 0.0001 263.28)`, the subtle border is `oklch(0.9163 0.0017 67.07)`, and primary/secondary/muted text use the measured values recorded in the design

#### Scenario: Pointer hovers a reference row
- **WHEN** a hoverable sidebar row is under the pointer
- **THEN** it uses the measured `oklch(0.9676 0.0016 67.02)` hover surface, 8 px radius, matching foreground treatment, and reference-timed contextual-control reveal without shifting layout

### Requirement: Reference Typography
The workspace SHALL match the reference's Inter-based typography, hierarchy, wrapping, clipping, and editable text presentation.

#### Scenario: Object title renders
- **WHEN** the authenticated object is visible at the inspected desktop width
- **THEN** its editable title uses Inter at 30 px/33 px and weight 700, wraps to the same two lines, and uses the observed margins and content width

#### Scenario: Editor body renders
- **WHEN** the user reads or scrolls the document
- **THEN** body text uses the reference 16 px/24 px treatment and headings, lists, properties, code blocks, and embedded media retain their observed type metrics and spacing

### Requirement: Product Visual System
The workspace SHALL use a calm product visual system with neutral surfaces, compact typography, low-contrast borders, restrained selected colors, small radii, minimal static elevation, and accessible density.

#### Scenario: Workspace renders on desktop
- **WHEN** a user opens an authenticated workspace route
- **THEN** the shell, controls, panels, menus, typography, and spacing use shared semantic product tokens rather than marketing-page styles

### Requirement: Studio for the Mind Aesthetic
The workspace SHALL express a "Studio for the Mind" aesthetic that prioritizes calm thought, semantic connection, and object relationships over productivity-dashboard density or heavy folder hierarchy.

#### Scenario: User scans the workspace
- **WHEN** an authenticated workspace renders
- **THEN** object identity, relationships, backlinks, graph/context affordances, and semantic grouping are visually legible without relying on heavy chrome, nested folder trees, KPI/dashboard framing, or decorative marketing effects

#### Scenario: User interprets workspace structure
- **WHEN** the UI represents where an idea belongs
- **THEN** it emphasizes connected objects, typed relationships, collections, backlinks, and contextual panels over the impression that ideas are files buried inside folders

### Requirement: Lightweight Semantic Visual Hierarchy
The workspace SHALL use lightweight visual hierarchy where object identity, semantic connections, hover states, relation cues, and contextual panels guide the user's eye instead of heavy dashboard framing.

#### Scenario: Interface is visually reviewed
- **WHEN** a reviewer evaluates the workspace appearance
- **THEN** the UI reads as a network of connected objects, not files inside folders or KPI cards inside a productivity dashboard

#### Scenario: Object connection is visually implied
- **WHEN** an object surface appears near backlinks, relation chips, graph cues, collection membership, or semantic suggestions
- **THEN** spacing, grouping, hover, focus, and subtle connector treatments reinforce the relationship without adding decorative clutter

### Requirement: Workspace Color Tokens
The workspace SHALL define product color tokens from measured reference evidence, with unmeasured accents remaining provisional until inspected.

#### Scenario: Light theme tokens are applied
- **WHEN** the workspace renders in light theme
- **THEN** it uses the following initial token values unless later reference-audit evidence updates them:
  - `workspace-bg`: `oklch(0.9856 0.0016 67)`
  - `workspace-surface`: `oklch(1 0.0001 263.28)`
  - `workspace-sidebar`: `oklch(0.9856 0.0016 67)`
  - `workspace-border`: `oklch(0.9163 0.0017 67.07)`
  - `workspace-border-strong`: `oklch(0.8643 0.0017 67.13)`
  - `workspace-text`: `oklch(0.2191 0.0058 285.84)`
  - `workspace-text-muted`: `oklch(0.3887 0.0052 301.05)`
  - `workspace-text-subtle`: `oklch(0.5725 0.0051 33.89)`
  - `workspace-hover`: `oklch(0.9676 0.0016 67.02)`
  - selection and accent values: pending direct measurement of the relevant reference states
  - `workspace-danger`: `#b42318`
  - `workspace-warning`: `#a15c07`
  - `workspace-success`: `#2f7d52`

#### Scenario: Dark theme tokens are applied
- **WHEN** the workspace renders in dark theme
- **THEN** it uses values measured from the same reference state, and remains unverified until that state is directly inspected

#### Scenario: Color state is represented
- **WHEN** a UI surface needs hover, selected, focus, disabled, loading, empty, success, warning, danger, or error color treatment
- **THEN** it derives that treatment from the workspace tokens and pairs color with shape, text, iconography, focus ring, or another non-color cue

### Requirement: Complete Interaction States
Every interactive control SHALL provide visually coherent hover, focus-visible, active, selected, disabled, loading, empty, and error states where applicable.

#### Scenario: User changes input method
- **WHEN** a control is reached by pointer, keyboard, or assistive technology
- **THEN** its state remains perceivable without layout shift or reliance on color alone

#### Scenario: User hovers a control
- **WHEN** a pointer rests on an enabled button, icon button, link, menu item, tab, row action, field affordance, panel control, or draggable handle
- **THEN** the hover state communicates affordance, keeps the accessible name and target size stable, and does not reveal unrelated layout-changing content

#### Scenario: User presses a control
- **WHEN** a user activates a control by pointer, keyboard, or assistive technology
- **THEN** the active or pressed state is visible immediately, the resulting behavior matches the control label, and the control exposes loading, completion, error, or unchanged feedback when the result is not instantaneous

### Requirement: Motion and Transition System
The workspace SHALL define restrained motion and transition behavior for navigation, hover reveals, overlays, panel changes, loading, and graph/object relationship feedback.

#### Scenario: UI state changes
- **WHEN** menus, panels, tabs, hover affordances, selected objects, graph focus, loading states, or object transitions appear or disappear
- **THEN** transitions are calm, short, non-blocking, reversible, respect `prefers-reduced-motion`, and do not obscure content or imply a mutation before it happens

#### Scenario: Relationship context changes
- **WHEN** the user focuses a graph node, backlink, relation chip, internal object, or related-content item
- **THEN** motion may clarify the changed context or connection path, but it does not create a misleading spatial hierarchy or prevent immediate interaction

### Requirement: Hover-Revealed Affordances
The workspace SHALL use hover, focus, and selection reveals to expose object actions, relationship handles, inline toolbars, drag handles, and contextual controls without shifting layout or hiding keyboard access.

#### Scenario: User hovers or focuses an object surface
- **WHEN** pointer hover or keyboard focus reaches a row, block, card, graph node, sidebar object, relationship chip, or panel item
- **THEN** any revealed controls appear in stable reserved space or an overlay layer, have accessible names, maintain target size, and remain reachable without pointer-only behavior

### Requirement: Depth Transparency and Effects
The workspace SHALL use depth, transparency, blur, borders, shadows, and backdrop effects only to communicate active layers, semantic grouping, drag/drop targets, selected context, and transient surfaces.

#### Scenario: Layered surface appears
- **WHEN** an overlay, hover card, popover, command palette, side panel, graph layer, drag preview, or active object surface appears
- **THEN** visual effects distinguish layer and relationship without one-note decorative palettes, excessive glassmorphism, heavy shadows, or obscuring underlying content

#### Scenario: Semantic grouping is shown
- **WHEN** related objects, backlinks, collections, tags, or graph neighborhoods are grouped visually
- **THEN** depth and transparency support the semantic connection rather than creating arbitrary hierarchy or visual weight

### Requirement: Pointer and Keyboard State Parity
Hover-only aesthetics SHALL have keyboard and assistive-technology equivalents.

#### Scenario: User navigates without pointer
- **WHEN** the user reaches an element that normally exposes visual affordances on hover
- **THEN** focus-visible or selected state exposes equivalent controls, descriptions, and relationships without requiring pointer movement
