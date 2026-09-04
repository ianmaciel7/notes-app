# Space-Scoped Data Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Space a durable, isolated local-first knowledge environment, with Personal Space retaining the current catalog and every newly created Space starting blank.

**Architecture:** Use one Dexie database named `KnowledgeOS_DB`. Every Space-owned record is explicitly partitioned by `spaceId`; React Context coordinates the active Space and UI state, while Dexie is authoritative for Spaces, object types, entities, collections, tags, relations, media metadata, and active-Space preference. Existing Personal Space defaults are materialized once into Dexie; new Spaces insert only their Space record and become active after the transaction succeeds.

**Tech Stack:** Next.js 16.3+, React 19.2+, TypeScript, Dexie.js, dexie-react-hooks, IndexedDB, Vitest + fake-indexeddb for data/domain tests, Playwright for browser integration, Biome, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

## Global Constraints

- Local database name is exactly `KnowledgeOS_DB`.
- Dexie/IndexedDB is the local-first source of truth for domain reads and writes.
- React Context/Zustand is for transient coordination and UI state, not an authoritative copy of persistent domain data.
- Every Space-owned persistent record must have an owning `spaceId`.
- A newly created Space starts with zero user object types, zero objects, zero collections, zero tags, zero relations, zero media, zero search-index records, and zero trash records.
- Existing current catalog/data is assigned only to Personal Space; it must never be copied into later Spaces.
- Cross-Space relations are rejected at the repository/domain boundary.
- Use `pnpm` exclusively. Use Biome only; do not add ESLint or Prettier.
- Preserve current shadcn/Tailwind UI behavior; this plan changes data ownership, persistence, and isolation rather than redesigning the Space switcher.

---

## File Structure

### New files

- `src/types/schema.ts` — shared serializable persistent entity types derived from `SPEC.md`, including the `spaceId` persistence wrapper.
- `src/lib/db.ts` — Dexie database class, schema versions, tables, indexes, and browser database singleton.
- `src/lib/db.test.ts` — schema/index and migration test coverage using fake IndexedDB.
- `src/lib/spaces/space-types.ts` — `SpaceRecord`, app preference keys, Personal Space constants, and Space-scoped table record types.
- `src/lib/spaces/space-repository.ts` — transaction-safe Space CRUD, active-Space preference, Space-scoped reads/writes, same-Space guards.
- `src/lib/spaces/space-repository.test.ts` — blank creation, activation, object-type/entity isolation, relation guard, failure behavior.
- `src/lib/spaces/personal-space-seed.ts` — one-time serializable Personal Space seed generated from the current catalog.
- `src/lib/spaces/personal-space-seed.test.ts` — verifies seed is Personal-only and deterministic.
- `src/lib/spaces/bootstrap-workspace.ts` — idempotent bootstrap/migration from current prototype state to durable Personal Space.
- `src/lib/spaces/bootstrap-workspace.test.ts` — migration idempotence and active-Space fallback.
- `src/hooks/use-space-data.ts` — Dexie live queries for Spaces, active Space, object types, entities, collections, tags, and derived counts.
- `src/components/workspace-object-type-presenter.ts` — maps serializable `ObjectIconName` values to the existing React icon components without storing component references in IndexedDB.
- `tests/space-isolation.spec.ts` — browser-level create/switch/isolation/reload regression coverage.

### Existing files to modify

- `package.json` — add Dexie/test dependencies and a Vitest script.
- `pnpm-lock.yaml` — lock dependency graph.
- `src/components/workspace-controller.tsx` — replace authoritative `spaces`, `spaceId`, default object types, collections, and created entity `useState` with Space-aware Dexie data/callbacks while preserving transient tab/pane state.
- `src/components/app-sidebar-primary-actions.tsx` — consume the same context API, but stop treating Space-owned collections as global in-memory state.
- `src/components/app-sidebar-primary-actions-command-dialog.tsx` — no structural redesign; ensure the available type list comes from the active Space query.
- `src/lib/workspace-domain-identities.ts` — make persisted collection/tag identities Space-scoped at the storage boundary while preserving pure ID helpers.
- `tests/space-create-state.spec.ts` — update expectations from in-memory creation to persisted creation/activation.

---

