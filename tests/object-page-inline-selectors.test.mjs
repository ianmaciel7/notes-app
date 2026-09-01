import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("object page uses inline inputs for tag and collection selection", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /data-slot="object-page-tags-input"/);
  assert.match(source, /data-slot="object-page-collections-input"/);
  assert.doesNotMatch(source, /data-slot="object-page-tags-trigger"/);
  assert.doesNotMatch(source, /data-slot="object-page-collections-trigger"/);
});

test("object type picker uses canonical conversion targets and a localized empty state", async () => {
  const [source, english, spanish, portuguese] = await Promise.all([
    readFile(
      new URL(
        "../src/components/workspace-object-page-view.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../src/messages/en.json", import.meta.url), "utf8"),
    readFile(new URL("../src/messages/es.json", import.meta.url), "utf8"),
    readFile(new URL("../src/messages/pt-BR.json", import.meta.url), "utf8"),
  ]);

  assert.match(source, /selectObjectTypeConversionTargets\(/);
  assert.match(source, /data-slot="object-page-type-picker-empty"/);
  assert.equal(
    JSON.parse(english).workspace.documentMenu.noMatchingObjectTypes,
    "No matching object types",
  );
  assert.equal(
    JSON.parse(spanish).workspace.documentMenu.noMatchingObjectTypes,
    "No hay tipos de objeto coincidentes",
  );
  assert.equal(
    JSON.parse(portuguese).workspace.documentMenu.noMatchingObjectTypes,
    "Nenhum tipo de objeto correspondente",
  );
});

test("tag selector escalates search-all to the modal picker instead of navigating", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /data-slot="object-page-tag-picker"/);
  assert.match(source, /setTagPickerOpen\(true\)/);
  assert.doesNotMatch(source, /selectEntity\("tag"\)/);
});

test("empty tag selector exposes the compact Capacities menu contract", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const tagsSource = source.slice(
    source.indexOf("function ObjectPageTags("),
    source.indexOf("function ObjectPageCollections("),
  );

  assert.match(
    tagsSource,
    /data-slot="workspace-object-page-tags-empty-selector"/,
  );
  assert.match(tagsSource, /<ObjectTagIcon className="size-3\.5" \/>/);
  assert.match(tagsSource, /data-slot="workspace-object-page-tags-sparkle"/);
  assert.match(tagsSource, /group-hover\/tag-selector:opacity-100/);
  assert.match(tagsSource, /data-slot="workspace-object-page-tags-menu"/);
  assert.match(tagsSource, /"w-\[257\.6px\] min-w-\[257\.6px\] gap-0 p-1\.5"/);
  assert.ok(
    tagsSource.indexOf('t("documentMenu.newTagEmpty")') <
      tagsSource.indexOf('t("documentMenu.searchAllTags")'),
    "New empty tag must precede the global tag search action",
  );
  assert.match(
    tagsSource,
    /setTagPickerQuery\(nextQuery\)[\s\S]+setPendingTagIds\(tags\)[\s\S]+setTagPickerOpen\(true\)/,
  );
  assert.match(tagsSource, /aria-activedescendant=/);
  assert.match(tagsSource, /event\.key === "ArrowUp"/);
  assert.match(tagsSource, /activateTagOption\(activeIndex\)/);
  assert.match(tagsSource, /documentMenu\.newTag", \{ tag: query\.trim\(\) \}/);
});

test("applied page tags navigate to their tag object instead of removing metadata", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /selectEntity\(tagId\)/);
});

test("applied page tags reveal an independent removal action on hover", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /data-slot="workspace-object-page-tag-chip"/);
  assert.match(source, /data-slot="workspace-object-page-tag-remove"/);
  assert.match(source, /group-hover\/tag-chip:opacity-100/);
  assert.match(source, /group-focus-within\/tag-chip:opacity-100/);
  assert.match(source, /workspace-object-page-tag-remove/);
  assert.match(source, /w-\[31\.56px\]/);
  assert.match(
    source,
    /<XIcon aria-hidden="true" className="size-\[12\.6px\]"/,
  );
  assert.match(
    source,
    /update\(\{ tags: tags\.filter\(\(item\) => item !== tagId\) \}\)/,
  );
  assert.doesNotMatch(source, /<AppHeaderSparkleIcon className="ml-1 size-3/);
});

