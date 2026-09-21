import { expect, test } from "@playwright/test";
import { createSpace, ensure, signUp, visit } from "./helpers";

test("debug full repro", async ({ page }) => {
  await signUp(page);
  await createSpace(page, "Debug");
  await visit(page, "/space");

  const nav = page.getByRole("complementary", { name: "Space navigation" });
  const toggle = page.getByRole("button", { name: "Hide navigation" });
  await toggle.click();
  await expect(nav).toBeHidden();

  await page.reload();
  await expect(page.getByRole("button", { name: "Show navigation" })).toBeVisible();
  await expect(nav).toBeHidden();

  await ensure(nav, () => page.getByRole("button", { name: "Show navigation" }).click());
  await expect(page.getByRole("button", { name: "Hide navigation" })).toBeVisible();

  await page.keyboard.press("ControlOrMeta+k");
  const palette = page.getByPlaceholder("Search objects, or jump to a section");
  await expect(palette).toBeVisible();

  const info = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, isCE: (el as HTMLElement)?.isContentEditable };
  });
  console.log("ACTIVE BEFORE [", info);

  await palette.press("[");
  await expect(palette).toHaveValue("[");

  const info2 = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, isCE: (el as HTMLElement)?.isContentEditable };
  });
  console.log("ACTIVE AFTER [", info2);

  const navVisible = await nav.isVisible();
  console.log("NAV VISIBLE AFTER [:", navVisible);
});
