import { expect, type Page, test } from "@playwright/test";

const desktopViewports = [
  { width: 1536, height: 912 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 720 },
] as const;

async function openWorkspace(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  return errors;
}

async function createPageObject(page: Page) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: "Página" }).click();
  await expect(
    page.locator('[data-slot="compound-chip"]').filter({ visible: true }),
  ).toBeVisible();
}

async function selectNewObject(page: Page, label: string) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: label }).click();
}

async function persistedEntities(page: Page) {
  return page.evaluate(() => {
    const value = window.localStorage.getItem("notes-app:workspace-objects:v1");
    return value ? JSON.parse(value).entities : [];
  });
}

for (const viewport of desktopViewports) {
  test(`desktop geometry ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await openWorkspace(page);
    const sidebar = page.locator("#app-shell-sidebar");
    const main = page.locator("#app-shell-main");

    await expect(sidebar).toBeVisible();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBeCloseTo(288, 0);
    await expect
      .poll(async () => (await main.boundingBox())?.width ?? 0)
      .toBeGreaterThan(0);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth ===
            document.documentElement.clientWidth,
        ),
      )
      .toBe(true);
    expect(errors).toEqual([]);
  });
}

test("tab midpoint and dedicated actions do not overlap", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 720 });
  const errors = await openWorkspace(page);
  const target = page
    .locator(
      '[aria-label="Workspace tabs"] [role="tab"][aria-selected="false"]',
    )
    .first();
  const targetId = await target.evaluate((element) =>
    element.closest("[data-tab-id]")?.getAttribute("data-tab-id"),
  );
  expect(targetId).toBeTruthy();
  const targetBox = await target.boundingBox();
  expect(targetBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(targetBox?.height ?? 0).toBeGreaterThanOrEqual(32);

  await target.click({ position: { x: 22, y: 16 } });
  await expect(page.locator(`[data-tab-id="${targetId}"]`)).toHaveAttribute(
    "data-tab-active",
    "true",
  );

  const selectedTab = page.locator(`[data-tab-id="${targetId}"] [role="tab"]`);
  const selectedContainer = selectedTab.locator("..");
  await selectedContainer.hover();
  const actions = selectedContainer.locator(
    '[data-slot="app-header-tab-action"]',
  );
  for (const action of await actions.all()) {
    const actionBox = await action.boundingBox();
    expect(
      actionBox && targetBox
        ? actionBox.x >= targetBox.x + targetBox.width
        : true,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("compound type chip separates navigation from disclosure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const primary = page
    .locator('[data-slot="compound-chip-primary"]')
    .filter({ visible: true });
  const disclosure = page.getByRole("button", {
    name: "Alterar tipo de objeto",
    exact: true,
  });
  await expect(primary).toHaveText(/Página/);
  await disclosure.click();
  const search = page.getByRole("textbox", { name: "Buscar", exact: true });
  await expect(search).toBeVisible();
  const menu = page.locator('[data-slot="dropdown-menu-content"][data-open]');
  await expect
    .poll(async () => (await menu.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(253);
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await expect(disclosure).toBeFocused();

  await primary.click();
  await expect(
    page.getByRole("button", { name: "Páginas", exact: true }).locator(".."),
  ).toHaveAttribute("data-active", "true");
  expect(errors).toEqual([]);
});

test("sidebar row and nested menu keep distinct full-row targets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const row = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" });
  const primary = row.getByRole("button").filter({ hasText: "Páginas" });

  await primary.click();
  await expect(row).toHaveAttribute("data-active", "true");
  await row.hover();

  const nested = row.getByRole("button", { name: "Ações de Páginas" });
  await expect(nested).toBeVisible();
  const primaryBox = await primary.boundingBox();
  const nestedBox = await nested.boundingBox();
  expect(
    primaryBox && nestedBox
      ? nestedBox.x >= primaryBox.x + primaryBox.width
      : true,
  ).toBe(true);

  await nested.click();
  await expect(
    page.locator('[data-slot="dropdown-menu-content"][data-open]'),
  ).toBeVisible();
  await expect(row).toHaveAttribute("data-active", "true");
  await page.keyboard.press("Escape");
  await expect(nested).toBeFocused();
  expect(errors).toEqual([]);
});

test("sidebar object rows align and collection rows keep nested indentation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await page
    .getByRole("button", { name: "Mais opções", exact: true })
    .last()
    .click();
  await page.getByRole("menuitem", { name: "Nova coleção" }).click();

  const pageRow = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" });
  await expect(
    pageRow.locator('[data-slot="app-sidebar-object-type-chevron"]'),
  ).toBeVisible();
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-chevron"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("0");
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-icon"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");

  await pageRow.hover();
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-chevron"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-icon"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("0");

  const textColumns = await page.evaluate(() => {
    function visible(element: Element) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    }

    const expectedLabels = new Set([
      "Notas atômicas",
      "Citações",
      "Páginas",
      "Sem título",
    ]);

    return Array.from(
      document.querySelectorAll(
        [
          '[data-slot="app-sidebar-object-type-row"]',
          '[data-slot="app-sidebar-collection-row"]',
        ].join(","),
      ),
    )
      .filter(visible)
      .map((row) => {
        const labels = Array.from(row.querySelectorAll("span"))
          .filter(visible)
          .map((span) => ({
            text: span.textContent?.trim() ?? "",
            left: span.getBoundingClientRect().left,
            className: span.className.toString(),
          }))
          .filter((span) => expectedLabels.has(span.text));
        const label =
          labels.find(
            (span) =>
              span.className.includes("text-[1em]") ||
              span.className === "min-w-0 truncate",
          ) ?? labels.sort((a, b) => b.left - a.left)[0];
        const iconLeft = row.querySelector("svg")?.getBoundingClientRect().left;

        return label
          ? {
              iconLeft,
              text: label.text,
              left: label.left,
            }
          : null;
      })
      .filter(
        (
          row,
        ): row is {
          iconLeft: number;
          text: string;
          left: number;
        } => row !== null && row.iconLeft !== undefined,
      );
  });

  expect(textColumns.map((row) => row.text)).toEqual(
    expect.arrayContaining([
      "Notas atômicas",
      "Citações",
      "Páginas",
      "Sem título",
    ]),
  );
  const typeLefts = textColumns
    .filter((row) => row.text !== "Sem título")
    .map((row) => row.left);
  expect(Math.max(...typeLefts) - Math.min(...typeLefts)).toBeLessThanOrEqual(
    1,
  );
  const typeIconLefts = textColumns
    .filter((row) => row.text !== "Sem título")
    .map((row) => row.iconLeft);
  expect(
    Math.max(...typeIconLefts) - Math.min(...typeIconLefts),
  ).toBeLessThanOrEqual(1);
  const typeColumn = typeLefts[0];
  const collectionColumn = textColumns.find(
    (row) => row.text === "Sem título",
  )?.left;
  expect(collectionColumn).toBeDefined();
  const nestedOffset = (collectionColumn ?? typeColumn) - typeColumn;
  expect(nestedOffset).toBeGreaterThanOrEqual(16);
  expect(nestedOffset).toBeLessThanOrEqual(20);
  expect(errors).toEqual([]);
});

test("workspace overflow menu supports submenu, outside click, and Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);
  const trigger = page.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });

  await trigger.click();
  const menu = page
    .locator('[data-slot="dropdown-menu-content"][data-open]')
    .first();
  await expect
    .poll(async () => (await menu.boundingBox())?.width ?? 0)
    .toBeCloseTo(269, 0);
  const rows = menu.locator(
    '[data-slot="dropdown-menu-item"], [data-slot="dropdown-menu-sub-trigger"]',
  );
  for (const row of await rows.all()) {
    expect((await row.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(32);
  }
  await menu.getByText("Personalizar", { exact: true }).hover();
  const customizeSubmenu = page.getByText(
    "Use o botão Personalizar no cabeçalho.",
  );
  await expect(customizeSubmenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(customizeSubmenu).toBeHidden();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.mouse.click(5, 300);
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});

test("object type collection and query actions open editable item screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await expect(
    page.getByRole("tab", { name: "Tudo", exact: true }),
  ).toHaveAttribute("aria-selected", "true");

  await page
    .getByRole("button", { name: "Mais opções", exact: true })
    .last()
    .click();
  await page.getByRole("menuitem", { name: "Nova coleção" }).click();

  const collectionScreen = page
    .locator(
      '[data-slot="object-type-named-item-workspace"][data-kind="collection"]',
    )
    .filter({ visible: true });
  await expect(collectionScreen).toBeVisible();
  await expect(collectionScreen).toContainText("Páginas");
  await expect(collectionScreen).toContainText("0 entradas");
  await expect(collectionScreen).toContainText("A visão ainda não está pronta");
  const collectionInput = collectionScreen.getByRole("textbox", {
    name: "Título",
    exact: true,
  });
  await expect(collectionInput).toHaveValue("Sem título");
  await expect(collectionInput).toBeFocused();
  await collectionInput.fill("Coleção local");
  await expect(
    page.locator('[aria-label="Workspace tabs"] [role="tab"]').filter({
      hasText: "Coleção local",
    }),
  ).toHaveAttribute("aria-selected", "true");

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await page
    .getByRole("button", { name: "Mais opções", exact: true })
    .last()
    .click();
  await page.getByRole("menuitem", { name: "Nova query" }).click();

  const queryScreen = page
    .locator(
      '[data-slot="object-type-named-item-workspace"][data-kind="query"]',
    )
    .filter({ visible: true });
  await expect(queryScreen).toBeVisible();
  await expect(queryScreen).toContainText("Páginas");
  await expect(queryScreen).toContainText("0 entradas");
  const queryInput = queryScreen.getByRole("textbox", {
    name: "Título",
    exact: true,
  });
  await expect(queryInput).toHaveValue("Sem título");
  await expect(queryInput).toBeFocused();
  expect(errors).toEqual([]);
});

test("workspace text entry buffers global persistence while typing", async ({
  page,
}) => {
  const typedTitle = "Digitação sem travar no editor";
  const typedBody =
    "Escrever texto longo precisa continuar fluido enquanto o workspace salva depois.";

  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    let workspaceSetItemCount = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "notes-app:workspace-objects:v1") workspaceSetItemCount += 1;
      return originalSetItem.call(this, key, value);
    };
    Object.defineProperty(window, "__workspaceSetItemCount", {
      value: () => workspaceSetItemCount,
    });
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const workspace = page
    .locator('[data-slot="created-object-workspace"][data-object-type="page"]')
    .filter({ visible: true });
  await expect(workspace).toBeVisible();

  const title = workspace.getByRole("textbox", { name: "Título" });
  await title.click();
  await title.pressSequentially(typedTitle, { delay: 2 });
  await expect(title).toContainText(typedTitle);

  const body = workspace.getByRole("textbox", { name: "Text" });
  await body.click();
  await body.pressSequentially(typedBody, { delay: 2 });
  await expect(body).toContainText(typedBody);

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      const entity = entities.find(
        (candidate: { objectTypeId?: string }) =>
          candidate.objectTypeId === "page",
      );
      return JSON.stringify(entity ?? {});
    })
    .toContain(typedBody);

  const storageWrites = await page.evaluate(() =>
    (
      window as unknown as {
        __workspaceSetItemCount: () => number;
      }
    ).__workspaceSetItemCount(),
  );
  expect(storageWrites).toBeLessThan(10);
  expect(storageWrites).toBeLessThan(typedTitle.length + typedBody.length);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 480, height: 844 },
  { width: 390, height: 844 },
] as const) {
  test(`mobile overlays ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await openWorkspace(page);
    const mobile = page.locator('[data-slot="app-shell-mobile"]');
    await expect(mobile).toBeVisible();
    expect((await mobile.boundingBox())?.width ?? 0).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    const navTrigger = page.getByRole("button", { name: "Abrir navegação" });
    await navTrigger.click();
    await expect(page.getByRole("dialog", { name: "Navegação" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Navegação" })).toBeHidden();
    await expect(navTrigger).toBeFocused();

    const contextTrigger = page.getByRole("button", {
      name: "Abrir painel lateral",
    });
    await contextTrigger.click();
    await expect(
      page.getByRole("dialog", { name: "Painel lateral" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(contextTrigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test("reduced motion keeps state changes immediate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const tab = page
    .locator('[aria-label="Workspace tabs"] [role="tab"]')
    .first();
  const transitionProperty = await tab.evaluate(
    (element) => getComputedStyle(element).transitionProperty,
  );
  expect(transitionProperty).toBe("none");

  const newButton = page.getByRole("button", { name: "Novo", exact: true });
  await newButton.focus();
  await expect(newButton).toBeFocused();
  expect(
    await newButton.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  await newButton.press("Enter");
  const menu = page.locator('[data-slot="popover-content"][data-open]');
  await expect(menu).toBeVisible();
  const menuMotion = await menu.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationName: style.animationName,
      transitionProperty: style.transitionProperty,
    };
  });
  expect(menuMotion).toEqual({
    animationName: "none",
    transitionProperty: "none",
  });
  expect(errors).toEqual([]);
});

test("every supported New family persists once and reopens from its tab projection", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const families = [
    { id: "book", label: "Livro", kind: "title" },
    { id: "person", label: "Pessoa", kind: "title" },
    { id: "area", label: "Área", kind: "title" },
    { id: "meeting", label: "Reunião", kind: "title" },
    { id: "definition", label: "Definição", kind: "title" },
    { id: "idea", label: "Ideia", kind: "title" },
    { id: "place", label: "Lugar", kind: "title" },
    { id: "project", label: "Projeto", kind: "title" },
    { id: "organization", label: "Organização", kind: "title" },
    { id: "media", label: "Mídia", kind: "title" },
    { id: "travel", label: "Viagem", kind: "title" },
    { id: "ai-chat", label: "Chat de IA", kind: "title" },
    { id: "atomic-note", label: "Nota atômica", kind: "title" },
    { id: "quote", label: "Citação", kind: "title" },
    { id: "page", label: "Página", kind: "title" },
    { id: "table", label: "Tabela", kind: "table" },
    { id: "task", label: "Tarefa", kind: "task" },
    { id: "weblink", label: "Weblink", kind: "url" },
    { id: "tweet", label: "Tweet", kind: "tweet" },
    { id: "tag", label: "Etiqueta", kind: "title" },
    { id: "query", label: "Query", kind: "query" },
    { id: "image", label: "Imagem", kind: "file", mime: "image/png" },
    { id: "pdf", label: "PDF", kind: "file", mime: "application/pdf" },
    { id: "audio", label: "Áudio", kind: "file", mime: "audio/mpeg" },
    { id: "file", label: "Arquivo", kind: "file", mime: "text/plain" },
  ] as const;

  for (const family of families) {
    await selectNewObject(page, family.label);
    const title = `Parity ${family.id}`;

    if (family.kind === "task") {
      await page.getByPlaceholder("Título da tarefa").fill(title);
      await page.getByRole("button", { name: "Adicionar tarefa" }).click();
      await page.getByRole("button", { name: "Abrir", exact: true }).focus();
      await page.keyboard.press("Enter");
    } else if (family.kind === "url" || family.kind === "tweet") {
      await page
        .getByPlaceholder("Cole a URL")
        .fill(
          family.kind === "tweet"
            ? "https://x.com/openai/status/123456789"
            : "https://example.com/parity",
        );
      await page
        .getByRole("button", { name: "Adicionar", exact: true })
        .click();
    } else if (family.kind === "file") {
      await page.getByLabel("Escolher arquivo local").setInputFiles({
        buffer: Buffer.from(family.id === "pdf" ? "%PDF-1.4" : "parity"),
        mimeType: family.mime,
        name: `parity-${family.id}.${family.id === "image" ? "png" : family.id === "audio" ? "mp3" : family.id === "pdf" ? "pdf" : "txt"}`,
      });
    }

    const workspace = page
      .locator(
        `[data-slot="created-object-workspace"][data-object-type="${family.id}"]`,
      )
      .filter({ visible: true });
    await expect(workspace).toBeVisible();

    if (family.kind === "query") {
      await workspace
        .getByLabel("Descrição da Query")
        .fill("páginas criadas hoje");
      await workspace.getByRole("button", { name: "Gerar" }).click();
    } else if (family.kind === "table") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
      await workspace.getByLabel("Notas").fill("Parity table notes");
    } else if (family.kind === "url" || family.kind === "tweet") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
      await workspace.getByLabel("Notas").fill("Parity URL notes");
    } else if (family.kind !== "task" && family.kind !== "file") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
    } else if (family.kind === "file") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
    }
    if (family.kind !== "task" && family.kind !== "query") {
      await workspace.getByRole("textbox", { name: "Título" }).blur();
      await expect
        .poll(async () => {
          const entities = await persistedEntities(page);
          return (
            entities.find(
              (candidate: { objectTypeId: string }) =>
                candidate.objectTypeId === family.id,
            )?.title ?? ""
          );
        })
        .toBe(title);
    }

    await expect
      .poll(async () => {
        const entities = await persistedEntities(page);
        return entities.filter(
          (entity: { objectTypeId: string }) =>
            entity.objectTypeId === family.id,
        ).length;
      })
      .toBe(1);

    const entities = await persistedEntities(page);
    const entity = entities.find(
      (candidate: { objectTypeId: string }) =>
        candidate.objectTypeId === family.id,
    );
    expect(entity?.id).toBeTruthy();
    await expect(
      page
        .locator(`[data-tab-id="${entity.id}"] [role="tab"]`)
        .filter({ visible: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .locator('[aria-label="Workspace tabs"] [role="tab"]')
      .first()
      .click();
    await page.getByRole("button", { name: "Lista de abas" }).click();
    await page
      .locator('[data-slot="app-header-tab-list"]')
      .getByRole("button", { name: entity.title || "Sem título", exact: true })
      .click();
    await expect(workspace).toBeVisible();
  }

  expect(errors).toEqual([]);
});
