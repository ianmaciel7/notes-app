## ADDED Requirements

### Requirement: Object editor utility panel
The object editor SHALL expose a compact, non-destructive utility panel for document Structure and Statistics from the reference-aligned edge trigger. The panel SHALL remain presentation state separate from canonical object content and SHALL preserve editor visibility, pending valid edits, selection, focus recovery, localization, reduced motion, and responsive containment.

#### Scenario: Utility panel opens
- **WHEN** the user activates the editor edge trigger with pointer or keyboard input
- **THEN** a compact panel SHALL open adjacent to the editor with accessible Structure and Statistics tabs and a pin control
- **AND** the full editor and object page SHALL remain visible and editable without content mutation.

#### Scenario: Structure tab has headings
- **WHEN** the current document contains supported heading blocks
- **THEN** the Structure tab SHALL derive an ordered outline from canonical block identities and heading levels
- **AND** activating an outline entry SHALL move focus or scroll to the matching block without editing its text.

#### Scenario: Structure tab has no headings
- **WHEN** the current document contains no supported heading blocks
- **THEN** the Structure tab SHALL render a localized truthful empty state rather than fabricated outline entries.

#### Scenario: Statistics tab is selected
- **WHEN** the user selects Statistics
- **THEN** the panel SHALL show locally derived word, sentence, paragraph, and character counts plus canonical created and last-updated timestamps when available
- **AND** text counts SHALL refresh from the current accepted editor document without triggering keystroke-time persistence work.

#### Scenario: Unpinned utility panel is dismissed
- **WHEN** an unpinned panel is open and the user presses Escape or interacts outside it
- **THEN** the panel SHALL close, the editor SHALL remain visible, and focus SHALL return to a stable owning control or the prior editor target.

#### Scenario: Utility panel is pinned and unpinned
- **WHEN** the user pins the open panel
- **THEN** outside interaction SHALL leave the panel open without changing object data
- **AND WHEN** the user unpins it and dismisses it
- **THEN** the normal outside-click and Escape close behavior SHALL resume.

#### Scenario: Utility panel renders in constrained space
- **WHEN** the editor width cannot contain the preferred desktop panel geometry
- **THEN** the panel SHALL remain within the visible workspace, avoid covering essential editing controls, and use an accessible compact or overlay composition without horizontal page overflow.
