# Space-Scoped Data Implementation Index

> **For agentic workers:** This is the authoritative entry point for the three Space implementation plans below. Read this file first. When a child-plan code snippet conflicts with an invariant here, this file wins.

**Goal:** Execute the approved Space architecture without key collisions, unscoped IndexedDB reads, or duplicate UI/domain mappings.

**Architecture spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

## Execution order

1. `docs/superpowers/plans/2026-09-04-space-persistence-foundation.md`
2. `docs/superpowers/plans/2026-09-04-space-object-data-isolation.md`
3. `docs/superpowers/plans/2026-09-04-space-projections-and-audit.md`

Do not start plan 2 until plan 1 verification passes. Do not start plan 3 until plan 2 verification passes.

## Mandatory keying invariant

Space-owned logical IDs are allowed to repeat in different Spaces. This is required for deterministic tag/collection IDs, built-in/template object types, imports, and future copy workflows.

Therefore **no Space-owned table may use `id` alone as its primary key**.

Use compound primary keys `[spaceId+id]` for:

- `objectTypes`
- `entities`
- `collections`
- `tags`
- `relations`
- `media`
- `spaceSettings`
- `trash`

`spaces` remains keyed by `id`. `appSettings` remains keyed by `id` because those records are account/application preferences rather than Space-owned domain records.

### Authoritative Dexie schema

Plan 1 database version 1:

```ts
this.version(1).stores({
  spaces: "id, accountId, sortOrder, [accountId+sortOrder], name, createdAt, updatedAt",
  appSettings: "id",
  objectTypes: "[spaceId+id], spaceId, id, ownership, lifecycleKind",
});
```

Plan 2 database version 2:

```ts
this.version(2).stores({
  spaces: "id, accountId, sortOrder, [accountId+sortOrder], name, createdAt, updatedAt",
  appSettings: "id",
  objectTypes: "[spaceId+id], spaceId, id, ownership, lifecycleKind",
  entities:
    "[spaceId+id], spaceId, id, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
  collections:
    "[spaceId+id], spaceId, id, [spaceId+structureId], structureId, name",
  tags: "[spaceId+id], spaceId, id, [spaceId+name], name",
  relations:
    "[spaceId+id], spaceId, id, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
  media: "[spaceId+id], spaceId, id, [spaceId+mimeType], mimeType, updatedAt",
});
```

Plan 3 database version 3:

```ts
this.version(3).stores({
  spaces: "id, accountId, sortOrder, [accountId+sortOrder], name, createdAt, updatedAt",
  appSettings: "id",
  objectTypes: "[spaceId+id], spaceId, id, ownership, lifecycleKind",
  entities:
    "[spaceId+id], spaceId, id, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
  collections:
    "[spaceId+id], spaceId, id, [spaceId+structureId], structureId, name",
  tags: "[spaceId+id], spaceId, id, [spaceId+name], name",
  relations:
    "[spaceId+id], spaceId, id, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
  media: "[spaceId+id], spaceId, id, [spaceId+mimeType], mimeType, updatedAt",
  spaceSettings: "[spaceId+id], spaceId, id, [spaceId+key], key, updatedAt",
  trash: "[spaceId+id], spaceId, id, [spaceId+entityId], entityId, purgeAfter, trashedAt",
});
```

Any child-plan snippet that declares a Space-owned store as `"id, spaceId, ..."` is superseded by these declarations.

## Typed Dexie tables

Use `Table` for compound-key tables:

```ts
import Dexie, { type EntityTable, type Table } from "dexie";

export class KnowledgeDatabase extends Dexie {
  spaces!: EntityTable<SpaceRecord, "id">;
  appSettings!: EntityTable<AppSettingRecord, "id">;
  objectTypes!: Table<SpaceObjectTypeRecord, [string, string]>;
  entities!: Table<SpaceEntityRecord, [string, string]>;
  collections!: Table<SpaceCollectionRecord, [string, string]>;
  tags!: Table<SpaceTagRecord, [string, string]>;
  relations!: Table<SpaceRelationRecord, [string, string]>;
  media!: Table<SpaceMediaRecord, [string, string]>;
  spaceSettings!: Table<SpaceSettingRecord, [string, string]>;
  trash!: Table<SpaceTrashRecord, [string, string]>;
}
```

Only declare properties for tables introduced by the current database version; the full example above shows the final class shape.

## Lookup invariant

Never load a Space-owned record by logical ID alone.

Correct:

```ts
await database.objectTypes.get([spaceId, objectTypeId]);
await database.entities.get([spaceId, entityId]);
await database.collections.get([spaceId, collectionId]);
await database.tags.get([spaceId, tagId]);
await database.media.get([spaceId, mediaId]);
```

Incorrect:

```ts
await database.entities.get(entityId);
```

Space-scoped list queries start with the `spaceId` index:

```ts
await database.entities.where("spaceId").equals(spaceId).toArray();
```

## Vitest configuration

Plan 1 must also create `vitest.config.ts` because new unit tests use the repository's `@/` import alias.

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
  },
});
```

Include `vitest.config.ts` in the Task 1 foundation commit and final verification.

## Presenter invariant

Do not create a second manually maintained object-icon registry. `src/components/app-sidebar-object-type-studio.tsx` already uses `objectTypeDefinitionById` from `src/components/object-icons.tsx` to resolve `iconName` to a React icon.

`workspace-object-type-presenter.ts` must reuse the same source:

```ts
import { objectTypeDefinitionById } from "@/components/object-icons";

const definition = objectTypeDefinitionById[record.iconName];
if (!definition) {
  throw new Error(`Unknown object icon: ${record.iconName}`);
}

return {
  id: record.id,
  label: record.pluralName,
  singularLabel: record.singularName,
  icon: definition.icon,
  iconName: record.iconName,
  tone: record.tone,
  ownership: record.ownership,
  count,
};
```

The presenter test remains mandatory.

## Failure-handling invariant

Create/switch/reorder operations are asynchronous Dexie writes. UI callbacks must not create a second optimistic authoritative copy.

- `createSpace` becomes active only because the Dexie transaction commits the Space and active setting together.
- `switchSpace` validates the target Space before updating `appSettings`.
- `reorderSpaces` writes every `sortOrder` in one transaction.
- Provider callbacks catch persistence errors and route them through the existing `showMessage` mechanism; they do not mutate React domain arrays as a fallback.

## Blank-Space invariant

`createBlankSpace` may write only:

- `spaces`
- `appSettings`

It must not write to `objectTypes`, `entities`, `collections`, `tags`, `relations`, `media`, `spaceSettings`, or `trash`.

Personal bootstrap is the only path that automatically materializes the current built-in object type catalog, and it writes those rows with `spaceId === "personal"`.

## Final acceptance commands

After all three plans:

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts tests/space-object-isolation.spec.ts
pnpm lint
pnpm build
```

Then audit direct reads:

```bash
rg "db\.(objectTypes|entities|collections|tags|relations|media|spaceSettings|trash)" src
rg "useState.*(spaces|objectTypes|createdEntities|objectTypeCollections|trashItems|media)" src/components src/hooks
```

No implementation is complete until the Space-specific tests pass and the read audit finds no unscoped Space-owned access.
