import { expect, test } from "@playwright/test";
import { createObject, createSpace, signUp } from "./helpers";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

test("all primary authenticated screens fit mobile and desktop viewports", async ({
  page,
}) => {
  await signUp(page);
  await createSpace(page, "Responsive");
  const id = await createObject(page, {
    kind: "note",
    title: "Responsive note",
    text: "Layout regression target.",
  });

  const routes = [
    { path: "/space", heading: "Overview" },
    { path: "/question", heading: "Questions" },
    { path: `/question/${id}`, heading: "Responsive note" },
    { path: "/study", heading: "Study session" },
    { path: "/review", heading: "Review queue" },
    { path: "/settings", heading: "Settings" },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route.path);
      await expect(
        page.getByRole("heading", { name: route.heading, exact: true }).first(),
      ).toBeVisible();

      const metrics = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(
        Math.max(metrics.document, metrics.body),
        `${viewport.name} overflow on ${route.path}`,
      ).toBeLessThanOrEqual(metrics.viewport + 1);

      const screenshot = await page.screenshot();
      expect(
        screenshot.byteLength,
        `${viewport.name} screenshot for ${route.path} should not be blank`,
      ).toBeGreaterThan(5_000);
      expect(screenshot.readUInt32BE(16)).toBe(viewport.width);
      expect(screenshot.readUInt32BE(20)).toBe(viewport.height);
    }
  }
});

test("the public landing page fits both breakpoints", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Make your knowledge work together." }),
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${viewport.name} landing overflow`).toBeLessThanOrEqual(
      1,
    );
  }
});
