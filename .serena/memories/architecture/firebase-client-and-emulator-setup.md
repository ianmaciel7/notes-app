# Firebase Client SDK & Local Emulator Setup (Context7 Verified)

## Sources
Verified against official Firebase documentation (`https://firebase.google.com/docs/auth/web/start`, `https://firebase.google.com/docs/emulator-suite/connect_firestore`) via Context7.

## 1. Firebase Client SDK Initialization (`firebase/app`)

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Idempotent initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
```

## 2. Local Emulator Suite Connection

```typescript
// Connect Auth Emulator (Port 9099 default)
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}

// Connect Firestore Emulator (Port 8080 default)
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
```

## 3. Project Configuration & Invariants (`notes-app`)
- **Emulator Port Mapping (`firebase.json`)**:
  - Auth Emulator: `9099` (UI on `4000`).
  - Firestore Emulator: `8080`.
- **Seed Data Path**: `.firebase/seeds/` (version-controlled test account exports).
- **Npm Emulator Commands**:
  - `pnpm emulator` (`emulators:start --only auth,firestore --import=./.firebase/seeds --export-on-exit=./.firebase/seeds`).
  - `pnpm emulator:dev` (`emulators:start --only auth,firestore --import=.emulator-data --export-on-exit=.emulator-data`).
  - `pnpm seed:emulator` (`node scripts/tooling/seed-emulator.mjs`): seeds a Google-linked account (`demo@notesapp.dev`), space `demo-space`, and exam `gcp-cdl` with 12 questions and cards.
- **Emulator Reset Endpoint (REST)**:
  - Auth: `DELETE http://127.0.0.1:9099/emulator/v1/projects/{projectId}/accounts`
  - Firestore: `DELETE http://127.0.0.1:8080/emulator/v1/projects/{projectId}/databases/(default)/documents`
- **Google Sign-In Account Selection Invariant**:
  - The Auth Emulator's Google sign-in popup widget (`http://127.0.0.1:9099/emulator/auth/handler?...`) only lists existing accounts that have the `google.com` provider ID attached (created via `signInWithIdp` with mock Google token, as performed by `seed:emulator`). Accounts created via password or anonymous sign-in do not appear in the Google account picker list.
