## Context

The `dev` branch contains the app-shell and sidebar feature work. The header should remain a focused application component composed from primitives already present on `dev`, and should integrate into the existing shell rather than duplicating shell behavior.

The target visual is the compact Capacities-inspired top bar shown in the reference: back and forward actions grouped on the left, a create action, and a focus-mode action aligned on the opposite side. The implementation should look and read like a native shadcn project component: composable props, `data-slot` hooks, existing `Button` variants/sizes, `cn`, and no one-off global CSS.

## Goals / Non-Goals

**Goals:**
- Add a reusable 46px application header.
- Use existing `Button` and Lucide icons instead of custom button styling.
- Expose typed callbacks for back, forward, create, and focus actions.
- Allow back/forward disabled states.
- Keep layout responsive and allow caller content through `children`.
- Preserve native project interaction and focus styles.
- Integrate cleanly with the current `AppShell` composition.

**Non-Goals:**
- No browser-history or router integration in this change.
- No tab system in this change.
- No changes to sidebar behavior.
- No keyboard shortcut registration.
- No new dependencies or global CSS.

## Decisions

- Create `src/components/app-header.tsx` as an application component, not a new `ui/*` primitive.
  - **Why:** The header composes existing primitives and represents product structure rather than a generic low-level control.
- Use `React.ComponentProps<"header">` for the root API and `React.ComponentProps<typeof Button>`-compatible behavior for actions.
  - **Why:** This mirrors shadcn component composition patterns and keeps native DOM props available.
- Use `Button variant="ghost" size="icon-sm"` for all controls.
  - **Why:** The project button primitive already provides the correct sizing, hover, active, and focus states.
- Keep the center region flexible with `children`.
  - **Why:** Later tab/header content can be inserted without rewriting the component contract.
- Add `data-slot` attributes to the root and action groups.
  - **Why:** This matches existing project component conventions and provides stable styling/test hooks.

## Risks / Trade-offs

- [Risk] Exact reference spacing may differ slightly from future tab integration. → Mitigation: keep root and action-group `className` extensible while using the reference 46px baseline.
- [Risk] Callbacks are inert until wired to routing/features. → Mitigation: keep the API explicit and feature-agnostic in this change.

## Migration Plan

- Add the component.
- Replace the main shell's empty `AppShellHeader` with `AppHeader` while keeping the side-panel/mobile shell headers intact.
- Run repository verification in CI through the pull request.
