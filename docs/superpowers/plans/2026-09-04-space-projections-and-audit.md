# Space Projections and Isolation Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make search, backlinks, graph, media metadata, trash, and per-Space settings obey the active-Space boundary, then audit the implementation for any global reads or in-memory authoritative copies.

**Architecture:** Extend the Space-scoped Dexie model from the first two plans. Search/backlinks/graph are derived from Space-filtered entity/relation records rather than from account-global arrays. Media, trash, and per-Space settings are persisted with `spaceId`. The final audit proves all Space-owned database access either requires a Space ID or visibly applies a Space index before reading.

**Tech Stack:** TypeScript, Dexie.js, Vitest + fake-indexeddb, Playwright, Biome, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

**Prerequisites:** Complete `docs/superpowers/plans/2026-09-04-space-persistence-foundation.md` and `docs/superpowers/plans/2026-09-04-space-object-data-isolation.md` first.

## Global Constraints

- Search, backlinks, graph, media, trash, and settings are Space-scoped by default.
- No function may read account-global entity/relation/media/trash data and filter it only after returning it to UI code.
- Cross-Space search/graph is not introduced by this change.
- Space-owned rows carry `spaceId` and use a Space index.
- A new blank Space has no media or trash records and only internal settings that are explicitly created for that Space.
- Use `pnpm` only and Biome only.

---

### Task 1: Add per-Space settings and trash persistence

**Files:**
- Modify: `src/lib/spaces/space-types.ts`
- Modify: `src/lib/db.ts`
- Modify: `src/lib/db.test.ts`
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`

**Interfaces:**
- Produces: `SpaceSettingRecord`, `SpaceTrashRecord`, `getSpaceSetting`, `setSpaceSetting`, `listTrash`, `putTrash`, `deleteTrash`.

- [ ] **Step 1: Add record types**

Append to `src/lib/spaces/space-types.ts`:

```ts
export type SpaceSettingRecord = {
  id: string;
  spaceId: string;
  key: string;
  value: unknown;
  updatedAt: string;
};

export type SpaceTrashRecord = {
  id: string;
  spaceId: string;
  entityId: string;
  trashedAt: string;
  purgeAfter: string;
};
```

Use IDs in the form `setting:${spaceId}:${key}` and `trash:${spaceId}:${entityId}`.

- [ ] **Step 2: Write RED schema test**

Add to `src/lib/db.test.ts`:

```ts
it("indexes Space settings and trash by spaceId", async () => {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  await database.open();

  for (const tableName of ["spaceSettings", "trash"]) {
    expect(database.table(tableName).schema.indexes.some((index) => index.name === "spaceId")).toBe(true);
  }
});
```

- [ ] **Step 3: Verify RED**

```bash
pnpm vitest run src/lib/db.test.ts
```

Expected: FAIL because the tables do not exist.

- [ ] **Step 4: Add Dexie version 3 tables**

Add typed tables to `KnowledgeDatabase`, then declare:

```ts
this.version(3).stores({
  spaces: "id, accountId, [accountId+sortOrder], name, createdAt, updatedAt",
  appSettings: "id",
  objectTypes: "id, spaceId, [spaceId+id], ownership, lifecycleKind",
  entities: "id, spaceId, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
  collections: "id, spaceId, [spaceId+structureId], structureId, name",
  tags: "id, spaceId, [spaceId+name], name",
  relations: "id, spaceId, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
  media: "id, spaceId, [spaceId+mimeType], mimeType, updatedAt",
  spaceSettings: "id, spaceId, [spaceId+key], key, updatedAt",
  trash: "id, spaceId, [spaceId+entityId], entityId, purgeAfter, trashedAt",
});
```

- [ ] **Step 5: Write RED repository isolation test**

```ts
it("keeps settings and trash isolated by Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.setSpaceSetting(first.id, "sidebar.sort", "alphabetical");
  await repository.putTrash({
    id: `trash:${first.id}:entity-a`,
    spaceId: first.id,
    entityId: "entity-a",
    trashedAt: "2026-01-01T00:00:00.000Z",
    purgeAfter: "2026-02-01T00:00:00.000Z",
  });

  expect(await repository.getSpaceSetting(first.id, "sidebar.sort")).toBe("alphabetical");
  expect(await repository.getSpaceSetting(second.id, "sidebar.sort")).toBeNull();
  expect((await repository.listTrash(first.id)).map((item) => item.entityId)).toEqual(["entity-a"]);
  expect(await repository.listTrash(second.id)).toEqual([]);
});
```

- [ ] **Step 6: Implement repository methods**

```ts
async function setSpaceSetting(spaceId: string, key: string, value: unknown) {
  if (!(await database.spaces.get(spaceId))) throw new Error(`Unknown Space: ${spaceId}`);
  await database.spaceSettings.put({
    id: `setting:${spaceId}:${key}`,
    spaceId,
    key,
    value: structuredClone(value),
    updatedAt: new Date().toISOString(),
  });
}

