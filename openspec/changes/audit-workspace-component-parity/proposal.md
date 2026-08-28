## Why

The current workspace parity contract contains strong point-in-time measurements, but it can still report false parity when the reference and localhost render different semantic selections, persisted panel states, or interaction states. A fresh matched audit of the requested Pages listing is needed now so every visible affordance has traceable reference/local evidence and untested or unsafe transitions remain explicit.

## What Changes

- Establish a matched-state comparison contract that records route, selected workspace tab, semantic surface, persisted layout state, viewport, content limitations, and console state before visual verdicts.
- Require a complete action matrix for every visible control in the Pages listing surface, including idle, hover, keyboard focus, activation, open/close, post-action, persistence, unavailable, and reduced-motion states when supported.
- Reconcile shell, sidebar, workspace header, object-type listing, card/list controls, and contextual-panel requirements with current authenticated Capacities evidence.
- Distinguish visual, interaction, data/state, persisted-environment, and inconclusive mismatches instead of collapsing them into a screenshot verdict.
- Persist the smallest useful sanitized DOM, geometry/style, behavior, console, and image evidence in a discoverable bundle, while recording reference transitions that are not exercised because they would mutate or delete authenticated data.
- Keep implementation outside this planning change until the evidence-backed requirements and tasks are reviewed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/capacities-en-fidelity`: Tighten matched-state, component inventory, interaction-matrix, and parity-verdict requirements.
- `ui/app-shell`: Clarify matched rail geometry, contextual-panel visibility, containment, and persisted-state comparison behavior.
- `ui/app-sidebar`: Define evidence-backed interaction and accessibility contracts for the visible navigation, section, nested-row, footer, and collapse controls.
- `ui/app-header`: Define matched workspace-tab, nested-action, overflow, focus-mode, and side-panel-header interaction coverage.
- `ui/object-views-and-conversion`: Define the Pages listing header, view tabs, query/layout controls, cards, empty/unavailable states, and non-mutating audit boundaries.
- `developer-workflows/reference-evidence`: Require correlated, sanitized evidence bundles and explicit coverage gaps for reference/local component audits.

## Impact

- Planning artifacts and acceptance criteria under `openspec/changes/audit-workspace-component-parity/`.
- Stable design and verification guidance in `docs/DESIGN.md` and `docs/TESTING.md`, with timestamped observations retained in `docs/references/capacities-workspace-parity.md`.
- Canonical capabilities under `openspec/specs/ui/` and `openspec/specs/developer-workflows/reference-evidence/` after the change is applied and archived.
- Future implementation may affect the workspace shell, sidebar, header tabs, object-type listing views, contextual panel, shared popup primitives, localized accessible names, and focused parity tests.
- No dependency, public API, persistence schema, or production-code change is authorized by this proposal.
