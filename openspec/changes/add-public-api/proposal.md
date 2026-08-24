## Why

External automations need a stable versioned developer API over the same Notes App Structures, properties, objects, blocks, search, Daily Notes, tasks, and media metadata after the core sync/account model is stable.

## What Changes

- Add a versioned Space-scoped REST API backed by application services.
- Add personal API tokens and OAuth Authorization Code + PKCE with least-privilege scopes/revocation/refresh.
- Define stable errors, pagination, rate-limit metadata, revisions/conflicts, idempotency, OpenAPI, and a validated TypeScript client.

## Capabilities

### New Capabilities

- `developer-platform/public-api`: Versioned REST resources, auth/scopes, operational contracts, OpenAPI, and SDK parity.

### Modified Capabilities

- None.

## Impact

- Priority: **P10**.
- Depends on `add-offline-sync` and `add-account-and-spaces`.
- It is Notes App-native and does not claim wire compatibility with Capacities.
