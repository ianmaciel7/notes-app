# Capacities Component Behavior Map

## Current object-component map

The complete previous parity map is preserved without content changes in
[the historical map](docs/architecture/capacities-component-map-history-2026-09-10.md).
Its measurements and live-reference observations are historical evidence, not newly verified results.

The current object composition is documented in
[the component inventory](docs/architecture/object-components.md).

| Surface | Local entry | Current responsibility |
| --- | --- | --- |
| Object type list | `ObjectListResolver` and each concrete `*List` | Concrete type composition over `ObjectList`; retains existing main-workspace exports. |
| Object detail | `ObjectDetailResolver` and each concrete `*Detail` | Concrete type composition over `ObjectDetail`; shared saved blocks and properties. |
| Weblink detail | `WeblinkDetail`, `WeblinkHeading` | Saved URL, description and notes; rejects non-HTTP(S) navigation. |
| List preference state | `useObjectList`, `object-list-model`, `object-list-storage` | Scoped by space and type; invalid or unavailable storage does not crash the view. |
| Result cards and rows | `WorkspaceObjectDataView` | Existing summary presentation remains in place; its own extraction is outstanding. |
| Full-detail embeds | `EmbeddedObjectList` | Deliberate full details, not summary rows. |
| Main/side workspace | Existing workspace controllers and renderers | Navigation remains outside the structural bases; right-panel detail integration is outstanding. |

## Comparison record: 2026-09-10 composition refactor

- Graphify query attempted: `graphify query object`; unavailable in the execution environment.
  Source reads were used instead. The graph artifacts were not refreshed.
- Geometry: structural list/detail shells preserve existing spacing and slots; card/row markup
  remains untouched. No browser capture or pixel-parity claim is made for the refactored controls.
- Colors: existing app tokens are retained. No global theme, generated UI or token files changed.
- Icons: extracted list controls use Lucide; object identity continues using `object-icons.tsx`.
- Interaction: existing search/filter/sort/group/layout/create callbacks remain composed using
  local shadcn/Base UI controls. Keyboard/focus/browser integration still needs runtime validation.
- Data: supplied workspace records and existing callbacks remain the data boundary. Local storage
  contains optional view preferences only. No mock or generated content is used as app data.
- Gaps: media readers, property editing, task scheduling, collection/query execution, right-panel
  details and the remaining large workspace modules are not implemented by this extraction.

## Working rule

Keep this index and the detailed inventory current when component ownership changes. Consult the
historical map for untouched surface contracts. Preserve previous evidence; distinguish source
inspection, executed tests and actual browser measurements. Do not claim visual parity from JSX.
