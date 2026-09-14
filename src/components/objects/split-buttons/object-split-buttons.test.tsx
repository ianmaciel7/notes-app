import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DailyNoteSplitButton } from "./daily-note-split-button";
import {
  getObjectSplitButton,
  ObjectSplitButtonDynamic,
  objectSplitButtonRegistry,
} from "./object-split-button-registry";
import type { ObjectSplitButtonOption } from "./object-split-button";
import { PageSplitButton } from "./page-split-button";
import { TaskSplitButton } from "./task-split-button";
import { WeblinkSplitButton } from "./weblink-split-button";

describe("Object Split Buttons", () => {
  it("renders all 32 object split buttons cleanly with proper group roles and variant classes", () => {
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
    expect(htmlWeblink).toContain("--object-split-button-bg:var(--tone-cyan-bg)");

    const htmlTask = renderToStaticMarkup(<TaskSplitButton />);
    expect(htmlTask).toContain("Tarefa");
    expect(htmlTask).toContain("--object-split-button-bg:var(--tone-red-bg)");
  });

  it("keeps the disclosure trigger visually integrated with the object variant", () => {
    const html = renderToStaticMarkup(<PageSplitButton />);

    expect(html).toContain("hover:bg-[var(--object-split-button-hover-bg)]");
    expect(html).toContain("--object-split-button-border:var(--tone-blue-border)");
    expect(html).toContain("rounded-lg");
    expect(html).toContain("size-8");
    expect(html.match(/--object-split-button-bg:var\(--tone-blue-bg\)/g)).toHaveLength(2);
    expect(html.match(/--object-split-button-border:var\(--tone-blue-border\)/g)).toHaveLength(2);
    expect(html).not.toContain("ghost");
    expect(html).not.toContain("bg-primary text-primary-foreground");
  });

  it("exposes the variant-colored object-type split button as ObjectSplitButton", () => {
    const html = renderToStaticMarkup(
      <PageSplitButton
        type="page"
        label="Page"
        variant="blue"
        size="sm"
        onChevronClick={() => undefined}
      />,
    );

    expect(html).toContain("Page");
    expect(html).toContain("--object-split-button-bg:var(--tone-blue-bg)");
    expect(html).toContain("h-7");
    expect(html).not.toContain('disabled=""');
  });

  it("inherits menu item attributes through ObjectSplitButtonOption", () => {
    const option = {
      "data-testid": "task-option",
      id: "task",
      label: "Task",
      onClick: (event) => event.preventDefault(),
    } satisfies ObjectSplitButtonOption;

    expect(option["data-testid"]).toBe("task-option");
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
