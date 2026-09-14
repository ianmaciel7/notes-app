import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "./split-button";

describe("SplitButton", () => {
  it("composes named shadcn parts", () => {
    const html = renderToStaticMarkup(
      <SplitButton>
        <SplitButtonGroup aria-label="Create item">
          <SplitButtonAction aria-label="Create item">
            <span data-testid="leading-icon">+</span>
            <span>Create</span>
          </SplitButtonAction>
          <SplitButtonSeparator orientation="vertical" />
          <SplitButtonTrigger aria-label="Create options" size="icon-xs" />
          <SplitButtonContent>
            <SplitButtonItem>
              <span data-testid="option-icon">T</span>
              From template
            </SplitButtonItem>
          </SplitButtonContent>
        </SplitButtonGroup>
      </SplitButton>,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('data-slot="split-button-group"');
    expect(html).toContain('data-slot="split-button-action"');
    expect(html).toContain('data-slot="split-button-separator"');
    expect(html).toContain('data-slot="split-button-trigger"');
    expect(html).toContain('aria-label="Create item"');
    expect(html).toContain('aria-label="Create options"');
    expect(html).toContain("Create");
    expect(html).toContain('aria-haspopup="menu"');
  });
});
