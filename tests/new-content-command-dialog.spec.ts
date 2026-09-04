import { expect, test } from "@playwright/test";

test("new content trigger opens one centered command dialog instead of a sidebar popover", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  await page.locator("#workspace-new-trigger:visible").click();

  const dialogs = page.locator('[data-slot="dialog-content"]:visible');
  await expect(dialogs).toHaveCount(1);

  const dialog = dialogs.first();
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

test("new content trigger also opens the same command dialog from the mobile sidebar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator("#workspace-new-trigger:visible");
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  const dialogs = page.locator('[data-slot="dialog-content"]:visible');
  await expect(dialogs).toHaveCount(1);
  await expect(dialogs.first().locator('[data-slot="command"]')).toBeVisible();
  await expect(page.locator('[data-slot="popover-content"]:visible')).toHaveCount(0);
});
