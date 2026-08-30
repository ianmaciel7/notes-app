# Implementation Notes

## Baseline

- Repository: `ianmaciel7/notes-app`
- Base branch: `dev`
- Base commit: `3161872c0b4056f60021f900bbca42215dcc8cb1`
- Selected change: `align-media-upload-limit`

## Implementation

- Added `MAX_MEDIA_FILE_BYTES = 100_000_000` as the single decimal product-policy limit.
- Kept `DEFAULT_MAX_MEDIA_BYTES` as a backward-compatible alias to the product-policy constant, not a second numeric source.
- Added `resolveMediaFileSizeLimit()` so an injected lower operational limit wins while a higher value cannot raise the product policy.
- Added the distinct `file-size-limit-exceeded` error code and structured `actualBytes`, `limitBytes`, and `limitSource` metadata.
- Kept browser `QuotaExceededError` mapped to `quota-exceeded`, distinct from file-size policy failures.
- Moved size rejection before hashing and durable adapter writes.
- Preserved read behavior: existing assets are read by storage key without reapplying the current ingestion limit.
- Confirmed the three implemented workspace media ingestion call sites use `writeMediaAsset`; a source-contract test protects this shared owner and rejects reintroduction of the old 50 MiB constant in the controller.

## TDD Evidence

Red command:

```text
node --experimental-strip-types --test tests/workspace-media-storage.test.mjs
```

Against the pre-change source, the new boundary suite produced three expected failures:

1. the default constant was `52,428,800`, not `100,000,000`;
2. a 100,000,001-byte file returned `quota-exceeded` instead of a file-policy error;
3. a lower operational limit also returned `quota-exceeded` instead of an operational-limit error.

Green command after implementation:

```text
node --experimental-strip-types --test tests/workspace-media-storage.test.mjs
```

Result before publication: `12` tests passed, `0` failed.

## Scope Boundary

- Monthly upload allowance and total account storage remain out of scope because Notes App does not yet expose an equivalent subscription/quota capability.
- No binary format, media identity, or existing stored asset was migrated.
- Current UI consumers retain their localized generic storage failure copy; the domain result now carries enough typed data for a later UI to show exact product-policy or lower operational-limit details without parsing English text.

## Remaining Acceptance

- GitHub Actions must run the repository `pnpm verify` pipeline for the published commit.
- The OpenSpec CLI is not installed in the execution environment used for this implementation, so strict OpenSpec validation remains required before archive.
