# ADR 0007: Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization

## Status

Accepted

## Date

2026-09-28

## Current State (2026-10-06)

This ADR is accepted as the canonical architectural decision for cookie-based next-intl architecture and Firebase locale preference synchronization. The architecture is verified and aligned with the project technical standards.

## Context

The exam-study platform foundation requires multi-language localization supporting English, Brazilian Portuguese, and Spanish without introducing URL routing friction or database schema pollution.

Key requirements include:
1. **Clean URL Strategy**: Clean URLs without `[locale]` prefix clutter across application routes (e.g. `/`, `/editor`, `/settings`) to simplify deep links, canonical paths, and client routing.
2. **Server-Side Integration**: Built-in React Server Component request caching, automated ICU formatting, and Next.js App Router middleware integration.
3. **Firebase Auth Synchronization**: Seamless alignment with Firebase Auth SDK conventions (`auth.languageCode` for emails, SMS, reCAPTCHA, and OAuth popups, and user profile persistence).
4. **Domain Term Separation**: Localized user-visible terminology across spaces and object types without mutating canonical English identifiers persisted in database models.

## Decision

We adopt `next-intl` using a cookie-driven request configuration without URL path prefixes, paired with Firebase Authentication user language synchronization following official Firebase recommendations.

Key architectural rules and structure:
- **Cookie-Driven Request Configuration**: Routes remain un-prefixed. The active locale is resolved on the server in `src/i18n/request.ts` via the `NEXT_LOCALE` cookie using `next-intl/server` (`getRequestConfig`), falling back to `en` by default.
- **Supported Locales**: The default locale is `en` (English), with support for `pt-BR` (Portuguese - Brazil) and `es` (Spanish). UI strings are externalized in `src/messages/*.json`.
- **Firebase Auth Synchronization**: `auth.useDeviceLanguage()` is called strictly as an initial fallback for unauthenticated guest sessions. When an explicit language preference is set or retrieved from the user's profile document (e.g. Firestore `/users/{uid}`), client handlers assign `auth.languageCode = selectedLocale` on the Firebase `Auth` instance and synchronize the `NEXT_LOCALE` cookie for server-side `next-intl` rendering.
- **Canonical Domain Separation**: Persisted entities, database models, and built-in object type records preserve canonical English identifiers (e.g. `singularName`, `pluralName`, `spaceId`), while all UI surfaces resolve dynamic display labels from `src/messages/*.json`.
- **Architectural Alignment**: Aligns with [`ARCHITECTURE.md`](../../ARCHITECTURE.md), auth components in [ADR 0004](./0004-adopt-firebase-ui-components.md), and auth resilience in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md).

## Consequences

### Positive Outcomes

- Delivers clean, un-prefixed URLs across all application routes without routing noise.
- Provides server-side translation rendering and request caching via standard `next-intl` server configuration.
- Maintains strict alignment with Firebase Auth SDK conventions (`auth.languageCode` for client auth flows, user database document for cross-device persistence).
- Enforces clear separation between canonical persisted domain identifiers in English and localized UI strings.

### Trade-offs and Considerations

- Locale switching requires updating the `NEXT_LOCALE` cookie and triggering a client router refresh or re-render.
