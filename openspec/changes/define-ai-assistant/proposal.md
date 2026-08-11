## Why

AI assistant behavior has separate trust, provider, retrieval, streaming, and confirmation boundaries. It should be planned independently from graph, editor, and sync.

## What Changes

- Define context-aware AI conversation.
- Define provider and retrieval trust boundaries.
- Define input modes and mutation safety.

## Impact

- Planning only; no runtime code changes in this change.
- Depends conceptually on authorization, object model, and relation/search indexes.
