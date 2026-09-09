import { type GeneratedCardsResponse, parseGeneratedCardsResponse } from "@/lib/ai/card-generation";

export type AiProvider = "gemini" | "groq";

export type AiGenerateRequestBody = {
  provider?: unknown;
  text?: unknown;
};

export type AiGenerateResult = {
  status: number;
  body: GeneratedCardsResponse | { error: string };
};

type Fetcher = typeof fetch;

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

function buildCardGenerationPrompt(text: string) {
  return [
    "Extract high-quality study flashcards from the source text.",
    "Return only strict JSON matching this schema:",
    '{"cards":[{"exactQuote":"verbatim source quote","cardType":"basic|cloze","front":"question","back":"answer","clozeContent":"optional cloze"}]}',
    "Every exactQuote must be copied verbatim from the source text.",
    "",
    "SOURCE TEXT:",
    text,
  ].join("\n");
}

async function parseProviderResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`AI provider request failed with status ${response.status}.`);
  }
  return response.json() as Promise<unknown>;
}

function extractGeminiText(payload: unknown) {
  const candidate = (
    payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  ).candidates?.[0];
  const text = candidate?.content?.parts?.find((part) => typeof part.text === "string")?.text;
  if (!text) throw new Error("Gemini response did not include generated JSON text.");
  return text;
}

function extractGroqText(payload: unknown) {
  const choice = (payload as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0];
  if (!choice?.message?.content)
    throw new Error("Groq response did not include generated JSON text.");
  return choice.message.content;
}

export async function generateCardsWithAiProvider(input: {
  provider: AiProvider;
  text: string;
  apiKey: string;
  fetcher?: Fetcher;
  model?: string;
}): Promise<GeneratedCardsResponse> {
  const fetcher = input.fetcher ?? fetch;
  const prompt = buildCardGenerationPrompt(input.text);

  if (input.provider === "gemini") {
    const response = await fetcher(
      `https://generativelanguage.googleapis.com/v1beta/models/${
        input.model ?? DEFAULT_GEMINI_MODEL
      }:generateContent?key=${encodeURIComponent(input.apiKey)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );
    return parseGeneratedCardsResponse(extractGeminiText(await parseProviderResponse(response)));
  }

  const response = await fetcher("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${input.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: input.model ?? DEFAULT_GROQ_MODEL,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  return parseGeneratedCardsResponse(extractGroqText(await parseProviderResponse(response)));
}

function getProvider(value: unknown): AiProvider | null {
  return value === "gemini" || value === "groq" ? value : null;
}

export async function handleAiGenerateRequest(
  body: AiGenerateRequestBody,
  dependencies: {
    env: Partial<Record<"GEMINI_API_KEY" | "GROQ_API_KEY", string | undefined>>;
    fetcher?: Fetcher;
  },
): Promise<AiGenerateResult> {
  const provider = getProvider(body.provider ?? "gemini");
  if (!provider) return { status: 400, body: { error: "Unsupported AI provider." } };
  if (typeof body.text !== "string" || body.text.trim().length === 0) {
    return { status: 400, body: { error: "Text is required." } };
  }

  const apiKey =
    provider === "gemini" ? dependencies.env.GEMINI_API_KEY : dependencies.env.GROQ_API_KEY;
  if (!apiKey) {
    return { status: 503, body: { error: `${provider} API key is not configured.` } };
  }

  try {
    return {
      status: 200,
      body: await generateCardsWithAiProvider({
        provider,
        text: body.text.trim(),
        apiKey,
        fetcher: dependencies.fetcher,
      }),
    };
  } catch (error) {
    return {
      status: 502,
      body: {
        error: error instanceof Error ? error.message : "AI provider request failed.",
      },
    };
  }
}
