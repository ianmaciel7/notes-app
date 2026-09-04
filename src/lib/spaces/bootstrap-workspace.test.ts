import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import { bootstrapWorkspace } from "@/lib/spaces/bootstrap-workspace";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import { PERSONAL_SPACE_ID } from "@/lib/spaces/space-types";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  return database;
}

describe("bootstrapWorkspace", () => {
  it("seeds only Personal Space with the current built-in catalog", async () => {
    const database = setup();
    await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));
    const types = await database.objectTypes.where("spaceId").equals(PERSONAL_SPACE_ID).toArray();
    expect(types.map((type) => type.id).sort()).toEqual(
      [
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
      ].sort(),
    );
  });

  it("is idempotent and never seeds a later blank Space", async () => {
    const database = setup();
    await bootstrapWorkspace(database);
    const initialCount = await database.objectTypes.count();
    const repository = createSpaceRepository(database);
    const blank = await repository.createBlankSpace("Blank");
    await bootstrapWorkspace(database);
    expect(await database.objectTypes.count()).toBe(initialCount);
    expect(await database.objectTypes.where("spaceId").equals(blank.id).count()).toBe(0);
  });
});
