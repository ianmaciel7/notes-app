## Why

AI clients benefit from high-level semantic tools rather than composing low-level REST calls. Notes App should expose a deliberately bounded, authenticated MCP surface over the same application services and Space authorization model.

## What Changes

- Add Streamable HTTP MCP transport with Space-scoped read/write grants.
- Add high-level search/read/type-shape/link/create/append/update/Daily Note/task tools with bounded results and idempotent writes.
- Add tool schemas, audit metadata, rate limits, and prompt-injection/tool-abuse defenses; whole-Space enumeration is not implied.

## Capabilities

### New Capabilities

- `developer-platform/mcp-server`: Authenticated high-level MCP tools over Notes App services with bounded semantics and tool safety.

### Modified Capabilities

- None.

## Impact

- Priority: **P10**.
- Depends on `add-public-api` and `add-ai-assistant` service/security foundations.
