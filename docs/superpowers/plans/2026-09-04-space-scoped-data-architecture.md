# Space-Scoped Data Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Space a durable, isolated local-first knowledge environment, with Personal Space retaining the current catalog and every newly created Space starting blank.

**Architecture:** Use one Dexie database named `KnowledgeOS_DB`. Every Space-owned record is partitioned by `spaceId`; React Context coordinates active Space and transient UI state, while Dexie is authoritative for Spaces, object types, entities, collections, tags, relations, media metadata, Space order, and active-Space preference. Personal Space is bootstrapped once with the existing built-in object type catalog; new Spaces insert only their Space record and become active after the transaction succeeds.

**Tech Stack:** Next.js 16.3+, React 19.2+, TypeScript, Dexie.js, dexie-react-hooks, IndexedDB, Vitest + fake-indexeddb, Playwright, Biome, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

## Global Constraints

- Local database name is exactly `KnowledgeOS_DB`.
- Dexie/IndexedDB is the local-first source of truth for persistent domain reads and writes.
- React Context/Zustand is transient coordination/UI state only.
- Every Space-owned persistent record carries `spaceId`.
- A new Space starts with zero object types, objects, collections, tags, relations, media, search entries, and trash entries.
- The current built-in catalog is materialized only in Personal Space.
- Cross-Space relations are rejected in repository/domain code.
- Space order is persisted with `sortOrder`; reorder must survive reload.
- Use `pnpm` only and Biome only.
- Preserve current Space switcher visual behavior; this change is data architecture, not a redesign.

---

## File map

### Create
- `src/types/schema.ts` — persistent BaseEntity primitives from `SPEC.md`.
- `src/lib/db.ts` — Dexie database and schema.
- `src/lib/db.test.ts` — IndexedDB schema tests.
- `src/lib/spaces/space-types.ts` — Space and Space-owned record types.
- `src/lib/spaces/space-repository.ts` — Space CRUD, sort order, active Space preference, scoped writes, relation guard.
- `src/lib/spaces/space-repository.test.ts` — repository isolation tests.
- `src/lib/spaces/personal-space-seed.ts` — Personal-only built-in catalog seed.
- `src/lib/spaces/personal-space-seed.test.ts` — seed tests.
- `src/lib/spaces/bootstrap-workspace.ts` — idempotent first-run bootstrap/migration.
- `src/lib/spaces/bootstrap-workspace.test.ts` — migration/idempotence tests.
- `src/hooks/use-space-data.ts` — Dexie live queries scoped to active Space.
- `src/components/workspace-object-type-presenter.ts` — serializable iconName -> existing icon component mapping.
- `src/components/workspace-object-type-presenter.test.ts` — mapping regression test.
- `src/lib/spaces/space-projections.ts` — Space-scoped search/backlink/graph projections.
- `src/lib/spaces/space-projections.test.ts` — no-leak projection tests.
- `tests/space-isolation.spec.ts` — browser persistence/isolation coverage.

### Modify
- `package.json`
- `pnpm-lock.yaml`
- `src/components/workspace-controller.tsx`
- `src/components/app-sidebar-primary-actions.tsx`
- `src/components/app-sidebar-primary-actions-command-dialog.tsx`
- `src/lib/workspace-domain-identities.ts`
- `tests/space-create-state.spec.ts`

---

### Task 1: Add Dexie and the persistent Space schema

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/types/schema.ts`
- Create: `src/lib/spaces/space-types.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/db.test.ts`

**Interfaces:**
- Produces: `KnowledgeDatabase`, `createKnowledgeDatabase`, `db`, `SpaceRecord`, `AppSettingRecord`, Space-owned record types, `PERSONAL_SPACE_ID`, `ACTIVE_SPACE_SETTING_ID`.

- [ ] **Step 1: Add dependencies**

```bash
pnpm add dexie dexie-react-hooks
pnpm add -D vitest fake-indexeddb
```

Add to `package.json` scripts:

```json
"test:unit": "vitest run"
```

- [ ] **Step 2: Create `src/types/schema.ts`**

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

- [ ] **Step 3: Create `src/lib/spaces/space-types.ts`**

```ts
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { BaseEntity } from "@/types/schema";

