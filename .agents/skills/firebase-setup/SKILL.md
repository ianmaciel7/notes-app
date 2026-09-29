---
name: firebase-setup
description: Bootstrap and validate the local Firebase Auth emulator, seed data, and auth/i18n test environment used by notes-app.
metadata:
  category: Firebase Infrastructure
  triggers: ["emulator", "firebase", "auth testing", "seed data"]
disable-model-invocation: true
---

## Overview

Use this skill for the repository's local Firebase Authentication environment. The implementation source of truth is `src/lib/firebase/client.ts`; locale synchronization is owned by `src/lib/i18n/locale-sync.ts`.

The local Auth emulator does not require production credentials. Firebase login is only required for commands that contact real Firebase projects.

## Start the emulator

Seeded local environment:

```bash
rtk pnpm emulator
```

Clean local Auth emulator:

```bash
rtk pnpm emulator:start
```

The Auth emulator listens on `127.0.0.1:9099`; the Emulator UI is configured on `127.0.0.1:4000`.

## Seed data

Committed emulator seed data lives under `.firebase/seeds/`.

To update seeds intentionally:

1. Start `rtk pnpm emulator`.
2. Create or modify emulator-only users.
3. Stop the emulator cleanly so `--export-on-exit` writes the new snapshot.
4. Review the seed diff before committing it.

Never commit `.firebase/logs/` or machine-local Firebase debug output.

## Client configuration

`src/lib/firebase/client.ts` reads the following optional public overrides:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
NEXT_PUBLIC_USE_FIREBASE_EMULATOR
```

Development and test environments connect to the Auth emulator automatically. Real production/staging values belong in environment configuration, never in committed source.

## Locale synchronization

The app does **not** store locale in Firebase custom claims.

The current flow is:

1. `NEXT_LOCALE` cookie selects the server-rendered locale.
2. `src/lib/i18n/locale-sync.ts` validates the locale.
3. Firebase Auth receives the same locale through `auth.languageCode`.
4. Guest initialization may fall back to Firebase `useDeviceLanguage()` when no explicit cookie exists.

Cross-device preference persistence requires a user profile datastore and is not implemented by the Auth emulator setup itself.

## Verification

Unit and emulator integration coverage:

```bash
rtk pnpm test
rtk pnpm test:e2e
```

When a test specifically requires a live emulator, the test environment must start it explicitly rather than silently treating emulator absence as successful integration coverage.

## Related files

- `firebase.json` — emulator ports and services.
- `.firebase/seeds/` — committed emulator seed snapshot.
- `src/lib/firebase/client.ts` — Firebase app/auth initialization and emulator connection.
- `src/lib/i18n/locale-sync.ts` — locale cookie and Firebase Auth language synchronization.
- `playwright.config.ts` — E2E web server and emulator lifecycle.
- `TESTING.md` — repository testing strategy.
