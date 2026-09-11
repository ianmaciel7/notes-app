import { expect, it } from "vitest";
import {
  defaultObjectListPreferences,
  objectListPreferencesKey,
  parseObjectListPreferences,
  resolveObjectListSpaceId,
  selectObjectListEntities,
} from "@/app/_components/objects/list/object-list-model";
import {
  readObjectListPreferences,
  writeObjectListPreferences,
} from "@/app/_components/objects/list/object-list-storage";
import {
  objectEntityFixture,
  objectTypeFixture,
} from "@/app/_components/objects/object-view-fixtures";

it("isolates an object list by both type and space", () => {
  const own = objectEntityFixture();
  const foreign = objectEntityFixture({ id: "foreign", spaceId: "work" });
  const otherType = objectEntityFixture({ id: "task", objectTypeId: "task" });
  expect(
    selectObjectListEntities(
      [own, foreign, otherType],
      objectTypeFixture(),
      defaultObjectListPreferences,
    ),
  ).toEqual([own]);
});

it("rejects ambiguous unscoped lists instead of merging spaces", () => {
  const type = { id: "page", singularName: "Page", pluralName: "Pages" };
  const entities = [objectEntityFixture(), objectEntityFixture({ spaceId: "work" })];
  expect(resolveObjectListSpaceId(entities, type)).toBeUndefined();
  expect(selectObjectListEntities(entities, type, defaultObjectListPreferences)).toEqual([]);
});

it("combines block search and tag filtering without mutating the input", () => {
  const entities = [
    objectEntityFixture({ id: "b", title: "B" }),
    objectEntityFixture({ id: "a", title: "A" }),
    objectEntityFixture({ id: "c", title: "C", tags: [] }),
  ];
  const original = structuredClone(entities);
  const results = selectObjectListEntities(entities, objectTypeFixture(), {
    ...defaultObjectListPreferences,
    query: " SAVED CONTENT ",
    filter: "tagged",
    sort: "title-asc",
  });
  expect(results.map((entity) => entity.id)).toEqual(["a", "b"]);
  expect(entities).toEqual(original);
});

it.each([null, "not-json", "null", "[]", '{"mode":"invalid"}'])(
  "falls back safely for preferences %s",
  (raw) => {
    expect(parseObjectListPreferences(raw)).toEqual(defaultObjectListPreferences);
  },
);

it("migrates the old sort preference without inventing new values", () => {
  expect(parseObjectListPreferences('{"sortNewestFirst":false}').sort).toBe("updated-asc");
  expect(parseObjectListPreferences('{"sort":"invalid"}').sort).toBe("updated-desc");
});

it("handles denied reads and quota-limited writes without crashing", () => {
  const storage = {
    getItem() {
      throw new Error("Access denied");
    },
    setItem() {
      throw new Error("Quota exceeded");
    },
  };
  expect(readObjectListPreferences("view", storage)).toEqual(defaultObjectListPreferences);
  expect(writeObjectListPreferences("view", defaultObjectListPreferences, storage)).toBe(false);
});

it("persists independent view preferences with the legacy namespace", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const a = objectListPreferencesKey("personal", "page");
  const b = objectListPreferencesKey("work", "page");
  expect(a).toBe("knowledgeos.workspace.objectTypeList.personal.page");
  expect(
    writeObjectListPreferences(a, { ...defaultObjectListPreferences, query: "A" }, storage),
  ).toBe(true);
  expect(
    writeObjectListPreferences(b, { ...defaultObjectListPreferences, query: "B" }, storage),
  ).toBe(true);
  expect(readObjectListPreferences(a, storage).query).toBe("A");
  expect(readObjectListPreferences(b, storage).query).toBe("B");
});
