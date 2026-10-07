# ADR 0004: Adopt Firebase Open Source Auth UI Components

## Status

Accepted (partially implemented)

## Date

2026-09-28

## Current State (2026-10-06)

Partially implemented on `dev`. Implemented: the `@firebase` registry in
`components.json`; the 30 upstream components in `src/components/firebase/` as
an immutable reference baseline; its Biome and `tsconfig.check.json` exclusions;
the SHA-256 manifest guard in `tests/unit/firebase-reference.test.ts`; provider
theming in `src/app/globals.css`; and `allowBuilds` for `@firebase/util` and
`protobufjs` in `pnpm-workspace.yaml`. Not yet implemented: the
application-owned screens, forms, and dialogs in `src/components/notes-app/`
(the directory is empty) and any route that consumes them. Installed versions:
`firebase` 12.19.0, `@firebase-oss/ui-core` 7.1.0, `@firebase-oss/ui-react`
7.1.0, `react-hook-form` 7.89.0, `@hookform/resolvers` 5.9.1.

## Context

The exam-study platform foundation requires production-ready, accessible authentication and multi-factor authentication UI behavior integrated with `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.

Key requirements include:
1. Maintaining standard, accessible authentication flows conforming to WCAG and WAI-ARIA authoring practices.
2. Avoiding duplicate local vendor mirrors and parallel code trees that drift from upstream packages.
3. Enabling static analysis tools (Biome, TypeScript, dependency-cruiser, and project guards) to evaluate auth components as standard application code.
4. Seamlessly integrating authentication screens with the project's shadcn and Base UI design system without overwriting customized project primitives.
5. Managing pnpm package build security policies for native compilation and postinstall scripts.

## Decision

The application configures the official `@firebase` open source registry in `components.json`, fetches all upstream Firebase UI components into a dedicated reference directory `src/components/firebase/`, enforces strict immutability on that reference directory via project guards, and implements application-owned auth screens and forms in `src/components/notes-app/` using the project's shadcn and Base UI primitives.

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
- **Package Manager Build Script Approval (`allowBuilds`)**: Due to pnpm strict supply-chain policy (`ERR_PNPM_IGNORED_BUILDS`), packages containing build/postinstall scripts (`@firebase/util` and `protobufjs`) are explicitly approved using `pnpm approve-builds` and recorded in `pnpm-workspace.yaml`:
  ```yaml
  allowBuilds:
    '@firebase/util': true
    protobufjs: true
  ```
- **Preservation of Project-Owned UI Primitives**: During installation with `shadcn add`, overwriting is declined for existing UI primitives in `src/components/ui/` (`button.tsx`, `select.tsx`, `input.tsx`, `label.tsx`, `separator.tsx`, `alert.tsx`, `card.tsx`, `input-otp.tsx`, `field.tsx`), ensuring project design system customizations remain intact.
- **Provider Theming in Global Styles**: Provider button styles are integrated directly into `src/app/globals.css` with `@layer components` custom CSS variables (`--apple-primary`, `--facebook-primary`, `--github-primary`, `--google-primary`, `--microsoft-primary`, `--twitter-primary`, `--yahoo-primary`) and matching `@variant dark` rules.
- **Reference-Only Guard & Immutability**: `src/components/firebase/` serves exclusively as an immutable upstream reference baseline. Biome excludes the directory from lint and GritQL guard evaluation, `tsconfig.check.json` (used by `check:types` and `next build`) excludes it from `tsc` while `tsconfig.json` keeps it for editor path resolution (upstream types are not guaranteed to match the installed package versions), while the Vitest guard `tests/unit/firebase-reference.test.ts` compares every file in that directory against a SHA-256 manifest (`tests/unit/firebase-reference.manifest.sha256`) and fails on modified, deleted, or added files, independent of git state. It runs with `pnpm test` and therefore `verify:fast` and CI. Intentional upstream syncs regenerate the manifest with `FIREBASE_REFERENCE_UPDATE=1 pnpm test firebase-reference`.
- **Application Component Ownership**: Application-facing authentication screens, forms, cards, and modal dialogs consumed by routes live in `src/components/notes-app/`. They compose project-owned shadcn Base Nova / Base UI primitives from `src/components/ui/` and follow [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md), referencing `src/components/firebase/` for behavioral parity without mutating the reference baseline.
- **Direct Package Dependencies**: Runtime authentication state machines and hooks are driven by `@firebase-oss/ui-core` (7.1.0), `@firebase-oss/ui-react` (7.1.0), `firebase` (12.19.0), `react-hook-form` (7.89.0), and `@hookform/resolvers` (5.9.1).
- **Architectural Alignment**: This design integrates with the emulator architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), the fallback strategy in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md), and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Consequences

### Positive Outcomes

- Provides direct, automated access to official Firebase UI component definitions via the shadcn CLI registry mechanism across all 30 upstream blocks.
- Establishes `src/components/firebase/` as an immutable upstream baseline, eliminating confusion about what originates from upstream versus project code.
- Guard enforcement prevents unintentional edits and drift in the reference components.
- Protects project-owned Base Nova primitives in `src/components/ui/` from accidental overwriting by external registry templates.
- Enforces explicit build security governance in `pnpm-workspace.yaml` for `@firebase/util` and `protobufjs`.
- Keeps application-owned UI in `src/components/notes-app/` cleanly separated, using project design system tokens, Tailwind CSS v4, and Base UI primitives.
- Integrates brand-compliant OAuth provider theming directly into `src/app/globals.css` with full light/dark mode support.
- Enables Biome, TypeScript, dependency-cruiser, and project guards to clearly distinguish between reference code and active application code.

### Trade-offs and Considerations

- Upstream reference components in `src/components/firebase/` must be explicitly excluded from application mutation rules and test coverage requirements.
- Any updates from newer upstream releases require re-fetching via the shadcn registry rather than ad-hoc local patching.
- Maintaining `allowBuilds` in `pnpm-workspace.yaml` requires re-validation whenever core dependencies are upgraded.
