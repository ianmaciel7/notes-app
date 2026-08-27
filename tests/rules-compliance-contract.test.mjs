import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("workspace rule contracts remain enforced", async () => {
  const [controller, primary, content, overview] = await Promise.all([
    readFile(
      new URL("../src/components/workspace-controller.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/components/app-sidebar-primary-actions.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../src/components/workspace-content.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/app-sidebar-overview.tsx", import.meta.url),
      "utf8",
    ),
  ]);
  assert.ok(
    (controller.match(/React\.useDeferredValue\(query\)/g) ?? []).length >= 2,
  );
  assert.match(
    primary,
    /const deferredQuery = React\.useDeferredValue\(query\)/,
  );
  assert.match(
    content,
    /const deferredQuery = React\.useDeferredValue\(query\)/,
  );
  assert.match(
    content,
    /const deferredDraft = React\.useDeferredValue\(draft\)/,
  );
  assert.match(
    content,
    /<BufferedTextInput[\s\S]*inputRef=\{titleRef\}[\s\S]*onCommit=\{rename\}/,
  );
  assert.match(content, /data-item-id=\{item\.id\}/);
  assert.match(
    content,
    /<BufferedTextInput[\s\S]*onCommit=\{\(value\) => onRename\(item\.id, value\)\}/,
  );
  for (const legacy of [
    "Notas atômicas",
    "Citações",
    "Páginas",
    "Tipo de objeto",
    "Visualização em grafo",
    "Links de entrada",
    "Pinned tabs cannot be closed",
    "Preview content for",
  ])
    assert.ok(!controller.includes(legacy), legacy);
  for (const legacy of [
    "Ordenar seção",
    "Ordenar manualmente",
    "Ordenar alfabeticamente",
  ])
    assert.ok(!overview.includes(legacy), legacy);
});

test("locale and governance contracts remain aligned", async () => {
  for (const locale of ["en", "es", "pt-BR"]) {
    const messages = JSON.parse(
      await readFile(
        new URL(`../src/messages/${locale}.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.ok(messages.workspace.tabs.initialObjectType);
    assert.ok(messages.workspace.tabs.previewContent);
    assert.ok(messages.workspace.tabs.pinnedCloseBlocked);
    assert.ok(messages.workspace.sidebarSections.sort);
  }
  const [gitRule, graphRule, graphDocs, ci] = await Promise.all([
    readFile(
      new URL("../.agents/rules/git-workflow-rule.md", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../.agents/rules/graphify.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/GRAPHIFY.md", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
  ]);
  assert.match(gitRule, /working branch -> dev -> stag -> main/);
  assert.match(graphRule, /Graph maintenance is not guaranteed by CI/);
  assert.match(
    graphDocs,
    /current CI workflow does not refresh Graphify automatically/,
  );
  assert.doesNotMatch(ci, /graphify:(?:build|update|status)/);
});

test("Page and sidebar production copy is localized for every supported locale", async () => {
  const [pageView, overview] = await Promise.all([
    readFile(
      new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/app-sidebar-overview.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  for (const locale of ["en", "es", "pt-BR"]) {
    const messages = JSON.parse(
      await readFile(
        new URL(`../src/messages/${locale}.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.equal(typeof messages.workspace.objectConversion.description, "string");
    assert.equal(typeof messages.workspace.objectConversion.discardValue, "string");
    assert.equal(typeof messages.workspace.sidebarPinned.addContent, "string");
    assert.equal(typeof messages.workspace.sidebarSections.add, "string");
  }

  for (const literal of [
    "Property conversion requires explicit resolution",
    "Discard value",
    "Adicionar conteúdo aos Fixados",
    "Adicionar seção",
  ]) {
    assert.ok(!pageView.includes(literal) && !overview.includes(literal), literal);
  }
});
