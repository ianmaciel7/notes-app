## ADDED Requirements

### Requirement: Complete object-page surface parity
The object surface SHALL match the current evidence-backed reference composition and interaction contract from the object header through related content for both built-in Pages and custom-Structure instances while preserving local canonical data, stronger accessibility semantics, localization, offline behavior, and responsive containment.

#### Scenario: Matched object-page baseline is rendered
- **WHEN** reference and localhost are compared at the same viewport with semantically equivalent Page, navigation, and contextual-panel state
- **THEN** the header, title, visible metadata, editor, derived relationships, related content, and editor utility trigger SHALL follow the recorded order, widths, spacing, typography, colors, borders, radii, and overflow behavior
- **AND** local names, counts, content, and relationship membership SHALL remain derived from local canonical state rather than being rewritten to match reference fixtures.

#### Scenario: Header controls expose independent targets
- **WHEN** the user hovers, focuses, or activates Page type, Collections, Customize, or overflow controls
- **THEN** each control SHALL retain a stable, independently named hit target without shifting neighboring controls
- **AND** pointer, keyboard, open, Escape, outside-close, focus-recovery, and reduced-motion behavior SHALL match the recorded reference state machine without mutating the Page merely because a surface opened.

#### Scenario: Page type selector opens
- **WHEN** the Page type disclosure is activated
- **THEN** a searchable selector SHALL open with eligible runtime Structures, reference-aligned object identity, current-selection truthfulness, bounded geometry, and keyboard navigation
- **AND** selecting a type SHALL use the guarded canonical type-change workflow exactly once while cancellation SHALL leave the Page unchanged.

#### Scenario: Customize surface opens
- **WHEN** Customize is activated from the header or overflow menu
- **THEN** the surface SHALL expose the reference command families applicable to the current object kind, Structure ownership, property state, and command availability
- **AND** add and fill variants SHALL be conditional on current Page state, perform the named visible outcome, and persist through re-opening
- **AND** a built-in Page catalog SHALL NOT be imposed on a custom-Structure instance whose recorded reference state exposes a different truthful catalog
- **AND** unsupported commands SHALL render a truthful unavailable state instead of a placeholder instruction.

#### Scenario: Page overflow surface opens
- **WHEN** the Page overflow control is activated
- **THEN** its state-appropriate command families SHALL be derived from the current object kind, Structure ownership, collection state, and capability availability, including only the applicable subset of Find in Page, Customize, template use, collection editing, pin or unpin, type change, object-type settings, sharing, presentation, export, import, text statistics, copy, duplicate, and delete
- **AND** shortcuts, separators, destructive treatment, submenu state, hover, focus, Escape, outside-close, and focus recovery SHALL follow the recorded compact-menu contract.

#### Scenario: Empty custom Structure adds a property
- **WHEN** an object owned by a custom Structure has no additional populated property and the user hovers, focuses, or activates Add property
- **THEN** the action SHALL retain stable space between Tags and the editor, reveal without layout shift, and open the recorded searchable property-type catalog with reference-aligned icons and canonical ordering
- **AND** opening, searching, highlighting, pressing Escape, or clicking outside SHALL NOT change the Structure schema or object
- **AND** Object selection SHALL open a second searchable runtime-Structure menu whose open, filter, highlight, and cancel states are non-mutating
- **AND** accepting one target Structure SHALL create exactly one entity property constrained to that stable Structure identity, multiple by default, without a fixed set
- **AND** accepting one new eligible writable type SHALL perform exactly one guarded canonical schema update and render the new property in Structure order
- **AND** accepting an existing optional or system-backed projection SHALL change its presentation or visibility without duplicating the canonical definition
- **AND** duplicate, malformed, ineligible, or unsafe commits SHALL be rejected atomically.

#### Scenario: Empty metadata selector opens
- **WHEN** Collections or Tags is empty and its inline selector opens
- **THEN** it SHALL retain the inline focused input and expose only truthful create/search actions available in that semantic state rather than an empty dialog shell
- **AND** keyboard cancellation or outside close SHALL leave membership unchanged and restore focus to a visible stable target or neutral document target.

#### Scenario: Collection selector creates or selects directly
- **WHEN** the inline Collections selector has unselected matching collections
- **THEN** it SHALL show only those matches, omit the create action, retain input focus during ArrowUp or ArrowDown navigation, and keep the popup open after Enter selects the active match
- **AND** the selected match SHALL disappear from the available list without deleting the collection.
- **WHEN** no unselected collection matches the current query
- **THEN** the selector SHALL expose one initially highlighted create row with the reference collection iconography and compact geometry
- **AND** click or Enter SHALL create and select the query-derived or untitled collection exactly once, close the popup, project the chip and sidebar row, and survive reload without an intermediate confirmation form.
- **AND** the chip removal action SHALL reveal on hover or keyboard focus and remove only object membership.

#### Scenario: Optional Page properties are composed
- **WHEN** Icon, Cover, Description, Aliases, or other runtime Structure properties are absent, present, added, filled, edited, or removed
- **THEN** only the reference-applicable property rows SHALL render in canonical Structure order with buffered edits and synchronized projections
- **AND** the surface SHALL NOT show dummy text inputs solely to reserve space for absent optional properties.

#### Scenario: Relationship and related-content composition is rendered
- **WHEN** the Page has backlinks, unlinked mentions, embedded objects, property relations, or related-content results
- **THEN** each applicable projection SHALL render in the evidence-backed order with truthful heading, count, disclosure, source identity, hover/focus actions, and navigation behavior
- **AND** explicit local link or embed authoring SHALL remain available through a named transient action without forcing an always-expanded generic relationship builder into the reading surface
- **AND** unrelated entities SHALL NOT appear because of storage order.

#### Scenario: Object page is constrained
- **WHEN** the viewport moves through the recorded desktop, cramped, tablet, and mobile checkpoints
- **THEN** the central Page surface and every open transient surface SHALL remain visible, keyboard operable, bounded by the viewport, and free of horizontal document overflow
- **AND** controls SHALL compact, wrap, or move into a named overflow composition before clipping.
