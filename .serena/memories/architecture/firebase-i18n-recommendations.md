# Firebase Authentication Language & i18n Official Recommendations (Context7 Verified)

## Source & References
Verified against official Firebase documentation (`https://firebase.google.com/docs/auth/web/manage-users`) via Context7 (`/websites/firebase_google`).

## Core API & Behavior

### 1. `auth.languageCode`
```javascript
import { getAuth } from "firebase/auth";

const auth = getAuth();
auth.languageCode = 'pt-BR'; // Localizes client-triggered Auth emails, SMS, reCAPTCHA, and OAuth popups
```
- **Scope**: Localizes client-initiated authentication flows, including password reset emails (`sendPasswordResetEmail`), email verification (`sendEmailVerification`), SMS verification (`signInWithPhoneNumber`), reCAPTCHA widgets, and OAuth provider popups.
- **Client In-Memory Property**: `languageCode` is set directly on the client `Auth` instance. It is NOT stored in the backend `UserRecord` (`auth.currentUser`).

### 2. `auth.useDeviceLanguage()`
```javascript
import { getAuth } from "firebase/auth";

const auth = getAuth();
auth.useDeviceLanguage(); // Automatically sets auth.languageCode from browser navigator.language
```
- **Usage**: Use `auth.useDeviceLanguage()` as an initial fallback for unauthenticated guest sessions when no explicit user language preference has been chosen or stored.

## Canonical Web / Next.js Synchronization Pattern

To support full-stack SSR web applications (e.g. Next.js App Router with `next-intl`):

1. **Guest Initialization**: Invoke `auth.useDeviceLanguage()` on initial app load if no saved user preference or `NEXT_LOCALE` cookie exists.
2. **Explicit Preference & Auth Instance Sync**: When a user selects a language preference (or logs in with a saved preference in Firestore `/users/{uid}`):
   - Set `auth.languageCode = activeLocale` on the client `Auth` instance.
   - Set the `NEXT_LOCALE` HTTP cookie (driving `src/i18n/request.ts` for Next.js SSR server component rendering).
   - Update the user profile document in Firestore (`locale` field) for cross-device persistence.
