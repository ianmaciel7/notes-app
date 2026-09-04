import { expect, test } from "@playwright/test";

test("Space switcher search keeps the Capacities 6px outer inset on both sides", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const popup = page
    .locator('[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]')
    .first();
  await expect(popup).toBeVisible();

  const search = popup.locator('[data-slot="input-group"]').first();
  await expect(search).toBeVisible();
  await page.waitForTimeout(250);

  const popupBox = await popup.boundingBox();
  const searchBox = await search.boundingBox();
  expect(popupBox).not.toBeNull();
  expect(searchBox).not.toBeNull();

  const leftInset = searchBox!.x - popupBox!.x;
  const rightInset = popupBox!.x + popupBox!.width - (searchBox!.x + searchBox!.width);

  expect(leftInset).toBeGreaterThanOrEqual(5);
  expect(leftInset).toBeLessThanOrEqual(7);
  expect(rightInset).toBeGreaterThanOrEqual(5);
  expect(rightInset).toBeLessThanOrEqual(7);
  expect(Math.abs(leftInset - rightInset)).toBeLessThanOrEqual(1);
});