### Task 1: Add Dexie and a testable persistent schema

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/types/schema.ts`
- Create: `src/lib/spaces/space-types.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/db.test.ts`

**Interfaces:**
- Produces: `KnowledgeDatabase`, `createKnowledgeDatabase(name?: string)`, `db`, `SpaceRecord`, `AppSettingRecord`, `SpaceObjectTypeRecord`, `SpaceEntityRecord`, `SpaceCollectionRecord`, `SpaceTagRecord`, `SpaceRelationRecord`, `SpaceMediaRecord`, `PERSONAL_SPACE_ID`, `ACTIVE_SPACE_SETTING_ID`.
- Consumes: `WorkspaceStructure` from `src/lib/workspace-object-types.ts`; the `BaseEntity` shape from `SPEC.md`.

- [ ] **Step 1: Add the dependencies**

Run:

```bash
pnpm add dexie dexie-react-hooks
pnpm add -D vitest fake-indexeddb
```

Add the script:

```json
"test:unit": "vitest run"
```

Expected: `package.json` and `pnpm-lock.yaml` update; no npm/yarn lockfiles are created.

- [ ] **Step 2: Define the serializable entity schema**

Create `src/types/schema.ts` with the exact shared primitives needed by current object creation:

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

- [ ] **Step 3: Define Space-owned record types**

Create `src/lib/spaces/space-types.ts`:

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
  createdAt: string;
  updatedAt: string;
};

export type AppSettingRecord = {
  id: string;
  value: string;
};

export type SpaceObjectTypeRecord = WorkspaceStructure & { spaceId: string };
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

- [ ] **Step 4: Write the failing database schema test**

Create `src/lib/db.test.ts` using `fake-indexeddb/auto` and a unique database name per test:

```ts
import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createKnowledgeDatabase } from "./db";

const databases: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(databases.map((database) => database.delete()));
  databases.length = 0;
});

describe("KnowledgeDatabase", () => {
  it("creates every Space-owned table with a spaceId index", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    databases.push(database);
    await database.open();

    for (const tableName of [
      "objectTypes",
      "entities",
      "collections",
      "tags",
      "relations",
      "media",
    ]) {
      expect(database.table(tableName).schema.indexes.some((index) => index.name === "spaceId")).toBe(
        true,
      );
    }
  });
});
```

- [ ] **Step 5: Run the database test to verify RED**

Run:

```bash
pnpm vitest run src/lib/db.test.ts
```

Expected: FAIL because `src/lib/db.ts` does not exist yet.

- [ ] **Step 6: Implement the Dexie database**

Create `src/lib/db.ts`:

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
      spaces: "id, accountId, name, createdAt, updatedAt",
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

- [ ] **Step 7: Run unit test and Biome**

Run:

```bash
pnpm vitest run src/lib/db.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml src/types/schema.ts src/lib/db.ts src/lib/db.test.ts src/lib/spaces/space-types.ts
git commit -m "feat: add Space-scoped Dexie schema"
```

---

### Task 2: Implement transaction-safe Space repository and isolation guards

**Files:**
- Create: `src/lib/spaces/space-repository.ts`
- Create: `src/lib/spaces/space-repository.test.ts`

**Interfaces:**
- Consumes: `KnowledgeDatabase`, `SpaceRecord`, Space-scoped records from Task 1.
- Produces:
  - `createSpaceRepository(database)`
  - `repository.listSpaces(): Promise<SpaceRecord[]>`
  - `repository.getActiveSpaceId(): Promise<string | null>`
  - `repository.setActiveSpace(spaceId: string): Promise<void>`
  - `repository.createBlankSpace(name: string, now?: () => Date): Promise<SpaceRecord>`
  - `repository.listObjectTypes(spaceId: string): Promise<SpaceObjectTypeRecord[]>`
  - `repository.putObjectTypes(spaceId: string, records: readonly SpaceObjectTypeRecord[]): Promise<void>`
  - `repository.listEntities(spaceId: string): Promise<SpaceEntityRecord[]>`
  - `repository.putEntity(record: SpaceEntityRecord): Promise<void>`
  - `repository.putCollection(record: SpaceCollectionRecord): Promise<void>`
  - `repository.putTag(record: SpaceTagRecord): Promise<void>`
  - `repository.putRelation(record: SpaceRelationRecord): Promise<void>`
  - `repository.assertSameSpaceEntityTargets(spaceId, sourceId, targetId): Promise<void>`

- [ ] **Step 1: Write failing tests for blank creation and atomic activation**

Create `src/lib/spaces/space-repository.test.ts`:

```ts
import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createKnowledgeDatabase } from "@/lib/db";
import { createSpaceRepository } from "./space-repository";

