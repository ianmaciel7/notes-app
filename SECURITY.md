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

## Current implementation details

The current `dev` branch includes Firebase/Firebase UI, Auth Emulator flows
for password, email link, phone/SMS, Google OAuth popup, and SMS MFA, and
server-only, revocation-checked Firebase session cookies. Sign-out requires a
successful same-origin server-session removal before the client signs out; a
failed request displays a retryable error instead of pretending that the
session ended.

`src/actions/` contains externally reachable Server Actions. The locale
actions validate supported locale values; the Space deletion actions validate
only that their identifiers are strings, then delegate. They are not the
authorization boundary. Every exported function in `src/data/` obtains the
current identity from the revocation-checked session itself and accepts no UID
from its caller. The Space and Object Type deletion functions additionally
validate identifiers and read the Space document to confirm its stored
`ownerId` matches that identity before using the Admin SDK. The locale data
functions return `null` for a guest read and `false` for a guest write.

The Admin SDK bypasses Firestore Rules. Consequently, the checks in
`src/data/space-dal.ts`, `src/data/object-type-dal.ts`, and
`src/data/locale-dal.ts` are required for their respective server operations;
Rules do not protect an Admin SDK call. Space and Object Type deletion occurs
only through these server-side operations. The deletion Server Actions return
the minimal `SpaceDeletionResult` outcome rather than a record or identity.

Browser Firestore access is separately limited by `firestore.rules`.
Authenticated owners may read, list, create, and update their own Space and
Object Type documents at `/users/{uid}/spaces/{spaceId}` and
`/users/{uid}/spaces/{spaceId}/objectTypes/{objectTypeId}`; Object Type client
creates and updates require `parentTypeId` to be `null`, and client deletion of
either document is denied. The browser may read its own `users/{uid}` profile,
but every browser write to that document is denied. Rules are the authorization
boundary for browser SDK operations, but they do not constrain server-side
Admin SDK operations.

Known limitations remain those recorded in [ADR 0011](./docs/adr/0011-adopt-object-type-foundation-in-firestore.md): inheritance is not operationally
supported; Object Type property-definition entries are not validated by Rules;
the Object Type direct-child check and recursive deletion are not atomic; and
the deferred Objects-in-use check does not yet exist. A future trusted backend
that writes a non-null Object Type parent must also address the current Rules
limitation on later client updates.

ADRs 0004–0011 are accepted decisions. Their Current State sections distinguish
implemented groundwork from target behavior that is not yet built. Security
reviews must not treat accepted-but-unimplemented behavior as an existing
control.
