# ADR 0005: Adopt Firebase Authentication with Local Emulator

## Status

Accepted (partially implemented)

## Date

2026-09-28

## Current State (2026-10-07)

Partially implemented on `dev`. Implemented: `firebase` 12.19.0 and
`@firebase-oss/ui-core` 7.1.0 are installed; `allowBuilds` covers `@firebase/util`
and `protobufjs`; `firebase.json` configures the Auth (`127.0.0.1:9099`),
Firestore (`127.0.0.1:8080`), and UI (`127.0.0.1:4000`) emulators; and all 30
application-owned auth screens, forms, and dialogs exist in
`src/components/notes-app/` (commit 9686a943). Not yet implemented: routes that
consume `src/components/notes-app/` components, seed data, and server-side
identity verification. The `.firebase/` seed directory does not exist yet. Treat
the structure below as the target design.

## Context

The exam-study platform foundation requires reliable local development, automated testing, and isolated user identity without external cloud dependencies, live network calls, or production credentials. The application must compose all 30 upstream Firebase UI components (from ADR 0004) into application-owned screens and forms using project-owned shadcn primitives.

Key requirements include:
1. Hermetic local development environments capable of running fully offline.
2. Deterministic automated authentication testing using pre-seeded test accounts.
3. Isolated identity state without coupling to live Firebase cloud projects during test execution.
4. Application-owned screens, forms, and dialogs composed from project-owned shadcn primitives and upstream Firebase UI components (ADR 0004).
5. Emulating the full range of authentication mechanisms: email/password, passwordless email-link, phone SMS, multi-factor authentication (TOTP/SMS), and OAuth identity providers.

## Decision

We adopt Firebase Authentication with the local Firebase Auth Emulator (`port: 9099`) and compose all 30 upstream Firebase UI components (from ADR 0004) into application-owned auth screens and forms in `src/components/notes-app/`, using project-owned shadcn primitives.

Key architectural rules and structure:
- **Emulator Configuration**: The Auth emulator runs on `127.0.0.1:9099` (with emulator UI on `127.0.0.1:4000`), loaded with pre-seeded test accounts from `.firebase/seeds/`.
- **Runtime Dependency Governance**: Dependencies are anchored on `firebase` 12.19.0 and `@firebase-oss/ui-core` 7.1.0. The `postinstall` scripts declared by `@firebase/util` (1.15.3) and `protobufjs` (7.6.6) are approved via `pnpm approve-builds` in `pnpm-workspace.yaml`. Both are transitive dependencies of the `firebase` SDK (`protobufjs` arrives through `@firebase/firestore` → `@grpc/proto-loader`); neither is used by the emulator, which runs from `firebase-tools`.
- **Comprehensive Flow Coverage**: Local emulator configurations cover all 30 upstream component flows vendored in [ADR 0004](./0004-adopt-firebase-ui-components.md):
  - Standard email/password credential sign-in and sign-up.
  - Passwordless email link flows (`email-link-auth-form` / `email-link-auth-screen`).
  - SMS & Phone authentication flows (`phone-auth-form` / `phone-auth-screen` using mock verification codes).
  - Multi-Factor Authentication assertion and enrollment (`totp-multi-factor-*`, `sms-multi-factor-*`).
  - Mock OAuth provider authentications (Google, Apple, Microsoft, GitHub, Facebook, Twitter, Yahoo).
- **Application-Owned Auth Components**: All 30 application-facing authentication screens, forms, cards, and modal dialogs live in `src/components/notes-app/` (created in commit 9686a943), composing project-owned shadcn Base Nova / Base UI primitives from `src/components/ui/` and following [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md). They reference `src/components/firebase/` for behavioral parity without mutating the reference baseline (ADR 0004). Provider button theming is integrated into `src/app/globals.css` with `@layer components` custom CSS variables and `@variant dark` rules for full light/dark mode support.
- **Architectural Alignment**: Aligns with upstream component baseline in [ADR 0004](./0004-adopt-firebase-ui-components.md) and resilient auth fallback logic defined in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Consequences

### Positive Outcomes

- Enables fully offline local development and deterministic automated auth testing using pre-seeded test accounts across all auth vectors (password, phone, email-link, MFA, OAuth).
- Eliminates reliance on live Firebase production or staging environments during development and CI runs.
- Resolves pnpm build script warnings (`ERR_PNPM_IGNORED_BUILDS`) by explicitly authorizing `@firebase/util` and `protobufjs`.
- Provides application-owned auth components that mirror upstream behavioral parity while maintaining project design system consistency.

### Trade-offs and Considerations

- Requires developers and test runners to ensure the Firebase Auth Emulator is running during local integration testing.
- Phone authentication and SMS MFA flows in the emulator require using predefined test phone numbers and verification codes configured in the emulator environment.
- Application-owned components in `src/components/notes-app/` must mirror upstream behavioral parity while maintaining project design system consistency; this requires active maintenance as upstream components evolve.
