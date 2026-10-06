# ADR 0004: Adopt Firebase Open Source Auth UI Components

## Status

Accepted

## Date

2026-09-28

## Current State (2026-10-06)

This ADR is accepted as the canonical architectural decision for Firebase Open Source Auth UI components. The architecture is verified and aligned with the project technical standards.

## Context

The exam-study platform foundation requires production-ready, accessible authentication and multi-factor authentication UI behavior integrated with `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.

Key requirements include:
1. Maintaining standard, accessible authentication flows conforming to WCAG and WAI-ARIA authoring practices.
2. Avoiding duplicate local vendor mirrors and parallel code trees that drift from upstream packages.
3. Enabling static analysis tools (Biome, TypeScript, dependency-cruiser, and project guards) to evaluate auth components as standard application code.
4. Seamlessly integrating authentication screens with the project's shadcn and Base UI design system.

## Decision

The application consumes `@firebase-oss/ui-core` and `@firebase-oss/ui-react` directly and implements application-facing auth screens and forms in `src/components/notes-app/` using the repository's shadcn/Base UI primitives.

Key architectural rules and structure:
- **Direct Package Consumption**: Firebase authentication behavior and state machines are sourced directly from `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.
- **Application Component Ownership**: Auth UI screens, forms, cards, and field groups consumed by application routes live in `src/components/notes-app/` and follow [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md).
- **No Local Vendor Mirror**: Redundant vendor mirrors (such as the earlier `src/components/firebase/`) are removed to eliminate unused code, maintenance overhead, and copy/paste drift. Upstream diffs and documentation serve as upgrade references rather than persistent in-tree duplicates.
- **Architectural Alignment**: This design integrates with the emulator architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), the fallback strategy in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md), and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Consequences

### Positive Outcomes

- Keeps Firebase authentication behavior on supported, tested package APIs.
- Maintains a single application-owned implementation of each auth screen and form.
- Eliminates drift and copy/paste duplication between vendor templates and application components.
- Enables Biome, TypeScript, dependency-cruiser, jscpd, and project guards to evaluate project-owned source consistently.

### Trade-offs and Considerations

- Updating to a new Firebase UI package version may require adapting `src/components/notes-app/` components directly.
- Registry examples remain useful as upstream references, but are not committed as a parallel source tree in the repository.
