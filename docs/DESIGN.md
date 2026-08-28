# Design Principles

## Accessibility

- Use native or explicit roles for every actionable surface. A control that is
  visually present must have a stable accessible name; a control that is
  visually hidden must be removed from pointer hit testing and sequential
  keyboard navigation until hover or focus-within reveals it.
- Keep compound controls genuinely separate. Workspace tabs, sidebar rows,
  object-type disclosures, cards, and split buttons must preserve distinct
  primary, disclosure, pin, close, and overflow targets without overlapping the
  primary target's midpoint.
- A visually disabled command must also report disabled semantics. An active or
  pressed trigger is not a substitute for the dialog, menu, route, or content
  surface that the control promises.
- When a panel or transient surface closes, move focus to a visible stable
  trigger or neutral document target. Never strand focus on off-screen panel
  descendants.

## Coding Standards

- Follow English-first documentation and code-facing artifacts.
- Keep UI behavior intentional and predictable.

## Component Style Contracts

- The Capacities acceptance shell uses the warm `background`/`sidebar` surface
  (`oklch(0.9856 0.0016 67)`), while application panels and editor cards use
  `card`. Their shared light border is `oklch(0.9163 0.0017 67.07)`; route
  components must consume these semantic tokens instead of duplicating colors.
- At desktop acceptance widths, preserve the current measured shell hierarchy: a
  46px top rail, a 10px content gutter, and a white editor card with a 12px
  radius. Record the panel resize state with each comparison. The current
  August 28, 2026 matched `1294x912` audit aligns both expanded sidebars at
  288px, while the reference main/context surfaces measure approximately
  624.47px/351.53px and localhost measures approximately
  564.39px/411.61px. The local contextual surface also begins at y=58 instead
  of the reference y=46. Treat these as timestamped state evidence, not
  universal desktop widths. See
  `docs/references/capacities-workspace-parity.md` for the viewport and
  interaction matrix.
- Before repeating a Capacities or external-site capture, search the reusable
  corpus and follow `docs/references/reference-evidence-workflow.md`. Persist
  only sanitized, state-correlated image, HTML/DOM, computed CSS, and minimal
  JavaScript behavior evidence.

- Shared floating UI such as tooltips, hover cards, popovers, menus, selects,
  comboboxes, and command items must use the centralized primitives in
  `src/components/ui/shared-styles.ts`.
- Floating surfaces use one visual recipe: popover background and foreground,
  the shared light border, a 12px radius, and the centralized low-opacity,
  multi-layer shadow. Do not replace this reference shadow with a stock
  `shadow-md` utility.
- Dropdowns, selects, command menus, and searchable creation menus use 32px
  rows with 14px labels, 8px item radii, secondary icons, and content-aligned
  separators. A 24px compact row is a deliberate named compact-menu variant
  and must not become the default popup density.
- Context variants may change menu width, row density, or scrolling behavior;
  they must inherit the shared surface color, border, radius, shadow, focus,
  highlighted, and selected-state contracts unless current reference evidence
  demonstrates a real contextual difference.
- Sidebar context menus use the shared 269px width exported by
  `src/components/ui/compact-menu.tsx`. Feature components may choose popup
  placement, but they must not redefine the surface, row, separator, icon, or
  shortcut appearance locally.
- Control icons and menu/list items must use the shared icon and item classes
  instead of redefining SVG sizing, pointer events, radius, hover, or selected
  states in each component.
- Object icons must come from `src/components/object-icons.tsx` so a Page,
  Quote, Atomic note, Task, Table, or other object keeps the same glyph in every
  location.

## Workspace Interaction Contracts

### Navigation and history

- The selected workspace tab, rendered surface, route, and semantic selected
  state must agree. Persisted tab state must never silently override a supplied
  route without being recorded and corrected before comparison.
- Back and Forward are real workspace-history operations. From Pages, opening a
  Page, going Back, going Forward, and going Back again must produce
  Pages → Page → Pages → Page → Pages. A control must not remain enabled while
  acting as a no-op.
