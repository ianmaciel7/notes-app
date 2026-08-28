## Why

The current Query logic recognizes only a small set of words and filters. A Capacities-like workspace needs one serializable, typed query model and shared search indexes over Structures, properties, tags, collections, relations/backlinks, dates, and block content.

## What Changes

- Replace free-form parsing as canonical state with a validated QueryDefinition AST.
- Add typed nested filters, sorting, grouping, limits, object/block result modes, and contextual variables.
- Add local title/alias and full-text object/block indexes shared by query/search/picker surfaces.

## Capabilities

### New Capabilities

- `domain/query-engine-and-search-index`: Typed query AST/evaluator, variable queries, local title/full-text indexes, and unified search consumers.

### Modified Capabilities

- None.

## Impact

- Priority: **P5**.
- Depends on typed properties, stable identities/relations, and object/block linking.
- Replaces the current narrow QueryEntity semantics while preserving an optional natural-language translation layer.
