# Architecture Decision Records (ADRs)

This directory documents key architectural decisions made throughout the lifecycle of the notes application.

## Decision Log

| ADR | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](./0001-bootstrap-next-app.md) | [Bootstrap Project with Next.js, TypeScript, Tailwind CSS, Biome, and React Compiler](./0001-bootstrap-next-app.md) | Accepted | 2026-10-05 |
| [0002](./0002-adopt-shadcn-base-nova-component-system.md) | [Adopt shadcn Base Nova UI Component System with Pointer Cursors](./0002-adopt-shadcn-base-nova-component-system.md) | Accepted | 2026-10-05 |
| [0003](./0003-install-shadcn-typeset.md) | [Install shadcn/typeset Markdown Typography System](./0003-install-shadcn-typeset.md) | Accepted | 2026-10-05 |
| [0004](./0004-adopt-firebase-ui-components.md) | [Adopt Firebase Open Source Auth UI Components](./0004-adopt-firebase-ui-components.md) | Accepted | 2026-09-28 |
| [0005](./0005-adopt-firebase-auth-with-local-emulator.md) | [Adopt Firebase Authentication with Local Emulator](./0005-adopt-firebase-auth-with-local-emulator.md) | Accepted | 2026-09-28 |
| [0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) | [Adopt FirebaseUI v7 Canonical Architecture and Resilient Auth Fallback](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) | Accepted | 2026-09-28 |
| [0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md) | [Adopt Cookie-Based next-intl Architecture and Firebase Locale Preference Synchronization](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md) | Accepted | 2026-09-28 |
| [0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md) | [Adopt Native Firebase Firestore with Persistent Local Cache](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md) | Accepted | 2026-09-29 |


## Format Guidelines

Each ADR should follow the standard structure:
- **Title**: Sequential identifier and clear summary of the decision.
- **Status**: Proposed, Accepted, Deprecated, or Superseded.
- **Date**: YYYY-MM-DD date when the record was accepted or proposed.
- **Context**: Problem statement, constraints, requirements, and background.
- **Decision**: The selected approach, implementation choices, and configurations.
- **Consequences**: Positive outcomes, operational impacts, trade-offs, and considerations.
