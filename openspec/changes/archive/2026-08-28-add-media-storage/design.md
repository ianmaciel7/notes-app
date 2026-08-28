## Context

Capacities documents media upload and Image/PDF/Audio/File object behavior. Primary references: `https://docs.capacities.io/misc/media-upload`, `https://docs.capacities.io/reference/basic-types/images`, `/pdfs`, `/audio`, and `/files`.

The public/archived sources do not establish the private storage engine, so Notes App defines a clean MediaStorageAdapter rather than assuming S3 or another backend.

## Goals / Non-Goals

**Goals:** reload-safe media, separate binary/metadata storage, integrity, reference-safe cleanup, accessible previews.

**Non-Goals:** AI analysis or remote cloud media synchronization.

## Decisions

- Binary bytes live outside workspace JSON in a dedicated local blob adapter; objects/properties reference MediaAsset ids.
- Content hashes provide integrity/dedup support without making filename identity canonical.
- Physical deletion occurs only after all canonical references are gone and GC confirms it.
- Temporary object URLs are rendering details regenerated from durable assets.

## Risks / Trade-offs

- Browser quota limits require recoverable errors and size policies.
- Uploaded content is untrusted; preview paths must not execute arbitrary content.

## Migration Plan

1. Define asset metadata/reference contracts and local storage adapter.
2. Migrate existing metadata-only File states explicitly.
3. Implement durable blob write/read/delete/hash/progress/cancel.
4. Add media renderers and reference-aware replace/remove/GC.
5. Verify reload, quota, duplicate, and mobile behavior.

## Open Questions

None for planning.
