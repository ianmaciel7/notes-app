# ADR 0006: Adopt FirebaseUI v7 Canonical Architecture and Resilient Auth Fallback

## Status

Accepted

## Date

2026-09-28

## Current State (2026-10-06)

This ADR is accepted as the canonical architectural decision for FirebaseUI v7 canonical architecture and resilient auth fallback. The architecture is verified and aligned with the project technical standards.

## Context

The application requires a resilient, standardized client authentication architecture capable of handling OAuth popup blocks, cross-origin iframe restrictions, and Firebase emulator environment limitations without user disruption or custom form state duplication.

Key requirements include:
1. Handling third-party cookie restrictions, aggressive popup blockers, and emulator iframe incompatibilities gracefully.
2. Avoiding duplicate state machines and ad-hoc form error handling across auth screens.
3. Providing clear error reporting and user feedback when authentication attempts encounter non-recoverable failures.

## Decision

We adopt the modular FirebaseUI v7 (`@firebase-oss/ui-react` and `@firebase-oss/ui-core`) architecture with centralized provider initialization and resilient popup-to-redirect fallback.

Key architectural rules and structure:
- **Centralized Provider Initialization**: The application root layout wraps child trees in `FirebaseUIProvider` via `AuthProvider` in `src/app/layout.tsx`.
- **Canonical Screen Delegation**: Authentication flows delegate directly to canonical screen components (`SignInAuthScreen` and `SignUpAuthScreen` in `src/components/notes-app/`), avoiding custom form state duplication.
- **Resilient Fallback Handling**: When popup sign-in fails due to recoverable conditions (`auth/popup-blocked`, `auth/popup-closed-by-user`, `auth/operation-not-supported-in-this-environment`, or the code-less emulator iframe failure), client authentication automatically falls back to `signInWithRedirect` and `getRedirectResult`.
- **Error Observability**: Non-recoverable failures, including failed redirects, are captured via `captureError` and surfaced as translated error alerts rather than being silently ignored.
- **Architectural Alignment**: Complements the component boundary in [ADR 0004](./0004-adopt-firebase-ui-components.md), emulator architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Consequences

### Positive Outcomes

- Eliminates authentication flow failures caused by iframe blocks or popup blockers in emulator and local environments.
- Centralizes authentication provider setup inside `AuthProvider` without duplicating state management.
- Leverages canonical FirebaseUI v7 screen components maintained under `src/components/notes-app/`.

### Trade-offs and Considerations

- Redirect fallback flow causes a full page reload, which must be handled gracefully by the client router.
