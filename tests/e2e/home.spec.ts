import { expect, test } from "@playwright/test";

test("renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Create Next App");
  await expect(
    page.getByRole("heading", {
      name: /to get started, edit the page\.tsx file\./i,
    }),
  ).toBeVisible();
  await expect(page.getByAltText("Next.js logo")).toBeVisible();
});
