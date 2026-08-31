## ADDED Requirements

### Requirement: Object-page editor participates in the continuous reference rhythm
The Page body editor SHALL occupy the reference-matched inline position and intrinsic content height between metadata and the first applicable review section. Empty editor padding, minimum height, block controls, and trailing spacing SHALL not create the oversized blank or separated-card composition absent from the matched reference.

#### Scenario: Short Page body is rendered
- **WHEN** a Page contains one short text block
- **THEN** the editor SHALL render the text at the matched content-column position and compact vertical rhythm
- **AND** the following Related content or Mentions section SHALL begin at the reference-aligned distance without a large fixed minimum-height gap.

#### Scenario: Empty Page body is rendered
- **WHEN** a Page body is empty
- **THEN** the localized placeholder and insertion affordance SHALL remain reachable
- **AND** the editor SHALL reserve only the measured empty-state space required by the reference and keyboard operation.

### Requirement: Block hover controls remain geometry-stable
Block insertion, drag, and option affordances SHALL use the matched quiet, hover, focus, and pressed states while remaining outside the text measure and preserving caret and neighboring-block geometry.

#### Scenario: Pointer enters and exits a text block
- **WHEN** the pointer enters an editable block and then leaves it
- **THEN** supported insertion and block-option controls SHALL reveal and hide with the matched opacity, cursor, target size, and transition
- **AND** the text, caret, surrounding blocks, and page width SHALL not move.

#### Scenario: Reduced motion is enabled
- **WHEN** the user prefers reduced motion and a block control changes state
- **THEN** the state SHALL become immediately perceivable without transition or animation
- **AND** pointer and keyboard outcomes SHALL remain identical.

### Requirement: Buffered object-page typing survives surrounding interactions
Object-page title and body input SHALL remain responsive and durable while header menus, metadata selectors, relationship sections, previews, and editor utilities open or close around the editor.

#### Scenario: User types and opens a nearby control
- **WHEN** the user types valid title or body content and immediately opens or closes a header, relationship, or utility control
- **THEN** the accepted text SHALL remain visible, undoable, and persist exactly once
- **AND** the interaction SHALL not force a full-workspace scan or persistence write on every keystroke.

#### Scenario: User reloads after accepted input
- **WHEN** buffered text has reached its accepted commit boundary and the Page is reloaded or reopened
- **THEN** the text and block identity SHALL be restored without duplication, truncation, or console error.
