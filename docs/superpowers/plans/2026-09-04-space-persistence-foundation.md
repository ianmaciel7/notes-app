# Space Persistence Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Spaces and active-Space selection in Dexie, seed only Personal Space with the current built-in object type catalog, and make every newly created Space blank and durable across reloads.

**Architecture:** Add one Dexie database named `KnowledgeOS_DB`. Persist Space metadata/order and active-Space preference there. Bootstrap Personal Space once from the serializable `BUILT_IN_STRUCTURES`; new Space creation writes only a `SpaceRecord` plus active-Space preference. React Context remains the UI coordinator, while `useLiveQuery` reads authoritative persistent state.

**Tech Stack:** Next.js 16.3+, React 19.2+, TypeScript, Dexie.js, dexie-react-hooks, IndexedDB, Vitest + fake-indexeddb, Playwright, Biome, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-04-space-scoped-data-architecture-design.md`

## Global Constraints

- Database name is exactly `KnowledgeOS_DB`.
- Dexie is authoritative for persistent Space data.
- A new Space contains zero object type rows.
- Personal Space alone receives the current built-in catalog.
- Active Space and Space order survive reload.
- Space order uses persisted `sortOrder`.
- Use `pnpm` only and Biome only.

---

### Task 1: Add Dexie and the Space schema

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/spaces/space-types.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/db.test.ts`

**Interfaces:**
- Produces: `SpaceRecord`, `AppSettingRecord`, `SpaceObjectTypeRecord`, `PERSONAL_SPACE_ID`, `LOCAL_ACCOUNT_ID`, `ACTIVE_SPACE_SETTING_ID`, `KnowledgeDatabase`, `createKnowledgeDatabase`, `db`.

- [ ] **Step 1: Add dependencies**

```bash
pnpm add dexie dexie-react-hooks
pnpm add -D vitest fake-indexeddb
```

Add to `package.json`:

```json
"test:unit": "vitest run"
```

- [ ] **Step 2: Create Space persistence types**

Create `src/lib/spaces/space-types.ts`:

```ts
import type { WorkspaceStructure } from "@/lib/workspace-object-types";

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

export type AppSettingRecord = {
  id: string;
  value: string;
};

export type SpaceObjectTypeRecord = WorkspaceStructure & {
  spaceId: string;
};
```

- [ ] **Step 3: Write the RED database test**

Create `src/lib/db.test.ts`:

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
  it("creates Space, settings, and object type tables", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    opened.push(database);
    await database.open();

    expect(database.spaces.schema.primKey.name).toBe("id");
    expect(database.appSettings.schema.primKey.name).toBe("id");
    expect(database.objectTypes.schema.indexes.some((index) => index.name === "spaceId")).toBe(true);
    expect(database.spaces.schema.indexes.some((index) => index.name === "[accountId+sortOrder]")).toBe(true);
  });
});
```

- [ ] **Step 4: Verify RED**

```bash
pnpm vitest run src/lib/db.test.ts
```

Expected: FAIL because `src/lib/db.ts` does not exist.

- [ ] **Step 5: Implement `src/lib/db.ts`**

```ts
import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettingRecord,
  SpaceObjectTypeRecord,
  SpaceRecord,
} from "@/lib/spaces/space-types";

export class KnowledgeDatabase extends Dexie {
  spaces!: EntityTable<SpaceRecord, "id">;
  appSettings!: EntityTable<AppSettingRecord, "id">;
  objectTypes!: EntityTable<SpaceObjectTypeRecord, "id">;

  constructor(name = "KnowledgeOS_DB") {
    super(name);
    this.version(1).stores({
      spaces: "id, accountId, [accountId+sortOrder], name, createdAt, updatedAt",
      appSettings: "id",
      objectTypes: "id, spaceId, [spaceId+id], ownership, lifecycleKind",
    });
  }
}

export function createKnowledgeDatabase(name?: string) {
  return new KnowledgeDatabase(name);
}

export const db = createKnowledgeDatabase();
```

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/db.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/spaces/space-types.ts src/lib/db.ts src/lib/db.test.ts
git commit -m "feat: add Space persistence schema"
```

---

### Task 2: Add the Space repository and persistent reorder

**Files:**
- Create: `src/lib/spaces/space-repository.ts`
- Create: `src/lib/spaces/space-repository.test.ts`

