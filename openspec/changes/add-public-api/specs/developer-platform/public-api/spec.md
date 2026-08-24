## ADDED Requirements

### Requirement: Versioned Space-scoped REST API
Every request SHALL be authorized to an explicit Space/scope and incompatible API versions SHALL fail predictably.

#### Scenario: Wrong Space resource is requested
- **WHEN** the credential is not authorized for the target Space
- **THEN** access SHALL be rejected without revealing private content.

### Requirement: Least-privilege API authentication
Third-party clients SHALL use documented token/OAuth flows with read/write/offline scopes, secure refresh/revocation, and no content-store credential leakage.

#### Scenario: Read-only grant writes
- **WHEN** a credential without write scope attempts mutation
- **THEN** the API SHALL return a stable insufficient-scope error and no side effect.

### Requirement: Stable operational contracts
The API SHALL define machine-readable error codes, pagination, rate-limit metadata, idempotency, and concurrency/conflict semantics.

#### Scenario: Create retry reuses idempotency key
- **WHEN** a client repeats an uncertain request
- **THEN** the original logical result SHALL be returned instead of creating a duplicate.

### Requirement: OpenAPI/server/client parity
OpenAPI, server behavior, examples, and the supported TypeScript client SHALL be checked against one canonical contract.

#### Scenario: Public schema changes
- **WHEN** route/property/error shapes change
- **THEN** conformance checks SHALL fail until versioning/OpenAPI/client fixtures agree.
