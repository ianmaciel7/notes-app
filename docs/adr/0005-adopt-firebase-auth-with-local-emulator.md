# ADR 0005: Adopt Firebase Authentication with Local Emulator

## Status

Accepted

## Date

2026-09-28

## Current State (2026-10-06)

This ADR is accepted as the canonical architectural decision for Firebase Authentication with local emulator. Runtime packages `firebase` 12.19.0 and `@firebase-oss/ui-core` 7.1.0 are active, with build scripts authorized in `pnpm-workspace.yaml` (`@firebase/util` and `protobufjs`), ensuring complete emulator protocol compatibility.

## Context

The exam-study platform foundation requires reliable local development, automated testing, and isolated user identity without external cloud dependencies, live network calls, or production credentials.

Key requirements include:
1. Hermetic local development environments capable of running fully offline.
2. Deterministic automated authentication testing using pre-seeded test accounts.
3. Isolated identity state without coupling to live Firebase cloud projects during test execution.
4. Consistent integration with React 19 client components and App Router hierarchies.
5. Emulating the full range of authentication mechanisms: email/password, passwordless email-link, phone SMS, multi-factor authentication (TOTP/SMS), and OAuth identity providers.

## Decision

We adopt Firebase Authentication with the local Firebase Auth Emulator (`port: 9099`, UI on `port: 4000`), integrating native Firebase `User` identity with client-side React 19 `use(AuthContext)` and dedicated application routes.

Key architectural rules and structure:
- **Emulator Configuration**: The Auth emulator runs on `127.0.0.1:9099` (with emulator UI on `127.0.0.1:4000`), loaded with pre-seeded test accounts from `.firebase/seeds/`.
- **Runtime Dependency Governance**: Dependencies are anchored on `firebase` 12.19.0 and `@firebase-oss/ui-core` 7.1.0. Native package build scripts required by `@firebase/util` (1.15.3) and `protobufjs` (7.6.6) for internal gRPC/protobuf emulator serialization are approved via `pnpm approve-builds` in `pnpm-workspace.yaml`.
- **Comprehensive Flow Coverage**: Local emulator configurations cover all 30 upstream component flows cataloged in [ADR 0004](./0004-adopt-firebase-ui-components.md):
  - Standard email/password credential sign-in and sign-up.
  - Passwordless email link flows (`email-link-auth-form` / `email-link-auth-screen`).
  - SMS & Phone authentication flows (`phone-auth-form` / `phone-auth-screen` using mock verification codes).
  - Multi-Factor Authentication assertion and enrollment (`totp-multi-factor-*`, `sms-multi-factor-*`).
  - Mock OAuth provider authentications (Google, Apple, Microsoft, GitHub, Facebook, Twitter, Yahoo).
- **State Management**: Client authentication state is managed via `AuthProvider` (`src/components/notes-app/auth-provider.tsx`) and context (`src/lib/auth-context.ts`), accessed through React 19 `use(AuthContext)` and custom hooks in `src/hooks/use-auth.ts`.
- **Route Boundaries**: Dedicated authentication routes are hosted under `src/app/(auth)/login/`.
- **Component Boundary**: Adhering to [ADR 0004](./0004-adopt-firebase-ui-components.md), application-owned authentication cards, forms, and policy surfaces live in `src/components/notes-app/`, consuming `@firebase-oss/ui-core` and `@firebase-oss/ui-react` directly.
- **Architectural Alignment**: Aligns with system context in [`ARCHITECTURE.md`](../../ARCHITECTURE.md) (Sections 3 & 4) and resilient auth fallback logic defined in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Consequences

### Positive Outcomes

- Enables fully offline local development and deterministic automated auth testing using pre-seeded test accounts across all auth vectors (password, phone, email-link, MFA, OAuth).
- Eliminates reliance on live Firebase production or staging environments during development and CI runs.
- Resolves pnpm build script warnings (`ERR_PNPM_IGNORED_BUILDS`) by explicitly authorizing `@firebase/util` and `protobufjs`.
- Provides consistent, centralized authentication state management via `AuthProvider` and `use(AuthContext)`.

### Trade-offs and Considerations

- Requires developers and test runners to ensure the Firebase Auth Emulator is running during local integration testing.
- Phone authentication and SMS MFA flows in the emulator require using predefined test phone numbers and verification codes configured in the emulator environment.
