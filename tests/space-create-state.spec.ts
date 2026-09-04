import { expect, test } from "@playwright/test";

const popupSelector =
  '[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]';

test("creating a Space adds it and makes it active", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await expect(trigger).toContainText("Personal Space");
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
  await expect(reopenedPopup.locator("[data-space-sort-id]", { hasText: "Created Space" })).toBeVisible();
});
