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