test("applied page tags use the reference green chip palette", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /bg-\[oklch\(0\.9669_0\.0659_122\.38\)\]/);
  assert.match(source, /text-\[oklch\(0\.3653_0\.0648_128\.67\)\]/);
});

test("metadata selectors keep tag creation explicit and expose collection creation", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /documentMenu\.newTagEmpty/);
  assert.match(source, /documentMenu\.newTag", \{ tag: query\.trim\(\) \}/);
  assert.match(source, /createAndSelectTag/);
  assert.match(source, /documentMenu\.newCollectionNamed/);
  assert.match(source, /createCollectionId/);
  assert.match(source, /data-slot="workspace-object-page-collections-create"/);
  assert.match(source, /PlusIcon[^\n]+@phosphor-icons\/react\/dist\/csr\/Plus/);
  assert.match(source, /className="size-3\.5 shrink-0"/);
  assert.match(source, /"w-\[257\.6px\] min-w-\[257\.6px\] gap-0 p-1\.5"/);
  assert.match(source, /data-active=\{activeIndex === 0\}/);
  assert.match(source, /aria-activedescendant=/);
  assert.match(source, /event\.key === "ArrowUp"/);
  assert.match(source, /activateOption\(activeIndex\)/);
});

test("page header keeps the measured desktop action sizes visible", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    source,
    /"h-\[26px\] w-\[26px\] rounded-lg border border-border"/,
  );
  assert.doesNotMatch(source, /pointer-events-none hidden h-7/);
});

test("object page column keeps the measured reference header offset", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /"lg:pt-\[100px\]"/);
  assert.doesNotMatch(source, /"lg:pt-8"/);
});

