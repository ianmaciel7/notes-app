## Why

The `/en` workspace currently treats every selection from `Novo` as the same generic untitled object, while the authenticated reference uses distinct creation and editing flows for pages, tables, tasks, URL-derived objects, tags, queries, and uploaded media. The workspace needs a typed, local object lifecycle so its behavior matches the observed product model instead of only reproducing the shell visually.

## What Changes

- Introduce a typed workspace entity model whose editable data and creation status depend on the selected object type.
- Dispatch `Novo` selections to the observed flow families: full editor, table editor, quick task capture, URL capture, tag index, query builder, and local file metadata capture.
- Keep titles, body text, table cells, task fields, URLs, query filters, and object counts synchronized across editor, tabs, sidebar, and object-type views.
- Persist the local demo workspace across reloads with a versioned browser-storage boundary while preserving a deterministic first-run seed.
- Add localized, accessible creation surfaces for every palette entry and explicit validation/error states.
- Cover the lifecycle with focused tests and rendered browser checks against the observed authenticated reference behavior.
- Avoid network metadata scraping, AI execution, remote upload, authentication, or Capacities data mutation in the local implementation; URL and file workflows are deterministic local simulations.

## Capabilities

### New Capabilities

- `ui/object-lifecycle`: Defines typed object creation, editing, local persistence, tab/sidebar synchronization, and per-type creation surfaces for the `/en` workspace.

### Modified Capabilities

None.

## Impact

- Affects the route-owned workspace state/controller, workspace content renderers, the `Novo` palette integration, locale catalogs, and focused tests.
- May add small neutral domain modules for object definitions, reducers, validation, and versioned local storage.
- Preserves the existing `AppShell`, header/sidebar public APIs, central object icon registry, shadcn/Base UI primitives, locale routing, and the separate `refine-capacities-en-fidelity` visual acceptance work.
- Adds no backend, third-party dependency, remote upload, or external AI requirement.