- Global Search, global New, tab list, create-tab chooser, settings, shortcuts,
  trash, and other transient surfaces open over the current workspace and must
  close without rewriting the underlying route or selection unless the user
  commits a destination.

### Sidebar

- Expanded desktop navigation uses the recorded 288px state and exposes New,
  Search, Explore, Calendar, and Tasks as primary destinations in that order.
  An object-type Tasks row does not substitute for the primary Tasks workspace.
- Section disclosures own only their child rows and empty states. Sort, add,
  nested overflow, and primary row actions are independent targets; hidden
  section actions are inert until revealed.
- Help and resources contains Getting started, Ask a question, Documentation,
  What's new, and Feedback. Documentation retains link semantics and its
  canonical external destination.
- Settings, shortcuts, and Trash must open functional surfaces. Merely applying
  an active style to the trigger is a failed interaction. The trailing reference
  footer action is the searchable shortcuts reference; an unimplemented Share
  action is not an equivalent replacement.
- Add pinned content, Add object type, and Add section may be inspected and
  cancelled without mutation. Their create controls remain visibly and
  semantically disabled until required input is valid.

### Workspace headers and contextual panel

- The 46px reference rail contains bounded Back, Forward, tab list, create-tab,
  synchronization, focus-mode, panel-tab, create, hide, and menu controls.
- Create tab opens a destination chooser in new-tab mode; it must not select an
  unrelated existing tab. Synchronization status opens Offline & Sync settings.
- Listing-specific import commands stay in Pages creation/overflow surfaces and
  do not consume the workspace-tab rail or displace synchronization controls.
- Focus mode replaces normal workspace chrome rather than leaving the expanded
  sidebar and contextual graph visible as ordinary navigation.
- With Pages selected and no graph center object, the contextual graph body
  follows the reference empty composition. Graph controls appear only when
  applicable; once applicable, their hover geometry, settings, zoom, center,
  and drag actions remain reversible.
- Panel resize dividers provide a discoverable non-zero hit target, update both
  adjacent surfaces without overlap, and restore the recorded width within one
  rendered CSS pixel after a reversible audit drag.

### Pages listing and cards

- Overview/All selection, result count, filter, sort, group, layout, and rendered
  presentation must agree. The reference layout family is List, Board, Kanban,
  Gallery, Table, and Embed; local direct shortcuts may not redefine that menu.
- Filter, sort, and group use composable rule builders. The split New disclosure
  contains New Page and Import files; template, query, and collection creation
  remain in the listing overflow.
- Gallery cards separate the primary open target from a named 22px contextual
  action. The action reveals without layout shift and opens Select multiple,
  Open, Edit collections, Pin, Change type, Object type settings, Share,
  Present, Export, Copy, Duplicate, and Delete command families.
- Opening menus and pre-commit states is safe audit coverage. Creating,
  importing, editing, sharing, exporting, duplicating, or deleting authenticated
  reference data remains explicitly not tested without separate authorization.

## Responsive Composition

- Desktop containment is judged from individual control rectangles as well as
  `scrollWidth === clientWidth`; a focusable control beyond the viewport fails
  containment even when the document itself does not overflow.
- At the 768px reference checkpoint, the 288px navigation is off-canvas in the
  closed state. At 480px and 390px, navigation and contextual content use
  bounded transient surfaces above the main surface.
- At 390px, compact listing controls must remain within x=390. Redundant direct
  layout shortcuts collapse into the layout menu before they are clipped.

## Evidence and Verification

- The current reusable contract is the August 28 bundle under
  `artifacts/reference-evidence/capacities-pages-listing/2026-08-28-matched-1294x912/`.
  Its action matrix is the source for observed parity verdicts; this document
  carries the stable design rules derived from those observations.
- Persisted images are sanitized Capacities-only crops. Localhost evidence uses
  DOM/accessibility, geometry/style, behavior, console, and focused browser-test
  artifacts; localhost screenshots are not stored.
- A parity claim requires correlated semantic state, viewport, persistence,
  interaction outcome, focus behavior, and runtime evidence. A screenshot or a
  passing narrow test alone is insufficient.
