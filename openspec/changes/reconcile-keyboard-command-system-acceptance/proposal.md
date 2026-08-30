## Why

The archived keyboard-command change reports completion, while its implementation notes still record two failing repository tests, a blocked `pnpm verify`, unresolved complexity findings, and evidence files that still describe pre-acceptance states. This makes it impossible to distinguish implemented local behavior from confirmed Capacities parity.

## What Changes

- Reconcile task status, implementation notes, evidence manifests, limitations, and reference indexes so they report one coherent post-implementation state.
- Separate local implementation acceptance from matched Capacities reference parity.
- Correct stale change references and prohibit aliases to non-existent OpenSpec changes.
- Resolve or explicitly re-baseline the two recorded test failures and formatting blockers before acceptance.
- Require a green verification record before the corrective change can be archived.
- Preserve the existing command registry, search ranking, and editor trigger behavior; this change adds no new commands.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ui/keyboard-command-system`: Add a strict acceptance and evidence-consistency gate for command-system changes.
- `ui/capacities-en-fidelity`: Separate local acceptance evidence from reference-parity evidence and require truthful limitation reporting.

## Impact

- OpenSpec, tests, evidence manifests, limitations, reference documentation, and verification records.
- No production command, shortcut, persistence, routing, or editor behavior is intentionally expanded.
- The archived `2026-08-28-add-keyboard-command-system` directory remains immutable historical evidence.
