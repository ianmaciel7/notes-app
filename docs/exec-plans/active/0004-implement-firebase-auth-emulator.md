# Execution Plan: Implement Firebase Authentication with the Local Emulator

## Metadata

- Status: Draft
- Owner: BobBytes
- Started: 2026-10-07
- Last Updated: 2026-10-07

## 1. Objective

Deliver an end-to-end, locally emulated Firebase Authentication foundation:
the existing application-owned authentication UI must authenticate users,
protected server operations must verify identity, and automated tests must run
deterministically without Firebase cloud credentials or services.

## 2. Scope

### In scope

- A single Firebase client initialization boundary that connects to the Auth
  Emulator at `127.0.0.1:9099` in local development and tests.
- Versioned, deterministic Auth Emulator seed data and scripts to load it.
- A minimal client `AuthProvider` that configures FirebaseUI v7 and handles
  redirect results and recoverable popup-to-redirect fallback.
- App Router authentication routes which compose the existing cards in
  `src/components/notes-app/`, plus one protected route proving the complete
  browser-token-to-server-session lifecycle.
- A server-only identity verification boundary for future Route Handlers and
  Server Actions.
- A narrow, same-origin session exchange and sign-out boundary. Browser Firebase
  state alone is not visible to Server Components, so `/app` must read a
  verified `HttpOnly` session cookie rather than trust client state.
- Tests for configuration, the identity boundary, primary password flow,
  protected-route behavior, and meaningful accessibility checks.
- Developer documentation for starting the emulator and test credentials.

### Out of scope

- A Firebase cloud project, production credentials, or cloud deployment.
- Firestore persistence and exam-domain data (ADR 0008).
- Internationalization and Firebase locale synchronization (ADR 0007).
- A broad authorization model beyond verifying identity for the initial
  protected route.
- Rewriting the immutable upstream baseline in `src/components/firebase/`.
- Claiming equivalent cloud behaviour for OAuth, email delivery, or phone
  delivery. The emulator exposes generated email links and SMS/MFA messages
  locally; tests must consume those emulator artifacts rather than real inboxes
  or devices.

## 3. Canonical context

