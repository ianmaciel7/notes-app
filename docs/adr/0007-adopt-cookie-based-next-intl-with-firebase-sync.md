# ADR 0007: Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization

## Status

Accepted

## Implementation

Partially implemented

## Date

2026-09-28 (revised 2026-10-07)

## Current State (2026-10-07)

`next-intl` is configured without locale URL prefixes and the three message
catalogs exist. The revised decision below is implemented on `dev` for these
parts (unit-tested; no production build has been run, see below):

- `src/i18n/request.ts` resolves the locale as `NEXT_LOCALE` cookie, then
  `Accept-Language` (`negotiateLocale` / `matchLocale` in
  `src/lib/i18n/config.ts`, so `pt` and `en-US` map to `pt-BR` and `en`), then `en`.
- `src/lib/i18n/actions.ts` provides the `setLocalePreference` Server Action,
  which is the only code that writes the `NEXT_LOCALE` cookie.
- `src/lib/i18n/client.ts` resolves the client locale (cookie, then browser
  languages) without persisting it, and mirrors it to `auth.languageCode` and
  to Firebase UI text (`applyAuthLocale`). `auth.useDeviceLanguage()` is no
  longer used.
- Firebase UI text localization: `@firebase-oss/ui-translations` 7.1.0 is a
  direct dependency. `src/lib/i18n/firebase-ui-locale.ts` maps `en` to `enUs`,
  `pt-BR` to `ptBr`, and `es` to `esLa`. `useAuthProvider` calls
  `ui.setLocale()` from the `onAuthStateChanged` callback, after mount, so the
  first client render matches the server-rendered English text and hydration
  stays consistent. `initializeUI` is therefore not given a `locale`, and the
  UI text switches from English to the resolved locale after hydration.
  `changeLocalePreference` persists an explicit choice and mirrors it, but no
  UI calls it yet.
- `src/app/layout.tsx` renders a static `lang` with `suppressHydrationWarning`
  and sets it before hydration with a `next/script` `beforeInteractive` script
  (`src/components/notes-app/locale-lang-script.ts`); it no longer reads
  `cookies()`.

Not implemented:

- Localization of application-owned auth text: `src/messages/*.json` holds only
  the `common` namespace, and the auth cards and dialogs in
  `src/components/notes-app/` do not use `next-intl` yet.
- Firestore-backed profile persistence and a user-facing locale picker that
  calls `setLocalePreference`.
- Localized form-validation messages.
- Verification with a production build: `next build` could not load
  `next.config.ts` in the working environment (`next-intl/plugin` requires
  `@swc/core`, whose native binding fails to load on the development machine:
  `ERR_SWC_NATIVE_CACHE`, cache root ACL).
  Run `next build --debug-prerender` to confirm no blocking-prerender errors.

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
