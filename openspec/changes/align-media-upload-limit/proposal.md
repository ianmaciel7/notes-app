## Why

The current local media default rejects files above 50 MiB, while current official documentation states a 100 MB per-file limit across Basic, Pro, and Believer tiers. The local limit and its user-facing errors therefore diverge from the selected parity target.

## What Changes

- Replace the default per-file limit with one explicit 100 MB policy shared by validation, UI copy, import, retry, and tests.
- Define decimal MB versus binary MiB semantics so boundary behavior is unambiguous.
- Preserve configurable lower limits for deployment/storage constraints, but report them as Notes App limits rather than Capacities parity.
- Add exact boundary, one-byte-over, local-quota, retry, and reload tests.
- Keep monthly/total plan quotas out of scope until Notes App has a subscription/storage-quota capability.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `domain/media-storage`: Align the default per-file media size contract and error semantics.

## Impact

- Media constants, validation, creation/import UI, localized errors, tests, and documentation.
- No existing media identity or binary format changes.
