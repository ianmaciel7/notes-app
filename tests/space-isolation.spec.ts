import { expect, test } from "@playwright/test";

const popupSelector =
  '[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]';

async function openSpaceSwitcher(page: import("@playwright/test").Page) {
  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();
  const popup = page.locator(popupSelector).first();
  await expect(popup).toBeVisible();
  return { trigger, popup };
}

test("new Spaces are blank and remain isolated after reload", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Pages", { exact: true }).first()).toBeVisible();

  const firstOpen = await openSpaceSwitcher(page);
  await firstOpen.popup.locator('[data-slot="combobox-separator"] + div > button:first-of-type').click();
  const dialog = page.locator('[data-slot="app-sidebar-space-create-dialog"]');
  await dialog.locator("input").fill("Blank Space");
  await dialog.locator('button[type="submit"]').click();

  await expect(firstOpen.trigger).toContainText("Blank Space");
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Tables", { exact: true })).toHaveCount(0);

  const blankOpen = await openSpaceSwitcher(page);
  await blankOpen.popup.locator("[data-space-sort-id]", { hasText: "Personal Space" }).click();
  await expect(blankOpen.trigger).toContainText("Personal Space");
  await expect(page.getByText("Pages", { exact: true }).first()).toBeVisible();

  const personalOpen = await openSpaceSwitcher(page);
  await personalOpen.popup.locator("[data-space-sort-id]", { hasText: "Blank Space" }).click();
  await expect(personalOpen.trigger).toContainText("Blank Space");

  await page.reload();
  await page.waitForLoadState("networkidle");
  const reloadedTrigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await expect(reloadedTrigger).toContainText("Blank Space");
  await expect(page.getByText("Pages", { exact: true })).toHaveCount(0);
});
