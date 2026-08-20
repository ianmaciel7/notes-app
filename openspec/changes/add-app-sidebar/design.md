## Context

The project already has a reusable `AppShell` and a Base UI-backed shadcn component set. The sidebar feature should therefore be implemented as a focused client component that composes existing primitives rather than extending the shell or adding a second layout system.

## Goals / Non-Goals

**Goals:**
- Add a reusable workspace selector for the left sidebar.
- Follow existing shadcn source conventions: named exports, `data-slot`, `cn`, native props, and composition of existing primitives.
- Match the selected Capacities-inspired selector behavior for desktop sizing, search, empty state, hover hint, reorder affordance, focus handling, and mobile fallback.
- Keep drag reorder client-side and controlled through `onReorder`.
- Keep the combobox open after reorder.
- Avoid popup flicker on outside press and avoid focus moving back to the trigger while the popup is open.

**Non-Goals:**
- No persistence layer for spaces or their order.
- No create-space flow; the action remains disabled.
- No navigation tree or additional sidebar sections.
- No modification of app-shell geometry or global theme tokens.

## Decisions

- Use the existing `Combobox` primitive as the popup/search/selection foundation.
  - **Why:** It already provides keyboard navigation, filtering hooks, popup positioning, focus management, and item indicators.
- Keep the popup controlled through `open` and keep the query controlled through `inputValue`.
  - **Why:** The component must preserve the search content during close so the exit does not visually rebuild or flash.
- Clear the query before the next open, not during close.
  - **Why:** This avoids a second state transition while the popup is closing.
- Use `initialFocus={searchInputRef}` and `finalFocus={false}` on desktop popup content.
  - **Why:** Search owns focus while open, and outside clicks should not briefly restore focus to the trigger.
- Keep `ComboboxList` mounted even when filtering yields zero results.
  - **Why:** This preserves the focus tree and follows the Base UI input-inside-popup composition pattern.
- Use a manually controlled `HoverCard` whose `open` state is driven only by pointer enter/leave timers.
  - **Why:** The hint must never open because of click, focus, or selection.
- Implement reorder with pointer events initiated only from the left grab handle.
  - **Why:** This reproduces the interaction model without adding a sortable dependency and avoids making the whole item draggable.
- Use FLIP-style `Element.animate` transitions with 200ms duration after interim reorder.
  - **Why:** It approximates the reference sortable animation while keeping state controlled.
- Keep desktop menu width at `18rem` and cap the scroll body at `27rem`.
  - **Why:** These are the selected source-derived constraints for the workspace menu.
- Explicitly hide horizontal overflow on the scroll body and keep vertical scrolling only.
  - **Why:** The shadcn separator uses negative horizontal margin and can otherwise create a horizontal scrollbar.
- Use the repository's 768px mobile breakpoint and a bottom `Sheet` presentation.
  - **Why:** This matches existing responsive conventions and keeps the selector usable on narrow viewports.

## Risks / Trade-offs

- [Risk] Pointer-based reorder has more state than a sortable library. → Mitigation: isolate drag-session refs and expose only `onReorder` to callers.
- [Risk] Base UI popup state and controlled React state can compete during pointer-up after reorder. → Mitigation: temporarily cancel close/selection events around the reorder completion window.
- [Risk] Very long space names can expand content. → Mitigation: every row and trigger uses `min-w-0` + `truncate` and the popup constrains horizontal overflow.
- [Risk] The component currently uses demo/local labels. → Mitigation: keep user-facing labels configurable through props so later feature work can connect them to `next-intl` without changing interaction logic.

## Migration Plan

- Add the new app-sidebar component without changing `AppShell`.
- Compose it inside the existing left `AppShellSidebar` header/content region.
- Keep the existing starter page otherwise minimal.
- Verify formatting, lint, typecheck, tests, and build using the project `pnpm verify` workflow when run in a development checkout.
