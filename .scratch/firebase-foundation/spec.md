# Spec: Firebase Authentication, Local Firestore Cache & Internationalization Foundation

Status: ready-for-agent

## Problem Statement

Learners preparing for high-stakes exams need a seamless, uninterrupted study experience where their authentication, locale preferences, and study records work consistently across devices and browser sessions—even during flaky or offline network conditions.

Currently, learners face several points of friction:
1. Authentication failures occur frequently in constrained browser environments (e.g., third-party cookie restrictions, aggressive popup blockers, or cross-origin iframe blocks) when popup-based OAuth mechanisms fail without a reliable fallback.
2. Applications that rely exclusively on remote cloud roundtrips suffer from latency on every study interaction (such as recording question attempts or modifying study spaces), and completely block students when network connectivity drops.
3. Multilingual students who prefer Brazilian Portuguese or Spanish must either suffer fragmented UI translations or endure noisy, clunky URL prefix routing (such as `/pt-BR/...`) that breaks shareable links and deep navigation.
4. Developers and automated test suites lack a hermetic, offline-capable environment to verify authentication, persistence, and localization deterministically without connecting to live cloud projects.

## Solution

Implement a resilient client foundation combining native Firebase Authentication, FirebaseUI open-source components styled with the project's design system, persistent local Firestore caching with multi-tab coordination, and cookie-based internationalization synchronized with user profile preferences.

From the learner's perspective:
- Authentication is resilient and friction-free: users can sign in using standard email or federated identity flows, with automatic, transparent fallback from blocked popups to redirect-based completion, accompanied by localized error alerts if unexpected issues arise.
- Data persistence is zero-latency and offline-first: creating study spaces, recording question attempts, and browsing study materials resolves instantly from local persistent storage, updating concurrently across multiple open tabs and silently synchronizing with the cloud once network connectivity is present.
- Localization is clean and automatic: learners enjoy full translation across English, Brazilian Portuguese, and Spanish with clean, un-prefixed canonical URLs. Language preferences synchronize smoothly across the user's session, authentication transactional notifications, and profile data, while core system domain identifiers remain canonical and consistent.
- Local development and automated testing execute entirely offline using the local Firebase emulator suite.

## User Stories

1. As a learner, I want to access a dedicated login and registration interface, so that I can securely authenticate with my account credentials.
2. As a learner, I want to see authentication screens rendered using the application's native design system and visual styling, so that my login experience feels cohesive with the rest of the study platform.
3. As a learner, I want my authentication session to persist across page reloads and browser restarts, so that I do not have to log in every time I resume studying.
4. As a learner, I want to sign in using federated third-party identity providers via a popup window, so that I can quickly authenticate without creating a new password.
5. As a learner using a browser with aggressive popup blocking, I want the application to automatically transition to a redirect authentication flow when popups are blocked, so that I can successfully log in without being stranded.
6. As a learner in an environment with restricted iframe permissions, I want the authentication flow to recover automatically via redirect, so that iframe communication limitations do not prevent me from signing in.
7. As a learner who closes an authentication popup prematurely, I want clear and non-intrusive feedback, so that I understand why the sign-in was canceled and can retry.
8. As a learner encountering an unrecoverable authentication error, I want to see a clear, localized error message, so that I understand what went wrong and how to proceed.
9. As a learner navigating unauthenticated areas of the platform, I want the application to default to my device's preferred language, so that I can read the initial interface comfortably.
10. As a learner, I want to view all application routes using clean, un-prefixed URLs (e.g., `/`, `/login`, `/dashboard`), so that deep links, bookmarks, and canonical paths remain simple and shareable.
11. As a learner, I want to switch my preferred language between English, Brazilian Portuguese, and Spanish, so that the entire user interface adapts to my language choice.
12. As a learner, I want my chosen language preference to be saved in a cookie, so that server-rendered pages and components render in my chosen language on subsequent requests.
13. As an authenticated learner, I want my language preference to synchronize with my user profile document and authentication profile, so that automated emails, notifications, and cross-device sessions respect my selected language.
14. As an authenticated learner, I want my saved language preference to be applied automatically whenever I log in on a new device or browser session.
15. As a learner, I want system entity names and technical identifiers (such as space identifiers and entity types) to remain canonically consistent under the hood, so that localization changes never corrupt or alter underlying domain data.
16. As a learner, I want to create and organize study spaces, so that I can group my exam preparation material effectively.
17. As a learner answering exam questions, I want my question attempts to be recorded instantly with zero perceived latency, so that my study rhythm is never interrupted by network delays.
18. As a learner studying on an unreliable or offline connection, I want to continue browsing study spaces and answering questions, so that my study session is never interrupted by network outages.
19. As a learner who worked offline, I want my pending question attempts and space updates to automatically synchronize to the cloud as soon as my internet connection is restored, so that my progress is securely saved.
20. As a learner with multiple browser tabs open to the study platform, I want updates made in one tab (such as completing an attempt or modifying a study space) to reflect immediately across all tabs, so that my view is always consistent.
21. As a learner in private browsing mode or a browser with restricted persistent storage, I want the application to fall back gracefully to in-memory persistence without crashing, so that I can still complete my study session.
22. As a developer, I want all local authentication and database calls to route through local emulator instances during development and automated testing, so that work can be performed completely offline without cloud dependencies.
23. As a developer, I want pre-seeded emulator test accounts available locally, so that automated and manual authentication test flows execute deterministically.
24. As a developer, I want a single centralized database entry point and a centralized authentication provider, so that data access and identity logic are not scattered across ad-hoc modules.
25. As a developer, I want to discover and install upstream Firebase UI components directly through the official `@firebase` shadcn registry, so that the project maintains an authoritative upstream reference implementation.
26. As a developer, I want upstream reference components placed in a dedicated reference directory (`src/components/firebase/`) protected by project guards against modification, so that the upstream code serves as an immutable, trustworthy reference without accidental drift.

