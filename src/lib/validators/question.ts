import type {
  GroundedExplanation,
  QuestionOption,
  QuestionProperties,
} from "@/types/object";

export type QuestionValidationErrorCode =
  | "invalidInput"
  | "validationFailed"
  | "statementRequired"
  | "minOptionsRequired"
  | "invalidOption"
  | "correctOptionsRequired"
  | "singleChoiceMismatch"
  | "examIdRequired"
  | "invalidOrderIndex"
  | "invalidFormat"
  | "invalidExplanation"
  | "invalidProvenance";

export type QuestionValidationField =
  | "statement"
  | "options"
  | "correctOptionIds"
  | "examId"
  | "orderIndex"
  | "format"
  | "groundedExplanation";

export interface QuestionValidationResult {
  success: boolean;
  data?: QuestionProperties;
  error?: QuestionValidationErrorCode;
  fieldErrors?: Partial<
    Record<QuestionValidationField, QuestionValidationErrorCode>
  >;
}

const FORMATS = ["single_choice", "multiple_choice"] as const;
const PROVENANCES = [
  "official",
  "suggested",
  "community",
  "user",
  "ai",
] as const;

function parseOptions(value: unknown): QuestionOption[] | null {
  if (!Array.isArray(value)) return null;
  const options: QuestionOption[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { id, text } = item as Record<string, unknown>;
    if (typeof id !== "string" || !id.trim()) return null;
    if (typeof text !== "string" || !text.trim()) return null;
    options.push({ id: id.trim(), text: text.trim() });
  }
  return options;
}

function parseExplanation(value: unknown): {
  value?: GroundedExplanation;
  error?: QuestionValidationErrorCode;
} {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object") return { error: "invalidExplanation" };
  const raw = value as Record<string, unknown>;
  if (typeof raw.text !== "string" || !raw.text.trim()) {
    return { error: "invalidExplanation" };
  }
  if (
    !PROVENANCES.includes(raw.answerProvenance as (typeof PROVENANCES)[number])
  ) {
    return { error: "invalidProvenance" };
  }
  const referenceUrls = Array.isArray(raw.referenceUrls)
    ? raw.referenceUrls.filter((u): u is string => typeof u === "string")
    : [];
  return {
    value: {
      text: raw.text.trim(),
      referenceUrls,
      answerProvenance:
        raw.answerProvenance as GroundedExplanation["answerProvenance"],
    },
  };
}

function checkOptions(
  options: QuestionOption[] | null,
): QuestionValidationErrorCode | undefined {
  if (!options) return "invalidOption";
  if (options.length < 2) return "minOptionsRequired";
  return undefined;
}

function checkCorrectOptionIds(
  correctOptionIds: string[],
  options: QuestionOption[] | null,
  format: unknown,
): QuestionValidationErrorCode | undefined {
  const unknownId =
    options !== null &&
    correctOptionIds.some((id) => !options.some((o) => o.id === id));
  if (correctOptionIds.length === 0 || unknownId) {
    return "correctOptionsRequired";
  }
  if (format === "single_choice" && correctOptionIds.length !== 1) {
    return "singleChoiceMismatch";
  }
  return undefined;
}

export function validateQuestionProperties(
  input: unknown,
): QuestionValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, error: "invalidInput" };
  }

  const raw = input as Record<string, unknown>;
  const fieldErrors: NonNullable<QuestionValidationResult["fieldErrors"]> = {};
  const statement =
    typeof raw.statement === "string" ? raw.statement.trim() : "";
  const examId = typeof raw.examId === "string" ? raw.examId.trim() : "";

  if (!statement) fieldErrors.statement = "statementRequired";
  if (!examId) fieldErrors.examId = "examIdRequired";

  const options = parseOptions(raw.options);
  const optionsError = checkOptions(options);
  if (optionsError) fieldErrors.options = optionsError;

  const format = raw.format;
  if (!FORMATS.includes(format as (typeof FORMATS)[number])) {
    fieldErrors.format = "invalidFormat";
  }

  const correctOptionIds = Array.isArray(raw.correctOptionIds)
    ? raw.correctOptionIds.filter((id): id is string => typeof id === "string")
    : [];
  const correctError = checkCorrectOptionIds(correctOptionIds, options, format);
  if (correctError) fieldErrors.correctOptionIds = correctError;

  const orderIndex = raw.orderIndex;
  if (
    typeof orderIndex !== "number" ||
    !Number.isInteger(orderIndex) ||
    orderIndex < 0
  ) {
    fieldErrors.orderIndex = "invalidOrderIndex";
  }

  const explanation = parseExplanation(raw.groundedExplanation);
  if (explanation.error) fieldErrors.groundedExplanation = explanation.error;

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "validationFailed", fieldErrors };
  }

  return {
    success: true,
    data: {
      statement,
      options: options as QuestionOption[],
      correctOptionIds,
      ...(explanation.value ? { groundedExplanation: explanation.value } : {}),
      examId,
      orderIndex: orderIndex as number,
      format: format as QuestionProperties["format"],
    },
  };
}
