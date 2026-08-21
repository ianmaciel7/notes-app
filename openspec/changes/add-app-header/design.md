## Context

The `feat/app-header` branch already contains the app shell, sidebar, and an initial reusable `AppHeader`. The captured Capacities source shows that the product header is not just a row of four buttons: the desktop `ComponentHeader` composes history controls, a central `SpaceHeader`, focus mode, and side-panel controls; the side panel has its own tab header. The existing implementation leaves the center region empty and places create next to history, which does not match the reference.

The uploaded WACZ-derived corpus is the visual and behavioral reference for this change. Relevant captured behavior includes a 46px desktop header; a main tab strip with 200px max width, 60px min width, and 5px gaps; a side-panel tab strip with 160px max width, 44px min width, and 4px gaps; active/neutral/inactive tab states; pin and close secondary actions; tab-list overflow; drag reordering; and focus-mode controls.

The repository remains shadcn-first. Existing project primitives (`Button`, `Tooltip`, `Popover`, `HoverCard`, `Input`) should provide interaction/accessibility, while application-level tab layout and state logic live under `src/components`.

## Goals / Non-Goals

**Goals:**
- Keep `AppHeader` a reusable 46px application component.
- Put only history controls in the left header group and focus mode in the right header group.
- Render the main `AppSpaceHeader` as the flexible center content.
- Match the reference tab geometry: 32px height, 13px label, 0.5px border, 6px left padding, 1px right padding, entity icon chip, and 150ms width/state transitions.
- Match main tab responsive sizing and overflow: 200px max, 60px min, 5px gap, active-centered contiguous visible window, tab-list dropdown, and create-button relocation when cramped.
- Match side-panel sizing and structure: 160px max, 44px min, 4px gap, tab-list/+ controls separated from the tab row, `explore` non-draggable, and no main-tab pin action.
- Match pin behavior: unpinned pin appears on tab hover; pinned pin remains visible; pinning does not reorder or activate; pinned main tabs reject close requests through the caller-provided close contract.
- Support drag reordering through controlled callbacks.
- Support inactive-tab preview through the existing `HoverCard` primitive without enabling it for active/dragging tabs.
- Support focus mode with a floating primary exit control and secondary history controls that expand horizontally on hover.
- Demonstrate all target tab states on the starter page while keeping application routing/search/persistence out of the reusable component.
- Preserve existing app-shell resizing, sidebar, mobile, and side-panel contracts.

**Non-Goals:**
- No persistence of tabs to storage or backend.
- No production router/history integration.
- No production global search implementation; the create callback remains controlled by the caller.
- No changes to sidebar contents or app-shell resize behavior.
- No new dependencies or global CSS.

## Decisions

- Keep `src/components/app-header.tsx` focused on root header composition, history/focus actions, and focus-mode controls.
  - **Why:** `ComponentHeader` and `SpaceHeader` are separate concepts in the reference, and separating them keeps product structure composable.
- Add `src/components/app-header-tabs.tsx` for the reusable tab primitive, main `AppSpaceHeader`, and `AppSidePanelHeader`.
  - **Why:** Main and side-panel headers share tab visuals but have distinct sizing and control logic.
- Use the existing `Button`, `Tooltip`, `Popover`, `HoverCard`, and `Input` components and the configured Lucide icon library.
  - **Why:** Repository rules require shadcn-first composition and the configured icon library. Exact reference geometry is applied through Tailwind classes around those primitives.
- Keep tab collections controlled (`tabs`, `value`, callbacks) rather than hiding persistence inside components.
  - **Why:** The reference owns tab data in application state; reusable UI should not decide storage or navigation semantics.
- Represent pin protection as part of the close callback contract in the demo/state owner, while `AppTab` still renders the close affordance according to visual state.
  - **Why:** The reference visually shows the close action but rejects closing a pinned main tab at the action handler level.
- Keep overflow selection independent of pin state.
  - **Why:** Captured source calculates a contiguous visible range around the active tab; pinned tabs do not anchor the overflow window.
- Keep a dedicated client demo component for the starter page.
  - **Why:** The locale page can remain a server component while interactive tab state stays isolated and replaceable.

## Risks / Trade-offs

- [Risk] The configured Lucide glyphs are not byte-identical to the reference Phosphor glyphs. → Mitigation: preserve exact sizing, spacing, state, and color treatment while following the repository icon-library rule.
- [Risk] Native HTML drag/drop differs from the production Capacities drag system. → Mitigation: preserve the same reorder semantics, insertion-side behavior, and visual insertion indicator without adding a dependency.
- [Risk] Demo data may be mistaken for product persistence. → Mitigation: keep the demo in a dedicated component and keep all reusable APIs controlled.
- [Risk] Exact mobile behavior is broader than this desktop header scope. → Mitigation: leave existing mobile shell composition unchanged.

## Migration Plan

1. Update the active `add-app-header` OpenSpec artifacts to include tabs, pinning, overflow, side-panel header, and focus-mode behavior.
2. Add `app-header-tabs.tsx` with the shared tab primitive and the main/side-panel header components.
3. Update `app-header.tsx` so create belongs to the central `AppSpaceHeader`, not the history group, and add focus-mode controls.
4. Add a client `AppHeaderDemo` composition containing all reference tabs and controlled pin/close/reorder state.
5. Update the locale starter page to use the demo in the existing app shell and retain the existing mobile shell.
6. Run repository verification when an executable checkout/CI run is available.
