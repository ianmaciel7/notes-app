import { DomainError } from "@/domain/shared/domain-error";

export type AttemptStatus = "in-progress" | "completed";

export interface AttemptItemRecord {
  questionId: string;
  questionRevisionId: string;
  position: number;
  points: number;
  submittedAnswer?: { optionIds: string[] };
  isCorrect?: boolean;
  isBookmarked?: boolean;
  answeredAt?: string;
}

export interface AttemptRecord {
  id: string;
  userId: string;
  spaceId: string;
  examId: string;
  examRevisionId: string;
  status: AttemptStatus;
  passingPercentage: number;
  score?: number;
  maximumScore?: number;
  percentage?: number;
  passed?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AttemptScoreResult {
  score: number;
  maximumScore: number;
  percentage: number;
  passed: boolean;
}

export function scoreAttempt(
  items: AttemptItemRecord[],
  passingPercentage: number,
): AttemptScoreResult {
  const maximumScore = items.reduce((sum, item) => sum + item.points, 0);
  const score = items.reduce(
    (sum, item) => sum + (item.isCorrect ? item.points : 0),
    0,
  );
  const percentage =
    maximumScore > 0 ? Math.round((score / maximumScore) * 100) : 0;
  const passed = percentage >= passingPercentage;

  return {
    score,
    maximumScore,
    percentage,
    passed,
  };
}

export function validateAttemptCompletion(items: AttemptItemRecord[]): void {
  if (items.length === 0) {
    throw new DomainError("validation-failed", {
      message: "Attempt must have at least one question.",
    });
  }

  const unanswered = items.filter((item) => item.submittedAnswer === undefined);
  if (unanswered.length > 0) {
    throw new DomainError("validation-failed", {
      message: `Cannot complete attempt: ${unanswered.length} question(s) are unanswered.`,
    });
  }
}
