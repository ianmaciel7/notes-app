# Firebase Auth Architecture & Vendor UI Boundaries (Context7 & ADR Verified)

## Sources
Verified against Context7 (`/websites/firebase_google`), ADR 0008, ADR 0009, and ADR 0010.

## 1. Authentication State Observer Pattern (`firebase/auth`)

```typescript
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Client-side React 19 AuthProvider observer
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
    setUser(currentUser);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);
```

## 2. Popup vs Redirect Fallback Resilience (ADR 0010)

```typescript
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

try {
  await signInWithPopup(auth, provider);
} catch (error: any) {
  // If popups are blocked by browser policy or cross-origin headers, fall back to redirect
  if (error.code === "auth/popup-blocked" || error.message?.includes("popup")) {
    await signInWithRedirect(auth, provider);
  } else {
    throw error;
  }
}
```

## 3. Vendor UI Immutability & Customization Boundaries (ADR 0008)
- **Immutable Upstream Drop (`src/components/firebase/`)**:
  - `src/components/firebase/` contains vendor code (`@firebase-oss/ui-react` / `@firebase-oss/ui-core`).
  - **Zero modification policy**: Never edit files inside `src/components/firebase/`.
- **Application Customization Drop (`src/components/notes-app/`)**:
  - Whenever vendor components need styling, accessibility, or type adjustments, copy and adapt them into `src/components/notes-app/` (e.g. `SignInAuthScreen`, `SignUpAuthScreen`, `SignInAuthForm`).
  - Application routes (`src/app/(auth)/login/page.tsx`) must strictly import from `@/components/notes-app/*`.
