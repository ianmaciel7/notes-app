---
title: Current Capacities workspace parity contract
reference_type: authenticated-product
source_type: live-browser-measurement
updated: 2026-08-26
confidence: confirmed
---

# Current Capacities workspace parity contract

This document is the canonical, timestamped visual and interaction contract for the Notes App workspace. The authenticated Capacities UI measured on 2026-08-26 is authoritative when it conflicts with older repository measurements. Notes App keeps its own local objects, counts, labels, and content.

## Evidence rules

- **CONFIRMED** values were measured from the current authenticated reference and a same-session localhost inspection.
- **INFERRED** behavior is recorded only when a safe read-only interaction could not expose every state.
- **UNKNOWN** behavior must not be invented or used to close an OpenSpec task.
- Raw authenticated screenshots are runtime evidence only and are not committed. A minimal sanitized image may be persisted only inside a reusable bundle that follows `docs/references/reference-evidence-workflow.md` and records its redactions and state in the manifest.
- A screenshot alone is not completion evidence; computed styles, geometry, DOM state, console state, and behavior must agree.

## Matched-state geometry matrix

The August 26 evidence is valid only for the recorded matched state: viewport `1153x912`, expanded navigation, the same route/selection and contextual-panel state, and the observed persisted resize state. A sidebar width is not a universal desktop constant.

| Observation | Authenticated reference | Matched localhost | State and verdict |
| --- | --- | --- | --- |
| Expanded desktop sidebar | 288px | 224px | The reference's recorded resize state is 288px; the localhost clean default is a 64px parity gap. |
| Header rail | 46px | 58px | The local rail is 12px taller in the matched capture. |
| Main surface start | approximately x=298 | almost flush with the sidebar | Reference uses a 10px gutter after the 288px sidebar. |
| Contextual panel | Route-sensitive | Wider, always-generic Explore panel | Panel content and width must be compared only for the same route/state. |
| Horizontal overflow at 390x844 | None | None | Both captures contained the page; surface/rail composition still differed. |

| Stable visual contract | Recorded value |
| --- | --- |
| Main surface radius | 12px |
| Main surface border | approximately 0.8px semantic border |
| Long-form content | fluid, capped near 800px |
| Shell background | `oklch(0.9856 0.0016 67)` |
| Card background | `oklch(1 0.0001 263.28)` |
| Border | `oklch(0.9163 0.0017 67.07)` |
| Primary text | `oklch(0.2191 0.0058 285.84)` |
| Secondary text | `oklch(0.3887 0.0052 301.05)` |

### Clean defaults and persisted resize state

- **Clean local default**: no saved panel-resize state is applied. In the August 26 localhost capture, this was 224px.
- **Persisted resize state**: a previously saved panel width is active. The August 26 authenticated reference captured a 288px expanded sidebar in this state.
- Tests and audits must record which state they use before comparing geometry. They must neither treat 288px as every clean default nor treat 224px as the current-reference baseline.

## Interaction state matrix

| Component | Idle | Hover/focus | Activated/post-click | Motion |
| --- | --- | --- | --- | --- |
| Sidebar row | Stable icon/label alignment | Full row receives the subtle surface; count/actions reveal without shifting the label | Primary row navigates/selects; nested actions do not navigate | approximately 200ms |
| Main tab | 32px high, 8px radius | Surface/text/border change; contextual actions reveal without covering the midpoint | Midpoint selects; Pin and Close run only from their dedicated targets | 150ms visual, 200ms action reveal |
| Object-type chip | Text and arrow are visually compound | Each target remains independently focusable | Text navigates; arrow opens a searchable selector without navigation | approximately 250ms popover transform |
| Overflow menu | Closed with no data mutation | Parent of a submenu retains its highlighted/open state | Escape and outside click close; commands act only after selection | 100-250ms by surface level |
| Tooltip | Hidden | Delayed elevated surface with shortcut keycaps where available | No workspace mutation | approximately 300ms opacity |

Shared overflow surfaces use approximately 268-269px width, 12px radius, 6px padding, and 32px rows. Destructive actions use the semantic destructive treatment.

## Responsive checkpoints

| Viewport | Required state |
| --- | --- |
| 1536px | Record clean or persisted resize state before comparison; retain a 46px rail, fluid main surface, and contextual panel only when requested by state |
| 1280px | Record resize state; no page overflow and bounded auxiliary panel |
| 1153x912 | Matched August 26 evidence: 288px reference persisted resize state versus 224px localhost clean default; reference rail 46px, local rail 58px |
| 1024px | Record resize state; main surface and tab strip remain usable before auxiliary content expands |
| 768px | Record resize state; tabs stay contained and hidden tabs use the list control; `scrollWidth === clientWidth` |
| 480px | Navigation closed: main surface keeps about 10px outer spacing. Navigation open: bounded Sheet/overlay above the main surface |
| 390px | Dedicated mobile composition remains visible and keyboard-operable in both overlay states; it does not depend on desktop panel dimensions |

At every checkpoint, the page must satisfy `scrollWidth === clientWidth`, the visible main surface must have positive dimensions, and the browser console must contain no implementation errors.

## Local baseline differences to correct

- The August 26 matched localhost clean default was 224px while the reference's recorded persisted width was 288px.
- At 768px, three columns can compress the main area to about 266px and leave only about 86px for the tab list.
- Current hover actions can cover 36px of a 64px tab, including its geometric midpoint; the safe selection region is therefore too small.
- The 390px route already renders a separate mobile surface; the desktop shell being zero-sized at that breakpoint is expected, but the mobile open and closed states still require explicit verification.

