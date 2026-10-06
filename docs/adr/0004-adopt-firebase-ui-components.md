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

The application configures the official `@firebase` open source registry in `components.json`, fetches all upstream Firebase UI components into a dedicated reference directory `src/components/firebase/`, enforces strict immutability on that reference directory via project guards, and implements application-owned auth screens and forms in `src/components/notes-app/` using the project's shadcn and Base UI primitives.

Key architectural rules and structure:
- **Custom Registry Configuration**: `components.json` declares the `@firebase` registry namespace:
  ```json
  {
    "registries": {
      "@firebase": "https://firebaseopensource.com/r/{name}.json"
    }
  }
  ```
- **Upstream Component Discovery & Reference Directory**: Upstream components are discovered via `pnpm dlx shadcn@latest list @firebase`, added, and isolated under `src/components/firebase/`.
- **Reference-Only Guard & Immutability**: `src/components/firebase/` serves exclusively as an immutable upstream reference. A project guard enforces that files in `src/components/firebase/` must never be modified by application code, developers, or agents.
- **Application Component Ownership**: Application-facing authentication screens, forms, cards, and modal dialogs consumed by routes live in `src/components/notes-app/`. They compose project-owned shadcn Base Nova / Base UI primitives from `src/components/ui/` and follow [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md), referencing `src/components/firebase/` for behavioral parity without mutating the reference baseline.
- **Direct Package Dependencies**: Runtime authentication state machines and hooks are driven by `@firebase-oss/ui-core` and `@firebase-oss/ui-react`.
- **Architectural Alignment**: This design integrates with the emulator architecture in [ADR 0005](./0005-adopt-firebase-auth-with-local-emulator.md), the fallback strategy in [ADR 0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md), and system specifications in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Consequences

### Positive Outcomes

- Provides direct, automated access to official Firebase UI component definitions via the shadcn CLI registry mechanism.
- Establishes `src/components/firebase/` as an immutable upstream baseline, eliminating confusion about what originates from upstream versus project code.
- Guard enforcement prevents unintentional edits and drift in the reference components.
- Keeps application-owned UI in `src/components/notes-app/` cleanly separated, using project design system tokens, Tailwind CSS v4, and Base UI primitives.
- Enables Biome, TypeScript, dependency-cruiser, and project guards to clearly distinguish between reference code and active application code.

### Trade-offs and Considerations

- Upstream reference components in `src/components/firebase/` must be explicitly excluded from application mutation rules and test coverage requirements.
- Any updates from newer upstream releases require re-fetching via the shadcn registry rather than ad-hoc local patching.
