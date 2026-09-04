# Space Object Data Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist object types, entities, collections, tags, media metadata, and relations per active Space so data created in one Space never appears in another.

**Architecture:** Extend the Dexie schema created by the Space persistence foundation. All Space-owned tables carry `spaceId`, all repository reads require a Space, and all UI callbacks route through the active Space. Existing pure object-type domain functions remain responsible for validation; repository code supplies only the active Space registry to those functions.

**Tech Stack:** TypeScript, Dexie.js, dexie-react-hooks, Vitest + fake-indexeddb, React 19, Playwright, Biome, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

**Prerequisite:** Complete `docs/superpowers/plans/2026-09-04-space-persistence-foundation.md` first.

## Global Constraints

- Every persistent object type/entity/collection/tag/relation/media row has `spaceId`.
- UI may not construct global arrays by merging Spaces.
- Entity creation requires an object type belonging to the same Space.
- Relation source and target must both belong to the same Space.
- New blank Spaces remain empty until the user explicitly creates data there.
- Dexie remains authoritative.

---

### Task 1: Extend the Dexie schema with Space-owned domain tables

**Files:**
- Create: `src/types/schema.ts`
- Modify: `src/lib/spaces/space-types.ts`
- Modify: `src/lib/db.ts`
- Modify: `src/lib/db.test.ts`

**Interfaces:**
- Produces: `BaseEntity`, `SpaceEntityRecord`, `SpaceCollectionRecord`, `SpaceTagRecord`, `SpaceRelationRecord`, `SpaceMediaRecord`.

- [ ] **Step 1: Create `src/types/schema.ts` from `SPEC.md`**

```ts
export type SystemEntityType =
  | "page"
  | "file"
  | "highlight"
  | "flashcard"
  | "study_goal"
  | "tag"
  | (string & {});

export type ContentBlock = {
  id: string;
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bullet_list"
    | "numbered_list"
    | "code"
    | "callout"
    | "quote"
    | "divider";
  content: string;
  annotations?: Record<string, boolean | string>;
  metadata?: Record<string, unknown>;
};

export type EntityRelation = {
  propertyId: string;
  propertyName: string;
  targetEntityId: string;
  targetEntityType: string;
  createdAt: string;
};

export type BaseEntity = {
  id: string;
  type: SystemEntityType;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  coverImage?: string;
  blocks: ContentBlock[];
  tags: string[];
  relations: EntityRelation[];
  properties: Record<string, unknown>;
  _syncStatus?: "synced" | "pending" | "conflict";
};
```

- [ ] **Step 2: Add Space-owned record types**

Append to `src/lib/spaces/space-types.ts`:

```ts
import type { BaseEntity } from "@/types/schema";

export type SpaceEntityRecord = BaseEntity & {
  spaceId: string;
  objectTypeId: string;
};

export type SpaceCollectionRecord = {
  id: string;
  spaceId: string;
  structureId: string;
  name: string;
};

export type SpaceTagRecord = {
  id: string;
  spaceId: string;
  name: string;
};

export type SpaceRelationRecord = {
  id: string;
  spaceId: string;
  sourceId: string;
  targetId: string;
  propertyId: string;
  createdAt: string;
};

export type SpaceMediaRecord = {
  id: string;
  spaceId: string;
  name: string;
  mimeType: string;
  blobKey?: string;
  createdAt: string;
  updatedAt: string;
};
```

- [ ] **Step 3: Write RED schema assertions**

Add to `src/lib/db.test.ts`:

```ts
it("indexes every Space-owned domain table by spaceId", async () => {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  await database.open();

  for (const tableName of ["entities", "collections", "tags", "relations", "media"]) {
    expect(database.table(tableName).schema.indexes.some((index) => index.name === "spaceId")).toBe(true);
  }
});
```

- [ ] **Step 4: Verify RED**

```bash
pnpm vitest run src/lib/db.test.ts
```

- [ ] **Step 5: Add tables to `KnowledgeDatabase`**

Add EntityTable properties and upgrade the schema to version 2:

```ts
this.version(2).stores({
  spaces: "id, accountId, [accountId+sortOrder], name, createdAt, updatedAt",
  appSettings: "id",
  objectTypes: "id, spaceId, [spaceId+id], ownership, lifecycleKind",
  entities: "id, spaceId, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
  collections: "id, spaceId, [spaceId+structureId], structureId, name",
  tags: "id, spaceId, [spaceId+name], name",
  relations: "id, spaceId, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
  media: "id, spaceId, [spaceId+mimeType], mimeType, updatedAt",
});
```

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/db.test.ts
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add src/types/schema.ts src/lib/spaces/space-types.ts src/lib/db.ts src/lib/db.test.ts
git commit -m "feat: add Space-owned data tables"
```

---

### Task 2: Persist object type CRUD inside one Space

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/components/workspace-controller.tsx`

