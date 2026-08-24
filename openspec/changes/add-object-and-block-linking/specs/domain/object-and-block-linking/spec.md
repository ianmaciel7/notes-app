## ADDED Requirements

### Requirement: Stable object and block links
Links SHALL target objects and referenceable blocks by stable ids and SHALL survive title changes and block reordering.

#### Scenario: Linked target changes presentation
- **WHEN** an object is renamed or a referenced block is reordered
- **THEN** every existing reference SHALL still resolve to the same canonical target.

### Requirement: Derived backlinks and contextual graph
Every canonical forward object/block reference SHALL be discoverable from its target as a backlink and local graph edge.

#### Scenario: Link is added or removed
- **WHEN** a forward reference changes
- **THEN** the derived backlink/graph projection SHALL update exactly once without duplicate edges.

### Requirement: Source-backed embeds
Embeds SHALL resolve canonical source content rather than persist an independent copy.

#### Scenario: Embedded source is edited
- **WHEN** source content changes
- **THEN** every embed SHALL render the updated source while preserving the target identity.

### Requirement: Explicit unlinked mention conversion
Candidate title/alias mentions SHALL be shown without mutating prose until the user explicitly converts them.

#### Scenario: Mention is accepted
- **WHEN** the user confirms a detected candidate
- **THEN** the selected text SHALL become a stable object link and surrounding text SHALL remain unchanged.
