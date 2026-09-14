import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SplitButton } from "./split-button";

describe("SplitButton", () => {
  it("labels an icon-only primary action", () => {
    const html = renderToStaticMarkup(
      <SplitButton ariaLabel="Create item" leadingIcon={<span>+</span>} />,
    );

    expect(html).toContain('aria-label="Create item"');
  });

  it("renders the generic shadcn split-button shell with a menu trigger", () => {
    const html = renderToStaticMarkup(
      <SplitButton
        ariaLabel="Create item"
        dropdownAriaLabel="Create options"
        label="Create"
        leadingIcon={<span data-testid="leading-icon">+</span>}
        size="xs"
        options={[
          {
            id: "template",
            label: "From template",
            leadingIcon: <span data-testid="option-icon">T</span>,
          },
        ]}
      />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Create item"');
    expect(html).toContain('aria-label="Create options"');
    expect(html).toContain("Create");
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain("h-6");
    expect(html).toContain("data-slot=\"button-group\"");
    expect(html).toContain("data-slot=\"button\"");
  });
});
