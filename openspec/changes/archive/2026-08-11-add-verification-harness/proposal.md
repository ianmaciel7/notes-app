## Why

The repository has strong documentation and CI, but completion evidence is still split across separate commands and there is no automated test runner. This makes AI-assisted changes harder to verify consistently and leaves current UI behavior protected only by lint, types, and build output.

## What Changes

- Add a canonical local verification command that matches CI.
- Add a minimal unit/component test setup for the existing Next.js App Router UI.
- Add one real test that protects the current notes workspace screen.
- Align CI with the canonical verification command while preserving the required `Quality` check.
- Document the verification contract and when heavier E2E or harness evals should be introduced.
- Normalize text line endings so local verification is deterministic across Windows and Linux checkouts.

## Capabilities

### New Capabilities

- `verification-harness`: Defines the repository contract for local verification, CI alignment, automated tests, and risk-proportional evidence.

### Modified Capabilities

None.

## Impact

- `package.json` scripts and development dependencies.
- `pnpm-lock.yaml`.
- Vitest configuration and a small page test.
- `.github/workflows/ci.yml`.
- `docs/TESTING.md` and `CONTRIBUTING.md`.
- Repository text normalization policy.
