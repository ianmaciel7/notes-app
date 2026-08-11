## ADDED Requirements

### Requirement: Reference Control Inventory
The reference audit SHALL inventory reachable interactive controls, including buttons, icon buttons, links, menu items, fields, pickers, tabs, panel controls, keyboard commands, and contextual actions.

#### Scenario: Auditor encounters an interactive surface
- **WHEN** the auditor reaches a reference application surface or opens one of its menus, dialogs, panels, editors, or settings sections
- **THEN** every relevant control is recorded with its surface, visible label or accessible name, precondition, interaction method, observed result, and evidence link

#### Scenario: A control cannot be safely or technically exercised
- **WHEN** a control requires an unavailable plan, permission, integration, credential, or consequential confirmation
- **THEN** the control remains in the inventory as BLOCKED with the exact constraint and the last safely observed state

### Requirement: Post-Interaction Outcome Inventory
The reference audit SHALL record what each safely exercised control does after interaction, not only that the control exists.

#### Scenario: Auditor activates a safe control
- **WHEN** the auditor clicks, presses Enter or Space, selects, drags, types into, or otherwise safely activates a reachable control
- **THEN** the audit records the before state, trigger method, immediate feedback, resulting UI or data state, focus destination, persistence across refresh when relevant, cancellation or undo behavior when offered, and evidence link

#### Scenario: Auditor opens a transient surface
- **WHEN** an interaction opens a menu, popover, command palette, dialog, sheet, tooltip, date picker, object picker, hover card, contextual toolbar, or side panel
- **THEN** the audit records open behavior, available actions, hover and selected item treatment, keyboard navigation, close behavior, and whether partial input is discarded or preserved

#### Scenario: Auditor exercises a disabled or unavailable action
- **WHEN** a visible action is disabled, permission-gated, plan-gated, or unavailable for the current object state
- **THEN** the audit records the disabled visual treatment, accessible explanation if present, tooltip or upsell behavior if present, and confirms that no partial mutation occurs

### Requirement: Interaction-State Evidence
The reference audit SHALL inspect normal, hover, focus-visible, active or pressed, selected, disabled, loading, empty, success, and error states wherever those states are applicable and safely reachable.

#### Scenario: Auditor exercises a control state
- **WHEN** pointer, keyboard, data, or network conditions expose an applicable interaction state
- **THEN** the audit records the visual treatment, behavioral effect, transition or timing behavior, keyboard semantics, and relative evidence link

#### Scenario: Auditor verifies hover behavior
- **WHEN** hovering reveals a tooltip, affordance, row action, drag handle, inline toolbar, hover card, preview, or related control
- **THEN** the revealed behavior is recorded with its trigger area, delay if observable, dismissal behavior, layout impact, and whether the revealed control can be operated by keyboard

#### Scenario: A state cannot be produced without harmful side effects
- **WHEN** producing a state would require billing, credential changes, external publication, destructive action, or access outside the synthetic workspace
- **THEN** the state is classified as BLOCKED or UNKNOWN and is not simulated as CONFIRMED

### Requirement: Observed Object Lifecycle Audit
The reference audit SHALL cover relevant object types using synthetic content and safe fixtures.

#### Scenario: Auditor verifies an available object type
- **WHEN** an observed object type can be created in the synthetic workspace
- **THEN** the auditor creates it, enters representative type-specific content, exercises available fields and controls, verifies save or autosave, reloads the application, reopens the object through navigation or search, and records evidence for each lifecycle stage

#### Scenario: An observed type is unavailable
- **WHEN** an object type cannot be created because of plan, permission, application state, or reference limitations
- **THEN** that type is recorded as BLOCKED with the attempted entry point, observed response, and constraint instead of being omitted

### Requirement: Evidence Confidence Classification
Every audited behavior SHALL be classified as CONFIRMED, INFERRED, UNKNOWN, or BLOCKED, and only direct repeatable observation SHALL qualify as CONFIRMED.

#### Scenario: Behavior is directly observed
- **WHEN** the auditor performs an interaction and observes its result in the authenticated reference application
- **THEN** the behavior is marked CONFIRMED with the date, preconditions, reproducible steps, result, and relative evidence link

#### Scenario: Evidence is incomplete
- **WHEN** a behavior is deduced from labels or adjacent behavior, has not been exercised, produces an ambiguous result, or cannot be reached
- **THEN** it is marked INFERRED, UNKNOWN, or BLOCKED as appropriate, with rationale and the next verification action

### Requirement: Consequential-Action Safety Boundaries
The reference audit SHALL stop before actions that incur charges, change passwords or authentication, generate or revoke API credentials, authorize OAuth providers, publish content externally, invite real users, or destructively affect non-synthetic data.

#### Scenario: Auditor reaches a consequential confirmation
- **WHEN** a billing, password, API, OAuth, external publication, sharing, integration, or destructive flow reaches its final consequential action
- **THEN** the auditor captures the safely visible state, cancels or closes the flow, and records the remaining behavior as BLOCKED pending explicit human authorization

### Requirement: Repository-Safe Evidence References
OpenSpec audit artifacts SHALL reference screenshots, traces, fixtures, and supporting research using relative Markdown links and SHALL never contain secrets or OS-specific absolute paths.

#### Scenario: Evidence is linked from an audit artifact
- **WHEN** an observation cites a screenshot, trace, fixture, or research record
- **THEN** the citation uses a repository-relative path that remains valid for another contributor checking out the project
