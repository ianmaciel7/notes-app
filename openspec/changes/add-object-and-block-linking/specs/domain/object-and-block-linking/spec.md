## ADDED Requirements

### Requirement: Stable object and block links
Links SHALL target objects and referenceable blocks by stable ids and SHALL survive title changes and block reordering.

### Requirement: Derived backlinks, reference counters, and contextual graph
Every canonical forward object/block reference SHALL be discoverable from its target as a backlink, SHALL contribute exactly once to its reference count, and SHALL contribute an edge to the focused object's contextual graph.

#### Scenario: Link is added or removed
- **WHEN** a forward reference changes
- **THEN** backlink, reference count, and contextual graph projections SHALL update without duplicate edges/counts.

### Requirement: Property relations and backlinks are distinct
Object Select/property relations SHALL remain distinguishable from content backlinks even if both are shown in a combined relationship surface.

### Requirement: Source-backed embeds and transclusion
Embeds SHALL resolve canonical source content rather than persist an independent copy; supported editable transclusion SHALL mutate the source identity rather than a detached copy.

### Requirement: Objects Inside projection
The target/source relationship index SHALL support a deterministic projection of objects contained/referenced inside a focused object's content without creating duplicate object records.

### Requirement: Explicit unlinked mention conversion
Candidate title/alias mentions SHALL be shown without mutating prose until the user explicitly converts them.

### Requirement: Graph scope is contextual
The parity graph SHALL be centered on the focused object and derived reachable relationships; a global workspace graph SHALL NOT be required by this change.
