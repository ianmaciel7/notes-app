import { chunkTextForCardGeneration, type TextGenerationChunk } from "@/lib/ai/card-generation";
import type { FileEntity } from "@/types/schema";

export type SupportedDocumentFileType = FileEntity["fileType"];

export type PreparedTextDocument = {
  file: FileEntity;
  chunks: TextGenerationChunk[];
};

export async function hashDocumentText(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function inferDocumentFileType(input: {
  fileName: string;
  mimeType?: string;
}): SupportedDocumentFileType {
  const fileName = input.fileName.toLowerCase();
  const mimeType = input.mimeType?.toLowerCase() ?? "";
  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) return "pdf";
  if (mimeType === "application/epub+zip" || fileName.endsWith(".epub")) return "epub";
  if (
    mimeType === "text/html" ||
    mimeType === "application/xhtml+xml" ||
    fileName.endsWith(".html") ||
    fileName.endsWith(".htm")
  ) {
    return "web_article";
  }
  return "markdown";
}

function normalizeExtractedText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export async function prepareTextDocumentForIngestion(input: {
  fileName: string;
  mimeType?: string;
  text: string;
  sourceUrl?: string;
  localBlobKey?: string;
  pageCount?: number;
  referenceDate?: Date;
  chunkOptions?: { maxChars: number; overlapChars?: number };
}): Promise<PreparedTextDocument> {
  const extractedText = normalizeExtractedText(input.text);
  if (!extractedText) throw new Error("Extracted text is required.");

  const timestamp = (input.referenceDate ?? new Date()).toISOString();
  const fileHash = await hashDocumentText(extractedText);
  const file: FileEntity = {
    id: `file-${fileHash.slice(0, 16)}`,
    type: "file",
    title: input.fileName.trim() || "Untitled document",
    createdAt: timestamp,
    updatedAt: timestamp,
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    fileType: inferDocumentFileType(input),
    originalName: input.fileName,
    sourceUrl: input.sourceUrl,
    localBlobKey: input.localBlobKey,
    sizeBytes: new TextEncoder().encode(extractedText).byteLength,
    fileHash,
    extractedText,
    parsingStatus: "completed",
    pageCount: input.pageCount,
    _syncStatus: "pending",
  };

  return {
    file,
    chunks: chunkTextForCardGeneration(
      extractedText,
      input.chunkOptions ?? { maxChars: 4000, overlapChars: 400 },
    ),
  };
}
