## MODIFIED Requirements

### Requirement: Functional Page parity
Page editing, metadata, header commands, embedded content, derived relationship sections, editor utilities, related content, and deletion SHALL perform concrete local workspace behavior while preserving the current reference's visible interaction states.

#### Scenario: Page title, body, tags, and collections are edited
- **WHEN** the user edits a Page title or body, or adds/removes tags or collections
- **THEN** the active control SHALL update without keystroke-time persistence work
- **AND** valid pending changes SHALL flush on the bounded idle interval, blur, navigation, unmount, or explicit submit boundary
- **AND** the header, tab, projections, and re-opened Page SHALL render the committed values without duplicate metadata controls.

#### Scenario: Page collections control is activated
- **WHEN** the user activates the visible "Collections" metadata control with pointer or keyboard input
- **THEN** an accessible collection-selection surface SHALL open without navigating away or mutating the Page merely because it opened
- **AND** selecting a collection SHALL add it to the Page exactly once and update the header, collection projection, and persisted entity
- **AND** removing or deselecting a collection SHALL update the same surfaces and persisted entity without leaving a stale chip
- **AND** the control SHALL expose a distinct accessible name and a perceivable open, selected, and empty state.

#### Scenario: Page metadata selector is searched inline
- **WHEN** the user focuses or types in the visible Tags or Collections metadata control
- **THEN** that control SHALL remain the focused inline text input and its selector SHALL open below it without rendering a second search field
- **AND** the selector SHALL use the reference-sized compact result surface, render only applicable choices and named actions, and avoid a generic empty-state dialog
- **AND** Escape or outside interaction SHALL close the selector and restore focus without mutating the Page.

#### Scenario: Page Tag selector creates or searches an inline query
- **WHEN** the user types a tag name that has no applicable match in the visible Tags input
- **THEN** the compact selector SHALL offer `New '{query}'` and `Search all Tags` using the same reference-sized surface
- **AND WHEN** the user activates `New '{query}'`
- **THEN** the Page SHALL receive the created tag exactly once, the inline query SHALL clear, and the route SHALL remain on the Page
- **AND WHEN** the user activates `Search all Tags`
- **THEN** the full tag picker SHALL open with the query preserved and without route navigation.

#### Scenario: Applied Page Tag is hovered or activated
- **WHEN** a user hovers an applied Page tag
- **THEN** it SHALL retain the reference tag-chip color, compact geometry, and pointer affordance without shifting neighboring metadata
- **AND WHEN** the user activates the tag label
- **THEN** the corresponding Tag object SHALL open without removing the tag from the Page
- **AND** removing a tag, if supported, SHALL use a distinct explicit control.

#### Scenario: Page header metadata and command icons are rendered
- **WHEN** Collections, Customize, and the Page overflow control render in the Page header
- **THEN** Collections SHALL use the reference collection glyph, Customize SHALL combine the reference sparkle and disclosure glyphs, and overflow SHALL use the reference ellipsis glyph
- **AND** each glyph SHALL use the observed 14px visual size and preserve the owning control's accessible name, hover, focus, and open behavior.

#### Scenario: Page overflow control is activated
- **WHEN** the user activates the visible Page overflow control using pointer or keyboard input
- **THEN** the owning accessible menu SHALL open with its named commands available
- **AND** opening the menu SHALL not mutate the Page or silently perform a command
- **AND** closing it with Escape, outside click, or an unavailable command SHALL leave the Page valid and focused recoverably.

#### Scenario: Page customization is activated
- **WHEN** the user activates the visible Page customization affordance from the header or overflow menu using pointer or keyboard input
- **THEN** an accessible customization surface SHALL open
- **AND** applying a supported option SHALL produce an observable Page presentation change that persists after re-opening
- **AND** the customization command SHALL perform the named action or expose a truthful unavailable state; it SHALL NOT terminate at an instructional hint alone.

#### Scenario: Page link or embed action completes
- **WHEN** the user links or embeds another local object in a Page
- **THEN** the produced document SHALL be accepted by the active editor schema
- **AND** the Page SHALL remain editable after navigation, reload, and re-opening
- **AND** the browser console SHALL contain no implementation error.

#### Scenario: Backlinks and Mentions are composed on the Page
- **WHEN** a Page has derived backlinks or unlinked mentions
- **THEN** applicable relationship sections SHALL render beneath the editable content with truthful localized headings and counts, backlinks before Mentions, and no duplicate candidate in both sections
- **AND** an always-expanded generic relationship-authoring panel, graph list, or unrelated stored entities SHALL NOT displace the reference-aligned reading surface.

#### Scenario: A Mention source row is rendered
- **WHEN** another eligible object contains an unlinked occurrence of the focused Page title or alias
- **THEN** the Mentions section SHALL show the source object's title, object-type identity, matching read-only excerpt, disclosure state, and distinct open and overflow actions
- **AND** hover or focus SHALL reveal contextual actions without shifting the row or converting the occurrence.

#### Scenario: Mentions section is collapsed and expanded
- **WHEN** the user activates the Mentions section heading with pointer or keyboard input
- **THEN** the source rows SHALL collapse or expand without changing the derived count or mutating source content
- **AND** focus, reduced-motion preferences, and the chosen presentation state for the current object session SHALL remain recoverable.

#### Scenario: Page has no derived relationship result
- **WHEN** a Page has no backlinks and no unlinked mentions
- **THEN** empty relationship sections SHALL be omitted or expose the reference-confirmed compact empty state
- **AND** the Page SHALL NOT render every other workspace entity as a link or embed suggestion solely to fill the surface.

#### Scenario: Related Page content is rendered
- **WHEN** the Page displays related content
- **THEN** membership and count SHALL derive from an explicit relation, backlink, collection, graph, or documented similarity rule
- **AND** unrelated canonical entities SHALL NOT be presented merely because they occur first in storage order.

#### Scenario: Page editor utility trigger is activated
- **WHEN** the user activates the edge utility trigger that visually uses the reference minus control
- **THEN** a compact Structure/Statistics utility panel SHALL open without hiding the Page header, properties, editor, backlinks, or Mentions
- **AND** the trigger SHALL NOT be named or implemented as full-editor collapse unless a separately evidenced control owns that action.

#### Scenario: Page editor is collapsed and expanded
- **WHEN** a separately evidenced control explicitly named for full-editor collapse is available and the user activates it
- **THEN** the full intended editor region SHALL hide, that separate command SHALL change to an accurate expand name, and focus SHALL remain recoverable
- **AND WHEN** the user expands it
- **THEN** content, selection, and pending valid edits SHALL be restored without duplication
- **AND** the reference edge utility trigger SHALL NOT own or enter this collapse state.

#### Scenario: Active Page is deleted
- **WHEN** the user confirms deletion of the active Page
- **THEN** every tab and projection for that entity SHALL be removed
- **AND** the workspace SHALL select an existing valid fallback or the matching object-type view without leaving a stale deleted-object tab.
