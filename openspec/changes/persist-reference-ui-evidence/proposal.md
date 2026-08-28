## Why

Reference UI comparisons currently require agents to recapture the same screenshots, DOM, computed styles, and interaction observations across sessions. A reusable, sanitized evidence corpus will reduce repeated browser work while keeping parity claims traceable to a dated source and state.

## What Changes

- Require reference comparisons against Capacities or another external site to discover and reuse current repository evidence before capturing the same state again.
- Define a versioned evidence bundle containing a manifest, screenshots, sanitized HTML or DOM snapshots, computed CSS data, and relevant JavaScript interaction observations.
- Require evidence freshness, provenance, viewport, route/state, capture time, and known limitations to be recorded so stale artifacts are not treated as current truth.
- Prevent secrets, cookies, authentication tokens, private storage values, personal content, and unnecessary third-party source code from entering the repository.
- Update the workspace parity rule, skill, and practical documentation to use the same capture, reuse, refresh, and sanitization contract.

## Capabilities

### New Capabilities

- `developer-workflows/reference-evidence`: Defines how reusable external-reference evidence is discovered, captured, sanitized, stored, refreshed, and consumed by agents.

### Modified Capabilities

- `ui/capacities-en-fidelity`: Requires Capacities parity work to use a dated reusable evidence bundle before repeating live-browser capture and to refresh only stale or missing states.

## Impact

- Affects `.agents/rules/workspace-ui-parity.md`, `.agents/skills/workspace-ui-parity/SKILL.md`, contributor/agent workflow documentation, `docs/references/`, and `artifacts/capacities-reference/` conventions.
- Adds planning and validation expectations without changing production application APIs or dependencies.
- Future parity work may add sanitized evidence files, but this change does not authorize copying private Capacities data or proprietary bundles.
