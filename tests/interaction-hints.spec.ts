import { expect, test } from "@playwright/test";
import { resolveInteractionTooltip } from "../src/components/ui/interaction-hint";
import { formatShortcutAriaChord } from "../src/lib/space-shortcuts";

test("shortcut chords expose standards-based ARIA modifier names", () => {
  expect(formatShortcutAriaChord("Mod+Shift+J", "windows")).toBe("Control+Shift+J");
  expect(formatShortcutAriaChord("Mod+Shift+J", "mac")).toBe("Meta+Shift+J");
});

test("visual tooltips require an explicit tooltip value instead of ARIA metadata", () => {
  expect(resolveInteractionTooltip(undefined)).toBeUndefined();
  expect(resolveInteractionTooltip("Back")).toEqual({
    text: "Back",
    description: undefined,
    shortcuts: [],
    side: "top",
    delay: undefined,
    closeDelay: undefined,
    showOnMobile: false,
  });
  expect(
    resolveInteractionTooltip({
      text: "Explore",
      description: "Open Explore in the side panel",
      shortcuts: ["Control+Shift+J"],
      side: "right",
    }),
  ).toEqual({
    text: "Explore",
    description: "Open Explore in the side panel",
    shortcuts: ["Control+Shift+J"],
    side: "right",
    delay: undefined,
    closeDelay: undefined,
    showOnMobile: false,
  });
});

test("explicit header tooltips open on hover and keep ARIA independent", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator(
      '[data-slot="app-header-action"][data-interaction-tooltip-trigger][aria-label]:not([disabled])',
    )
    .first();
  await expect(action).toBeVisible();

  const label = await action.getAttribute("aria-label");
  expect(label).toBeTruthy();

  await action.hover();
  const hint = page.locator('[data-slot="interaction-hint"]');
  await expect(hint).toBeVisible({ timeout: 1_000 });
  await expect(hint).toContainText(label!);
  await expect(hint).toHaveClass(/max-w-40/);
  await expect(hint.locator('[data-slot="tooltip-arrow"]')).toHaveCount(0);
});

test("keyboard focus opens an explicit tooltip and Escape dismisses it", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator(
      '[data-slot="app-header-action"][data-interaction-tooltip-trigger][aria-label]:not([disabled])',
    )
    .first();
  await action.focus();

  const hint = page.locator('[data-slot="interaction-hint"]');
  await expect(hint).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(hint).toBeHidden();
});

test("standard tooltips stay hidden on mobile by default", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator(
      '[data-slot="app-header-action"][data-interaction-tooltip-trigger][aria-label]:not([disabled])',
    )
    .first();
  await expect(action).toBeVisible();
  await action.hover();

  await expect(page.locator('[data-slot="interaction-hint"]')).toBeHidden();
});

test("sidebar action tooltips are explicit and not HoverCard previews", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const action = page
    .locator(
      '[data-slot="app-sidebar-primary-action"] button[data-interaction-tooltip-trigger][aria-label]',
    )
    .first();
  await expect(action).toBeVisible();
  expect(
    await action.evaluate((element) => element.closest('[data-slot="hover-card-trigger"]')),
  ).toBeNull();

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

test("New uses an explicit tooltip while its command dialog remains click-driven", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  const trigger = page.locator("#workspace-new-trigger[data-interaction-tooltip-trigger]");
  await expect(trigger).toBeVisible();
  await trigger.click();

  await expect(page.locator('[data-slot="dialog-content"]:visible')).toHaveCount(1);
  await expect(page.locator('[data-slot="popover-content"]:visible')).toHaveCount(0);
});
