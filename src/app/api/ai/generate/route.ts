import { handleAiGenerateRequest } from "@/lib/ai/ai-gateway";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const result = await handleAiGenerateRequest(body as Record<string, unknown>, {
    env: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  });

  return Response.json(result.body, { status: result.status });
}
