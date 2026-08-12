## Context

This change targets the authenticated Capacities page at the reference URL recorded in the specification. The reference and localhost were inspected side by side at a 1536 px wide desktop viewport. Capacities is the visual and behavioral authority; the earlier generic "Studio for the Mind" direction remains useful only where the reference does not expose a decision.

## Decisions

### Use live reference evidence before local conventions

Measured reference geometry, computed styles, visible wording, icon treatment, and interaction behavior override remembered Capacities behavior, generic product guidance, and existing local approximations. Values that were not directly observed remain pending inspection rather than being invented.

### Preserve the inspected desktop structure

At the inspected desktop width, the reference uses a 288 px sidebar, a single 46 px top rail, a 772 px editor card beginning at x=298, and a 446 px graph card beginning at x=1080. Both cards begin at y=46, extend to the bottom inset, use 12 px radii, and retain independent internal behavior. Responsive behavior must be re-inspected at each target breakpoint rather than extrapolated from the local implementation.

### Reproduce the authenticated object, not placeholder content

The page identity, object emoji, object type, properties, exact Portuguese wording, long editor body, graph nodes, and graph toolbar are part of the target. Local sample-note and Explore-placeholder content are discrepancies, not acceptable substitutes.

### Match effects instead of normalizing them

Reference hover backgrounds, selected treatment, delayed rich tooltips, contextual row actions, dropdown scale/transform motion, subtle card shadow, pressed feedback, and panel transitions must be reproduced with measured values. Do not add an effect that cannot be observed in Capacities.

### Preserve accessibility parity

Hover-only affordances must have keyboard and assistive-technology equivalents, and motion must respect reduced-motion preferences.

### Keep evidence states explicit

Each task is pending until both appearance and relevant interaction states have been compared in the same viewport. Software checks, OpenSpec validation, component existence, or a static screenshot alone do not prove parity.

## Inspected Desktop Baseline

- Shell/sidebar background: `oklch(0.9856 0.0016 67)`.
- Editor and graph surfaces: `oklch(1 0.0001 263.28)`.
- Border: `oklch(0.9163 0.0017 67.07)`; stronger separators: `oklch(0.8643 0.0017 67.13)`.
- Primary, secondary, and muted text: `oklch(0.2191 0.0058 285.84)`, `oklch(0.3887 0.0052 301.05)`, and `oklch(0.5725 0.0051 33.89)`.
- Hover surface: `oklch(0.9676 0.0016 67.02)`.
- Font stack: `Inter, ui-sans-serif, system-ui`; title: 30 px/33 px, weight 700; editor body: 16 px/24 px.
- Main editor content width: about 688 px with 40 px horizontal inset inside the scroll area.
- Main editor scroll area: about 760 x 644 px with about 4548 px of inspected content height.
- Standard header icon controls: 28 px with 14 px icons; primary sidebar rows: 32 px; object rows: 29 px; control radius: 8 px.

## Risks / Trade-offs

- The authenticated reference can change; verification evidence must record the date, viewport, route, and state.
- Some actions mutate user data or require unavailable states; do not trigger destructive behavior merely to inspect it. Record those states as uninspected.
- Responsive overrides could not be imposed reliably on the authenticated external-browser tab during the first pass, so mobile and tablet parity remain explicitly pending.
