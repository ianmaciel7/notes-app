import { selectDueFlashcards } from "@/lib/srs/flashcard-review";
import { estimatePacingStatus, parseIsoOrNow, type PacingStatus } from "@/lib/srs/fsrs";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import type { StudyGoalEntity } from "@/types/schema";

export type StudyGoalDashboardEntity = SpaceEntityRecord & StudyGoalEntity;

export type StudyGoalDashboard = {
  goalId: string;
  goalTitle: string;
  targetExamDate: string;
  targetRetentionRate: number;
  totalCards: number;
  learnedCards: number;
  unlearnedCards: number;
  dueCards: number;
  daysRemaining: number;
  expectedCompleted: number;
  dailyNewCardQuota: number;
  bufferDays: number;
  status: PacingStatus;
};

export function isStudyGoalEntity(
  entity: SpaceEntityRecord,
): entity is StudyGoalDashboardEntity {
  const candidate = entity as SpaceEntityRecord & Partial<StudyGoalEntity>;
  return (
    candidate.type === "study_goal" &&
    typeof candidate.targetExamDate === "string" &&
    typeof candidate.targetRetentionRate === "number"
  );
}

function daysBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86_400_000));
}

export function selectStudyGoalDashboard(
  entities: readonly SpaceEntityRecord[],
  now: Date = new Date(),
): StudyGoalDashboard | null {
  const goal = entities.filter(isStudyGoalEntity).toSorted((left, right) => {
    return parseIsoOrNow(left.targetExamDate).getTime() - parseIsoOrNow(right.targetExamDate).getTime();
  })[0];
  if (!goal) return null;

  const flashcards = entities.filter(
    (entity) => entity.type === "flashcard" && typeof entity.srs === "object" && entity.srs !== null,
  );
  const learnedCards = flashcards.filter((card) => (card.srs?.repetitionCount ?? 0) > 0).length;
  const totalCards = Math.max(goal.totalCards || 0, flashcards.length);
  const unlearnedCards = Math.max(0, totalCards - learnedCards);
  const daysRemaining = Math.max(1, daysBetween(now, parseIsoOrNow(goal.targetExamDate)));
  const daysElapsed = daysBetween(parseIsoOrNow(goal.createdAt), now);
  const pacing = estimatePacingStatus({
    actualCompletedCards: learnedCards,
    daysElapsed,
    daysRemaining,
    totalCards,
    unlearnedCardCount: unlearnedCards,
  });

  return {
    goalId: goal.id,
    goalTitle: goal.title,
    targetExamDate: goal.targetExamDate,
    targetRetentionRate: goal.targetRetentionRate,
    totalCards,
    learnedCards,
    unlearnedCards,
    dueCards: selectDueFlashcards(entities, now).length,
    daysRemaining: pacing.daysRemaining,
    expectedCompleted: pacing.expectedCompleted,
    dailyNewCardQuota: pacing.dailyNewCardQuota,
    bufferDays: pacing.bufferDays,
    status: pacing.status,
  };
}
