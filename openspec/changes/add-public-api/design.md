## Context

The Capacities developer portal documents a current REST API, per-Space access, personal tokens/OAuth+PKCE, versioning, rate limiting, errors, and concurrency. These are useful external concepts, not a mandate to clone exact private quotas/routes. Primary references: `https://developers.capacities.io/api/overview`, `/authentication`, `/versioning`, `/rate-limiting`, `/errors`, and `/concurrency`.

## Goals / Non-Goals

**Goals:** one service-layer API, Space-scoped least privilege, versioned contracts, stable machine errors, pagination/rate limits/idempotency/concurrency, OpenAPI/client parity.

**Non-Goals:** arbitrary database access, undocumented Capacities compatibility, or general webhooks without a later spec.

## Decisions

- HTTP handlers call existing application commands/queries; no API-only business logic fork.
- Tokens/OAuth grants are scoped to a Space and explicit read/write/offline permissions.
- Clients pin an API version and branch on stable error codes, not messages.
- Dangerous retries use idempotency keys; record revisions/conditional conflict semantics are explicit instead of silent lost updates.

## Risks / Trade-offs

- Token leakage requires hashed/secure token storage and redacted logs.
- Contract drift is prevented by OpenAPI/server/SDK conformance tests.

## Migration Plan

1. Define public resources/version/errors/pagination/idempotency/concurrency/scopes in OpenAPI.
2. Implement personal token and OAuth+PKCE services.
3. Add read/search/Structure/object/block/Daily Note/task/media-metadata endpoints through application services.
4. Add write/rate-limit/conflict behavior and SDK/examples.
5. Complete API security/versioning review before stability claims.

## Open Questions

None for planning.
