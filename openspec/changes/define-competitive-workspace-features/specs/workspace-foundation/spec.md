## ADDED Requirements

### Requirement: Product Visual System
The workspace SHALL use a calm product visual system with neutral surfaces, compact typography, low-contrast borders, restrained selected colors, small radii, minimal static elevation, and accessible density.

#### Scenario: Workspace renders on desktop
- **WHEN** a user opens an authenticated workspace route
- **THEN** the shell, controls, panels, menus, typography, and spacing use shared semantic product tokens rather than marketing-page styles

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

### Requirement: shadcn Composition
Common controls, overlays, forms, navigation, and data display SHALL compose applicable existing source components from `src/components/ui` instead of recreating equivalent primitives with custom markup.

#### Scenario: Existing primitive covers the interaction
- **WHEN** a workspace surface needs a button, input, field, select, menu, dialog, sheet, popover, tooltip, command surface, tab, sidebar, table, empty state, scroll area, separator, or related common primitive
- **THEN** the implementation composes the existing shadcn source component and preserves its accessibility, focus, keyboard, overlay, and state behavior

#### Scenario: No appropriate primitive exists
- **WHEN** installed shadcn source components cannot express a required interaction or semantic structure
- **THEN** custom markup is allowed only with a recorded justification covering the missing primitive, accessibility, interaction behavior, tests, and maintenance ownership

### Requirement: Feature-Owned Styling
Global styles SHALL remain the standard shadcn/Tailwind baseline, and workspace-specific selectors, tokens, layout rules, component variants, and responsive behavior SHALL live in the owning workspace feature module.

#### Scenario: Product styling is introduced
- **WHEN** an implementation adds workspace-specific visual behavior
- **THEN** the behavior is colocated with the owning feature and does not turn `src/app/globals.css` into the workspace stylesheet

### Requirement: Complete Interaction States
Every interactive control SHALL provide visually coherent hover, focus-visible, active, selected, disabled, loading, empty, and error states where applicable.

#### Scenario: User changes input method
- **WHEN** a control is reached by pointer, keyboard, or assistive technology
- **THEN** its state remains perceivable without layout shift or reliance on color alone

### Requirement: Theme and Viewport Support
The workspace SHALL support light and dark themes and responsive desktop, tablet, and mobile layouts without overlapping or hiding required content.

#### Scenario: Viewport or theme changes
- **WHEN** the user changes theme or crosses a supported breakpoint
- **THEN** content hierarchy, keyboard access, readable line length, panel order, and control labels remain intact

### Requirement: Canonical Design Documentation
`docs/DESIGN.md` SHALL describe the accepted current UI baseline and SHALL be updated through OpenSpec when a workspace product design system is accepted.

#### Scenario: Workspace design system is accepted
- **WHEN** workspace foundation requirements move from proposed behavior into implemented behavior
- **THEN** `docs/DESIGN.md` is updated to describe the product visual system, shadcn composition rules, accessibility expectations, responsive behavior, and boundaries between global baseline styles and feature-owned workspace styling

#### Scenario: Design documentation conflicts with implementation
- **WHEN** `docs/DESIGN.md` describes unavailable tokens, components, layouts, or visual states
- **THEN** the documentation is corrected or the missing implementation is added before the design guidance is treated as canonical
