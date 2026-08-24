## ADDED Requirements

### Requirement: Object Views are distinct representations
Supported inline, link-block, small-card, wide-card, embed, and page representations SHALL render the same canonical object without duplicating persisted object state.

### Requirement: Data Views are query-backed and distinct from Object Views
List, table, gallery, wall, and supported embedded Data Views SHALL consume shared QueryDefinition results and persist presentation configuration only.

#### Scenario: Data layout changes
- **WHEN** a result set switches between supported Data View layouts
- **THEN** membership SHALL remain query-defined and object data SHALL remain unchanged.

### Requirement: Ambiguous grid is not a canonical view kind
The canonical contract SHALL NOT use `grid` as a generic persisted alias when documented gallery and wall semantics are distinct.

### Requirement: Contextual Graph View is separate
The focused-object graph SHALL derive from canonical relationships/linking and SHALL not be stored as a generic Data View layout.

### Requirement: Structure presentation includes page-layout concerns
Custom Structures SHALL be able to configure supported page/object presentation independently from query-backed Data View layout.

### Requirement: Structure dashboards and templates
Editable Structures SHALL support configurable dashboard sections and creation templates with fresh object/block identities.

### Requirement: Schema-aware conversion
Conversion SHALL compare source/target schemas and require explicit handling of incompatible or unmapped values before one atomic commit.
