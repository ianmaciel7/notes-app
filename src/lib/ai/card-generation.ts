export type GeneratedCardType = "basic" | "cloze";

export type GeneratedCard = {
  exactQuote: string;
  cardType: GeneratedCardType;
  front: string;
  back: string;
  clozeContent?: string;
};

export type GeneratedCardsResponse = {
  cards: GeneratedCard[];
};

export type TextGenerationChunk = {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
};

function validateChunkOptions(options: { maxChars: number; overlapChars?: number }) {
  const { maxChars, overlapChars = 0 } = options;
  if (!Number.isSafeInteger(maxChars) || maxChars <= 0) {
    throw new Error("maxChars must be a positive safe integer.");
  }
  if (!Number.isSafeInteger(overlapChars) || overlapChars < 0) {
    throw new Error("overlapChars must be a non-negative safe integer.");
  }
  if (overlapChars >= maxChars) {
    throw new Error("overlapChars must be smaller than maxChars.");
  }
  return { maxChars, overlapChars };
}

function nextChunkStart(sourceText: string, start: number, end: number, overlap: number) {
  // A short word before a long word must not rewind the cursor into the same chunk.
  let next = Math.max(start + 1, end - overlap);
  while (next > 0 && sourceText[next - 1] !== " " && sourceText[next] !== " " && next < end) {
    next += 1;
  }
  while (next < sourceText.length && sourceText[next] === " ") next += 1;
  return next;
}

export function chunkTextForCardGeneration(
  sourceText: string,
  options: { maxChars: number; overlapChars?: number },
): TextGenerationChunk[] {
  const { maxChars, overlapChars } = validateChunkOptions(options);
  const chunks: TextGenerationChunk[] = [];
  let startOffset = 0;

  while (startOffset < sourceText.length) {
    const hardEnd = Math.min(sourceText.length, startOffset + maxChars);
    const breakOffset = startOffset + sourceText.slice(startOffset, hardEnd + 1).lastIndexOf(" ");
    const endOffset =
      hardEnd < sourceText.length && breakOffset > startOffset ? breakOffset : hardEnd;
    const segment = sourceText.slice(startOffset, endOffset);
    const text = segment.trim();

    if (text) {
      const normalizedStartOffset = startOffset + segment.indexOf(text);
      chunks.push({
        id: `chunk-${chunks.length}`,
        text,
        startOffset: normalizedStartOffset,
        endOffset: normalizedStartOffset + text.length,
      });
    }

    if (endOffset >= sourceText.length) break;
    startOffset = nextChunkStart(sourceText, startOffset, endOffset, overlapChars);
  }

  return chunks;
}

function parseJsonPayload(payload: unknown): unknown {
  if (typeof payload !== "string") return payload;
  try {
    return JSON.parse(payload);
  } catch {
    throw new Error("Generated card response must be valid JSON.");
  }
}

function requireString(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(message);
  return value.trim();
}

function parseGeneratedCard(value: unknown): GeneratedCard {
  if (typeof value !== "object" || value === null) {
    throw new Error("Generated card must be an object.");
  }
  const record = value as Record<string, unknown>;
  const exactQuote = requireString(record.exactQuote, "Generated card exactQuote is required.");
  const cardType = requireString(record.cardType, "Generated card cardType is required.");
  if (cardType !== "basic" && cardType !== "cloze") {
    throw new Error("Unsupported generated card type.");
  }
  const front = requireString(record.front, "Generated card front is required.");
  const back = requireString(record.back, "Generated card back is required.");
  const parsed: GeneratedCard = { exactQuote, cardType, front, back };
  if (typeof record.clozeContent === "string" && record.clozeContent.trim().length > 0) {
    parsed.clozeContent = record.clozeContent.trim();
  }
  return parsed;
}

export function parseGeneratedCardsResponse(payload: unknown): GeneratedCardsResponse {
  const parsed = parseJsonPayload(payload);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Generated card response must be an object.");
  }
  const cards = (parsed as Record<string, unknown>).cards;
  if (!Array.isArray(cards)) throw new Error("Generated card response cards must be an array.");
  return { cards: cards.map(parseGeneratedCard) };
}
