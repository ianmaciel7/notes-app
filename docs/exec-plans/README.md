# Execution Plans

Execution plans coordinate significant implementation work. They are delivery
artifacts, not substitutes for current architecture documentation.

## Structure

```text
docs/exec-plans/
  README.md
  template.md
  active/
  completed/
  superseded/
```

## Lifecycle

```text
Draft -> In Progress -> Verification -> Completed
                      |
                      +-> Superseded
```

## Rules

- Active plans describe work that is actually underway.
- Superseded drafts are archived under `superseded/` with a dated
  current-state note; their unchecked tasks are not an implementation report.
- Completed plans are historical records and should not be rewritten to pretend
  their original environment matched today's repository.
- If current architecture differs, add a current-state note instead.
- Link durable architectural decisions to ADRs.
- Link product behavior to product specs.
- Use repository-relative paths only.

## Verification

Plans should name the exact checks required for their scope.

The current repository gates include:

- Biome/GritQL;
- Next typegen + TypeScript;
- Vitest;
- Dependency Cruiser;
- CSpell;
- Knip;
- jscpd;
- Fallow;
- pnpm audit;
- Next.js production build;
- Size Limit;
- Playwright.

Not every plan must run every check locally, but final delivery should satisfy
the CI gates relevant to the branch.
