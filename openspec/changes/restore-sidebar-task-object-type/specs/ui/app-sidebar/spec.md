## ADDED Requirements

### Requirement: Required object types survive persisted registry drift
The system SHALL reconcile hydrated Structure registries with the current protected built-in and reserved Structure definitions before projecting sidebar object-type rows.

#### Scenario: Stored registry predates the Task built-in
- **WHEN** a valid persisted workspace registry omits the current built-in `task` Structure
- **THEN** hydration SHALL restore the canonical Task Structure without discarding valid local entities
- **AND** the sidebar SHALL render Task inside `Object types` after Table and before Weblink
- **AND** Task SHALL NOT be added as a separate primary-navigation row.

#### Scenario: Stored registry contains local optional Structures
- **WHEN** hydration restores required built-in and reserved Structures
- **THEN** stored custom and legacy Structures SHALL retain their local metadata and relative order
- **AND** absent optional legacy preset Structures SHALL NOT be recreated merely because they exist in the current preset catalog.
