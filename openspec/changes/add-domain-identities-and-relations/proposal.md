## Why

Tags and collections still depend too heavily on display strings, while entity properties need stable target identity. Renames must not rewrite every reference or break future backlinks and queries.

## What Changes

- Add stable TagId and CollectionId records and migrate memberships from names to ids.
- Represent entity relations by stable object ids with target-Structure validation.
- Derive reverse indexes and guard rename/delete operations so references cannot be silently orphaned.

## Capabilities

### New Capabilities

- `domain/domain-identities-and-relations`: Rename-safe tags, collections, memberships, entity relations, and reverse projections.

### Modified Capabilities

- None.

## Impact

- Priority: **P2**.
- Depends on `add-typed-property-values`.
- Prepares backlinks, query filtering, views, API, and sync while keeping editor block links out of this slice.
