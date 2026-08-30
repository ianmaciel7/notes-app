## ADDED Requirements

### Requirement: Sidebar shortcut hints use the central command registry

Primary sidebar actions SHALL render labels, descriptions, platform chords, and availability from the canonical command system rather than local duplicate metadata.

#### Scenario: A command chord changes
- **WHEN** a registered sidebar command changes its supported platform chord
- **THEN** the sidebar hint SHALL update through registry projection
- **AND** no sidebar-only constant SHALL require a second edit.

### Requirement: Sidebar actions and shortcuts execute one owner

Pointer activation and keyboard activation for the same sidebar command SHALL invoke the same canonical action.

#### Scenario: Search is opened from sidebar and keyboard
- **WHEN** the user clicks Search and later invokes its registered shortcut
- **THEN** both paths SHALL open the same current search surface and produce the same focus state.
