# Architecture Decision Records

ADRs preserve durable architecture decisions and their history.

## Status rule

- **Accepted**: active in the current architecture.
- **Deprecated**: retained for historical context but not active on `dev`.
- **Superseded**: replaced by a newer ADR.
- **Proposed**: not yet adopted.

A deprecated ADR must not be treated as current implementation merely because
its original decision text remains in the repository.

## Decision log

| ADR | Decision | Status | Date |
| --- | --- | --- | --- |
| [0001](./0001-bootstrap-next-app.md) | Bootstrap Next.js / TypeScript / Tailwind / Biome / React Compiler | Accepted | 2026-10-05 |
| [0002](./0002-adopt-shadcn-base-nova-component-system.md) | Adopt shadcn Base Nova / Base UI | Accepted | 2026-10-05 |
| [0003](./0003-install-shadcn-typeset.md) | Install shadcn/typeset | Accepted | 2026-10-05 |
| [0004](./0004-adopt-firebase-ui-components.md) | Firebase OSS auth UI components | Deprecated | 2026-09-28 |
| [0005](./0005-adopt-firebase-auth-with-local-emulator.md) | Firebase Auth emulator architecture | Deprecated | 2026-09-28 |
| [0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) | FirebaseUI v7 auth resilience | Deprecated | 2026-09-28 |
| [0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md) | next-intl + Firebase locale sync | Deprecated | 2026-09-28 |
| [0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md) | Firestore persistent local cache | Deprecated | 2026-09-29 |

## Current architecture

For current implementation truth, read:

- [../../ARCHITECTURE.md](../../ARCHITECTURE.md)
- [../../CODING_STANDARDS.md](../../CODING_STANDARDS.md)
- [../guards/NEXTJS-GUARD-COVERAGE.md](../guards/NEXTJS-GUARD-COVERAGE.md)
- [../guards/SHADCN-GUARD-COVERAGE.md](../guards/SHADCN-GUARD-COVERAGE.md)

## ADR format

Each new ADR should contain:

- title;
- status;
- date;
- context;
- decision;
- consequences;
- implementation/verification references when applicable.
