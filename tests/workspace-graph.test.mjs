import assert from "node:assert/strict";
import test from "node:test";

import { projectWorkspaceGraph } from "../src/lib/workspace-graph.ts";

test("projects the active object and its direct entity relations", () => {
  const result = projectWorkspaceGraph(
    [
      { id: "page-1", title: "Current page", propertyValues: { related: { type: "entity", entity: [{ id: "page-2" }] } } },
      { id: "page-2", title: "Related page", propertyValues: {} },
      { id: "page-3", title: "Unrelated page", propertyValues: {} },
    ],
    "page-1",
  );

  assert.deepEqual(result.nodes.map((node) => node.id), ["page-1", "page-2"]);
  assert.deepEqual(result.edges, [{ source: "page-1", target: "page-2" }]);
});
