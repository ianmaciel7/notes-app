import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

describe("KnowledgeDatabase", () => {
  it("uses compound primary keys for every Space-owned table", async () => {
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
      "spaceSettings",
      "trash",
    ]) {
      const table = database.table(tableName);
      expect(table.schema.primKey.keyPath).toEqual(["spaceId", "id"]);
      expect(table.schema.indexes.some((index) => index.name === "spaceId")).toBe(true);
    }
  });

  it("indexes Space order independently", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    opened.push(database);
    await database.open();
    expect(database.spaces.schema.indexes.some((index) => index.name === "sortOrder")).toBe(true);
  });
});
