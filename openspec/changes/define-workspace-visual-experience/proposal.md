## Why

The current local workspace resembles the broad Capacities layout but still differs observably in shell geometry, content, typography, labels, icons, interaction states, overlays, motion, graph behavior, and scrolling. The authenticated Capacities page is the visual and behavioral source of truth for this change; implementation is not complete while a side-by-side comparison exposes a reproducible difference.

## What Changes

- Record the directly inspected Capacities desktop baseline and exact visible Portuguese content.
- Define reference-parity requirements for the shell, sidebar, editor, graph panel, typography, colors, spacing, icons, overlays, scrolling, and responsive behavior.
- Inventory every currently observed local discrepancy as a granular pending task.
- Require default, hover, focus, active, pressed, selected, expanded, disabled, loading, empty, and error parity where the reference exposes those states.
- Require pointer, keyboard, assistive-technology, and reduced-motion equivalents without inventing effects absent from the reference.

## Impact

- Planning only; no runtime code changes in this change.
- Later UI implementation should use this change and the live authenticated reference together as the visual-experience source of truth.
- Related navigation, editor, graph, and object-model changes must not override an observable reference behavior recorded here.
