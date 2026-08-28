## Purpose

Define a reusable, traceable, and privacy-safe evidence corpus for comparisons against external user interfaces so agents avoid repeating equivalent browser capture work.

## ADDED Requirements

### Requirement: Existing evidence is discovered before recapture
The workflow SHALL search the repository evidence index and matching source bundle before opening or recapturing an external reference state.

#### Scenario: Matching current evidence exists
- **WHEN** an agent needs to compare a component against an external reference and a bundle covers the same source, viewport, route, semantic state, and interaction
- **THEN** the agent SHALL reuse that evidence and SHALL NOT repeat the equivalent capture solely to rediscover the same values.

#### Scenario: Evidence is missing or stale
- **WHEN** no bundle covers the required state or the recorded source version, timestamp, or limitations make the evidence unsuitable
- **THEN** the agent SHALL capture only the missing or stale states and SHALL record why refresh was required.

### Requirement: Evidence bundles are reproducible and inspectable
Each external-reference evidence bundle SHALL include a manifest that identifies the source, capture time, viewport, route or surface, semantic state, interactions, artifact inventory, provenance, confidence, and known limitations.

#### Scenario: A new comparison state is captured
- **WHEN** an agent records evidence for an external component or site
- **THEN** the bundle SHALL retain the smallest useful combination of screenshots, sanitized HTML or DOM snapshots, computed CSS values, and JavaScript interaction observations or reproduction scripts needed to inspect that state later
- **AND** each artifact SHALL be referenced by the manifest.

#### Scenario: Evidence is consumed later
- **WHEN** another agent reuses a bundle
- **THEN** the agent SHALL be able to determine which state each artifact represents and whether the evidence is sufficient without repeating the original capture sequence.

### Requirement: Captured evidence protects secrets and third-party content
Repository evidence SHALL exclude cookies, tokens, credentials, private storage values, personal content not needed for the comparison, and complete third-party application bundles.

#### Scenario: Captured material contains sensitive or excessive data
- **WHEN** HTML, CSS, JavaScript, network, storage, or image output contains sensitive values or content beyond the scoped comparison
- **THEN** the workflow SHALL redact or omit that material before persistence
- **AND** SHALL retain a limitation note when sanitization reduces the evidence available.

### Requirement: Evidence has a stable repository location
Reusable reference evidence SHALL be stored under the repository's documented evidence roots with source and capture identifiers that do not depend on a particular agent session.

#### Scenario: A bundle is added or refreshed
- **WHEN** evidence is persisted for future work
- **THEN** its manifest and artifacts SHALL use stable relative paths
- **AND** the human-readable reference summary SHALL point to the reusable bundle.

