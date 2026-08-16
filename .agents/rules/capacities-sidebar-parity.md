# Capacities sidebar parity

Use `docs/references/CAPACITIES_SIDEBAR_AUDIT_2026-08-15.md` as the measured
contract for the desktop workspace sidebar.

- Inspect the authenticated Capacities reference and localhost separately
  before changing parity-sensitive UI. Treat screenshots as evidence, not as
  implementation instructions.
- Preserve measured geometry, semantic color tokens, verified glyphs, hover,
  focus, active, overflow-menu, pinned-item, and custom-section behavior.
- Prefer existing Tailwind tokens and shadcn/Radix primitives. Do not use
  screenshot-position hacks, `!important`, or duplicated literal styles.
- A parity claim requires focused automated checks plus a rendered browser
  comparison of the reachable default, hover, focus, menu, and click states.
- After material source or reference changes, run `pnpm graphify:update` and
  the Graphify health checks. Source and tests remain authoritative when graph
  output and implementation disagree.
