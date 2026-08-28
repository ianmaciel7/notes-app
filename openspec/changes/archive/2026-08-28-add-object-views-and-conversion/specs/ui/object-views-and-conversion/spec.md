## ADDED Requirements

### Requirement: Object Views are distinct representations
Supported inline, link-block, small-card, wide-card, embed, and page representations SHALL render the same canonical object without duplicating persisted object state.

#### Scenario: Object representation changes
- **WHEN** an object is rendered as inline, link-block, card, embed, or page
- **THEN** each representation SHALL read from the same canonical object record.

### Requirement: Data Views are query-backed and distinct from Object Views
List, table, gallery, wall, and supported embedded Data Views SHALL consume shared QueryDefinition results and persist presentation configuration only.

#### Scenario: Data layout changes
- **WHEN** a result set switches between supported Data View layouts
- **THEN** membership SHALL remain query-defined and object data SHALL remain unchanged.

### Requirement: Ambiguous grid is not a canonical view kind
The canonical contract SHALL NOT use `grid` as a generic persisted alias when documented gallery and wall semantics are distinct.

#### Scenario: Legacy grid configuration is read
- **WHEN** persisted Structure presentation contains a legacy `grid` value
- **THEN** the canonical runtime presentation SHALL normalize it to a supported non-`grid` view kind.

### Requirement: Contextual Graph View is separate
The focused-object graph SHALL derive from canonical relationships/linking and SHALL not be stored as a generic Data View layout.

#### Scenario: Focused graph is opened
- **WHEN** a user opens the graph for a focused object
- **THEN** the graph SHALL be represented as a separate surface instead of a persisted Data View layout.

### Requirement: Structure presentation includes page-layout concerns
Custom Structures SHALL be able to configure supported page/object presentation independently from query-backed Data View layout.

#### Scenario: Page layout changes
- **WHEN** a custom Structure changes page layout settings
- **THEN** query-backed Data View layout configuration SHALL remain unchanged.

### Requirement: Structure dashboards and templates
Editable Structures SHALL support configurable dashboard sections and creation templates with fresh object/block identities.

#### Scenario: Template is instantiated
- **WHEN** a creation template is used for a Structure
- **THEN** the resulting object and blocks SHALL receive fresh identities.

### Requirement: Schema-aware conversion
Conversion SHALL compare source/target schemas and require explicit handling of incompatible or unmapped values before one atomic commit.

#### Scenario: Conversion contains incompatible values
- **WHEN** a conversion plan contains incompatible or unmapped source values
- **THEN** conversion SHALL remain uncommitted until each value has an explicit resolution.
