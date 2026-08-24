## ADDED Requirements

### Requirement: Multiple representations of one object
Supported inline, block, card, embed, and page representations SHALL render the same canonical object without duplicating persisted object state.

#### Scenario: Canonical object changes
- **WHEN** title/properties/content are edited
- **THEN** every visible representation SHALL reflect the same updated object.

### Requirement: Query-backed data views
List, table, gallery/grid, and wall views SHALL consume shared QueryDefinition results and persist presentation configuration only.

#### Scenario: Layout changes
- **WHEN** a result set switches from one layout to another
- **THEN** membership SHALL remain query-defined and object data SHALL remain unchanged.

### Requirement: Structure dashboards and templates
Editable Structures SHALL support configurable dashboard sections and creation templates with fresh object/block identities.

#### Scenario: Template creates object
- **WHEN** a template is chosen
- **THEN** defaults SHALL apply exactly once and new ids SHALL be allocated.

### Requirement: Schema-aware conversion
Conversion SHALL compare source/target schemas and SHALL require explicit handling of incompatible or unmapped values before one atomic commit.

#### Scenario: Unmapped values remain
- **WHEN** source values have no safe target
- **THEN** conversion SHALL not complete until the user maps, explicitly discards, or cancels those values.
