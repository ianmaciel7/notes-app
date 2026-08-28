# Testing

## Install

```bash
pnpm install --frozen-lockfile
```

## Local validation

Run the same quality gate used by CI:

```bash
pnpm verify
```

Individual checks:

```bash
pnpm format:check
pnpm lint
pnpm complexity
pnpm typegen
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
```

## Test baseline

The repository uses the Node.js 22 test runner for the CI baseline. Application-specific unit, component, and integration tests should be added as product behavior grows.

Generated UI primitives under `src/components/ui` are excluded from the custom cyclomatic-complexity gate so the check focuses on application logic rather than generated component infrastructure.

## Pull requests

PRs targeting `dev`, `stag`, or `main` must pass:

- `Quality`
- `Security`

Behavioral or procedural changes must also keep the related OpenSpec artifacts current.

## Reference UI parity audits

Before recapturing Capacities or another external product, reuse the matching
bundle under `artifacts/reference-evidence/` and follow
`docs/references/reference-evidence-workflow.md`.

- Align viewport, route, selected workspace tab, listing view/layout, sidebar,
  and contextual-panel state before measuring geometry.
- Exercise every safe visible affordance through its supported idle, hover,
  focus, open, close, post-action, persistence, responsive, and reduced-motion
  states. Record unsupported or authenticated-data mutations as `not tested`;
  do not manufacture reference data to close a coverage row.
- Persist only sanitized reference-product image crops. For localhost, persist
  DOM/accessibility, computed geometry/style, behavior, console, and focused
  browser-test evidence; do not store localhost screenshots.
- Inspect every saved image, parse every JSON artifact, verify every manifest
  path exists, and run strict OpenSpec validation before claiming coverage.
- Treat document containment as necessary but insufficient. Required controls
  must also have visible bounding rectangles within the viewport and must not
  remain focusable or pointer-active while visually hidden.

Run the focused workspace parity suite with:

```bash
pnpm test:parity
```

For an in-progress component group, use Playwright `--grep` against
`tests/e2e/workspace-parity.spec.ts`, then record the exact command, passing
count, and covered states in the bundle's `verification.json`. Validate the
associated planning change with:

```bash
openspec validate audit-workspace-component-parity --strict
```
