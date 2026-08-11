## ADDED Requirements

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

### Requirement: Action Interaction Contract
Every actionable workspace control SHALL define its precondition, trigger methods, immediate visual feedback, resulting state transition, persistence behavior, cancellation or undo path where applicable, and safe failure behavior.

#### Scenario: User invokes a non-destructive action
- **WHEN** an enabled navigation, opening, filtering, sorting, formatting, panel, view, or selection action is invoked
- **THEN** the UI updates deterministically, the new state is reflected in the relevant URL, tab, panel, selection, or persisted preference when applicable, and keyboard focus moves or remains in a documented accessible location

#### Scenario: User invokes a mutating action
- **WHEN** a create, update, move, archive, restore, duplicate, import, export, share, sync, or AI-assisted mutation is invoked
- **THEN** authorization is checked before commit, the user receives optimistic or confirmed feedback appropriate to the operation, failures are recoverable, and destructive or externally visible actions require confirmation or an explicit undo path

#### Scenario: User opens an overlay action
- **WHEN** a button or command opens a menu, popover, command palette, dialog, sheet, tooltip, date picker, object picker, or settings panel
- **THEN** open and closed states are visible, focus is trapped or managed according to the overlay type, Escape and outside-click behavior are defined, and closing the overlay does not accidentally commit partial data

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