async function getSpaceSetting(spaceId: string, key: string) {
  return (await database.spaceSettings.get(`setting:${spaceId}:${key}`))?.value ?? null;
}

function listTrash(spaceId: string) {
  return database.trash.where("spaceId").equals(spaceId).toArray();
}
```

`putTrash` rejects records whose `record.spaceId` differs from the supplied Space; `deleteTrash(spaceId, id)` loads the record first and refuses to delete another Space's record.

- [ ] **Step 7: GREEN + lint**

```bash
pnpm vitest run src/lib/db.test.ts src/lib/spaces/space-repository.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/spaces/space-types.ts src/lib/db.ts src/lib/db.test.ts src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts
git commit -m "feat: scope Space settings and trash"
```

---

### Task 2: Add Space-scoped media metadata operations

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`

**Interfaces:**
- Produces: `putMedia(spaceId, record)`, `listMedia(spaceId)`, `deleteMedia(spaceId, mediaId)`.

- [ ] **Step 1: Write RED media isolation test**

```ts
it("keeps media metadata isolated by Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.putMedia(first.id, {
    id: "media-a",
    spaceId: first.id,
    name: "paper.pdf",
    mimeType: "application/pdf",
    blobKey: "blob-a",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });

  expect((await repository.listMedia(first.id)).map((item) => item.id)).toEqual(["media-a"]);
  expect(await repository.listMedia(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

- [ ] **Step 3: Implement media methods**

```ts
async function putMedia(spaceId: string, record: SpaceMediaRecord) {
  if (record.spaceId !== spaceId) throw new Error("Media Space mismatch.");
  if (!(await database.spaces.get(spaceId))) throw new Error(`Unknown Space: ${spaceId}`);
  await database.media.put(record);
}

function listMedia(spaceId: string) {
  return database.media.where("spaceId").equals(spaceId).toArray();
}
```

`deleteMedia` loads by ID and requires the stored row's `spaceId` to match before deletion.

- [ ] **Step 4: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
pnpm lint
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts
git commit -m "feat: scope media metadata to Spaces"
```

---

### Task 3: Add Space-scoped search, backlinks, and graph projections

**Files:**
- Create: `src/lib/spaces/space-projections.ts`
- Create: `src/lib/spaces/space-projections.test.ts`

**Interfaces:**
- Consumes: `KnowledgeDatabase`, `SpaceEntityRecord`, `SpaceRelationRecord`.
- Produces:
  - `searchEntitiesInSpace(database, spaceId, query): Promise<SpaceEntityRecord[]>`
  - `listBacklinksInSpace(database, spaceId, targetId): Promise<SpaceEntityRecord[]>`
  - `buildGraphInSpace(database, spaceId): Promise<SpaceGraphProjection>`
  - `SpaceGraphProjection = { nodes: { id: string; title: string; objectTypeId: string }[]; edges: { id: string; sourceId: string; targetId: string; propertyId: string }[] }`.

- [ ] **Step 1: Write exact RED search test**

