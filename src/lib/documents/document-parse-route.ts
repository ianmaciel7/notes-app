import {
  inferDocumentFileType,
  prepareTextDocumentForIngestion,
  type PreparedTextDocument,
} from "@/lib/documents/document-processing";

export type DocumentParseResult = {
  status: number;
  body: PreparedTextDocument | { error: string };
};

export type BinaryDocumentExtraction = {
  text: string;
  pageCount?: number;
};

export type BinaryDocumentExtractors = {
  pdf?: (bytes: Uint8Array) => Promise<BinaryDocumentExtraction>;
  epub?: (bytes: Uint8Array) => Promise<BinaryDocumentExtraction>;
};

export type DocumentParseDependencies = {
  extractors?: BinaryDocumentExtractors;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function decodeBasicHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function extractReadableHtmlText(html: string) {
  return decodeBasicHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<\/(h[1-6]|p|li|blockquote|section|article|div)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{2,}/g, "\n"),
  ).trim();
}

function getTextPayload(payload: Record<string, unknown>) {
  if (typeof payload.text === "string") return payload.text;
  if (typeof payload.html === "string") return extractReadableHtmlText(payload.html);
  return null;
}

function decodeBase64Payload(value: string) {
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(value, "base64"));
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function extractBinaryPayload(
  payload: Record<string, unknown>,
  dependencies: DocumentParseDependencies,
) {
  if (typeof payload.fileBase64 !== "string") return null;

  const fileType = prepareFileType(payload);
  const bytes = decodeBase64Payload(payload.fileBase64);
  if (fileType === "pdf") {
    const extractPdf = dependencies.extractors?.pdf;
    if (!extractPdf) throw new Error("PDF parser adapter is not configured.");
    return extractPdf(bytes);
  }
  if (fileType === "epub") {
    const extractEpub = dependencies.extractors?.epub;
    if (!extractEpub) throw new Error("EPUB parser adapter is not configured.");
    return extractEpub(bytes);
  }
  return null;
}

function prepareFileType(payload: Record<string, unknown>) {
  return inferDocumentFileType({
    fileName: typeof payload.fileName === "string" ? payload.fileName : "",
    mimeType: typeof payload.mimeType === "string" ? payload.mimeType : undefined,
  });
}

function getChunkOptions(payload: Record<string, unknown>) {
  const options = asRecord(payload.chunkOptions);
  const maxChars = options.maxChars;
  const overlapChars = options.overlapChars;
  if (maxChars === undefined) return undefined;
  return {
    maxChars: Number(maxChars),
    overlapChars: overlapChars === undefined ? undefined : Number(overlapChars),
  };
}

export async function handleDocumentParseRequest(
  body: unknown,
  dependencies: DocumentParseDependencies = {},
): Promise<DocumentParseResult> {
  const payload = asRecord(body);
  const fileName = typeof payload.fileName === "string" ? payload.fileName : "";
  const mimeType = typeof payload.mimeType === "string" ? payload.mimeType : undefined;
  const sourceUrl = typeof payload.sourceUrl === "string" ? payload.sourceUrl : undefined;
  const localBlobKey = typeof payload.localBlobKey === "string" ? payload.localBlobKey : undefined;
  let pageCount = typeof payload.pageCount === "number" ? payload.pageCount : undefined;
  let text = getTextPayload(payload);

  const referenceDate =
    typeof payload.referenceDate === "string" ? new Date(payload.referenceDate) : undefined;

  try {
    if (text === null) {
      const extracted = await extractBinaryPayload(payload, dependencies);
      text = extracted?.text ?? null;
      pageCount = extracted?.pageCount ?? pageCount;
    }

    if (text === null) {
      return {
        status: 415,
        body: {
          error:
            "Document parse requires extracted text, HTML, or a supported binary document payload.",
        },
      };
    }

    return {
      status: 200,
      body: await prepareTextDocumentForIngestion({
        fileName,
        mimeType,
        text,
        sourceUrl,
        localBlobKey,
        pageCount,
        referenceDate,
        chunkOptions: getChunkOptions(payload),
      }),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "PDF parser adapter is not configured." ||
        error.message === "EPUB parser adapter is not configured.")
    ) {
      return {
        status: 415,
        body: { error: error.message },
      };
    }

    return {
      status: 400,
      body: { error: error instanceof Error ? error.message : "Document parse failed." },
    };
  }
}
