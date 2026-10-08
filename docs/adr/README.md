# Architecture Decision Records

ADRs preserve durable architecture decisions and their history.

## Status rule

- **Accepted**: adopted decision, whether it is fully delivered, partly delivered,
  or still a target design.
- **Deprecated**: retained for historical context but not active on `dev`.
- **Superseded**: replaced by a newer ADR.
- **Proposed**: not yet adopted.

Implementation is recorded separately in each ADR's **Implementation** field
and in the decision log as **Implemented**, **Partially implemented**, or
**Not started**. The **Current State** section provides the supporting detail.
Check it and the source tree before treating an accepted ADR as built.

## Decision log

| ADR | Decision | Status | Implementation | Date |
| --- | --- | --- | --- | --- |
| [0001](./0001-bootstrap-next-app.md) | Bootstrap Next.js / TypeScript / Tailwind / Biome / React Compiler | Accepted | Implemented | 2026-10-05 |
| [0002](./0002-adopt-shadcn-base-nova-component-system.md) | Adopt shadcn Base Nova / Base UI | Accepted | Implemented | 2026-10-05 |
| [0003](./0003-install-shadcn-typeset.md) | Install shadcn/typeset | Accepted | Implemented | 2026-10-05 |
| [0004](./0004-adopt-firebase-ui-components.md) | Firebase OSS auth UI components | Accepted | Implemented | 2026-09-28 |
| [0005](./0005-adopt-firebase-auth-with-local-emulator.md) | Firebase Auth emulator architecture | Accepted | Implemented | 2026-09-28 |
| [0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) | FirebaseUI v7 client architecture with redirect-only OAuth | Accepted | Implemented | 2026-09-28 |
| [0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md) | next-intl + Firebase locale sync | Accepted | Partially implemented | 2026-09-28 |
| [0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md) | Firestore persistent local cache | Accepted | Not started | 2026-09-29 |

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
- implementation;
- date;
- context;
- decision;
- consequences;
- implementation/verification references when applicable.
