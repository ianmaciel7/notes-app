# ADR 0007: Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization

## Status

Accepted

## Implementation

Implemented

## Date

2026-09-28 (revised 2026-10-08)

## Current State (2026-10-08)

**Implementation: delivered and verified; GitHub CI is green on `dev`.**
This decision is implemented in the remote `dev` source tree. It does not
introduce a general Firestore browser data layer, which remains ADR 0008.

### Locale routing and hydration

- Supported locales: `en`, `pt-BR`, `es` with matching namespaces and
  placeholders in `src/messages/*.json`.
- `src/i18n/request.ts` resolves an explicitly selected `NEXT_LOCALE`
  cookie, then `Accept-Language`, then English; unselected browser values
  remain automatic and are never written as a preference.
- The root layout retains a static `<html lang>` and a
  `beforeInteractive` language script. The async
  `src/components/notes-app/intl-provider.tsx` runs under `Suspense`
  and supplies `NextIntlClientProvider` to client routes and controls.
- The page-header `LocalePicker` uses the project's shadcn/Base UI Select.
  `src/hooks/use-locale-picker.ts` invokes a Server Action, updates the
  document language, refreshes the route, and exposes localized errors.

### Authentication and preferences

- FirebaseUI v7 text continues to use `@firebase-oss/ui-translations`;
  Firebase Auth's `languageCode` is synchronized after mount. App-owned
  authentication card text, validation feedback, navigation, sign-out,
  redirect errors, and study/settings labels come from the `next-intl`
  catalogs. Region labels in the country picker use ECMA-402
  `Intl.DisplayNames`.
- `setLocalePreference` stores the explicit `NEXT_LOCALE` cookie and,
  when a server-verified identity is present, merges `locale` into
  Firestore `users/{uid}` via the Admin SDK. Clients cannot supply
  the UID. Firestore writes occur before setting the cookie, so a failed
  profile update does not falsely claim the choice was saved.
- After Firebase Auth exchanges an ID token for a verified server session,
  `syncLocalePreference` reads that user's Firestore profile once and
  reapplies a saved locale. If a new profile has no locale but the guest
  previously chose one explicitly, it adopts that choice. The system never
  persists automatic browser negotiation. Preference-service failures do
  not block sign-in and are displayed in the chosen UI language.
