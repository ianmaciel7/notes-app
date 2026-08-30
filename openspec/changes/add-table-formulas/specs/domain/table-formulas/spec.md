## ADDED Requirements

### Requirement: Table formulas use a bounded vendor-neutral language

Formula source beginning with `=` SHALL parse into a versioned Notes App-owned AST supporting numeric arithmetic, stable cell/range references, and the approved function/constant catalog without arbitrary code execution.

#### Scenario: Unsupported identifier is parsed
- **WHEN** formula source invokes an unregistered function or identifier
- **THEN** validation SHALL produce a typed formula error
- **AND** no dynamic code SHALL execute.

### Requirement: References resolve to stable table identities

A1 input references SHALL resolve to stable row and column IDs so reordering preserves targets and deletion produces an explicit reference error.

#### Scenario: Referenced row is moved
- **WHEN** a referenced row changes visual position
- **THEN** the formula SHALL continue to target the same row identity
- **AND** displayed A1 notation MAY update to the new position.

### Requirement: Recalculation is deterministic and dependency-aware

Affected formula cells SHALL recalculate in dependency order with typed cycle, reference, syntax, domain, and numeric errors.

#### Scenario: Formula cycle exists
- **WHEN** cells depend on each other cyclically
- **THEN** affected results SHALL expose `#CYCLE!` or its typed equivalent
- **AND** evaluation SHALL terminate within configured bounds.

### Requirement: Supported formula catalog is explicit

The initial catalog SHALL include ABS, AVG, CEIL, COUNT, E, FLOOR, LOG, MAX, MEDIAN, MIN, PHI, PI, PRODUCT, RAND, ROUND, SIGN, SQRT, SUM, and TAU.

#### Scenario: RAND is recalculated
- **WHEN** RAND is evaluated for a stable calculation revision
- **THEN** its result SHALL follow the injected deterministic policy
- **AND** unrelated rendering SHALL not silently change the stored result.

### Requirement: Formula source and result are both preserved

Native storage SHALL preserve editable source and calculation metadata, while display and reduced exports SHALL follow explicit source/result policies.

#### Scenario: Formula has an error
- **WHEN** evaluation fails
- **THEN** the original source SHALL remain editable and recoverable.
