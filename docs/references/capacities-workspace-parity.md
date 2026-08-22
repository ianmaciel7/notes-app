---
title: Current Capacities workspace parity contract
reference_type: authenticated-product
source_type: live-browser-measurement
updated: 2026-08-22
confidence: confirmed
---

# Current Capacities workspace parity contract

This document is the canonical, timestamped visual and interaction contract for the Notes App workspace. The authenticated Capacities UI measured on 2026-08-22 is authoritative when it conflicts with older repository measurements. Notes App keeps its own local objects, counts, labels, and content.

## Evidence rules

- **CONFIRMED** values were measured from the current authenticated reference and a same-session localhost inspection.
- **INFERRED** behavior is recorded only when a safe read-only interaction could not expose every state.
- **UNKNOWN** behavior must not be invented or used to close an OpenSpec task.
- Authenticated reference screenshots are runtime evidence only and are not committed to the repository.
- A screenshot alone is not completion evidence; computed styles, geometry, DOM state, console state, and behavior must agree.

## Shell geometry

| Contract | Current reference |
| --- | --- |
| Expanded desktop sidebar | 224px (`14rem`) |
| Header rail | 46px |
| Main surface gutter | 10px |
| Main surface radius | 12px |
| Main surface border | approximately 0.8px semantic border |
| Long-form content | fluid, capped near 800px |
| Shell background | `oklch(0.9856 0.0016 67)` |
| Card background | `oklch(1 0.0001 263.28)` |
| Border | `oklch(0.9163 0.0017 67.07)` |
| Primary text | `oklch(0.2191 0.0058 285.84)` |
| Secondary text | `oklch(0.3887 0.0052 301.05)` |

The historical 288px sidebar baseline is superseded. Resizing may remain available, but the expanded acceptance baseline is 224px.

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
| 1536px | 224px sidebar, 46px rail, fluid main surface; contextual panel only when requested by state |
| 1280px | Same baseline; no page overflow and bounded auxiliary panel |
| 1024px | Same baseline; main surface and tab strip remain usable before auxiliary content expands |
| 768px | Sidebar remains available at 224px; tabs stay contained and hidden tabs use the list control; `scrollWidth === clientWidth` |
| 480px | Navigation closed: main surface keeps about 10px outer spacing. Navigation open: bounded Sheet/overlay above the main surface |
| 390px | Dedicated mobile composition remains visible and keyboard-operable in both overlay states; it does not depend on desktop panel dimensions |

At every checkpoint, the page must satisfy `scrollWidth === clientWidth`, the visible main surface must have positive dimensions, and the browser console must contain no implementation errors.

## Local baseline differences to correct

- Local desktop starts from a 288px sidebar instead of 224px.
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

