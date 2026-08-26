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
        activeEntityId: "slash-menu-lifecycle-page",
        entities: [
          {
            body: "",
            collections: [],
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "slash-menu-lifecycle-page",
            kind: "document",
            objectTypeId: "page",
            tags: [],
            title: "Slash menu lifecycle",
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
      [
        '[data-slot="created-object-workspace"][data-object-type="page"]',
        '[data-slot="workspace-object-page-view"][data-object-kind="document"]',
      ].join(", "),
    )
    .filter({ visible: true });
  await expect(workspace).toBeVisible();
  const editor = workspace.getByRole("textbox", { name: "Text", exact: true });
  await expect(editor).toBeVisible();
  return { editor, errors };
}

test.afterEach(async ({ page }) => {
  await page
    .evaluate((storageKey) => {
      window.localStorage.removeItem(storageKey);
      window.sessionStorage.clear();
    }, workspaceStorageKey)
    .catch(() => undefined);
});

test("slash menu can repeatedly mount, exit, and replace the active editor without console errors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);
  const slashMenu = page.locator('[data-slot="block-editor-slash-menu"]');

  for (let index = 0; index < 3; index += 1) {
    await editor.click();
    await editor.press("ControlOrMeta+A");
    await editor.press("Backspace");
    await editor.pressSequentially("/");
    await expect(slashMenu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(slashMenu).toBeHidden();
  }

  await editor.press("ControlOrMeta+A");
  await editor.press("Backspace");
  await editor.pressSequentially("/nova");
  await expect(slashMenu).toContainText("Criar 'nova'");
  await editor.press("Enter");

  const createdPage = page
    .locator(
      [
        '[data-slot="created-object-workspace"][data-object-type="page"]',
        '[data-slot="workspace-object-page-view"][data-object-kind="document"]',
      ].join(", "),
    )
    .filter({ visible: true });
  await expect(
    createdPage.getByRole("textbox", { name: "Título", exact: true }),
  ).toHaveValue("nova");

  await page.waitForTimeout(50);
  expect(errors).toEqual([]);
});
