## Why

The runtime is still the default Next.js starter and has no product navigation. The next approved UI stage needs one small, reviewable workspace region before the shell and content surfaces are introduced.

## What Changes

- Add the first runtime workspace region: a minimalist, Portuguese-first sidebar.
- Establish navigation groups for the initial workspace routes: Hoje, Objetos, Capturar, Revisar, Estudar, and Tipos.
- Show workspace identity, active route state, keyboard focus, and a settings entry.
- Provide an equivalent mobile navigation surface without forcing horizontal page overflow.

## Capabilities

### New Capabilities

- `workspace-sidebar`: Provides the primary workspace navigation region and its responsive interaction contract.

### Modified Capabilities

None.

## Dependencies And Sequencing

- Depends on `define-minimalist-ui-foundation` and `docs/DESIGN.md`.
- Must be reviewed in the browser before the shell layout change is created.
- The sidebar may establish navigation contracts, but it must not implement the content editor, object list, context panel, or workflow surfaces.

## Non-Goals

- Implement the full workspace shell or top header.
- Implement object data, search, persistence, authentication, or permissions.
- Add a context panel, editor, dashboard, graph, or study workflow.
- Copy the complete object-and-study workspace implementation without reducing it to this stage's contract.

## Impact

- Adds a focused OpenSpec change for the first runtime UI region.
- Future runtime work can consume the sidebar navigation contract.
- No data model, API, or persistence changes are required.
