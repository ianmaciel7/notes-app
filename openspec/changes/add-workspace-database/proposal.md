## Why

A single localStorage snapshot is not an adequate long-term persistence boundary for incremental writes, large structured workspaces, media metadata, migrations, operation queues, or synchronization. Notes App needs transactional record stores while preserving domain-level APIs.

## What Changes

- Add a neutral transactional repository/database abstraction for Structures, objects, property values, block documents, identities, links, queries/views, media metadata, settings, and operations.
- Implement a browser IndexedDB-class adapter with indexes, revisions, integrity checks, and crash-safe schema migration.
- Migrate the legacy snapshot transactionally and replace whole-workspace rewrites with incremental persistence.

## Capabilities

### New Capabilities

- `domain/workspace-database`: Transactional normalized local persistence, revisions, indexed lookups, integrity audit, and safe legacy migration.

### Modified Capabilities

- None.

## Impact

- Priority: **P9**.
- Depends on import/export and media-storage contracts so migration/backup paths are available.
- This does not choose or claim Capacities' private database technology.
