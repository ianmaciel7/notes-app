import { expect, it } from "vitest";
import { estimatePacingStatus } from "@/lib/srs/fsrs";

const halfwayGoal = {
  totalCards: 100,
  actualCompletedCards: 50,
  unlearnedCardCount: 50,
  daysElapsed: 15,
  daysRemaining: 15,
};

it("uses the full elapsed-plus-remaining horizon for expected study progress", () => {
  expect(estimatePacingStatus(halfwayGoal)).toMatchObject({
    expectedCompleted: 50,
    status: "onTrack",
  });
});

it("assigns no new-card quota when there are no unlearned cards", () => {
  expect(estimatePacingStatus({ ...halfwayGoal, unlearnedCardCount: 0 }).dailyNewCardQuota).toBe(0);
});

it("starts on track instead of declaring zero progress ahead", () => {
  expect(
    estimatePacingStatus({ ...halfwayGoal, daysElapsed: 0, actualCompletedCards: 0 }).status,
  ).toBe("onTrack");
});

it("preserves a consolidation buffer in the daily new-card quota", () => {
  const result = estimatePacingStatus(halfwayGoal);
  expect(result.bufferDays).toBe(3);
  expect(result.dailyNewCardQuota).toBe(Math.ceil(50 / (15 - 3)));
});
