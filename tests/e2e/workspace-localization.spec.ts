import { expect, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

const localeCases = [
  {
    addSection: "Add section",
    addSectionDescription: "Create a custom sidebar section after naming it.",
    addSectionPlaceholder: "Section name",
    documentation: "Documentation",
    help: "Help and resources",
    locale: "en",
    pinned: "Pinned",
    searchTrash: "Search trash",
    settings: "Settings",
    shortcuts: "Open shortcuts",
    trash: "Trash",
  },
  {
    addSection: "Agregar sección",
    addSectionDescription:
      "Crea una sección personalizada en la barra lateral después de nombrarla.",
    addSectionPlaceholder: "Nombre de la sección",
    documentation: "Documentación",
    help: "Ayuda y recursos",
    locale: "es",
    pinned: "Fijados",
    searchTrash: "Buscar en la papelera",
    settings: "Configuración",
    shortcuts: "Abrir atajos",
    trash: "Papelera",
  },
  {
    addSection: "Adicionar seção",
    addSectionDescription:
      "Crie uma seção personalizada na barra lateral depois de nomeá-la.",
    addSectionPlaceholder: "Nome da seção",
    documentation: "Documentação",
    help: "Ajuda e recursos",
    locale: "pt-BR",
    pinned: "Fixados",
    searchTrash: "Buscar na lixeira",
    settings: "Configurações",
    shortcuts: "Abrir atalhos",
    trash: "Lixeira",
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
    await expect(
      page.getByText(localeCase.addSectionDescription, { exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("link", {
        name: localeCase.documentation,
        exact: true,
      }),
    ).toHaveAttribute("href", "https://docs.capacities.io/");

    const footer = page.locator('[data-slot="app-sidebar-footer"]');
    await footer
      .getByRole("button", { name: localeCase.settings, exact: true })
      .click();
    await expect(
      page.locator('[data-slot="app-sidebar-settings-surface"]'),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await footer
      .getByRole("button", { name: localeCase.shortcuts, exact: true })
      .click();
    await expect(
      page.locator('[data-slot="workspace-shortcut-browser"]'),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await page
      .getByRole("button", { name: localeCase.trash, exact: true })
      .click();
    await expect(
      page.getByPlaceholder(localeCase.searchTrash, { exact: true }),
    ).toBeVisible();
  });
}
