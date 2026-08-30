## Why

The current `selectRelatedEntities` helper reports graph relationships such as backlinks, content references, property relations, and shared collections. The documented Related Content surface instead promises an automatically ranked set of related objects, showing the closest five below the current notes and more in the side panel. The private Capacities ranking algorithm is not documented and must not be invented as parity.

## What Changes

- Introduce a Space-scoped `RelatedContentProvider` contract returning ranked object IDs, scores, reason categories, freshness, and availability.
- Keep structural relationship projections separate from Related Content.
- Add a deterministic Notes App local ranking baseline using canonical text/index and graph signals, explicitly labeled as Notes App behavior.
- Show up to five results below eligible object notes and additional results in the contextual panel.
- Add unsupported, unavailable, loading, empty, stale, offline, and provider-error states.
- Prevent self-results, trashed/missing/cross-Space targets, duplicates, and private-data leakage.

## Capabilities

### New Capabilities

- `domain/related-content`: Ranked related-object provider, eligibility, result validation, caching, and fallback semantics.
- `ui/related-content`: Inline top-five and side-panel result presentation.

### Modified Capabilities

None.

## Impact

- Search/index services, graph/link projections, object page, side panel, caching, offline behavior, localization, tests, and evidence.
- Does not claim algorithmic compatibility with Capacities.
