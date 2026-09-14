import { describe, expect, it } from "vitest";
import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  capacitiesDocToSlate,
  createEmptyBlockDocument,
  ensureBlockIds,
  slateToCapacitiesDoc,
  validateBlockDocument,
} from "../document-schema";

describe("document-schema", () => {
  it("creates empty document with correct schema version and block ID", () => {
    const doc = createEmptyBlockDocument();
    expect(doc.schemaVersion).toBe(BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
    expect(doc.doc.type).toBe("doc");
    expect(doc.doc.content).toHaveLength(1);
    expect(doc.doc.content[0].attrs?.id).toMatch(/^block:[a-f0-9-]+$/i);
  });

  it("validates document structure correctly", () => {
    const valid = createEmptyBlockDocument();
    expect(validateBlockDocument(valid)).toBe(true);

    expect(validateBlockDocument(null)).toBe(false);
    expect(validateBlockDocument({})).toBe(false);
    expect(validateBlockDocument({ schemaVersion: 99, doc: {} })).toBe(false);
  });

  it("ensures missing block IDs are generated recursively", () => {
    const nodesWithoutIds = [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }];
    const processed = ensureBlockIds(nodesWithoutIds);
    expect(processed[0].attrs?.id).toBeDefined();
    expect(processed[0].attrs?.id).toMatch(/^block:/);
  });

  it("round-trips between Capacities AST and Slate AST without loss", () => {
    const doc = createEmptyBlockDocument();
    const slateValue = capacitiesDocToSlate(doc);
    expect(slateValue).toBeDefined();
    expect(Array.isArray(slateValue)).toBe(true);

    const recreated = slateToCapacitiesDoc(slateValue as unknown[]);
    expect(recreated.schemaVersion).toBe(BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
    expect(recreated.doc.content.length).toBe(doc.doc.content.length);
  });
});
