## ADDED Requirements

### Requirement: Component parity evidence is correlated and reusable
Every component audit that may inform specs or implementation SHALL persist a sanitized evidence bundle correlating the reference and localhost baseline, action matrix, DOM/accessibility state, geometry/style observations, runtime state, and smallest useful visual captures.

#### Scenario: A new matched audit is captured
- **WHEN** existing evidence is stale, semantically mismatched, incomplete, or contradicted by current live behavior
- **THEN** the new bundle SHALL record the refresh reason, source, capture time, viewport, route, semantic selection, persisted layout state, interactions, artifact inventory, confidence, redactions, freshness, and limitations
- **AND** earlier capture identities SHALL remain immutable.

#### Scenario: Authenticated content is persisted
- **WHEN** reference evidence contains private or unrelated workspace content
- **THEN** the bundle SHALL omit or redact that content, cookies, tokens, storage values, authenticated exports, and complete third-party bundles
- **AND** any confidence loss caused by redaction SHALL be recorded.

### Requirement: Evidence distinguishes DOM presence from visible usability
Evidence SHALL record both semantic DOM state and rendered viewport geometry for controls that may be clipped, overlapped, transparent, off-screen, or otherwise unusable.

#### Scenario: A control exists outside the visible surface
- **WHEN** a control is present in the DOM but its rectangle is clipped or outside the viewport
- **THEN** the evidence SHALL classify it as a visible-usability failure rather than a successful render.

### Requirement: Responsive evidence proves each breakpoint independently
Responsive parity evidence SHALL record requested and effective viewport, document client and scroll dimensions, visible surface geometry, off-screen focusable controls, overlay-open state, and close recovery independently for every required breakpoint.

#### Scenario: Document width passes but a child control is clipped
- **WHEN** `scrollWidth === clientWidth` but a required focusable control starts at or beyond `innerWidth`
- **THEN** the breakpoint SHALL be recorded as a containment failure
- **AND** the passing document-width metric SHALL not override the child-control evidence.

### Requirement: Confirmed parity contracts update canonical documentation
Stable design and verification rules derived from a current matched audit SHALL be synchronized into the repository's canonical design and testing documentation, while volatile measurements remain in the timestamped evidence index.

#### Scenario: Current evidence supersedes an older documented baseline
- **WHEN** a newer matched bundle confirms geometry or interaction behavior that differs from an older documentation baseline
- **THEN** `docs/DESIGN.md`, `docs/TESTING.md`, and the relevant reference index SHALL be updated in the same planning change
- **AND** historical measurements SHALL be labeled as historical rather than silently deleted or presented as current.
