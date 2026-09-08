import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import { bootstrapWorkspace } from "@/lib/spaces/bootstrap-space";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import { PERSONAL_SPACE_ID, type SpaceEntityRecord } from "@/lib/spaces/space-types";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  return { database, repository: createSpaceRepository(database) };
}

function entityFixture(
  input: Pick<SpaceEntityRecord, "id" | "spaceId" | "objectTypeId"> & Partial<SpaceEntityRecord>,
): SpaceEntityRecord {
  return {
    id: input.id,
    spaceId: input.spaceId,
    objectTypeId: input.objectTypeId,
    type: input.type ?? input.objectTypeId,
    title: input.title ?? input.id,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

async function createBookType(
  repository: ReturnType<typeof createSpaceRepository>,
  spaceId: string,
) {
  await repository.createObjectType(spaceId, {
    singularName: "Book",
    pluralName: "Books",
    iconName: "book",
    tone: "purple",
    lifecycleKind: "document",
  });
  const type = (await repository.listObjectTypes(spaceId))[0];
  if (!type) throw new Error("Book type was not created");
  return type;
}

describe("Space repository", () => {
  it("creates and activates a completely blank Space", async () => {
    const { database, repository } = setup();
    const created = await repository.createBlankSpace("Research");

    expect(await repository.getActiveSpaceId()).toBe(created.id);
    for (const table of [
      database.objectTypes,
      database.entities,
      database.collections,
      database.tags,
      database.relations,
      database.media,
      database.spaceSettings,
      database.trash,
    ]) {
      expect(await table.where("spaceId").equals(created.id).count()).toBe(0);
    }
  });

  it("rejects selecting an unknown Space", async () => {
    const { repository } = setup();
    await expect(repository.setActiveSpace("missing")).rejects.toThrow("Unknown Space");
  });

  it("persists Space order", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    await repository.reorderSpaces([second.id, first.id]);
    expect((await repository.listSpaces()).map((space) => space.id)).toEqual([second.id, first.id]);
  });

  it("keeps object types and objects isolated", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");

    const type = await createBookType(repository, first.id);
    expect(type.pluralName).toBe("Books");
    expect(await repository.listObjectTypes(second.id)).toEqual([]);

    await repository.createEntity(first.id, type.id, "Domain-Driven Design");
    expect((await repository.listEntities(first.id)).map((entity) => entity.title)).toEqual([
      "Domain-Driven Design",
    ]);
    expect(await repository.listEntities(second.id)).toEqual([]);
  });

  it("keeps collections and tags isolated", async () => {
    const { database, repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    const type = await createBookType(repository, first.id);

    await repository.createCollection(first.id, type.id, "Unread");
    await repository.createTag(first.id, "Important");

    expect(
      (await database.collections.where("spaceId").equals(first.id).toArray()).map(
        (item) => item.name,
      ),
    ).toEqual(["Unread"]);
    expect(await database.collections.where("spaceId").equals(second.id).count()).toBe(0);
    expect(
      (await database.tags.where("spaceId").equals(first.id).toArray()).map((item) => item.name),
    ).toEqual(["Important"]);
    expect(await database.tags.where("spaceId").equals(second.id).count()).toBe(0);
  });

  it("keeps media settings and trash isolated", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    const timestamp = "2026-01-01T00:00:00.000Z";

    await repository.putMedia(first.id, {
      id: "paper",
      spaceId: first.id,
      name: "paper.pdf",
      mimeType: "application/pdf",
      blobKey: "blob-paper",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    await repository.setSpaceSetting(first.id, "sidebar.sort", "alphabetical");
    await repository.putTrash(first.id, {
      id: "trash:entity-a",
      spaceId: first.id,
      entityId: "entity-a",
      label: "Deleted page",
      typeLabel: "Page",
      trashedAt: timestamp,
      purgeAfter: "2026-02-01T00:00:00.000Z",
    });

    expect((await repository.listMedia(first.id)).map((item) => item.id)).toEqual(["paper"]);
    expect(await repository.listMedia(second.id)).toEqual([]);
    expect(await repository.getSpaceSetting(first.id, "sidebar.sort")).toBe("alphabetical");
    expect(await repository.getSpaceSetting(second.id, "sidebar.sort")).toBeNull();
    expect((await repository.listTrash(first.id)).map((item) => item.entityId)).toEqual([
      "entity-a",
    ]);
    expect(await repository.listTrash(second.id)).toEqual([]);
  });

  it("persists pinned entity ids per Space and ignores ids from other Spaces", async () => {
    const { database, repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    const type = await createBookType(repository, first.id);
    const collection = await repository.createCollection(first.id, type.id, "Reading");
    await database.entities.bulkAdd([
      entityFixture({ id: "first-book", spaceId: first.id, objectTypeId: type.id }),
      entityFixture({ id: "other-book", spaceId: second.id, objectTypeId: "page" }),
    ]);

    await repository.setPinnedEntityIds(first.id, [
      "first-book",
      collection.id,
      "first-book",
      "other-book",
      "missing",
    ]);

    expect(await repository.listPinnedEntityIds(first.id)).toEqual(["first-book", collection.id]);
    expect(await repository.listPinnedEntityIds(second.id)).toEqual([]);
  });

  it("allows the same logical id in different Spaces", async () => {
    const { database, repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    await database.entities.bulkAdd([
      entityFixture({ id: "same", spaceId: first.id, objectTypeId: "page" }),
      entityFixture({ id: "same", spaceId: second.id, objectTypeId: "page" }),
    ]);
    expect(await database.entities.get([first.id, "same"])).toBeDefined();
    expect(await database.entities.get([second.id, "same"])).toBeDefined();
  });

  it("creates a flashcard entity with initial FSRS state and records review persistence", async () => {
    const { database, repository } = setup();
    const space = await repository.createBlankSpace("First");
    const type = await createBookType(repository, space.id);
    const highlight = await repository.createHighlightEntity(space.id, {
      objectTypeId: type.id,
      fileId: "source-file-id",
      exactText: "function with lexical scope memory",
      color: "yellow",
      location: { startOffset: 10, endOffset: 44 },
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const flashcard = await repository.createFlashcardEntity(space.id, {
      objectTypeId: type.id,
      title: "What is a closure?",
      front: "What is a closure in JavaScript?",
      back: "A function that remembers references to variables outside itself.",
      fileId: "source-file-id",
      sourceHighlightId: highlight.id,
      sourceQuoteSnippet: "function with lexical scope memory",
      cardType: "basic",
      aiGenerated: false,
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const persisted = await repository.listEntities(space.id);
    const savedFlashcard = persisted.find((entity) => entity.id === flashcard.id);
    expect(savedFlashcard).toBeDefined();
    expect(savedFlashcard?.type).toBe("flashcard");
    expect(savedFlashcard?.srs?.state).toBe("new");
    expect(savedFlashcard?.srs?.interval).toBe(0);

    const reviewed = await repository.recordFlashcardReview(
      space.id,
      flashcard.id,
      3,
      new Date("2026-01-02T00:00:00.000Z"),
    );

    const afterReview = await database.entities.get([space.id, flashcard.id]);
    expect(afterReview?.srs?.state).toBe("review");
    expect(reviewed.nextState.state).toBe("review");
  });

  it("creates highlight entities with source quote anchors", async () => {
    const { database, repository } = setup();
    const space = await repository.createBlankSpace("First");
    const type = await createBookType(repository, space.id);

    const highlight = await repository.createHighlightEntity(space.id, {
      objectTypeId: type.id,
      title: "Important quote",
      fileId: "paper",
      exactText: "retrieval practice improves retention",
      prefix: "The evidence says ",
      suffix: " across exams.",
      color: "green",
      location: { pageNumber: 3, startOffset: 120, endOffset: 156 },
      userNote: "Use for memory card",
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const persisted = await database.entities.get([space.id, highlight.id]);
    expect(persisted).toMatchObject({
      id: highlight.id,
      type: "highlight",
      objectTypeId: type.id,
      title: "Important quote",
      fileId: "paper",
      exactText: "retrieval practice improves retention",
      prefix: "The evidence says ",
      suffix: " across exams.",
      color: "green",
      location: { pageNumber: 3, startOffset: 120, endOffset: 156 },
      userNote: "Use for memory card",
      cardCount: 0,
      _syncStatus: "pending",
    });
  });

  it("creates grounded flashcards by synthesizing a highlight from an exact quote", async () => {
    const { database, repository } = setup();
    const space = await repository.createBlankSpace("First");
    const type = await createBookType(repository, space.id);

    const result = await repository.createGroundedFlashcardFromQuote(space.id, {
      objectTypeId: type.id,
      fileId: "paper",
      sourceText:
        "Before retrieval practice improves retention after repeated tests.",
      exactQuote: "retrieval practice improves retention",
      front: "What improves retention?",
      back: "Retrieval practice.",
      title: "Retrieval practice",
      color: "blue",
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(result.highlight).toMatchObject({
      type: "highlight",
      fileId: "paper",
      exactText: "retrieval practice improves retention",
      prefix: "Before ",
      suffix: " after repeated tests.",
      color: "blue",
      location: { startOffset: 7, endOffset: 44 },
      cardCount: 1,
      _syncStatus: "pending",
    });
    expect(result.flashcard).toMatchObject({
      type: "flashcard",
      fileId: "paper",
      sourceHighlightId: result.highlight.id,
      sourceQuoteSnippet: "retrieval practice improves retention",
      front: "What improves retention?",
      back: "Retrieval practice.",
      aiGenerated: true,
      _syncStatus: "pending",
    });

    const persistedHighlight = await database.entities.get([space.id, result.highlight.id]);
    expect(persistedHighlight?.cardCount).toBe(1);
  });

  it("rejects grounded flashcards when the exact quote is not in the source text", async () => {
    const { repository } = setup();
    const space = await repository.createBlankSpace("First");
    const type = await createBookType(repository, space.id);

    await expect(
      repository.createGroundedFlashcardFromQuote(space.id, {
        objectTypeId: type.id,
        fileId: "paper",
        sourceText: "The source chunk contains only real text.",
        exactQuote: "fabricated quote",
        front: "Question",
        back: "Answer",
      }),
    ).rejects.toThrow("Exact quote was not found");
  });

  it("rejects flashcards whose source highlight is missing in the active Space", async () => {
    const { repository } = setup();
    const space = await repository.createBlankSpace("First");
    const type = await createBookType(repository, space.id);

    await expect(
      repository.createFlashcardEntity(space.id, {
        objectTypeId: type.id,
        title: "Missing source",
        front: "Question",
        back: "Answer",
        fileId: "source-file-id",
        sourceHighlightId: "missing-highlight",
        sourceQuoteSnippet: "quote",
      }),
    ).rejects.toThrow("Source highlight not found");
  });

  it("creates manual flashcards with the fields required by the real review UI", async () => {
    const { database, repository } = setup();
    await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));

    const flashcard = await repository.createEntity(
      PERSONAL_SPACE_ID,
      "flashcard",
      "Manual card",
    );

    expect(flashcard).toMatchObject({
      type: "flashcard",
      objectTypeId: "flashcard",
      title: "Manual card",
      cardType: "basic",
      front: "Manual card",
      back: "",
      fileId: "manual",
      sourceHighlightId: "manual",
      sourceQuoteSnippet: "",
      aiGenerated: false,
      _syncStatus: "pending",
    });
    expect(flashcard.srs?.state).toBe("new");
  });

  it("creates study goals with pacing fields required by the dashboard", async () => {
    const { database, repository } = setup();
    await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));

    const goal = await repository.createEntity(PERSONAL_SPACE_ID, "study_goal", "Biology exam");

    expect(goal).toMatchObject({
      type: "study_goal",
      objectTypeId: "study_goal",
      title: "Biology exam",
      targetRetentionRate: 0.9,
      totalCards: 0,
      dailyNewCardsQuota: 0,
      expectedDailyReviews: 0,
      targetFileIds: [],
      _syncStatus: "pending",
    });
    const targetExamDate = (goal as unknown as { targetExamDate: string }).targetExamDate;
    expect(Number.isFinite(new Date(targetExamDate).getTime())).toBe(true);
  });

  it("updates entity fields in the active Space and marks the record pending", async () => {
    const { database, repository } = setup();
    await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));
    const flashcard = await repository.createEntity(PERSONAL_SPACE_ID, "flashcard", "Manual card");

    await repository.updateEntity(PERSONAL_SPACE_ID, flashcard.id, {
      title: "Updated card",
      front: "Updated front",
      back: "Updated back",
    });

    const updated = await database.entities.get([PERSONAL_SPACE_ID, flashcard.id]);
    expect(updated).toMatchObject({
      title: "Updated card",
      front: "Updated front",
      back: "Updated back",
      _syncStatus: "pending",
    });
    expect(Number.isFinite(new Date(updated?.updatedAt ?? "").getTime())).toBe(true);
  });

  it("does not allow generic entity updates to rewrite identity fields", async () => {
    const { database, repository } = setup();
    await bootstrapWorkspace(database, () => new Date("2026-01-01T00:00:00.000Z"));
    const flashcard = await repository.createEntity(PERSONAL_SPACE_ID, "flashcard", "Manual card");

    await repository.updateEntity(
      PERSONAL_SPACE_ID,
      flashcard.id,
      {
        id: "rewritten",
        spaceId: "other-space",
        objectTypeId: "page",
        createdAt: "1999-01-01T00:00:00.000Z",
        title: "Still editable",
      } as never,
    );

    const updated = await database.entities.get([PERSONAL_SPACE_ID, flashcard.id]);
    expect(updated).toMatchObject({
      id: flashcard.id,
      spaceId: PERSONAL_SPACE_ID,
      objectTypeId: "flashcard",
      createdAt: flashcard.createdAt,
      title: "Still editable",
    });
    expect(await database.entities.get([PERSONAL_SPACE_ID, "rewritten"])).toBeUndefined();
  });

  it("rejects cross-Space relations", async () => {
    const { database, repository } = setup();
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
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    ).rejects.toThrow("Cross-Space relation");
  });
});
