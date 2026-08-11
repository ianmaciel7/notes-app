## Why

The rich object editor is a distinct implementation surface with editing, metadata, keyboard, outline, presentation, autosave, and recovery behavior. It should not be bundled with navigation or domain-model work.

## What Changes

- Define persisted rich block editing.
- Define editable object metadata from the object page.
- Define visual separation between structured metadata and freeform body blocks.
- Define keyboard and document navigation.
- Define object presentation mode.

## Impact

- Planning only; no runtime code changes in this change.
- Depends conceptually on the knowledge object model and workspace foundation.
