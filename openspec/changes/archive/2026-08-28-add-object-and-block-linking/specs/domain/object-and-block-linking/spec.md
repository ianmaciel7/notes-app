## ADDED Requirements

### Requirement: Stable object and block links
Links SHALL target objects and referenceable blocks by stable ids and SHALL survive title changes and block reordering.

#### Scenario: Target object is renamed and source block is reordered
- **WHEN** a reference points to an object id and a BlockId and the target title changes or the source block moves
- **THEN** the link SHALL continue resolving through the stable ids instead of title text or block position.

### Requirement: Derived backlinks, reference counters, and contextual graph
Every canonical forward object/block reference SHALL be discoverable from its target as a backlink, SHALL contribute exactly once to its reference count, and SHALL contribute an edge to the focused object's contextual graph.

#### Scenario: Link is added or removed
- **WHEN** a forward reference changes
- **THEN** backlink, reference count, and contextual graph projections SHALL update without duplicate edges/counts.

### Requirement: Property relations and backlinks are distinct
Object Select/property relations SHALL remain distinguishable from content backlinks even if both are shown in a combined relationship surface.

#### Scenario: Relation and content backlink target the same object
- **WHEN** an object has both an Object Select relation and a content link to the same target
- **THEN** reverse projections SHALL expose separate relation and backlink records without merging ownership or edit behavior.

### Requirement: Source-backed embeds and transclusion
Embeds SHALL resolve canonical source content rather than persist an independent copy; supported editable transclusion SHALL mutate the source identity rather than a detached copy.

#### Scenario: Embedded source content changes
- **WHEN** source content referenced by an embed is edited through a supported transclusion surface
- **THEN** the canonical source object or block SHALL change and the embed SHALL render the updated source content.

### Requirement: Objects Inside projection
The target/source relationship index SHALL support a deterministic projection of objects contained/referenced inside a focused object's content without creating duplicate object records.

#### Scenario: Focused object references nested objects
- **WHEN** a focused object's content references multiple objects
- **THEN** the Objects Inside projection SHALL list each referenced object once using canonical identity.

### Requirement: Explicit unlinked mention conversion
Candidate title/alias mentions SHALL be shown without mutating prose until the user explicitly converts them.

#### Scenario: Candidate mention is reviewed
- **WHEN** prose contains text matching an object title or alias
- **THEN** the mention SHALL remain plain text until the user explicitly converts it to a stable reference.

### Requirement: Graph scope is contextual
The parity graph SHALL be centered on the focused object and derived reachable relationships; a global workspace graph SHALL NOT be required by this change.

#### Scenario: Focused graph is opened
- **WHEN** the user opens graph context for an object
- **THEN** the graph SHALL include reachable relationships for that focused object without requiring a global workspace graph.
