## ADDED Requirements

### Requirement: Inline object references resolve titles and aliases canonically
Inline `@` reference insertion SHALL search eligible local objects by normalized non-empty title and alias while persisting only stable canonical target identity and preserving surrounding block content.

#### Scenario: Alias resolves to one target
- **WHEN** an object title or any of its aliases matches the normalized `@` query
- **THEN** that object SHALL appear once with its canonical identity and object-type context
- **AND** multiple matching aliases for the same object SHALL NOT create duplicate suggestions.

#### Scenario: User selects an inline object reference
- **WHEN** the user accepts a result for a valid source block range
- **THEN** exactly that trigger range SHALL become one stable reference to the selected target
- **AND** backlink counts, contextual graph projection, and source rendering SHALL update exactly once while surrounding prose and block identity remain unchanged.

#### Scenario: Inline reference insertion is rejected
- **WHEN** the target is missing, reserved, ineligible, or invalid at commit time
- **THEN** no partial reference, graph edge, duplicate object, or content rewrite SHALL be persisted
- **AND** the source block SHALL remain recoverably editable with truthful feedback.

#### Scenario: Target metadata changes
- **WHEN** a referenced target is renamed or its aliases change
- **THEN** the stable reference SHALL continue resolving by canonical identity and render the current target label
- **AND** the source SHALL not need to be rewritten merely to preserve the link.
