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
Typing the slash trigger in an editable text block SHALL open a localized shared command catalog with filtering, arrow navigation, Enter, Escape, empty state, focus restoration, and caret-relative positioning.

#### Scenario: Slash is typed after existing text
- **WHEN** the caret follows ordinary text and whitespace, for example `aaa /`
- **THEN** the slash menu SHALL open at the slash position.
- **AND** typing `/` in the middle of a word, for example `aaa/`, SHALL NOT open the menu.

#### Scenario: Slash menu anchor geometry is temporarily unavailable
- **WHEN** the suggestion decoration rectangle is missing, invalid, or collapses to viewport origin
- **THEN** the menu SHALL fall back to the editor caret geometry for the current suggestion range.
- **AND** the visible menu SHALL NOT appear at viewport origin as a fallback state.

#### Scenario: Slash menu approaches a viewport edge
- **WHEN** the caret is close enough to a viewport edge that the preferred placement would overflow
- **THEN** the menu SHALL remain within a small viewport gutter.
- **AND** it SHALL prefer placement below the caret and may flip above only when the measured surface does not fit below.

#### Scenario: Slash menu opens without a query
- **WHEN** the slash menu opens with an empty query
- **THEN** its leading command order SHALL be Default, Small, H1, H2, H3, H4, Bullet list, Alphabetical list, Numerical list, and Roman list.
- **AND** the surface SHALL preserve the reference title, neutral rounded shell, approximately 440px bounded width, 40px command rows, active-row highlight, and keyboard legend.

### Requirement: Selection toolbar preserves selection
An editable selection SHALL expose supported formatting/link actions immediately and SHALL preserve the command target while focus moves through local menus and link controls.

### Requirement: Reference-aligned top-level block controls
Editable top-level blocks SHALL expose separate plus and six-dot controls while nested list content remains part of its parent drag target.

#### Scenario: Handle is positioned for a hovered block
- **WHEN** a top-level editable block is hovered
- **THEN** the 36px combined handle SHALL be positioned immediately to the left of that block using viewport-consistent geometry.
- **AND** the handle SHALL NOT jump to the far side of the editor or into the active drop target.

#### Scenario: Six-dot grip starts a drag
- **WHEN** the user starts dragging from the six-dot grip
- **THEN** the visible six-dot control SHALL be the native draggable origin.
- **AND** Tiptap's DragHandle plugin SHALL remain the document-move controller that selects and reorders the top-level block.
- **AND** drag start SHALL NOT lock or disable the Tiptap handle before the plugin processes the event.
- **AND** the source handle SHALL stay anchored to the source block until drag end.
- **AND** the editor SHALL expose grabbing feedback while the drag is active.

#### Scenario: Grip is clicked without dragging
- **WHEN** a completed click occurs on the six-dot grip and no drag was detected
- **THEN** the block-options menu SHALL open from a non-interactive anchor aligned to the grip.
- **AND** the menu trigger SHALL NOT consume the grip's `mousedown` or prevent the native drag gesture.
- **AND** a click emitted immediately after drag end SHALL NOT open the menu.

#### Scenario: Plus control is used
- **WHEN** the user presses or drags from the plus control
- **THEN** the plus control SHALL remain non-draggable and SHALL NOT start the parent drag operation.
- **AND** click SHALL insert below while Shift-click SHALL insert above.

#### Scenario: Drop target is shown
- **WHEN** a supported top-level reorder drag moves between blocks
- **THEN** the drop cursor SHALL be a thin neutral one-pixel indicator rather than a heavy dark rule.
- **AND** unsupported lateral/column drop semantics SHALL NOT be simulated before the relevant block schema exists.

#### Scenario: Handle tooltip is requested
- **WHEN** the pointer rests on the plus or six-dot control
- **THEN** a localized application tooltip SHALL appear using the shared Tooltip primitive rather than a browser-native `title` tooltip.
- **AND** the plus tooltip SHALL communicate Click-to-insert-below and Shift-click-to-insert-above.
- **AND** the grip tooltip SHALL communicate Drag-to-move and Click-to-show-options.

### Requirement: Semantic read-only rendering
When `editable` is false, supported content SHALL render semantically without mutation callbacks, cursor affordances, menus, handles, or mutable task checkboxes.

### Requirement: First-slice scope is explicit
Completion of this change SHALL NOT be reported as complete parity with the broader documented Capacities block catalog.

### Requirement: Localized accessible reference-aligned surface
All editor copy and interaction semantics SHALL be localized in English, Spanish, and Portuguese (Brazil), expose neutral data slots, preserve visible focus, respect reduced motion, and retain evidence-backed reference typography/measure.

### Requirement: Block editor acceptance is evidence-backed
Unit, contract, desktop-browser, mobile-browser, persistence, accessibility, keyboard, menu, localization, performance-regression, and reference-evidence coverage SHALL pass before acceptance.
