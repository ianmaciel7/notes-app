import { readFile } from "node:fs/promises";

import { expect, type Locator, type Page, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

const documentCases = [
  {
    bodyLabel: "Text",
    fixture: [
      "# Página Markdown",
      "",
      "## Seção",
      "",
      "Parágrafo com **negrito** e [link](https://example.com).",
      "",
      "- Item A",
      "- Item B",
      "",
      "> Bloco citado",
    ].join("\n"),
    objectType: "page",
    paletteLabel: "Página",
    semanticSelector: "h2",
    semanticText: "Seção",
    title: "Página Markdown",
  },
  {
    bodyLabel: "Conteúdo da citação",
    fixture: [
      "# Citação Markdown",
      "",
      "> Uma citação em Markdown.",
      "",
      "**Autor:** Ada Lovelace",
    ].join("\n"),
    objectType: "quote",
    paletteLabel: "Citação",
    semanticSelector: "blockquote",
    semanticText: "Uma citação em Markdown.",
    title: "Citação Markdown",
  },
] as const;

async function openIsolatedWorkspace(page: Page, objectType: "page" | "quote") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(
    ({ storageKey, type }) => {
      const fixtureMarker = `${storageKey}:fixture`;
      if (window.sessionStorage.getItem(fixtureMarker) === type) return;
      const id = `e2e-${type}`;
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          activeEntityId: id,
          entities: [
            {
              body: "",
              collections: [],
              createdAt: "2026-01-01T00:00:00.000Z",
              id,
              kind: type === "quote" ? "quote" : "document",
              objectTypeId: type,
              tags: [],
              title: "",
            },
          ],
          nextId: 2,
          version: 1,
        }),
      );
      window.sessionStorage.setItem(fixtureMarker, type);
    },
    { storageKey: workspaceStorageKey, type: objectType },
  );
  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  return errors;
}

async function getDocumentWorkspace(page: Page, objectType: string) {
  const workspace = page
    .locator(
      `[data-slot="created-object-workspace"][data-object-type="${objectType}"]`,
    )
    .filter({ visible: true });
  await expect(workspace).toBeVisible();
  return workspace;
}

async function openDocumentMenu(page: Page, workspace: Locator) {
  const trigger = workspace.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });
  await trigger.click();
  const menu = page.locator(
    '[data-slot="dropdown-menu-content"][data-open][role="menu"]',
  );
  await expect(menu).toBeVisible();
  return { menu, trigger };
}

async function importMarkdown(
  page: Page,
  workspace: Locator,
  name: string,
  markdown: string,
) {
  const importInput = workspace.locator(
    'input[type="file"][accept*=".md"][accept*="text/markdown"]',
  );
  await expect(importInput).toHaveCount(1);

  const { menu, trigger } = await openDocumentMenu(page, workspace);
  const chooserPromise = page.waitForEvent("filechooser");
  await menu.getByRole("menuitem", { name: /Importar/ }).click();
  const chooser = await chooserPromise;
  expect(chooser.isMultiple()).toBe(false);
  await chooser.setFiles({
    buffer: Buffer.from(markdown, "utf8"),
    mimeType: "text/markdown",
    name,
  });

  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("status")).toContainText(/importad[oa]/i);
}

async function exportMarkdown(page: Page, workspace: Locator) {
  const { menu, trigger } = await openDocumentMenu(page, workspace);
  const downloadPromise = page.waitForEvent("download");
  await menu.getByRole("menuitem", { name: /Exportar/ }).click();
  const download = await downloadPromise;

  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("status")).toContainText(/exportad[oa]/i);
  expect(download.suggestedFilename()).toMatch(/\.md$/i);

  const path = await download.path();
  expect(path).not.toBeNull();
  return readFile(path as string, "utf8");
}

test.afterEach(async ({ page }) => {
  await page
    .evaluate((storageKey) => {
      window.localStorage.removeItem(storageKey);
      window.sessionStorage.clear();
    }, workspaceStorageKey)
    .catch(() => undefined);
});

