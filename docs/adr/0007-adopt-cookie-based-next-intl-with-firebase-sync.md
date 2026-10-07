# ADR 0007: Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization

## Status

Accepted (not yet implemented on `dev`)

## Date

2026-09-28

## Current State (2026-10-06)

The decision is accepted, but not yet implemented on `dev`. `next-intl` is not
installed, and `src/i18n/request.ts`, `src/messages/*.json`, and the
`NEXT_LOCALE` cookie handling do not exist; `src/app/layout.tsx` hardcodes
`lang="en"`. Locale synchronization also depends on the unimplemented Firebase
Auth layer in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md).
Treat the structure below as the target design.

## Context

The exam-study platform foundation requires multi-language localization supporting English, Brazilian Portuguese, and Spanish without introducing URL routing friction or database schema pollution.

Key requirements include:
1. **Clean URL Strategy**: Clean URLs without `[locale]` prefix clutter across application routes (e.g. `/`, `/editor`, `/settings`, `/login`) to simplify deep links, canonical paths, and client routing.
2. **Server-Side Integration**: Built-in React Server Component request caching, automated ICU formatting, and Next.js App Router middleware integration.
3. **Firebase Auth Synchronization**: Seamless alignment with Firebase Auth SDK conventions (`auth.languageCode` for emails, SMS, reCAPTCHA, and OAuth popups, and user profile persistence).
4. **Auth Component Localization**: Seamless localization across all 30 installed Firebase UI components, including `@firebase/country-selector`, `@firebase/policies`, `@firebase/redirect-error`, and authentication forms/screens.
5. **Domain Term Separation**: Localized user-visible terminology across spaces and object types without mutating canonical English identifiers persisted in database models.

## Decision

We adopt `next-intl` using a cookie-driven request configuration without URL path prefixes, paired with Firebase Authentication user language synchronization following official Firebase recommendations.

Key architectural rules and structure:
- **Cookie-Driven Request Configuration**: Routes remain un-prefixed. The active locale is resolved on the server in `src/i18n/request.ts` via the `NEXT_LOCALE` cookie using `next-intl/server` (`getRequestConfig`), falling back to `en` by default.
- **Supported Locales**: The default locale is `en` (English), with support for `pt-BR` (Portuguese - Brazil) and `es` (Spanish). UI strings are externalized in `src/messages/*.json`.
- **Firebase Auth Synchronization**: `auth.useDeviceLanguage()` is called strictly as an initial fallback for unauthenticated guest sessions. When an explicit language preference is set or retrieved from the user's profile document (e.g. Firestore `/users/{uid}`), client handlers assign `auth.languageCode = selectedLocale` on the Firebase `Auth` instance and synchronize the `NEXT_LOCALE` cookie for server-side `next-intl` rendering.
- **Component-Level Localization Interplay**:
  - `country-selector.tsx` formats international dial codes and localized country labels while emitting standard E.164 phone numbers to `phone-auth-form` and SMS MFA forms.
  - Legal disclaimer links in `policies.tsx` (Terms of Service, Privacy Policy) resolve localized targets without route disruption.
  - Redirect error messages from `redirect-error.tsx` and form validation messages from `@hookform/resolvers` map directly to localized message strings in `src/messages/*.json`.
- **Canonical Domain Separation**: Persisted entities, database models, and built-in object type records preserve canonical English identifiers (e.g. `singularName`, `pluralName`, `spaceId`), while all UI surfaces resolve dynamic display labels from `src/messages/*.json`.
- **Architectural Alignment**: Aligns with [`ARCHITECTURE.md`](../../ARCHITECTURE.md), auth components in [ADR 0004](./0004-adopt-firebase-ui-components.md), and auth resilience in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Consequences

### Positive Outcomes

- Delivers clean, un-prefixed URLs across all application routes without routing noise.
- Provides server-side translation rendering and request caching via standard `next-intl` server configuration.
- Maintains strict alignment with Firebase Auth SDK conventions (`auth.languageCode` for client auth flows, user database document for cross-device persistence).
- Ensures seamless multi-language presentation for all 30 Firebase UI components, country selections, legal policies, and error handling.
- Enforces clear separation between canonical persisted domain identifiers in English and localized UI strings.

### Trade-offs and Considerations

- Locale switching requires updating the `NEXT_LOCALE` cookie and triggering a client router refresh or re-render.
- Custom form validator errors from `@hookform/resolvers` must maintain localized message key parity across all supported language catalogs (`en`, `pt-BR`, `es`).
