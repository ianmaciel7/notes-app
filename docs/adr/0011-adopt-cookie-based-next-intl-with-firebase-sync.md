# Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization

We needed a standardized, resilient internationalization (i18n) architecture for Next.js App Router that keeps URLs clean (avoiding path prefix clutter like `/[locale]/...`) while enabling seamless multi-language support and synchronization with Firebase Authentication user preferences.

## Context and Problem Statement

Previous iterations explored two diverging paths:
1. Hardcoded route prefix routing (`defineRouting` with `localePrefix: "always"` in `old-4`), which required nesting all application routes under `[locale]` segments, complicating deep links, canonical paths, and client routing.
2. In-house typed React context dictionaries without external libraries (`old-9`), which lacked built-in server component request caching, automated ICU formatting, and Next.js App Router middleware integration.

Furthermore, user-visible terminology across spaces and object types must remain localized without mutating canonical English identifiers persisted in IndexedDB/Dexie or remote database models.

## Decision

We adopt `next-intl` using a cookie-driven request configuration without URL path prefixes, paired with Firebase Authentication user language synchronization:

1. **Clean URL Strategy**: Routes remain un-prefixed (e.g., `/`, `/editor`, `/settings`). The active locale is resolved on the server in `src/i18n/request.ts` via the `NEXT_LOCALE` cookie using `next-intl/server` (`getRequestConfig`), falling back to `en` by default.
2. **Supported Locales**: The default locale is `en` (English), with support for `pt-BR` (Português - Brasil) and `es` (Español).
3. **Firebase Auth Synchronization**: When an authenticated user updates their language preference, client handlers call Firebase Auth `auth.useDeviceLanguage()` or update `auth.currentUser` language/user document settings, synchronizing the `NEXT_LOCALE` cookie and browser `localStorage` simultaneously.
4. **Canonical Domain Separation**: Persisted entities, database models, and built-in object type records preserve canonical English identifiers (e.g. `singularName`, `pluralName`, `spaceId`), while all UI surfaces (menus, command palette, tabs, notifications, Firebase error codes) resolve dynamic display labels from `src/messages/*.json`.
