import { describe, expect, it } from "vitest";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { selectStudyGoalDashboard } from "@/lib/srs/study-goal-dashboard";

function baseEntity(input: Partial<SpaceEntityRecord> & Pick<SpaceEntityRecord, "id" | "type">) {
  return {
    id: input.id,
    spaceId: input.spaceId ?? "personal",
    objectTypeId: input.objectTypeId ?? input.type,
    type: input.type,
    title: input.title ?? input.id,
    createdAt: input.createdAt ?? "2025-12-27T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: "pending" as const,
  };
}

function flashcard(id: string, repetitionCount: number): SpaceEntityRecord {
  return {
    ...baseEntity({ id, type: "flashcard" }),
    cardType: "basic",
    front: id,
    back: id,
    fileId: "file-1",
    sourceHighlightId: "highlight-1",
    sourceQuoteSnippet: id,
    aiGenerated: false,
    srs: {
      state: repetitionCount > 0 ? "review" : "new",
      dueDate: "2026-01-01T00:00:00.000Z",
      lastReviewedAt: "2026-01-01T00:00:00.000Z",
      interval: repetitionCount > 0 ? 1 : 0,
      easeFactor: 2500,
      repetitionCount,
      lapses: 0,
    },
  } as SpaceEntityRecord;
}

describe("selectStudyGoalDashboard", () => {
  it("derives exam pacing from real study goal and flashcard entities", () => {
    const goal = {
      ...baseEntity({
        id: "exam",
        type: "study_goal",
        title: "Biology exam",
      }),
      targetExamDate: "2026-01-11T00:00:00.000Z",
      targetRetentionRate: 0.9,
      totalCards: 10,
      dailyNewCardsQuota: 0,
      expectedDailyReviews: 0,
      targetFileIds: [],
    } as SpaceEntityRecord;

    const dashboard = selectStudyGoalDashboard(
      [
        goal,
        flashcard("learned-1", 1),
        flashcard("learned-2", 2),
        flashcard("new-1", 0),
        flashcard("new-2", 0),
        flashcard("new-3", 0),
      ],
      new Date("2026-01-01T00:00:00.000Z"),
    );

    expect(dashboard).toMatchObject({
      goalTitle: "Biology exam",
      totalCards: 10,
      learnedCards: 2,
      unlearnedCards: 8,
      dueCards: 5,
      daysRemaining: 10,
      dailyNewCardQuota: 1,
      status: "behind",
    });
  });
});

it("uses the selected goal and limits its cards to the same Space and chosen files", () => {
  const goal = {
    ...baseEntity({ id: "selected", type: "study_goal" }),
    targetExamDate: "2026-02-01T00:00:00.000Z",
    targetRetentionRate: 0.9,
    totalCards: 0,
    targetFileIds: ["file-1"],
  } as SpaceEntityRecord;
  const earlier = { ...goal, id: "earlier", targetExamDate: "2026-01-02T00:00:00.000Z" };
  const otherFile = { ...flashcard("other-file", 0), fileId: "file-2" };
  const otherSpace = { ...flashcard("other-space", 0), spaceId: "other" };
  expect(
    selectStudyGoalDashboard(
      [earlier, goal, flashcard("included", 1), otherFile, otherSpace],
      new Date("2026-01-01T00:00:00.000Z"),
      "selected",
    ),
  ).toMatchObject({ goalId: "selected", totalCards: 1, learnedCards: 1, dueCards: 1 });
});