test("page header uses the reference collection, customize, and overflow icons", async () => {
  const [pageSource, iconSource] = await Promise.all([
    readFile(
      new URL(
        "../src/components/workspace-object-page-view.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../src/components/object-icons.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(pageSource, /ObjectCollectionIcon/);
  assert.match(pageSource, /AppHeaderCustomizeIcon/);
  assert.match(pageSource, /AppHeaderDotsIcon className="size-3\.5"/);
  assert.match(iconSource, /const ObjectCollectionIcon = ObjectAtomicNoteIcon/);
  assert.match(iconSource, /bg-\[oklch\(0\.9564_0\.0229_293\.96\)\]/);
  assert.match(iconSource, /bg-\[oklch\(0\.9678_0\.0321_182\.40\)\]/);
});

test("object page overflow menu gives every command a semantic leading icon", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  for (const mapping of [
    ["useTemplate", "FilePenLineIcon"],
    ["editCollections", "ObjectCollectionIcon"],
    ["changeType", "ShapesIcon"],
    ["typeSettings", "Settings2Icon"],
    ["share", "Share2Icon"],
    ["present", "PresentationIcon"],
    ["textStats", "BarChart3Icon"],
    ["copy", "CopyIcon"],
    ["duplicate", "CopyIcon"],
  ]) {
    assert.match(
      source,
      new RegExp(`key: "${mapping[0]}"[^}]+Icon: ${mapping[1]}`),
    );
  }
  assert.match(
    source,
    /key: isPinned \? "unpinSidebar" : "pinSidebar"[\s\S]+?handler: onPin,[\s\S]+?Icon: PinIcon/,
  );
  assert.match(source, /<DownloadIcon[^>]+className="size-4"/);
  assert.match(source, /<UploadIcon[^>]+className="size-4"/);
  assert.match(source, /<Trash2Icon[^>]+className="size-4"/);
  assert.match(source, /primaryItems\.map\(\(\{ key, handler, Icon \}\)/);
  assert.match(source, /secondaryItems\.map\(\(\{ key, handler, Icon \}\)/);
});

test("Customize is hover-revealed and owns optional Icon and Cover commands", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /group-hover\/object-page-header:pointer-events-auto/);
  assert.match(source, /duration-300 ease-linear/);
  assert.match(source, /group-hover\/object-page-header:opacity-50/);
  assert.doesNotMatch(
    source,
    /group-focus-within\/object-page-header:(?:pointer-events-auto|opacity-100)/,
  );
  assert.match(source, /t\("documentMenu\.addIcon"\)/);
  assert.match(source, /t\("documentMenu\.addCover"\)/);
  assert.match(
    source,
    /!\["title", "tags", "icon", "cover"\]\.includes\(property\.id\)/,
  );
});

test("custom Structure Pages expose localized Add property between Tags and the editor without a built-in placeholder", async () => {
  const [pageSource, controllerSource, english, spanish, portuguese] =
    await Promise.all([
      readFile(
        new URL(
          "../src/components/workspace-object-page-view.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../src/components/workspace-controller.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../src/messages/en.json", import.meta.url), "utf8"),
      readFile(new URL("../src/messages/es.json", import.meta.url), "utf8"),
      readFile(new URL("../src/messages/pt-BR.json", import.meta.url), "utf8"),
    ]);
  const documentPageSource = pageSource.slice(
    pageSource.indexOf("function DocumentPage("),
    pageSource.indexOf("const formulaSuggestionLabels"),
  );
  const tagsIndex = documentPageSource.indexOf("<ObjectPageTags");
  const addPropertyIndex = documentPageSource.indexOf(
    'data-slot="workspace-add-structure-property"',
  );
  const editorIndex = documentPageSource.indexOf("<BlockEditor");

  assert.ok(
    addPropertyIndex >= 0,
    "custom Structure Pages must render the Add property action",
  );
  assert.ok(
    tagsIndex < addPropertyIndex && addPropertyIndex < editorIndex,
    "Add property must render between Tags and the Page editor",
  );
  assert.match(
    documentPageSource,
    /structure\.ownership === "custom"[\s\S]+data-slot="workspace-add-structure-property"/,
  );
  assert.match(documentPageSource, /structure\.propertyDefinitions/);
  assert.match(documentPageSource, /replaceWorkspaceStructureSchema\(/);
  assert.match(
    controllerSource,
    /replaceWorkspaceStructureSchema[\s\S]+type: "replaceStructureSchema"/,
  );
  assert.equal(
    JSON.parse(english).workspace.documentMenu.addProperty,
    "Add property",
  );
  assert.equal(
    JSON.parse(spanish).workspace.documentMenu.addProperty,
    "Agregar propiedad",
  );
  assert.equal(
    JSON.parse(portuguese).workspace.documentMenu.addProperty,
    "Adicionar propriedade",
  );
});

test("custom object menus match the measured empty-state catalogs", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const propertyCatalog = source.slice(
    source.indexOf("const structurePropertyCatalog"),
    source.indexOf("function AddStructurePropertyControl"),
  );

  for (const key of [
    "propertyText",
    "propertyContent",
    "propertyLabel",
    "propertyObject",
    "propertyCheckbox",
    "propertyDateTime",
    "propertyNumber",
    "propertyDescription",
    "propertyCover",
    "propertyIcon",
    "propertyCreatedAt",
    "propertyLastUpdatedAt",
    "propertyAliases",
  ]) {
    assert.match(propertyCatalog, new RegExp(`key: "${key}"`));
  }
  assert.equal((propertyCatalog.match(/key: "property/g) ?? []).length, 13);
  assert.match(source, /"h-\[430px\] w-\[290px\] min-w-\[290px\]/);
  assert.match(source, /documentMenu\.searchProperties/);
  assert.match(source, /documentMenu\.searchObjectTypes/);
  assert.match(source, /<DropdownMenuSub>[\s\S]*propertyObject/);
  assert.match(source, /targetStructureIds: \[targetStructure\.id\]/);
  assert.match(source, /multiple: item\.valueType === "entity"/);
  assert.match(source, /h-\[346px\] w-\[222px\] min-w-\[222px\]/);
  assert.match(
    source,
    /const actions = isCustomStructure \? customActions : fullActions/,
  );
  assert.match(source, /onFind=\{[\s\S]*isCustomStructure \? undefined/);
  assert.match(
    source,
    /onEditCollections=\{[\s\S]*isCustomStructure[\s\S]*undefined/,
  );
  assert.match(source, /data-slot="workspace-object-page-collections-create"/);
  assert.match(source, /<DropdownMenuShortcut>Ctrl⇧\*<\/DropdownMenuShortcut>/);
});
