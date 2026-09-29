---
name: firebase-setup
description: Bootstrap Firebase Auth emulator with seed data, validate environment, and manage auth flow testing.
metadata:
  category: Firebase Infrastructure
  triggers: ["emulator", "firebase", "auth testing", "seed data"]
disable-model-invocation: true
---

## Overview

Your notes-app uses Firebase Auth with emulator-based local development and cookie-based i18n sync. This skill manages emulator startup, seed data, and environment validation.

## Prerequisites

- Firebase CLI: `npm install -g firebase-tools` or `npx firebase-tools`
- Project authenticated: Run `firebase login` once

## Startup

### Start Emulator with Seeds

```bash
pnpm emulator
# Imports seed data from .firebase/seeds and exports on exit
```

### Start Emulator (No Seeds)

```bash
pnpm emulator:start
# Clean start without seed data
```

## Seed Data

Seed data is stored in `.firebase/seeds/` and automatically imported/exported by emulator startup.

### Add Test Users to Seeds

1. Start emulator: `pnpm emulator`
2. Create users via Auth UI or SDK
3. On exit, seeds auto-save to `.firebase/seeds/`
4. Commit seeds if needed for CI/team sharing

### Clear Seeds

```bash
rm -rf .firebase/seeds
pnpm emulator  # Create fresh seeds
```

## Environment Validation

Before running auth-dependent tests:

```bash
# Validate Firebase env vars are set
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_API_KEY

# Check emulator is listening
curl http://localhost:9099 2>/dev/null && echo "✓ Emulator running"
```

### Environment Variables Required

```bash
FIREBASE_PROJECT_ID=notes-app-dev
FIREBASE_API_KEY=AIzaSy...
FIREBASE_DOMAIN=notes-app-dev.firebaseapp.com
```

Set in `.env.local` (gitignored).

## Auth Flow Testing

### Test Email/Password

```javascript
// In test or interactive console
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
await signInWithEmailAndPassword(auth, "test@example.com", "password123");
```

### Test Custom Claims & Locale Sync

Your app syncs user locale to Firebase via custom claims (from `next-intl` cookie):

```bash
# Emulator console available at: http://localhost:4000
# Users tab shows custom claims
```

## Integration with i18n

Auth flow syncs locale cookie to Firebase custom claims via auth guard. When testing i18n scenarios:

1. Start emulator: `pnpm emulator`
2. Sign in test user
3. Locale cookie → Firebase custom claims (automatic via guard)
4. Verify in Emulator UI → Users → custom claims

## Debugging

### View Emulator Logs

```bash
# Logs printed to console during emulator startup
# Or check: http://localhost:4000 (Emulator UI)
```

### Reset Single Provider

```bash
firebase emulators:start --only auth --import=.firebase/seeds
# Stop with Ctrl+C
```

## Related Docs

- `.firebase/seeds/` — Seed data for auth emulator
- `src/lib/auth-guard.ts` — Auth initialization and locale sync
- `TESTING.md` — Auth-related test patterns
