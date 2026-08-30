## Context

Soft deletion is a state transition, not a copy of an object into another registry. Canonical identity and content must remain recoverable during retention, while all normal projections behave as if the object is absent.

## Domain Model

A `TrashRecord` contains Space ID, entity ID, trashedAt, purgeAfter, deletion actor/source, prior route/context metadata when available, and schema version. The canonical entity remains stored and immutable except for allowed restoration metadata during retention.

Lifecycle:

`active -> trashed -> active` by restore
`trashed -> purged` by individual permanent delete, Empty Trash, or retention cleanup

Repeated commands are idempotent. Restore fails truthfully when the Structure no longer exists, identity conflicts cannot be resolved, or required content is corrupt.

## Projection Rules

Trashed entities are excluded from normal search, query, graph, backlinks, Objects Inside, Related Content, dashboards, calendar, task views, and public integrations. References from active objects become recoverable missing-target states rather than being rewritten. Trash search is a separate projection.

Media references owned only by trashed entities remain live until purge. Purge creates sync tombstones and permits garbage collection after all remaining references are checked.

## Retention

`purgeAfter` is exactly 30 calendar days after `trashedAt` in UTC storage terms. UI displays localized dates. Automatic cleanup is resumable, idempotent, bounded, and safe offline; it queues permanent deletion for sync when connectivity returns.

## Boundaries

Custom Structure deletion remains separately guarded and irreversible unless a future spec changes it. Deleted Spaces use the account/Spaces retention model. Neither is silently routed through object Trash.

## UI

The sidebar Trash destination shows recoverable items, age/purge date, type, and actions. Permanent deletion and Empty Trash require explicit confirmation and clearly state irreversibility. Restore returns the object to a valid route without reopening unsafe stale UI state.

## Testing

Tests cover idempotency, retention boundaries, clock injection, restore, missing Structure, references, media, queries, sync, offline cleanup, bulk purge, accessibility, localization, and migration.
