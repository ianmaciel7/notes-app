## Context

A user may maintain separate knowledge environments such as Personal and Work. These environments require strong data boundaries while still allowing deliberate reuse of global defaults or templates.

## Decisions

### Spaces are the primary data boundary

Objects, collections, relationships, search results, graph nodes, AI retrieval, exports, and sync queues are scoped to a space unless an explicit cross-space action is authorized.

### Object type schemas are space-owned with optional templates

Object types are defined per space by default. Global templates may seed a space, but changes in one space do not silently mutate another space.

### Cross-space movement is explicit

Copying or moving objects across spaces must explain which type schema, metadata, relationships, attachments, permissions, and backlinks will be preserved, remapped, omitted, or converted.

## Risks / Trade-offs

- Global object types are convenient but can leak assumptions across workspaces.
- Cross-space copy/move can corrupt data if schema mapping is implicit.
- AI/search/export can leak content if space scope is not enforced consistently.
