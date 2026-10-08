import { expect, test } from "@playwright/test";
import enMessages from "../../src/messages/en.json";
import ptBRMessages from "../../src/messages/pt-BR.json";

test("explicit locale selection persists across page loads", async ({
  page,
}) => {
  await page.goto("/sign-in");

  const language = page.getByRole("combobox", { name: "Language" });
  await language.click();
  await page
    .getByRole("option", { name: enMessages.locale.portuguese })
    .click();

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("h1")).toHaveText(ptBRMessages.auth.signIn);

  await expect
    .poll(async () => {
      const cookies = await page.context().cookies();
      return cookies.find((cookie) => cookie.name === "NEXT_LOCALE")?.value;
    })
    .toBe("pt-BR");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(
    page.getByRole("combobox", { name: ptBRMessages.locale.label }),
  ).toBeVisible();
  await expect(page.locator("h1")).toHaveText(ptBRMessages.auth.signIn);
});

test("loads a saved profile locale on another signed-in device", async ({
  page,
  browser,
}) => {
  const email = `locale-student-${Date.now()}@example.test`;
  const password = "correct-horse-battery-staple";

  await page.goto("/sign-up");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("combobox", { name: "Language" }).click();
  await page
    .getByRole("option", { name: enMessages.locale.portuguese })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(
    page.getByRole("button", { name: ptBRMessages.common.signOut }),
  ).toBeVisible();
  await page.getByRole("button", { name: ptBRMessages.common.signOut }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  const secondContext = await browser.newContext();
  try {
    const secondPage = await secondContext.newPage();
    await secondPage.goto("/sign-in");
    await secondPage.getByLabel(/email address/i).fill(email);
    await secondPage.getByLabel(/password/i).fill(password);
    await secondPage
      .getByRole("button", { name: "Sign In", exact: true })
      .click();

    await expect(secondPage).toHaveURL(/\/dashboard$/);
    await expect(secondPage.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(
      secondPage.getByRole("heading", {
        name: ptBRMessages.common.studyWorkspace,
      }),
    ).toBeVisible();
  } finally {
    await secondContext.close();
  }
});
