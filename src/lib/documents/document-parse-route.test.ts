import { describe, expect, it } from "vitest";

import { handleDocumentParseRequest } from "@/lib/documents/document-parse-route";

describe("Document parse route handler", () => {
  it("prepares markdown text payloads for local-first document ingestion", async () => {
    const result = await handleDocumentParseRequest({
      fileName: "memory.md",
      mimeType: "text/markdown",
      text: "Retrieval practice improves retention.",
      sourceUrl: "https://example.com/memory",
      chunkOptions: { maxChars: 80, overlapChars: 10 },
      referenceDate: "2026-01-01T00:00:00.000Z",
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      file: {
        type: "file",
        title: "memory.md",
        fileType: "markdown",
        originalName: "memory.md",
        sourceUrl: "https://example.com/memory",
        extractedText: "Retrieval practice improves retention.",
        parsingStatus: "completed",
      },
      chunks: [
        {
          id: "chunk-0",
          text: "Retrieval practice improves retention.",
          startOffset: 0,
          endOffset: 38,
        },
      ],
    });
  });

  it("extracts readable text from HTML payloads before chunking", async () => {
    const result = await handleDocumentParseRequest({
      fileName: "article.html",
      mimeType: "text/html",
      html: "<h1>Memory</h1><p>Retrieval&nbsp;practice improves retention.</p>",
      referenceDate: "2026-01-01T00:00:00.000Z",
      chunkOptions: { maxChars: 80, overlapChars: 10 },
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      file: {
        fileType: "web_article",
        extractedText: "Memory\nRetrieval practice improves retention.",
      },
      chunks: [
        {
          text: "Memory\nRetrieval practice improves retention.",
          startOffset: 0,
          endOffset: 45,
        },
      ],
    });
  });

  it("extracts text from base64 PDF payloads through a binary parser adapter", async () => {
    const result = await handleDocumentParseRequest(
      {
        fileName: "paper.pdf",
        mimeType: "application/pdf",
        fileBase64: btoa("fake-pdf-binary"),
        referenceDate: "2026-01-01T00:00:00.000Z",
        chunkOptions: { maxChars: 80, overlapChars: 10 },
      },
      {
        extractors: {
          async pdf(bytes) {
            expect(new TextDecoder().decode(bytes)).toBe("fake-pdf-binary");
            return { text: "PDF retrieval practice text.", pageCount: 3 };
          },
        },
      },
    );

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      file: {
        fileType: "pdf",
        originalName: "paper.pdf",
        extractedText: "PDF retrieval practice text.",
        pageCount: 3,
        parsingStatus: "completed",
      },
      chunks: [
        {
          text: "PDF retrieval practice text.",
          startOffset: 0,
          endOffset: 28,
        },
      ],
    });
  });

  it("extracts text from base64 EPUB payloads through a binary parser adapter", async () => {
    const result = await handleDocumentParseRequest(
      {
        fileName: "book.epub",
        mimeType: "application/epub+zip",
        fileBase64: btoa("fake-epub-binary"),
        referenceDate: "2026-01-01T00:00:00.000Z",
        chunkOptions: { maxChars: 80, overlapChars: 10 },
      },
      {
        extractors: {
          async epub(bytes) {
            expect(new TextDecoder().decode(bytes)).toBe("fake-epub-binary");
            return { text: "EPUB spaced repetition chapter." };
          },
        },
      },
    );

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      file: {
        fileType: "epub",
        originalName: "book.epub",
        extractedText: "EPUB spaced repetition chapter.",
        parsingStatus: "completed",
      },
    });
  });

  it("rejects binary payloads when the required parser adapter is not configured", async () => {
    await expect(
      handleDocumentParseRequest({
        fileName: "paper.pdf",
        mimeType: "application/pdf",
        fileBase64: btoa("fake-pdf-binary"),
      }),
    ).resolves.toEqual({
      status: 415,
      body: {
        error: "PDF parser adapter is not configured.",
      },
    });
  });

  it("rejects invalid chunk options", async () => {
    await expect(
      handleDocumentParseRequest({
        fileName: "memory.md",
        mimeType: "text/markdown",
        text: "Retrieval practice improves retention.",
        chunkOptions: { maxChars: 20, overlapChars: 20 },
      }),
    ).resolves.toEqual({
      status: 400,
      body: { error: "overlapChars must be smaller than maxChars." },
    });
  });
});
