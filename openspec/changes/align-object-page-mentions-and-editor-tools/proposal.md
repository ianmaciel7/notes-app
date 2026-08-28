## Why

The object page currently presents unlinked mentions in the wrong direction and assigns the reference editor-utility trigger to a full-page collapse action. Current authenticated Capacities behavior, the supplied object-page image, and official documentation show that the focused object's title or aliases must be discovered in other objects and that the edge trigger opens a Structure/Statistics utility panel without hiding the object.

## What Changes

- Correct unlinked-mention discovery so the focused object's title or aliases are matched against other eligible objects, excluding already linked sources and preserving plain text until explicit conversion.
- Replace the always-expanded generic `Links and references` composition with reference-aligned backlink and `Mentions` sections that render only applicable derived results, counts, source-object previews, type identity, disclosure state, and contextual actions.
- Replace the inaccurate full-object collapse/expand behavior assigned to the editor edge trigger with a compact Structure/Statistics utility panel supporting tab selection, pinning, outside-click and Escape dismissal, truthful empty states, and current-object statistics.
- Preserve existing accessible names, roles, keyboard focus, reduced-motion behavior, buffered editing, and local/offline derivation even where the authenticated reference exposes weaker semantics.
- Add focused unit and browser acceptance coverage for mention direction, exclusions, explicit conversion, section collapse, editor-utility states, responsive placement, persistence, and clean runtime behavior.
- Record a sanitized evidence baseline for the supplied and live Capacities states plus structured localhost observations; persist no localhost screenshots or authenticated secrets.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `domain/object-and-block-linking`: Define source-oriented unlinked-mention discovery for a focused object, deterministic exclusions, advisory state, and explicit conversion into a canonical reference.
- `ui/capacities-en-fidelity`: Define the object-page relationship composition, `Mentions` section, source previews and actions, ordering, responsive behavior, and truthful removal of the generic always-expanded relationship builder.
- `ui/block-editor`: Replace the edge-triggered full-editor collapse contract with the reference-aligned Structure/Statistics utility panel and its accessible interaction states.

## Impact

- Planning artifacts and evidence under `openspec/changes/align-object-page-mentions-and-editor-tools/`.
- Future implementation will affect `src/lib/workspace-object-links.ts`, `src/components/workspace-object-page-view.tsx`, editor utility primitives, locale catalogs, and focused unit/E2E tests.
- Existing tests that encode current-object-to-target mention discovery and full-page collapse behavior will be replaced because they assert behavior contradicted by current product evidence.
- No dependency, persistence-schema, public API, or production-code change is authorized by this proposal workflow.
