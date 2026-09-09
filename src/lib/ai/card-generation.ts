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

export function chunkTextForCardGeneration(
  sourceText: string,
  options: { maxChars: number; overlapChars?: number },
): TextGenerationChunk[] {
  const maxChars = Math.floor(options.maxChars);
  const overlapChars = Math.floor(options.overlapChars ?? 0);
  if (maxChars <= 0) throw new Error("maxChars must be greater than zero.");
  if (overlapChars < 0) throw new Error("overlapChars cannot be negative.");
  if (overlapChars >= maxChars) throw new Error("overlapChars must be smaller than maxChars.");

  const chunks: TextGenerationChunk[] = [];
  let startOffset = 0;
  while (startOffset < sourceText.length) {
    const hardEnd = Math.min(sourceText.length, startOffset + maxChars);
    let endOffset = hardEnd;
    if (hardEnd < sourceText.length) {
      const breakOffset = sourceText.lastIndexOf(" ", hardEnd);
      if (breakOffset > startOffset) endOffset = breakOffset;
    }

    const text = sourceText.slice(startOffset, endOffset).trim();
    if (text) {
      const leadingWhitespace = sourceText.slice(startOffset, endOffset).search(/\S/);
      const normalizedStartOffset =
        leadingWhitespace === -1 ? startOffset : startOffset + leadingWhitespace;
      chunks.push({
        id: `chunk-${chunks.length}`,
        text,
        startOffset: normalizedStartOffset,
        endOffset,
      });
    }

    if (endOffset >= sourceText.length) break;
    startOffset = Math.max(0, endOffset - overlapChars);
    while (
      startOffset > 0 &&
      sourceText[startOffset - 1] !== " " &&
      sourceText[startOffset] !== " " &&
      startOffset < endOffset
    ) {
      startOffset += 1;
    }
    while (sourceText[startOffset] === " " && startOffset < sourceText.length) startOffset += 1;
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
