---
title: Current Capacities workspace parity contract
reference_type: authenticated-product
source_type: live-browser-measurement
updated: 2026-08-31
confidence: confirmed
---

# Current Capacities workspace parity contract

This document is the canonical, timestamped visual and interaction contract for the Notes App workspace. For the Pages listing and its surrounding shell, the authenticated Capacities bundle captured on 2026-08-28 is authoritative when it conflicts with the earlier 2026-08-26 measurements. The older capture remains useful historical evidence for clean-default versus persisted-width comparisons. Notes App keeps its own local objects, counts, labels, and content.

## Evidence rules

- **CONFIRMED** values were measured from the current authenticated reference and a same-session localhost inspection.
- **INFERRED** behavior is recorded only when a safe read-only interaction could not expose every state.
- **UNKNOWN** behavior must not be invented or used to close an OpenSpec task.
- Raw authenticated screenshots are runtime evidence only and are not committed. A minimal sanitized image may be persisted only inside a reusable bundle that follows `docs/references/reference-evidence-workflow.md` and records its redactions and state in the manifest.
- A screenshot alone is not completion evidence; computed styles, geometry, DOM state, console state, and behavior must agree.

## Reusable Pages-listing bundle (2026-08-28)

The current component-by-component audit is persisted under `artifacts/reference-evidence/capacities-pages-listing/2026-08-28-matched-1294x912/`. Its `manifest.json` correlates the authenticated Capacities Pages listing with the localhost Pages surface at the `1294x912` baseline plus `1536x900`, `1280x900`, `1024x800`, `768x900`, `480x844`, and `390x844` checkpoints. It records the semantic-selection correction required before comparison and links sanitized Capacities-only image crops with localhost DOM, geometry, behavior, focus, persistence, responsive, and console evidence. The bundle is intentionally incremental until every safe visible affordance has an action-matrix row; localhost screenshots are never persisted.

The August 28 responsive pass confirms that both products contain the document at every recorded width, but document containment alone is insufficient. At 1024px the localhost graph zoom control begins beyond the viewport, at 768px the localhost retains the expanded 288px desktop navigation after the reference has moved it off-canvas, and at 390px the localhost Grade and Table controls are clipped beyond x=390. The mobile navigation opens in both environments, with a 288px reference surface versus a 292.5px local dialog; the local primary group still omits Tasks.

The same pass now records the complete safe sidebar utility and card pre-commit surfaces. Help disclosure content aligns, but local Documentation lacks link semantics. Reference Settings, Shortcuts, and Trash open functional surfaces; their local counterparts only enter an active visual state and expose no destination. The reference Gallery card reveals a 22px action with twelve object commands, while the local card remains a single open target. Reference Back/Forward cycles Pages → Page → Pages → Page; both enabled local controls are no-ops on the opened Page route. No create, share, export, duplicate, delete, pin, or restore command was committed during these checks.

## Reusable object-page bundle (2026-08-28)

The focused object-page evidence is stored under `artifacts/reference-evidence/capacities-object-page/2026-08-28-mentions-utilities/`. It records the object header, an expanded one-item Mentions section, source-row anatomy, and the separately exercised edge-triggered Structure/Statistics utility. The persisted image is a sanitized Capacities-only crop; localhost evidence is structural and behavioral only, never an image. The manifest redacts authenticated route identifiers and records the route fingerprint, interaction matrix, limitations, and reversible text-entry check.

## Object-page hover and click addendum (2026-08-31)

The user-requested state sequence is registered under `artifacts/reference-evidence/capacities-object-page/2026-08-31-browser-comments-hover-states/`. It correlates the `1282x912` Capacities and localhost Page surfaces for header idle/hover, Customize open, type selector colors, Collections idle/hover/open, Related Content idle/hover, every safely available related-row disclosure, and Show More side-panel activation. Its `interaction-styles.json` records the measured opacity, pointer-event, geometry, transition, SVG-path, and color-palette values; `action-matrix.md` distinguishes shared behavior from canonical data differences. The viewport photographs were explicitly requested for this capture, and the manifest records their scope and limitations.

