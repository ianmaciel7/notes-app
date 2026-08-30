## Context

The code currently uses `50 * 1024 * 1024`. The reference states “up to 100 MB per file.” The implementation must choose one unit convention and test it explicitly instead of using an ambiguous label.

## Decision

Notes App defines `MAX_MEDIA_FILE_BYTES = 100_000_000` for reference-aligned decimal megabytes. A file whose byte length is less than or equal to that value is within the default product policy; a file one byte larger is rejected before durable write.

Deployments may inject a lower operational maximum. The effective limit is the minimum of product policy, deployment configuration, and available storage. User-facing errors identify whether rejection came from file policy or local/browser quota.

## Integration

The same policy object is consumed by direct media creation, clipboard/paste, import jobs, retry/resume, drag/drop, and visible file pickers. No surface maintains a separate size constant or copy.

Validation occurs before hashing or durable writes when byte length is known. Streamed/unknown lengths enforce a bounded read and abort safely. A failed limit check leaves no asset record or blob.

## Migration

Existing assets above the old 50 MiB default remain readable. The change expands acceptance and requires no data rewrite. Pending jobs created under the old limit can be retried under the current effective policy.

## Scope Boundary

The documented Basic monthly upload and total-storage quotas are not introduced here because Notes App has no equivalent plan/account quota model. They remain a separate future capability, not a hidden per-file check.

## Testing

Tests cover 99,999,999; 100,000,000; and 100,000,001 bytes, injected lower limits, browser quota errors, abort, retry/reload, import/direct parity, localized messages, and existing-asset reads.
