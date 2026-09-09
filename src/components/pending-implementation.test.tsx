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
});
