## ADDED Requirements

### Requirement: Vendor-neutral block document contract
The system SHALL expose a Notes App-owned `BlockEditorDocument` with `schemaVersion: 1`, a `doc` root, and only the supported nodes, marks, and attributes; public editor props and conversion utilities MUST NOT expose Tiptap types or names.

#### Scenario: Empty document is created
- **WHEN** `createEmptyBlockDocument` is called
- **THEN** it SHALL return a valid version 1 document containing an editable paragraph root

#### Scenario: Unknown structured content is supplied
- **WHEN** validation encounters an unknown node, mark, attribute, schema version, or root shape
- **THEN** validation SHALL reject the document without rendering or persisting the unknown content

### Requirement: Supported first-slice document content
The editor SHALL support paragraph, H1-H3, bold, italic, inline code, link, bullet list, ordered list, task list, blockquote, code block, undo/redo, and the native keyboard behavior supplied by the configured extensions.

#### Scenario: User applies supported formatting
- **WHEN** the user applies any supported block or mark command
- **THEN** the emitted `BlockEditorDocument` SHALL encode that content using the allowlisted schema

#### Scenario: User uses list keyboard behavior
- **WHEN** the user uses Enter, Backspace at the start, Tab, or Shift+Tab in a supported list
- **THEN** the editor SHALL apply the corresponding list split, lift, indent, or outdent behavior without leaving invalid content

### Requirement: Markdown shortcuts and interchange
The editor SHALL provide app-owned Markdown conversion for the supported schema while retaining validated JSON as canonical storage, and SHALL support reversible Markdown-style input rules.

#### Scenario: User types a block shortcut
- **WHEN** the user types `# `, `## `, `### `, `- `, `1. `, `- [ ] `, `> `, or a fenced-code trigger at the start of a text block
- **THEN** the editor SHALL transform it to the corresponding supported block and native input-rule undo SHALL restore the literal text

#### Scenario: Markdown is imported and exported
- **WHEN** supported Markdown is imported or a valid document is exported
- **THEN** headings, paragraphs, supported marks, links, lists, task lists, quotes, fenced code, and hard breaks SHALL round trip deterministically

#### Scenario: Unsafe or unsupported Markdown is supplied
- **WHEN** Markdown contains raw HTML, an unsafe link, an unsupported table, or content outside the allowlist
- **THEN** it SHALL be rejected or retained as safe literal text and SHALL NOT introduce unknown JSON content

### Requirement: Controlled editor synchronization
The editor SHALL accept `value`, `onChange`, `editable`, `placeholder`, and `ariaLabel`, emit validated JSON for internal edits, and synchronize different external values without emitting a recursive change.

#### Scenario: Internal edit occurs
- **WHEN** the user changes editable document content
- **THEN** `onChange` SHALL receive the normalized version 1 JSON document

#### Scenario: Equal external value is received
- **WHEN** an external value is structurally equal to the editor's current document
- **THEN** the editor SHALL NOT replace content, reset selection, or emit `onChange`

#### Scenario: Different external value is received
- **WHEN** a valid external value differs from the current editor document
- **THEN** the editor SHALL set the new content with update emission disabled

### Requirement: Keyboard-operable slash command menu
Typing the slash trigger in an editable text block SHALL open a localized shared command catalog with filtering, arrow navigation, Enter selection, Escape dismissal, an empty state, and focus restoration.

#### Scenario: Command is chosen by keyboard
- **WHEN** the user filters the slash menu, moves with arrow keys, and presses Enter
- **THEN** the selected command SHALL transform or insert the block and focus SHALL return to the editor

#### Scenario: Slash menu has no matches
- **WHEN** the filter matches no command
- **THEN** the menu SHALL render the localized empty state and Escape SHALL close it without mutating the document

### Requirement: Selection toolbar preserves selection
An editable text selection SHALL expose a headless BubbleMenu rendered with local Notes App primitives for supported marks, block transformations, and link editing.

#### Scenario: User formats a selection
- **WHEN** the user invokes bold, italic, inline code, or a supported block action from the toolbar
- **THEN** the original selection SHALL remain the command target and focus SHALL return to the editor

#### Scenario: User edits a link
- **WHEN** the user opens the localized link control and confirms a valid link
- **THEN** the link mark SHALL apply to the preserved selection without collapsing it before the command executes

### Requirement: Top-level insertion and reordering
Editable top-level blocks SHALL expose an `18x22px` handle area with a shared insertion command and a grip that reorders only top-level blocks using `nested: false`.

#### Scenario: User inserts from the block handle
- **WHEN** the user opens the insertion button beside a top-level block
- **THEN** the same localized catalog used by slash commands SHALL insert the chosen block at that position

#### Scenario: User drags a top-level block
- **WHEN** the user drags the grip to another top-level position
- **THEN** the block SHALL move with its complete structured content and nested list content SHALL NOT become an independent drag target

#### Scenario: Touch layout is active
- **WHEN** the device uses a touch/mobile layout
- **THEN** drag affordances SHALL be hidden while keyboard and menu-based creation and transformation remain available without horizontal overflow

### Requirement: Semantic read-only rendering
When `editable` is false, the block editor SHALL render the supported content semantically without a cursor, mutation callback, slash menu, selection toolbar, or block handles.

#### Scenario: Read-only document is rendered
- **WHEN** a valid document is displayed with `editable={false}`
- **THEN** headings, lists, task states, quotes, code, links, paragraphs, and marks SHALL retain their semantic output
- **AND** no mutation affordance or callback SHALL be activated

### Requirement: Localized accessible reference-aligned surface
All editor copy and interaction semantics SHALL be localized in English, Spanish, and Portuguese (Brazil), use shared Notes App primitives/styles, expose neutral English `data-slot` values, respect reduced motion, and retain the confirmed reference typography and measure.

#### Scenario: Editor is inspected in a supported locale
- **WHEN** the locale is `en`, `es`, or `pt-BR`
- **THEN** placeholders, block names, actions, tooltips, link copy, ARIA labels, and empty states SHALL come from the matching catalog

#### Scenario: Reference layout is measured
- **WHEN** the editor is rendered on desktop and mobile
- **THEN** confirmed values SHALL include Inter `16px/24px` body text, Inter `700 30px/33px` title text, a fluid content measure observed at `459px` and `728px` in different panel states, `40px` leading inset, link-color selection near 25%, an `18x22px` handle, and `100ms` handle transition
- **AND** screenshot-only values SHALL be identified as approximations rather than parity claims

### Requirement: Block editor acceptance is evidence-backed
The block editor SHALL have unit, contract, desktop-browser, mobile-browser, and reference-evidence coverage before acceptance.

#### Scenario: Acceptance gate runs
- **WHEN** the implementation is ready to archive
- **THEN** tests SHALL cover document creation and validation, plain-text and Markdown conversion, Markdown input rules and deterministic round trips, storage migration and round trip, invalid content, import, dependency contracts, localization, public boundaries, keyboard editing, menus, selection preservation, block insertion/reordering, reload persistence, accessibility, reduced motion, overflow, and console errors