## Object-page editor control addendum (2026-08-31)

The follow-up editor-state bundle is stored under `artifacts/reference-evidence/capacities-object-page/2026-08-31-editor-controls-states/`. It records full-viewport photographs plus DOM, geometry, computed-style, focus, and behavior observations for block-handle idle/hover, grip click/Escape, the corrected flush handle edge, and strict header-only Customize hover. The matched local browser suite now passes the five formerly blocked plus/grip/slash rows. The action matrix keeps the authenticated `@` title/alias surface explicitly `not tested`, because opening it requires editing remote content; executable local tests cover normalized title/alias lookup, identity deduplication, Structure eligibility, exact replacement, rename-safe backlinks, and atomic rejection without treating that as live-reference proof.

## Matched-state geometry matrix

The current Pages comparison is valid only for the recorded August 28 matched state: viewport `1294x912`, expanded 288px navigation in both environments, Pages / Tudo / Gallery-grid selection, and an expanded Graph panel. A sidebar or panel width is not a universal desktop constant.

| Observation | Authenticated reference | Matched localhost | State and verdict |
| --- | --- | --- | --- |
| Expanded desktop sidebar | 288px | 288px | Persisted width aligned for the current capture. |
| Header/context rail top | 46px | 58px | The local contextual surface begins 12px lower. |
| Main surface | x=298, width≈624.47px | x≈298, width≈564.39px | Shared start/gutter; local main is compressed by the wider contextual panel. |
| Contextual panel | width≈351.53px | width≈411.61px | Local panel is approximately 60px wider in the matched state. |
| Hidden contextual panel | main width=986px | main width=986px | Hidden-state shell aligns; local hidden descendants and focus disposition still fail. |
| Horizontal overflow at 390x844 | None | None | Document containment passes, but local Grade/Table controls are clipped beyond x=390. |

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
- **Current matched state**: the August 28 audit explicitly aligned both expanded sidebars at 288px before measuring the main and contextual panels.
- Tests and audits must record which state they use before comparing geometry. They must neither treat 288px as every clean default nor reuse the historical 224px local clean default as the current matched baseline.

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
| 1294x912 | Current matched Pages baseline: both sidebars 288px; reference main/context widths≈624.47/351.53px, local≈564.39/411.61px; reference top rail 46px, local contextual top 58px |
| 1153x912 | Historical August 26 evidence: 288px reference persisted resize state versus 224px localhost clean default |
| 1024px | Record resize state; main surface and tab strip remain usable before auxiliary content expands |
| 768px | Record resize state; tabs stay contained and hidden tabs use the list control; `scrollWidth === clientWidth` |
| 480px | Navigation closed: main surface keeps about 10px outer spacing. Navigation open: bounded Sheet/overlay above the main surface |
| 390px | Dedicated mobile composition remains visible and keyboard-operable in both overlay states; it does not depend on desktop panel dimensions |

At every checkpoint, the page must satisfy `scrollWidth === clientWidth`, the visible main surface must have positive dimensions, and the browser console must contain no implementation errors.

## Local baseline differences to correct

- The current local contextual panel is approximately 60px wider and starts 12px lower than the matched reference, compressing the main Pages surface.
- At 1024px, the graph zoom control extends beyond the visible viewport; at 768px the desktop sidebar remains expanded after the reference has moved navigation off-canvas.
- At 390px, Grade and Table remain focusable beyond the viewport despite document-level overflow metrics passing.
- Local primary navigation omits Tasks, and its Explore, Calendar, and task destinations do not implement the reference route-specific contracts.
- Local Settings, Share, and Trash footer actions change trigger styling without opening a functional surface; the reference trailing footer action is Shortcuts, not Share.
- Local Gallery cards omit the reference contextual action menu, and local Back/Forward controls remain enabled while acting as no-ops after card navigation.
- Hidden sidebar and card actions must not retain unexplained pointer-active regions. The audit found this issue locally for section actions and in the reference card trigger; the implementation contract requires the safer inert-hidden behavior.

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
