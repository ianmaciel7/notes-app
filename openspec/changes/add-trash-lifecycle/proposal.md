## Why

Notes App currently performs object deletion without a complete recoverable Trash lifecycle. Current documentation defines restore within 30 days, individual permanent deletion, Empty Trash, and automatic cleanup after 30 days. Soft deletion must also cooperate with search, queries, links, media references, sync, and permanent tombstones.

## What Changes

- Add Space-scoped Trash records with deletion timestamp, original identity, type, and restoration metadata.
- Exclude trashed objects from normal navigation, search, queries, backlinks, graph, dashboards, and creation conflicts while preserving recoverability.
- Add restore, permanent delete, Empty Trash, and automatic 30-day purge.
- Delay destructive media garbage collection and sync tombstones until permanent purge.
- Add a localized accessible Trash surface with bulk and individual actions.
- Keep Structure/object-type deletion and deleted-Space retention under their existing explicit contracts rather than silently converting them into object Trash.

## Capabilities

### New Capabilities

- `domain/trash-lifecycle`: Recoverable object deletion, restoration, retention, purge, and subsystem exclusion contracts.

### Modified Capabilities

- `ui/object-lifecycle`: Add visible Trash, restore, permanent-delete, empty, and confirmation states.

## Impact

- Object state, database schema, search/query/link projections, media GC, offline sync, UI, localization, migrations, and tests.
