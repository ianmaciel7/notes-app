## ADDED Requirements

### Requirement: Number formatting is validated presentation metadata

Typed number properties SHALL preserve a finite raw numeric value and MAY define number, percent, currency, or progress presentation without changing comparison or calculation semantics.

#### Scenario: Number is displayed as percent
- **WHEN** raw value `1` uses percent presentation
- **THEN** it SHALL display as 100 percent according to locale and decimal settings
- **AND** sorting, filtering, formulas, and storage SHALL continue using raw value `1`.

### Requirement: Format-specific options are bounded

Fixed decimals, currency code, progress steps, and progress color SHALL validate against their specific contracts.

#### Scenario: Invalid currency config is loaded
- **WHEN** a stored currency code is unsupported or malformed
- **THEN** the value SHALL remain recoverable
- **AND** display SHALL fall back truthfully without corrupting the raw number.

### Requirement: Text format is restricted to table cells

`none/text` presentation MAY be used by Table Block cells but SHALL NOT make a typed number property accept arbitrary text.

#### Scenario: Text is submitted to a number property
- **WHEN** a nonnumeric string is written to a typed number property
- **THEN** validation SHALL fail without replacing the prior numeric value.
