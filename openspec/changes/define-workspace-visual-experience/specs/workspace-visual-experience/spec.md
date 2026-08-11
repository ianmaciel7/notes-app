## ADDED Requirements

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

### Requirement: Workspace Color Tokens
The workspace SHALL define product color tokens before implementation, using a neutral object-workspace palette with subtle warm surfaces, restrained blue selection, muted secondary text, and accessible semantic status colors.

#### Scenario: Light theme tokens are applied
- **WHEN** the workspace renders in light theme
- **THEN** it uses the following initial token values unless later reference-audit evidence updates them:
  - `workspace-bg`: `#f7f5f0`
  - `workspace-surface`: `#fffdf8`
  - `workspace-surface-muted`: `#f0eee8`
  - `workspace-sidebar`: `#efede6`
  - `workspace-panel`: `#fbfaf6`
  - `workspace-border`: `#ded9cf`
  - `workspace-border-subtle`: `#ebe6dc`
  - `workspace-text`: `#2b2926`
  - `workspace-text-muted`: `#6f6a61`
  - `workspace-text-subtle`: `#9a9388`
  - `workspace-accent`: `#3f7fba`
  - `workspace-accent-muted`: `#dcecea`
  - `workspace-accent-foreground`: `#123f3a`
  - `workspace-danger`: `#b42318`
  - `workspace-warning`: `#a15c07`
  - `workspace-success`: `#2f7d52`

#### Scenario: Dark theme tokens are applied
- **WHEN** the workspace renders in dark theme
- **THEN** it uses the following initial token values unless later reference-audit evidence updates them:
  - `workspace-bg`: `#1f1d1a`
  - `workspace-surface`: `#292622`
  - `workspace-surface-muted`: `#34302a`
  - `workspace-sidebar`: `#25221f`
  - `workspace-panel`: `#2d2924`
  - `workspace-border`: `#49433b`
  - `workspace-border-subtle`: `#3b362f`
  - `workspace-text`: `#f1eee7`
  - `workspace-text-muted`: `#c4bdb1`
  - `workspace-text-subtle`: `#90877a`
  - `workspace-accent`: `#7ab8ae`
  - `workspace-accent-muted`: `#244540`
  - `workspace-accent-foreground`: `#e7fffb`
  - `workspace-danger`: `#ff8a80`
  - `workspace-warning`: `#f5b461`
  - `workspace-success`: `#8fd4aa`

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
