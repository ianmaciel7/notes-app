## ADDED Requirements

### Requirement: Canonical typed property values
Every workspace object SHALL persist schema-defined values in one canonical map keyed by stable property-definition id.

#### Scenario: Valid value is stored
- **WHEN** a writable property receives a value compatible with its Structure definition
- **THEN** the normalized value SHALL be stored exactly once without copying the definition into the object.

#### Scenario: Invalid property write is attempted
- **WHEN** a write targets an unknown, read-only, wrong-type, wrong-option, or disallowed-relation property value
- **THEN** the operation SHALL return a domain error and SHALL leave the object unchanged.

### Requirement: Runtime custom Structures use the same value model
A custom Structure created at runtime SHALL create, edit, persist, and reload its schema-defined values without adding its id to application source code.

#### Scenario: Mixed custom fields round-trip
- **WHEN** a custom object uses supported text, number, boolean, date, label, entity, URL, and rich-text properties
- **THEN** all valid values SHALL round-trip through persistence and generic editors.

### Requirement: Backward-compatible migration
The next snapshot version SHALL migrate existing valid objects without changing object ids, Structure ids, block documents, or active selection.

#### Scenario: Unsafe legacy value is encountered
- **WHEN** legacy data cannot be mapped without unsafe coercion
- **THEN** hydration SHALL use the existing non-destructive recovery path rather than partially committing data.
