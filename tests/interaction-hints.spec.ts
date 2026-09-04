import { expect, test } from "@playwright/test";
import { formatShortcutAriaChord } from "../src/lib/workspace-shortcuts";

test("shortcut chords expose standards-based ARIA modifier names", () => {
  expect(formatShortcutAriaChord("Mod+Shift+J", "windows")).toBe("Control+Shift+J");
  expect(formatShortcutAriaChord("Mod+Shift+J", "mac")).toBe("Meta+Shift+J");
});

test("icon-only header actions derive the visual hint from aria-label", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator('[data-slot="app-header-action"][aria-label][data-hint]:not([disabled])')
    .first();
  await expect(action).toBeVisible();

  const label = await action.getAttribute("aria-label");
  expect(label).toBeTruthy();
  expect(await action.evaluate((element) => element.closest('[data-slot="tooltip-trigger"]'))).toBeNull();

  await action.hover();
  const hint = page.locator('[data-slot="interaction-hint"]');
  await expect(hint).toBeVisible({ timeout: 1_000 });
  await expect(hint).toContainText(label!);
});

test("keyboard focus opens the standard hint and Escape dismisses it", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator('[data-slot="app-header-action"][aria-label][data-hint]:not([disabled])')
    .first();
  await action.focus();

  const hint = page.locator('[data-slot="interaction-hint"]');
  await expect(hint).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(hint).toBeHidden();
});

test("sidebar action hints use ARIA semantics instead of a local hover-card timer", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator('[data-slot="app-sidebar-primary-action"] button[data-hint][aria-label]')
    .first();
  await expect(action).toBeVisible();
  expect(await action.evaluate((element) => element.closest('[data-slot="hover-card-trigger"]'))).toBeNull();

  const label = await action.getAttribute("aria-label");
  const description = await action.getAttribute("aria-description");
  await action.hover();

  const hint = page.locator('[data-slot="interaction-hint"]');
  await expect(hint).toBeVisible({ timeout: 1_000 });
  await expect(hint).toContainText(label!);
  if (description) {
    await expect(hint).toContainText(description.split("\n")[0] ?? description);
  }
});
