import { test } from "@playwright/test";

const OUT = "C:/Users/ianma/.gemini/antigravity-cli/brain/ad525cd5-b2d1-402e-aa98-aaed8e2a13b9";

test("icon comparison zoom", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.evaluate(() => {
    localStorage.setItem("notes-app-theme", "dark");
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Open studio modal
  const studioWrapper = page.locator('[data-slot="app-sidebar-object-type-studio"]');
  await studioWrapper.waitFor({ state: "visible", timeout: 5000 });
  await studioWrapper.click({ force: true });
  await page.waitForTimeout(800);

  // Screenshot clipped to just the preset tiles grid (top section)
  await page.screenshot({
    path: `${OUT}/screenshot_icons_preset_row.png`,
    clip: { x: 66, y: 245, width: 1150, height: 200 },
  });

  // Second row of preset tiles
  await page.screenshot({
    path: `${OUT}/screenshot_icons_preset_row2.png`,
    clip: { x: 66, y: 310, width: 1150, height: 200 },
  });

  // Full preset grid (rows 1-3 + create your own)
  await page.screenshot({
    path: `${OUT}/screenshot_icons_preset_grid.png`,
    clip: { x: 66, y: 245, width: 1150, height: 220 },
  });

  // Basic types grid
  await page.screenshot({
    path: `${OUT}/screenshot_icons_basic_grid.png`,
    clip: { x: 66, y: 500, width: 1150, height: 220 },
  });
});
