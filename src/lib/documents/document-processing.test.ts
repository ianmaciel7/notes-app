import { describe, expect, it } from "vitest";

import {
  hashDocumentText,
  inferDocumentFileType,
  prepareTextDocumentForIngestion,
} from "@/lib/documents/document-processing";

describe("Document processing", () => {
  it("hashes extracted text with deterministic SHA-256", async () => {
    await expect(hashDocumentText("hello")).resolves.toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });

  it("infers supported document file types from mime type and file name", () => {
    expect(inferDocumentFileType({ fileName: "paper.pdf", mimeType: "application/pdf" })).toBe(
      "pdf",
    );
    expect(
      inferDocumentFileType({
        fileName: "book.epub",
        mimeType: "application/epub+zip",
      }),
    ).toBe("epub");
    expect(inferDocumentFileType({ fileName: "notes.md", mimeType: "text/markdown" })).toBe(
      "markdown",
    );
    expect(inferDocumentFileType({ fileName: "article.html", mimeType: "text/html" })).toBe(
      "web_article",
    );
  });

  it("prepares extracted text metadata and grounded chunks for ingestion", async () => {
    const prepared = await prepareTextDocumentForIngestion({
      fileName: "memory.md",
      mimeType: "text/markdown",
      text: "Retrieval practice improves retention.\r\nSpaced repetition protects memory.",
      sourceUrl: "https://example.com/memory",
      referenceDate: new Date("2026-01-01T00:00:00.000Z"),
      chunkOptions: { maxChars: 48, overlapChars: 12 },
    });

    expect(prepared.file).toMatchObject({
      id: "file-5b930fbe102a3827",
      type: "file",
      title: "memory.md",
      fileType: "markdown",
      originalName: "memory.md",
      sourceUrl: "https://example.com/memory",
      sizeBytes: 73,
      fileHash: "5b930fbe102a38279457de79da6eb307c6eb797d94169ea8a4ec4f2f81961048",
      extractedText: "Retrieval practice improves retention.\nSpaced repetition protects memory.",
      parsingStatus: "completed",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(prepared.chunks).toEqual([
      {
        id: "chunk-0",
        text: "Retrieval practice improves retention.\nSpaced",
        startOffset: 0,
        endOffset: 45,
      },
      {
        id: "chunk-1",
        text: "repetition protects memory.",
        startOffset: 46,
        endOffset: 73,
      },
    ]);
  });

  it("rejects empty extracted text", async () => {
    await expect(
      prepareTextDocumentForIngestion({
        fileName: "empty.md",
        mimeType: "text/markdown",
        text: "   \n\t",
      }),
    ).rejects.toThrow("Extracted text is required");
  });
});
