## ADDED Requirements

### Requirement: Continuous object-page content surface parity
The production object Page SHALL render the matched reference composition as one compact continuous surface from the object header through metadata, authoring content, applicable Related content, Mentions, and the editor-utility edge control. The main Page flow SHALL NOT render an always-expanded generic `Links and references`, `Add relationship`, embed, or `Objects inside` dashboard between the editor and the reference-derived review sections.

#### Scenario: Page with related content and mentions is opened
- **WHEN** a Page with body content, three related objects, and one unlinked mention is opened at the matched desktop viewport
- **THEN** the header, title, metadata, editor, Related content count and rows, Mentions count and source preview SHALL follow the reference order and compact vertical rhythm
- **AND** unrelated authoring dashboards or fabricated relationship rows SHALL not interrupt that composition.

#### Scenario: Page has no relationship projection
- **WHEN** a Page has no applicable related content, backlinks, or mentions
- **THEN** the surface SHALL omit empty review sections unless the matched reference exposes a named empty state
- **AND** link, embed, and relationship authoring SHALL remain available only through their explicit commands.

### Requirement: Complete object-page interaction parity
Every visible affordance inside the object-page surface SHALL implement and verify each state it actually supports, including resting, whole-target hover, nested-target hover, pointer exit, focus-visible, keyboard activation, click, open, Escape or outside close, post-click state, persistence, unavailable or rejected state, and reduced motion.

#### Scenario: Header controls are hovered and activated
- **WHEN** the pointer enters the Page type chip, its disclosure, Collections, Customize, or overflow control
- **THEN** only the reference-matched background, border, text, icon, and opacity state SHALL change
- **AND** adjacent controls, the title, and the content column SHALL keep the same geometry
- **AND** primary and nested targets SHALL produce distinct navigation or popup outcomes.

#### Scenario: Section header is hovered
- **WHEN** Related content or Mentions receives hover or focus-within
- **THEN** its supported help, reveal, and section actions SHALL appear with the matched opacity, target size, and transition without moving the heading or count
- **AND** pointer exit SHALL restore the resting state.

#### Scenario: Relationship row is hovered
- **WHEN** a Related content or Mention row receives hover or focus-within
- **THEN** its disclosure, open, overflow, type identity, preview, and conversion controls SHALL reveal only where supported by that row
- **AND** each nested action SHALL remain independently operable without triggering row navigation or a different nested action.

### Requirement: Reference-aligned relationship review ownership
Related content and Mentions SHALL be derived, count-truthful review sections with reference-aligned collapse, row, preview, and contextual-action behavior. Canonical backlinks, property relations, embeds, Objects inside, and graph projections SHALL retain their distinct domain ownership without being indiscriminately merged into the main Page surface.

#### Scenario: Related content heading is toggled
- **WHEN** the user activates the Related content heading by pointer or keyboard
- **THEN** its rows SHALL collapse or expand as one section while the heading and count remain visible
- **AND** re-expansion SHALL restore the same canonical rows without duplication or mutation.

#### Scenario: Mention heading is toggled
- **WHEN** the user activates the Mentions heading by pointer or keyboard
- **THEN** mention source rows SHALL collapse or expand while the derived count remains visible
- **AND** opening, previewing, or inspecting a mention SHALL not convert its prose until the explicit conversion action is accepted.

### Requirement: Object-page evidence convergence
Object-page parity SHALL be evaluated against a reusable, sanitized action matrix at matched semantic state and viewport, with measurable DOM, accessibility, geometry, computed style, transition, behavior, persistence, and console evidence supplementing visual captures.

#### Scenario: A parity iteration completes
- **WHEN** an implementation iteration is evaluated
- **THEN** every scoped control and state SHALL record `action -> expected reference state -> observed local state -> verdict -> evidence`
- **AND** the next change SHALL target the highest-impact remaining root cause rather than a screenshot-only override.

#### Scenario: A reference transition is unsafe or unavailable
- **WHEN** a destructive, sharing, exporting, authenticated mutation, or otherwise unavailable reference transition cannot be safely exercised
- **THEN** the matrix SHALL mark that transition untested with the reason
- **AND** SHALL not infer a passing verdict from its label or menu presence.

### Requirement: Reference workspace split preserves object-page geometry
The desktop workspace SHALL size the object Page and contextual panel with the same responsive proportion as the matched Capacities reference so the Page header, title, metadata, body, Related content, and Mentions do not reflow from a locally oversized contextual panel.

#### Scenario: Object Page is opened at the 1059px matched viewport
- **WHEN** the workspace is opened at 1059x912 with the sidebar and contextual panel visible
- **THEN** the main object-page card SHALL be about 474px wide, the contextual panel SHALL be about 277px wide, and the object content column SHALL remain about 390px wide within normal rendering tolerance
- **AND** the Related content heading SHALL remain on one line with row actions in the reference positions.

#### Scenario: Object Page has short content
- **WHEN** the selected Page content is shorter than the available viewport
- **THEN** the main scroll container SHALL still preserve the reference scrollbar gutter and trailing scroll range
- **AND** the title field SHALL be a buffered single-row textarea with the reference font metrics rather than a generic input.
