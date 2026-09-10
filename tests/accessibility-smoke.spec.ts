import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("workspace shell has no detectable critical accessibility violations", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  const criticalViolations = results.violations.filter(
    (violation) => violation.impact === "critical",
  );

  expect(criticalViolations).toEqual([]);
});
