import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/components/objects/object-detail";
import { ObjectList, ObjectListContent, ObjectListHeader } from "@/components/objects/object-list";

it("composes list content without a controller or provider", () => {
  const markup = renderToStaticMarkup(
    <ObjectList aria-label="Objects" className="test-extension">
      <ObjectListHeader><h1>Pages</h1></ObjectListHeader>
      <ObjectListContent><p>List content</p></ObjectListContent>
    </ObjectList>,
  );
  expect(markup).toContain('aria-label="Objects"');
  expect(markup).toContain("test-extension");
  expect(markup).toContain("List content");
  expect(markup).not.toContain("object-detail-aside");
});

it("keeps semantic article content and permits omitting the aside", () => {
  const markup = renderToStaticMarkup(
    <ObjectDetail aria-label="Page detail">
      <ObjectDetailHeader><h1>Research</h1></ObjectDetailHeader>
      <ObjectDetailContent><p>Saved notes</p></ObjectDetailContent>
    </ObjectDetail>,
  );
  expect(markup).toContain("<article");
  expect(markup).toContain('aria-label="Page detail"');
  expect(markup).toContain("Saved notes");
  expect(markup).not.toContain("<aside");
});