```ts
it("search returns matching entities only from the requested Space", async () => {
  await database.entities.bulkAdd([
    entityFixture({ id: "personal-a", spaceId: "personal", title: "Shared phrase" }),
    entityFixture({ id: "other-a", spaceId: "other", title: "Shared phrase" }),
  ]);

  expect((await searchEntitiesInSpace(database, "personal", "shared")).map((item) => item.id)).toEqual([
    "personal-a",
  ]);
});
```

Define in the test:

```ts
function entityFixture(
  input: Partial<SpaceEntityRecord> & Pick<SpaceEntityRecord, "id" | "spaceId" | "title">,
): SpaceEntityRecord {
  return {
    objectTypeId: "page",
    type: "page",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    _syncStatus: "pending",
    ...input,
  };
}
```

- [ ] **Step 2: Write exact RED backlink test**

```ts
it("backlinks return sources only from the requested Space", async () => {
  await database.entities.bulkAdd([
    entityFixture({ id: "p-source", spaceId: "personal", title: "Personal source" }),
    entityFixture({ id: "p-target", spaceId: "personal", title: "Personal target" }),
    entityFixture({ id: "o-source", spaceId: "other", title: "Other source" }),
  ]);
  await database.relations.bulkAdd([
    {
      id: "p-rel",
      spaceId: "personal",
      sourceId: "p-source",
      targetId: "p-target",
      propertyId: "related",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "o-rel",
      spaceId: "other",
      sourceId: "o-source",
      targetId: "p-target",
      propertyId: "related",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ]);

  expect(
    (await listBacklinksInSpace(database, "personal", "p-target")).map((item) => item.id),
  ).toEqual(["p-source"]);
});
```

The intentionally malformed `o-rel` proves the projection filters by relation `spaceId` before resolving sources.

- [ ] **Step 3: Write exact RED graph test**

```ts
it("graph contains only nodes and edges from one Space", async () => {
  await database.entities.bulkAdd([
    entityFixture({ id: "p-a", spaceId: "personal", title: "A" }),
    entityFixture({ id: "p-b", spaceId: "personal", title: "B" }),
    entityFixture({ id: "o-a", spaceId: "other", title: "Other" }),
  ]);
  await database.relations.bulkAdd([
    {
      id: "p-edge",
      spaceId: "personal",
      sourceId: "p-a",
      targetId: "p-b",
      propertyId: "related",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "o-edge",
      spaceId: "other",
      sourceId: "o-a",
      targetId: "p-b",
      propertyId: "related",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ]);

  const graph = await buildGraphInSpace(database, "personal");
  expect(graph.nodes.map((node) => node.id)).toEqual(["p-a", "p-b"]);
  expect(graph.edges.map((edge) => edge.id)).toEqual(["p-edge"]);
});
```

- [ ] **Step 4: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
```

Expected: FAIL because projection module does not exist.

- [ ] **Step 5: Implement normalized search**

```ts
function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export async function searchEntitiesInSpace(
  database: KnowledgeDatabase,
  spaceId: string,
  query: string,
) {
  const normalized = normalizeSearchText(query.trim());
  const entities = await database.entities.where("spaceId").equals(spaceId).toArray();
  if (!normalized) return entities;
  return entities.filter((entity) =>
    normalizeSearchText([entity.title, entity.type, entity.objectTypeId].join(" ")).includes(normalized),
  );
}
```

- [ ] **Step 6: Implement backlinks and graph Space-first**

`listBacklinksInSpace` first fetches `database.relations.where("spaceId").equals(spaceId).toArray()`, filters `targetId`, then resolves only source IDs from that filtered relation set and discards any loaded entity whose `spaceId !== spaceId`.

`buildGraphInSpace` independently reads entities and relations by `spaceId`; it includes an edge only when both source and target IDs are in the Space node set.

- [ ] **Step 7: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/spaces/space-projections.ts src/lib/spaces/space-projections.test.ts
git commit -m "feat: add Space-scoped projections"
```

---

### Task 4: Connect current data-bearing search/trash surfaces to active Space

**Files:**
- Modify: `src/hooks/use-space-data.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`

