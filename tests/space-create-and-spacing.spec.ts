import { expect, test } from "@playwright/test";

const popupSelector =
  '[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]';

test("Create space adds and selects the new Space", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const popup = page.locator(popupSelector).first();
  await expect(popup).toBeVisible();
  await popup.locator('[data-slot="combobox-separator"] + div > button:first-of-type').click();

  const dialog = page.locator('[data-slot="app-sidebar-space-create-dialog"]');
  await expect(dialog).toBeVisible();
  await dialog.locator("input").fill("Created Space");
  await dialog.locator('button[type="submit"]').click();

  await expect(dialog).toBeHidden();
  await expect(trigger).toContainText("Created Space");

  await trigger.click();
  const reopenedPopup = page.locator(popupSelector).first();
  await expect(
    reopenedPopup.locator("[data-space-sort-id]", { hasText: "Created Space" }),
  ).toBeVisible();
});

test("Space rows keep an 8px icon-to-text gap", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const row = page.locator(popupSelector).first().locator("[data-space-sort-id]").first();
  await expect(row).toBeVisible();

  const columnGap = await row.evaluate((element) => getComputedStyle(element).columnGap);
  expect(columnGap).toBe("8px");
});

test("Create space action keeps an 8px icon-to-text gap", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const createAction = page
    .locator(popupSelector)
    .first()
    .locator('[data-slot="combobox-separator"] + div > button:first-of-type');
  await expect(createAction).toBeVisible();

  const columnGap = await createAction.evaluate((element) => getComputedStyle(element).columnGap);
  expect(columnGap).toBe("8px");
});
