## Why

The central workspace registry already defines `task` as a protected built-in Structure, but an older persisted version-3 registry can omit it and still hydrate successfully. Because sidebar object-type rows are projected from the hydrated registry, affected users lose the `Tasks` row even though the current application supports task creation. The captured Capacities reference places `Task` inside `Object types`, immediately after `Table`, rather than as a separate primary-navigation row.

## What Changes

- Reconcile every hydrated registry with the current protected built-in and reserved Structures before exposing it to the workspace.
- Restore missing required types such as `task` while retaining stored custom and legacy Structures.
- Keep user-removable legacy preset types removed when they are absent from stored state.
- Add regression tests for required-Structure restoration and canonical ordering.
- Store the user-provided task-placement reference image under `docs/references` and document the observed placement.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `ui/app-sidebar`: Required built-in object types, including Tasks, remain present after workspace hydration and render in the object-type section.
- `ui/object-lifecycle`: Persisted Structure registries are reconciled with current protected definitions without discarding local custom or legacy Structures.

## Impact

- Updates workspace Structure hydration under `src/lib`.
- Adds focused source tests under `tests`.
- Does not add a new primary-navigation Tasks row, change AppShell geometry, or alter the storage key.
