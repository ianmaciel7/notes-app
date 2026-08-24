## ADDED Requirements

### Requirement: Vendor-neutral block document contract
The system SHALL expose a Notes App-owned versioned `BlockEditorDocument` with a validated root and supported nodes, marks, and attributes; public editor APIs MUST NOT expose Tiptap types or names.

### Requirement: Supported first-slice document content
The editor SHALL support paragraph, small paragraph text, H1-H4, bold, italic, inline code, link, bullet list, numerical list, alphabetical list, roman list, task list, blockquote, code block, horizontal rule, undo/redo, and native keyboard behavior supplied by configured extensions.

#### Scenario: User chooses small text
- **WHEN** a paragraph is transformed to `Pequeno`
- **THEN** the neutral document SHALL preserve a small-text paragraph attribute and the renderer SHALL use smaller paragraph typography.

#### Scenario: User chooses an ordered-list style
- **WHEN** the user selects numerical, alphabetical, or roman list style
- **THEN** the ordered-list node SHALL preserve the selected style rather than silently converting every ordered list to decimal numbering.

### Requirement: Keyboard-operable slash command menu
Typing the slash trigger in an editable text block SHALL open a localized shared command catalog with filtering, arrow navigation, Enter, Escape, empty state, and focus restoration.

#### Scenario: Slash is typed after existing text
- **WHEN** the caret follows ordinary text and whitespace, for example `aaa /`
- **THEN** the slash menu SHALL open at the slash position.
- **AND** typing `/` in the middle of a word, for example `aaa/`, SHALL NOT open the menu.

#### Scenario: Slash menu opens without a query
- **WHEN** the slash menu opens with an empty query
- **THEN** its leading command order SHALL be Default, Small, H1, H2, H3, H4, Bullet list, Alphabetical list, Numerical list, and Roman list.
- **AND** the surface SHALL preserve the reference title, neutral rounded shell, approximately 440px bounded width, 40px command rows, active-row highlight, and keyboard legend.

### Requirement: Selection toolbar preserves selection
An editable selection SHALL expose supported formatting/link actions immediately and SHALL preserve the command target while focus moves through local menus and link controls.

### Requirement: Reference-aligned top-level block controls
Editable top-level blocks SHALL expose separate plus and six-dot controls while nested list content remains part of its parent drag target.

### Requirement: Semantic read-only rendering
When `editable` is false, supported content SHALL render semantically without mutation callbacks, cursor affordances, menus, handles, or mutable task checkboxes.

### Requirement: First-slice scope is explicit
Completion of this change SHALL NOT be reported as complete parity with the broader documented Capacities block catalog.

### Requirement: Localized accessible reference-aligned surface
All editor copy and interaction semantics SHALL be localized in English, Spanish, and Portuguese (Brazil), expose neutral data slots, preserve visible focus, respect reduced motion, and retain evidence-backed reference typography/measure.

### Requirement: Block editor acceptance is evidence-backed
Unit, contract, desktop-browser, mobile-browser, persistence, accessibility, keyboard, menu, localization, performance-regression, and reference-evidence coverage SHALL pass before acceptance.
