# Object component inventory

This is the implemented composition map, not a claim that all type-specific product features exist.
The shared bases are `ObjectList` and `ObjectDetail`. Every fixed type owns its own List and Detail.
Dynamic user-defined types use `CustomObjectList` and `CustomObjectDetail` with supplied records.

## Concrete components

| Type id | List | Detail | Directory |
| --- | --- | --- | --- |
| `page` | `PageList` | `PageDetail` | `src/app/_components/objects/types/page/` |
| `table` | `TableList` | `TableDetail` | `src/app/_components/objects/types/table/` |
| `task` | `TaskList` | `TaskDetail` | `src/app/_components/objects/types/task/` |
| `flashcard` | `FlashcardList` | `FlashcardDetail` | `src/app/_components/objects/types/flashcard/` |
| `study_goal` | `StudyGoalList` | `StudyGoalDetail` | `src/app/_components/objects/types/study-goal/` |
| `weblink` | `WeblinkList` | `WeblinkDetail` | `src/app/_components/objects/types/weblink/` |
| `image` | `ImageList` | `ImageDetail` | `src/app/_components/objects/types/image/` |
| `pdf` | `PdfList` | `PdfDetail` | `src/app/_components/objects/types/pdf/` |
| `audio` | `AudioList` | `AudioDetail` | `src/app/_components/objects/types/audio/` |
| `file` | `FileList` | `FileDetail` | `src/app/_components/objects/types/file/` |
| `tweet` | `TweetList` | `TweetDetail` | `src/app/_components/objects/types/tweet/` |
| `ai-chat` | `AiChatList` | `AiChatDetail` | `src/app/_components/objects/types/ai-chat/` |
| `tag` | `TagList` | `TagDetail` | `src/app/_components/objects/types/tag/` |
| `query` | `QueryList` | `QueryDetail` | `src/app/_components/objects/types/query/` |
| `book` | `BookList` | `BookDetail` | `src/app/_components/objects/types/book/` |
| `person` | `PersonList` | `PersonDetail` | `src/app/_components/objects/types/person/` |
| `area` | `AreaList` | `AreaDetail` | `src/app/_components/objects/types/area/` |
| `meeting` | `MeetingList` | `MeetingDetail` | `src/app/_components/objects/types/meeting/` |
| `definition` | `DefinitionList` | `DefinitionDetail` | `src/app/_components/objects/types/definition/` |
| `idea` | `IdeaList` | `IdeaDetail` | `src/app/_components/objects/types/idea/` |
| `place` | `PlaceList` | `PlaceDetail` | `src/app/_components/objects/types/place/` |
| `project` | `ProjectList` | `ProjectDetail` | `src/app/_components/objects/types/project/` |
| `organization` | `OrganizationList` | `OrganizationDetail` | `src/app/_components/objects/types/organization/` |
| `media` | `MediaList` | `MediaDetail` | `src/app/_components/objects/types/media/` |
| `travel` | `TravelList` | `TravelDetail` | `src/app/_components/objects/types/travel/` |
| `quote` | `QuoteList` | `QuoteDetail` | `src/app/_components/objects/types/quote/` |
| `atomic-note` | `AtomicNoteList` | `AtomicNoteDetail` | `src/app/_components/objects/types/atomic-note/` |
| `Dynamic / unknown` | `CustomObjectList` | `CustomObjectDetail` | `src/app/_components/objects/types/custom-object/` |

Each directory contains `<slug>-list.tsx` and `<slug>-detail.tsx`.
Weblinks additionally contain `weblink-heading.tsx` for safe external navigation and copying.

## Shared parts and responsibilities

