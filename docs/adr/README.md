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
| [0006](./0006-adopt-firebase-ui-v7-and-auth-resilience.md) | FirebaseUI v7 client architecture with popup OAuth | Accepted | Implemented | 2026-09-28 |
| [0007](./0007-adopt-cookie-based-next-intl-with-firebase-sync.md) | next-intl + Firebase locale sync | Accepted | Partially implemented | 2026-09-28 |
| [0008](./0008-adopt-native-firebase-firestore-with-persistent-local-cache.md) | Firestore persistent local cache | Accepted | Not started | 2026-09-29 |

## Source review — 2026-10-07

All eight records were reconciled against available files on the remote
`dev` branch. The original decision dates are retained; the
`Current State` sections describe what is present now, not what was
envisioned when each decision was made.

- **0001–0003:** framework, Base UI/shadcn, and Typeset foundations are
  present in configuration and implementation files.
- **0004:** the 30 Firebase UI reference files are tracked by the immutable
  baseline manifest. This does not enable 30 different sign-in flows.
- **0005–0006:** the local Auth Emulator architecture, server session
  boundary, popup OAuth, and application-owned auth components
  are present. Server-session-first logout and associated regression tests
  are documented. Production identity-provider behavior is not certified.
- **0007:** locale negotiation and Firebase UI translation synchronization
  exist, but full application localization and cross-device preference
  sync are unfinished.
- **0008:** Firestore emulator configuration exists, but the Firestore
  client/data layer and persistent cache are **not implemented**.

**Verification level:** source inspection only for this documentation update.
No local dependency installation, Biome, TypeScript, Vitest, Playwright, or
Next.js production build was executed. The CI result was not established.
The words *Implemented* and *Partially implemented* indicate the documented
source state, not a new claim that all quality gates passed.

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
