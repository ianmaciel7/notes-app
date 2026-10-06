# ADR 0006: Adopt FirebaseUI v7 Canonical Architecture and Resilient Auth Fallback

## Status

Accepted

## Date

2026-09-28

## Current State (2026-10-06)

This ADR is accepted as the canonical architectural decision for FirebaseUI v7 canonical architecture and resilient auth fallback. Upstream v7 packages (`@firebase-oss/ui-react` 7.1.0 and `@firebase-oss/ui-core` 7.1.0) with `react-hook-form` (7.89.0) and `@hookform/resolvers` (5.9.1) are installed and verified.

## Context

The application requires a resilient, standardized client authentication architecture capable of handling OAuth popup blocks, cross-origin iframe restrictions, and Firebase emulator environment limitations without user disruption or custom form state duplication.

Key requirements include:
1. Handling third-party cookie restrictions, aggressive popup blockers, and emulator iframe incompatibilities gracefully.
2. Avoiding duplicate state machines and ad-hoc form error handling across auth screens.
3. Providing clear error reporting and user feedback when authentication attempts encounter non-recoverable failures, including dedicated display via `redirect-error`.
4. Supporting multi-factor authentication (MFA) resilience for SMS and TOTP enrollment/assertion.
5. Standardizing form validation using `react-hook-form` and `@hookform/resolvers` alongside FirebaseUI v7.

## Decision

We adopt the modular FirebaseUI v7 (`@firebase-oss/ui-react` and `@firebase-oss/ui-core`) architecture with centralized provider initialization, resilient popup-to-redirect fallback, and standardized error and form integration.

Key architectural rules and structure:
- **Centralized Provider Initialization**: The application root layout wraps child trees in `FirebaseUIProvider` via `AuthProvider` in `src/app/layout.tsx`.
- **Modular Ecosystem & Form Validation**: State management is coordinated between `@firebase-oss/ui-core` (7.1.0) and `@firebase-oss/ui-react` (7.1.0). Auth forms leverage `react-hook-form` with schema validation from `@hookform/resolvers`.
- **Canonical Screen & Form Delegation**: Authentication flows delegate directly to canonical screen components (`SignInAuthScreen`, `SignUpAuthScreen`, `EmailLinkAuthScreen`, `ForgotPasswordAuthScreen`, `MultiFactorAuthAssertionScreen`, `MultiFactorAuthEnrollmentScreen`, `PhoneAuthScreen`, `OAuthScreen` in `src/components/notes-app/`), avoiding custom form state duplication.
- **Resilient Fallback Handling**: When popup sign-in fails due to recoverable conditions (`auth/popup-blocked`, `auth/popup-closed-by-user`, `auth/operation-not-supported-in-this-environment`, or the code-less emulator iframe failure), client authentication automatically falls back to `signInWithRedirect` and `getRedirectResult`.
- **Dedicated Redirect Error Management**: Redirect error flows are captured and rendered via the `@firebase/redirect-error` component (`redirect-error.tsx`), ensuring clear diagnostics and user messaging when redirect operations encounter cross-origin or network exceptions.
- **Provider Theming Continuity**: Theming rules in `src/app/globals.css` provide consistent visual styling across light and dark modes for all provider buttons (`button[data-provider][data-themed]`), ensuring no visual jarring during popup-to-redirect transitions.
- **Error Observability**: Non-recoverable failures are captured via `captureError` and surfaced as translated error alerts rather than being silently ignored.
- **Architectural Alignment**: Complements the component boundary in [ADR 0004](./0004-adopt-firebase-ui-components.md), emulator architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Consequences

### Positive Outcomes

- Eliminates authentication flow failures caused by iframe blocks or popup blockers in emulator and local environments.
- Centralizes authentication provider setup inside `AuthProvider` without duplicating state management.
- Leverages canonical FirebaseUI v7 screen components maintained under `src/components/notes-app/`.
- Integrates dedicated `redirect-error.tsx` handling for robust user feedback following redirect attempts.
- Ensures form validation robustness across all 11 authentication forms using `react-hook-form` and `@hookform/resolvers`.
- Preserves consistent provider button branding in `src/app/globals.css` across dark and light modes.

### Trade-offs and Considerations

- Redirect fallback flow causes a full page reload, which must be handled gracefully by the client router.
- Requires maintaining form schema resolvers in sync with `@hookform/resolvers` updates.
