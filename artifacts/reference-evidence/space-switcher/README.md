# Space switcher visual evidence

User-provided screenshots captured on 2026-09-04 for Space switcher inset regressions.

- `clear-button-before.webp` — original screenshot showing the clear button too close to the right edge.
- `clear-button-annotated.webp` — annotated screenshot highlighting the affected clear button.
- `search-overflow-before.webp` — screenshot showing the search field itself extending past the popup's right edge.
- `search-overflow-annotated.webp` — annotated screenshot highlighting the clipped right side of the search field.

Reference behavior is grounded in the archived Capacities source: the search row has a 6px outer inset (`p-1.5`), while the inner search surface uses `px-[9px]` and the clear control is `1.2em × 1.2em`.

In this app the search surface is the direct popup child rather than living inside the same padding wrapper, so equivalent geometry requires 6px margins plus `width: calc(100% - 12px)` to keep both outer insets inside the popup.
