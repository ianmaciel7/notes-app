import JSZip from "jszip";
import { describe, expect, it } from "vitest";

import {
  createDefaultDocumentExtractors,
  extractPdfTextFromBytes,
} from "@/lib/documents/document-binary-extractors";

describe("Document binary extractors", () => {
  it("extracts text from simple uncompressed PDF text operators", async () => {
    const pdf = new TextEncoder().encode(
      "%PDF-1.4\n1 0 obj\n<<>>\nstream\nBT\n( Retrieval practice ) Tj\n( improves retention. ) Tj\nET\nendstream\nendobj",
    );

    await expect(extractPdfTextFromBytes(pdf)).resolves.toEqual({
      text: "Retrieval practice improves retention.",
    });
  });

  it("extracts readable text from XHTML documents inside EPUB archives", async () => {
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");
    zip.file(
      "OPS/chapter-1.xhtml",
      "<html><body><h1>Memory</h1><p>Spaced&nbsp;repetition protects recall.</p></body></html>",
    );
    const bytes = new Uint8Array(await zip.generateAsync({ type: "uint8array" }));

    await expect(createDefaultDocumentExtractors().epub?.(bytes)).resolves.toEqual({
      text: "Memory\nSpaced repetition protects recall.",
    });
  });
});
