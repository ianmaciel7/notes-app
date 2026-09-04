import { expect, test } from "@playwright/test";

test("space switcher matches Capacities menu composition and empty state", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator('[data-slot="app-sidebar-space-switcher"] button').first();
  await trigger.click();

  const popup = page
    .locator('[data-slot="combobox-content"][aria-label="Change space"], [data-slot="combobox-content"][aria-label="Alterar espaço"]')
    .first();
  await expect(popup).toBeVisible();

  const search = popup.locator('[data-slot="input-group"]').first();
  await expect(search).toHaveCSS("height", "32px");
  await expect(popup).toHaveCSS("border-radius", "12px");

  const selectedSpace = popup.locator('[data-space-sort-id][aria-selected="true"]').first();
  await expect(selectedSpace).toBeVisible();
  await expect(selectedSpace.locator(':scope > [data-selected]')).toHaveCSS("display", "none");
  await expect(selectedSpace.locator('svg[data-icon-name="check"]')).toBeVisible();

  const footer = popup.locator('[data-slot="combobox-separator"] + div').first();
  await expect(footer.locator("button:visible")).toHaveCount(1);
  await expect(footer.locator("button:visible").first()).toHaveCSS("height", "32px");

  const input = popup.locator('[data-slot="input-group-control"]').first();
  await input.fill("__no_space_matches__");

  await expect(popup.locator('[data-slot="combobox-empty"]')).toBeVisible();
  await expect(popup.locator('[data-slot="combobox-separator"]')).toHaveCount(0);
});
