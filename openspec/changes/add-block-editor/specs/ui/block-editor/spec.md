## ADDED Requirements

### Requirement: Vendor-neutral block document contract
The system SHALL expose a Notes App-owned versioned `BlockEditorDocument` with a validated root and supported nodes, marks, and attributes; public editor APIs MUST NOT expose Tiptap types or names.

#### Scenario: Unknown structured content is supplied
- **WHEN** validation encounters an unknown node, mark, attribute, schema version, or root shape
- **THEN** validation SHALL reject the document without persisting unsupported content.

### Requirement: Supported first-slice document content
The editor SHALL support paragraph, H1-H4, bold, italic, inline code, link, bullet list, ordered list, task list, blockquote, code block, horizontal rule, undo/redo, and native keyboard behavior supplied by the configured extensions.

#### Scenario: User applies supported formatting
- **WHEN** the user applies any supported first-slice block or mark command
- **THEN** the emitted document SHALL encode that content using the allowlisted schema.

### Requirement: Markdown shortcuts and interchange
The editor SHALL provide app-owned Markdown conversion for the supported schema while retaining validated JSON as canonical storage.

#### Scenario: User types a heading shortcut
- **WHEN** the user types `# `, `## `, `### `, or `#### ` at the start of a text block
- **THEN** the editor SHALL transform it to H1, H2, H3, or H4 respectively and input-rule undo SHALL restore literal text.

#### Scenario: Markdown is imported and exported
- **WHEN** supported Markdown is imported or a valid document is exported
- **THEN** H1-H4, paragraphs, supported marks, links, lists, task lists, quotes, fenced code, horizontal rules, and hard breaks SHALL round-trip deterministically where representable.

### Requirement: Controlled editor synchronization
The editor SHALL emit validated JSON for internal edits, buffer persistence without a React state update on every keystroke, and synchronize different external values without recursive change emission or selection-reset loops.

### Requirement: Keyboard-operable slash command menu
Typing the slash trigger in an editable block SHALL open a localized shared command catalog with filtering, arrow navigation, Enter, Escape, empty state, and focus restoration.

### Requirement: Selection toolbar preserves selection
An editable selection SHALL expose supported formatting/link actions immediately and SHALL preserve the command target while focus moves through local menus and link controls.

### Requirement: Reference-aligned top-level block controls
Editable top-level blocks SHALL expose separate `18x22px` plus and six-dot controls with a `100ms` state transition, while nested list content remains part of its parent drag target.

#### Scenario: Plus control is clicked
- **WHEN** the user clicks the plus control normally
- **THEN** one empty paragraph SHALL be inserted immediately below the targeted top-level block and the text selection SHALL move inside the new paragraph.
- **WHEN** the user Shift-clicks the plus control
- **THEN** one empty paragraph SHALL be inserted immediately above the targeted top-level block and the text selection SHALL move inside the new paragraph.

#### Scenario: Plus control receives a drag gesture
- **WHEN** a drag gesture begins from the plus control or any non-grip part of the positioned handle
- **THEN** the drag SHALL be cancelled and the document order SHALL remain unchanged.

#### Scenario: Six-dot grip is used
- **WHEN** the user drags the six-dot grip
- **THEN** the targeted top-level block SHALL be reorderable without making nested list items independent targets.
- **WHEN** the user clicks the six-dot grip without dragging
- **THEN** a localized block-options menu SHALL open without calling editor commands unavailable in the pinned React DragHandle integration.
- **WHEN** a drag completes or is cancelled
- **THEN** the resulting pointer/click sequence SHALL NOT open the block-options menu until the user performs a new intentional click.

#### Scenario: Touch layout is active
- **WHEN** hover/fine-pointer desktop input is unavailable
- **THEN** the drag plugin and handle SHALL not mount, while slash and keyboard creation remain available without horizontal overflow.

### Requirement: Semantic read-only rendering
When `editable` is false, supported content SHALL render semantically without mutation callbacks, cursor affordances, menus, handles, or mutable task checkboxes.

### Requirement: First-slice scope is explicit
Completion of this change SHALL NOT be reported as complete parity with the broader documented Capacities block catalog.

#### Scenario: Advanced documented block is requested
- **WHEN** a block such as small text, toggle, highlight, Mermaid/math, table, multi-column/group, media/object embed, or another advanced block is outside this slice
- **THEN** the UI SHALL not silently persist it as a different block type and the capability SHALL remain deferred to a follow-up change.

### Requirement: Localized accessible reference-aligned surface
All editor copy and interaction semantics SHALL be localized in English, Spanish, and Portuguese (Brazil), expose neutral data slots, preserve visible focus, respect reduced motion, and retain evidence-backed reference typography/measure.

### Requirement: Block editor acceptance is evidence-backed
Unit, contract, desktop-browser, mobile-browser, persistence, accessibility, keyboard, menu, localization, performance-regression, and reference-evidence coverage SHALL pass before acceptance.
