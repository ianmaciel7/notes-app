## Why

The `/en` route already demonstrates the canonical modular `dev` shell, header, and sidebar, but it does not reproduce the exact authenticated Capacities state: its main and contextual surfaces are empty, its demo tabs represent unrelated content, and several measured typography, surface, geometry, and interaction details still diverge. A route-level fidelity contract is needed so the existing components converge through evidence-backed, iterative evaluation without restoring historical monoliths.

## What Changes

- Make `http://localhost:3000/en` the deterministic acceptance surface for the target authenticated Capacities state.
- Preserve the current `dev` architecture, public component APIs, `data-slot` contracts, Base UI/shadcn `base-nova` composition, and locale routing.
- Add route-owned fixture/content for the current accepted `Sem título` citation editor and `Explorar` contextual panel, while retaining `Notas atômicas` as a selectable demo tab.
- Align the composed shell, header/tab fixture, sidebar state, typography, semantic surfaces, spacing, borders, radii, icons, and interaction states with measured live Capacities evidence.
- Use `old`, `old-2`, `old-3`, and `feat/app-sidebar` only as selective donor evidence; do not merge or restore their monolithic architectures.
- Add a bounded visual-fidelity evaluation loop covering desktop, responsive/mobile, resize/collapse, keyboard/focus, hover/active, menus/popovers/tooltips, reduced motion, and accessibility.
- Generate a sanitized, reproducible single-file visual contract from the supplied WACZ/JSONL corpus, using captured theme/CSS values for visual tokens while preserving the live authenticated target as state and geometry evidence.

## Capabilities

### New Capabilities

- `ui/capacities-en-fidelity`: Defines the route-level visual and behavioral acceptance contract for the complete `/en` shell, target fixture content, responsive states, evidence hierarchy, and iterative fidelity verification.

### Modified Capabilities

- None. Existing `ui/app-header` and `ui/app-sidebar` requirements remain valid; this change composes and refines their implementation under a whole-route acceptance contract without weakening or duplicating their public behavior.

## Impact

- Affects `src/app/[locale]/page.tsx`, route-owned demo/fixture components, and evidence-backed composition details in `src/components/app-shell.tsx`, header/tab components, sidebar components, and shared typography/surface tokens where genuinely global.
- May add focused tests or deterministic visual-audit state, but adds no third-party dependencies and does not change persistence, backend, authentication, or production routing contracts.
- Requires visual comparison against the read-only authenticated Capacities URL, selective historical branch inspection, OpenSpec validation/synchronization, `pnpm typecheck`, `pnpm verify`, and post-change Graphify status evidence.
