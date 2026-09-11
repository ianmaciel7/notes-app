# Object List and Detail Implementation Plan

**Goal:** Give each fixed type a List/Detail pair composed over shared structural bases.
**Architecture:** Concrete types own composition; shared presenters and pure selection
functions eliminate repeated business logic. Compatibility exports keep existing callers.
**Tech stack:** React 19, TypeScript, local shadcn/Base UI, existing Dexie contracts.
**Spec:** ../specs/2026-09-10-object-list-detail.md

## Global constraints

ObjectList, not ObjectListScreen. No new runtime dependencies, CSS files, generated UI
changes, storage migration or fictional type capabilities. Preserve existing quality limits.

## Tasks

- [x] Add regression tests for selection, preferences and URL protocols.
- [x] Extract typed models, structural parts, and focused list controls.
- [x] Add concrete List/Detail pairs and explicit resolver; preserve compatibility exports.
- [x] Update source-location assertions to follow extracted modules without removing checks.
- [x] Document complete component inventory and remaining integration/quality debt.
- [x] Inspect changes; run available tests and record unavailable project checks.
- [ ] Publish spec and implementation commits, fast-forward dev without force.

## Verification commands

```sh
pnpm exec biome check src/components/objects src/components/workspace-object-renderer.tsx
pnpm typecheck
pnpm test:unit -- src/components/workspace-object-renderer.test.tsx src/components/objects
pnpm metrics
pnpm ladle:build
pnpm test:e2e
```

## Execution environment

GitHub connector reads/writes are available. The local execution container currently cannot
resolve github.com and has no repository dependencies. Use the globally available TypeScript
compiler only for explicitly labeled syntax checks and dependency-free model tests. Do not
claim full typecheck, Vitest, Biome, visual parity, or CI success from these checks.

Execution evidence: ../../architecture/object-components-verification.md.
Remote publication is verified from the final commit and branch response, not inferred from this plan.
