import { expect, test } from "@playwright/test";

test("Space switcher renders no phantom trailing addon", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const popup = page
    .locator(
      '[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]',
    )
    .first();
  await expect(popup).toBeVisible();

  const search = popup.locator(':scope > [data-slot="input-group"]').first();
  const trailingAddons = search.locator(
    ':scope > [data-slot="input-group-addon"][data-align="inline-end"]',
  );

  await expect(trailingAddons).toHaveCount(0);

  const input = search.locator('[data-slot="input-group-control"]');
  await input.fill("aaaaaaa");

  await expect(trailingAddons).toHaveCount(1);
  await expect(trailingAddons.locator("button")).toHaveCount(1);
});
