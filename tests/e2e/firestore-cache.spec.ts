import { expect, test } from "@playwright/test";

function listFirestoreDatabases(page: import("@playwright/test").Page) {
  return page.evaluate(async () => {
    const databases = await indexedDB.databases();
    return databases
      .map((database) => database.name ?? "")
      .filter((name) => name.startsWith("firestore/"));
  });
}

test("signing out clears the Firestore offline cache and leaves the page", async ({
  page,
}, testInfo) => {
  const email = `cache-student-${testInfo.retry}-${Date.now()}@example.test`;

  await page.goto("/sign-up");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect.poll(() => listFirestoreDatabases(page)).toEqual([]);
});
