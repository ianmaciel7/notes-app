# Object-page hover and click action matrix

Viewport: `1282x912`. Content names and counts differ by canonical workspace state and are not compared.

| Action | Expected reference state | Observed localhost after change | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| Header idle | Customize is present in layout but inert and transparent; overflow remains visible. | Customize is `opacity: 0`, `pointer-events: none`; overflow remains visible. | Pass | `reference-header-idle.png`, `localhost-header-idle.png`, `interaction-styles.json` |
| Header hover | Customize fades in without shifting Page type or Collections. | Customize fades to `opacity: 1` without geometry shift. | Pass | `reference-header-hover.png`, `localhost-header-hover.png` |
| Header hover exit | Customize returns to the inert transparent state. | Customize returns to `opacity: 0`, `pointer-events: none`. | Pass | `reference-header-hover-exit.png`, `localhost-header-hover-exit.png` |
| Customize click | Opens the conditional command surface; Add Icon and Add Cover are menu commands. | Opens the command surface with Add Icon and Add Cover; dummy Icon/Cover property inputs are absent. | Pass | `reference-personalize-open-full.png`, `localhost-personalize-open.png` |
| Type selector click | Opens a searchable object-type menu with colored 22px icon badges. | Opens a searchable menu with 22px registry-owned badges; violet and teal palettes use measured values. | Pass | `reference-type-picker-open.png`, `localhost-type-picker-open.png` |
| Collections idle/hover | Stable 26px compound label; nested disclosure reveals on hover. | Stable 25.8px inline selector; hover surface does not move the header. | Pass with local width derived from localized placeholder | `reference-collections-idle.png`, `reference-collections-hover.png`, `localhost-collections-idle.png`, `localhost-collections-hover.png` |
| Collections click | Focuses and opens the inline selector without mutating the Page merely by opening. | Focuses and opens the local Popover without a collection write. | Pass | `reference-collections-clicked.png`, `localhost-collections-clicked.png` |
| Related header idle | Show more occupies its target but is transparent. | Show more is transparent and remains keyboard reachable. | Pass | `reference-related-header-idle.png`, `localhost-related-idle.png` |
| Related header hover | Show more fades to opacity 1 in 200ms. | Show more fades to opacity 1 in 200ms. | Pass | `reference-related-header-hover.png`, `localhost-related-hover.png`, `interaction-styles.json` |
| Related header hover exit | Show more returns to opacity 0 without collapsing or moving rows. | Show more returns to opacity 0 with its 28px target unchanged. | Pass | `reference-related-header-hover-exit.png`, `localhost-related-hover-exit.png` |
| Show more click | Opens Related content in the contextual side panel. | Selects the Related content contextual tab and renders the current local result. | Pass | `reference-related-show-more-clicked.png`, `localhost-related-show-more-clicked.png` |
| Related item hover | 728x33 row gains the subtle background and exposes row actions without shifting content. | Row gains the semantic muted surface without shifting its title or type badge. | Pass for shared hover contract | `reference-related-item-1-hover.png`, `localhost-related-item-hover.png` |
| Related item disclosure click | Caret rotates and the row expands an embedded preview; title navigation remains a separate target. | Caret toggles `aria-expanded` from false to true and renders a read-only preview; title navigation is separate. | Pass | `reference-related-item-1-clicked.png`, `localhost-related-item-clicked.png`, `interaction-styles.json` |
| Relationship reading surface | Empty generic relationship authoring is absent; derived sections render only when applicable. | Permanent Links/Add relationship builder is removed; the local Objects Inside projection remains because canonical local data contains one object. | Pass with different data state | `localhost-header-idle.png`, DOM snapshot recorded during capture |

Reference item rows 2 and 3 were also exercised independently; their hover and click photographs are stored as `reference-related-item-2-*` and `reference-related-item-3-*`.

## Read-only authenticated refresh (1280x720)

This refresh inspected the currently available authenticated object without typing, submitting, or activating mutating row actions. Structured measurements are in `reference-readonly-audit.json`.

