## Why

AI should be a layer over canonical objects, blocks, search, relations, and media—not a parallel persistence path. Context, provider use, tool writes, provenance, and user confirmation need explicit contracts before model integration.

## What Changes

- Add persistent AI Chat/message/context records and a provider-neutral streaming gateway with cancellation, typed errors, usage metadata, and BYOK adapters.
- Add explicit object/block/query/search context and provenance.
- Add reviewed AI text commands, constrained application-service tools, and opt-in property/tag suggestions/auto-fill.

## Capabilities

### New Capabilities

- `domain/ai-assistant`: Contextual AI chat, provider gateway, guarded tools, provenance, privacy, and proposed edits.

### Modified Capabilities

- None.

## Impact

- Priority: **P10**.
- Depends on query/search, linking, media, and offline-sync foundations.
- Does not reproduce private Capacities prompts/retrieval/ranking and does not enable unrestricted autonomous background agents.
