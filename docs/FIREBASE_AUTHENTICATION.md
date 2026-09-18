# Firebase Authentication

This project uses FirebaseUI v7 for the browser sign-in experience and Firebase
Admin SDK for server-side session verification.

## Local development

The default Firebase project is the demo project `demo-notes-app`. Demo
projects are intentionally isolated from production Firebase services.

Start the emulator suite:

```bash
pnpm firebase:emulators
```

The configured endpoints are:

| Service | URL |
| --- | --- |
| Auth | `127.0.0.1:9099` |
| Firestore | `127.0.0.1:8080` |
| Functions | `127.0.0.1:5001` |
| Hosting | `127.0.0.1:5000` |
| Emulator UI | `127.0.0.1:4000` |

Run the Next.js app separately with `pnpm dev`, then open
`http://localhost:3000/sign-in`.

The browser SDK connects Auth, Firestore, and Functions to emulators in
development. The server SDK uses `FIREBASE_AUTH_EMULATOR_HOST` to verify local
ID tokens. Copy `.env.example` to `.env.local` when custom Firebase web
configuration is needed.

## Authentication flow

1. FirebaseUI signs the user in with email/password or Google.
2. The client observes Firebase ID-token changes.
3. The client sends the ID token as a Bearer token to `POST /api/session`.
4. The route verifies the token with Firebase Admin and sets the HttpOnly
   `firebase_session` cookie.
5. Server Components and data access functions call `getCurrentUser()` from
   `src/data/auth.ts`; invalid or missing sessions redirect to `/sign-in`.
6. Sign-out deletes the session cookie through `DELETE /api/session`.

The cookie contains a Firebase ID token and expires after one hour. Firebase
client token refreshes are observed by `onIdTokenChanged`, which refreshes the
server cookie as well.

## Authorization rule

Firestore rules are enforced independently of the UI:

```text
/users/{userId}/notes/{noteId}
```

Reads and writes are allowed only when `request.auth.uid == userId`. All other
paths are denied by default. New server actions, route handlers, or DAL methods
must verify the session again and must not trust a user ID supplied by the
client.

## Cache Components

`next.config.ts` enables `cacheComponents`. The authenticated home content calls
`getCurrentUser()` behind a React `<Suspense>` boundary. The DAL uses
`'use cache: private'` so request-derived session data is not stored in the
server cache. User-specific data should resolve the current user inside an
exported getter, then pass only a stable UID into a separate `'use cache'`
function. Keep tokens, passwords, and raw personal data out of cache keys and
cache tags.

Do not rely on the client `AuthGate` as the only protection. It improves the
browser experience, while the server DAL and Firestore rules provide the actual
authorization boundary.

## Production checklist

- Replace demo Firebase web values with the target Firebase web-app config.
- Set `FIREBASE_PROJECT_ID` and provide Firebase Admin credentials through the
  deployment platform's secret manager.
- Configure `FIREBASE_AUTH_EMULATOR_HOST` only for local development; do not set
  it in production.
- Enable Email/Password and Google providers in Firebase Authentication.
- Add the deployed hostname to Firebase Auth authorized domains.
- Deploy and review `firestore.rules` before enabling production data access.
- Re-authenticate the Firebase CLI before deployment if it reports expired
  credentials.
