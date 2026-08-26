import { expect, type Page, test } from "@playwright/test";

const storageKey = "notes-app:workspace-objects:v1";

async function openCleanWorkspace(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await page.goto("/pt-BR", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  return errors;
}

async function openCalendar(page: Page) {
  await page
    .getByRole("button", { name: /Calendário|Calendar/ })
    .first()
    .click();
  await expect(
    page.locator('[data-slot="calendar-workspace"]').first(),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.mouse.move(640, 360);
  return page.locator('[data-slot="calendar-workspace"]').first();
}

test("calendar workspace covers spans, daily-note idempotency, reload, mobile overflow, and clean console", async ({
  page,
}) => {
  const errors = await openCleanWorkspace(page);
  let calendar = await openCalendar(page);

  await calendar.getByLabel("Calendar date").fill("2026-08-25");
  for (const label of ["month", "week", "three day", "day"]) {
    await calendar.getByRole("button", { name: label, exact: true }).click();
    await expect(calendar).toBeVisible();
  }

  await calendar
    .getByRole("button", { exact: true, name: "Daily note" })
    .click();
  calendar = await openCalendar(page);
  await calendar.getByLabel("Calendar date").fill("2026-08-25");
  await calendar
    .getByRole("button", { exact: true, name: "Daily note" })
    .click();

  const beforeReload = await page.evaluate((key) => {
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return snapshot.entities.filter(
      (entity: { dailyNote?: { date?: string; spaceId?: string } }) =>
        entity.dailyNote?.date === "2026-08-25" &&
        entity.dailyNote.spaceId === "labs",
    ).length;
  }, storageKey);
  expect(beforeReload).toBe(1);

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  calendar = await openCalendar(page);
  await calendar.getByLabel("Calendar date").fill("2026-08-25");
  await expect(
    calendar.getByText("2026-08-25", { exact: true }).first(),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
});
