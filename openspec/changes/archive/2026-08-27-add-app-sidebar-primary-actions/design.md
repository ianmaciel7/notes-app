## Context

The repository already contains a reusable `AppShell`, an `AppSidebar` workspace selector, and Base UI-backed shadcn primitives. The new primary actions should therefore be added as sidebar content, not by changing shell layout behavior or duplicating button/tooltip primitives.

The Capacities reference source uses a shared interactive primitive for the primary actions. Each action uses subtle button geometry, a hover-only hint, and shortcut metadata. The reference uses an approximately 200ms hover delay and closes the hint immediately on click/leave.

## Goals / Non-Goals

**Goals:**
- Add enabled `New`, `Search`, `Explore`, and `Calendar` actions below the workspace selector.
- Use one generic action component and data definitions rather than one-off components per action.
- Reuse existing `Button`, `HoverCard`, and `Kbd` primitives with minimal styling overrides.
- Show hover hints for all four actions, including multi-entry content for Search and Explore.
- Keep hover opening pointer-driven and close the hint immediately when the pointer leaves or the action is pressed.
- Expose a typed action callback so later routing/dialog work can connect without replacing the component.
- Preserve the existing app-shell and workspace-selector contracts.

**Non-Goals:**
- No implementation of the New menu, global search, Explore dashboard, or Calendar routing.
- No keyboard shortcut registration in this change; shortcut chips are descriptive UI only.
- No app-shell geometry or resize changes.
- No new dependency or global CSS.

## Decisions

- Add `src/components/app-sidebar-primary-actions.tsx` rather than expanding `app-sidebar.tsx` further.
  - **Why:** The workspace selector is already large and stable. A focused component keeps responsibilities separate and follows compositional shadcn-style organization.
- Model actions as typed data and render them through one `AppSidebarPrimaryActionItem`.
  - **Why:** All four actions share the same geometry and hover behavior, while tooltip content differs only by data.
- Use `Button variant="ghost" size="default"` and only add width/alignment classes required by sidebar layout.
  - **Why:** This keeps native project button sizing and interaction states instead of reproducing them with custom CSS.
- Use the existing `HoverCard` primitive with controlled pointer-only open state and a 200ms timer.
  - **Why:** The repository already uses this pattern for the workspace hint, and it prevents focus/click events from reopening the hint unexpectedly.
- Use `Kbd`/`KbdGroup` for shortcut chips.
  - **Why:** These primitives already encode project keyboard-key styling.
- Keep `New` enabled but do not model it as a selected route.
  - **Why:** In the reference it opens a creation surface rather than becoming the current navigation section.
- Allow Search, Explore, and Calendar to receive an optional `activeAction` state from callers.
  - **Why:** It keeps selection controlled and lets the demo show the active-row appearance without coupling the component to routing.

## Risks / Trade-offs

- [Risk] Hover-card popup placement can overlap following rows. → Mitigation: use the source-inspired `bottom/start` placement and portal behavior from the existing primitive.
- [Risk] Shortcut labels differ by platform. → Mitigation: define Windows and macOS token sets and detect platform only for presentation.
- [Risk] Enabled buttons currently perform only callbacks. → Mitigation: make this explicit in the component API and keep feature navigation outside this change.

## Migration Plan

- Add the new primary-actions component.
- Add a demo composition that passes it as `AppSidebar` children.
- Update the starter page to use that enhanced demo on desktop and mobile.
- Validate the OpenSpec change and run the repository verification workflow in a development checkout when available.