import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DailyNoteSplitButton } from "./daily-note-split-button";
import { ObjectSplitButtonControl } from "./object-split-button";
import { PageSplitButton } from "./page-split-button";
import {
  getObjectSplitButton,
  ObjectSplitButtonDynamic,
  objectSplitButtonRegistry,
} from "./split-button-registry";
import { TaskSplitButton } from "./task-split-button";
import { WeblinkSplitButton } from "./weblink-split-button";

describe("Object Split Buttons", () => {
  it("renders all 32 object split buttons cleanly with proper group roles and tone classes", () => {
    const splitButtonNames = Object.keys(objectSplitButtonRegistry);
    expect(splitButtonNames.length).toBeGreaterThanOrEqual(32);

    for (const [, Component] of Object.entries(objectSplitButtonRegistry)) {
      const html = renderToStaticMarkup(<Component className="custom-split-button-class" />);

      expect(html).toContain('role="group"');
      expect(html).toContain('class="');
      expect(html).toContain("custom-split-button-class");
      expect(html).toContain("aria-label=");
    }
  });

  it("renders specific split buttons (e.g. WeblinkSplitButton, TaskSplitButton) with default properties", () => {
    const htmlWeblink = renderToStaticMarkup(<WeblinkSplitButton />);
    expect(htmlWeblink).toContain("Weblink");
    expect(htmlWeblink).toContain("bg-cyan-50");

    const htmlTask = renderToStaticMarkup(<TaskSplitButton />);
    expect(htmlTask).toContain("Tarefa");
    expect(htmlTask).toContain("bg-red-50");
  });

  it("exposes the toned object-type split button as ObjectSplitButton", () => {
    const html = renderToStaticMarkup(
      <ObjectSplitButtonControl
        type="page"
        label="Page"
        tone="blue"
        size="sm"
        onChevronClick={() => undefined}
      />,
    );

    expect(html).toContain("Page");
    expect(html).toContain("bg-blue-50");
    expect(html).toContain("h-6");
    expect(html).not.toContain("disabled=\"\"");
  });

  it("resolves object types and aliases through getObjectSplitButton", () => {
    expect(getObjectSplitButton("page")).toBe(PageSplitButton);
    expect(getObjectSplitButton("weblink")).toBe(WeblinkSplitButton);
    expect(getObjectSplitButton("task")).toBe(TaskSplitButton);
    expect(getObjectSplitButton("daily-note")).toBe(DailyNoteSplitButton);
    expect(getObjectSplitButton("calendar")).toBe(DailyNoteSplitButton);
  });

  it("falls back to PageSplitButton for unknown object types", () => {
    expect(getObjectSplitButton("unknown-type-xyz")).toBe(PageSplitButton);
  });

  it("renders dynamic ObjectSplitButtonDynamic component correctly", () => {
    const html = renderToStaticMarkup(<ObjectSplitButtonDynamic type="weblink" size="lg" />);
    expect(html).toContain("Weblink");
    expect(html).toContain("h-8");
  });
});