**Interfaces:**
- Consumes: active Space ID, projection helpers, trash repository methods.
- Produces: active-Space `trashItems`, `emptyTrash`, `purgeTrashItem`, `restoreTrashItem`, and search result source exposed through current workspace callbacks.

- [ ] **Step 1: Extend `useSpaceData` with trash**

```ts
const trashRecords = useLiveQuery(
  () => (activeSpaceId ? db.trash.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
```

Return `trashRecords` alongside active entities/object types/collections/tags.

- [ ] **Step 2: Replace default trash no-ops in `WorkspaceProvider`**

`trashItems` derives only from `trashRecords`. `purgeTrashItem(id)` and `restoreTrashItem(id)` must call repository methods with `activeSpaceId`; the repository validates ownership before deleting/restoring.

`emptyTrash()` obtains `repository.listTrash(activeSpaceId)` then deletes only those IDs in one Dexie transaction. It never calls `db.trash.clear()`.

- [ ] **Step 3: Route workspace search through the active Space helper**

Where the current command/search controller asks the provider for searchable entities, expose:

```ts
searchWorkspace: (query: string) =>
  activeSpaceId ? searchEntitiesInSpace(db, activeSpaceId, query) : Promise.resolve([]),
```

Do not expose a raw `db.entities.toArray()` callback.

- [ ] **Step 4: Unit regression assertion**

Add a provider/repository-level unit test or extend projection tests so the callback used by search is invoked with two Spaces present and returns only the active Space entity ID. The expected array must be exactly `['personal-a']` for Personal and `['other-a']` after switching active Space.

- [ ] **Step 5: GREEN + lint**

```bash
pnpm test:unit
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-space-data.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions.tsx
git commit -m "feat: bind projections to active Space"
```

---

### Task 5: Run final Space-boundary architecture audit

**Files:** Review all Space implementation files; modify only concrete defects found by the commands below.

- [ ] **Step 1: Verify schema indexes**

```bash
pnpm vitest run src/lib/db.test.ts
```

Expected: every Space-owned table (`objectTypes`, `entities`, `collections`, `tags`, `relations`, `media`, `spaceSettings`, `trash`) reports a `spaceId` index.

- [ ] **Step 2: Find direct Space-owned database reads**

```bash
rg "db\.(objectTypes|entities|collections|tags|relations|media|spaceSettings|trash)" src
```

For every result, verify one of these is true:
- it is inside a repository/projection function whose public signature requires `spaceId`; or
- the read visibly begins with `where("spaceId").equals(spaceId)` or an equivalent compound Space index.

Any `toArray()`, `count()`, `clear()`, `bulkGet()`, or `get()` path that can cross Space ownership must be corrected before proceeding.

- [ ] **Step 3: Find authoritative persistent domain arrays in React state**

```bash
rg "useState.*(spaces|objectTypes|createdEntities|objectTypeCollections|trashItems|media)" src/components src/hooks
```

Expected: no persistent domain array is authoritative in `WorkspaceProvider`; transient open/selection/tab state is allowed.

- [ ] **Step 4: Verify blank creation invariant**

Inspect `createBlankSpace`. It may write only `spaces` and `appSettings`. Confirm with:

```bash
rg -n "createBlankSpace|objectTypes|entities|collections|tags|relations|media|trash" src/lib/spaces/space-repository.ts
```

The function body itself must contain no write to a Space-owned content table.

- [ ] **Step 5: Verify Personal bootstrap isolation**

```bash
pnpm vitest run src/lib/spaces/bootstrap-workspace.test.ts
```

Expected: repeated bootstrap leaves non-Personal Space object type/entity counts unchanged.

- [ ] **Step 6: Run all Space-specific tests**

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts tests/space-object-isolation.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Run project verification**

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 8: Commit audit fixes only when necessary**

If Steps 1–7 required source changes:

```bash
git add <files-changed-by-the-audit>
git commit -m "fix: enforce Space isolation invariants"
```

If no source changes were required, do not create an empty commit.
