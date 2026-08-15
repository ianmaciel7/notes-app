## Purpose

Define the first responsive workspace navigation region for the Portuguese, object-centric studio.

## ADDED Requirements

### Requirement: Workspace Navigation Region

The application MUST provide a primary workspace navigation region with a stable accessible name and real route links.

#### Scenario: Render the desktop navigation

- **WHEN** a user opens a workspace route at a desktop viewport
- **THEN** the application MUST render a navigation landmark named `Navegação principal`
- **AND** the navigation MUST expose links for `Hoje`, `Objetos`, `Capturar`, `Revisar`, `Estudar`, and `Tipos`
- **AND** the navigation MUST keep its own list scrollable when its contents exceed the viewport

#### Scenario: Follow a destination

- **WHEN** a user activates one of the navigation links
- **THEN** the application MUST navigate to that link's route using a real link
- **AND** the destination MUST remain available without requiring client-side data or authentication state

### Requirement: Workspace Identity

The sidebar MUST present a compact workspace identity separate from the navigation list.

#### Scenario: Identify the current workspace

- **WHEN** the sidebar is visible
- **THEN** it MUST show a workspace name and a short workspace label
- **AND** the identity block MUST use the shared design tokens
- **AND** it MUST NOT occupy hero-scale space or compete with the active content region

### Requirement: Active Destination

The navigation MUST communicate the current route through semantic and visible state.

#### Scenario: Mark the current route

- **WHEN** the current URL matches a navigation destination
- **THEN** the matching link MUST expose `aria-current="page"`
- **AND** the matching link MUST have a visible selected treatment distinct from inactive links
- **AND** the selected treatment MUST remain understandable without color alone

#### Scenario: Match a nested route

- **WHEN** the current URL is a child route of a navigation destination
- **THEN** the parent destination MUST remain marked as the active navigation item

### Requirement: Responsive Navigation

The application MUST preserve access to the same navigation model on narrow viewports.

#### Scenario: Open navigation on mobile

- **WHEN** a user opens the workspace below the desktop navigation breakpoint
- **THEN** the persistent sidebar MUST not create page-level horizontal overflow
- **AND** a menu control with an accessible name `Abrir navegação` MUST be available
- **AND** activating the control MUST open the navigation in a left-side panel

#### Scenario: Close navigation on mobile

- **WHEN** the mobile navigation panel is open
- **THEN** the user MUST be able to close it with an explicit close control
- **AND** the user MUST be able to close it with the Escape key
- **AND** focus MUST remain within a coherent keyboard order

### Requirement: Accessible Sidebar Controls

All sidebar navigation and controls MUST be usable with keyboard and assistive technology.

#### Scenario: Navigate with the keyboard

- **WHEN** a user tabs through the sidebar
- **THEN** each destination and control MUST be reachable in visual order
- **AND** each focused item MUST have a visible focus indicator
- **AND** icon-only controls MUST expose an accessible label

#### Scenario: Respect reduced motion

- **WHEN** the user prefers reduced motion
- **THEN** opening, closing, and active-state transitions MUST not require animation to understand or operate the navigation