- [ADR 0005](../adr/0005-adopt-firebase-auth-with-local-emulator.md)
- [ADR 0006](../adr/0006-adopt-firebase-ui-v7-and-auth-resilience.md)
- [Architecture](../../ARCHITECTURE.md)
- [Coding standards](../../CODING_STANDARDS.md)
- [Testing strategy](../../TESTING.md)
- [Firebase emulator configuration](../../firebase.json)
- [Firebase Authentication Emulator guide](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Firebase Admin session-cookie guide](https://firebase.google.com/docs/auth/admin/manage-cookies)
- [Next.js `cookies` reference](https://nextjs.org/docs/app/api-reference/functions/cookies)

## 3.1 Implementation constraints established from current documentation

- Pin `firebase-tools` and `firebase-admin` as development dependencies; do
  not rely on a globally installed CLI. The client SDK remains the only browser
  Firebase dependency.
- The browser initializer must be idempotent (`getApps()` / existing app), call
  `connectAuthEmulator` exactly once with `http://127.0.0.1:9099`, and be unable
  to target the emulator in production. Public Firebase configuration is a
  build-time client configuration, not a credential, but must still be
  validated and documented.
- Server emulator use is configured exclusively with
  `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099` (no URL scheme) and a stable,
  matching Firebase project ID. Keep that server-only environment variable out
  of the `NEXT_PUBLIC_` namespace.
- `cookies()` is asynchronous in Next.js 16 and makes the consumer route
  request-time dynamic. Read it in the server-only session boundary (or a
  protected route-group layout); never make the root layout a Client Component
  and never self-fetch a Route Handler from a Server Component.
- Treat seed exports as fixture data, never as a writable runtime directory.
  `--export-on-exit` must target a temporary path, not `.firebase/seeds/`, so
  ordinary local runs cannot silently change the committed baseline.

## 4. Plan and milestones

- [ ] **Milestone 1 — Establish the Firebase runtime seam**
  - Create the browser Firebase initialization module under `src/lib/firebase/`.
  - Define validated public client configuration plus a stable emulator project
    ID; fail closed in local/test if the configuration is incomplete or points
    at a non-emulator target.
  - Add pinned `firebase-tools`, `firebase-admin`, and portable package scripts
    for the Auth emulator; no global CLI prerequisite.
  - Add focused, initially failing tests for idempotent app creation, emulator
    connection selection, and production non-connection.

- [ ] **Milestone 2 — Make local identity reproducible**
  - Add a versioned Auth Emulator export/import fixture under `.firebase/seeds/`
    and a one-purpose, reviewed refresh script that recreates it from known
    non-secret accounts.
  - Start each integration/E2E run with `--import` and a fresh emulator process;
    use a temporary export location only for diagnosis. Do not share mutable
    Auth state between Playwright workers.
  - Seed only the password account needed for the first vertical slice. Record
    telephone, SMS-MFA, and email-link fixtures separately after their supported
    flows are implemented; email links and SMS codes must be read from emulator
    output/REST APIs, not asserted as delivered externally.
  - Document startup, the non-secret test account, reset behaviour, project ID,
    and the explicit emulator support/limitation matrix. Prove import and a
    password sign-in in an isolated automated run.

- [ ] **Milestone 3 — Integrate the client authentication experience**
  - Implement the smallest possible client `AuthProvider` and mount it from
    the root layout without turning the layout itself into a Client Component.
  - Wire redirect-result handling, non-recoverable error reporting, and the
    ADR 0006 popup-to-redirect fallback.
  - First add only sign-in, sign-up, password recovery, and sign-out routes;
    render the existing application-owned cards rather than the upstream
    reference components. Defer email-link, phone, MFA, and OAuth routes until
    their emulator matrix is verified.
  - After client sign-in, exchange a fresh ID token at the same-origin session
    endpoint. On client sign-out, call its cookie-clearing counterpart and then
    clear Firebase client state; cover failed exchange and partial sign-out.
  - Add component/integration tests at provider, redirect-error, session-sync,
    and error-handling seams.

- [ ] **Milestone 4 — Protect server work**
  - Add a narrow `server-only` Firebase Admin boundary, initialized once and
    configured for the emulator in development and tests. Exchange a recent ID
    token for a bounded-lifetime session cookie only after validating issuer,
    audience, expiry, and recent `auth_time`.
  - Set the session cookie only in a Route Handler: `HttpOnly`, `Path=/`,
    bounded `Max-Age`, `SameSite=Lax`, and `Secure` outside local HTTP. Validate
    the request origin at the mutating session endpoints to prevent login CSRF.
  - Verify the session cookie (including revocation where supported), return a
    minimized identity DTO, and reject missing, malformed, expired, revoked, or
    invalid sessions. Clear the cookie on server sign-out.
  - Add a protected `(app)` route group or `/app` route as the first consumer;
    redirect unauthenticated requests server-side. Do not use a Server
    Component self-fetch through a Route Handler.
  - Test the security boundary before adding its implementation, then exercise
    its unauthenticated, authenticated, expired, and sign-out paths from
    Playwright.

- [ ] **Milestone 5 — Complete and validate representative flows**
  - Verify e-mail/password registration, sign-in, sign-out, and guarded
    navigation end to end against the local emulator.
  - Create an explicit support matrix before adding email-link, phone/SMS, MFA,
    or OAuth coverage. Add deterministic tests only for confirmed Emulator
    behaviour; record unsupported or non-hermetic provider flows rather than
    labeling them "mock OAuth" or simulating cloud success.
  - Run axe checks on the sign-in and protected-route journeys.

- [ ] **Milestone 6 — Finalize delivery**
  - Update ADR 0005 and ADR 0006 current-state sections with only verified
    implementation facts.
  - Run the delivery verification commands below and record actual results.
  - Run the `code-review` skill, resolve applicable findings, and commit the
    focused change set to the current branch.

## 5. Decision log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-10-07 | Keep this plan as a root-level draft. | `active/` is reserved for work actually underway; no implementation has started. |
| 2026-10-07 | Prioritize password authentication and a protected route before specialist flows. | It validates the client, emulator, server-verification, and E2E seams with the smallest vertical slice. |
| 2026-10-07 | Preserve `src/components/firebase/` as reference-only. | ADR 0004 protects the upstream components with an integrity test; application composition belongs in `src/components/notes-app/`. |
| 2026-10-07 | Use a server session cookie after Firebase client sign-in. | A Firebase browser session is not readable by Server Components; a verified `HttpOnly` cookie creates the required server trust boundary. |
| 2026-10-07 | Treat email/SMS output and identity-provider support as Emulator-specific test inputs. | The Emulator does not send real messages; each specialist flow needs an explicit verified support decision before it enters the delivery path. |

## 6. Verification

Run regularly during implementation:

```bash
pnpm run check:types
pnpm run test:changed
pnpm run verify:changed
```

Before delivery, with the emulator available for integration coverage:

```bash
pnpm run verify:fast
pnpm run test:e2e
```

The authentication E2E command must own both the Auth Emulator lifecycle and
the Next.js server lifecycle (for example through `firebase emulators:exec` or
an equivalent cross-platform runner); the current Playwright `webServer` starts
only Next.js and is insufficient by itself.

Record actual command results here when the work is performed. No verification
has been run for this draft.

## 7. Completion

- Completed Date:
- Result:
- Residual risks:
- Follow-up:
