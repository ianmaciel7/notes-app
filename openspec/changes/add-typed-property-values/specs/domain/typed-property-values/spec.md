## ADDED Requirements

### Requirement: Canonical typed property values
Every workspace object SHALL persist configurable schema-defined values in one canonical map keyed by stable property-definition id.

#### Scenario: Valid value is stored
- **WHEN** a writable property receives a compatible value
- **THEN** the normalized value SHALL be stored exactly once without copying its definition into the object.

### Requirement: Default and normal properties remain distinct
Property definitions SHALL distinguish protected/system/default properties from normal configurable properties and SHALL preserve their ownership rules.

#### Scenario: System-owned timestamp is edited generically
- **WHEN** a generic property editor attempts to write a created/updated timestamp or other read-only default value
- **THEN** the operation SHALL fail without changing the object.

#### Scenario: Metadata property is configured
- **WHEN** a supported configurable property defines name, description/icon metadata, multiplicity, options, or target constraints
- **THEN** those definition attributes SHALL round-trip independently from object values.

### Requirement: Supported property families have explicit values
The typed-value model SHALL cover title/text, aliases or multi-text where modeled, number, boolean/checkbox, date/datetime, label, Object Select/entity relation, rich text/blocks, URL, and supported media/metadata references without untyped arbitrary JSON writes.

#### Scenario: Arbitrary value shape is rejected
- **WHEN** a supported property receives a value that does not match its explicit family shape
- **THEN** validation SHALL fail without writing arbitrary JSON into the object.

### Requirement: Safe property conversion
Changing a property type or schema in a way that may lose information SHALL use an explicit conversion/migration plan and SHALL NOT silently discard the original value.

#### Scenario: Conversion is not lossless
- **WHEN** existing values cannot be represented safely in the requested target type
- **THEN** the original values SHALL remain recoverable until the user maps, confirms discard, or cancels the conversion.

### Requirement: Runtime custom Structures use the same value model
A custom Structure created at runtime SHALL create, edit, persist, and reload supported schema-defined values without adding its id to source code.

#### Scenario: Runtime Structure stores schema values
- **WHEN** a custom Structure is created at runtime with a writable supported property
- **THEN** objects of that Structure SHALL store the property value in the same canonical value map used by built-in Structures.

### Requirement: Backward-compatible migration
The next snapshot version SHALL migrate existing valid objects without changing object ids, Structure ids, block documents, or active selection; unsafe legacy values SHALL use non-destructive recovery rather than partial commit.

#### Scenario: Existing snapshot is upgraded
- **WHEN** a valid prior snapshot is loaded
- **THEN** migration SHALL add canonical typed property values while preserving object ids, Structure ids, block documents, and active selection.
