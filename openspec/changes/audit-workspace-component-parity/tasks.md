## 1. Complete Matched Evidence

- [x] 1.1 Finish the shell and sidebar action matrix for idle, hover, keyboard focus, disclosure, nested action, open/close, collapse, persisted width, and unavailable states; verify every visible safe affordance has a row in the reusable bundle.
- [x] 1.2 Finish the main and side-panel header matrix for tab selection, midpoint activation, pin/close isolation, overflow, create-tab, focus mode, panel toggle, panel menu, Escape, outside click, and focus recovery; verify reference and localhost observations are correlated at the same effective viewport.
- [x] 1.3 Finish the Pages listing matrix for search, collapse, overflow, split New disclosure, Overview/All, filter, sort, group, layout, list/grid/table, cards, new-object entry, empty/unavailable states, and persistence; verify authenticated mutations remain explicitly `not tested` unless separately authorized.
- [x] 1.4 Exercise keyboard traversal and reduced-motion variants for every supported control group; verify focus order, focus visibility, activation keys, geometry stability, and motion outcomes are recorded.
- [x] 1.5 Update the bundle manifest, sanitized Capacities-only image crops, DOM/accessibility summaries, computed style/geometry data, behavior observations, runtime summary, and source-specific documentation index; verify every artifact exists and every saved image has been visually inspected.

## 2. Align Shell and Contextual Panel

- [x] 2.1 Align the expanded contextual surface with the reference 46px top rail and matched persisted width behavior; verify the main and contextual surfaces remain visible, bounded, non-overlapping, and free of horizontal overflow at the recorded desktop viewport.
- [x] 2.2 Make collapsed contextual-panel DOM state non-interactive and non-visible while preserving the stable reopen controls; verify hidden controls do not create focus stops and the open/closed transition restores focus correctly.
- [x] 2.3 Add responsive checks for desktop, cramped, tablet, and mobile panel compositions; verify panel containment, overlays, scroll dimensions, and selected content at each required breakpoint.

## 3. Align Sidebar Interactions

- [x] 3.1 Keep primary rows, disclosures, nested collection rows, counts, sort/add controls, and overflow actions as distinct named targets; verify pointer and keyboard activation affect only the intended state.
- [x] 3.2 Align idle, hover, focus-visible, expanded, collapsed, selected, and contextual-action reveal geometry without row-label or neighboring-target shift; verify focused component and browser coverage passes.
- [x] 3.3 Align help/footer controls, space switcher, theme/profile/share surfaces, and left-sidebar collapse behavior with shared primitives and localization; verify every visible label exists in all supported locale catalogs.

## 4. Align Workspace Headers

- [x] 4.1 Keep restored tab selection, rendered content, `aria-selected`, and synchronized route truthful; verify selecting an existing Pages tab replaces the restored object surface without entity mutation.
- [x] 4.2 Align tab hover/focus timing, safe midpoint target, nested pin/close actions, overflow window, list menu, create-tab action, and focus mode; verify each post-action state and focus recovery in focused browser tests.
- [x] 4.3 Align the side-panel tab header, create action, hide action, menu action, and special-entry menu with the same visible and semantic contract; verify controls remain inside the rail and no duplicate open-state toggle appears.

## 5. Align Pages Listing Controls

- [x] 5.1 Align the type icon, heading, search, collapse, overflow, and split New geometry and motion using shared controls; verify search open/Escape, collapse reversal, menu close behavior, and unchanged entity counts.
- [x] 5.2 Align Overview/All selection, count, filter, sort, group, layout, and list/grid/table controls; verify selected or pressed state agrees with the rendered presentation and promised persistence after reload.
- [x] 5.3 Align entity cards/rows, empty states, unavailable states, and new-object entry without forcing local data to match reference names or counts; verify card navigation, return path, and non-mutating menu inspection.
- [x] 5.4 Reuse the central object icon registry, semantic tokens, shared popup variants, and localized copy for every adjusted listing control; verify source guards reject one-off popup styling and duplicate object icons.

## 6. Verification and Handoff

- [x] 6.1 Run focused source, component, browser, accessibility, keyboard, persistence, console, responsive, and reduced-motion checks for every changed interaction contract; verify there are no new failures and record unrelated baseline failures separately.
- [x] 6.2 Run `openspec validate audit-workspace-component-parity --strict` and the repository documentation/evidence checks; verify proposal, six delta specs, design, tasks, bundle manifest, and reference index remain coherent.
- [x] 6.3 Recapture only changed Capacities reference states when prior evidence is stale or contradicted, and recapture local structured evidence after implementation; verify earlier capture identities remain immutable and localhost screenshots are not persisted.
- [x] 6.4 Synchronize stable audit-derived interaction, accessibility, responsive, mutation-boundary, and verification contracts into `docs/DESIGN.md` and `docs/TESTING.md`; update the timestamped parity index without presenting the August 26 baseline as current.
