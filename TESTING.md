# Testing Strategy & Guidelines

## 1. Testing Pyramid & Philosophy

The repository has a small unit-test foundation; integration and E2E coverage
remain aspirational. Verification layers currently include:

- Unit tests with Vitest.
- Component and visual stories with Ladle.
- Production browser auditing with Lighthouse CI.
- Mutation testing with StrykerJS.
- Source duplication detection with jscpd.

## 2. Test Frameworks & Toolchain

- **Test runner**: Vitest 4.1.11 (`rtk pnpm test`).
- **Coverage**: V8 coverage via `rtk pnpm test:coverage`.
- **Component story workbench**: Ladle 5.1.1 (`rtk pnpm ladle`).
- **E2E**: None installed yet.
- **Mutation testing**: StrykerJS 10 (`rtk pnpm test:mutation`) targets
  `src/lib/utils.ts` until more production logic has focused tests.
- **Duplication**: jscpd 5 (`rtk pnpm run check:duplication`) with a 10% ceiling.
- **Browser audit**: Lighthouse CI 0.15.1 (`rtk pnpm lighthouse`) audits the
  production home page; accessibility is enforced while other categories are
  warning-only until a baseline is established.

## 3. Test Commands

```bash
rtk pnpm test
rtk pnpm test:coverage
rtk pnpm test:mutation
rtk pnpm run check:duplication
rtk pnpm ladle
rtk pnpm ladle:build
rtk pnpm lighthouse
```

`check:fast` covers types, focused lint, dependency boundaries, the floor guard,
and duplication. `check:security` audits high and critical dependency
advisories; `check:osv` scans manifests and lockfiles with OSV-Scanner v2.

## 4. Test File Conventions & Locations

- Story files: colocated next to the component as `<name>.stories.tsx`.
- Unit tests: colocated under `src/` as `*.test.ts` or `*.test.tsx`.
- Current unit coverage starts with `src/lib/utils.test.ts`.
- The reusable UI catalog still has many components without stories.

New or changed primitives should add or update a Ladle story covering
composition states, keyboard/focus behavior, required accessibility subparts,
and loading/empty/error states where applicable.

## 5. Mocking & Fixtures

There is no data, network, or backend layer to mock yet. When one is introduced,
prefer behavior-focused tests and avoid over-mocking.

## 6. CI Quality Gates & Coverage Requirements

There is no CI configured yet. Until CI is added, treat the commands above plus
`rtk pnpm lint`, `rtk pnpm build`, `rtk pnpm deps:check`, and `rtk pnpm knip` as
the manual pre-merge checks.

Agent behavioral evaluation scenarios live in `.agents/evals/README.md` and
remain runner-neutral until an official provider is selected.
