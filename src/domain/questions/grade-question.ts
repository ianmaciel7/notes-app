import {
  type PublicQuestionDto,
  parseQuestionRevision,
  parseSubmittedAnswer,
  type QuestionFeedbackDto,
  type QuestionRevisionPayload,
  type SubmittedAnswer,
} from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";

type QuestionWithIdentity = QuestionRevisionPayload &
  Pick<PublicQuestionDto, "questionId" | "questionRevisionId">;

function sortedOptionIds(optionIds: string[]): string[] {
  return [...optionIds].sort();
}

function validateAnswerForFormat(
  question: QuestionRevisionPayload,
  answer: SubmittedAnswer,
): void {
  const availableOptionIds = new Set(
    question.options.map((option) => option.id),
  );

  if (answer.optionIds.some((optionId) => !availableOptionIds.has(optionId))) {
    throw new DomainError("validation-failed", {
      fieldErrors: {
        optionIds: ["Submitted option IDs must reference question options."],
      },
    });
  }

  if (
    (question.format === "single-choice" || question.format === "true-false") &&
    answer.optionIds.length !== 1
  ) {
    throw new DomainError("validation-failed", {
      fieldErrors: {
        optionIds: ["This question requires exactly one selected option."],
      },
    });
  }
}

export function toPublicQuestion(
  question: QuestionWithIdentity,
): PublicQuestionDto {
  const {
    correctOptionIds: _correctOptionIds,
    explanation: _explanation,
    authorNotes: _authorNotes,
    ...publicQuestion
  } = question;

  return publicQuestion;
}

export function gradeQuestion(
  question: QuestionRevisionPayload,
  submittedAnswer: unknown,
): QuestionFeedbackDto {
  const parsedQuestion = parseQuestionRevision(question);
  const parsedAnswer = parseSubmittedAnswer(submittedAnswer);

  validateAnswerForFormat(parsedQuestion, parsedAnswer);

  const submittedOptionIds = sortedOptionIds(parsedAnswer.optionIds);
  const correctOptionIds = sortedOptionIds(parsedQuestion.correctOptionIds);
  const isCorrect =
    submittedOptionIds.length === correctOptionIds.length &&
    submittedOptionIds.every(
      (optionId, index) => optionId === correctOptionIds[index],
    );

  return {
    isCorrect,
    correctOptionIds,
    explanation: parsedQuestion.explanation,
  };
}
