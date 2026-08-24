## 0. Evidence and dependency gate

- [ ] 0.1 Complete sync/account-Space prerequisites and re-confirm developer API/auth/version/error/concurrency references.

## 1. Contract/auth

- [ ] 1.1 Author OpenAPI-first resource/version/pagination/revision/idempotency/error/rate-limit/scope contracts and conformance tests.
- [ ] 1.2 Implement per-Space personal tokens and OAuth Authorization Code + PKCE with secure rotation/revocation and security tests.

## 2. Endpoints/client

- [ ] 2.1 Expose Space/Structures/search/object/block/Daily Note/task/media-metadata operations through application services.
- [ ] 2.2 Generate/validate TypeScript client and runnable examples.

## 3. Acceptance

- [ ] 3.1 Test version mismatch, pagination, retries, rate limits, conflicts, refresh/revoke, and cross-Space isolation.
- [ ] 3.2 Run API security review, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
