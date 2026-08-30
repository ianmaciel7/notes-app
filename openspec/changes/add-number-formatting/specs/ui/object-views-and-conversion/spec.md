## ADDED Requirements

### Requirement: Number presentation is consistent across views

Object pages, small cards, gallery, wall, table views, and Table Blocks SHALL use the same locale-aware number presentation for the same raw value and configuration.

#### Scenario: Formatted number appears in two views
- **WHEN** one property is visible in a card and table view
- **THEN** both SHALL use equivalent display semantics
- **AND** editing either projection SHALL update one canonical raw value.

### Requirement: Progress remains accessible without color

Progress presentation SHALL expose textual value semantics and SHALL not rely on bar length or color alone.

#### Scenario: Progress is read by assistive technology
- **WHEN** a progress-formatted value is rendered
- **THEN** its current value and scale SHALL have an accessible textual representation.
