import { createDefaultDocumentExtractors } from "@/lib/documents/document-binary-extractors";
import { handleDocumentParseRequest } from "@/lib/documents/document-parse-route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const result = await handleDocumentParseRequest(body, {
    extractors: createDefaultDocumentExtractors(),
  });
  return Response.json(result.body, { status: result.status });
}
