import { expect, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

const localeCases = [
  {
    addSection: "Add section",
    addSectionPlaceholder: "Section name",
    help: "Help and resources",
    locale: "en",
    pinned: "Pinned",
  },
  {
    addSection: "Agregar sección",
    addSectionPlaceholder: "Nombre de la sección",
    help: "Ayuda y recursos",
    locale: "es",
    pinned: "Fijados",
  },
  {
    addSection: "Adicionar seção",
    addSectionPlaceholder: "Nome da seção",
    help: "Ajuda e recursos",
    locale: "pt-BR",
    pinned: "Fixados",
  },
] as const;

for (const localeCase of localeCases) {
  test(`workspace sidebar renders localized copy for /${localeCase.locale}`, async ({
    page,
  }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), workspaceStorageKey);
    await page.goto(`/${localeCase.locale}`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-slot="app-shell-provider"]').waitFor();

    await expect(
      page.getByText(localeCase.pinned, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText(localeCase.help, { exact: true }).first(),
    ).toBeVisible();

    const addSection = page.getByRole("button", {
      name: localeCase.addSection,
      exact: true,
    });
    await addSection.click({ force: true });
    await expect(
      page.getByPlaceholder(localeCase.addSectionPlaceholder, { exact: true }),
    ).toBeVisible();
  });
}
