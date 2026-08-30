## 1. Provider and Validation

- [ ] 1.1 Add failing tests for provider input/output, stable ordering, finite scores, duplicate/self/missing/trashed/cross-Space rejection, and bounded results.
- [ ] 1.2 Implement the provider interface, validation layer, and typed unavailable/error states.

## 2. Local Ranking

- [ ] 2.1 Build deterministic fixtures for lexical, link, relation, tag, collection, and recency signals.
- [ ] 2.2 Implement a versioned Notes App local ranker without calling it the Capacities algorithm.
- [ ] 2.3 Add cache keys, targeted invalidation, offline behavior, and representative performance tests.

## 3. UI

- [ ] 3.1 Add inline top-five results below eligible notes with loading, empty, unavailable, stale, partial, and error states.
- [ ] 3.2 Add side-panel continuation using the same result revision.
- [ ] 3.3 Keep Backlinks, Objects Inside, property relations, and shared collections as separately named structural sections.

## 4. Acceptance

- [ ] 4.1 Verify privacy boundaries, no automatic content mutation, accessibility, keyboard, responsive, reduced-motion, and console behavior.
- [ ] 4.2 Run repository verification and `openspec validate add-related-content --strict`.
