# ADR 0005: Adopt Firebase Authentication with Local Emulator

## Status

Accepted

## Implementation

Implemented

## Date

2026-09-28

## Current State (2026-10-07)

The decision is implemented on `dev` for every flow the Auth Emulator supports.
TOTP MFA, originally listed in requirement 5, is out of scope: the Emulator does
not support it, so it cannot be delivered or verified hermetically. This ADR was
scoped down accordingly, and TOTP needs its own decision if it is ever adopted
against a real Firebase project.

`firebase` 12.19.0, `firebase-admin` 13.4.0, and `firebase-tools` 15.0.0 are
installed; `firebase.json` configures the Auth Emulator at `127.0.0.1:9099`; and
`.firebase/seeds/` contains the versioned `demo-notes-app` password-account
fixture. Delivered flows:

- E-mail/password sign-up, sign-in, password-reset request, and sign-out.
- E-mail-link sign-in (`/email-link`) and phone/SMS sign-in (`/phone`).
- Google OAuth through the Firebase SDK-managed redirect flow, served by the
  Emulator's local provider page.
- SMS multi-factor authentication: enrollment, listing, and removal from
  `/settings` (account-management behavior follows the Firebase Auth Web
  multi-factor guidance, see "Multi-factor authentication") and assertion at
  password sign-in.

Not delivered: TOTP MFA (unsupported by the Emulator, deliberately not exposed),
and an E2E that follows the password-reset link (the E2E covers only the
request). Treat any structure below that this section does not mention as
target design.

### Review evidence and limitations (2026-10-07)

- The client uses `getFirebaseClient()`; the server verifies Firebase
  session cookies in `src/lib/firebase/identity.ts`; protected pages call
  `getCurrentIdentity()` instead of relying on proxy checks.
- `src/lib/firebase/session-client.ts` rejects a failed
  `DELETE /api/auth/session`. `src/hooks/use-sign-out-button.ts` then
  attempts client sign-out only after the HTTP request succeeds; the button
  exposes a retryable error, and `tests/unit/sign-out-button.test.tsx`
  contains success and failure cases.
- Server token revocation is **best-effort** and is not proof of global
  sign-out: `revokeCurrentSession()` catches revocation failures before the
  Route Handler deletes the caller's cookie. A successful DELETE confirms
  cookie clearing, not successful revocation on other devices.
- `tests/e2e/home.spec.ts` defines three Auth Emulator journeys; their
  presence is not evidence that they passed in this documentation review.
  Run `pnpm run verify:fast`, `pnpm run test:e2e`, and the GitHub CI
  before considering the current branch verified.

### Implementation overview

Routes, grouped by access in `src/app/`:

| Group | Routes | Notes |
| --- | --- | --- |
| `(public)` | `/sign-in`, `/sign-up`, `/forgot-password`, `/email-link`, `/phone` | Shared `layout.tsx` wraps the pages in `AuthProvider` and `<main>`; each page sets its own metadata title and an `sr-only` `<h1>`. |
| `(protected)` | `/dashboard`, `/settings` | Pages verify the session with `getCurrentIdentity()` and redirect to `/sign-in` when absent. |
| root | `/` | Redirects to `/dashboard` when signed in, otherwise `/sign-in`. `error.tsx` and `not-found.tsx` provide the global fallbacks. |
| `api` | `/api/auth/session` | Session exchange (`POST`) and sign-out (`DELETE`) Route Handler. |

Route groups do not appear in URLs. The protected routes are listed in two
places that must stay in sync: `isProtectedPath()` in
`src/lib/firebase/session.ts` and the static `matcher` in `src/proxy.ts`.

Session model:

- The browser signs in with the Firebase client SDK against the Emulator. The
  auth provider (`src/hooks/use-auth-provider.ts`) then posts the ID token to
  `POST /api/auth/session`, which checks that the `Origin` header matches the
  request origin, validates the body, requires recent authentication
  (`auth_time` within 5 minutes), and creates a Firebase session cookie with the
  Admin SDK.
