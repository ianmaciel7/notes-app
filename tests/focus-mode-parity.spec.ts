import { expect, test } from "@playwright/test";

test("focus mode matches the Capacities collapsed chrome and compensated floating control", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const enter = page.getByRole("button", { name: "Enter Focus Mode" });
  await expect(enter).toBeVisible();
  await enter.click();

  const root = page.locator('[data-slot="focus-mode-root"]');
  const controls = page.locator('[data-slot="app-focus-mode-controls"]');
  await expect(root).toHaveAttribute("data-focus-mode", "true");
  await expect(controls).toBeVisible();
  await expect(page.locator('[data-slot="app-header"]')).toHaveCount(0);

  const sidebar = page.locator('[data-slot="app-shell-sidebar"]');
  const sidePanel = page.locator('[data-slot="app-shell-side-panel"]');

  await expect
    .poll(async () => (await sidebar.boundingBox())?.width ?? 0)
    .toBeLessThan(2);
  await expect
    .poll(async () => (await sidePanel.boundingBox())?.width ?? 0)
    .toBeLessThan(2);

  const secondary = page.locator('[data-slot="app-focus-mode-secondary"]');
  const compensation = page.locator('[data-slot="app-focus-mode-compensation"]');
  const secondaryWidth = await secondary.evaluate((element) => element.scrollWidth);
  const compensationWidth = await compensation.evaluate((element) =>
    element.getBoundingClientRect().width,
  );

  expect(compensationWidth).toBeGreaterThan(secondaryWidth);
  expect(compensationWidth - secondaryWidth).toBeLessThanOrEqual(2);

  await page.locator('[data-slot="app-focus-mode-surface"]').hover();
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Forward" })).toBeVisible();

  await page.getByRole("button", { name: "Leave Focus Mode" }).click();
  await expect(root).not.toHaveAttribute("data-focus-mode", "true");
  await expect(enter).toBeVisible();
  await expect.poll(async () => (await sidebar.boundingBox())?.width ?? 0).toBeGreaterThan(1);
});
