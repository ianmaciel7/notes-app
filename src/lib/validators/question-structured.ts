import type {
  QuestionBody,
  QuestionDropField,
  QuestionItem,
} from "@/types/question";
import {
  hasDuplicates,
  isRecord,
  parseItems,
  type QuestionFieldErrors,
  type QuestionValidationErrorCode,
  readText,
} from "./question-fields";

type ItemsResult = {
  items: QuestionItem[];
  error?: QuestionValidationErrorCode;
};

function checkItems(value: unknown, minimum: number): ItemsResult {
  const items = parseItems(value);
  if (!items || items.length < minimum) {
    return { items: items ?? [], error: "invalidItems" };
  }
  if (hasDuplicates(items.map((item) => item.id))) {
    return { items, error: "duplicateId" };
  }
  return { items };
}

function parseSlots(value: unknown): QuestionDropField[] | null {
  if (!Array.isArray(value)) return null;
  const slots: QuestionDropField[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) return null;
    const id = readText(entry.id);
    const label = readText(entry.label);
    if (!id || !label) return null;
    slots.push({ id, label });
  }
  return slots;
}

/**
 * A key maps every `keys` id to one `values` id: no missing, extra, or unknown
 * entries. `injective` additionally forbids using one value twice.
 */
function readMapping(
  answer: unknown,
  keys: readonly string[],
  values: readonly string[],
  injective: boolean,
): Record<string, string> | null {
  if (!isRecord(answer)) return null;
  const entries = Object.entries(answer);
  if (entries.length !== keys.length) return null;

  const mapping: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!keys.includes(key)) return null;
    if (typeof value !== "string" || !values.includes(value)) return null;
    mapping[key] = value;
  }
  if (injective && hasDuplicates(Object.values(mapping))) return null;
  return mapping;
}

export function validateMatchingBody(
  raw: Record<string, unknown>,
  errors: QuestionFieldErrors,
): QuestionBody | undefined {
  const left = checkItems(raw.leftItems, 2);
  const right = checkItems(raw.rightItems, 2);
  if (left.error) errors.leftItems = left.error;
  if (right.error) errors.rightItems = right.error;

  const mapping = readMapping(
    raw.correctAnswer,
    left.items.map((item) => item.id),
    right.items.map((item) => item.id),
    false,
  );
  if (!mapping) errors.correctAnswer = "invalidCorrectAnswer";
  if (left.error || right.error || !mapping) return undefined;

  return {
    type: "matching",
    leftItems: left.items,
    rightItems: right.items,
    correctAnswer: mapping,
  };
}

export function validateDragAndDropBody(
  raw: Record<string, unknown>,
  errors: QuestionFieldErrors,
): QuestionBody | undefined {
  const items = checkItems(raw.items, 1);
  if (items.error) errors.items = items.error;

  const slots = parseSlots(raw.slots);
  if (!slots || slots.length === 0) {
    errors.slots = "invalidSlots";
  } else if (hasDuplicates(slots.map((slot) => slot.id))) {
    errors.slots = "duplicateId";
  }

  const mapping = slots
    ? readMapping(
        raw.correctAnswer,
        slots.map((slot) => slot.id),
        items.items.map((item) => item.id),
        true,
      )
    : null;
  if (!mapping) errors.correctAnswer = "invalidCorrectAnswer";
  if (items.error || errors.slots || !slots || !mapping) return undefined;

  return {
    type: "drag-and-drop",
    items: items.items,
    slots,
    correctAnswer: mapping,
  };
}
