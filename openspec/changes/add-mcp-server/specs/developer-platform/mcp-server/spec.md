## ADDED Requirements

### Requirement: Authenticated Space-scoped MCP
Every MCP session/tool call SHALL be limited to its authorized Space and read/write capabilities.

#### Scenario: Read-only client calls write tool
- **WHEN** the grant lacks write permission
- **THEN** the tool SHALL fail structurally with no mutation.

### Requirement: High-level bounded tools
The server SHALL expose bounded search/read/type-shape/link/create/append/update/Daily Note/task tools through application services.

#### Scenario: Search identifies an object
- **WHEN** bounded search succeeds
- **THEN** results SHALL include stable ids and enough metadata for a follow-up read without implying complete enumeration.

### Requirement: No implicit unbounded enumeration
MCP tools SHALL not claim reliable whole-Space enumeration unless a separately specified paginated capability exists.

#### Scenario: Client requests every object through bounded search
- **WHEN** the request exceeds tool semantics
- **THEN** the server SHALL return a documented limit/unsupported result rather than claim completeness.

### Requirement: Tool safety and idempotency
Write tools SHALL validate schemas/scopes/policy and SHALL prevent duplicate logical effects on retries.

#### Scenario: Retrieved note contains malicious instructions
- **WHEN** content attempts to override tool policy
- **THEN** authorization and confirmation requirements SHALL remain unchanged.