for (const documentCase of documentCases) {
  test(`${documentCase.paletteLabel} uses BlockEditor and round-trips Markdown`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const errors = await openIsolatedWorkspace(page, documentCase.objectType);
    const workspace = await getDocumentWorkspace(page, documentCase.objectType);
    const editorShell = workspace.locator('[data-slot="block-editor"]');
    const editor = workspace.getByRole("textbox", {
      name: documentCase.bodyLabel,
      exact: true,
    });

    await expect(editorShell).toBeVisible();
    await expect(editor).toHaveAttribute("contenteditable", "true");
    await expect(editor).toHaveAttribute("aria-multiline", "true");
    await expect(editor).toHaveCSS("font-size", "16px");
    await expect(editor).toHaveCSS("line-height", "24px");

    await importMarkdown(
      page,
      workspace,
      `${documentCase.objectType}-fixture.md`,
      documentCase.fixture,
    );
    const title = workspace.getByRole("textbox", {
      name: "Título",
      exact: true,
    });
    await expect(title).toHaveText(documentCase.title);
    await expect(editor.locator(documentCase.semanticSelector)).toContainText(
      documentCase.semanticText,
    );

    const firstExport = (await exportMarkdown(page, workspace)).replace(
      /\r\n?/g,
      "\n",
    );
    expect(firstExport).toContain(`# ${documentCase.title}`);
    expect(firstExport).toContain(documentCase.semanticText);
    expect(firstExport).not.toMatch(/<script|javascript:/i);

    await importMarkdown(
      page,
      workspace,
      `${documentCase.objectType}-round-trip.md`,
      firstExport,
    );
    const secondExport = (await exportMarkdown(page, workspace)).replace(
      /\r\n?/g,
      "\n",
    );
    expect(secondExport).toBe(firstExport);

    const activeTabId = await page
      .locator('[aria-label="Workspace tabs"] [data-tab-active="true"]')
      .getAttribute("data-tab-id");
    expect(activeTabId).toBeTruthy();
    await expect
      .poll(() =>
        page.evaluate(
          ({ entityId, storageKey }) => {
            const raw = window.localStorage.getItem(storageKey);
            if (!raw) return false;
            const snapshot = JSON.parse(raw);
            return snapshot.entities?.some(
              (entity: { id: string }) => entity.id === entityId,
            );
          },
          { entityId: activeTabId as string, storageKey: workspaceStorageKey },
        ),
      )
      .toBe(true);

    await page.reload();
    const restored = page
      .locator(
        `[data-slot="created-object-workspace"][data-object-type="${documentCase.objectType}"]`,
      )
      .filter({ visible: true });
    await expect(restored).toBeVisible();
    await expect(
      restored.getByRole("textbox", { name: "Título", exact: true }),
    ).toHaveText(documentCase.title);
    await expect(
      restored
        .getByRole("textbox", {
          name: documentCase.bodyLabel,
          exact: true,
        })
        .locator(documentCase.semanticSelector),
    ).toContainText(documentCase.semanticText);
    expect(errors).toEqual([]);
  });
}

test("slash menu filters commands, supports keyboard selection, and keeps editor focus on escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openIsolatedWorkspace(page, "page");
  const workspace = await getDocumentWorkspace(page, "page");
  const editor = workspace.getByRole("textbox", {
    name: "Text",
    exact: true,
  });

  await editor.click();
  await editor.pressSequentially("/");

  const slashMenu = page.locator('[data-slot="block-editor-slash-menu"]');
  await expect(slashMenu).toHaveCount(1);
  await expect(slashMenu).toBeVisible();
  const slashMenuBox = await slashMenu.boundingBox();
  const workspaceBox = await workspace.boundingBox();
  expect(slashMenuBox).not.toBeNull();
  expect(workspaceBox).not.toBeNull();
  expect(slashMenuBox?.x).toBeGreaterThanOrEqual((workspaceBox?.x ?? 0) - 8);
  expect(slashMenuBox?.y).toBeGreaterThanOrEqual((workspaceBox?.y ?? 0) - 8);
  await expect(slashMenu).toContainText("Padrão");
  await expect(slashMenu).toContainText("Tarefas");
  await expect(slashMenu).not.toContainText("Novo Página");

  await editor.press("Escape");
  await expect(slashMenu).toBeHidden();
  await editor.press("ControlOrMeta+A");
  await editor.press("Backspace");
  await editor.pressSequentially("/h");

  await expect(slashMenu).toHaveCount(1);
  await expect(slashMenu).toBeVisible();
  await expect(slashMenu).toContainText("Cabeçalho 1");
  await expect(slashMenu).toContainText("Cabeçalho 2");
  await expect(slashMenu).toContainText("Cabeçalho 4");

  await editor.press("ArrowDown");
  await editor.press("Enter");
  await editor.pressSequentially("Selecionado");
  await expect(editor.locator("h2")).toContainText("Selecionado");

  await editor.press("Enter");
  await editor.pressSequentially("/zzz");
  await expect(slashMenu).toHaveCount(1);
  await expect(slashMenu).toBeVisible();
  await expect(slashMenu).toContainText("Criar 'zzz'");
  await expect(slashMenu).toContainText("Página");

  await editor.press("Escape");
  await expect(slashMenu).toBeHidden();
  await editor.pressSequentially("a");
  await expect(editor).toContainText("/zzza");

  await editor.press("ControlOrMeta+A");
  await editor.press("Backspace");
  await editor.pressSequentially("/nova");
  await expect(slashMenu).toHaveCount(1);
  await expect(slashMenu).toContainText("Criar 'nova'");
  await editor.press("Enter");
  const createdPage = page
    .locator('[data-slot="created-object-workspace"][data-object-type="page"]')
    .filter({ visible: true });
  await expect(
    createdPage.getByRole("textbox", { name: "Título", exact: true }),
  ).toHaveText("nova");
  expect(errors).toEqual([]);
});
