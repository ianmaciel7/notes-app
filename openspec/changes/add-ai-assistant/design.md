## Context

Capacities documents contextual AI chat, commands, selected context, provider options/BYOK, property/tag suggestions, and media analysis. Primary references: `https://docs.capacities.io/reference/ai-assistant`, `https://docs.capacities.io/more/ai-privacy`, and `https://docs.capacities.io/reference/media-analysis`.

The private prompts, ranking, embeddings, and model orchestration are not public and are not parity facts.

## Goals / Non-Goals

**Goals:** explicit Space-scoped context, provider-neutral streaming/cancel, provenance, guarded tools, opt-in suggestions, secure configuration.

**Non-Goals:** implicit whole-Space data transmission, private prompt replication, or unrestricted autonomous write agents.

## Decisions

- A provider-neutral gateway owns model capabilities, streaming, cancellation, typed errors, and usage.
- Each request records explicit object/block/query/search context; normal app use sends nothing to AI providers.
- Tool calls invoke the same application services/Space validation as UI/API writes and respect confirmation/idempotency policies.
- Provider secrets live in secure settings and are excluded from content, exports, search indexes, and logs.

## Risks / Trade-offs

- Prompt injection requires untrusted-context separation and hard tool scopes.
- Ambiguous retries must never duplicate writes.
- Privacy requires context minimization and clear provider disclosure.

## Migration Plan

1. Define chat/message/context/tool/provider settings and threat model.
2. Implement mock gateway and streaming/cancel/error contract tests.
3. Add read-only contextual chat/provenance.
4. Add reviewed text commands and constrained write tools.
5. Add provider/BYOK adapters and suggestion/auto-fill flows after security review.

## Open Questions

None for planning; concrete providers are apply-time adapters.
