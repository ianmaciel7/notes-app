## ADDED Requirements

### Requirement: Canonical command metadata covers every exposed shortcut

Every shortcut shown in a sidebar hint, menu, palette, tooltip, or shortcut browser SHALL come from one canonical command definition with a stable ID, contexts, availability, localized presentation, and platform-neutral chord metadata.

#### Scenario: The same shortcut is shown in multiple surfaces
- **WHEN** a command appears in a sidebar hint, palette, and shortcut browser
- **THEN** all surfaces SHALL project the same command identity and chord metadata
- **AND** no surface SHALL maintain a divergent hard-coded shortcut copy.

### Requirement: The command surface is capability-aware

The registry SHALL expose settings, creation, search, find-in-page, workspace chrome, tab, navigation, calendar, and task commands only when their canonical local action owners are available.

#### Scenario: A documented feature is not implemented locally
- **WHEN** a reference shortcut has no safe local action owner
- **THEN** the command SHALL be omitted or truthfully disabled
- **AND** activation SHALL not perform a no-op mutation or fabricated success.

### Requirement: Extended search and find in page are distinct commands

Extended workspace search and find-in-page SHALL have separate identities, contexts, query state, result ownership, and focus restoration.

#### Scenario: User invokes find in page
- **WHEN** an object is open and the user invokes `Mod+F`
- **THEN** the object-scoped find surface SHALL search the rendered canonical object content
- **AND** it SHALL not replace the global workspace palette query.

### Requirement: Shortcut browser is a read-only registry projection

The shortcuts browser SHALL be searchable, grouped by context, keyboard operable, localized, and generated from current command metadata.

#### Scenario: A command becomes unavailable
- **WHEN** current state makes a command unavailable
- **THEN** the shortcuts browser SHALL reflect the same omission or disabled state as other command consumers.