export const PERSONAL_SPACE_ID = "personal";
export const LOCAL_ACCOUNT_ID = "local-account";
export const ACTIVE_SPACE_SETTING_ID = "activeSpaceId";

export type SpaceRecord = {
  id: string;
  accountId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AppSettingRecord = { id: string; value: string };
export type SpaceObjectTypeRecord = WorkspaceStructure & { spaceId: string };
export type SpaceEntityRecord = BaseEntity & { spaceId: string; objectTypeId: string };
export type SpaceCollectionRecord = {
  id: string;
  spaceId: string;
  structureId: string;
  name: string;
};
export type SpaceTagRecord = { id: string; spaceId: string; name: string };
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

- [ ] **Step 4: Write RED schema test in `src/lib/db.test.ts`**

```ts
import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createKnowledgeDatabase } from "./db";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

describe("KnowledgeDatabase", () => {
  it("indexes every Space-owned table by spaceId", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    opened.push(database);
    await database.open();

    for (const tableName of [
      "objectTypes",
      "entities",
      "collections",
      "tags",
      "relations",
      "media",
    ]) {
      expect(database.table(tableName).schema.indexes.some((index) => index.name === "spaceId")).toBe(true);
    }
  });
});
```

- [ ] **Step 5: Verify RED**

```bash
pnpm vitest run src/lib/db.test.ts
```

Expected: FAIL because `src/lib/db.ts` does not exist.

- [ ] **Step 6: Create `src/lib/db.ts`**

```ts
import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettingRecord,
  SpaceCollectionRecord,
  SpaceEntityRecord,
  SpaceMediaRecord,
  SpaceObjectTypeRecord,
  SpaceRecord,
  SpaceRelationRecord,
  SpaceTagRecord,
} from "@/lib/spaces/space-types";

export class KnowledgeDatabase extends Dexie {
  spaces!: EntityTable<SpaceRecord, "id">;
  appSettings!: EntityTable<AppSettingRecord, "id">;
  objectTypes!: EntityTable<SpaceObjectTypeRecord, "id">;
  entities!: EntityTable<SpaceEntityRecord, "id">;
  collections!: EntityTable<SpaceCollectionRecord, "id">;
  tags!: EntityTable<SpaceTagRecord, "id">;
  relations!: EntityTable<SpaceRelationRecord, "id">;
  media!: EntityTable<SpaceMediaRecord, "id">;

  constructor(name = "KnowledgeOS_DB") {
    super(name);
    this.version(1).stores({
      spaces: "id, accountId, [accountId+sortOrder], name, createdAt, updatedAt",
      appSettings: "id",
      objectTypes: "id, spaceId, [spaceId+id], ownership, lifecycleKind",
      entities: "id, spaceId, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
      collections: "id, spaceId, [spaceId+structureId], structureId, name",
      tags: "id, spaceId, [spaceId+name], name",
      relations: "id, spaceId, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
      media: "id, spaceId, [spaceId+mimeType], mimeType, updatedAt",
    });
  }
}

export function createKnowledgeDatabase(name?: string) {
  return new KnowledgeDatabase(name);
}

export const db = createKnowledgeDatabase();
```

- [ ] **Step 7: GREEN + lint**

```bash
pnpm vitest run src/lib/db.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml src/types/schema.ts src/lib/spaces/space-types.ts src/lib/db.ts src/lib/db.test.ts
git commit -m "feat: add Space-scoped Dexie schema"
```

---

### Task 2: Add transaction-safe Space repository, activation, and reorder

**Files:**
- Create: `src/lib/spaces/space-repository.ts`
- Create: `src/lib/spaces/space-repository.test.ts`

**Interfaces:**
- Produces: `createSpaceRepository(database)` with `listSpaces`, `getActiveSpaceId`, `setActiveSpace`, `createBlankSpace`, `reorderSpaces`, Space-scoped list/write methods, and relation guard.

- [ ] **Step 1: Write RED tests**

Cover blank creation, activation, reorder persistence, and cross-Space relation rejection:

```ts
it("creates an active blank Space", async () => {
  const created = await repository.createBlankSpace("Research");
  expect(await repository.getActiveSpaceId()).toBe(created.id);
  expect(await database.objectTypes.where("spaceId").equals(created.id).count()).toBe(0);
  expect(await database.entities.where("spaceId").equals(created.id).count()).toBe(0);
  expect(await database.collections.where("spaceId").equals(created.id).count()).toBe(0);
  expect(await database.tags.where("spaceId").equals(created.id).count()).toBe(0);
  expect(await database.relations.where("spaceId").equals(created.id).count()).toBe(0);
  expect(await database.media.where("spaceId").equals(created.id).count()).toBe(0);
});

it("persists Space order", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");
  await repository.reorderSpaces([second.id, first.id]);
  expect((await repository.listSpaces()).map((space) => space.id)).toEqual([second.id, first.id]);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

Expected: FAIL because repository does not exist.

- [ ] **Step 3: Implement repository creation transaction**

`createBlankSpace` must:

```ts
const normalizedName = name.trim();
if (!normalizedName) throw new Error("Space name is required.");
const timestamp = now().toISOString();
const sortOrder = await database.spaces.count();
const record: SpaceRecord = {
  id: `space-${crypto.randomUUID()}`,
  accountId: LOCAL_ACCOUNT_ID,
  name: normalizedName,
  sortOrder,
  createdAt: timestamp,
  updatedAt: timestamp,
};

await database.transaction("rw", database.spaces, database.appSettings, async () => {
  await database.spaces.add(record);
  await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: record.id });
});
```

Do not touch any Space-owned table during blank creation.

- [ ] **Step 4: Implement reorder transaction**

```ts
async function reorderSpaces(orderedIds: readonly string[]) {
  const current = await listSpaces();
  if (orderedIds.length !== current.length || new Set(orderedIds).size !== current.length) {
    throw new Error("Space order must contain every Space exactly once.");
  }
  await database.transaction("rw", database.spaces, async () => {
    await Promise.all(
      orderedIds.map((id, sortOrder) => database.spaces.update(id, { sortOrder })),
    );
  });
}
```

`listSpaces()` must sort by `sortOrder`.

- [ ] **Step 5: Implement relation guard**

Load source/target entities and require `source.spaceId === target.spaceId === requestedSpaceId`; otherwise throw `new Error("Cross-Space relation is not allowed.")`.

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts
git commit -m "feat: add isolated Space repository"
```

