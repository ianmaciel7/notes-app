import { expect, test } from "@playwright/test";

test("new content trigger opens a centered command dialog instead of a sidebar popover", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  await page.locator("#workspace-new-trigger").click();

  const dialog = page.locator('[data-slot="dialog-content"]:visible');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-slot="command"]')).toBeVisible();
  await expect(dialog.locator('[data-slot="command-input"]')).toBeVisible();
  await expect(page.locator('[data-slot="popover-content"]:visible')).toHaveCount(0);

  const dialogBox = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(dialogBox).not.toBeNull();
  expect(viewport).not.toBeNull();

  const dialogCenterX = dialogBox!.x + dialogBox!.width / 2;
  const viewportCenterX = viewport!.width / 2;
  expect(Math.abs(dialogCenterX - viewportCenterX)).toBeLessThanOrEqual(2);
});
