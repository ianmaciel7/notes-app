## Context

Capacities documents a hosted Streamable HTTP MCP server with search/read/create/update/append tools and explicit limits around whole-type enumeration. Primary references: `https://docs.capacities.io/developer/model-context-protocol` and `https://docs.capacities.io/reference/ai-chat-connectors`.

Notes App will implement its own MCP server and tool schemas over Notes App services; exact vendor tool internals are not copied.

## Goals / Non-Goals

**Goals:** authenticated Space-scoped MCP, semantic high-level tools, bounded responses, idempotent writes, auditability, safety.

**Non-Goals:** unrestricted DB queries/code execution, implicit whole-Space enumeration, or use as internal sync protocol.

## Decisions

- Tools call application services rather than repositories directly.
- Search-first workflows are intentional; whole-dataset operations require a separately specified bounded capability.
- MCP permissions map to existing Space/service auth and may add tool-level policy.
- Writes carry idempotency/audit metadata and cannot weaken authorization based on retrieved content.

## Risks / Trade-offs

- Prompt injection requires strict schemas/scopes/confirmation and treating retrieved content as data.
- Result sizes are capped to protect clients and privacy.

## Migration Plan

1. Define transport/auth/tool registry/schemas/errors/bounds/audit/idempotency.
2. Implement read-only search/get-content/type-shape/link tools.
3. Add create/append/update/Daily Note/task tools with scopes.
4. Add rate limits/audit/security and MCP interoperability tests.

## Open Questions

None for planning.
