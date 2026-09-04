import { expect, test } from "@playwright/test";

test("Space switcher clear button keeps the Capacities 9px right inset", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const popup = page
    .locator('[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]')
    .first();
  await expect(popup).toBeVisible();

  const search = popup.locator('[data-slot="input-group"]').first();
  const input = search.locator('[data-slot="input-group-control"]');
  await input.fill("aaaaaaa");

  const clear = search.locator('[data-slot="combobox-clear"]');
  await expect(clear).toBeVisible();

  const searchBox = await search.boundingBox();
  const clearBox = await clear.boundingBox();
  expect(searchBox).not.toBeNull();
  expect(clearBox).not.toBeNull();

  const rightInset = searchBox!.x + searchBox!.width - (clearBox!.x + clearBox!.width);
  expect(rightInset).toBeGreaterThanOrEqual(8);
  expect(rightInset).toBeLessThanOrEqual(10);
});
