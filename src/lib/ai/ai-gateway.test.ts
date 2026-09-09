import { describe, expect, it } from "vitest";

import { generateCardsWithAiProvider, handleAiGenerateRequest } from "@/lib/ai/ai-gateway";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { "content-type": "application/json" },
  });
}

describe("AI gateway", () => {
  it("calls Gemini through the server gateway and parses structured cards", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];

    const result = await generateCardsWithAiProvider({
      provider: "gemini",
      text: "Retrieval practice improves retention.",
      apiKey: "gemini-key",
      fetcher: async (url, init) => {
        calls.push({
          url: String(url),
          body: JSON.parse(String(init?.body)),
        });
        return jsonResponse({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      cards: [
                        {
                          exactQuote: "Retrieval practice improves retention.",
                          cardType: "basic",
                          front: "What improves retention?",
                          back: "Retrieval practice.",
                        },
                      ],
                    }),
                  },
                ],
              },
            },
          ],
        });
      },
    });

    expect(calls[0]?.url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=gemini-key",
    );
    expect(calls[0]?.body).toMatchObject({
      generationConfig: { responseMimeType: "application/json" },
    });
    expect(result.cards).toEqual([
      {
        exactQuote: "Retrieval practice improves retention.",
        cardType: "basic",
        front: "What improves retention?",
        back: "Retrieval practice.",
      },
    ]);
  });

  it("calls Groq through the server gateway and parses structured cards", async () => {
    const calls: Array<{ url: string; authorization?: string }> = [];

    const result = await generateCardsWithAiProvider({
      provider: "groq",
      text: "Spaced repetition protects memory.",
      apiKey: "groq-key",
      fetcher: async (url, init) => {
        calls.push({
          url: String(url),
          authorization: new Headers(init?.headers).get("authorization") ?? undefined,
        });
        return jsonResponse({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  cards: [
                    {
                      exactQuote: "Spaced repetition protects memory.",
                      cardType: "cloze",
                      front: "What protects memory?",
                      back: "Spaced repetition.",
                      clozeContent: "{{c1::Spaced repetition}} protects memory.",
                    },
                  ],
                }),
              },
            },
          ],
        });
      },
    });

    expect(calls).toEqual([
      {
        url: "https://api.groq.com/openai/v1/chat/completions",
        authorization: "Bearer groq-key",
      },
    ]);
    expect(result.cards[0]).toMatchObject({
      cardType: "cloze",
      exactQuote: "Spaced repetition protects memory.",
    });
  });

  it("rejects provider failures without leaking API keys", async () => {
    await expect(
      generateCardsWithAiProvider({
        provider: "gemini",
        text: "Source",
        apiKey: "secret-key",
        fetcher: async () => new Response("secret-key upstream failed", { status: 503 }),
      }),
    ).rejects.toThrow("AI provider request failed with status 503");
  });

  it("handles route payload validation and environment key selection", async () => {
    const result = await handleAiGenerateRequest(
      { provider: "gemini", text: "Retrieval practice improves retention." },
      {
        env: { GEMINI_API_KEY: "gemini-key" },
        fetcher: async () =>
          jsonResponse({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        cards: [
                          {
                            exactQuote: "Retrieval practice improves retention.",
                            cardType: "basic",
                            front: "What improves retention?",
                            back: "Retrieval practice.",
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
      },
    );

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      cards: [{ exactQuote: "Retrieval practice improves retention." }],
    });

    await expect(
      handleAiGenerateRequest({ provider: "gemini", text: "" }, { env: {}, fetcher: fetch }),
    ).resolves.toEqual({
      status: 400,
      body: { error: "Text is required." },
    });
  });
});
