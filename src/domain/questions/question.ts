import { z } from "zod";

import { DomainError } from "@/domain/shared/domain-error";

export type QuestionFormat = "single-choice" | "multiple-choice" | "true-false";

export interface AnswerOption {
  id: string;
  text: string;
}

export interface QuestionRevisionPayload {
  schemaVersion: 1;
  format: QuestionFormat;
  prompt: string;
  options: AnswerOption[];
  correctOptionIds: string[];
  explanation: string;
  source?: { title: string; url: string };
  authorNotes?: string;
}

export interface SubmittedAnswer {
  optionIds: string[];
}

export type PublicQuestionDto = Omit<
  QuestionRevisionPayload,
  "correctOptionIds" | "explanation" | "authorNotes"
> & { questionId: string; questionRevisionId: string };

export interface QuestionFeedbackDto {
  isCorrect: boolean;
  correctOptionIds: string[];
  explanation: string;
}

const optionIdSchema = z.string().trim().min(1);

const answerOptionSchema = z
  .object({
    id: optionIdSchema,
    text: z.string().trim().min(1).max(2_000),
  })
  .strict();

const questionRevisionSchema = z
  .object({
    schemaVersion: z.literal(1),
    format: z.enum(["single-choice", "multiple-choice", "true-false"]),
    prompt: z.string().trim().min(1).max(20_000),
    options: z.array(answerOptionSchema),
    correctOptionIds: z.array(optionIdSchema),
    explanation: z.string().trim().min(1).max(20_000),
    source: z
      .object({
        title: z.string().trim().min(1).max(2_000),
        url: z.string().trim().url(),
      })
      .strict()
      .optional(),
    authorNotes: z.string().trim().max(20_000).optional(),
  })
  .strict()
  .superRefine((question, context) => {
    const optionIds = question.options.map((option) => option.id);
    const uniqueOptionIds = new Set(optionIds);
    const uniqueCorrectOptionIds = new Set(question.correctOptionIds);

    if (uniqueOptionIds.size !== optionIds.length) {
      context.addIssue({
        code: "custom",
        message: "Question option IDs must be unique.",
        path: ["options"],
      });
    }

    if (uniqueCorrectOptionIds.size !== question.correctOptionIds.length) {
      context.addIssue({
        code: "custom",
        message: "Correct option IDs must be unique.",
        path: ["correctOptionIds"],
      });
    }

    if (
      question.correctOptionIds.some(
        (optionId) => !uniqueOptionIds.has(optionId),
      )
    ) {
      context.addIssue({
        code: "custom",
        message: "Correct option IDs must reference question options.",
        path: ["correctOptionIds"],
      });
    }

    if (question.format === "true-false") {
      const isCanonicalTrueFalse =
        optionIds.length === 2 &&
        optionIds[0] === "true" &&
        optionIds[1] === "false";

      if (!isCanonicalTrueFalse) {
        context.addIssue({
          code: "custom",
          message:
            "True-false questions require true and false options in that order.",
          path: ["options"],
        });
      }
    } else if (question.options.length < 2) {
      context.addIssue({
        code: "custom",
        message: "Choice questions require at least two options.",
        path: ["options"],
      });
    }

    const requiresOneCorrectOption =
      question.format === "single-choice" || question.format === "true-false";
    const hasValidCorrectOptionCount = requiresOneCorrectOption
      ? question.correctOptionIds.length === 1
      : question.correctOptionIds.length >= 1;

    if (!hasValidCorrectOptionCount) {
      context.addIssue({
        code: "custom",
        message: "Question format has an invalid number of correct options.",
        path: ["correctOptionIds"],
      });
    }
  });

const submittedAnswerSchema = z
  .object({
    optionIds: z.array(optionIdSchema).min(1),
  })
  .strict()
  .superRefine((answer, context) => {
    if (new Set(answer.optionIds).size !== answer.optionIds.length) {
      context.addIssue({
        code: "custom",
        message: "Submitted option IDs must be unique.",
        path: ["optionIds"],
      });
    }
  });

function toValidationError(error: z.ZodError): DomainError {
  const fieldErrors = z.flattenError(error).fieldErrors;

  return new DomainError("validation-failed", { fieldErrors });
}

export function parseQuestionRevision(input: unknown): QuestionRevisionPayload {
  const result = questionRevisionSchema.safeParse(input);

  if (!result.success) {
    throw toValidationError(result.error);
  }

  return result.data;
}

export function parseSubmittedAnswer(input: unknown): SubmittedAnswer {
  const result = submittedAnswerSchema.safeParse(input);

  if (!result.success) {
    throw toValidationError(result.error);
  }

  return result.data;
}
