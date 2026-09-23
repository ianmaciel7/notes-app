# Testing Strategy & Guidelines

## 1. Testing Pyramid & Philosophy
The repository currently has **no automated test suite** — no unit, integration, or E2E test tooling is installed or configured. The only verification layer in place today is:
- **Component / Visual Stories**: Manual review of component states rendered in Ladle.

Unit, integration, and E2E layers are aspirational until test tooling is added — do not assume they exist when writing docs, CI config, or PR checklists elsewhere in the repo.

## 2. Test Frameworks & Toolchain
- **Test runner**: None installed (no Vitest, Jest, or equivalent in `package.json`).
- **Component story workbench**: Ladle 5.1.1 (`@ladle/react`) — `pnpm ladle`.
- **E2E**: None installed (no Playwright/Cypress).
- **Coverage tool**: None configured.

## 3. Test Commands
```bash
pnpm ladle          # Launch visual component stories (dev server)
pnpm ladle:build    # Build static Ladle catalog
pnpm ladle:preview  # Preview the built static catalog
```
There is no `pnpm test` script — `package.json` only defines `dev`, `build`, `start`, `lint`, `format`, and the three `ladle*` scripts above.

## 4. Test File Conventions & Locations
- Story files: colocated next to the component, `<name>.stories.tsx` (e.g. `src/components/ui/button.stories.tsx`).
- **Current coverage**: only `button.tsx` has a story. The other ~60 primitives cataloged in `DESIGN.md` §5 (including all of the Overlays & Dialogs and Conversational/Chat UI categories) have no story yet.
- No `*.test.ts`/`*.spec.ts` files or `__tests__/` directories exist anywhere in `src/`.

## 5. Mocking & Fixtures
Not applicable yet — there is no data layer, network layer, or backend to mock (see `ARCHITECTURE.md` §4). When one is introduced, prefer testing behavior over internal implementation details and avoid over-mocking.

## 6. CI Quality Gates & Coverage Requirements
There is no CI configured — no `.github/workflows/` directory exists in this repository. Until CI is added, treat `pnpm lint` and `pnpm build` as the manual pre-merge checks (see `CONTRIBUTING.md` §4); there are no automated gates enforcing them today.
