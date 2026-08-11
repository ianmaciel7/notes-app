## Context

Users need several ways to retrieve and organize objects: type pages, saved views, command palette, extended search, local in-page find, calendar views, and daily notes.

## Decisions

### Keep local find separate from global search

Find in Page searches visible content in the active object and should not pollute the global workspace search context.

### Keep the command palette minimal

The global Ctrl+K palette appears as a centered command surface for object search and executable actions, not as another persistent navigation panel.

### Preserve result set across view modes

List, Wall, Kanban, Gallery, Table, and Embed modes present the same authorized result set using different layouts.

### Treat search indexes as derived state

Search results are derived from authorized object data, metadata, type schemas, relationships, collections, and calendar fields. Indexes may be rebuilt, but UI must represent stale or degraded states explicitly.

## Risks / Trade-offs

- Combining search and calendar can grow large; this change groups them because both depend on indexed object retrieval.
- Empty states must not imply unrelated content should be created.
- Stale indexes can mislead users or leak revoked data if authorization invalidation is weak.