const databases: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(databases.map((database) => database.delete()));
  databases.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  databases.push(database);
  return { database, repository: createSpaceRepository(database) };
}

describe("SpaceRepository", () => {
  it("creates an active blank Space without copying Personal data", async () => {
    const { database, repository } = setup();
    const created = await repository.createBlankSpace("Research");

    expect(await repository.getActiveSpaceId()).toBe(created.id);
    expect(await database.objectTypes.where("spaceId").equals(created.id).count()).toBe(0);
    expect(await database.entities.where("spaceId").equals(created.id).count()).toBe(0);
    expect(await database.collections.where("spaceId").equals(created.id).count()).toBe(0);
    expect(await database.tags.where("spaceId").equals(created.id).count()).toBe(0);
    expect(await database.relations.where("spaceId").equals(created.id).count()).toBe(0);
    expect(await database.media.where("spaceId").equals(created.id).count()).toBe(0);
  });

  it("rejects a relation whose target belongs to another Space", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");

    await repository.putEntity({
      id: "entity:first",
      spaceId: first.id,
      objectTypeId: "type:first",
      type: "page",
      title: "First",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      blocks: [],
      tags: [],
      relations: [],
      properties: {},
      _syncStatus: "pending",
    });
    await repository.putEntity({
      id: "entity:second",
      spaceId: second.id,
      objectTypeId: "type:second",
      type: "page",
      title: "Second",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      blocks: [],
      tags: [],
      relations: [],
      properties: {},
      _syncStatus: "pending",
    });

    await expect(
      repository.assertSameSpaceEntityTargets(first.id, "entity:first", "entity:second"),
    ).rejects.toThrow("Cross-Space relation");
  });
});
```

- [ ] **Step 2: Run the repository tests to verify RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

Expected: FAIL because the repository does not exist.

- [ ] **Step 3: Implement `createSpaceRepository`**

The core creation path must use one Dexie transaction and activate only after insertion:

```ts
async function createBlankSpace(name: string, now: () => Date = () => new Date()) {
  const normalizedName = name.trim();
  if (!normalizedName) throw new Error("Space name is required.");

  const timestamp = now().toISOString();
  const record: SpaceRecord = {
    id: `space-${crypto.randomUUID()}`,
    accountId: LOCAL_ACCOUNT_ID,
    name: normalizedName,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await database.transaction("rw", database.spaces, database.appSettings, async () => {
    await database.spaces.add(record);
    await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: record.id });
  });

  return record;
}
```

Implement Space-scoped table reads with indexed queries such as:

```ts
listObjectTypes(spaceId: string) {
  return database.objectTypes.where("spaceId").equals(spaceId).toArray();
}
```

Implement same-Space relation validation by loading both entities and requiring both `spaceId` values to equal the supplied active Space.

- [ ] **Step 4: Run repository tests and lint**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts
git commit -m "feat: add isolated Space repository"
```

---

### Task 3: Seed only Personal Space and make bootstrap idempotent

**Files:**
- Create: `src/lib/spaces/personal-space-seed.ts`
- Create: `src/lib/spaces/personal-space-seed.test.ts`
- Create: `src/lib/spaces/bootstrap-workspace.ts`
- Create: `src/lib/spaces/bootstrap-workspace.test.ts`

**Interfaces:**
- Consumes: `createLegacyStructureDefinitions` from `src/lib/workspace-object-types.ts`, `PERSONAL_SPACE_ID`, repository from Task 2.
- Produces: `PERSONAL_SPACE_OBJECT_TYPE_IDS`, `createPersonalSpaceSeed(now?)`, `bootstrapWorkspace(database, now?)`.

- [ ] **Step 1: Write the failing Personal seed test**

The catalog must reproduce the currently visible Personal Space object type IDs but remain serializable:

