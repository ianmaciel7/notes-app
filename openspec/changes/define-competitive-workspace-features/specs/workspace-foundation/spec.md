## ADDED Requirements

### Requirement: Product Visual System
The workspace SHALL use a calm product visual system with neutral surfaces, compact typography, low-contrast borders, restrained selected colors, small radii, minimal static elevation, and accessible density.

#### Scenario: Workspace renders on desktop
- **WHEN** a user opens an authenticated workspace route
- **THEN** the shell, controls, panels, menus, typography, and spacing use shared semantic product tokens rather than marketing-page styles

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
