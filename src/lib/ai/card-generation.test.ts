import { describe, expect, it } from "vitest";

import {
  chunkTextForCardGeneration,
  parseGeneratedCardsResponse,
} from "@/lib/ai/card-generation";

describe("AI card generation helpers", () => {
  it("chunks source text without exceeding the maximum size and keeps source offsets", () => {
    const chunks = chunkTextForCardGeneration(
      "Retrieval practice improves retention. Spaced repetition protects long-term memory.",
      { maxChars: 42, overlapChars: 10 },
    );

    expect(chunks).toEqual([
      {
        id: "chunk-0",
        text: "Retrieval practice improves retention.",
        startOffset: 0,
        endOffset: 38,
      },
      {
        id: "chunk-1",
        text: "retention. Spaced repetition protects",
        startOffset: 28,
        endOffset: 65,
      },
      {
        id: "chunk-2",
        text: "protects long-term memory.",
        startOffset: 57,
        endOffset: 83,
      },
    ]);
  });

  it("rejects chunking options that cannot produce forward progress", () => {
    expect(() =>
      chunkTextForCardGeneration("Small source", { maxChars: 20, overlapChars: 20 }),
    ).toThrow("overlapChars must be smaller than maxChars");
  });

  it("parses generated card JSON and keeps only validated card fields", () => {
    const parsed = parseGeneratedCardsResponse(
      JSON.stringify({
        cards: [
          {
            exactQuote: "retrieval practice improves retention",
            cardType: "basic",
            front: "What improves retention?",
            back: "Retrieval practice.",
            ignored: "provider noise",
          },
          {
            exactQuote: "Spaced repetition protects long-term memory",
            cardType: "cloze",
            front: "What protects long-term memory?",
            back: "Spaced repetition.",
            clozeContent: "{{c1::Spaced repetition}} protects long-term memory.",
          },
        ],
      }),
    );

    expect(parsed).toEqual({
      cards: [
        {
          exactQuote: "retrieval practice improves retention",
          cardType: "basic",
          front: "What improves retention?",
          back: "Retrieval practice.",
        },
        {
          exactQuote: "Spaced repetition protects long-term memory",
          cardType: "cloze",
          front: "What protects long-term memory?",
          back: "Spaced repetition.",
          clozeContent: "{{c1::Spaced repetition}} protects long-term memory.",
        },
      ],
    });
  });

  it("rejects generated cards with missing required fields or unsupported card types", () => {
    expect(() =>
      parseGeneratedCardsResponse({
        cards: [
          {
            exactQuote: "real quote",
            cardType: "reversed",
            front: "Question",
            back: "Answer",
          },
        ],
      }),
    ).toThrow("Unsupported generated card type");

    expect(() =>
      parseGeneratedCardsResponse({
        cards: [{ exactQuote: "real quote", cardType: "basic", back: "Answer" }],
      }),
    ).toThrow("Generated card front is required");
  });
});
