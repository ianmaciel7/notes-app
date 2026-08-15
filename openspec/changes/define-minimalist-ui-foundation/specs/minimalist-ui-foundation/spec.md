## Purpose

Define the shared minimalist visual language and evidence gates that future workspace UI changes must follow.

## ADDED Requirements

### Requirement: Canonical Visual Foundation
The project MUST maintain one canonical design document that defines the shared visual language for workspace UI changes.

#### Scenario: Start a new UI region
- **WHEN** a UI change begins for a workspace region
- **THEN** the change MUST use `docs/DESIGN.md` as its visual foundation
- **AND** any intentional deviation MUST update the canonical guidance explicitly

### Requirement: Content-First Minimalism
Workspace UI MUST prioritize active objects and their meaningful context over decorative or marketing composition.

#### Scenario: Compose an operational workspace view
- **WHEN** a view presents navigation, content, actions, and context
- **THEN** the active content MUST retain the strongest visual hierarchy
- **AND** the view MUST NOT depend on oversized hero type, decorative gradients, nested cards, or ornamental shapes

#### Scenario: Preserve useful density
- **WHEN** repeated actions or related object information are needed during daily work
- **THEN** the interface SHOULD use compact, scannable controls and progressive disclosure
- **AND** minimalism MUST NOT remove necessary state or context

### Requirement: Semantic Visual Roles
UI colors, typography, spacing, shape, and elevation MUST be expressed through shared semantic roles rather than feature-specific decoration.

#### Scenario: Style a component
- **WHEN** a feature component needs a surface, border, state color, spacing, or text treatment
- **THEN** it MUST consume the applicable shared role
- **AND** it MUST NOT duplicate a literal visual palette without a documented exception

#### Scenario: Communicate state
- **WHEN** selection, success, warning, danger, or a relation is shown
- **THEN** the state MUST use an appropriate semantic role
- **AND** color MUST NOT be the only state indicator

### Requirement: Reusable Interaction Primitives
Future UI changes MUST prefer established project primitives for common controls and interaction patterns.

#### Scenario: Add a common control
- **WHEN** a button, tooltip, menu, sheet, tab, input, or scroll area is needed
- **THEN** the implementation MUST first use or extend the applicable shadcn primitive
- **AND** icon controls SHOULD use an established Lucide symbol when available

### Requirement: Responsive And Accessible Baseline
Each UI region MUST preserve readable content, coherent geometry, keyboard access, and visible focus across its supported viewports and states.

#### Scenario: Review responsive behavior
- **WHEN** a region is evaluated on desktop, tablet, and mobile
- **THEN** text and controls MUST remain inside their containers without incoherent overlap or page-level horizontal overflow
- **AND** the active content MUST remain usable as secondary regions collapse or move

#### Scenario: Review an interactive control
- **WHEN** a control is reachable by pointer
- **THEN** an equivalent keyboard path MUST exist
- **AND** focus, accessible naming, and reduced-motion behavior MUST be verifiable where applicable

### Requirement: Gated UI Delivery
The project MUST divide UI delivery into small region-owned changes and require evidence before advancing to the next region.

#### Scenario: Complete a UI stage
- **WHEN** a region's implementation is proposed as complete
- **THEN** its strict OpenSpec validation, focused automated checks, browser screenshots, keyboard review, and reachable state review MUST be recorded
- **AND** the next region MUST wait for user confirmation

#### Scenario: Plan later regions
- **WHEN** future UI regions are known but the current region is not confirmed
- **THEN** later regions MAY remain roadmap entries
- **AND** full implementation artifacts SHOULD NOT be created prematurely