## Implementation Decisions

### Firebase Authentication, Upstream Reference Registry, and Design-System UI Integration
- Custom Registry Configuration: declare the `@firebase` registry namespace in the project component configuration:
  ```json
  {
    "registries": {
      "@firebase": "https://firebaseopensource.com/r/{name}.json"
    }
  }
  ```
- Upstream Component Fetching & Reference Directory: upstream components listed and added via the shadcn CLI (`pnpm dlx shadcn@latest list @firebase`) are located in a dedicated reference directory `src/components/firebase/`.
- Strict Reference-Only Guard: automated project guards enforce that `src/components/firebase/` is strictly immutable and reference-only. Neither application feature code, developers, nor automated agents may modify files in this directory.
- Application-Owned Component Layer: production auth screens, dialogs, cards, and forms live in `src/components/notes-app/`. They compose project-owned shadcn Base Nova / Base UI primitives, align with application coding standards, and adapt behaviors from the reference components without mutating the reference files.
- Centralized authentication provider wrapping the root component tree, providing reactive authentication state and current user identity via standard context and custom hooks.
- Dedicated authentication route boundaries to handle unauthenticated entry points and login flows.

### Resilient Authentication Fallback and Error Observability
- Automatic popup-to-redirect escalation: when popup sign-in encounters recoverable environment barriers (such as popup blockers, closed popups, or cross-origin iframe restrictions common in emulator or sandboxed contexts), the authentication flow automatically initiates redirect sign-in.
- Redirect result resolution on root initialization to cleanly complete the authentication handshake after the browser returns from redirect.
- Centralized error tracking and alerting: non-recoverable errors are logged to error capture facilities and displayed to the user as accessible, localized banner alerts.

### Cookie-Driven Internationalization and Firebase Synchronization
- Request configuration driven by an HTTP cookie without URL routing prefixes, keeping application routes clean and uniform.
- Default fallback locale set to English, with initial first-class support for Brazilian Portuguese (`pt-BR`) and Spanish (`es`).
- Guest sessions initialize authentication language using device settings as a graceful default.
- Authenticated language preference synchronization: changing locale sets the request cookie, updates the authentication client instance language code, and persists the preference to the user profile document in the database.
- Strict separation between localized UI display strings and canonical domain identifiers: persisted entities, database attributes, and domain vocabulary remain in canonical English.

### Native Firestore Persistence and Multi-Tab Local Cache
- Single source of truth database export initializing the native Firestore SDK.
- Browser persistence configured with persistent local cache and persistent multi-tab manager backed by IndexedDB, providing zero-latency reads/writes and multi-tab synchronization.
- Resilient initialization fallback: in server-side rendering contexts or environments where IndexedDB is inaccessible (e.g., restricted private browsing), initialization gracefully falls back to memory caching or default instances.
- Seamless emulator connection logic that transparently targets local emulator ports when running in development or testing modes, with idempotent guard rails against hot-module reloading.
- Real-time snapshot listeners and optimistic mutations across data access modules.

## Testing Decisions

### What Makes a Good Test
- Tests must verify external observable user behavior rather than internal SDK details or private state.
- Tests must interact with the application through standard user-facing controls (clicking buttons, entering form data, observing rendered text and translated labels) and real network/storage seams.
- Tests should avoid mocking framework internals or SDK methods whenever a real running emulator seam is available.

### Testing Seams and Strategy
- **Primary Seam: End-to-End Browser Seam via Playwright against Local Firebase Emulators**
  - This is the highest and most comprehensive seam in the architecture.
  - The application runs connected to the local Firebase Auth Emulator and Firestore Emulator with pre-seeded accounts.
  - Playwright browser contexts exercise:
    - User sign-up, sign-in, and sign-out journeys.
    - Popup blocker resilience and redirect completion.
    - Offline operations and reconnection synchronization using simulated offline network conditions.
    - Multi-tab synchronization by opening two concurrent pages in the same browser context and verifying real-time mutation updates across tabs.
    - Locale switching and persistence, verifying that setting the locale updates the interface without URL path alteration and persists across page reloads.
- **Secondary Seam: Unit & Integration Seam via Vitest**
  - Focused testing of request configuration and cookie parsing logic.
  - Verification of Firestore initialization fallback behavior under simulated environments where IndexedDB is unavailable (SSR and memory fallback).
  - Validation of translation dictionaries to ensure completeness of keys across English, Brazilian Portuguese, and Spanish.

### Prior Art
- Existing smoke tests in `tests/unit/smoke.test.ts` and `tests/e2e/home.spec.ts`.
- Playwright Chromium configuration defined in `playwright.config.ts`.

## Out of Scope

- Implementing third-party OAuth providers other than those configured in the emulator test environment (e.g., external production Apple or Microsoft SAML integrations).
- Implementing full-text search indexing services (e.g., Algolia or Elasticsearch integration).
- Real-time collaborative multi-user presence or cursor tracking.
- Audio or video media upload and streaming infrastructure.
- Payment gateway integrations or subscription billing management.

## Further Notes

- The feature respects domain entities and vocabulary defined in `GLOSSARY.md` (e.g., Space, Exam, Question, Attempt).
- Implementation must comply with repository coding rules: Server Components by default, minimal `"use client"` leaves, Biome formatting, strict TypeScript, and no hardcoded machine paths.