- The cookie is `__session`: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` on
  HTTPS, valid for 5 days.
- `src/proxy.ts` is an optimistic check only: it redirects `/dashboard/*` and
  `/settings/*` to `/sign-in` when the cookie is missing. Authorization is
  decided by the pages, which call `verifySessionCookie(cookie, true)` in the
  server-only `src/lib/firebase/identity.ts`, so revoked cookies are rejected.
- `DELETE /api/auth/session` applies the same origin check, attempts to revoke
  the user's refresh tokens, and clears the browser cookie. Revocation is
  best-effort; only successful revocation invalidates other devices' cookies.
  The sign-out button waits for a successful HTTP response before signing out
  of the browser Firebase client and navigating away. Failed server logout
  displays a retryable error instead of leaving an active cookie unnoticed.
- After a successful session exchange the provider redirects to `/dashboard`,
  except when the user is already on a protected route (so `/settings` is not
  bounced).
- Server-only configuration (`src/lib/firebase/server-config.ts`) requires
  `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099` and the `demo-notes-app` project
  outside production. The shared project id lives in `src/lib/firebase/config.ts`
  so the browser module does not import server code.

Client behavior specific to the Emulator:

- `src/lib/firebase/client.ts` connects the Auth client to the Emulator on the
  same host as the page (`localhost` or `127.0.0.1`). The redirect flow relays
  its result through an iframe served by the Emulator, and browsers partition
  that storage when the page and Emulator hosts are cross-site. This alignment is
  a mitigation for that failure mode; the automated E2E passed without it, so it
  was not reproduced under automation.
- Outside production the client sets `appVerificationDisabledForTesting`, and
  `src/hooks/use-app-verifier.ts` supplies a stub verifier until the real
  reCAPTCHA verifier is ready. The phone, MFA enrollment, and MFA assertion
  hooks share it. Production always uses the real reCAPTCHA verifier.
- OAuth is initialized with `providerPopupStrategy()`, the FirebaseUI v7 default,
  so sign-in happens in a popup window and the page does not reload (see
  [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md)).

Multi-factor authentication:

- Assertion is rendered by the sign-in card when the Firebase UI store holds a
  multi-factor resolver. The upstream cleanup hook clears the resolver on
  unmount, which React StrictMode's simulated unmount triggers in development,
  discarding the challenge. `src/hooks/use-multi-factor-auth-assertion-form.ts`
  defers that cleanup so a remount cancels it.
- Second-factor management lives on `/settings`
  (`src/components/notes-app/second-factor-panel.tsx`,
  `src/hooks/use-second-factor-panel.ts`) and offers only the SMS factor. It
  follows the Firebase Auth Web multi-factor guidance, which was checked against
  the Firebase documentation on 2026-10-08:
  - **Source of truth**: the enrolled state is read from
    `multiFactor(user).enrolledFactors` through `onAuthStateChanged`, never from
    component state, so it survives reloads and other tabs. Each factor is
    listed with its display name and can be removed through the
    Firebase multi-factor API; removing the last one returns the page to
    the enrollment form.
  - **Verified e-mail**: Firebase refuses to enroll a second factor without a
    verified e-mail (the Emulator enforces this too). The panel shows the
    requirement instead of the form, offers `sendEmailVerification()` and a
    re-check (`reload()` plus a forced ID-token refresh, because the token
    carries `email_verified`), and explains that accounts without an e-mail
    (phone sign-in) cannot enroll. The E2E covers the unverified account; the
    enrollment E2E obtains a verified e-mail through e-mail-link sign-in.
  - **Recent login**: enrolling and removing a factor are security-sensitive and fail
    with `auth/requires-recent-login`. `classifyAuthFailure()`
    (`src/lib/firebase/auth-error.ts`) recognizes this code and
    `auth/unverified-email`, `setFormRootError()` records the classification as
    the form root error type, and the enrollment forms and the panel show an
    actionable message with a "Sign in again" button. That button reuses the
    server-session-first sign-out instead of `reauthenticateWithCredential()`:
    the application supports password, e-mail-link, phone, and popup
    OAuth sign-in, and a credential prompt would need a second, provider-specific
    flow for each. The alternative remains open if re-entry friction becomes a
    problem.
  - **Session revocation**: Firebase revokes the other sessions of the user when
    a factor is enrolled or removed, and `getCurrentIdentity()` verifies session
    cookies with revocation checks. After either change the panel re-issues the
    server cookie from a freshly forced ID token (`createServerSession()` in
    `src/lib/firebase/session-client.ts`, shared with `AuthProvider`). If the
    Firebase SDK signed this browser out as part of the change, the panel runs
    the normal sign-out and redirects to `/sign-in`.
  - **Factor types**: TOTP stays unexposed (see the matrix below), even though
    Firebase documents it as a second factor.

Local commands and verification:

- `pnpm run emulator` starts the Auth Emulator with the seed;
  `pnpm run emulators:seed` regenerates the seed;
  `pnpm run test:e2e` imports a fresh seed and runs Playwright through
  `firebase emulators:exec`. `.vscode/launch.json` offers matching debug
  configurations.
- Playwright reuses an already running dev server and cannot start a second
  Emulator while port 9099 is taken.
- `tests/e2e/home.spec.ts` contains four journeys: password sign-up, sign-in,
  sign-out, reset request, e-mail link, phone sign-in, and protected-route
  checks with axe audits; SMS MFA enrollment, persistence after reload,
  assertion at sign-in, and removal; the unverified-e-mail gate on `/settings`;
  and the Google redirect through the Emulator provider page. Unit tests cover
  the session Route Handler, the failure classifier, and the second-factor
  panel (listing, removal, verified-e-mail gate, recent-login and revoked
  session handling).

### Emulator support matrix

The matrix separates capability of the pinned Auth Emulator from functionality
that this application exposes. "Supported by emulator" means documented by
Firebase for the Auth Emulator or confirmed from the installed `firebase-tools`
15.0.0 implementation; it does not mean the application has shipped the flow.

| Flow | Supported by emulator | Application status | Deterministic test seam |
| --- | --- | --- | --- |
| E-mail/password | Yes | Implemented | Seeded account and Playwright E2E |
| Password reset | Yes, via an out-of-band (OOB) URL | Implemented UI; E2E covers the request only, not the reset link | `oobCodes` emulator REST endpoint |
| E-mail link | Yes, via an OOB URL | Route implemented; completion covered by E2E | `oobCodes` emulator REST endpoint |
| Phone/SMS | Yes; each verification code is generated per attempt | Route implemented; completion covered by E2E | `verificationCodes` emulator REST endpoint |
| SMS MFA | Yes | Enrollment, listing, removal, and sign-in assertion implemented; covered by E2E | `verificationCodes` emulator REST endpoint |
| TOTP MFA | No supported local claim | Components exist, but must not be exposed as an Emulator-backed flow | Not applicable until an Emulator release and an E2E prove it |
| OAuth / third-party IDP | Yes for SDK-managed flows; the Emulator serves a local provider page with mock accounts | Google button implemented with redirect recovery; covered by E2E | Emulator-hosted provider page |

The Auth Emulator never sends e-mail or SMS. It stores OOB links and generated
SMS codes locally, where deterministic tests can retrieve them from the
emulator-specific REST endpoints. It also bypasses reCAPTCHA/APNs and does not
honor Firebase-console fixed phone-number codes. These differences mean the
matrix must be retained even after application flows are added.

## Context

The exam-study platform foundation requires reliable local development, automated testing, and isolated user identity without external cloud dependencies, live network calls, or production credentials. The application composes the upstream Firebase UI reference components (ADR 0004) into application-owned cards and forms for supported flows, using project-owned shadcn primitives.

Key requirements include:
1. Hermetic local development environments capable of running fully offline.
2. Deterministic automated authentication testing using pre-seeded test accounts.
3. Isolated identity state without coupling to live Firebase cloud projects during test execution.
4. Application-owned cards, forms, and dialogs composed from project-owned shadcn primitives and upstream Firebase UI components (ADR 0004).
5. Emulating the range of authentication mechanisms the Emulator supports: email/password, passwordless email-link, phone SMS, SMS multi-factor authentication, and OAuth identity providers. TOTP multi-factor authentication was originally included but is out of scope because the Emulator does not support it.

## Decision

We adopt Firebase Authentication with the local Firebase Auth Emulator (`port: 9099`) and compose appropriate upstream Firebase UI behaviors into application-owned auth cards and forms in `src/components/notes-app/`, using project-owned shadcn primitives.

Key architectural rules and structure:
- **Emulator Configuration**: The Auth emulator runs on `127.0.0.1:9099` (with emulator UI on `127.0.0.1:4000`), loaded with pre-seeded test accounts from `.firebase/seeds/`.
- **Runtime Dependency Governance**: Dependencies are anchored on `firebase` 12.19.0 and `@firebase-oss/ui-core` 7.1.0. The `postinstall` scripts declared by `@firebase/util` (1.15.3) and `protobufjs` (7.6.6) are approved via `pnpm approve-builds` in `pnpm-workspace.yaml`. Both are transitive dependencies of the `firebase` SDK (`protobufjs` arrives through `@firebase/firestore` → `@grpc/proto-loader`); neither is used by the emulator, which runs from `firebase-tools`.
- **Flow availability follows the support matrix**: Component presence from
  [ADR 0004](./0004-adopt-firebase-ui-components.md) is not evidence that its
  corresponding authentication flow is usable. New flows require an
  application route, session exchange, and a deterministic test using the
  relevant Emulator REST seam. TOTP must remain unavailable until the pinned
  Emulator demonstrates support. OAuth must use the Firebase SDK-managed
  redirect flow so the Emulator can serve its local provider page; manually
  supplied credentials remain subject to the Emulator's credential limits.
- **Server-verified sessions**: The browser's Firebase state is never trusted by
  the server. Protected pages authorize with an Admin SDK–verified,
  revocation-checked session cookie created by `POST /api/auth/session`
  (origin-checked, recent-auth required). `src/proxy.ts` is only an optimistic
  redirect and is not an authorization boundary. See the implementation
  overview above.
- **Route organization**: Public authentication pages live in `(public)` and
  authenticated pages in `(protected)`; `AuthProvider` is mounted by the layouts
  of those two route groups (`src/app/(public)/layout.tsx` and
  `src/app/(protected)/layout.tsx`), keeping the Firebase UI client boundary off
  the root layout. New protected routes must be added to both `isProtectedPath()` and
  the `src/proxy.ts` matcher.
- **Application-Owned Auth Components**: Application-facing authentication cards, forms, and dialogs for supported flows live in `src/components/notes-app/` (created in commit 9686a943), composing project-owned shadcn Base Nova / Base UI primitives from `src/components/ui/` and following [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md). They reference `src/components/firebase/` for behavioral parity without mutating the reference baseline (ADR 0004). Provider button theming is integrated into `src/app/globals.css` with `@layer components` custom CSS variables and `@variant dark` rules for full light/dark mode support.
- **Architectural Alignment**: Aligns with upstream component baseline in [ADR 0004](./0004-adopt-firebase-ui-components.md) and resilient auth fallback logic defined in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Consequences

### Positive Outcomes

- Enables fully offline local development and deterministic automated
  e-mail/password authentication testing using pre-seeded test accounts.
- Defines deterministic local test seams for e-mail-link, phone/SMS, and SMS
  MFA before those application flows are exposed.
- Eliminates reliance on live Firebase production or staging environments during development and CI runs.
- Resolves pnpm build script warnings (`ERR_PNPM_IGNORED_BUILDS`) by explicitly authorizing `@firebase/util` and `protobufjs`.
- Provides application-owned auth components that mirror upstream behavioral parity while maintaining project design system consistency.

### Trade-offs and Considerations

- Requires developers and test runners to ensure the Firebase Auth Emulator is running during local integration testing.
- Phone authentication and SMS MFA flows generate a new code per attempt; tests
  must obtain it from the Emulator REST API rather than Firebase-console test
  phone-number configuration.
- The Emulator does not send e-mail or SMS, does not implement reCAPTCHA/APNs,
  and its behavior is not production-equivalent for rate limiting or anti-abuse.
- TOTP and provider-button support in the component layer do not establish
  Emulator support. OAuth is locally testable only through the Firebase
  SDK-managed provider flow; manually supplied provider credentials remain
  subject to Emulator limits.
- Signing out revokes the user's refresh tokens, which ends their sessions on
  every device, not just the current one.
- Enrolling or removing a second factor also revokes the other sessions of the
  user (Firebase behavior). The current browser keeps working only because the
  server cookie is re-issued afterwards; a failure of that exchange is shown on
  `/settings` and the next protected navigation falls back to sign-in.
- Re-authentication is sign-out and sign-in, not an in-place credential prompt
  (see "Multi-factor authentication").
- The protected-route list is duplicated between `isProtectedPath()` and the
  `src/proxy.ts` matcher, because Next.js requires a static `matcher`.
- The development-only verifier stub and `appVerificationDisabledForTesting`
  make phone flows work against the Emulator; they exercise no reCAPTCHA logic,
  so reCAPTCHA behavior must be validated separately against a real project.
- The password-reset E2E stops at the request; the reset link itself is not
  followed, and the dev server logs an `invalid or has expired` Firebase error
  during the E2E run that has not been investigated.
- Application-owned components in `src/components/notes-app/` must mirror upstream behavioral parity while maintaining project design system consistency; this requires active maintenance as upstream components evolve.
