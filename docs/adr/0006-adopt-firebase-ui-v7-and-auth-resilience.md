# ADR 0006: Adopt FirebaseUI v7 Client Architecture with Popup OAuth

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
application-owned auth cards, forms, and dialogs in `src/app/**/_components/`
are present.

- `AuthProvider` (`src/app/_components/auth-provider.tsx`) initializes
  FirebaseUI through `src/hooks/use-auth-provider.ts` and exchanges authenticated
  browser tokens for a same-origin server session (see
  [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md)). It is mounted
  only in the `(public)` and `(protected)` route group layouts, not in
  `src/app/layout.tsx`.
- `initializeUI` is configured with `providerPopupStrategy()` (the FirebaseUI v7
  default, made explicit), so OAuth uses `signInWithPopup` and the page does not
  reload. An E2E covers the Google flow through the Emulator provider page in a
  popup. This replaces the redirect-only strategy this ADR first adopted
  (changed 2026-10-08, see "Alternatives considered"). Embedded Electron
  browsers (user agent contains `Electron/`, for example Cursor's built-in
  browser) use `providerRedirectStrategy()` instead, because they do not keep
  `window.opener` in popups and the Emulator's "No matching frame" error blocks
  the popup result relay.
- `RedirectError` renders in the sign-in, OAuth, e-mail-link, and phone cards, so
  a failed redirect shows its message wherever the user starts it.
- Password, e-mail-link, phone, SMS MFA, and Google OAuth flows compose the
  application-owned cards and forms, which use `react-hook-form` with
  `@hookform/resolvers`.
- `/settings` renders `SecondFactorPanel`, which wraps
  `MultiFactorAuthEnrollmentCard` and adds the account-management behavior
  FirebaseUI does not provide: factor listing and removal, the verified-e-mail
  gate, recent-login messaging, and server-session renewal (see
  [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md)). Form root
  errors carry a classification (`requiresRecentLogin`, `unverifiedEmail`,
  `generic`) that `AuthRootError` turns into a localized message.

Not implemented: TOTP MFA (unsupported by the Auth Emulator, out of scope per
ADR 0005) and an automatic redirect fallback when a popup is blocked (see
"Alternatives considered"). `captureError` is not used.

### Production sign-in domain requirements

Firebase's [redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices)
require that the sign-in helper not depend on third-party storage, which Safari,
Firefox, and current Chrome block. The guide's Option 3 (proxy) is kept in place
as a safeguard for the popup flow and for any redirect fallback:

- `next.config.ts` rewrites `/__/auth/:path*` to
  `https://<projectId>.firebaseapp.com/__/auth/:path*` through
  `getAuthProxyRewrites` (`src/lib/firebase/auth-proxy.ts`), derived from
  `NEXT_PUBLIC_FIREBASE_CONFIG`. No rewrite is created without that variable
  (local Emulator development).
- `authDomain` in `NEXT_PUBLIC_FIREBASE_CONFIG` **must be the domain that serves
  the app**, not `<projectId>.firebaseapp.com`. This is configuration, not code,
  and nothing in the build enforces it.
- The domain must be an authorized domain in Firebase Authentication, and
  `https://<app domain>/__/auth/handler` must be an authorized redirect URI of
  the Google OAuth client.

Not verified: real-browser behavior with third-party storage blocked. That
requires a production or preview deployment.

### Review evidence and limitations (2026-10-07)

- Auth cards delegate shared title, state, callback, and translation concerns
  to `src/hooks/use-sign-in-card.ts`, `use-oauth-button.ts`, and
  `use-translation.ts`. They continue to use Firebase UI translation
  primitives rather than application-owned `next-intl` messages.
- The sign-in route visibly renders the Google provider button.
  Other provider components in `src/app/**/_components/` do **not**
  establish that those OAuth providers are configured or E2E-tested.
- The source and Playwright test definitions were inspected, but this review
  did not run browser tests or verify production OAuth configuration. That
  review described the earlier redirect-only strategy, since replaced by popup.

## Context

The application requires a standardized client authentication architecture that
works with OAuth popups, the Firebase Auth Emulator, and browser storage
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
a popup OAuth strategy, and standardized error and form integration.

Key architectural rules and structure:
- **Centralized Provider Initialization**: `AuthProvider` wraps child trees in
  `FirebaseUIProvider` and is mounted only where Firebase UI is needed: the
  `(public)` and `(protected)` route group layouts. It is deliberately not in
  the root layout, which keeps the client boundary small.
- **Modular Ecosystem & Form Validation**: State management is coordinated
  between `@firebase-oss/ui-core` (7.1.0) and `@firebase-oss/ui-react` (7.1.0).
  Auth forms leverage `react-hook-form` with schema validation from
  `@hookform/resolvers`.
- **Canonical Card & Form Delegation**: Authentication flows delegate to the
  canonical card components in `src/app/(public)/_components/` (`SignInAuthCard`,
  `SignUpAuthCard`, `EmailLinkAuthCard`, `ForgotPasswordAuthCard`,
  `MultiFactorAuthAssertionCard`, `MultiFactorAuthEnrollmentCard`,
  `PhoneAuthCard`, `OAuthCard`), avoiding custom form state duplication.
- **Popup OAuth**: OAuth providers authenticate through
  `providerPopupStrategy()` (`src/hooks/use-auth-provider.ts`), the FirebaseUI v7
  default. The result returns to the page that opened the popup, with no
  reload. A blocked or closed popup surfaces its error through `OAuthButton`.
  In embedded Electron browsers the same hook selects the redirect strategy, so
  the page leaves and returns with the result.
- **Redirect error display**: Cards that host provider buttons render
  `RedirectError` (`src/app/(public)/_components/redirect-error.tsx`). It only has an
  effect if a redirect strategy is configured again; keep it in new provider
  cards so switching strategy does not silently drop errors.
- **Form root errors**: `setFormRootError()` stores the failure classification as
  the root error type, and `AuthRootError` reads it from the form context, so it
  must render inside a `FormProvider`.
- **Provider Theming Continuity**: Theming rules in `src/app/globals.css` provide
  consistent visual styling across light and dark modes for provider buttons
  (`button[data-provider][data-themed]`).
- **Architectural Alignment**: Complements the component boundary in
  [ADR 0004](./0004-adopt-firebase-ui-components.md), the emulator and session
  architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md),
  and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

### Alternatives considered

- **Redirect-only** (this ADR's first implementation, replaced 2026-10-08):
  deterministic and immune to popup blockers, but every OAuth sign-in leaves the
  page, and Firebase's redirect best practices make it depend on a same-domain
  `authDomain` and `/__/auth/` proxy in production. Replaced by popup, the
  FirebaseUI v7 default, to get a smoother dialog-style flow.
- **Popup with automatic fallback to redirect**: attempt `signInWithPopup` and
  fall back to `signInWithRedirect` on `auth/popup-blocked`,
  `auth/operation-not-supported-in-this-environment`, or the code-less Emulator
  iframe failure. Not adopted: it adds a second code path and error taxonomy to
  maintain. It remains the next step if popup blocking proves to be a problem.
  A narrower, user-agent-based switch to redirect for Electron browsers was
  adopted instead (2026-10-08), since that environment fails deterministically.

## Consequences

### Positive Outcomes

- A single OAuth path that signs in without reloading the page.
- Centralizes authentication provider setup inside `AuthProvider` without
  duplicating state management.
- Leverages canonical FirebaseUI v7 card components maintained under
  `src/app/(public)/_components/`.
- Provider sign-in failures are surfaced to the user by `OAuthButton`.
- Form validation is consistent across the authentication forms through
  `react-hook-form` and `@hookform/resolvers`.
- Preserves consistent provider button branding in `src/app/globals.css` across
  dark and light modes.

### Trade-offs and Considerations

- Popups can be blocked by the browser or platform and are less smooth on
  mobile. There is no automatic fallback; the user sees the error and retries.
  The only exception is the user-agent switch to redirect for Electron browsers,
  which depends on the `Electron/` token and is verified only with a simulated
  user agent, not in Cursor itself.
- The sign-in result is relayed through an iframe served by the Emulator in
  local development, and browsers can partition that storage when the page and
  Emulator hosts are cross-site. The client therefore connects to the Emulator on
  the page's own host (see ADR 0005).
- Requires maintaining form schema resolvers in sync with `@hookform/resolvers`
  updates.
- Cards that host provider buttons must remember to render `RedirectError`; the
  omission is easy to miss because nothing fails visibly until a redirect errors.
