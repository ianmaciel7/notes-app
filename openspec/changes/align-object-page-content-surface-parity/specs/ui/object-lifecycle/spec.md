## ADDED Requirements

### Requirement: Object-page compound controls preserve independent targets
The object Page header SHALL expose the object type primary target, type disclosure, inline Collections selector, hover-revealed Customize control, and overflow control as independently accessible targets with reference-matched visible states and no overlapping activation regions.

#### Scenario: Type chip primary target is activated
- **WHEN** the user activates the object type label or icon
- **THEN** the workspace SHALL navigate to the corresponding object-type surface
- **AND** the type selector SHALL remain closed.

#### Scenario: Type chip disclosure is activated
- **WHEN** the user activates the disclosure target
- **THEN** the searchable type selector SHALL open without navigating or changing the entity
- **AND** Escape or outside interaction SHALL close it and recover focus.

#### Scenario: Customize is revealed from the header
- **WHEN** the Page header receives hover or focus-within
- **THEN** Customize SHALL transition from the matched quiet opacity to its direct-hover state inside reserved geometry
- **AND** the overflow action SHALL remain visible, non-overlapping, and independently operable.

### Requirement: Inline object-page metadata remains local and stable
Title, Tags, Collections, and configured Page properties SHALL remain inline, localized, buffered where text entry is accepted, and derived from the canonical Structure and entity state. Opening, filtering, cancelling, or hovering metadata controls SHALL not create or mutate values.

#### Scenario: Inline selector is cancelled
- **WHEN** the user opens Tags or Collections, filters choices, and dismisses with Escape or outside interaction
- **THEN** the Page SHALL retain its prior metadata exactly once
- **AND** focus SHALL return to the visible inline control without shifting neighboring content.

#### Scenario: Metadata mutation is accepted
- **WHEN** the user accepts a supported Tags, Collections, or property choice
- **THEN** every header, sidebar, collection, and Page projection SHALL reflect the same canonical value
- **AND** the accepted result SHALL survive reopening when persistence is promised.

#### Scenario: Object title is edited inline
- **WHEN** the user edits the Page title
- **THEN** the title SHALL remain a buffered autosizing textarea with the reference 30/33px typography and no resize handle
- **AND** committing the value SHALL update the canonical entity title exactly once without changing neighboring header or metadata geometry.

### Requirement: Object-page review rows expose truthful nested actions
Each Related content or Mention row SHALL separate disclosure, editable or navigable label behavior, type identity, open, overflow, preview, and explicit conversion actions according to the reference row kind while retaining accessible names and focus recovery.

#### Scenario: Nested row action is exercised
- **WHEN** the user activates a row disclosure, open action, overflow action, or supported menu option
- **THEN** only the named outcome SHALL occur
- **AND** no sibling action, row navigation, prose conversion, duplicate relation, or count change SHALL occur incidentally.

#### Scenario: Unsupported row action is visible
- **WHEN** a reference action cannot be implemented safely for local data
- **THEN** the control SHALL expose a localized truthful unavailable state
- **AND** SHALL not appear to succeed through a label change, toast-only placeholder, or unrelated navigation.
