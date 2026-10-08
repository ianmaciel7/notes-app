# Security Policy

## Supported version

The active `0.1.x` development line receives security maintenance.

## Reporting a vulnerability

Do not open a public issue for a vulnerability. Use GitHub Security Advisories
or another private maintainer channel.

Include:

- affected route/component/module;
- reproduction steps;
- impact;
- proof of concept when safe;
- suggested mitigation if known.

## Security invariants

### Secrets

- Never commit secrets, credentials, tokens, or service-account files.
- Local secrets belong in ignored environment files such as `.env.local`.
- Only values intentionally exposed to the browser may use
  `NEXT_PUBLIC_*`.
- Privileged modules should be server-only when introduced.

### Server boundaries

Server Actions, Route Handlers, authentication, and future persistence must:

- validate all external input at runtime;
- authenticate at the server operation boundary;
- authorize access to the specific resource;
- do not trust client-provided roles, ownership IDs, or authorization claims;
- return minimum safe data to Client Components;
- treat Route Handlers as public HTTP endpoints.

Proxy, layouts, and client-side route guards are not substitutes for
authorization inside the operation that reads or mutates protected data.

### Rendering

Do not render untrusted HTML with `dangerouslySetInnerHTML` without a proven,
context-appropriate sanitization strategy.

Prefer structured rendering over raw HTML injection.

### Dependencies

Run:

```bash
pnpm run check:security
```

CI executes `pnpm audit --audit-level high`.

The repository currently contains a documented audit exception for
`GHSA-vfj7-8cjw-p6xm` through `markdownlint-cli2` because no patched
`braces` release is available in the current dependency chain. The exposure is
limited to repository-controlled glob patterns. Remove the exception as soon
as the dependency chain provides a patched release.

## Current implementation note

The current `dev` branch includes Firebase/Firebase UI, Auth Emulator flows
for password, email link, phone/SMS, Google OAuth redirect, and SMS MFA,
and server-only, revocation-checked Firebase session cookies. Sign-out
requires a successful same-origin server-session removal before the client
signs out; a failed request displays a retryable error instead of pretending
that the session ended. The Firestore emulator is configured, but application
data access and user data persistence are not implemented.

ADRs 0004–0008 are accepted decisions. Their Current State sections distinguish
implemented groundwork from target behavior that is not yet built. Security
reviews must not treat accepted-but-unimplemented behavior as an existing
control.