| Action | Expected reference state | Observed reference state | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| Tag chip idle | Stable colored chip with no removal affordance obscuring its label. | `90.578x25.781` at `(419,232)`, `6.65px` radius, green text/background; removal affordance is transparent. | Confirmed | `reference-current-idle-full.png`, `reference-readonly-audit.json` |
| Tag chip hover | Keep chip geometry and reveal the trailing removal affordance. | Geometry stayed stable; the `31.531x23.781` trailing affordance reached opacity `1` after its 200ms transition. | Confirmed | `reference-tag-hover-current-full.png`, `reference-readonly-audit.json` |
| Collection chip idle | Stable transparent compound chip with hidden disclosure. | `120.031x25.781` at `(635.469,147.109)`, transparent border/background; trailing `16x16` disclosure is opacity `0`. | Confirmed | `reference-current-idle-full.png`, `reference-readonly-audit.json` |
| Collection chip hover | Reveal the disclosure without moving the label. | Disclosure reached opacity `1`; chip rectangle was unchanged. | Confirmed | `reference-collection-hover-current-full.png`, `reference-readonly-audit.json` |
| Related header idle | Header remains visible while `Mostrar mais` occupies layout at opacity `0`. | Header is `207.094x24`; `Mostrar mais` is `109.859x28`, keyboard-focusable (`tabIndex=0`), opacity `0`, pointer events enabled. | Confirmed | `reference-current-idle-full.png`, `reference-readonly-audit.json` |
| Related header hover | Header gains the subtle back surface and `Mostrar mais` fades in. | Header background became `oklch(0.9856 0.0016 67)` and `Mostrar mais` reached opacity `1` with the measured 200ms transition. | Confirmed | `reference-related-header-hover-current-full.png`, `reference-readonly-audit.json` |
| Related row idle | Compact row with dim secondary actions. | Row is `728x33`; two `22x22` trailing actions are present at opacity `0.2`; disclosure is a focusable `22x22` button. | Confirmed | `reference-current-idle-full.png`, `reference-readonly-audit.json` |
| Related row hover | Preserve geometry, tint the row, and reveal actions. | Row stayed `728x33`, background became `oklch(0.9856 0.0016 67)`, trailing actions reached opacity `1` in 300ms. | Confirmed | `reference-related-row-hover-current-full.png`, `reference-readonly-audit.json` |
| Disclosure click, then restore | Expand a read-only embedded preview and allow collapse back to the original state. | Row grew from `33` to `428.281px`, showed its preview, then returned to `33px`; title text remained unchanged. | Confirmed, reversible | `reference-related-row-expanded-current-full.png`, `reference-readonly-audit.json` |
| Inline title focus | Focus the existing textarea without altering its contents. | Native `textarea`, accessibility snapshot `textbox` named `Título`, `728x39`, 700-weight 30/33px text; focus placed the caret at 11/11 and the value was identical before/after. | Confirmed, non-mutating | `reference-inline-title-focus-current-full.png`, `reference-readonly-audit.json` |
| `Mostrar mais` click, then close | Open the related-content side-panel variant and restore the single-panel layout. | Main panel contracted from `960px` to `523.609px`; side wrapper was `446.391x720`, card `436.391x664`, 12px radius; close affordance restored zero open side panels. | Confirmed, reversible | `reference-related-side-panel-current-full.png`, `reference-readonly-audit.json` |

Not tested: tag removal, collection selection/submission, row action activation, title typing, persistence after reload, and any mutation path.

## Local implementation refresh (1282x912)

| Action | Measured localhost state | Verdict | Evidence |
| --- | --- | --- | --- |
| Overflow menu open | `267.98px` wide; 14 rows at `31.88px`; every row has a semantic leading SVG, Personalizar also owns its submenu chevron, and Excluir Objeto keeps the destructive color. | Pass | `local-overflow-menu-icons.png`, focused Playwright menu test |
| Related header idle/hover | `Mostrar mais` remains in layout at opacity `0`, pointer-events `none`; header hover changes it to opacity `1`, pointer-events `auto` in `200ms`. | Pass | browser DOM/computed-style audit |
| Related row idle/hover | Row is `33px`; actions are opacity `0.2` and inert at idle, then opacity `1`/interactive with the muted row background on hover. | Pass | `local-related-row-hover.png`, browser DOM/computed-style audit |
| Related disclosure and inline title | Disclosure expands a separate preview and exposes a buffered textbox named `Título`; the audit focused it without changing the value, then restored the collapsed row. | Pass for reversible interaction; typed persistence covered by focused source test | `local-related-inline-title.png`, `tests/workspace-related-content-ui.test.mjs` |
