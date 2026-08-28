## ADDED Requirements

### Requirement: Canonical runtime Structure registry
The system SHALL represent every workspace object type as one canonical runtime Structure with a stable locale-neutral id, ownership kind, singular name, plural name, serializable icon name, tone, lifecycle kind, property definitions, collection references, and reserved presentation configuration.

#### Scenario: Built-in Structure is loaded
- **WHEN** a new or migrated workspace initializes its Structure registry
- **THEN** each supported built-in type SHALL have one deterministic semantic id and `built-in` ownership
- **AND** the registry SHALL NOT classify suggested custom presets as built-in Structures.

#### Scenario: Custom Structure is created
- **WHEN** the user confirms a valid custom object type
- **THEN** the system SHALL create one Structure with a collision-free persistent id and `custom` ownership
- **AND** the Structure SHALL remain addressable without adding its id to a closed TypeScript union.

#### Scenario: Structure metadata is edited
- **WHEN** the user changes a Structure's singular name, plural name, icon name, or tone
- **THEN** the canonical Structure SHALL update exactly once
- **AND** existing objects SHALL observe the new metadata through their Structure reference without duplicating it into every object.

### Requirement: Structure-owned property definitions
The system SHALL store stable property definitions on the owning Structure separately from object property values and block content.

#### Scenario: Property schema is replaced
- **WHEN** a valid ordered set of property definitions is applied to a custom Structure
- **THEN** the Structure SHALL store each definition's stable id, localized-independent name, public value type, writability, multiplicity, and applicable option or target constraints
- **AND** existing objects SHALL resolve the updated definitions from the Structure rather than receiving copied definition records.

#### Scenario: Unsupported schema mutation is requested
- **WHEN** a property definition rename, deletion, or type change cannot preserve existing values safely
- **THEN** the operation SHALL return an explicit domain error without silently deleting or coercing object data.

### Requirement: Objects reference Structures by identity
Every workspace object SHALL reference its owning Structure by id, and object creation SHALL resolve behavior from that Structure's lifecycle kind rather than from a closed object-type id map.

#### Scenario: Runtime custom object is instantiated
- **WHEN** creation is requested for an existing custom Structure
- **THEN** the system SHALL create an object whose Structure id matches that custom Structure
- **AND** it SHALL use the Structure's lifecycle kind without requiring source changes for the new id.

#### Scenario: Unknown Structure is requested
- **WHEN** creation or hydration references a Structure id that is neither registered nor recoverable through the migration policy
- **THEN** the system SHALL reject the operation or enter a localized recovery state
- **AND** it SHALL NOT silently reassign the object, alter counts, or discard content.

### Requirement: Presets create custom Structures
Suggested Book, Person, Area, Meeting, Definition, Idea, Place, Project, Organization, Media, Travel, Quote, and Atomic note definitions SHALL be templates for creating custom Structures rather than fixed internal object types.

#### Scenario: Suggested preset is confirmed
- **WHEN** the user confirms a suggested preset
- **THEN** the system SHALL create a new custom Structure with a new persistent id and cloned preset schema/appearance defaults
- **AND** subsequent edits SHALL affect only the created Structure, not the preset template.

#### Scenario: Same preset is used twice
- **WHEN** the user creates two object types from the same preset
- **THEN** the resulting Structures SHALL have different ids and independent metadata/schema
- **AND** objects created for either Structure SHALL retain the correct Structure reference.

### Requirement: Guarded Structure lifecycle
The system SHALL provide pure create, rename, appearance-update, schema-replace, and delete operations with deterministic validation and no silent data loss.

#### Scenario: Structure with instances is deleted
- **WHEN** deletion is requested for a Structure referenced by one or more objects
- **THEN** deletion SHALL be blocked with an explicit domain error
- **AND** the Structure and every object SHALL remain unchanged.

#### Scenario: Unused custom Structure is deleted
- **WHEN** deletion is requested for a custom Structure with no object instances or dependent collections
- **THEN** the Structure SHALL be removed exactly once
- **AND** built-in and reserved Structures SHALL remain protected from normal deletion.

### Requirement: Backward-compatible Structure persistence
The local workspace snapshot SHALL persist the canonical Structure registry and SHALL migrate v2 data without changing the existing storage key, entity ids, active selection, next id, or block-editor documents.

#### Scenario: Version 2 snapshot is migrated
- **WHEN** a valid v2 snapshot is loaded
- **THEN** migration SHALL inject deterministic built-in and legacy Structure definitions for every referenced object type
- **AND** each entity SHALL retain its existing id, type reference, specialized payload, and complete BlockEditorDocument.

#### Scenario: Version 3 snapshot is reloaded
- **WHEN** a workspace containing a custom Structure and objects is serialized and reloaded
- **THEN** Structure ids, names, icon names, tones, lifecycle kinds, property definitions, object references, counts, and active selection SHALL round-trip without duplication.

#### Scenario: Migration encounters an unsupported record
- **WHEN** a stored Structure or object cannot be validated safely
- **THEN** hydration SHALL use the existing non-destructive recovery contract
- **AND** the parser SHALL NOT partially commit a mixed valid/invalid registry.

