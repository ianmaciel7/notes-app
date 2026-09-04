# Space-Scoped Data Architecture Design

Date: 2026-09-04
Status: Proposed for implementation after user review
Scope: Local-first Space isolation and persistence

## Context

The current workspace UI can create and select Space names, but Space selection is still primarily UI state. The product model requires a Space to be the root isolation boundary for knowledge data. Switching Spaces must change the object types, objects, collections, tags, relationships, search scope, graph scope, trash, settings, media, AI retrieval scope, and future sync scope that the user sees.

This design is grounded in the current project architecture plus the preserved Capacities and historical Notes App references:

- `AGENTS.md` and `DECISIONS.md` define Dexie/IndexedDB as the local-first source of truth and transient React/Zustand state as UI-only state.
- `SPEC.md` defines the typed object architecture that persistent entities must follow.
- Historical branch `old` contains the `define-workspace-spaces` OpenSpec, which requires Space Data Segregation and Space-scoped object type schemas.
- Historical branch `old-4` contains `workspace-account-spaces.ts`, where every Space owns a distinct repository with its own object state, media, search index, operations, and sync cursors, and cross-Space relations are rejected.
- Historical branch `old-4` also contains `workspace-database.ts`, which already indexed persisted records by `spaceId`.
- Preserved Capacities references establish that content belongs to one Space and that a new Space may start blank.

At the time of this design, `package.json` does not yet include Dexie even though the architectural documents require it. The implementation phase will add `dexie` and `dexie-react-hooks` rather than introduce a competing persistence layer.

## Decision

Use one local Dexie database, `KnowledgeOS_DB`, with every Space-owned persistent record explicitly partitioned by `spaceId`.

A newly created Space starts blank:

- zero user object types;
- zero user objects;
- zero collections;
- zero tags;
- zero relationships/backlinks;
- zero media;
- zero search-index entries;
- zero trash entries.

Only the minimum internal Space metadata required to identify and activate the Space is created automatically.

The existing application data and the object-type catalog currently belonging to Personal Space are migrated/materialized into Personal Space only. They are never copied into newly created Spaces.

## Why this approach

### Recommended: one database, explicit `spaceId` partitioning

This provides the best balance between isolation, queryability, migration simplicity, future Firestore sync, and offline-first behavior. It matches the current architectural decision to make Dexie the local source of truth and matches the historical `old-4` direction of indexing records by `spaceId`.

### Rejected: one IndexedDB database per Space

This offers stronger physical separation but substantially complicates schema migrations, account-wide Space listing, export/import, transactional transfers, sync orchestration, and database lifecycle management without a current product requirement that justifies that complexity.

### Rejected: one large JSON snapshot per Space

This is simple for prototypes but performs poorly for reactive queries, partial updates, search, relationships, indexing, migration, and future sync.

## Core domain model

A Space is a first-class persistent entity, not a label over global application state.

```ts
interface SpaceRecord {
  id: string;
  accountId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

All persistent domain data owned by a Space carries `spaceId` directly or is reachable only through a Space-owned aggregate whose root carries `spaceId`.

Initial table direction:

```text
spaces
  id
  accountId
  name
  createdAt
  updatedAt

objectTypes
  id
  spaceId
  ...schema metadata

entities
  id
  spaceId
  type
  title
  ...BaseEntity fields

collections
  id
  spaceId
  ...

tags
  id
  spaceId
  ...

relationIndex
  id
  spaceId
  sourceId
  targetId
  ...derived/index fields

media
  id
  spaceId
  ...

spaceSettings
  id
  spaceId
  ...

appSettings
  key
  value