```ts
import { describe, expect, it } from "vitest";
import { createPersonalSpaceSeed, PERSONAL_SPACE_OBJECT_TYPE_IDS } from "./personal-space-seed";

it("creates the current catalog only for Personal Space", () => {
  const seed = createPersonalSpaceSeed(() => new Date("2026-01-01T00:00:00.000Z"));
  expect(PERSONAL_SPACE_OBJECT_TYPE_IDS).toEqual([
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
  expect(seed.objectTypes.every((record) => record.spaceId === "personal")).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify RED**

```bash
pnpm vitest run src/lib/spaces/personal-space-seed.test.ts
```

Expected: FAIL because the seed module does not exist.

- [ ] **Step 3: Implement the Personal Space seed**

Use `createLegacyStructureDefinitions(PERSONAL_SPACE_OBJECT_TYPE_IDS)` so the database stores `iconName`/`tone`/schema data rather than React components. If the existing domain module cannot resolve one of the current IDs, add the missing serializable legacy definition to `workspace-object-types.ts` instead of falling back to component references.

The seed returns:

```ts
{
  space: {
    id: PERSONAL_SPACE_ID,
    accountId: LOCAL_ACCOUNT_ID,
    name: "Personal Space",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  objectTypes: definitions.map((definition) => ({ ...definition, spaceId: PERSONAL_SPACE_ID })),
}
```

- [ ] **Step 4: Write failing bootstrap tests**

Cover two cases:

```ts
it("bootstraps Personal Space once and is idempotent", async () => {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));
  const firstCount = await database.objectTypes.count();
  await bootstrapWorkspace(database, () => new Date("2026-01-02T00:00:00.000Z"));
  expect(await database.objectTypes.count()).toBe(firstCount);
  expect((await database.appSettings.get(ACTIVE_SPACE_SETTING_ID))?.value).toBe(PERSONAL_SPACE_ID);
});

it("does not seed a newly created Space", async () => {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  await bootstrapWorkspace(database);
  const repository = createSpaceRepository(database);
  const created = await repository.createBlankSpace("Blank");
  expect(await database.objectTypes.where("spaceId").equals(created.id).count()).toBe(0);
});
```

- [ ] **Step 5: Implement `bootstrapWorkspace`**

Use a Dexie transaction to:

1. detect whether Personal Space exists;
2. insert Personal Space and Personal object type seed only when missing;
3. preserve existing object type/entity rows on repeated startup;
4. validate `activeSpaceId`; if absent or invalid, set it to Personal Space.

Do not mutate later Spaces.

- [ ] **Step 6: Run seed/bootstrap tests and lint**

```bash
pnpm vitest run src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/personal-space-seed.ts src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.ts src/lib/spaces/bootstrap-workspace.test.ts src/lib/workspace-object-types.ts
git commit -m "feat: bootstrap Personal Space data"
```

---

### Task 4: Expose active-Space live queries and serializable object types to React

**Files:**
- Create: `src/hooks/use-space-data.ts`
- Create: `src/components/workspace-object-type-presenter.ts`
- Modify: `src/components/workspace-controller.tsx`

**Interfaces:**
- Consumes: `db`, `bootstrapWorkspace`, repository, Space/object-type records, existing object icon components.
- Produces: `useSpaceData()` with `{ ready, spaces, activeSpaceId, activeSpace, objectTypeRecords, entityRecords, collectionRecords, tagRecords }`; `presentWorkspaceObjectType(record)` returning the current `AppSidebarObjectType` UI shape.

- [ ] **Step 1: Add a presenter test indirectly through a small pure mapping**

`workspace-object-type-presenter.ts` must map persisted icon names to existing icon components and keep counts outside storage:

```ts
export function presentWorkspaceObjectType(
  record: SpaceObjectTypeRecord,
  count: number,
): AppSidebarObjectType {
  return {
    id: record.id,
    label: record.pluralName,
    singularLabel: record.singularName,
    iconName: record.iconName,
    icon: objectIconComponentByName[record.iconName],
    tone: record.tone,
    ownership: record.ownership,
    count,
  };
}
```

Add a colocated Vitest file if needed to assert `page -> ObjectPageIcon` and plural/singular labels are preserved.

- [ ] **Step 2: Implement `useSpaceData` with `useLiveQuery`**

The hook bootstraps once on mount and reads only the active Space partitions:

```ts
const spaces = useLiveQuery(() => db.spaces.orderBy("createdAt").toArray(), [], []);
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
```

Repeat the same active-Space boundary for entities, collections, and tags.

- [ ] **Step 3: Refactor `WorkspaceProvider` to stop owning persistent Space data in `useState`**

Keep transient state such as `mainTabs`, `sideTabs`, active tabs, open panels, and ephemeral sidebar UI in React state. Replace:

```ts
const [spaces, setSpaces] = React.useState(defaultSpaces);
const [spaceId, setSpaceId] = React.useState("personal");
```

with `useSpaceData()` and repository callbacks. `createSpace` becomes async and calls `repository.createBlankSpace(name)`. `switchSpace` calls `repository.setActiveSpace(id)` only after validating the Space exists.

`objectTypes` must be derived from `objectTypeRecords`, not `defaultObjectTypes`. For a blank Space, it is therefore `[]`.

- [ ] **Step 4: Preserve the public context contract used by the sidebar**

The context continues exposing:

```ts
{
  spaces,
  spaceId: activeSpaceId,
  createSpace,
  switchSpace,
  objectTypes,
  createdEntities,
  objectTypeCollections,
  ...transientExistingFields
}
```

Remove `setSpaces` as an authoritative persistence API. For drag reorder, introduce `reorderSpaces(nextIds: readonly string[])` in the repository or temporarily disable persistence-free reorder until an explicit `sortOrder` column is added; do not write reordered arrays back to React-only state.

- [ ] **Step 5: Run unit tests and lint**

```bash
pnpm test:unit
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/use-space-data.ts src/components/workspace-object-type-presenter.ts src/components/workspace-controller.tsx
git commit -m "feat: bind workspace UI to active Space data"
```

---

### Task 5: Persist object type CRUD inside the active Space

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`

