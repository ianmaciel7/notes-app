# Engineering Workflows

The engineering workflow follows a two-tier model: a **Fast Track** for quick, focused tasks and a **Spec Track** for high-complexity features and architectural shifts.

```text
               ┌──► Fast Track  ──► Direct Prompt ──► Atomic Change ──► verify:changed
Task Complexity│
               └──► Spec Track  ──► Grill ──► Spec ──► Tickets ──► Implement ──► Review ──► PR
```

---

## 1. Fast Track (Lightweight / Direct Loop)

Use for small, unambiguous changes where rework cost is low:

- CSS/UI tweaks, styling fixes, typos;
- Isolated bug fixes touching 1–2 files;
- Minor refactors or localized helper adjustments.

### Fast Track Workflow

```text
Direct Prompt ──► Code Edit ──► pnpm run verify:changed
```

- **No slash-command ceremony**: Do not use `/grill-with-docs`, `/to-spec`, `/to-tickets`, or `/implement`.
- State the requirement directly in natural language.
- Make the minimal, focused change and validate with `pnpm run verify:changed`.

---

## 2. Spec Track (Full Feature Flow / Spec-Driven)

Use for high-complexity work where rework cost or architectural risk is high:

- New features, pages, or complex routes;
- Domain model changes, database schema shifts, or auth boundaries;
- Multi-component interactions or wide-ranging refactors.

### Spec Track Workflow

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
`docs/guards/NEXTJS-GUARD-COVERAGE.md`. UI changes must respect
`docs/guards/SHADCN-GUARD-COVERAGE.md`.

## Documentation workflow

When a change alters behavior, architecture, dependencies, verification, or
project policy:

1. update the current-state document;
2. update or add an ADR when a durable architectural decision changed;
3. update product specs for product behavior;
4. keep completed plans historical rather than rewriting history;
5. clearly mark deprecated decisions that are no longer implemented.
