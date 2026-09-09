import JSZip from "jszip";
import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/documents/parse/route";

describe("/api/documents/parse route", () => {
  it("parses base64 EPUB payloads through the default binary extractor", async () => {
    const zip = new JSZip();
    zip.file("OPS/chapter.xhtml", "<html><body><p>Retrieval practice works.</p></body></html>");
    const bytes = await zip.generateAsync({ type: "uint8array" });
    const fileBase64 = Buffer.from(bytes).toString("base64");

    const response = await POST(
      new Request("http://localhost/api/documents/parse", {
        method: "POST",
        body: JSON.stringify({
          fileName: "memory.epub",
          mimeType: "application/epub+zip",
          fileBase64,
          referenceDate: "2026-01-01T00:00:00.000Z",
          chunkOptions: { maxChars: 80, overlapChars: 10 },
        }),
      }),
    );

    await expect(response.json()).resolves.toMatchObject({
      file: {
        fileType: "epub",
        originalName: "memory.epub",
        extractedText: "Retrieval practice works.",
      },
      chunks: [{ text: "Retrieval practice works." }],
    });
    expect(response.status).toBe(200);
  });
});