**Interfaces:**
- Consumes: `createCustomStructure`, `instantiateObjectTypePreset`, `renameStructure`, `updateStructureAppearance`, `replaceStructureSchema`, `deleteStructure` from `workspace-object-types.ts`.
- Produces context callbacks that already exist by name: `createWorkspaceStructureFromPreset`, `createWorkspaceStructure`, `updateWorkspaceStructure`, `deleteWorkspaceStructure`.

- [ ] **Step 1: Write a failing isolation test for object types**

Add to `space-repository.test.ts`:

```ts
it("keeps object types isolated by Space", async () => {
  const { repository } = setup();
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.replaceObjectTypes(first.id, [
    {
      id: "book",
      spaceId: first.id,
      ownership: "custom",
      singularName: "Book",
      pluralName: "Books",
      iconName: "book",
      tone: "blue",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
  ]);

  expect((await repository.listObjectTypes(first.id)).map((item) => item.id)).toEqual(["book"]);
  expect(await repository.listObjectTypes(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Run RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

Expected: FAIL until `replaceObjectTypes` exists.

- [ ] **Step 3: Implement Space-scoped object type mutations**

Repository mutation strategy:

1. load only `spaceId` object types;
2. pass plain `WorkspaceStructure[]` into existing pure domain mutation functions;
3. if domain result is error, surface it without writing;
4. transactionally replace only rows belonging to that Space;
5. reattach `spaceId` before persistence.

Never pass another Space's registry into the mutation function.

- [ ] **Step 4: Wire the existing provider callbacks**

For example:

```ts
const createWorkspaceStructure = React.useCallback(
  async (input: CreateStructureInput) => {
    if (!activeSpaceId) return;
    await repository.createObjectType(activeSpaceId, input);
  },
  [activeSpaceId, repository],
);
```

`createWorkspaceStructureFromPreset`, update, and delete follow the same active-Space boundary.

- [ ] **Step 5: Remove global collection assumptions from object type actions**

In `app-sidebar-primary-actions.tsx`, `setObjectTypeCollections` must call a Space-scoped repository/context mutation rather than replacing a global record object. Existing UI signatures may remain, but the implementation must persist records with the active `spaceId`.

- [ ] **Step 6: Run unit tests and lint**

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

### Task 6: Persist objects, collections, tags, and relation guards per Space

**Files:**
- Modify: `src/lib/spaces/space-repository.ts`
- Modify: `src/lib/spaces/space-repository.test.ts`
- Modify: `src/lib/workspace-domain-identities.ts`
- Modify: `src/components/workspace-controller.tsx`
- Modify: `src/components/app-sidebar-primary-actions.tsx`
- Modify: `src/components/app-sidebar-primary-actions-command-dialog.tsx`

**Interfaces:**
- Consumes: active `spaceId`, active Space object types, `BaseEntity` schema, collection/tag ID helpers.
- Produces: `createWorkspaceEntity(objectTypeId, label)`, Space-scoped collections/tags, `createRelation`/same-Space validation.

- [ ] **Step 1: Write failing object isolation test**

Add to repository tests:

```ts
it("does not expose entities from another Space", async () => {
  const { repository } = setup();
  const first = await repository.createBlankSpace("First");
  const second = await repository.createBlankSpace("Second");

  await repository.createEntity(first.id, "page", "First page");

  expect((await repository.listEntities(first.id)).map((entity) => entity.title)).toEqual([
    "First page",
  ]);
  expect(await repository.listEntities(second.id)).toEqual([]);
});
```

- [ ] **Step 2: Run RED**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
```

