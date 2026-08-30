## Context

The WACZ corpus records calls to a related-content endpoint, and current documentation states the observable surface, but neither reveals the private ranking algorithm. Notes App needs an implementation-neutral provider boundary and a transparent local strategy.

## Provider Contract

`RelatedContentProvider.rank(input)` receives Space ID, source object ID, eligible candidate IDs or a bounded index handle, limit, and revision. It returns ranked results containing target ID, finite score, zero or more reason categories, provider ID/version, generatedAt, and stale/partial flags.

Results are validated against canonical state. The application removes self, duplicates, trashed, missing, unauthorized, and cross-Space targets. Provider errors never alter object content.

## Local Baseline

The default offline-capable Notes App provider combines documented local information already available to the app:

- normalized title, alias, property, and block-text overlap;
- direct object/block links and backlinks;
- typed property relations;
- shared tags and collections;
- recency only as a bounded tie-breaker.

Weights and normalization are Notes App-owned, versioned, deterministic, and tested. They are not described as the Capacities algorithm. Future semantic or remote providers can implement the same interface after privacy/security review.

## Presentation

Eligible object pages show at most five ranked results directly below notes. “More” opens the same result revision in the side panel, with pagination or bounded continuation. Structural relationship sections remain separately named Backlinks, Objects Inside, Relations, or Collections.

The surface may be unavailable for unsupported object types or when local content is insufficient. Empty and unavailable are distinct.

## Cache and Offline

Cache keys include Space, source object revision, index revision, provider version, and limit. Canonical mutations invalidate affected entries. Local ranking works offline; remote enhancement degrades to local or a truthful unavailable state.

## Privacy and Security

No provider receives content outside the active Space or beyond its declared minimum fields. Remote providers require explicit policy, redaction, consent, and audit metadata. Results never create links or mutate content automatically.

## Testing

Tests cover deterministic ranking, validation, invalidation, stale results, provider errors, offline fallback, privacy, top-five, more-results continuity, accessibility, and no mutation.
