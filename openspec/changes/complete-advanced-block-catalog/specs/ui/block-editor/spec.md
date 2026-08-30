## ADDED Requirements

### Requirement: Advanced block catalog is creatable and editable

The editor SHALL expose toggle, emoji, highlight, language-aware code, Mermaid, math, group, multi-column/grid, and advanced object block commands through shared catalogs and block controls.

#### Scenario: User groups selected blocks
- **WHEN** an eligible block selection is grouped
- **THEN** one group block SHALL contain the selected blocks in order
- **AND** undo SHALL restore the original top-level structure and selection.

### Requirement: Object blocks support canonical view kinds

An object block SHALL support inline, small card, wide card, and embed/transclusion views, plus documented media variants supported by the target type.

#### Scenario: Embedded object is edited
- **WHEN** a permitted embed view is edited in place
- **THEN** the edit SHALL update the canonical target once
- **AND** every projection SHALL reflect the same object identity.

### Requirement: Advanced blocks are accessible and responsive

Interactive advanced blocks SHALL preserve keyboard operation, visible focus, semantic read-only output, reduced motion, constrained-width containment, and deterministic reading order.

#### Scenario: A layout is read in assistive technology
- **WHEN** a multi-column or group block is rendered
- **THEN** its children SHALL have a coherent semantic order independent of visual placement.
