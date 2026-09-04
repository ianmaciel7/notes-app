# Space switcher visual evidence

User-provided screenshots captured on 2026-09-04 for Space switcher parity regressions.

- `clear-button-before.webp` — original screenshot showing the clear button too close to the right edge.
- `clear-button-annotated.webp` — annotated screenshot highlighting the affected clear button.
- `search-overflow-before.webp` — screenshot showing the search field itself extending past the popup's right edge.
- `search-overflow-annotated.webp` — annotated screenshot highlighting the clipped right side of the search field.
- `icon-spacing-current.webp` — current app screenshot showing the Space icon and label packed too closely together.
- `icon-spacing-capacities-reference.webp` — Capacities reference screenshot supplied for the icon-to-label spacing comparison.

Reference behavior is grounded in the archived Capacities source. The search row has a 6px outer inset (`p-1.5`), while the inner search surface uses `px-[9px]` and the clear control is `1.2em × 1.2em`.

For Space rows, the captured Capacities DOM uses a leading icon block followed by the label inside `flex-row gap-2`, while the trailing action/check group is separate with `ml-1`. That makes the canonical icon-container-to-label distance 8px; the trailing selected indicator must not inherit that leading gap.

In this app the search surface is the direct popup child rather than living inside the same padding wrapper, so equivalent geometry requires 6px margins plus `width: calc(100% - 12px)` to keep both outer insets inside the popup.

The compact-menu contract therefore applies the 8px leading gap specifically to the direct `compact-menu-item-text` slot and uses the same 8px spacing for compact action buttons. This avoids changing the selected-check spacing while keeping Space rows and footer actions aligned with the Capacities menu rhythm.
