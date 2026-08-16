# Workspace Tailwind layout

Use `docs/DESIGN.md` as the canonical workspace design contract and preserve
the measured Capacities geometry when changing the shell.

- Prefer Tailwind utilities and existing shadcn/Radix primitives for component
  styling. Keep semantic colors, typography, and shared tokens in
  `src/app/globals.css`.
- Do not add a CSS Module only to hold responsive grid declarations. A small,
  named global layout utility is acceptable when one property needs an ordered
  multi-breakpoint cascade that Tailwind arbitrary variants cannot express
  reliably.
- Keep competing declarations of `grid-template-columns` in one explicit
  cascade. For the context panel, preserve the 1100 px open-panel breakpoint
  and the 1250 px fixed/resizable track breakpoint.
- Validate the exact affected route at its real viewport, horizontal overflow,
  panel bounds, and console errors. Passing unit tests alone is not visual
  evidence.
- Do not run `next build` against the same `.next` directory while `next dev`
  is serving the visual audit. If it happens, restart `next dev` and verify the
  route returns HTTP 200 before trusting HMR or browser measurements.
- After material layout or design-contract changes, save a useful/corrected
  Graphify result, run `graphify reflect`, and require `pnpm graphify:check` to
  stay green. Do not use a forced code-only extraction to repair self-indexing
  if it would shrink the curated graph; restore the last healthy generated
  artifacts and fix the exclusion path first.
