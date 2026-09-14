import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SuggestionCombobox } from "./suggestion-combobox";

describe("SuggestionCombobox", () => {
  it("exposes listbox semantics and keyboard-action hooks", () => {
    const html = renderToStaticMarkup(
      <SuggestionCombobox isOpen query="heading" onSelect={() => undefined} onClose={() => undefined} />,
    );

    expect(html).toContain('data-slot="editor-suggestion-combobox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('role="option"');
    expect(html).toContain('aria-selected="true"');
  });
});
