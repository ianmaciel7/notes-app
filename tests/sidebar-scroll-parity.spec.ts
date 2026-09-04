import { expect, test } from "@playwright/test";

test("sidebar keeps pinned content inside the shared vertical scroll viewport", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const scrollArea = page.locator('[data-slot="app-sidebar-scroll-area"]');
  const viewport = scrollArea.locator('[data-slot="scroll-area-viewport"]');
  const pinnedRegion = page.locator('[data-slot="app-sidebar-pinned-region"]');

  await expect(scrollArea.locator('[data-slot="app-sidebar-pinned-region"]')).toHaveCount(1);
  await expect(viewport).toBeVisible();
  await expect(pinnedRegion).toBeVisible();

  await viewport.evaluate((element) => {
    element.scrollTop = 0;
  });

  await pinnedRegion.hover();
  await page.mouse.wheel(0, 420);

  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});

test("sidebar scrollbar widens on hover like Capacities", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const scrollArea = page.locator('[data-slot="app-sidebar-scroll-area"]');
  const scrollbar = scrollArea.locator(
    '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"]',
  );

  await expect(scrollbar).toBeVisible();
  await expect(scrollbar).toHaveCSS("width", "6px");

  await scrollbar.hover();
  await expect(scrollbar).toHaveCSS("width", "10px");
});
