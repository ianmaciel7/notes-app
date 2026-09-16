import { expect, test } from "@playwright/test";

test("creates a deck, studies a card, persists progress, and exports a backup", async ({ page }, testInfo) => {
  page.on("pageerror", (error) => console.error("PAGE ERROR:", error.message));
  page.on("console", (message) => {
    if (message.type() === "error") console.error("BROWSER ERROR:", message.text());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Criar baralho" }).first().click();
  await page.getByLabel("Nome").fill("Geografia");
  await page.getByLabel("Descrição (opcional)").fill("Capitais do mundo");
  await page.getByRole("button", { name: "Salvar baralho" }).click();

  await page.getByRole("link", { name: /Geografia/ }).click();
  await expect(page).toHaveURL(/\/decks\/[^/]+$/);
  await page.getByRole("button", { name: "Novo cartão" }).first().click();
  await page.getByLabel("Frente").fill("Qual é a capital do Brasil?");
  await page.getByLabel("Verso").fill("Brasília");
  await page.getByRole("button", { name: "Salvar cartão" }).click();

  await expect(page.getByRole("heading", { name: "Qual é a capital do Brasil?" })).toBeVisible();
  await page.getByRole("button", { name: "Estudar agora" }).click();
  await page.getByRole("button", { name: /10 cartões/ }).click();
  await expect(page).toHaveURL(/\/study\/[^/?]+\?meta=10$/);
  await page.getByRole("button", { name: "Mostrar resposta" }).click();
  await expect(page.getByText("Brasília")).toBeVisible();
  await page.getByRole("button", { name: /Bom/ }).click();
  await expect(page.getByRole("heading", { name: "1 cartão revisado" })).toBeVisible();

  await page.goto("/");
  await page.reload();
  await page.getByRole("link", { name: /Geografia/ }).click();
  await expect(page).toHaveURL(/\/decks\/[^/]+$/);
  await expect(page.getByRole("heading", { name: "Qual é a capital do Brasil?" })).toBeVisible();
  await expect(page.getByText("0 para estudar")).toBeVisible();

  await page.goto("/backup");
  expect(await page.getByRole("button", { name: "Exportar backup" }).evaluate((button) => getComputedStyle(button).fontSize)).not.toBe("0px");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar backup" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^revisa-backup-\d{4}-\d{2}-\d{2}\.json$/);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("backup-page.png"), fullPage: true });
});
