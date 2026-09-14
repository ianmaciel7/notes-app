import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DailyNoteIcon } from "./daily-note-icon";
import { FlashcardIcon } from "./flashcard-icon";
import { getObjectIcon, ObjectIcon, objectIconRegistry } from "./icon-registry";
import { PageIcon } from "./page-icon";
import { StudyGoalIcon } from "./study-goal-icon";
import { TableIcon } from "./table-icon";
import { TaskIcon } from "./task-icon";

describe("Object Icons", () => {
  it("renders all 32 object icons as pure SVG elements with exact attributes", () => {
    const iconNames = Object.keys(objectIconRegistry);
    expect(iconNames.length).toBeGreaterThanOrEqual(32);

    for (const [, Component] of Object.entries(objectIconRegistry)) {
      const html = renderToStaticMarkup(<Component className="custom-icon-class" />);

      // Must be pure root <svg> without any wrapping elements
      expect(html.startsWith("<svg")).toBe(true);
      expect(html.endsWith("</svg>")).toBe(true);

      // Required SVG attributes
      expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(html).toContain('width="1em"');
      expect(html).toContain('height="1em"');
      expect(html).toContain('viewBox="0 0 256 256"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('role="img"');
      expect(html).toContain('class="custom-icon-class"');

      // Inner path must contain fill="currentColor" and non-empty path data
      expect(html).toContain('<path fill="currentColor" d="');
    }
  });

  it("renders multi-path icons correctly (e.g. FlashcardIcon)", () => {
    const html = renderToStaticMarkup(<FlashcardIcon />);
    const pathMatches = html.match(/<path /g);
    expect(pathMatches).not.toBeNull();
    expect(pathMatches?.length).toBe(2);
  });

  it("forwards custom styles and arbitrary attributes", () => {
    const html = renderToStaticMarkup(
      <PageIcon style={{ color: "red" }} data-testid="page-svg" id="custom-id" />,
    );
    expect(html).toContain('style="color:red"');
    expect(html).toContain('data-testid="page-svg"');
    expect(html).toContain('id="custom-id"');
  });

  it("resolves object types and aliases through getObjectIcon", () => {
    expect(getObjectIcon("page")).toBe(PageIcon);
    expect(getObjectIcon("table")).toBe(TableIcon);
    expect(getObjectIcon("task")).toBe(TaskIcon);
    expect(getObjectIcon("daily-note")).toBe(DailyNoteIcon);
    expect(getObjectIcon("calendar")).toBe(DailyNoteIcon);
    expect(getObjectIcon("daily_note")).toBe(DailyNoteIcon);
    expect(getObjectIcon("study-goal")).toBe(StudyGoalIcon);
    expect(getObjectIcon("study_goal")).toBe(StudyGoalIcon);
  });

  it("falls back to PageIcon for unknown object types", () => {
    expect(getObjectIcon("unknown-type-xyz")).toBe(PageIcon);
  });

  it("renders dynamic ObjectIcon component correctly", () => {
    const html = renderToStaticMarkup(<ObjectIcon type="study_goal" className="size-4" />);
    expect(html).toContain('class="size-4"');
    expect(html).toContain('data-icon="study-goal"');
    expect(html).toContain('viewBox="0 0 256 256"');
  });
});