```

Canonical object data continues to follow the `BaseEntity` model in `SPEC.md`. A separate relation table, when used, is an index/projection for efficient relation and backlink queries rather than a competing canonical object schema.

Future sync records may also carry `spaceId`, but a sync queue is not required for this implementation slice.

The exact table set may be expanded as the existing object model is connected, but the isolation invariant does not change.

## Isolation invariants

These rules are mandatory rather than conventions:

1. Every Space-owned persistent record has an owning `spaceId`.
2. Every repository/query API that reads Space-owned records requires a `spaceId` or derives it from the active Space boundary.
3. UI code must not query Space-owned tables without applying active-Space scope.
4. Object type schemas are owned by one Space. Editing a type in Space A must not mutate a type in Space B.
5. Objects cannot silently reference objects in another Space.
6. Search, graph, backlinks, collections, trash, AI retrieval, export, and future sync queues operate on one Space by default.
7. Cross-Space copy/move is a future explicit workflow; it must never happen as an accidental side effect of ordinary create/edit actions.
8. Creating a Space never clones Personal Space content or schemas unless a future explicit template/import flow is invoked.

## Active Space state

`activeSpaceId` is an application preference, not the owner of domain data.

The durable preference is stored in Dexie's `appSettings` table under a stable key such as `activeSpaceId`. React Context may mirror the selected ID for immediate component coordination, but the authoritative list of Spaces and Space-owned domain records comes from Dexie. Zustand is not required for this implementation slice; it remains available for transient UI state if/when the existing application adopts it.

Space-scoped components use `useLiveQuery` from `dexie-react-hooks` with the active `spaceId` to read their data.

The provider therefore evolves from storing the entire Space list and workspace content in `useState` to coordinating:

- persisted Space records from Dexie;
- the persisted `activeSpaceId` preference;
- transient dialog/menu/open-state in React state only.

No second in-memory copy of the domain database becomes an authoritative source.

## Create Space flow

The existing Create Space UI remains the entry point.

On confirmation:

1. Trim and validate the name.
2. Generate a stable Space ID.
3. In one local transaction, insert only the `SpaceRecord` and any strictly required internal settings row.
4. Do not seed object types or objects.
5. Persist the new Space as `activeSpaceId` only after the creation transaction succeeds.
6. Let Space-scoped reactive queries update the sidebar/main workspace to the empty state.

If persistence fails, the UI must not switch to a Space that was not committed.

## Switching Spaces

Switching from Space A to Space B changes the active query boundary, not the underlying records.

After `activeSpaceId` changes, the following surfaces must resolve only Space B data:

- object type list;
- objects and recent objects;
- collections;
- tags;
- search results;
- relations/backlinks;
- graph;
- trash;
- media;
- Space settings;
- AI retrieval context;
- future offline/sync queues.

The application shell may stay mounted. Data-bearing components react to `activeSpaceId` and their Dexie live queries update.

## Personal Space migration

Existing pre-Space data must not be discarded.

The migration/bootstrap will:

1. Ensure a durable Personal Space record exists.
2. Assign all legacy Space-less persisted user data to Personal Space.
3. Materialize the object-type definitions that currently belong to the existing Personal workspace into Personal Space exactly once, even when those definitions are currently hardcoded or in-memory rather than already persisted.
4. Preserve existing object IDs and relationships where possible.
5. Add `spaceId` indexes required by the new schema.
6. Record the schema version/bootstrap marker so the migration is idempotent.
7. Make Personal Space active when no valid stored active Space exists.

The migration must never seed the Personal object-type catalog into any Space created after migration.

## Object types and blank Spaces

A blank Space has no user-facing object types.

This means a new Space does not inherit the object type list currently visible in Personal Space. Object type creation later writes a type record with the active `spaceId`. The sidebar derives its object type section from the active Space's object-type query.

System-internal records required by the editor/runtime are not presented as user object types and do not violate the blank-Space requirement.

Future template support may explicitly copy selected object type schemas into a Space, but template inheritance is outside this change.

## Relationships and backlinks

Relations are Space-scoped. Creating or editing a relation validates that both source and target belong to the same Space.

Backlinks are derived only from relationships inside that Space. A target ID that exists only in another Space must not resolve as a valid relation target.

This keeps behavior consistent with the historical `old-4` `cross-space-reference` rule.

## Search and graph

Search indexes and graph projections are derived per Space. At minimum, every indexed entry carries `spaceId`, and query APIs filter on it before matching text or traversing edges.

No global search is introduced by this change. A future cross-Space search can be designed as an explicit account-level feature rather than weakening the default isolation boundary.

## Persistence and transactions

Dexie transactions are used for operations that must remain atomic, including:

- Space creation plus required internal settings;
- active-Space persistence when coupled to creation;
- future Space deletion plus owned data cleanup;
- future object copy/move between Spaces;
- migrations.

Space activation occurs only after the corresponding create transaction succeeds.

## Deletion semantics

Space deletion is not required for the first implementation slice, but the storage model must make it safe to add later.

When implemented, deletion must remove only records owned by that `spaceId`, reject deleting the last required Space if that remains a product constraint, and require explicit user confirmation. It must never delete another Space's records.

## Error handling

- Invalid/blank Space name: reject before database write.
- Failed creation transaction: keep the previous active Space and surface an error.
- Stored `activeSpaceId` no longer exists: fall back to Personal Space or the first valid Space and persist the repaired preference.
- Corrupt legacy data during migration: fail safely without partially assigning records across Spaces.
- Cross-Space relation attempt: reject at the repository/domain boundary, not only in UI validation.

## Testing strategy

### Unit/domain tests

- new Space is blank;
- creating a type in Space A does not expose it in Space B;
- creating an object in Space A does not expose it in Space B;
- relations across Spaces are rejected;
- Space-scoped search does not leak results;
- migration assigns legacy data and existing Personal object types only to Personal Space;
- failed transaction does not activate an unpersisted Space.

### Database integration tests

- Dexie schema and `spaceId` indexes are created correctly;
- live queries update after switching active Space;
- reload restores Spaces and active Space;
- migration/bootstrap is idempotent;
- current Personal object types are materialized once and are not seeded into later Spaces.

### Playwright tests

- create Space -> new Space becomes active and shows an empty object-type/object state;
- create data in Personal -> switch to blank Space -> data is absent;
- create a type/object in second Space -> switch back -> it is absent from Personal;
- reload -> Space list and active Space persist.

## Implementation boundaries

This architecture change includes:

- adding `dexie` and `dexie-react-hooks` as the local persistence layer required by the existing architectural decisions;
- creating the Space-aware database schema;
- persisting Spaces and active Space preference;
- migrating current legacy data and current Personal object-type definitions to Personal Space;
- connecting current object type/object queries to `spaceId` where those flows already exist;
- making new Spaces blank;
- adding regression tests for isolation and persistence.

This architecture change does not include:

- Firestore synchronization implementation;
- cross-Space copy/move UI;
- global search across Spaces;
- templates that seed object types into a Space;
- collaborative permissions/access control UI;
- account/team Spaces beyond the local account boundary already modeled;
- Space deletion UI.

## Expected implementation shape

The exact file names should follow the current repository at implementation time, but the intended boundaries are:

- `src/lib/db.ts`: Dexie database and versioned schema.
- a Space repository/service module: persistent CRUD and isolation-aware operations.
- a migration/bootstrap module for assigning legacy records and existing Personal object-type definitions to Personal Space.
- the workspace provider/store: active Space coordination only, not authoritative domain storage.
- Space-scoped hooks/selectors using `dexie-react-hooks`.
- current sidebar/object-type/object consumers updated to use active-Space queries.
- focused unit/database/Playwright tests.

## Compatibility with project decisions

This design preserves the current architectural constraints:

- Dexie/IndexedDB remains the local-first source of truth.
- React/Zustand remains transient UI state rather than persistent domain state.
- persistent entities continue to follow the `BaseEntity` model in `SPEC.md`.
- future Firestore sync can use `spaceId` as a required partition key.
- the UI continues to mirror Capacities while the domain model enforces isolation beneath the visual layer.

## Source trail

Primary project/reference evidence reviewed for this decision:

- `AGENTS.md` on `dev`.
- `DECISIONS.md` on `dev`.
- `SPEC.md` on `dev`.
- `openspec/changes/define-workspace-spaces/specs/workspace-spaces/spec.md` on `old`.
- `src/lib/workspace-account-spaces.ts` on `old-4`.
- `src/lib/workspace-database.ts` on `old-4`.
- historical branches `old`, `old-2`, `old-3`, and `old-4` for evolution context.
- preserved Capacities source/documentation bundle and URL inventories in the project reference corpus.

## Acceptance criteria for the architectural change

The implementation is complete only when all of the following are true:

1. A newly created Space persists after reload.
2. A newly created Space contains no user object types or objects.
3. Personal Space retains existing content and its current object-type catalog after migration.
4. Creating data in one Space never makes it visible in another Space through ordinary object type/object/search/relation flows.
5. Switching Spaces updates all connected data-bearing UI surfaces to the selected Space.
6. Cross-Space relations are rejected by domain/repository logic.
7. Active Space restoration is resilient to missing/deleted Space IDs.
8. Automated tests cover persistence, blank creation, migration/bootstrap, and isolation.
