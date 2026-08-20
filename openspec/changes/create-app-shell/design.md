## Context

The project already uses shadcn Nova components, Base UI, Tailwind CSS, CVA, and `react-resizable-panels`. The new shell is foundational UI infrastructure rather than feature content. It must preserve the Capacities-inspired desktop geometry while exposing a composable API consistent with shadcn source style: named exports, `data-slot` attributes, `className` merging with `cn`, native element props, and CVA only where a real variant is needed.

The shell must remain content-agnostic because future screens will add workspace controls, navigation, tabs, dropdown menus, hover cards, explorer actions, and other rich components into headers and surfaces.

## Goals / Non-Goals

**Goals:**
- Provide a reusable three-pane shell with a left sidebar, main pane, and right side panel.
- Use shadcn `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` for resize behavior and accessibility.
- Use stable collapse triggers that do not flicker or disappear while panels collapse/expand.
- Preserve desktop dimensions selected from the Capacities reference: left default 18rem with 14rem–24rem limits, right default 45% with 10%–90% limits, 46px header, 12px rounded surfaces, and ~10px spacing.
- Keep the outer background/sidebar on `bg-sidebar` and content surfaces on `bg-background`, using the existing Nova theme unchanged.
- Provide named compositional subcomponents that accept children and native props.
- Switch to shadcn `Sheet`-based mobile side panels below the project's standard 768px mobile breakpoint.

**Non-Goals:**
- No navigation items, tabs, menus, workspace labels, explorer content, or page content are hardcoded into the shell.
- No custom global theme tokens or `globals.css` changes.
- No custom pointer-drag resize implementation.
- No exact recreation of every Capacities visual detail outside shell geometry and behavior.

## Decisions

- Use a single `AppShellProvider` context to hold panel refs, collapsed state, and trigger actions.
  - **Why:** Keeps callers unaware of imperative `collapse()`/`expand()` APIs while supporting public trigger components.
  - **Alternative:** Passing callbacks/refs through props would leak implementation details into every consumer.
- Keep shadcn `Resizable` as the only resize implementation.
  - **Why:** It already provides keyboard-accessible separators, min/max constraints, persistence-ready IDs, and panel imperative APIs.
  - **Alternative:** Manual pointer events would duplicate functionality and diverge from shadcn conventions.
- Expose named exports instead of compound `AppShell.X` properties.
  - **Why:** This matches shadcn's `Card`, `Sidebar`, `Sheet`, and related component style.
- Track the rendered left-panel width with `elementRef` + `ResizeObserver` only to position the persistent left collapse trigger.
  - **Why:** The trigger must remain mounted outside the collapsible panel while following the panel's actual rendered width during both resize and expand/collapse.
  - **Alternative:** A separate CSS transition on trigger position can drift out of sync and visibly flicker.
- Keep the right trigger at a stable viewport-relative coordinate while the right panel changes size.
  - **Why:** This matches the desired interaction observed in the reference and avoids remount/crossfade artifacts.
- Use `Sheet` for mobile navigation/side-panel access rather than keeping the desktop three-pane split.
  - **Why:** The project's shadcn mobile breakpoint is 768px and narrow viewports should prioritize one content surface at a time.

## Risks / Trade-offs

- [Risk] `ResizeObserver` positioning can run frequently during animations. → Mitigation: update one CSS custom property only; no React state is updated per animation frame.
- [Risk] Imperative panel collapse state and React state can diverge. → Mitigation: synchronize state from each panel's `onResize` callback and keep toggle helpers centralized in the provider.
- [Risk] Very narrow desktop widths may conflict with the 14rem left minimum and usable main width. → Mitigation: switch to the mobile/Sheet layout below 768px and keep a minimum workspace width on desktop.
- [Risk] Styling the native resize handle could accidentally reduce accessibility. → Mitigation: keep the actual `ResizableHandle` separator and only customize its visual line/hit area.

## Migration Plan

- Add the app-shell primitive without modifying existing global styling.
- Replace the current starter page body with a minimal composition example using the shell's named exports and empty surfaces.
- Run formatting, linting, typecheck, tests, and build through the project's existing verification workflow.
- Future feature branches can fill shell headers/content through children without modifying the primitive itself.
