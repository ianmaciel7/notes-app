import assert from "node:assert/strict";
import test from "node:test";
import { deletedTestFiles, parsePatch, qualityRegressions } from "./floor-guard-lib.mjs";

test("removed lines keep the old filename for deleted files", () => {
  const patch="--- a/src/a.test.ts\n+++ /dev/null\n@@ -1 +0,0 @@\n-expect(value).toBe(1);";
  const parsed=parsePatch(patch);
  assert.equal(parsed.removed[0].file,"src/a.test.ts");
});

test("deleted test files are detected", () => {
  assert.deepEqual(deletedTestFiles("D\tsrc/a.test.ts\nM\tsrc/a.ts\n"),["src/a.test.ts"]);
});

test("coverage floors cannot be lowered", () => {
  const before="thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }";
  const after="thresholds: { lines: 79, functions: 80, branches: 80, statements: 80 }";
  assert.deepEqual(qualityRegressions("vitest.config.ts",before,after),["coverage lines: 80 -> 79"]);
});

test("dependency rules cannot silently disappear", () => {
  assert.deepEqual(qualityRegressions(".dependency-cruiser.cjs",'name: "no-circular"',""),
    ["dependency rule removed: no-circular"]);
});
