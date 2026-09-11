import { expect, it } from "vitest";
import { resolveWorkspaceTabTarget } from "@/lib/spaces/workspace-tab-target";

const entries = {
  entityIds: ["entity-one", "entity-one:exact"],
  objectTypeIds: ["page", "task"],
  collections: {
    "col-one": { id: "col-one", structureId: "page", spaceId: "personal", name: "Research" },
  },
};
it("resolves duplicate object and list tab instances", () => {
  expect(resolveWorkspaceTabTarget("entity-one:12345", entries)).toEqual({
    kind: "entity",
    id: "entity-one",
  });
  expect(resolveWorkspaceTabTarget("task:12345", entries)).toEqual({ kind: "type", id: "task" });
});
it("resolves collection tabs and their duplicate instances", () => {
  expect(resolveWorkspaceTabTarget("object-type-item:collection:col-one:12345", entries)).toEqual({
    kind: "collection",
    id: "col-one",
    objectTypeId: "page",
  });
});
it("prefers exact IDs and rejects missing or malformed targets", () => {
  expect(resolveWorkspaceTabTarget("entity-one:exact", entries)).toEqual({
    kind: "entity",
    id: "entity-one:exact",
  });
  expect(resolveWorkspaceTabTarget("entity-one:not-an-instance", entries)).toBeNull();
  expect(resolveWorkspaceTabTarget("missing:12345", entries)).toBeNull();
});
