import JSZip from "jszip";

import type {
  BinaryDocumentExtraction,
  BinaryDocumentExtractors,
} from "@/lib/documents/document-parse-route";
import { decodeBasicHtmlEntities, stripHtmlMarkup } from "@/lib/documents/html-to-text";

function decodeUtf8(bytes: Uint8Array) {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function decodePdfLiteralString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function compactExtractedText(text: string) {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function extractReadableHtmlText(html: string) {
  return compactExtractedText(decodeBasicHtmlEntities(stripHtmlMarkup(html)));
}

export async function extractPdfTextFromBytes(
  bytes: Uint8Array,
): Promise<BinaryDocumentExtraction> {
  const source = decodeUtf8(bytes);
  const literals = Array.from(source.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)).map((match) =>
    decodePdfLiteralString(match[1] ?? ""),
  );
  const arrayLiterals = Array.from(source.matchAll(/\[((?:.|\n)*?)\]\s*TJ/g)).flatMap((match) =>
    Array.from((match[1] ?? "").matchAll(/\(((?:\\.|[^\\)])*)\)/g)).map((item) =>
      decodePdfLiteralString(item[1] ?? ""),
    ),
  );
  const text = compactExtractedText([...literals, ...arrayLiterals].join(" "));
  if (!text) throw new Error("PDF text extraction produced no readable text.");
  return { text };
}

export async function extractEpubTextFromBytes(
  bytes: Uint8Array,
): Promise<BinaryDocumentExtraction> {
  const zip = await JSZip.loadAsync(bytes);
  const htmlFiles = Object.values(zip.files)
    .filter(
      (file) =>
        !file.dir &&
        (file.name.endsWith(".html") ||
          file.name.endsWith(".htm") ||
          file.name.endsWith(".xhtml") ||
          file.name.endsWith(".xml")),
    )
    .sort((first, second) => first.name.localeCompare(second.name));

  const parts = await Promise.all(htmlFiles.map((file) => file.async("text")));
  const text = compactExtractedText(parts.map(extractReadableHtmlText).filter(Boolean).join("\n"));
  if (!text) throw new Error("EPUB text extraction produced no readable text.");
  return { text };
}

export function createDefaultDocumentExtractors(): BinaryDocumentExtractors {
  return {
    pdf: extractPdfTextFromBytes,
    epub: extractEpubTextFromBytes,
  };
}
