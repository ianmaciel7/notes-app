## Context

Users need several ways to retrieve and organize objects: type pages, saved views, command palette, extended search, local in-page find, calendar views, and daily notes.

## Decisions

### Keep local find separate from global search

Find in Page searches visible content in the active object and should not pollute the global workspace search context.

### Preserve result set across view modes

List, Wall, Kanban, Gallery, Table, and Embed modes present the same authorized result set using different layouts.

## Risks / Trade-offs

- Combining search and calendar can grow large; this change groups them because both depend on indexed object retrieval.
- Empty states must not imply unrelated content should be created.
