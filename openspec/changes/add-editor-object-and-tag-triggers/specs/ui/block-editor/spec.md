## ADDED Requirements

### Requirement: Plus opens shared quick actions and runtime object creation

Typing `+` at an eligible text boundary SHALL open a caret-anchored suggestion surface containing supported block actions and new-object commands derived from current runtime Structures.

#### Scenario: User creates an object from plus
- **WHEN** the user selects an eligible runtime object type from the `+` surface
- **THEN** one canonical object SHALL be created through the existing creation owner
- **AND** one stable reference to it SHALL replace the exact trigger/query range after creation succeeds.

#### Scenario: Plus is cancelled
- **WHEN** the user presses Escape or dismisses the `+` surface
- **THEN** no object, block, link, or persistence mutation SHALL occur.

### Requirement: Hash searches and creates tags safely

Typing `#` at an eligible boundary SHALL search Space-local tags and MAY offer creation for a valid non-duplicate label when tag creation is authorized.

#### Scenario: Existing tag is selected
- **WHEN** the user selects an existing tag
- **THEN** the canonical tag identity SHALL be inserted or assigned without creating a duplicate tag.

#### Scenario: Invalid tag text is entered
- **WHEN** the query violates the supported tag-label contract
- **THEN** tag creation SHALL be unavailable and the editor SHALL preserve ordinary text.

### Requirement: Editor triggers have deterministic arbitration

`/`, `+`, `#`, `@`, `[[`, and `((` SHALL share geometry, focus, keyboard, dismissal, IME, and range-ownership rules while keeping trigger-specific eligibility and commit behavior.

#### Scenario: Hash is a Markdown heading marker
- **WHEN** heading Markdown syntax is typed at the start of a block
- **THEN** the heading transform SHALL win
- **AND** the tag suggestion SHALL not steal the range.
