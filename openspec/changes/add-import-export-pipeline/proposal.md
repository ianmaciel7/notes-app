## Why

Narrow text/Markdown import is not enough for a durable knowledge system. Imports need staged mapping/link/media resolution and exports need a lossless Notes App-native format plus human-readable reduced formats whose limitations are explicit.

## What Changes

- Add staged import jobs with parse/validate/map/preview/commit, errors, checkpoints, and stable external-id mapping.
- Add progressive Markdown/text/HTML/CSV/media/folder/archive bulk ingestion with security limits and link resolution.
- Add versioned native workspace export plus Markdown/CSV/media reduced exports with explicit lossiness.

## Capabilities

### New Capabilities

- `domain/import-export-pipeline`: Safe staged import, id/link/media mapping, resumable bulk jobs, native backups, and reduced exports.

### Modified Capabilities

- None.

## Impact

- Priority: **P8**.
- Depends on typed properties, identities, stable blocks, linking, and media storage.
