## Why

Image, PDF, Audio, and File objects currently persist metadata while browser preview URLs are ephemeral. Durable media requires a real asset model and binary storage before reload, import/export, offline sync, or media analysis can work reliably.

## What Changes

- Add stable MediaAsset records and durable local binary storage outside JSON snapshots.
- Add validation, hashing, progress/cancellation, preview/download, replacement, reference-safe deletion, and garbage collection.
- Add reusable Image/PDF/Audio/File renderers and a remote-storage adapter boundary for later sync.

## Capabilities

### New Capabilities

- `domain/media-storage`: Durable media assets, local binary persistence, reference lifecycle, and media-family UI contracts.

### Modified Capabilities

- None.

## Impact

- Priority: **P8**.
- Depends on typed properties and stable block documents.
- AI media analysis and remote media sync remain later changes.
