# 0004. Adopt Firebase Open Source Auth UI Components

> **Current state (2026-10-06): Deprecated on the current `dev` branch.**
> The packages, modules, and runtime architecture described below are not
> present in the current implementation. This ADR is retained as historical
> context only. Re-adoption requires a new decision or an explicit status
> change backed by implementation and tests.

- **Status:** Deprecated
- **Date:** 2026-09-28
- **Canonical Owner:** `ARCHITECTURE.md`

## Context and Problem Statement

We needed production-ready, accessible authentication and multi-factor authentication UI behavior integrated with `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.

## Decision Outcome

The application consumes `@firebase-oss/ui-core` and `@firebase-oss/ui-react` directly and implements the application-facing auth screens and forms in `src/components/notes-app/` using the repository's shadcn/Base UI primitives.

The repository does not retain a second local copy of the Firebase registry components. The earlier `src/components/firebase/` mirror was removed after the application adapters became canonical because keeping both implementations created unused code and systematic duplication without providing a runtime boundary.

### Positive Consequences

- Keeps Firebase auth behavior on the supported package APIs.
- Maintains one application-owned implementation of each auth screen and form.
- Removes drift and copy/paste duplication between vendor templates and application components.
- Lets Biome, TypeScript, dependency-cruiser, jscpd, and project guards evaluate the same project-owned source consistently.

### Tradeoffs

- Updating to a new Firebase UI package version may require adapting `src/components/notes-app/` directly.
- Registry examples remain useful as upstream references, but are not committed as a parallel source tree.

## Architectural Rules and Invariants

- Auth UI consumed by routes lives in `src/components/notes-app/`.
- Firebase UI behavior comes from `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.
- Do not add a persistent local vendor mirror solely to preserve upstream registry output; use upstream diffs/reference material when upgrading instead.

## Related References and Control Documents

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) - Section 3 (Technology Decisions)
- [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md) - Adopt Firebase Authentication with Local Emulator
- [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) - Adopt FirebaseUI v7 Canonical Architecture and Resilient Auth Fallback
- [`CONVENTIONS.md`](../../CONVENTIONS.md) - Application component conventions
