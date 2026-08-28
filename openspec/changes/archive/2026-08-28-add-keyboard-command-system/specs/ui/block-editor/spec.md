## ADDED Requirements

### Requirement: Editor suggestions share one interaction state machine
Slash commands, object references, wiki-style object references, and block references SHALL share caret measurement, viewport containment, keyboard selection, dismissal, reduced-motion behavior, and focus recovery while retaining trigger-specific catalogs and commit operations.

#### Scenario: A supported trigger opens at the caret
- **WHEN** `/`, `@`, `[[`, or `((` forms a valid trigger range in an editable text block outside composition
- **THEN** one trigger-appropriate suggestion surface SHALL open at the caret, remain at least 8px inside the viewport, and expose the matching catalog only.

#### Scenario: Caret geometry is temporarily unavailable
- **WHEN** the current suggestion range cannot produce a usable client rectangle
- **THEN** the surface SHALL use a valid document-position fallback or remain hidden without flashing at viewport origin.

#### Scenario: User operates a suggestion by keyboard
- **WHEN** a suggestion surface is open and the user presses ArrowDown, ArrowUp, Enter, or Escape
- **THEN** selection SHALL move, the selected item SHALL execute, or the surface SHALL close respectively without leaking the keystroke to another open command surface.

### Requirement: Trigger parsing is contextual and composition-safe
Editor trigger recognition SHALL respect text boundaries, current node support, active suggestion ownership, and IME composition so delimiter-like text is not converted unexpectedly.

#### Scenario: Trigger characters are typed during IME composition
- **WHEN** composition is active while a trigger character or delimiter sequence is entered
- **THEN** no suggestion SHALL commit or replace content until composition ends and the resulting range is valid.

#### Scenario: Trigger is invalid in the current node
- **WHEN** a trigger occurs in a node or position that does not support its operation
- **THEN** the characters SHALL remain ordinary editor content and no global command SHALL claim them.

### Requirement: Slash command behavior remains canonical
The existing `/` command surface SHALL continue to filter one localized block command catalog by labels and aliases, preserve supported ordering and empty state, and execute one editor transaction per accepted command.

#### Scenario: Multiple aliases identify one slash command
- **WHEN** localized labels or supported aliases such as a heading label and `h1` match the same command
- **THEN** the surface SHALL render one command identity and selection SHALL execute it once.

#### Scenario: Reference triggers are added
- **WHEN** `@`, `[[`, and `((` support is enabled
- **THEN** existing slash filtering, selection, cancellation, caret placement, undo/redo, and persistence behavior SHALL not regress.

