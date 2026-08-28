## ADDED Requirements

### Requirement: Parity verdicts use matched semantic state
The parity audit SHALL record and align the reference and localhost semantic surface before issuing a visual or behavioral verdict. Equality of the supplied route alone SHALL NOT be treated as proof that the selected workspace tab, object-type view, contextual panel, or persisted layout state matches.

#### Scenario: Persisted tab selection overrides the requested local route
- **WHEN** localhost restores a workspace tab whose content differs from the requested comparison surface
- **THEN** the audit SHALL classify the baseline as a persisted-state mismatch
- **AND** it SHALL select the matching surface without deleting or rewriting local entities before continuing visual comparison.

#### Scenario: Reference and local data differ
- **WHEN** the matched surfaces contain different entity names, counts, or cards
- **THEN** the audit SHALL compare shared shell and control behavior separately
- **AND** it SHALL NOT report the semantic data difference as a visual-parity failure.

### Requirement: Every visible affordance has an evidence row
The parity audit SHALL inventory every visible primary target, nested target, disclosure, tab, field, menu trigger, layout control, card action, and contextual-panel entry on the scoped surface.

#### Scenario: A control supports transient interaction states
- **WHEN** a visible control supports hover, focus, activation, open, Escape close, outside-click close, selected, pressed, expanded, or post-action states
- **THEN** the audit SHALL record each supported state as `action -> reference -> localhost -> verdict -> evidence`
- **AND** unsupported or unsafe states SHALL appear as `not tested` with a reason.

### Requirement: Parity mismatches remain typed
The audit SHALL classify divergences as visual, interaction, data/state, persisted-environment, runtime, or inconclusive rather than collapsing them into a single screenshot verdict.

#### Scenario: A click fires without the promised outcome
- **WHEN** an activation event occurs but the selected view, route, count, panel body, focus target, or persistence outcome does not match the reference contract
- **THEN** the audit SHALL report an interaction or data/state mismatch rather than a pass.

