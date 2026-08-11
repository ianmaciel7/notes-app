## ADDED Requirements

### Requirement: Next.js App Router As Primary Architecture
The application SHALL treat Next.js App Router conventions as the primary architecture for server rendering, data consumption, mutations, and HTTP surfaces.

#### Scenario: Server-rendered feature reads data
- **WHEN** a page, layout, or Server Component needs server-side data
- **THEN** it calls a server function or server-only DAL function directly instead of making an HTTP request to this application's own Route Handler unless a concrete HTTP boundary is required

### Requirement: Server-Only Data Access Layer
Protected data access SHALL live in server-only modules that import `server-only` and own authentication, authorization, input validation, infrastructure access, and minimal returned data.

#### Scenario: Protected data is read
- **WHEN** a Server Component, Server Action, Server Function, or Route Handler needs protected workspace, user, billing, settings, object, relationship, AI, import/export, or integration data
- **THEN** it uses a server-only DAL function that authenticates the user, authorizes the specific resource, validates inputs, accesses the database/API/Firebase/external service, and returns only the fields required by the caller

#### Scenario: Server-only module is used
- **WHEN** a module imports database clients, Firebase Admin, private API clients, secrets, or permission-sensitive business data
- **THEN** the module imports `server-only` and is not imported by Client Components

### Requirement: Authorization Near Data Access
Authorization for sensitive operations SHALL happen on the server close to the data being accessed or mutated, not only in middleware, route protection, hidden UI, or client-side checks.

#### Scenario: User reaches a protected page
- **WHEN** the page references a specific object, space, collection, relationship, export, integration, or AI retrieval source
- **THEN** the DAL or server operation still verifies authorization for that specific resource before returning or mutating data

### Requirement: Minimal Safe Return Data
Server data access SHALL return minimal safe shapes instead of raw database or provider records when data may cross component, action, route, or client boundaries.

#### Scenario: Caller needs user profile data
- **WHEN** the caller only needs fields such as id, display name, and avatar
- **THEN** the server operation returns only those fields and excludes password hashes, private settings, billing metadata, security flags, internal provider fields, and unrelated records

### Requirement: Focused Server Actions
Server Actions and Server Functions SHALL stay focused on input handling, validation handoff, authorization handoff, server operation calls, revalidation, redirects, and safe result shaping.

#### Scenario: UI submits a mutation
- **WHEN** a form or Client Component invokes a Server Action
- **THEN** the action validates or delegates validation, re-authenticates or delegates authentication, authorizes or delegates authorization, calls the DAL or justified use case, and returns/revalidates/redirects without embedding unrelated infrastructure logic

### Requirement: Route Handlers Only For HTTP Boundaries
Route Handlers SHALL be used only when the application needs an HTTP endpoint, webhook, non-UI response, file/JSON/XML response, external API surface, or client-side parallel non-mutation request.

#### Scenario: Server Component considers fetching internal API
- **WHEN** a Server Component can directly call the underlying server function or DAL
- **THEN** it does not call this application's own Route Handler just to reach the same data

### Requirement: Minimal Client Components
Client Components SHALL be used only for browser-side capabilities such as event handlers, interactive state, effects, browser APIs, client hooks, and interactive UI behavior.

#### Scenario: Component imports server infrastructure
- **WHEN** a component imports database clients, Firebase Admin, private API clients, secrets, or server-only modules
- **THEN** it must remain outside the Client Component module graph

### Requirement: Optional Architecture Patterns Require Justification
Explicit dependency injection, composition roots, ports, interfaces, repositories, and application use cases SHALL be introduced only when they provide a concrete benefit.

#### Scenario: Contributor adds an architectural abstraction
- **WHEN** a change adds a port, interface, repository, use-case layer, explicit dependency factory, or composition root
- **THEN** the change records the reason, such as testability, replaceable infrastructure, multiple implementations, meaningful business logic, transactions, external-provider boundaries, or dependency wiring complexity

#### Scenario: Simple CRUD operation is implemented
- **WHEN** a protected operation is a simple read or mutation without meaningful business workflow or replaceable infrastructure need
- **THEN** a server-only DAL function is sufficient and the implementation does not add controllers, managers, providers, runtime DI containers, command buses, service locators, or repository layers by default

### Requirement: Traditional Runtime DI Containers Are Avoided By Default
The application SHALL avoid runtime dependency injection containers and NestJS-style provider patterns unless an existing justified dependency already requires them.

#### Scenario: Dependency substitution is needed
- **WHEN** a service requires replaceable dependencies for testing or infrastructure variation
- **THEN** the implementation uses explicit typed dependency parameters or a justified server-only composition root instead of a runtime container, service locator, decorators, or reflection-based injection
