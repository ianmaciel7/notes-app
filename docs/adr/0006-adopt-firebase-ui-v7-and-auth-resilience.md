# ADR 0006: Adopt FirebaseUI v7 Client Architecture with Redirect-Only OAuth

## Status

Accepted

## Implementation

Implemented

## Date

2026-09-28

## Current State (2026-10-07)

The decision is implemented on `dev`. The packages (`@firebase-oss/ui-react`
7.1.0, `@firebase-oss/ui-core` 7.1.0, `react-hook-form` 7.89.0,
`@hookform/resolvers` 5.9.1), the upstream reference components, and the
application-owned auth cards, forms, and dialogs in `src/components/notes-app/`
are present.

- `AuthProvider` (`src/components/notes-app/auth-provider.tsx`) initializes
  FirebaseUI through `src/hooks/use-auth-provider.ts` and exchanges authenticated
  browser tokens for a same-origin server session (see
  [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md)). It is mounted
  only in the `(public)` route group layout and on the protected `/settings`
  page, not in `src/app/layout.tsx`.
- `initializeUI` is configured with `providerRedirectStrategy()`, so OAuth always
  uses `signInWithRedirect`, and FirebaseUI recovers the result with
  `getRedirectResult` when it reinitializes after the redirect. An E2E covers the
  Google flow through the Emulator provider page.
- `RedirectError` renders in the sign-in, OAuth, e-mail-link, and phone cards, so
  a failed redirect shows its message wherever the user starts it.
- Password, e-mail-link, phone, SMS MFA, and Google OAuth flows compose the
  application-owned cards and forms, which use `react-hook-form` with
  `@hookform/resolvers`.

Not implemented: TOTP MFA (unsupported by the Auth Emulator, out of scope per
ADR 0005) and the popup-then-redirect fallback this ADR originally proposed (see
"Alternatives considered"). `captureError` is not used.

### Review evidence and limitations (2026-10-07)

- Auth cards delegate shared title, state, callback, and translation concerns
  to `src/hooks/use-sign-in-card.ts`, `use-oauth-button.ts`, and
  `use-translation.ts`. They continue to use Firebase UI translation
  primitives rather than application-owned `next-intl` messages.
- The sign-in route visibly renders the Google provider button.
  Other provider components in `src/components/notes-app/` do **not**
  establish that those OAuth providers are configured or E2E-tested.
- The source and Playwright test definitions were inspected, but this review
  did not run browser tests or verify production OAuth configuration.
  Redirect-only remains the implemented strategy; popup fallback is not
  a pending requirement.

## Context

The application requires a standardized client authentication architecture that
works with OAuth redirects, the Firebase Auth Emulator, and browser storage
partitioning, without custom form state duplication.

Key requirements include:
1. Handling third-party cookie restrictions, popup blockers, and Emulator iframe
   behavior predictably.
2. Avoiding duplicate state machines and ad-hoc form error handling across auth
   cards.
3. Providing clear user feedback when a redirect-based sign-in fails, through
   `RedirectError`.
4. Supporting SMS multi-factor enrollment and assertion.
5. Standardizing form validation using `react-hook-form` and
   `@hookform/resolvers` alongside FirebaseUI v7.

## Decision

We adopt the modular FirebaseUI v7 (`@firebase-oss/ui-react` and
`@firebase-oss/ui-core`) architecture with centralized provider initialization,
a redirect-only OAuth strategy, and standardized error and form integration.

Key architectural rules and structure:
- **Centralized Provider Initialization**: `AuthProvider` wraps child trees in
  `FirebaseUIProvider` and is mounted only where Firebase UI is needed: the
  `(public)` route group layout and the `/settings` page. It is deliberately not
  in the root layout, which keeps the client boundary small.
- **Modular Ecosystem & Form Validation**: State management is coordinated
  between `@firebase-oss/ui-core` (7.1.0) and `@firebase-oss/ui-react` (7.1.0).
  Auth forms leverage `react-hook-form` with schema validation from
  `@hookform/resolvers`.
- **Canonical Card & Form Delegation**: Authentication flows delegate to the
  canonical card components in `src/components/notes-app/` (`SignInAuthCard`,
  `SignUpAuthCard`, `EmailLinkAuthCard`, `ForgotPasswordAuthCard`,
  `MultiFactorAuthAssertionCard`, `MultiFactorAuthEnrollmentCard`,
  `PhoneAuthCard`, `OAuthCard`), avoiding custom form state duplication.
- **Redirect-only OAuth**: OAuth providers authenticate through
  `providerRedirectStrategy()`. The result is recovered by FirebaseUI on
  reinitialization, so no popup is attempted.
- **Redirect error display**: Any card that can start a redirect renders
  `RedirectError` (`src/components/notes-app/redirect-error.tsx`). New cards that
  host provider buttons must include it.
- **Provider Theming Continuity**: Theming rules in `src/app/globals.css` provide
  consistent visual styling across light and dark modes for provider buttons
  (`button[data-provider][data-themed]`).
- **Architectural Alignment**: Complements the component boundary in
  [ADR 0004](./0004-adopt-firebase-ui-components.md), the emulator and session
  architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md),
  and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

### Alternatives considered

- **Popup with automatic fallback to redirect** (the original proposal for this
  ADR): attempt `signInWithPopup` and fall back to `signInWithRedirect` on
  `auth/popup-blocked`, `auth/popup-closed-by-user`,
  `auth/operation-not-supported-in-this-environment`, or the code-less Emulator
  iframe failure. Not adopted: it adds a second code path and error taxonomy to
  maintain, and redirect-only is deterministic, works the same in every browser,
  and is covered end to end by the E2E against the Emulator. The cost is that
  every OAuth sign-in leaves the page.

## Consequences

### Positive Outcomes

- A single OAuth path that behaves the same with and without popup blockers.
- Centralizes authentication provider setup inside `AuthProvider` without
  duplicating state management.
- Leverages canonical FirebaseUI v7 card components maintained under
  `src/components/notes-app/`.
- Redirect failures are surfaced to the user in every card that starts a
  redirect.
- Form validation is consistent across the authentication forms through
  `react-hook-form` and `@hookform/resolvers`.
- Preserves consistent provider button branding in `src/app/globals.css` across
  dark and light modes.

### Trade-offs and Considerations

- Every OAuth sign-in causes a full page reload, which must be handled gracefully
  by the client router.
- The redirect result is relayed through an iframe served by the Emulator in
  local development, and browsers can partition that storage when the page and
  Emulator hosts are cross-site. The client therefore connects to the Emulator on
  the page's own host (see ADR 0005).
- Requires maintaining form schema resolvers in sync with `@hookform/resolvers`
  updates.
- Cards that host provider buttons must remember to render `RedirectError`; the
  omission is easy to miss because nothing fails visibly until a redirect errors.
