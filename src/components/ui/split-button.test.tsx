import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonGroup,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "./split-button";

describe("SplitButton", () => {
  it("preserves the ButtonGroup data slot for grouped button styling", () => {
    const html = renderToStaticMarkup(
      <SplitButton>
        <SplitButtonGroup aria-label="Save options">
          <SplitButtonAction>Save</SplitButtonAction>
          <SplitButtonSeparator orientation="vertical" />
          <SplitButtonTrigger aria-label="More save options" />
        </SplitButtonGroup>
      </SplitButton>,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('data-slot="button-group"');
    expect(html).toContain("border-border");
    expect(html).toContain("size-8");
    expect(html).not.toContain('data-slot="split-button-group"');
  });

  it("applies valid child rounding variants to strip inner right corners", () => {
    const html = renderToStaticMarkup(
      <SplitButton>
        <SplitButtonGroup aria-label="Export options">
          <SplitButtonAction>PDF</SplitButtonAction>
          <SplitButtonTrigger aria-label="Dropdown options" />
        </SplitButtonGroup>
      </SplitButton>,
    );

    expect(html).toContain("[&amp;&gt;[data-slot]]:rounded-r-none");
    expect(html).not.toContain("*:data-slot:rounded-r-none");
  });
});