**Interfaces:**
- Produces:
  - `createSpaceRepository(database)`
  - `listSpaces(): Promise<SpaceRecord[]>`
  - `getActiveSpaceId(): Promise<string | null>`
  - `setActiveSpace(spaceId: string): Promise<void>`
  - `createBlankSpace(name: string, now?: () => Date): Promise<SpaceRecord>`
  - `reorderSpaces(orderedIds: readonly string[]): Promise<void>`
  - `listObjectTypes(spaceId: string): Promise<SpaceObjectTypeRecord[]>`

- [ ] **Step 1: Write RED repository tests**

Create `src/lib/spaces/space-repository.test.ts` with a `setup()` helper using a unique fake IndexedDB database and these tests:

```ts
it("creates a blank Space and activates it", async () => {
  const created = await repository.createBlankSpace("Research");
  expect(await repository.getActiveSpaceId()).toBe(created.id);
  expect(await database.objectTypes.where("spaceId").equals(created.id).count()).toBe(0);
});

it("rejects selecting an unknown Space", async () => {
  await expect(repository.setActiveSpace("missing")).rejects.toThrow("Unknown Space");
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

- [ ] **Step 3: Implement `createBlankSpace` atomically**

```ts
async function createBlankSpace(name: string, now: () => Date = () => new Date()) {
  const normalizedName = name.trim();
  if (!normalizedName) throw new Error("Space name is required.");

  const timestamp = now().toISOString();
  const record: SpaceRecord = {
    id: `space-${crypto.randomUUID()}`,
    accountId: LOCAL_ACCOUNT_ID,
    name: normalizedName,
    sortOrder: await database.spaces.count(),
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

Do not write `objectTypes` in this function.

- [ ] **Step 4: Implement active Space validation**

```ts
async function setActiveSpace(spaceId: string) {
  if (!(await database.spaces.get(spaceId))) {
    throw new Error(`Unknown Space: ${spaceId}`);
  }
  await database.appSettings.put({ id: ACTIVE_SPACE_SETTING_ID, value: spaceId });
}
```

- [ ] **Step 5: Implement reorder**

```ts
async function reorderSpaces(orderedIds: readonly string[]) {
  const current = await listSpaces();
  const currentIds = new Set(current.map((space) => space.id));
  if (
    orderedIds.length !== current.length ||
    new Set(orderedIds).size !== current.length ||
    orderedIds.some((id) => !currentIds.has(id))
  ) {
    throw new Error("Space order must contain every Space exactly once.");
  }

  await database.transaction("rw", database.spaces, async () => {
    await Promise.all(
      orderedIds.map((id, sortOrder) => database.spaces.update(id, { sortOrder })),
    );
  });
}
```

`listSpaces()` sorts ascending by `sortOrder`.

- [ ] **Step 6: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/space-repository.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spaces/space-repository.ts src/lib/spaces/space-repository.test.ts
git commit -m "feat: add Space repository"
```

---

### Task 3: Bootstrap Personal Space without seeding new Spaces

**Files:**
- Create: `src/lib/spaces/personal-space-seed.ts`
- Create: `src/lib/spaces/personal-space-seed.test.ts`
- Create: `src/lib/spaces/bootstrap-workspace.ts`
- Create: `src/lib/spaces/bootstrap-workspace.test.ts`

**Interfaces:**
- Consumes: `BUILT_IN_STRUCTURES` from `src/lib/workspace-object-types.ts`.
- Produces: `createPersonalSpaceSeed`, `bootstrapWorkspace`.

- [ ] **Step 1: Write RED Personal seed test**

```ts
it("seeds the current catalog only for Personal Space", () => {
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

- [ ] **Step 2: Implement seed from `BUILT_IN_STRUCTURES`**

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

- [ ] **Step 3: Write RED bootstrap tests**

```ts
it("is idempotent", async () => {
  await bootstrapWorkspace(database, fixedNow);
  const count = await database.objectTypes.count();
  await bootstrapWorkspace(database, fixedNow);
  expect(await database.objectTypes.count()).toBe(count);
});

it("never seeds a later blank Space", async () => {
  await bootstrapWorkspace(database, fixedNow);
  const repository = createSpaceRepository(database);
  const blank = await repository.createBlankSpace("Blank");
  await bootstrapWorkspace(database, fixedNow);
  expect(await database.objectTypes.where("spaceId").equals(blank.id).count()).toBe(0);
});
```

- [ ] **Step 4: Implement bootstrap transaction**

The transaction must:
1. check `database.spaces.get(PERSONAL_SPACE_ID)`;
2. when missing, insert the Personal record and all Personal `BUILT_IN_STRUCTURES` rows;
3. read the active setting;
4. when the active ID is absent or no longer exists, write Personal as active;
5. leave all existing non-Personal object type rows untouched.

- [ ] **Step 5: GREEN + lint**

```bash
pnpm vitest run src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.test.ts
pnpm lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spaces/personal-space-seed.ts src/lib/spaces/personal-space-seed.test.ts src/lib/spaces/bootstrap-workspace.ts src/lib/spaces/bootstrap-workspace.test.ts
git commit -m "feat: bootstrap Personal Space"
```

---

### Task 4: Bind the current WorkspaceProvider to Dexie

**Files:**
- Create: `src/hooks/use-space-data.ts`
- Create: `src/components/workspace-object-type-presenter.ts`
- Create: `src/components/workspace-object-type-presenter.test.ts`
- Modify: `src/components/workspace-controller.tsx`

**Interfaces:**
- Produces: `useSpaceData()`, `presentWorkspaceObjectType(record, count)`.

- [ ] **Step 1: Write RED presenter test**

```ts
import { expect, it } from "vitest";
import { ObjectPageIcon } from "@/components/object-icons";
import { presentWorkspaceObjectType } from "./workspace-object-type-presenter";

it("maps persisted page metadata to the existing UI type", () => {
  const value = presentWorkspaceObjectType(
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
    2,
  );
  expect(value.icon).toBe(ObjectPageIcon);
  expect(value.label).toBe("Pages");
  expect(value.count).toBe(2);
});
```

- [ ] **Step 2: Implement complete icon presenter**

Create one `Record<ObjectIconName, React.ElementType<ObjectIconProps>>` mapping every icon name currently declared by `ObjectIconName` to an existing icon component from `object-icons.tsx`. `presentWorkspaceObjectType` returns the current sidebar shape with `id`, `label`, `singularLabel`, `icon`, `iconName`, `tone`, `ownership`, and `count`.

- [ ] **Step 3: Implement `useSpaceData`**

Use `useLiveQuery` for Spaces, active setting, and active object types:

```ts
const spaces = useLiveQuery(() => db.spaces.orderBy("sortOrder").toArray(), [], []);
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

Call `bootstrapWorkspace(db)` once from an effect and expose a `ready` boolean only after bootstrap resolves.

- [ ] **Step 4: Refactor `WorkspaceProvider`**

Replace persistent state:

```ts
const [spaces, setSpaces] = React.useState(defaultSpaces);
const [spaceId, setSpaceId] = React.useState("personal");
```

with `useSpaceData()` plus one memoized repository instance.

Expose existing context-compatible callbacks:

```ts
createSpace: (name: string) => repository.createBlankSpace(name),
switchSpace: (id: string) => repository.setActiveSpace(id),
setSpaces: (nextSpaces: { id: string }[]) => repository.reorderSpaces(nextSpaces.map((space) => space.id)),
```

Derive `objectTypes` exclusively from active `objectTypeRecords`. Therefore a new Space renders an empty object-type list.

Keep tabs, pane state, active navigation state, and other transient UI `useState` values unchanged.

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
git commit -m "feat: bind WorkspaceProvider to Spaces"
```

---

### Task 5: Prove blank Space persistence in Playwright

**Files:**
- Modify: `tests/space-create-state.spec.ts`
- Create: `tests/space-isolation.spec.ts`

- [ ] **Step 1: Update the existing creation test**

After creating a Space, add:

```ts
await page.reload();
await expect(page.getByRole("button", { name: /Created Space/i })).toBeVisible();
```

- [ ] **Step 2: Add the blank Space browser test**

```ts
import { expect, test } from "@playwright/test";

test("new Space is blank and survives reload", async ({ page }) => {
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

- [ ] **Step 3: Run focused verification**

```bash
pnpm test:unit
pnpm exec playwright test tests/space-create-state.spec.ts tests/space-isolation.spec.ts
pnpm lint
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit**

```bash
git add tests/space-create-state.spec.ts tests/space-isolation.spec.ts
git commit -m "test: cover persistent blank Spaces"
```
