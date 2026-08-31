## ADDED Requirements

### Requirement: Complete object-page editor interaction parity
The Page block editor SHALL expose the reference-aligned block controls and insertion suggestions as explicit, testable state machines while preserving canonical block identity, buffered input, accessible keyboard operation, localization, focus recovery, and responsive containment.

#### Scenario: Block controls enter and leave hover state
- **WHEN** pointer hover or keyboard focus enters a top-level editable block
- **THEN** separate plus and six-dot grip targets SHALL reveal with the recorded geometry, opacity, cursor, tooltip, and transition without shifting the block or neighboring content
- **AND** pointer exit or focus exit SHALL return them to an inert hidden state without leaving an unexplained active region.

#### Scenario: Plus inserts around the owning block
- **WHEN** the user clicks plus or Shift-clicks plus
- **THEN** exactly one empty supported block SHALL be inserted below or above the owning top-level block respectively and receive editing focus
- **AND** plus SHALL never begin a drag or open the block-options menu.

#### Scenario: Grip click and drag remain distinct
- **WHEN** the user clicks the grip without crossing the drag threshold
- **THEN** the reference-aligned block-options surface SHALL open without moving the block
- **AND WHEN** the drag threshold is crossed
- **THEN** canonical top-level block identity SHALL move once, a visible drop target SHALL track the intended position, and completing or cancelling the drag SHALL not emit a delayed click.

#### Scenario: Slash menu recognizes commands and aliases
- **WHEN** `/` is typed at a valid text boundary and the user enters a localized command label or supported alias
- **THEN** one caret-anchored, viewport-bounded command surface SHALL filter the shared command catalog without duplicating equivalent commands
- **AND** Arrow keys, Enter, Escape, pointer hover, pointer selection, empty results, focus recovery, and reduced-motion behavior SHALL follow the recorded interaction contract.

#### Scenario: At-reference menu recognizes titles and aliases
- **WHEN** `@` is typed at a valid text boundary and the user enters an object title or alias
- **THEN** one caret-anchored, viewport-bounded reference surface SHALL return eligible canonical objects with object-type identity and distinguish duplicate visible labels
- **AND** title and alias matches for the same object SHALL resolve to one selectable target rather than duplicate rows.

#### Scenario: At-reference selection is completed or cancelled
- **WHEN** the user selects an `@` result with pointer or keyboard input
- **THEN** the trigger query SHALL become one stable canonical object reference and focus SHALL return immediately after that reference
- **AND WHEN** the user presses Escape, moves to an invalid boundary, or produces no results
- **THEN** no link, entity, or duplicate block SHALL be created and the prose SHALL remain editable.

#### Scenario: Insertion surfaces coexist safely
- **WHEN** plus insertion, slash commands, `@` references, selection formatting, or block options are opened in sequence
- **THEN** only the owning transient surface SHALL remain active, outside click and Escape SHALL close it predictably, and pending valid text SHALL not be lost or persisted more than once
- **AND** the editor SHALL contain every surface at narrow viewports without document-level horizontal overflow.
