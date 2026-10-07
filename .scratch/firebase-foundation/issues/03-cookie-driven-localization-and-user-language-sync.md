# 03: Cookie-Driven Localization with User Language Synchronization

**What to build:** Clean URL internationalization across English, Brazilian Portuguese, and Spanish without route prefix clutter. The active language is resolved on the server via a request cookie with fallback to the device language for guest sessions. When authenticated learners change their language preference, the choice is saved to the cookie, synchronized with the Firebase authentication instance language code, and persisted to the user profile document in the database, while system domain identifiers remain canonically intact in English.

**Blocked by:** 01: Upstream Reference Registry, Guard & Local Authentication Flow

**Status:** ready-for-agent

- [ ] All application routes maintain clean, un-prefixed paths while rendering localized content based on cookie resolution.
- [ ] English is the default locale, with full translation coverage for Brazilian Portuguese and Spanish.
- [ ] Unauthenticated guest visits fall back gracefully to the browser device language.
- [ ] An interactive language selector allows learners to switch locales seamlessly.
- [ ] Changing language sets the locale cookie, updates the authentication client language code, and updates the user's profile document.
- [ ] When an existing user signs in from a fresh browser, their saved language preference from their profile is automatically restored.
- [ ] Persisted database entities, keys, and technical domain terms remain canonically in English regardless of the active UI locale.
- [ ] Automated tests verify server cookie resolution, client language switching, and persistence across sessions.
