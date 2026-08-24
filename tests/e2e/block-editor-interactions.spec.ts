import { expect, type Page, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

async function openPageEditor(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeEntityId: "editor-interactions-page",
        entities: [
          {
            body: "",
            collections: [],
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "editor-interactions-page",
            kind: "document",
            objectTypeId: "page",
            tags: [],
            title: "Editor interactions",
          },
        ],
        nextId: 2,
        version: 1,
      }),
    );
  }, workspaceStorageKey);
  await page.goto("/pt-BR");
  const workspace = page
    .locator(
      '[data-slot="created-object-workspace"][data-object-type="page"]',
    )
    .filter({ visible: true });
  await expect(workspace).toBeVisible();
  const editor = workspace.getByRole("textbox", { name: "Text", exact: true });
  await expect(editor).toBeVisible();
  return { editor, errors, workspace };
}

test.afterEach(async ({ page }) => {
  await page
    .evaluate((storageKey) => {
      window.localStorage.removeItem(storageKey);
      window.sessionStorage.clear();
    }, workspaceStorageKey)
    .catch(() => undefined);
});

test("selection toolbar keeps the selected text while applying and removing a link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);

  await editor.click();
  await editor.pressSequentially("Texto para link");
  await editor.press("ControlOrMeta+A");

  const toolbar = page.locator('[data-slot="block-editor-selection-menu"]');
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Link", exact: true }).click();

  const linkPopover = page.locator('[data-slot="block-editor-link-popover"]');
  await expect(linkPopover).toBeVisible();
  await linkPopover.getByRole("textbox", { name: "URL do link" }).fill("example.com");
  await linkPopover.getByRole("button", { name: "Aplicar link" }).click();

  const link = editor.locator('a[href="https://example.com"]');
  await expect(link).toHaveText("Texto para link");

  await editor.click();
  await editor.press("ControlOrMeta+A");
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Link", exact: true }).click();
  await expect(linkPopover).toBeVisible();
  await linkPopover.getByRole("button", { name: "Remover link" }).click();
  await expect(editor.locator("a")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("top-level handle reuses the block catalog and touch layout hides drag affordances", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);

  await editor.click();
  await editor.pressSequentially("Primeiro bloco");
  await editor.locator("p").first().hover();

  const handle = page.locator('[data-slot="block-editor-block-handle"]');
  await expect(handle).toBeVisible();
  await expect(handle.getByRole("button", { name: "Inserir bloco" })).toBeVisible();
  await expect(handle.getByRole("img", { name: "Arrastar bloco" })).toBeVisible();

  await handle.getByRole("button", { name: "Inserir bloco" }).click();
  await page.getByRole("menuitem", { name: "Cabeçalho 4" }).click();
  await expect(editor.locator("h4")).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toBeHidden();
  expect(errors).toEqual([]);
});
