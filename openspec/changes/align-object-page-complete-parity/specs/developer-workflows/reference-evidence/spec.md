## ADDED Requirements

### Requirement: Object-page parity evidence is complete and correlated
Every object-page parity claim SHALL be backed by a discoverable correlated record that identifies the reference and localhost state, inventories visible affordances, and distinguishes measured, inferred, not-tested, prohibited, and contradicted outcomes.

#### Scenario: Existing object-page evidence is reused
- **WHEN** a stored bundle matches the source, capture date, viewport, route surface, semantic Page state, persisted layout state, and interaction state
- **THEN** the audit SHALL reference that bundle instead of repeating the same browser actions
- **AND** any live refresh SHALL state the missing, stale, inconclusive, or conflicting state that required it.

#### Scenario: A missing object-page state is observed
- **WHEN** header, metadata, property, editor, relationship, related-content, utility, responsive, or transient-surface evidence is missing
- **THEN** the record SHALL correlate the smallest useful DOM/accessibility, rectangle, computed-style, transition, behavior, post-action, console, and sanitized visual evidence
- **AND** it SHALL include `action -> expected reference state -> observed local state -> verdict -> evidence` for every safe visible affordance.

#### Scenario: Reference mutation is unsafe or unnecessary
- **WHEN** exercising a command would create, edit, upload, share, export, delete, or otherwise persist authenticated third-party data
- **THEN** the mutation SHALL remain explicitly `not tested` unless separately authorized and safely reversible
- **AND** the non-mutating menu, disabled, cancellation, confirmation, or pre-commit state SHALL still be recorded when available.

#### Scenario: Evidence is accepted for completion
- **WHEN** object-page parity is claimed complete
- **THEN** initial render, hover, pointer exit, focus-visible, keyboard activation, click, open, Escape/outside close, post-action, persistence, unavailable, reduced-motion, responsive containment, and console state SHALL be passing or explicitly marked unsupported or not tested
- **AND** screenshot resemblance alone SHALL NOT satisfy the claim.