Expected: FAIL because `createEntity` does not exist.

- [ ] **Step 3: Implement entity creation with BaseEntity defaults**

`createEntity(spaceId, objectTypeId, title)` must first verify the object type exists in the same Space. Persist:

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

If the type does not exist in that Space, throw `Unknown object type in active Space.`

- [ ] **Step 4: Make collections and tags persist with `spaceId`**

Keep `createCollectionId`/`createTagId` pure. At write time wrap their records with active `spaceId`. All collection lists shown in the sidebar are produced from the active-Space live query.

- [ ] **Step 5: Enforce relation target ownership**

Before `relations.add`, call `assertSameSpaceEntityTargets(spaceId, sourceId, targetId)`. The database record's `spaceId` is the same boundary used for backlink/search projections later.

- [ ] **Step 6: Wire UI creation**

`WorkspaceProvider.createWorkspaceEntity` calls repository `createEntity(activeSpaceId, objectTypeId, label)`. `NewContentCommandDialog` already reads `objectTypes` from the context; therefore a blank Space naturally displays no selectable object types and cannot accidentally create Personal objects.

- [ ] **Step 7: Run unit tests and lint**

```bash
pnpm test:unit
pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts src/lib/workspace-domain-identities.ts src/components/workspace-controller.tsx src/components/app-sidebar-primary-actions.tsx src/components/app-sidebar-primary-actions-command-dialog.tsx
git commit -m "feat: isolate Space objects and identities"
```

---

### Task 7: Add Space-scoped search/backlink projection primitives

**Files:**
- Create: `src/lib/spaces/space-projections.ts`
- Create: `src/lib/spaces/space-projections.test.ts`
- Modify: `src/lib/spaces/space-repository.ts`

**Interfaces:**
- Consumes: `SpaceEntityRecord`, `SpaceRelationRecord`, active `spaceId`.
- Produces: `searchEntitiesInSpace(database, spaceId, query)`, `listBacklinksInSpace(database, spaceId, targetId)`, `buildGraphInSpace(database, spaceId)`.

- [ ] **Step 1: Write failing search leak test**

```ts
it("searches only the requested Space", async () => {
  await database.entities.bulkAdd([
    createEntityFixture({ id: "a", spaceId: "personal", title: "Shared phrase" }),
    createEntityFixture({ id: "b", spaceId: "other", title: "Shared phrase" }),
  ]);

  expect((await searchEntitiesInSpace(database, "personal", "shared")).map((item) => item.id)).toEqual([
    "a",
  ]);
});
```

- [ ] **Step 2: Write failing backlink leak test**

Store two relations with different Space IDs pointing at same textually identical target IDs and assert only the requested Space relation is returned. This ensures backlink code cannot accidentally become account-global.

