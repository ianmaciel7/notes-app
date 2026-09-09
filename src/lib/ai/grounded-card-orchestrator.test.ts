import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { persistGeneratedCardsFromChunk } from "@/lib/ai/grounded-card-orchestrator";
import { createKnowledgeDatabase } from "@/lib/db";
import { createSpaceRepository } from "@/lib/spaces/space-repository";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

async function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  const repository = createSpaceRepository(database);
  const space = await repository.createBlankSpace("AI grounding");
  await repository.createObjectType(space.id, {
    singularName: "Card",
    pluralName: "Cards",
    iconName: "book",
    tone: "blue",
    lifecycleKind: "document",
  });
  const objectType = (await repository.listObjectTypes(space.id))[0];
  if (!objectType) throw new Error("Card type was not created");
  return { database, repository, space, objectType };
}

describe("Grounded generated card orchestrator", () => {
  it("persists provider cards through quote grounding and rejects fabricated quotes", async () => {
    const { database, repository, space, objectType } = await setup();

    const result = await persistGeneratedCardsFromChunk({
      repository,
      spaceId: space.id,
      objectTypeId: objectType.id,
      fileId: "file-a",
      sourceText:
        "Retrieval practice improves retention. Spaced repetition protects long-term memory.",
      cards: [
        {
          exactQuote: "Retrieval practice improves retention.",
          cardType: "basic",
          front: "What improves retention?",
          back: "Retrieval practice.",
        },
        {
          exactQuote: "Fabricated provider quote",
          cardType: "basic",
          front: "What was fabricated?",
          back: "This should not persist.",
        },
      ],
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(result.persisted).toHaveLength(1);
    expect(result.persisted[0]?.highlight).toMatchObject({
      type: "highlight",
      exactText: "Retrieval practice improves retention.",
      fileId: "file-a",
      cardCount: 1,
    });
    expect(result.persisted[0]?.flashcard).toMatchObject({
      type: "flashcard",
      front: "What improves retention?",
      back: "Retrieval practice.",
      sourceQuoteSnippet: "Retrieval practice improves retention.",
      aiGenerated: true,
    });
    expect(result.rejected).toEqual([
      {
        card: {
          exactQuote: "Fabricated provider quote",
          cardType: "basic",
          front: "What was fabricated?",
          back: "This should not persist.",
        },
        reason: "Exact quote was not found in source text.",
      },
    ]);

    const entities = await database.entities.where("spaceId").equals(space.id).toArray();
    expect(entities.filter((entity) => entity.type === "flashcard")).toHaveLength(1);
    expect(entities.filter((entity) => entity.type === "highlight")).toHaveLength(1);
  });
});
