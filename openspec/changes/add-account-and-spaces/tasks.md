## 0. Evidence and dependency gate

- [ ] 0.1 Complete `add-workspace-database` before apply and re-confirm Spaces/account/auth references.

## 1. Domain and partitioning

- [ ] 1.1 Define AccountId/UserSession/SpaceId/Space, active-space service, and Space-scoped repository contracts with cross-Space negative tests.
- [ ] 1.2 Migrate the current single workspace transactionally into one default Space.

## 2. Session and UI

- [ ] 2.1 Define provider-neutral AuthAdapter/session/secret boundary, expiry, sign-out, and offline-cache policy.
- [ ] 2.2 Add Space switch/create/rename/delete/settings flows and explicit destructive confirmations.

## 3. Acceptance

- [ ] 3.1 Browser-test multi-Space isolation, switching, duplicate ids, sign-out/offline cache, and delete guardrails.
- [ ] 3.2 Run `pnpm verify`, repository regressions, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