| Module | Exports / responsibility |
| --- | --- |
| `objects/object-list.tsx` | `ObjectList`, `ObjectListHeader`, `ObjectListToolbar`, `ObjectListContent`. Structural only; no type, storage or controller imports. |
| `objects/object-detail.tsx` | `ObjectDetail`, `ObjectDetailHeader`, `ObjectDetailContent`, `ObjectDetailAside`. Structural only; no forced aside/provider/dialog. |
| `objects/list/use-object-list.ts` | List-instance state and scoped preference lifecycle. |
| `objects/list/object-list-model.ts` | Pure filtering, sorting, namespace resolution and preference validation. |
| `objects/list/object-list-storage.ts` | Optional browser preference persistence with denied/quota error handling. Never persists user objects. |
| `objects/list/object-list-heading.tsx` | Type heading and composed actions. |
| `objects/list/object-list-actions.tsx` | New, search and reset menus using local shadcn/Base UI. |
| `objects/list/object-list-search.tsx` | Search field, Escape and focus restoration. |
| `objects/list/object-list-controls.tsx` | Mode, count, filter, sorting, grouping and layout controls. |
| `objects/list/object-list-choice.tsx` | Typed radio-menu composition; validates incoming values. |
| `objects/list/object-list-results.tsx` | Empty/filtered states and result composition. |
| `objects/list/object-list-overview.tsx` | Existing overview sections; no invented collections/query execution. |
| `objects/detail/object-heading.tsx` | Shared type identity, title and tags. |
| `objects/detail/object-blocks.tsx` | Read-only saved block presentation and empty body. |
| `objects/detail/object-properties.tsx` | Shared readable property values and property section. Not a property editor. |
| `objects/detail/object-detail-model.ts` | Readable values, HTTP(S) URL validation and body detection. |
| `objects/object-components.ts` | Explicit type-to-List/Detail lookup and custom fallback. |
| `objects/object-list-resolver.tsx` | Chooses a concrete list with a space/type instance key. |
| `objects/object-detail-resolver.tsx` | Chooses a concrete detail and excludes foreign-space type metadata. |
| `objects/embedded-object-list.tsx` | Existing full-detail embeds, distinct from summary list results. |
| `workspace-object-renderer.tsx` | Compatibility re-exports for existing workspace consumers. |

## Capability boundary

This change separates ownership and composition. Non-weblink details retain the existing generic
read-only blocks, tags and properties. Their concrete files are extension points, not fake editors.
Weblinks retain the current URL/description/notes presentation with HTTP(S)-only navigation.
Lists retain the existing overview/all modes, cards/list layout, filtering, sorting and creation
callbacks. Presets are explicitly mapped; arbitrary user-created ids use the custom pair.

## Remaining components and future work

| Area | Next component boundary / missing work |
| --- | --- |
| Card and row presentation | Extract `ObjectCard`, `ObjectRow`, `ObjectPreview` and metadata from the still-existing `WorkspaceObjectDataView`; its current geometry is preserved in this change. |
| Other data views | `ObjectTable`, `ObjectGallery`, `ObjectWall`, and embedded result projections require real data and interaction contracts. |
| Page and custom editing | Integrate the existing editor and schema-aware property controls into concrete details; do not invent data gateways. |
| Task behavior | Dedicated status/schedule/context controls and groups remain future behavior; `TasksActionPanel` is still a separate legacy action flow. |
| Image/PDF/audio/file | Real viewers, playback, media loading/error handling and permissions are not implemented by naming detail components. |
| Flashcards / study goals | Keep study semantics separate from the display refactor; no fake review sessions or scheduling. |
| Query / table / tags | Query execution, table editing and tag relationship projections remain separate capabilities. |
| Calendar / daily notes | Temporal views are not ordinary object lists; keep their own surface contracts. |
| Collections / search | Selection rules belong to their feature; reuse result presentation without embedding a full list screen unnecessarily. |
| Main workspace | `workspace-main-content.tsx` still owns action panels and repeated navigation logic. Extract these in a subsequent scoped migration. |
| Workspace controller | `space-controller.tsx` and broad context consumers are not fully refactored or audited here. |
| Right panel | `workspace-side-panel-content.tsx` still delegates to the existing side renderer. This change does not wire typed details into the right panel. |
| Graph / backlinks / related objects | Dedicated projections and panel integration remain necessary. |
| Internationalization | Legacy renderer copy is preserved; moving it to the existing locale system needs provider-aware stories/tests. |

## Composition rules

Concrete components import structural bases; bases never import concrete components.
Keep the existing local shadcn contract, including Base UI `render` where supported, refs,
event composition, semantic controls and required provider boundaries. No `asChild` conversion.
Do not add a provider merely to arrange named regions. A List/Detail pair does not imply a new
database table, state store, API route, editing feature or performance improvement.

See `object-components-verification.md` for executed checks and remaining validation gaps.
See `../../CAPACITIES_COMPONENT_MAP.md` for current and historical parity evidence.
