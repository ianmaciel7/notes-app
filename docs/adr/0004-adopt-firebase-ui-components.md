# ADR 0004: Discover and Vendor Firebase Open Source Auth UI Components

## Status

Accepted

## Implementation

Implemented

## Date

2026-09-28

## Current State (2026-10-07)

**Implementation: Implemented (reference layer, source-confirmed).**
`components.json` registers `@firebase`; the committed
`src/components/firebase/` reference baseline has 30 entries in
`tests/unit/firebase-reference.manifest.sha256`. The
`firebase-reference.test.ts` integrity test checks hashes and file
additions/deletions. `biome.json` and `tsconfig.check.json` exclude this
upstream reference layer from project-specific checks. `pnpm-workspace.yaml`
records the build-script decision for `@firebase/util` and `protobufjs`.
`package.json` declares `firebase` ^12.19.0 and Firebase UI core/react
^7.1.0; exact installed versions depend on the lockfile.

**Scope clarification:** these 30 files are vendored **references**, not
30 distinct authentication flows enabled in the application.
`src/app/**/_components/` owns active user-facing composition, with
actual supported flows documented in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md).
This review checked the manifest and test source but did not execute the test
or re-run the upstream registry installer.

## Context

The exam-study platform requires a reliable, discoverable source for all
official Firebase UI component definitions, accessible on demand via the
shadcn registry without duplication or local drift.

Key requirements include:
1. Automatically discovering and vendoring all 30 Firebase OSS UI components.
2. Avoiding duplicate local vendor mirrors and parallel code trees that drift from upstream packages.
3. Protecting the reference baseline from unintended local edits via immutability guards.
4. Managing pnpm package build security policies for native compilation and postinstall scripts.

## Decision

The application configures the official `@firebase` open source registry in `components.json` and uses the shadcn CLI to discover and automatically vendor all upstream Firebase UI components into a dedicated, immutable reference directory `src/components/firebase/`. This reference baseline is protected via project guards and excluded from active application consumption and lint rules.

Key architectural rules and structure:
- **Custom Registry Configuration**: `components.json` declares the `@firebase` registry namespace:
  ```json
  {
    "registries": {
      "@firebase": "https://firebaseopensource.com/r/{name}.json"
    }
  }
  ```
- **Upstream Component Discovery & Inventory (30 Components)**: Upstream components are discovered via `pnpm dlx shadcn@latest list @firebase` and added via `pnpm dlx shadcn@latest add ... --yes`. The complete 30-item upstream catalog includes:
  - **OAuth & Identity Provider Buttons (8)**: `@firebase/apple-sign-in-button`, `@firebase/facebook-sign-in-button`, `@firebase/github-sign-in-button`, `@firebase/google-sign-in-button`, `@firebase/microsoft-sign-in-button`, `@firebase/oauth-button`, `@firebase/twitter-sign-in-button`, `@firebase/yahoo-sign-in-button`.
  - **Authentication Forms (11)**: `@firebase/email-link-auth-form`, `@firebase/forgot-password-auth-form`, `@firebase/phone-auth-form`, `@firebase/sign-in-auth-form`, `@firebase/sign-up-auth-form`, `@firebase/multi-factor-auth-assertion-form`, `@firebase/multi-factor-auth-enrollment-form`, `@firebase/sms-multi-factor-assertion-form`, `@firebase/sms-multi-factor-enrollment-form`, `@firebase/totp-multi-factor-assertion-form`, `@firebase/totp-multi-factor-enrollment-form`.
  - **Authentication Screens (8)**: `@firebase/email-link-auth-screen`, `@firebase/forgot-password-auth-screen`, `@firebase/multi-factor-auth-assertion-screen`, `@firebase/multi-factor-auth-enrollment-screen`, `@firebase/oauth-screen`, `@firebase/phone-auth-screen`, `@firebase/sign-in-auth-screen`, `@firebase/sign-up-auth-screen`.
  - **Support & Helper Blocks (3)**: `@firebase/country-selector`, `@firebase/policies`, `@firebase/redirect-error`.
- **Package Manager Build Script Decision (`allowBuilds`)**: pnpm's strict build-script policy (`ERR_PNPM_IGNORED_BUILDS`) requires an explicit decision for `@firebase/util` and `protobufjs`. That decision was first recorded as approved (`true`) and is now recorded as `false` because their scripts are inert here; see [ADR 0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md):
  ```yaml
  allowBuilds:
    '@firebase/util': false
    protobufjs: false
  ```
  These entries were originally approved as `true`; they are now `false`
  because the scripts are inert here. Application components moved to route-
  private folders; see [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), Amendment 2026-10-09.
- **Reference-Only Guard & Immutability**: `src/components/firebase/` serves exclusively as an immutable upstream reference baseline. Biome excludes the directory from lint and GritQL guard evaluation, `tsconfig.check.json` (used by `check:types` and `next build`) excludes it from `tsc` while `tsconfig.json` keeps it for editor path resolution (upstream types are not guaranteed to match the installed package versions), while the Vitest guard `tests/unit/firebase-reference.test.ts` compares every file in that directory against a SHA-256 manifest (`tests/unit/firebase-reference.manifest.sha256`) and fails on modified, deleted, or added files, independent of git state. It runs with `pnpm test` and therefore `verify:fast` and CI. Intentional upstream syncs regenerate the manifest with `FIREBASE_REFERENCE_UPDATE=1 pnpm test firebase-reference`.
- **Architectural Alignment**: This decision establishes the upstream component baseline for use in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md) (application-owned auth components and routes) and [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) (resilient auth fallback logic).

## Consequences

### Positive Outcomes

- Provides direct, automated access to official Firebase UI component definitions via the shadcn CLI registry mechanism across all 30 upstream blocks.
- Establishes `src/components/firebase/` as an immutable upstream baseline, eliminating confusion about what originates from upstream versus project code.
- Guard enforcement prevents unintentional edits and drift in the reference components.
- Records an explicit build-script decision in `pnpm-workspace.yaml` for `@firebase/util` and `protobufjs`.
- Enables Biome, TypeScript, dependency-cruiser, and project guards to clearly distinguish between reference code and active application code.

### Trade-offs and Considerations

- Upstream reference components in `src/components/firebase/` must be explicitly excluded from application mutation rules and test coverage requirements.
- Any updates from newer upstream releases require re-fetching via the shadcn registry rather than ad-hoc local patching.
- Maintaining `allowBuilds` in `pnpm-workspace.yaml` requires re-validation whenever core dependencies are upgraded.
