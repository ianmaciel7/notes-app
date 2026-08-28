## ADDED Requirements

### Requirement: Durable media assets
Media objects SHALL reference stable MediaAsset records whose binary content survives application reload independently from temporary browser URLs.

#### Scenario: Media reloads
- **WHEN** a stored asset is reopened after its prior object URL is gone
- **THEN** the app SHALL regenerate a safe preview from durable asset storage.

### Requirement: Validated media lifecycle
Media writes SHALL validate type compatibility, size/storage constraints, and integrity before canonical success is committed.

#### Scenario: Local quota fails
- **WHEN** durable storage rejects the file
- **THEN** the app SHALL expose a recoverable error and SHALL not claim a successful canonical asset.

### Requirement: Reference-safe deletion
Binary bytes SHALL not be physically removed while canonical objects/blocks/properties still reference their MediaAsset.

#### Scenario: Last reference is removed
- **WHEN** no canonical reference remains
- **THEN** idempotent garbage collection MAY remove the blob exactly once.

### Requirement: Media family renderers
Image, PDF, Audio, and generic File objects SHALL expose type-appropriate accessible preview/actions while preserving one canonical object.

#### Scenario: Audio/PDF is opened
- **WHEN** a durable supported asset is selected
- **THEN** an accessible renderer or explicit safe fallback SHALL use the canonical asset.