## Ownership boundary

| Area | Owner for this change |
| --- | --- |
| Shell width, responsive panels, overlays, stable triggers | `src/components/app-shell.tsx` |
| Tabs, tab hit targets, tab overflow | `src/components/app-header-tabs.tsx` and header composition |
| Sidebar rows and contextual actions | sidebar application components |
| Shared popup/menu appearance | named variants under `src/components/ui` |
| Workspace transient navigation/panel state | `src/components/workspace-controller.tsx`, without public API or persistence changes |
| Object body model, block editor, entity/storage migration | Reserved for `openspec/changes/add-block-editor`; excluded here |
| Existing Graphify outputs and unrelated browser artifacts | Pre-existing user changes; never stage or rewrite as part of parity work |

## Verification

Use the focused parity audit and browser interaction suite for default, hover, focus-visible, selected, menu, submenu, post-click, overlay-open, overlay-closed, and reduced-motion states. Run source checks and strict OpenSpec validation before claiming convergence.

## Production-view command matrix

This matrix records the task 7.9 acceptance surface. The reference column is
the August 26 authenticated observation and its documented interaction
contract; it deliberately does not substitute a prior local route or a
placeholder screen. Local assertions use only
`workspace-object-page-view` and `workspace-object-type-view` for the shared
Page and object-type helpers. `not tested` means the authenticated reference
did not safely expose that transition in the recorded session.

| Action | Reference | Localhost | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| Idle | CONFIRMED: Page and object-type views render their selected baseline without placeholder content. | Production route renders the matching view slots before interaction. | Pass | `workspace-parity.spec.ts`: `object page header controls keep fluid click and keyboard states`; source guard in `workspace-surface-contract.test.mjs`. |
| Hover | CONFIRMED: header controls and graph controls reveal state without geometry shift. | Bounding-box stability is asserted after hover on production-owned controls. | Pass | `object page header controls keep fluid click and keyboard states`; `graph controls preserve hover geometry and support reversible click and drag states`. |
| Focus-visible | CONFIRMED: controls retain a visible keyboard focus state. | Tab/focus assertions target named production controls and retain a recoverable focus target. | Pass | `object page header controls keep fluid click and keyboard states`; `Page Customize respects reduced motion and keeps truthful keyboard controls`. |
| Pointer | CONFIRMED: primary and nested targets have distinct outcomes. | Midpoint, compound disclosure, sidebar row, menu, and graph drag assertions use production controls. | Pass | `tab midpoint and dedicated actions do not overlap`; `compound type chip separates navigation from disclosure`; `sidebar row and nested menu keep distinct full-row targets`; `graph controls preserve hover geometry and support reversible click and drag states`. |
| Keyboard | CONFIRMED: Enter/Space activate the named action without an incidental mutation. | Header and Customize actions are activated by keyboard with post-action assertions. | Pass | `object page header controls keep fluid click and keyboard states`; `Page Customize respects reduced motion and keeps truthful keyboard controls`. |
| Open | CONFIRMED: menus and customization surfaces open without mutating an entity. | Disclosure, overflow, and Customize surfaces assert visible roles/content and unchanged entity state on open. | Pass | `object-type New disclosure opens options without creating an object`; `workspace overflow menu supports submenu, outside click, and Escape`; `Page Customize exposes every reference action and persists property outcomes`. |
| Escape-closed | CONFIRMED: Escape closes transient surfaces and focus returns to the trigger. | Menus/panels close and focus recovery is asserted from the production trigger. | Pass | `workspace overflow menu supports submenu, outside click, and Escape`; `Novo Page and Table flows keep split actions, writes, and counts durable`. |
| Post-click render | CONFIRMED: accepted commands change the selected view or rendered presentation, not merely their label. | Commands assert the active tab/view, named outcomes, and durable projection after action. | Pass | `production object-type commands render named outcomes`; `Page Customize exposes every reference action and persists property outcomes`; `Page Collections and overflow controls keep Page metadata synchronized`; `Novo Page and Table flows keep split actions, writes, and counts durable`. |
| Reload | CONFIRMED: saved presentation/entity state remains after reopening when the product promises persistence. | Header, collections, Page/Table content, and layout state are reloaded from the production route. | Pass | `workspace tab header state survives reload`; `Page collections synchronize header chips, object-type collection rows, and reload persistence`; `Page Collections and overflow controls keep Page metadata synchronized`; `Novo Page and Table flows keep split actions, writes, and counts durable`. |
| Reversible presentation toggles | CONFIRMED: graph center/zoom and Page layout actions visibly change state and can be reversed. | Graph drag/center/zoom and wide-layout commands assert each before/after rendered state. | Pass | `graph controls preserve hover geometry and support reversible click and drag states`; `Page Customize exposes every reference action and persists property outcomes`. |
| Truthful unavailable states | CONFIRMED: a visible unsupported command must state unavailability instead of showing an instructional placeholder. | Object-type commands assert named rendered outcomes; unsupported authenticated-reference transitions were not safely available. | Local pass; reference unavailable transitions not tested | `production object-type commands render named outcomes`; task 7.9 source guard rejects selector fallbacks. |

Run the matrix with `pnpm exec node --test tests/workspace-surface-contract.test.mjs` and `pnpm test:parity`. A passing source guard proves the shared helpers cannot fall back to `object-type-workspace`, `object-type-named-item-workspace`, or `created-object-workspace`; browser evidence remains required for each interaction row.
