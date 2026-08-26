## 0. Evidence and dependency gate

- [ ] 0.1 Complete the workspace database before apply and re-confirm Spaces/account/auth references.

## 1. Domain and partitioning

- [x] 1.1 Define AccountId/UserSession/SpaceId/Space and active-space service.
- [x] 1.2 Make entities, Structures, properties, identities, relations/links, blocks, queries/views/search indexes, tasks/dates, media, operations, and sync metadata explicitly Space-scoped.
- [x] 1.3 Add negative cross-Space tests for repository reads, search/query, relation/link targets, media lookup, and sync cursors.
- [x] 1.4 Migrate the current single workspace transactionally into one default Space.

## 2. Session and UI

- [x] 2.1 Define provider-neutral AuthAdapter/session/secret boundary, expiry, sign-out, and offline-cache policy.
- [ ] 2.2 Add Space switch/create/rename/delete/settings flows and destructive confirmations.

## 3. Acceptance

- [ ] 3.1 Browser-test multi-Space isolation, switching, duplicate ids, cross-Space search/relation rejection, sign-out/offline cache, and delete guardrails.
- [ ] 3.2 Run `pnpm verify`, repository/index regressions, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
