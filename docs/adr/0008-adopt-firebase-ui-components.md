# 0008. Adopt Firebase Open Source Auth UI Components

- **Status:** Accepted
- **Date:** 2026-09-28
- **Canonical Owner:** `ARCHITECTURE.md`

## Context and Problem Statement

We needed production-ready, accessible authentication and multi-factor authentication UI components integrated with `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.

## Decision Outcome

We integrated the Firebase Open Source UI components into `src/components/firebase` via the `@firebase` registry (`https://firebaseopensource.com/r/{name}.json`), providing modular auth flows (sign-in, sign-up, phone auth, email link, OAuth, SMS MFA, and TOTP MFA) matching our Base UI / shadcn design system while skipping linter and duplicate checks on external vendor templates.

### Immutability Rule for Vendor Components

The `src/components/firebase/` directory is treated strictly as an immutable upstream vendor registry drop. Files in `src/components/firebase/` must never undergo direct modifications in the repository. Whenever a component requires adaptation, bug fixing, styling tweaks, or application-specific wiring, developers must copy the component into `src/components/notes-app/` and maintain the customized version there.

### Positive Consequences

- Provides pre-built, standardized authentication UI primitives and auth state handlers.
- Preserves a clean separation between upstream vendor component drops and custom application UI code.
- Accelerates auth implementation while maintaining full styling and behavioral adaptability in `src/components/notes-app/`.

### Negative Consequences

- Code duplication occurs when copying vendor components into `src/components/notes-app/` for customization.

## Architectural Rules and Invariants

- `src/components/firebase/` must remain untouched as an immutable upstream drop.
- All modified, customized, or application-consumed auth screens and forms must reside in `src/components/notes-app/`.

## Related References and Control Documents

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) - Section 3 (Technology Decisions)
- [ADR 0009](./0009-adopt-firebase-auth-with-local-emulator.md) - Adopt Firebase Authentication with Local Emulator
- [ADR 0010](./0010-adopt-firebase-ui-v7-and-auth-resilience.md) - Adopt FirebaseUI v7 Canonical Architecture and Resilient Auth Fallback
- [`CONVENTIONS.md`](../../CONVENTIONS.md) - Vendor component customization guidelines
