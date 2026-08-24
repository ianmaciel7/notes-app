import assert from "node:assert/strict";
import test from "node:test";

import { reconcileRequiredStructures } from "../src/lib/workspace-structure-reconciliation.ts";

test("required structures come from the current registry while local structures are preserved", () => {
  const currentRegistry = [
    { id: "page", ownership: "built-in", revision: "current" },
    { id: "task", ownership: "built-in", revision: "current" },
    { id: "archive", ownership: "reserved", revision: "current" },
    { id: "person", ownership: "legacy", revision: "current" },
  ];
  const storedRegistry = [
    { id: "page", ownership: "built-in", revision: "stale" },
    { id: "book", ownership: "legacy", revision: "customized" },
  ];

  const result = reconcileRequiredStructures(currentRegistry, storedRegistry);

  assert.deepEqual(
    result.map((structure) => structure.id),
    ["page", "task", "archive", "book"],
  );
  assert.equal(result[0].revision, "current");
  assert.equal(result.at(-1).revision, "customized");
});