**Interfaces:**
- Produces repository methods `createObjectType`, `createObjectTypeFromPreset`, `replaceObjectType`, `deleteObjectType`, `listObjectTypes`.
- Produces existing context callbacks backed by those methods: `createWorkspaceStructureFromPreset`, `createWorkspaceStructure`, `updateWorkspaceStructure`, `deleteWorkspaceStructure`.

- [ ] **Step 1: Write RED isolation test**

```ts
it("creates an object type only in the requested Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.createObjectType(first.id, {
    singularName: "Book",
    pluralName: "Books",
    iconName: "book",
    tone: "purple",
    lifecycleKind: "document",
  });

  expect((await repository.listObjectTypes(first.id)).map((item) => item.pluralName)).toEqual(["Books"]);
  expect(await repository.listObjectTypes(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

- [ ] **Step 3: Implement `createObjectType`**

```ts
async function createObjectType(spaceId: string, input: CreateStructureInput) {
  const current = await listObjectTypes(spaceId);
  const result = createCustomStructure(
    current.map(({ spaceId: _spaceId, ...structure }) => structure),
    input,
  );
  if (!result.ok) throw new Error(result.error.message);
  await replaceObjectTypes(spaceId, result.value);
}
```

Implement `replaceObjectTypes(spaceId, structures)` as one transaction that deletes only `objectTypes.where("spaceId").equals(spaceId)` and bulk-adds `structures.map(structure => ({ ...structure, spaceId }))`.

- [ ] **Step 4: Implement preset/update/delete with the same boundary**

Use `instantiateObjectTypePreset`, existing update functions, and `deleteStructure` only against the active Space registry. No method may call these functions with a registry containing more than one Space.

- [ ] **Step 5: Wire `WorkspaceProvider` callbacks**

```ts
const createWorkspaceStructure = React.useCallback(
  async (input: CreateStructureInput) => {
    if (!activeSpaceId) return;
    await repository.createObjectType(activeSpaceId, input);
  },
  [activeSpaceId, repository],
);
```

Apply the same pattern to preset/create/update/delete callbacks.

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/components/workspace-controller.tsx
git commit -m "feat: scope object types to Spaces"
```

---