- [ ] **Step 3: Run RED**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
```

Expected: FAIL because projection functions do not exist.

- [ ] **Step 4: Implement projection functions with Space-first queries**

Search must begin from `database.entities.where("spaceId").equals(spaceId)`, then perform normalized text matching. Backlinks must begin from the compound/Space-filtered relation set. Graph edges and nodes must both originate from the same Space-filtered records.

- [ ] **Step 5: Run tests and lint**

```bash
pnpm vitest run src/lib/spaces/space-projections.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spaces/space-projections.ts src/lib/spaces/space-projections.test.ts src/lib/spaces/space-repository.ts
git commit -m "feat: add Space-scoped projections"
```

---

### Task 8: Prove blank creation, isolation, and reload persistence in the browser

**Files:**
- Modify: `tests/space-create-state.spec.ts`
- Create: `tests/space-isolation.spec.ts`

**Interfaces:**
- Consumes: completed UI/repository integration from Tasks 1–7.
- Produces: regression coverage for user-visible acceptance criteria.

- [ ] **Step 1: Update existing Space creation test for persistence**

After creating `Created Space`, reload and assert the trigger still shows it:

```ts
await page.reload();
await expect(page.getByRole("button", { name: /Created Space/i })).toBeVisible();
```

The existing test must not pass merely because React state retained a value before navigation.

- [ ] **Step 2: Add a failing blank Space test**

Create `tests/space-isolation.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("new Spaces start blank and stay isolated", async ({ page }) => {
  await page.goto("/");

  // Personal has its seeded catalog.
  await expect(page.getByText("Pages", { exact: true })).toBeVisible();

  // Open the Space switcher and create a blank Space through the real dialog.
  await page.getByRole("button", { name: /Personal Space/i }).click();
  await page.getByText("Create space", { exact: true }).click();
  await page.getByRole("textbox").fill("Blank Space");
  await page.getByRole("button", { name: /^Create$/ }).click();

  await expect(page.getByRole("button", { name: /Blank Space/i })).toBeVisible();
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("button", { name: /Blank Space/i })).toBeVisible();
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);

  // Switching back restores Personal-only object types.
  await page.getByRole("button", { name: /Blank Space/i }).click();
  await page.getByText("Personal Space", { exact: true }).click();
  await expect(page.getByText("Pages", { exact: true })).toBeVisible();
});
```

Use the existing Space-switcher selectors if the exact accessible names differ; do not add test-only production IDs unless necessary for accessibility.

- [ ] **Step 3: Run the focused Playwright tests**

```bash
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts
```

Expected: PASS.

- [ ] **Step 4: Run the full verification suite**

```bash
pnpm test:unit
pnpm exec playwright test
pnpm lint
pnpm build
```

Expected: all commands exit 0. If unrelated existing Playwright tests are already flaky, document the exact pre-existing failure and still require every Space-specific test above to pass.

- [ ] **Step 5: Commit**

```bash
git add tests/space-create-state.spec.ts tests/space-isolation.spec.ts
git commit -m "test: cover persistent Space isolation"
```

---

### Task 9: Final architectural audit before integration

**Files:**
- Review only unless an audit finds a concrete defect.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: evidence that the implementation matches the design spec.

- [ ] **Step 1: Verify every Space-owned table has a `spaceId` index**

Run the database tests and inspect `src/lib/db.ts`; the required tables are `objectTypes`, `entities`, `collections`, `tags`, `relations`, and `media`.

- [ ] **Step 2: Search for global reads of Space-owned Dexie tables**

Run:

```bash
rg "db\.(objectTypes|entities|collections|tags|relations|media)" src
```

Every read must either use a repository/projection helper that takes `spaceId` or visibly apply `where("spaceId")` / a compound Space index.

- [ ] **Step 3: Search for authoritative Space content in React `useState`**

Run:

```bash
rg "useState.*(spaces|objectTypes|createdEntities|objectTypeCollections)" src/components src/hooks
```

Expected: no authoritative persistent domain arrays remain in the workspace provider. Transient UI state is allowed.

- [ ] **Step 4: Verify blank-Space invariant in code and tests**

`createBlankSpace` must insert only the Space and active-setting rows. It must not call Personal seed, `createInitialStructureRegistry`, or copy another Space's rows.

- [ ] **Step 5: Verify Personal migration does not clone**

`bootstrapWorkspace` must seed Personal only when Personal is absent. Re-running bootstrap after another Space exists must leave that other Space's object type/entity counts unchanged.

- [ ] **Step 6: Run final verification**

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts
pnpm lint
pnpm build
```

Expected: PASS.

- [ ] **Step 7: Commit only if audit fixes were necessary**

```bash
git add <only-files-changed-by-audit>
git commit -m "fix: enforce Space isolation invariants"
```
