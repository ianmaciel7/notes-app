import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1207, height: 632 } });

test("desktop workspace starts with Capacities pane proportions", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const mainPanel = page.locator('[data-slot="app-shell-main"]');
  const sidePanel = page.locator('[data-slot="app-shell-side-panel"]');
  const mainSurface = mainPanel.locator('[data-slot="workspace-object-type-list-view"]');
  const header = mainSurface.locator(":scope > header");
  const headerRows = header.locator(":scope > div");
  const overviewMode = mainSurface.getByRole("button", { name: "Visão geral" });
  const allMode = mainSurface.getByRole("button", { name: "Tudo" });
  const newAction = mainSurface.locator('[data-slot="workspace-object-type-new-action"]');

  await expect(mainPanel).toBeVisible();
  await expect(sidePanel).toBeVisible();
  await expect(mainSurface).toBeVisible();
  await expect(mainSurface.getByRole("heading", { level: 1 })).toHaveText("Páginas");
  await expect(mainSurface).toHaveCSS("border-top-width", "0px");
  await expect(header).toHaveCSS("border-bottom-width", "0px");
  await expect(headerRows.nth(0)).toHaveCSS("height", "64px");
  await expect(headerRows.nth(1)).toHaveCSS("height", "39px");

  for (const mode of [overviewMode, allMode]) {
    await expect(mode).toHaveCSS("font-size", "12px");
    await expect(mode).toHaveCSS("border-top-width", "0px");
    await expect(mode).toHaveCSS("border-radius", "12px");
  }
  await expect
    .poll(async () => (await overviewMode.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(109);
  await expect
    .poll(async () => (await overviewMode.boundingBox())?.width ?? 0)
    .toBeLessThanOrEqual(111);
  await expect
    .poll(async () => (await allMode.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(74);
  await expect.poll(async () => (await allMode.boundingBox())?.width ?? 0).toBeLessThanOrEqual(76);
  await expect
    .poll(async () => (await newAction.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(102);
  await expect
    .poll(async () => (await newAction.boundingBox())?.width ?? 0)
    .toBeLessThanOrEqual(103);

  await expect
    .poll(async () => (await mainPanel.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(500);
  await expect
    .poll(async () => (await mainPanel.boundingBox())?.width ?? 0)
    .toBeLessThanOrEqual(510);
  await expect
    .poll(async () => (await sidePanel.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(405);
  await expect
    .poll(async () => (await sidePanel.boundingBox())?.width ?? 0)
    .toBeLessThanOrEqual(420);
  await expect
    .poll(async () => (await mainSurface.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(480);
  await expect
    .poll(async () => (await mainSurface.boundingBox())?.width ?? 0)
    .toBeLessThanOrEqual(490);
});
