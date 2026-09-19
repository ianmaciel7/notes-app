import type { ObjectRevision } from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";

export interface ExamQuestionReference {
  questionId: string;
  questionRevisionId: string;
  points: number;
}

export interface ExamRevisionPayload {
  schemaVersion: 1;
  instructions: string;
  passingPercentage: number;
  questions: ExamQuestionReference[];
}

export interface ExamPublicationSnapshot {
  questionCount: number;
  maximumScore: number;
  passingPercentage: number;
  questions: ExamQuestionReference[];
  instructions: string;
}

export function validateExamForPublication(
  payload: ExamRevisionPayload,
  spaceId: string,
  resolvedQuestions: Array<
    ObjectRevision<QuestionRevisionPayload> & { spaceId: string }
  >,
): ExamPublicationSnapshot {
  const errors: string[] = [];

  if (payload.questions.length === 0) {
    errors.push("Exam must have at least one question.");
  }

  if (payload.passingPercentage < 0 || payload.passingPercentage > 100) {
    errors.push("passingPercentage must be between 0 and 100.");
  }

  const seenIds = new Set<string>();
  for (const ref of payload.questions) {
    if (seenIds.has(ref.questionId)) {
      errors.push(`Duplicate questionId: ${ref.questionId}`);
    }
    seenIds.add(ref.questionId);

    if (ref.points <= 0) {
      errors.push(
        `Points for question ${ref.questionId} must be a positive number.`,
      );
    }
  }

  const revisionMap = new Map(resolvedQuestions.map((r) => [r.id, r]));

  for (const ref of payload.questions) {
    const revision = revisionMap.get(ref.questionRevisionId);
    if (!revision) continue;

    if (revision.spaceId !== spaceId) {
      errors.push(`Question ${ref.questionId} belongs to a different space.`);
    }

    if (revision.publicationState !== "published") {
      errors.push(
        `Question revision ${ref.questionRevisionId} is not published.`,
      );
    }
  }

  if (errors.length > 0) {
    throw new DomainError("validation-failed", {
      message: errors.join(" "),
    });
  }

  const maximumScore = payload.questions.reduce((sum, q) => sum + q.points, 0);

  return {
    questionCount: payload.questions.length,
    maximumScore,
    passingPercentage: payload.passingPercentage,
    questions: payload.questions,
    instructions: payload.instructions,
  };
}
