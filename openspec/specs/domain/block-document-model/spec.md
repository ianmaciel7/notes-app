# block-document-model Specification

## Purpose
Defines the stable, vendor-neutral block document contract used by workspace objects, including referenceable block identity, safe duplication, lookup, and backward-compatible migration.

## Requirements

### Requirement: Stable referenceable block identity
Every referenceable persisted block SHALL have a stable unique id within its object document.

#### Scenario: Existing block changes
- **WHEN** the user edits, formats, or reorders an existing logical block
- **THEN** its BlockId SHALL remain unchanged.

### Requirement: Safe new block identity
New logical blocks SHALL receive new collision-free ids and duplicated or externally pasted content SHALL not reuse source ids unsafely.

#### Scenario: Block is duplicated
- **WHEN** an existing block is duplicated
- **THEN** the duplicate SHALL receive a new id while preserving equivalent content.

### Requirement: Vendor-neutral lookup and migration
The domain SHALL resolve stable BlockId values without editor-vendor types and SHALL migrate current valid documents without losing visible content.

#### Scenario: Legacy document is migrated
- **WHEN** a current document without ids is loaded
- **THEN** ids SHALL be assigned while preserving node order, text, marks, and supported attributes.
