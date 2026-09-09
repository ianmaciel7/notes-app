import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { PendingImplementation } from "@/components/pending-implementation";

it("renders the pending component name passed by props", () => {
  const markup = renderToStaticMarkup(
    <PendingImplementation
      area="Side panel"
      description="Replace the old inspector placeholder."
      name="Object inspector"
    />,
  );

  expect(markup).toContain("Object inspector");
  expect(markup).toContain("Implementation pending");
  expect(markup).toContain("Side panel");
  expect(markup).toContain("Replace the old inspector placeholder.");
  expect(markup).toContain('data-variant="default"');
  expect(markup).toContain("border border-border bg-muted/25");
});

it("can render a workspace pending surface with a shared pending card treatment", () => {
  const markup = renderToStaticMarkup(
    <PendingImplementation
      area="Main panel"
      description="This workspace route is pending."
      name="Pages"
      variant="workspace"
    />,
  );

  expect(markup).toContain('data-variant="workspace"');
  expect(markup).toContain("border-0 bg-transparent");
  expect(markup).toContain('data-slot="pending-implementation-card"');
  expect(markup).toContain("border border-dashed border-border bg-muted/20");
  expect(markup).not.toContain("border border-border bg-muted/25");
});
