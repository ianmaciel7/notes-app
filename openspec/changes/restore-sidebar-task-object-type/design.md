## Context

`WorkspaceProvider` derives sidebar object types from `WorkspaceObjectState.structures`. The current initial registry contains `page`, `table`, `task`, and the other built-in types, but version-3 snapshots persist the whole registry. A snapshot saved before a required built-in was introduced can therefore remain valid while permanently omitting that type from every projection.

The reference screenshot confirms that Task belongs to the `Object types` section after Table and before Weblink. The issue is hydration state, not missing icon metadata or a missing creation flow.

## Goals

- Restore every current built-in and reserved Structure during hydration.
- Keep the canonical order of required Structures so Task appears after Table.
- Preserve stored custom and legacy Structures and their local names, icons, tones, and order.
- Avoid resurrecting optional legacy preset types that the user previously removed.
- Preserve the current schema version and localStorage key.

## Non-Goals

- Add Tasks to primary navigation.
- Change task quick-capture behavior.
- Recreate every reference object type as a mandatory built-in.
- Reset or discard valid local entities.

## Decision

Add a small pure reconciliation helper. It receives the current registry and the validated stored registry, selects only current Structures whose ownership is `built-in` or `reserved`, and places those canonical definitions first. Stored entries with the same protected IDs are replaced. Every remaining stored custom or legacy Structure is appended unchanged.

Hydration runs this reconciliation after validating the stored registry and before validating entity-to-Structure lifecycle references. This keeps malformed snapshots atomic while ensuring the protected baseline cannot drift.

## Ordering

The canonical built-in order remains authoritative. With the current registry, the first rows are Page, Table, and Task. Optional legacy types remain in their stored relative order after protected types.

## Verification

- Unit-test the pure reconciliation helper.
- Extend storage migration coverage with a version-3 registry that omits Task and other required types.
- Confirm the restored registry starts with `page`, `table`, `task`.
- Confirm a retained legacy Book Structure survives while an absent optional Person Structure is not recreated.