- Local development and E2E now start both Auth and Firestore emulators.
  Set `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099` and
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` for the local server.
  Production uses Firebase Admin credentials and the configured project.

### Verification and scope boundary

- Unit test sources cover locale negotiation, client synchronization,
  explicit cookie writes, verified-user Firestore preferences, and sign-in
  precedence (`tests/unit/i18n-*.test.ts` and
  `tests/unit/locale-preference-actions.test.ts`).
- `tests/e2e/locale.spec.ts` covers explicit language selection and
  cross-browser profile preference restoration with the emulators.
- GitHub CI on `dev` passes (lint, TypeScript, unit, production build,
  size limit and Playwright E2E, commit `9b036dfc`). Local unit run: 18 files,
  111 tests passing.
- Out of scope: ADR 0008's direct browser Firestore persistence,
  IndexedDB multi-tab cache, study-domain entities, and TOTP in the
  Auth Emulator. These are not required to use the server-only locale
  preference seam.

## Context

The exam-study platform foundation requires multi-language localization supporting English, Brazilian Portuguese, and Spanish without introducing URL routing friction or database schema pollution.

Key requirements include:
1. **Clean URL Strategy**: Clean URLs without `[locale]` prefix clutter across application routes (e.g. `/`, `/editor`, `/settings`, `/login`). The app is authenticated and has no public per-language pages, so locale-specific URLs and per-language SEO are not needed.
2. **Server-Side Integration**: Server Component translation, request-scoped configuration, and ICU formatting through `next-intl`.
3. **Firebase Auth Synchronization**: Alignment with Firebase Auth SDK conventions (`auth.languageCode` for emails, SMS, reCAPTCHA, and OAuth flows) and cross-device persistence of the user's preference.
4. **Auth Component Localization**: Localization of the installed Firebase UI components.
5. **Domain Term Separation**: Localized user-visible terminology across spaces and object types without mutating canonical English identifiers persisted in database models.
6. **Cache Components Compatibility**: `cacheComponents: true` is enabled. Per-request reads (`cookies()`, `headers()`) must sit inside `<Suspense>` or the route blocks instead of being instant (see Next.js `blocking-prerender-runtime`).

## Decision

We adopt `next-intl` using a cookie-driven request configuration without URL path prefixes, paired with Firebase Authentication language synchronization.

### Locale resolution order

`src/i18n/request.ts` resolves the active locale on the server, first match wins:

1. **Explicit choice**: the `NEXT_LOCALE` cookie, written only when the user picks a locale (or when the profile preference is applied at sign-in).
2. **`Accept-Language`**: negotiated against the supported locales by an in-repo matcher (`negotiateLocale` in `src/lib/i18n/config.ts`, which honors quality values and matching on the primary language), so `pt` and `en-US` map to `pt-BR` and `en`. No external locale-matching package is used.
3. **Default**: `en`.

An absent cookie means "automatic". Auto-detected values are never persisted to `NEXT_LOCALE`.

### Locale preference persistence

- Supported locales: `en` (default), `pt-BR`, and `es`. UI strings live in `src/messages/*.json`.
- A Server Action sets the cookie (`cookies().set`, one-year `Max-Age`, `Path=/`, `SameSite=Lax`) and refreshes the route. Client code does not write `document.cookie`.
- For signed-in users the preference is stored in Firestore `/users/{uid}`. It is read once at sign-in; if present, it is applied by writing the cookie. This provides cross-device sync, while the cookie remains the fast path for first paint.

### Firebase synchronization

- `auth.languageCode` mirrors the already-resolved locale for Firebase Auth emails, SMS, reCAPTCHA, and OAuth flows. `auth.useDeviceLanguage()` is not used for UI locale selection.
- Firebase UI v7 ships its own translations in `@firebase-oss/ui-translations` (`enUs`, `ptBr`, `esEs`, `esLa`, among others) and exposes `initializeUI({ locale })` and `setLocale()`. Firebase UI text is localized through these, mapping `en` to `enUs`, `pt-BR` to `ptBr`, and `es` to `esLa` (to be confirmed against the target audience; `esEs` is the alternative). These strings are not duplicated in `src/messages/*.json`.
- Application-owned strings (validation messages from `@hookform/resolvers`, the app-owned auth cards and dialogs in `src/components/notes-app/`, and redirect error text we render ourselves) come from `src/messages/*.json`. Files under `src/components/firebase/` remain unmodified upstream components.

### Cache Components and `<html lang>`

`<html lang>` cannot be wrapped in `<Suspense>`, so the root layout must not read the cookie on the server. The root layout renders a static `lang` (the default locale) with `suppressHydrationWarning`, and a pre-paint script sets `lang` from the resolved locale (see the Next.js "Preventing flash before hydration" guide). Components that call `getTranslations` or read the locale sit inside `<Suspense>` boundaries placed as low as practical. `export const instant = false` on the root layout is rejected because it disables instant navigation for the whole app.

### Canonical domain separation

Persisted entities, database models, and built-in object type records preserve canonical English identifiers (e.g. `singularName`, `pluralName`, `spaceId`), while all UI surfaces resolve display labels from `src/messages/*.json`.

### Architectural alignment

Aligns with [`ARCHITECTURE.md`](../../ARCHITECTURE.md), auth components in [ADR 0004](./0004-adopt-firebase-ui-components.md), and auth resilience in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Alternatives Considered

- **`[locale]` segment with `localePrefix: 'never'`** (proxy rewrite, static rendering via `next/root-params`): gives static rendering per locale and clean URLs, but requires moving all routes under `[locale]` and composing with the existing `proxy.ts`. Rejected for now because the app is authenticated and has no public static per-language pages. Revisit if public localized pages are added.
- **`export const instant = false` on the root layout**: simplest way to silence the blocking-route error, but disables instant navigation app-wide. Rejected.
- **Locale only in Firestore**: not available to first paint or to guests. Rejected; the cookie stays the primary source.

## Consequences

### Positive Outcomes

- Clean, un-prefixed URLs across all application routes.
- First visits render in the browser's language without a client-side correction pass.
- An explicit user choice is never overwritten by auto-detection.
- Firebase UI text is localized by the library's own translations instead of a parallel catalog.
- The static shell is preserved under Cache Components.
- Canonical English identifiers stay separate from localized UI strings.

### Trade-offs and Considerations

- Localized content is request-dependent, so it streams behind `<Suspense>` instead of being prerendered per locale.
- The pre-paint script plus `suppressHydrationWarning` is a documented Next.js workaround, not a first-class API.
- Changing locale writes the cookie in a Server Action and refreshes the route; Firebase UI and `auth.languageCode` must be updated with the same value (`setLocale`, `languageCode`).
- The in-repo `Accept-Language` matcher is code the project maintains and tests (`tests/unit/i18n-config.test.ts`) instead of a library dependency.
- `next-intl` documents no first-party recipe for cookie-only locales under `cacheComponents`; the approach must be verified with `next build --debug-prerender`.
- Validation messages must keep key parity across all supported catalogs (`en`, `pt-BR`, `es`).