### Task 3: Persist entities and reject cross-Space relation targets

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/hooks/use-space-data.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions-command-dialog.tsx`

**Interfaces:**
- Produces: `createEntity(spaceId, objectTypeId, title)`, `listEntities(spaceId)`, `assertSameSpaceEntityTargets(spaceId, sourceId, targetId)`, `createRelation(record)`.

- [ ] **Step 1: Write RED entity isolation test**

```ts
it("keeps entities isolated by Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.createObjectType(first.id, {
    singularName: "Book",
    pluralName: "Books",
    iconName: "book",
    tone: "purple",
    lifecycleKind: "document",
  });
  const typeId = (await repository.listObjectTypes(first.id))[0].id;
  await repository.createEntity(first.id, typeId, "Domain-Driven Design");

  expect((await repository.listEntities(first.id)).map((item) => item.title)).toEqual([
    "Domain-Driven Design",
  ]);
  expect(await repository.listEntities(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Write RED relation guard test**

```ts
it("rejects relations across Spaces", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await database.entities.bulkAdd([
    entityFixture({ id: "source", spaceId: first.id, objectTypeId: "page" }),
    entityFixture({ id: "target", spaceId: second.id, objectTypeId: "page" }),
  ]);

  await expect(
    repository.createRelation({
      id: "relation:source:target",
      spaceId: first.id,
      sourceId: "source",
      targetId: "target",
      propertyId: "related",
      createdAt: new Date(0).toISOString(),
    }),
  ).rejects.toThrow("Cross-Space relation");
});
```

Define `entityFixture` in the test file to return a valid `SpaceEntityRecord` with empty blocks/tags/relations/properties and `_syncStatus: "pending"`.

- [ ] **Step 3: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

- [ ] **Step 4: Implement entity creation**

Before insert verify the object type exists in the same Space. Persist:

```ts
const timestamp = new Date().toISOString();
const entity: SpaceEntityRecord = {
  id: `entity-${crypto.randomUUID()}`,
  spaceId,
  objectTypeId,
  type: objectTypeId,
  title: title.trim() || "Untitled",
  createdAt: timestamp,
  updatedAt: timestamp,
  blocks: [],
  tags: [],
  relations: [],
  properties: {},
  _syncStatus: "pending",
};
```

If the type does not exist in `spaceId`, throw `Unknown object type in active Space.`

- [ ] **Step 5: Implement relation guard**

```ts
async function assertSameSpaceEntityTargets(spaceId: string, sourceId: string, targetId: string) {
  const [source, target] = await Promise.all([
    database.entities.get(sourceId),
    database.entities.get(targetId),
  ]);
  if (!source || !target || source.spaceId !== spaceId || target.spaceId !== spaceId) {
    throw new Error("Cross-Space relation is not allowed.");
  }
}
```

`createRelation` calls this guard before `database.relations.add(record)`.

- [ ] **Step 6: Extend `useSpaceData`**

```ts
const entityRecords = useLiveQuery(
  () => (activeSpaceId ? db.entities.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
```

Derive object type counts from these active-Space entities only.

- [ ] **Step 7: Wire entity creation**

`WorkspaceProvider.createWorkspaceEntity` calls `repository.createEntity(activeSpaceId, objectTypeId, label)`.

`NewContentCommandDialog` continues reading `objectTypes` from context; a blank Space therefore has no selectable type rows.

- [ ] **Step 8: GREEN + lint**

```bash
pnpm test:unit
pnpm lint
```

- [ ] **Step 9: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/hooks/use-space-data.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions-command-dialog.tsx
git commit -m "feat: isolate Space entities and relations"
```

---

### Task 4: Persist collections and tags per Space

**Files:**
- Modify: `src/lib/workspace-domain-identities.ts`
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/hooks/use-space-data.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`

**Interfaces:**
- Produces: `createCollection(spaceId, structureId, name)`, `deleteCollection(spaceId, collectionId)`, `createTag(spaceId, name)`, `deleteTag(spaceId, tagId)`.

- [ ] **Step 1: Write RED collection/tag isolation test**

```ts
it("keeps collections and tags in one Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.createCollection(first.id, "book", "Unread");
  await repository.createTag(first.id, "Important");

  expect((await database.collections.where("spaceId").equals(first.id).toArray()).map((item) => item.name)).toEqual(["Unread"]);
  expect(await database.collections.where("spaceId").equals(second.id).count()).toBe(0);
  expect((await database.tags.where("spaceId").equals(first.id).toArray()).map((item) => item.name)).toEqual(["Important"]);
  expect(await database.tags.where("spaceId").equals(second.id).count()).toBe(0);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

- [ ] **Step 3: Implement collection write**

```ts
async function createCollection(spaceId: string, structureId: string, name: string) {
  const normalized = name.trim();
  if (!normalized) throw new Error("Collection name is required.");
  const used = new Set(
    (await database.collections.where("spaceId").equals(spaceId).toArray()).map((item) => item.id),
  );
  const id = createCollectionId(structureId, normalized, used);
  await database.collections.add({ id, spaceId, structureId, name: normalized });
  return id;
}
```

`deleteCollection` loads by ID and requires matching `spaceId` before deletion.

- [ ] **Step 4: Implement tag write**

Use `createTagId` exactly the same way, but only with IDs already used in the supplied Space. `deleteTag` requires matching `spaceId` before deletion.

- [ ] **Step 5: Extend live queries**

```ts
const collectionRecords = useLiveQuery(
  () => (activeSpaceId ? db.collections.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
const tagRecords = useLiveQuery(
  () => (activeSpaceId ? db.tags.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
```

- [ ] **Step 6: Replace global collection writes in sidebar**

In `app-sidebar-primary-actions.tsx`, replace `setObjectTypeCollections(current => ...)` creation/deletion paths with context methods that call `createCollection(activeSpaceId, ...)` or `deleteCollection(activeSpaceId, ...)`. Keep `hiddenCollectionIds` local because it is a transient UI preference, not domain data.

- [ ] **Step 7: GREEN + lint**

```bash
pnpm test:unit
pnpm lint
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/workspace-domain-identities.ts src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/hooks/use-space-data.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions.tsx
git commit -m "feat: isolate Space collections and tags"
```

---

### Task 5: Browser proof that object data does not leak

**Files:**
- Create: `tests/space-object-isolation.spec.ts`

- [ ] **Step 1: Add Playwright isolation flow**

The test must perform these user-visible assertions in order:
1. Personal Space shows the built-in `Pages` type.
2. Create `Blank Space`; it has no `Pages` type.
3. Create one custom object type in `Blank Space` through Object Type Studio.
4. Create one object of that type.
5. Switch to Personal Space; the custom type and object are absent.
6. Switch back; both are present.
7. Reload; active Space and created data remain present.

Use accessible role/text selectors from the current UI and existing Space/Object Type Studio tests. Do not add test-only production DOM unless an accessible selector is missing.

- [ ] **Step 2: Run focused Playwright**

```bash
pnpm exec playwright test tests/space-object-isolation.spec.ts
```

Expected: PASS.

- [ ] **Step 3: Run full verification**

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts tests/space-object-isolation.spec.ts
pnpm lint
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit**

```bash
git add tests/space-object-isolation.spec.ts
git commit -m "test: prove Space object isolation"
```
