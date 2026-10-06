# Engineering Workflows

## Feature flow

```text
/grill-with-docs
      |
      v
/to-spec
      |
      v
/to-tickets
      |
      v
/implement or /implement-spec
      |
      v
/code-review
      |
      v
/pr
      |
      v
/retro
```

Use the glossary and active ADRs during discovery. Planned or deprecated ADRs
must not be treated as active implementation architecture.

## Bug flow

```text
/diagnosing-bugs -> /tdd -> /code-review -> /retro
```

A regression fix should include a test when practical.

## Codebase health

Use:

- `/improve-codebase-architecture` for structural issues;
- `/domain-modeling` for vocabulary/ADR work;
- `/prototype` for disposable experiments.

## Verification workflow

During iteration:

```bash
pnpm run verify:changed
```

Before delivery:

```bash
pnpm run verify:fast
```

CI then verifies:

- Knip
- jscpd
- Fallow
- security audit
- production build
- bundle budgets
- Playwright E2E

Framework-specific changes must also respect
`docs/NEXTJS-GUARD-COVERAGE.md`. UI changes must respect
`docs/SHADCN-GUARD-COVERAGE.md`.

## Documentation workflow

When a change alters behavior, architecture, dependencies, verification, or
project policy:

1. update the current-state document;
2. update or add an ADR when a durable architectural decision changed;
3. update product specs for product behavior;
4. keep completed plans historical rather than rewriting history;
5. clearly mark deprecated decisions that are no longer implemented.
