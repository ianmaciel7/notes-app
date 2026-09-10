import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { expect, it } from "vitest";
import { chunkTextForCardGeneration, type TextGenerationChunk } from "@/lib/ai/card-generation";

it("terminates when a short word makes the overlap longer than the first chunk", () => {
  const source = readFileSync(new URL("./card-generation.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  // Bound this synchronous regression so an infinite loop cannot hang the test runner.
  const chunks = runInNewContext(
    `${outputText}\nexports.chunkTextForCardGeneration(text, options);`,
    { exports: {}, text: "a bbbbbbbbbbbb", options: { maxChars: 5, overlapChars: 4 } },
    { timeout: 500 },
  ) as TextGenerationChunk[];
  expect(chunks.length).toBeGreaterThan(0);
  expect(chunks.at(-1)?.endOffset).toBe(14);
});

it.each([NaN, Infinity, -Infinity, 0, -1, 0.5])("rejects invalid maxChars %s", (maxChars) => {
  expect(() => chunkTextForCardGeneration("sample", { maxChars })).toThrow("maxChars");
});

it.each([NaN, Infinity, -1, 1.5])("rejects invalid overlapChars %s", (overlapChars) => {
  expect(() => chunkTextForCardGeneration("sample", { maxChars: 8, overlapChars })).toThrow(
    "overlapChars",
  );
});

it("keeps source offsets exact after trimming leading and trailing whitespace", () => {
  const text = "  alpha beta \n\t";
  const chunks = chunkTextForCardGeneration(text, { maxChars: 30 });
  expect(chunks).toHaveLength(1);
  for (const chunk of chunks) {
    expect(text.slice(chunk.startOffset, chunk.endOffset)).toBe(chunk.text);
  }
});
