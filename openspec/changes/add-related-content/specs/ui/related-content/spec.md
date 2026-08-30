## ADDED Requirements

### Requirement: Object pages show the closest five available results

Eligible object pages SHALL show at most five current Related Content results below the notes and SHALL provide a side-panel path to additional results.

#### Scenario: More than five results exist
- **WHEN** the inline surface has five results and continuation is available
- **THEN** a keyboard-operable More action SHALL open additional results in the side panel without leaving the current object.

### Requirement: Related Content states are truthful

Loading, empty, unsupported, unavailable, offline fallback, stale, partial, and provider-error states SHALL be visually and semantically distinct.

#### Scenario: Object type does not support Related Content
- **WHEN** the provider declares the current object ineligible
- **THEN** the UI SHALL show or omit the surface according to the product contract
- **AND** it SHALL not fabricate an empty successful result set.
