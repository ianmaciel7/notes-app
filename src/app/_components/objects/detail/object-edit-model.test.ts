import { expect, it } from "vitest";
import { buildObjectEdit } from "@/app/_components/objects/detail/object-edit-model";
import { objectEntityFixture } from "@/app/_components/objects/object-view-fixtures";

it("edits content without discarding block identity, annotations or hidden properties", () => {
  const entity = objectEntityFixture({
    blocks: [
      {
        id: "one",
        type: "quote",
        content: "Old",
        metadata: { source: "file" },
        annotations: { italic: true },
      },
    ],
    properties: { nested: { keep: true } },
  });
  const form = new FormData();
  form.set("title", " Updated ");
  form.set("tags", "one, one, two");
  form.set("block:one", "New");
  form.set("new-content", "Added paragraph");
  const edit = buildObjectEdit(entity, form);
  expect(edit.title).toBe("Updated");
  expect(edit.tags).toEqual(["one", "two"]);
  expect(edit.blocks?.[0]).toEqual({ ...entity.blocks[0], content: "New" });
  expect(edit.blocks?.[1]).toMatchObject({ type: "paragraph", content: "Added paragraph" });
  expect(edit.properties).toEqual(entity.properties);
});

it("rejects blank titles and invalid goal values", () => {
  expect(() => buildObjectEdit(objectEntityFixture(), new FormData())).toThrow();
  const form = new FormData();
  form.set("title", "Goal");
  form.set("targetExamDate", "not-a-date");
  form.set("targetRetentionRate", "900");
  expect(() => buildObjectEdit(objectEntityFixture({ type: "study_goal" }), form)).toThrow();
});