---

### Task 3: Bootstrap Personal Space only once

**Files:**
- Create: `src/lib/spaces/personal-space-seed.ts`
- Create: `src/lib/spaces/personal-space-seed.test.ts`
- Create: `src/lib/spaces/bootstrap-workspace.ts`
- Create: `src/lib/spaces/bootstrap-workspace.test.ts`

**Interfaces:**
- Consumes: `BUILT_IN_STRUCTURES` from `src/lib/workspace-object-types.ts`.
- Produces: `createPersonalSpaceSeed(now?)`, `bootstrapWorkspace(database, now?)`.

- [ ] **Step 1: Write RED seed test**

```ts
it("seeds exactly the current Personal catalog", () => {
  const seed = createPersonalSpaceSeed(() => new Date("2026-01-01T00:00:00.000Z"));
  expect(seed.objectTypes.map((item) => item.id)).toEqual([
    "page",
    "table",
    "task",
    "weblink",
    "image",
    "pdf",
    "audio",
    "file",
    "tweet",
    "ai-chat",
    "tag",
    "query",
  ]);
  expect(seed.objectTypes.every((item) => item.spaceId === PERSONAL_SPACE_ID)).toBe(true);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/personal-space-seed.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement seed from `BUILT_IN_STRUCTURES`**

```ts
export function createPersonalSpaceSeed(now: () => Date = () => new Date()) {
  const timestamp = now().toISOString();
  return {
    space: {
      id: PERSONAL_SPACE_ID,
      accountId: LOCAL_ACCOUNT_ID,
      name: "Personal Space",
      sortOrder: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    objectTypes: BUILT_IN_STRUCTURES.map((structure) => ({
      ...structuredClone(structure),
      spaceId: PERSONAL_SPACE_ID,
    })),
  };
}
```

- [ ] **Step 4: Write RED bootstrap tests**

Assert bootstrap is idempotent and does not seed later Spaces:

```ts
await bootstrapWorkspace(database, fixedNow);
const firstCount = await database.objectTypes.count();
await bootstrapWorkspace(database, fixedNow);
expect(await database.objectTypes.count()).toBe(firstCount);

const repository = createSpaceRepository(database);
const blank = await repository.createBlankSpace("Blank");
await bootstrapWorkspace(database, fixedNow);
expect(await database.objectTypes.where("spaceId").equals(blank.id).count()).toBe(0);
```

- [ ] **Step 5: Implement bootstrap transaction**

Within one transaction:
1. create Personal Space only when absent;
2. insert Personal built-ins only when Personal is first created;
3. keep existing IDs unchanged;
4. validate saved active Space; when missing/invalid, set Personal active;
5. never write object types into any non-Personal Space.

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/personal-space-seed.ts src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.ts src/lib/spaces/bootstrap-workspace.test.ts
git commit -m "feat: bootstrap Personal Space data"
```

---

### Task 4: Add live Space queries and object type presentation

**Files:**
- Create: `src/hooks/use-space-data.ts`
- Create: `src/components/workspace-object-type-presenter.ts`
- Create: `src/components/workspace-object-type-presenter.test.ts`
- Modify: `src/components/workspace-controller.tsx`

**Interfaces:**
- Produces `useSpaceData()` and `presentWorkspaceObjectType(record, count)`.

- [ ] **Step 1: Write RED presenter test**

```ts
import { describe, expect, it } from "vitest";
import { ObjectPageIcon } from "@/components/object-icons";
import { presentWorkspaceObjectType } from "./workspace-object-type-presenter";

it("maps serialized page icon metadata to the existing React icon", () => {
  const presented = presentWorkspaceObjectType(
    {
      id: "page",
      spaceId: "personal",
      ownership: "built-in",
      singularName: "Page",
      pluralName: "Pages",
      iconName: "page",
      tone: "blue",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
    3,
  );
  expect(presented.icon).toBe(ObjectPageIcon);
  expect(presented.count).toBe(3);
  expect(presented.label).toBe("Pages");
});
```

- [ ] **Step 2: Implement presenter**

Create a complete `objectIconComponentByName` map covering every `ObjectIconName` already supported by `workspace-object-types.ts`. Persist only `iconName`; never store React components in IndexedDB.

- [ ] **Step 3: Implement `useSpaceData`**

Bootstrap once, then query Spaces and active-Space partitions with `useLiveQuery`:

```ts
const spaces = useLiveQuery(
  () => db.spaces.orderBy("sortOrder").toArray(),
  [],
  [],
);
const activeSpaceId = useLiveQuery(
  async () => (await db.appSettings.get(ACTIVE_SPACE_SETTING_ID))?.value ?? null,
  [],
  null,
);
const objectTypeRecords = useLiveQuery(
  () => (activeSpaceId ? db.objectTypes.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
const entityRecords = useLiveQuery(
  () => (activeSpaceId ? db.entities.where("spaceId").equals(activeSpaceId).toArray() : []),
  [activeSpaceId],
  [],
);
```

Apply the same active-Space filter to collections and tags.

- [ ] **Step 4: Refactor `WorkspaceProvider`**

Remove authoritative persistent `useState` for `spaces`, `spaceId`, `objectTypeCollections`, and created entity arrays. Keep transient tab/pane/sidebar UI state.

Context behavior:
- `spaces` comes from Dexie live query;
- `spaceId` is the persisted active Space ID;
- `createSpace(name)` calls `repository.createBlankSpace(name)`;
- `switchSpace(id)` calls `repository.setActiveSpace(id)`;
- `setSpaces(nextSpaces)` becomes an adapter that calls `repository.reorderSpaces(nextSpaces.map((space) => space.id))`, preserving current `AppSidebar` callback shape;
- `objectTypes` is `objectTypeRecords.map(record => presentWorkspaceObjectType(record, entityCountForType))`;
- blank Space therefore exposes `objectTypes: []`.

- [ ] **Step 5: GREEN + lint**

```bash
pnpm vitest run src/components/workspace-object-type-presenter.test.ts
pnpm test:unit
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-space-data.ts src/components/workspace-object-type-presenter.ts src/components/workspace-object-type-presenter.test.ts src/components/workspace-controller.tsx
git commit -m "feat: bind workspace UI to active Space"
```

---

### Task 5: Persist object type CRUD inside the active Space

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`

**Interfaces:**
- Uses existing pure domain functions from `workspace-object-types.ts`.
- Produces the already-existing context callbacks `createWorkspaceStructureFromPreset`, `createWorkspaceStructure`, `updateWorkspaceStructure`, `deleteWorkspaceStructure` backed by Dexie.

- [ ] **Step 1: Write RED isolation test**

```ts
it("keeps object types isolated by Space", async () => {
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

Expected: FAIL until object type mutation methods exist.

- [ ] **Step 3: Implement Space-scoped registry mutations**

For each mutation:
1. load only object types for supplied `spaceId`;
2. strip `spaceId` before calling existing pure domain functions;
3. if domain result is error, throw without writes;
4. replace only that Space's object type rows in one transaction;
5. reattach the same `spaceId` to every stored structure.

- [ ] **Step 4: Wire provider callbacks**

Example:

```ts
const createWorkspaceStructure = React.useCallback(
  async (input: CreateStructureInput) => {
    if (!activeSpaceId) return;
    await repository.createObjectType(activeSpaceId, input);
  },
  [activeSpaceId, repository],
);
```

Do the same for preset creation, update, and delete.

- [ ] **Step 5: Make collection mutations Space-scoped**

Replace global in-memory collection writes in `app-sidebar-primary-actions.tsx` with context/repository operations that always include active `spaceId`.

- [ ] **Step 6: GREEN + lint**

```bash
pnpm test:unit
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions.tsx
git commit -m "feat: scope object types to Spaces"
```

---

### Task 6: Persist entities, collections, tags, and relation guards per Space

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/lib/workspace-domain-identities.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`
- Modify: `src/components/app-sidebar-primary-actions-command-dialog.tsx`

**Interfaces:**
- Produces Space-scoped entity creation and identity mutations behind existing UI callbacks.

- [ ] **Step 1: Write RED entity isolation test**

```ts
it("does not expose entities from another Space", async () => {
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");
  await repository.createObjectType(first.id, {
    singularName: "Page",
    pluralName: "Pages",
    iconName: "page",
    tone: "blue",
    lifecycleKind: "document",
  });
  await repository.createEntity(first.id, (await repository.listObjectTypes(first.id))[0].id, "First page");
  expect((await repository.listEntities(first.id)).map((entity) => entity.title)).toEqual(["First page"]);
  expect(await repository.listEntities(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

- [ ] **Step 3: Implement entity creation**

Require the object type to belong to the same Space before insert. Persist:

```ts
{
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
}
```

If the type is absent in the active Space, throw `Unknown object type in active Space.`

- [ ] **Step 4: Persist collections/tags with `spaceId`**

Keep ID generators in `workspace-domain-identities.ts` pure. Add Space-aware repository writes and ensure live queries in `useSpaceData` supply only active-Space records.

- [ ] **Step 5: Enforce relation ownership**

Before relation insertion call the same-Space guard from Task 2. Never infer validity from IDs alone.

- [ ] **Step 6: Wire UI entity creation**

`WorkspaceProvider.createWorkspaceEntity` calls `repository.createEntity(activeSpaceId, objectTypeId, label)`.

`NewContentCommandDialog` already consumes `objectTypes`; no structural change is required beyond ensuring it receives the active Space list. In a blank Space it renders no object type options.

- [ ] **Step 7: GREEN + lint**

```bash
pnpm test:unit
pnpm lint
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/lib/workspace-domain-identities.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions.tsx src/components/app-sidebar-primary-actions-command-dialog.tsx
git commit -m "feat: isolate Space objects and identities"
```

---

### Task 7: Add Space-scoped search, backlinks, and graph projections

**Files:**
- Create: `src/lib/spaces/space-projections.ts`
- Create: `src/lib/spaces/space-projections.test.ts`

**Interfaces:**
- Produces: `searchEntitiesInSpace(database, spaceId, query)`, `listBacklinksInSpace(database, spaceId, targetId)`, `buildGraphInSpace(database, spaceId)`.

- [ ] **Step 1: Write RED search leak test**

Store same search text in two Spaces and assert requesting Personal returns only Personal ID.

```ts
expect((await searchEntitiesInSpace(database, "personal", "shared")).map((item) => item.id)).toEqual(["personal-a"]);
```

- [ ] **Step 2: Write RED backlink leak test**

Store relations in two Spaces with different source IDs and assert `listBacklinksInSpace(database, "personal", targetId)` returns only Personal sources.

- [ ] **Step 3: Verify RED**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
```

- [ ] **Step 4: Implement Space-first queries**

Search starts from:

```ts
database.entities.where("spaceId").equals(spaceId)
```

Backlinks and graph read only relation/entity rows with the same supplied `spaceId` before any text matching or traversal.

- [ ] **Step 5: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
pnpm lint
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/spaces/space-projections.ts src/lib/spaces/space-projections.test.ts
git commit -m "feat: add Space-scoped projections"
```

---

### Task 8: Prove persistence and isolation in Playwright

**Files:**
- Modify: `tests/space-create-state.spec.ts`
- Create: `tests/space-isolation.spec.ts`

- [ ] **Step 1: Update existing creation test**

After creating `Created Space`, reload and assert the active trigger still names it.

```ts
await page.reload();
await expect(page.getByRole("button", { name: /Created Space/i })).toBeVisible();
```

- [ ] **Step 2: Add browser isolation test**

```ts
import { expect, test } from "@playwright/test";

test("new Spaces start blank and remain isolated after reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Pages", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Personal Space/i }).click();
  await page.getByText("Create space", { exact: true }).click();
  await page.getByRole("textbox").fill("Blank Space");
  await page.getByRole("button", { name: /^Create$/ }).click();

  await expect(page.getByRole("button", { name: /Blank Space/i })).toBeVisible();
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("button", { name: /Blank Space/i })).toBeVisible();
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: /Blank Space/i }).click();
  await page.getByText("Personal Space", { exact: true }).click();
  await expect(page.getByText("Pages", { exact: true })).toBeVisible();
});
```

- [ ] **Step 3: Run focused Playwright**

```bash
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts
```

Expected: PASS.

- [ ] **Step 4: Run complete verification**

```bash
pnpm test:unit
pnpm exec playwright test
pnpm lint
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add tests/space-create-state.spec.ts tests/space-isolation.spec.ts
git commit -m "test: cover persistent Space isolation"
```

---

### Task 9: Final architecture audit

**Files:** review only; fix only concrete defects discovered by the checks below.

- [ ] **Step 1: Verify every Space-owned table is indexed by `spaceId`**

```bash
pnpm vitest run src/lib/db.test.ts
```

- [ ] **Step 2: Find direct database reads**

```bash
rg "db\.(objectTypes|entities|collections|tags|relations|media)" src
```

Every read must either live in a helper that requires `spaceId` or visibly filter by `spaceId`.

- [ ] **Step 3: Find authoritative domain arrays in React state**

```bash
rg "useState.*(spaces|objectTypes|createdEntities|objectTypeCollections)" src/components src/hooks
```

Expected: no authoritative persistent domain arrays remain in the workspace provider.

- [ ] **Step 4: Verify blank creation code path**

Inspect `createBlankSpace`. It may touch only `spaces` and `appSettings`; it must not call Personal seed or write object types/entities/collections/tags/relations/media.

- [ ] **Step 5: Verify bootstrap idempotence**

```bash
pnpm vitest run src/lib/spaces/bootstrap-workspace.test.ts
```

- [ ] **Step 6: Run final required suite**

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts
pnpm lint
pnpm build
```

Expected: PASS.

- [ ] **Step 7: Commit only when Step 1–6 required a code fix**

When no fix is needed, do not create an empty commit. When a fix is needed, stage only the files changed by that audit and use:

```bash
git commit -m "fix: enforce Space isolation invariants"
```
