# Object component verification

Base revision: `b21fe1f9cd87bd1089f522cbf64d1555a062848b` on `dev`.
This report distinguishes executed checks from checks that remain unavailable.

## Executed locally

- Nine Node tests execute the actual dependency-free production models and storage adapter.
  They cover space/type isolation, ambiguous spaces, search/filter/order without mutation,
  invalid and legacy preferences, denied/quota-limited storage, distinct namespaces,
  HTTP(S)-only URLs, readable false/zero properties, and empty-body detection. Nine passed.
- TypeScript parser inspection covered 86 prepared TS/TSX files, including tests and stories.
  No syntax diagnostics were emitted. This is not a whole-project semantic typecheck.
- A separate physical nonblank-line inspection found no prepared file over 600 lines,
  no function body over 80 nonblank lines, and no function over four parameters.
  Maximum inspected file: 395 nonblank lines (the preserved renderer regression tests).
  Maximum inspected function body: 59 nonblank lines. Prepared source lines fit 100 characters.
- Manual review checked import direction, the explicit type map, compatibility exports,
  namespace handling, metadata scoping, URL protocols and retained regression assertions.
  No independent reviewer or browser was available.

These line counts are a structural inspection, not Biome diagnostics or cognitive complexity.
The production Biome configuration and its 15/4/80/600 thresholds remain unchanged.

## Added project tests and stories

- `object-list-model.test.ts`: list selection and browser preference adapter behavior.
- `object-detail-model.test.ts`: URL protocols and readable saved content.
- `object-components.test.tsx`: built-in/preset coverage, custom fallback and metadata isolation.
- `object-parts.test.tsx`: structural composition without the workspace controller.
- `object-parts.stories.tsx`: production list/detail structural parts in isolation.
- Existing `workspace-object-renderer.test.tsx` assertions are retained; menu-source assertions
  follow the extracted module, and mode-button checks tolerate shadcn attribute ordering.

The project Vitest tests and Ladle stories were authored but not executed in this environment.

## Unavailable checks

The container could not resolve github.com for a checkout and has no repository dependencies.
Attempts to run `pnpm typecheck`, `pnpm test:unit`, `pnpm metrics`, `pnpm ladle:build` and
`pnpm test:e2e` exited with code 127 (`pnpm: command not found`). Graphify was also unavailable.
Biome formatting/lint, cognitive complexity, full typecheck, build, React rendering, browser
behavior, accessibility and visual parity are therefore not certified by this report.

The current Quality workflow runs on pull requests and pushes to main, not pushes to dev.
Publishing this change to dev alone does not constitute a successful CI run.

## Remaining scope

This is the object-renderer composition migration, not a clean bill of health for the repository.
`WorkspaceObjectDataView`, main action panels, repeated navigation in `workspace-main-content`,
the broader controller, right-panel integration, and type-specific editing/media capabilities
remain outside the completed extraction. The complete inventory records these gaps explicitly.
