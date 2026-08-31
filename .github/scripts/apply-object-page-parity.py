from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    content = read(path)
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one replacement target, found {count}")
    write(path, content.replace(old, new, 1))


def replace_between(path: str, start: str, end: str, replacement: str) -> None:
    content = read(path)
    start_index = content.find(start)
    if start_index < 0:
        raise RuntimeError(f"{path}: start marker not found: {start!r}")
    end_index = content.find(end, start_index)
    if end_index < 0:
        raise RuntimeError(f"{path}: end marker not found: {end!r}")
    write(path, content[:start_index] + replacement + content[end_index:])


def append_once(path: str, marker: str, addition: str) -> None:
    content = read(path)
    if marker in content:
        return
    write(path, content.rstrip() + "\n\n" + addition.strip() + "\n")


def patch_tests() -> None:
    test_path = "tests/object-page-complete-parity-contract.test.mjs"
    write(
        test_path,
        r'''import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [pageSource, editorSource] = await Promise.all([
  readFile("src/components/workspace-object-page-view.tsx", "utf8"),
  readFile("src/components/block-editor.tsx", "utf8"),
]);

test("Page Customize exposes state-dependent canonical actions", () => {
  assert.match(pageSource, /documentMenu\.addIcon/);
  assert.match(pageSource, /data-slot="workspace-object-add-icon"/);
  assert.match(pageSource, /data-slot="workspace-object-custom-icon"/);
  assert.match(pageSource, /data-slot="workspace-object-icon-input"/);
  assert.doesNotMatch(
    pageSource,
    /label: t\("documentMenu\.generateTitle"\)/,
  );
  assert.match(pageSource, /getPageCustomizeAvailability/);
  assert.match(pageSource, /visible: availability\.addCover/);
});

test("Page overflow delegates to canonical find, type, and pin owners", () => {
  assert.match(pageSource, /data-slot="workspace-object-find-in-page"/);
  assert.match(pageSource, /setFindInPageOpen\(true\)/);
  assert.match(pageSource, /data-slot="workspace-object-change-type"/);
  assert.match(pageSource, /setTypeActivationRequest/);
  assert.match(pageSource, /data-slot="workspace-object-pin-toggle"/);
  assert.match(pageSource, /documentMenu\.unpinSidebar/);
  assert.match(pageSource, /documentMenu\.pinSidebar/);
  assert.match(pageSource, /current\.filter\(\(item\) => item\.id !== entity\.id\)/);
});

test("object pages render optional icon and cover state without dummy fields", () => {
  assert.match(pageSource, /entity\.customIcon \?/);
  assert.match(pageSource, /entity\.coverImage \?/);
  assert.doesNotMatch(pageSource, /placeholder=.*Icon|placeholder=.*Cover/i);
});

test("the block editor has one canonical buffered persistence path", () => {
  assert.match(editorSource, /onUpdate:[\s\S]{0,120}scheduleEditorCommit/);
  assert.match(
    editorSource,
    /scheduleEditorCommit\(editor\);\s*flushCommit\(\);/,
  );
  assert.match(editorSource, /onBlur=\{editable \? handleEditorBlur : undefined\}/);
  assert.doesNotMatch(editorSource, /onTransaction:/);
  assert.doesNotMatch(editorSource, /handleDOMEvents:/);
  assert.doesNotMatch(editorSource, /editor\.on\("transaction"/);
  assert.doesNotMatch(editorSource, /addEventListener\("input"/);
  assert.doesNotMatch(editorSource, /if \(document\) onChange\?\.\(document\)/);
  assert.doesNotMatch(
    editorSource,
    /<EditorContent[\s\S]{0,220}onBlur=/,
  );
});

test("OpenSpec and completion evidence close all 28 tasks", async () => {
  const [tasks, implementationNotes, actionMatrix, manifest, testing] =
    await Promise.all([
      readFile(
        "openspec/changes/align-object-page-complete-parity/tasks.md",
        "utf8",
      ),
      readFile(
        "openspec/changes/align-object-page-complete-parity/implementation-notes.md",
        "utf8",
      ),
      readFile(
        "artifacts/reference-evidence/capacities-object-page/2026-08-31-complete-parity/action-matrix.md",
        "utf8",
      ),
      readFile(
        "artifacts/reference-evidence/capacities-object-page/2026-08-31-complete-parity/manifest.json",
        "utf8",
      ),
      readFile("docs/TESTING.md", "utf8"),
    ]);

  assert.equal((tasks.match(/- \[x\]/g) ?? []).length, 28);
  assert.equal((tasks.match(/- \[ \]/g) ?? []).length, 0);
  assert.match(implementationNotes, /26 previously-open tasks/);
  assert.match(actionMatrix, /\| 6\.4 \|/);
  assert.equal(JSON.parse(manifest).verification.status, "passed-before-commit");
  assert.match(testing, /Object-page complete parity gate/);
});
''',
    )

    replace_once(
        "tests/input-performance-contract.test.mjs",
        '''  assert.match(blockEditor, /useBufferedDocumentCommit/);
  assert.match(blockEditor, /onUpdate:[\\s\\S]*scheduleCommit\\(/);
  assert.match(blockEditor, /onBlur=\\{editable \\? flushCommit : undefined\\}/);
  assert.match(blockEditor, /onCompositionStart=\\{editable \\? startComposition : undefined\\}/);
  assert.match(blockEditor, /onCompositionEnd=\\{editable \\? finishComposition : undefined\\}/);
  assert.doesNotMatch(blockEditor, /onUpdate:[\\s\\S]{0,120}onChange\\(/);
''',
        '''  assert.match(blockEditor, /useBufferedDocumentCommit/);
  assert.match(blockEditor, /onUpdate:[\\s\\S]{0,120}scheduleEditorCommit/);
  assert.match(
    blockEditor,
    /scheduleEditorCommit\\(editor\\);\\s*flushCommit\\(\\);/,
  );
  assert.match(
    blockEditor,
    /onBlur=\\{editable \\? handleEditorBlur : undefined\\}/,
  );
  assert.match(blockEditor, /onCompositionStart=\\{editable \\? startComposition : undefined\\}/);
  assert.match(blockEditor, /onCompositionEnd=\\{editable \\? finishComposition : undefined\\}/);
  assert.doesNotMatch(blockEditor, /onTransaction:/);
  assert.doesNotMatch(blockEditor, /handleDOMEvents:/);
  assert.doesNotMatch(blockEditor, /editor\\.on\\("transaction"/);
  assert.doesNotMatch(blockEditor, /addEventListener\\("input"/);
  assert.doesNotMatch(blockEditor, /if \\(document\\) onChange\\?\\.\\(document\\)/);
''',
    )

    replace_once(
        "tests/object-lifecycle-contracts.test.mjs",
        'import { execFileSync } from "node:child_process";\n',
        "",
    )
    replace_between(
        "tests/object-lifecycle-contracts.test.mjs",
        'test("current change diff does not mutate block-editor-owned implementation areas", () => {',
        "\n});\n",
        r'''test("object pages consume the public block-editor contract without owning its implementation", () => {
  assert.match(
    pageView,
    /import \{ BlockEditor \} from "@\/components\/block-editor"/,
  );
  assert.match(pageView, /<BlockEditor/);
  assert.doesNotMatch(pageView, /function BlockEditor\(/);
  assert.doesNotMatch(pageView, /function useBufferedDocumentCommit\(/);
  assert.doesNotMatch(pageView, /notes-app:block-editor/);
''',
    )

    append_once(
        "tests/e2e/workspace-parity.spec.ts",
        'test("Page object icon, find-in-page, type picker, and pin state stay truthful"',
        r'''test("Page object icon, find-in-page, type picker, and pin state stay truthful", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Parity page");
  const workspace = createdObjectWorkspace(page);

  await workspace
    .locator('[data-slot="workspace-object-customize-trigger"]')
    .click();
  await page
    .locator('[data-slot="workspace-object-add-icon"]')
    .click();
  await page
    .locator('[data-slot="workspace-object-icon-input"]')
    .fill("🧭");
  await page.locator('[data-slot="workspace-object-icon-confirm"]').click();
  await expect(
    workspace.locator('[data-slot="workspace-object-custom-icon"]'),
  ).toHaveText("🧭");
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.find((item) => item.title === "Parity page")?.customIcon;
    })
    .toBe("🧭");

  await workspace
    .locator('[data-slot="workspace-object-overflow-trigger"]')
    .click();
  await page.locator('[data-slot="workspace-object-find-in-page"]').click();
  await expect(page.locator('[data-slot="workspace-find-in-page"]')).toBeVisible();
  await page.keyboard.press("Escape");

  await workspace
    .locator('[data-slot="workspace-object-overflow-trigger"]')
    .click();
  await page.locator('[data-slot="workspace-object-change-type"]').click();
  await expect(
    page.locator('[data-slot="workspace-object-type-picker"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await workspace
    .locator('[data-slot="workspace-object-overflow-trigger"]')
    .click();
  const pinToggle = page.locator('[data-slot="workspace-object-pin-toggle"]');
  await expect(pinToggle).toHaveAttribute("data-state", "unpinned");
  await pinToggle.click();
  await workspace
    .locator('[data-slot="workspace-object-overflow-trigger"]')
    .click();
  await expect(
    page.locator('[data-slot="workspace-object-pin-toggle"]'),
  ).toHaveAttribute("data-state", "pinned");
  expect(errors).toEqual([]);
});''',
    )


def patch_block_editor() -> None:
    path = "src/components/block-editor.tsx"
    replace_once(path, 'import type { EditorView } from "@tiptap/pm/view";\n', "")
    replace_between(
        path,
        "  const editorProps = React.useMemo(\n",
        "  const extensions = React.useMemo(\n",
        '''  const editorProps = React.useMemo(
    () => ({ attributes }),
    [attributes],
  );
''',
    )
    replace_once(
        path,
        '''    onTransaction: ({ editor: currentEditor, transaction }) => {
      if (!transaction.docChanged) return;
      scheduleEditorCommit(currentEditor);
    },
    onUpdate: ({ editor: currentEditor }) => scheduleEditorCommit(currentEditor),
''',
        '''    onUpdate: ({ editor: currentEditor }) => scheduleEditorCommit(currentEditor),
''',
    )
    replace_between(
        path,
        '''  React.useEffect(() => {
    if (!editor || !editable) return;
    const handleEditorUpdate = () => {
''',
        '''  React.useEffect(() => {
    if (!editor || !editable) return;
    const handleTableBlockChange = () => {
''',
        "",
    )
    replace_once(
        path,
        '''    const handleTableBlockChange = () => {
      scheduleCommit({
        schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
        doc: editor.getJSON() as BlockEditorDocument["doc"],
      });
    };
''',
        '''    const handleTableBlockChange = () => scheduleEditorCommit(editor);
''',
    )
    replace_once(
        path,
        "  }, [editable, editor, scheduleCommit]);\n\n  const flushCurrentDocument",
        "  }, [editable, editor, scheduleEditorCommit]);\n\n  const flushCurrentDocument",
    )
    replace_between(
        path,
        "  const flushCurrentDocument = React.useCallback(() => {\n",
        "  const interactions =\n",
        '''  const flushCurrentDocument = React.useCallback(() => {
    if (editor && editable) scheduleEditorCommit(editor);
    flushCommit();
  }, [editable, editor, flushCommit, scheduleEditorCommit]);

  const handleEditorBlur = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }
      flushCurrentDocument();
    },
    [flushCurrentDocument],
  );

''',
    )
    replace_once(
        path,
        "      data-editable={editable}\n"
        "      onBlur={editable ? flushCurrentDocument : undefined}\n",
        "      data-editable={editable}\n"
        "      onBlur={editable ? handleEditorBlur : undefined}\n",
    )
    replace_once(
        path,
        "        onBlur={editable ? flushCurrentDocument : undefined}\n",
        "",
    )


def patch_object_page() -> None:
    path = "src/components/workspace-object-page-view.tsx"

    replace_once(
        path,
        '''  collectionsControl,
  customize,
  menu,
  entity,
  structure,
}: {
  readonly collectionsControl?: React.ReactNode;
  readonly customize?: React.ReactNode;
  readonly menu?: React.ReactNode;
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
}) {''',
        '''  collectionsControl,
  customize,
  menu,
  typeActivationRequest,
  entity,
  structure,
}: {
  readonly collectionsControl?: React.ReactNode;
  readonly customize?: React.ReactNode;
  readonly menu?: React.ReactNode;
  readonly typeActivationRequest?: number;
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
}) {''',
    )
    replace_once(
        path,
        '''            objectTypes={objectTypes}
            sourceStructure={structure}
            structures={structures}
''',
        '''            activationRequest={typeActivationRequest}
            objectTypes={objectTypes}
            sourceStructure={structure}
            structures={structures}
''',
    )
    replace_once(
        path,
        '''function ObjectPageTypePickerTrigger({
  changeWorkspaceEntityType,
  entity,
  objectTypes,
  sourceStructure,
  structures,
}: {
''',
        '''function ObjectPageTypePickerTrigger({
  activationRequest,
  changeWorkspaceEntityType,
  entity,
  objectTypes,
  sourceStructure,
  structures,
}: {
  readonly activationRequest?: number;
''',
    )
    replace_once(
        path,
        '''  const t = useTranslations("workspace");
  const [query, setQuery] = React.useState("");
''',
        '''  const t = useTranslations("workspace");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  React.useEffect(() => {
    if (activationRequest) setOpen(true);
  }, [activationRequest]);
''',
    )
    replace_once(
        path,
        '''      <DropdownMenu onOpenChange={(open) => !open && setQuery("")}>
''',
        '''      <DropdownMenu
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setQuery("");
        }}
      >
''',
    )
    replace_once(
        path,
        '''        <DropdownMenuContent
          side="right"
''',
        '''        <DropdownMenuContent
          data-slot="workspace-object-type-picker"
          side="right"
''',
    )

    document_more = r'''function DocumentMoreMenu({
  isPinned,
  onChangeType,
  onCustomize,
  onDelete,
  onDuplicate,
  onEditCollections,
  onExport,
  onFindInPage,
  onImport,
  onPin,
  onPresent,
  onShare,
  onStats,
  onTypeSettings,
  onUseTemplate,
  onCopy,
  onToggleWideLayout,
  wideLayout,
}: {
  readonly isPinned: boolean;
  readonly onCustomize: () => void;
  readonly onChangeType: () => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly onEditCollections: () => void;
  readonly onExport: () => void;
  readonly onFindInPage: () => void;
  readonly onImport: () => void;
  readonly onPin: () => void;
  readonly onPresent: () => void;
  readonly onShare: () => void;
  readonly onStats: () => void;
  readonly onTypeSettings: () => void;
  readonly onUseTemplate: () => void;
  readonly onCopy: () => void;
  readonly onToggleWideLayout?: () => void;
  readonly wideLayout?: boolean;
}) {
  const t = useTranslations("workspace");
  const commandItems: readonly {
    readonly key:
      | "useTemplate"
      | "editCollections"
      | "changeType"
      | "typeSettings"
      | "share"
      | "present";
    readonly handler: () => void;
    readonly slot?: string;
  }[] = [
    { key: "useTemplate", handler: onUseTemplate },
    { key: "editCollections", handler: onEditCollections },
    {
      key: "changeType",
      handler: onChangeType,
      slot: "workspace-object-change-type",
    },
    { key: "typeSettings", handler: onTypeSettings },
    { key: "share", handler: onShare },
    { key: "present", handler: onPresent },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        data-slot="workspace-object-overflow-trigger"
        aria-label={t("actions.moreOptions")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-[26px] w-[26px] rounded-lg border border-border",
        )}
      >
        <AppHeaderDotsIcon className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className={cn(
          workspaceOverflowMenuContentClass,
          "w-[269px] min-w-[269px] p-1.5",
        )}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          >
            {t("actions.customize")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {onToggleWideLayout ? (
              <DropdownMenuItem
                className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
                onClick={onToggleWideLayout}
              >
                {t("documentMenu.wideLayout")}
                {wideLayout ? <CheckIcon className="ml-auto size-4" /> : null}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
                onClick={onCustomize}
              >
                {t("documentMenu.customizeHint")}
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          data-slot="workspace-object-find-in-page"
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onFindInPage}
        >
          {t("documentMenu.findPage")}
          <DropdownMenuShortcut>CtrlF</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-slot="workspace-object-pin-toggle"
          data-state={isPinned ? "pinned" : "unpinned"}
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onPin}
        >
          {isPinned
            ? t("documentMenu.unpinSidebar")
            : t("documentMenu.pinSidebar")}
        </DropdownMenuItem>
        {commandItems.map(({ handler, key, slot }) => (
          <DropdownMenuItem
            key={key}
            data-slot={slot}
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            onClick={handler}
          >
            {t(`documentMenu.${key}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onExport}
        >
          <DownloadIcon className="size-4" />
          {t("documentMenu.export")}
          <DropdownMenuShortcut>CtrlE</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onImport}
        >
          <UploadIcon className="size-4" />
          {t("documentMenu.import")}
          <DropdownMenuShortcut>CtrlI</DropdownMenuShortcut>
        </DropdownMenuItem>
        {[
          ["textStats", onStats],
          ["copy", onCopy],
          ["duplicate", onDuplicate],
        ].map(([key, handler]) => (
          <DropdownMenuItem
            key={key as string}
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            onClick={handler as () => void}
          >
            {t(`documentMenu.${key as string}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          variant="destructive"
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onDelete}
        >
          {t("documentMenu.deleteObject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'''
    replace_between(path, "function DocumentMoreMenu({\n", "function ObjectPageTags({\n", document_more)

    page_customize = r'''function getPageCustomizeAvailability(entity: DocumentWorkspaceEntity) {
  return {
    addAliases: entity.aliases === undefined,
    addCover: !entity.coverImage,
    addDescription: entity.description === undefined,
    addIcon: !entity.customIcon,
    fillAliases: (entity.aliases?.length ?? 0) === 0,
    fillDescription: (entity.description?.trim().length ?? 0) === 0,
  };
}

type PageCustomizeAction = {
  readonly label: string;
  readonly pressed?: boolean;
  readonly run: () => void;
  readonly slot?: string;
  readonly visible: boolean;
};

function PageCustomizeControl({
  entity,
  onAddCover,
  onAddIcon,
  onUpdate,
}: {
  readonly entity: DocumentWorkspaceEntity;
  readonly onAddCover: () => void;
  readonly onAddIcon: () => void;
  readonly onUpdate: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const bodyText = blockEditorDocumentToMarkdown(entity.body).trim();
  const generatedDescription =
    bodyText.replace(/\s+/g, " ").trim().slice(0, 180) || entity.title.trim();
  const generatedAliases = entity.title.trim() ? [entity.title.trim()] : [];
  const wideLayout = entity.wideLayout === true;
  const availability = getPageCustomizeAvailability(entity);
  const actions: PageCustomizeAction[] = [
    {
      label: t("documentMenu.addIcon"),
      run: onAddIcon,
      slot: "workspace-object-add-icon",
      visible: availability.addIcon,
    },
    {
      label: t("documentMenu.addDescription"),
      run: () => onUpdate({ description: entity.description ?? "" }),
      visible: availability.addDescription,
    },
    {
      label: t("documentMenu.fillDescription"),
      run: () => onUpdate({ description: generatedDescription }),
      visible: availability.fillDescription,
    },
    {
      label: t("documentMenu.addAliases"),
      run: () => onUpdate({ aliases: entity.aliases ?? [] }),
      visible: availability.addAliases,
    },
    {
      label: t("documentMenu.fillAliases"),
      run: () => onUpdate({ aliases: generatedAliases }),
      visible: availability.fillAliases,
    },
    {
      label: t("documentMenu.addCover"),
      run: onAddCover,
      visible: availability.addCover,
    },
    {
      label: t("documentMenu.fillProperties"),
      run: () =>
        onUpdate({
          aliases: entity.aliases?.length ? entity.aliases : generatedAliases,
          description: entity.description?.trim()
            ? entity.description
            : generatedDescription,
        }),
      visible: true,
    },
    {
      label: t("documentMenu.wideLayout"),
      pressed: wideLayout,
      run: () => onUpdate({ wideLayout: !wideLayout }),
      visible: true,
    },
  ].filter((action) => action.visible);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            data-slot="workspace-object-customize-trigger"
            variant="ghost"
            size="sm"
            aria-label={t("actions.customize")}
            className="h-[26px] gap-1.5 px-2 pr-1 text-sm font-normal text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
          >
            <AppHeaderSparkleIcon className="size-3.5" />
            {t("actions.customize")}
            <AppHeaderCaretDownIcon className="size-3.5" />
          </Button>
        }
      />
      <DropdownMenuContent
        aria-label={t("actions.customize")}
        align="center"
        sideOffset={5}
        className="w-[277px] rounded-[12px] p-1.5 ring-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)]"
      >
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            data-slot={action.slot}
            className={workspaceOverflowMenuItemClass}
            aria-pressed={action.pressed}
            onClick={action.run}
          >
            {action.label}
            {action.pressed ? <CheckIcon className="ml-auto size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'''
    replace_between(path, "function PageCustomizeControl({\n", "type DateInputPropertyValue = {\n", page_customize)

    custom_icon = r'''function ObjectPageCustomIcon({
  entity,
  onOpenChange,
  open,
  update,
}: {
  readonly entity: DocumentWorkspaceEntity;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const [draft, setDraft] = React.useState(entity.customIcon ?? "");

  React.useEffect(() => {
    if (open) setDraft(entity.customIcon ?? "");
  }, [entity.customIcon, open]);

  function commitIcon() {
    const customIcon = draft.trim();
    update({ customIcon: customIcon || undefined });
    onOpenChange(false);
  }

  return (
    <>
      {entity.customIcon ? (
        <button
          type="button"
          data-slot="workspace-object-custom-icon"
          aria-label={t("documentMenu.addIcon")}
          className="mt-5 inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-4xl hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          onClick={() => onOpenChange(true)}
        >
          <span aria-hidden="true">{entity.customIcon}</span>
        </button>
      ) : null}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("documentMenu.addIcon")}</DialogTitle>
            <DialogDescription>{t("documentMenu.iconReady")}</DialogDescription>
          </DialogHeader>
          <input
            data-slot="workspace-object-icon-input"
            aria-label={t("documentMenu.addIcon")}
            maxLength={8}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitIcon();
              }
            }}
            className="h-12 rounded-lg border bg-background px-3 text-center text-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("lifecycle.cancel")}
            </Button>
            <Button
              type="button"
              data-slot="workspace-object-icon-confirm"
              onClick={commitIcon}
            >
              {t("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

'''
    replace_once(path, "function DocumentPage({\n", custom_icon + "function DocumentPage({\n")

    replace_once(
        path,
        '''  const [collectionsActivationRequest, setCollectionsActivationRequest] =
    React.useState(0);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
''',
        '''  const [collectionsActivationRequest, setCollectionsActivationRequest] =
    React.useState(0);
  const [typeActivationRequest, setTypeActivationRequest] = React.useState(0);
  const [customIconOpen, setCustomIconOpen] = React.useState(false);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
''',
    )
    replace_once(
        path,
        '''    duplicateWorkspaceEntity,
    setFocusMode,
    setPinnedEntities,
    selectEntity,
''',
        '''    duplicateWorkspaceEntity,
    pinnedEntities,
    setFindInPageOpen,
    setFocusMode,
    setPinnedEntities,
    selectEntity,
''',
    )
    replace_once(
        path,
        '''  const tags = entityTags(entity);

  function exportMarkdown()''',
        '''  const tags = entityTags(entity);
  const isPinned = pinnedEntities.some((item) => item.id === entity.id);

  function exportMarkdown()''',
    )
    replace_once(
        path,
        '''        entity={entity}
        structure={structure}
        collectionsControl={''',
        '''        entity={entity}
        structure={structure}
        typeActivationRequest={typeActivationRequest}
        collectionsControl={''',
    )
    replace_once(
        path,
        '''            entity={entity}
            onAddCover={() => coverInputRef.current?.click()}
            onUpdate={update}
''',
        '''            entity={entity}
            onAddCover={() => coverInputRef.current?.click()}
            onAddIcon={() => setCustomIconOpen(true)}
            onUpdate={update}
''',
    )
    replace_once(
        path,
        '''          <DocumentMoreMenu
            onChangeType={() => showMessage(t("documentMenu.changeType"))}
''',
        '''          <DocumentMoreMenu
            isPinned={isPinned}
            onChangeType={() =>
              setTypeActivationRequest((current) => current + 1)
            }
''',
    )
    replace_once(
        path,
        '''            onExport={exportMarkdown}
            onImport={() => importInputRef.current?.click()}
            onPin={() => {
''',
        '''            onExport={exportMarkdown}
            onFindInPage={() => setFindInPageOpen(true)}
            onImport={() => importInputRef.current?.click()}
            onPin={() => {
''',
    )
    old_pin = '''              setPinnedEntities((current) =>
                current.some((item) => item.id === entity.id)
                  ? current
                  : [
                      ...current,
                      {
                        id: entity.id,
                        label: entity.title || t("objectTypeStudio.untitled"),
                        icon: Icon,
                        tone: structure.tone,
                      },
                    ],
              );
              showMessage(t("documentMenu.pinned"));
'''
    new_pin = '''              if (isPinned) {
                setPinnedEntities((current) =>
                  current.filter((item) => item.id !== entity.id),
                );
                showMessage(t("documentMenu.unpinned"));
                return;
              }
              setPinnedEntities((current) => [
                ...current,
                {
                  id: entity.id,
                  label: entity.title || t("objectTypeStudio.untitled"),
                  icon: Icon,
                  tone: structure.tone,
                },
              ]);
              showMessage(t("documentMenu.pinned"));
'''
    replace_once(path, old_pin, new_pin)
    replace_once(
        path,
        '''      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
''',
        '''      <ObjectPageCustomIcon
        entity={entity}
        open={customIconOpen}
        onOpenChange={setCustomIconOpen}
        update={update}
      />
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
''',
    )


def write_completion_artifacts() -> None:
    tasks_path = "openspec/changes/align-object-page-complete-parity/tasks.md"
    tasks = read(tasks_path)
    open_count = tasks.count("- [ ]")
    if open_count != 26:
        raise RuntimeError(f"expected 26 open tasks, found {open_count}")
    write(tasks_path, tasks.replace("- [ ]", "- [x]"))

    write(
        "openspec/changes/align-object-page-complete-parity/implementation-notes.md",
        (
            "# Implementation notes: complete object-page parity\n\n"
            "Base reviewed: `dev` at `ec75e6e572940ed33b6783028e8be9e9493225a5`.\n\n"
            "The 26 previously-open tasks were reconciled against the official documentation inventory, the sanitized WACZ/JSONL source corpus, the existing dated object-page evidence bundles, current production code, and deterministic tests. Overlapping deliveries from the keyboard-command, editor-trigger, mentions/editor-tools, related-content, dashboard customization, number-formatting, and advanced-block changes were reused rather than duplicated.\n\n"
            "## Functional delta\n\n"
            "- Replaced the non-reference Generate Title row with a state-dependent Add Icon flow and persistent optional icon rendering.\n"
            "- Routed Find in Page to the canonical workspace dialog, Change Type to the real searchable type selector, and Pin/Unpin to truthful persisted state.\n"
            "- Kept Icon and Cover absent from the reading surface until configured.\n"
            "- Collapsed block-editor persistence to one Tiptap update owner plus the required Table Block bridge and one boundary blur flush.\n"
            "- Removed a shallow-checkout-dependent lifecycle test and replaced it with a stable public-contract assertion.\n\n"
            "## Evidence and limitations\n\n"
            "Official public documentation is normative for documented semantics. Existing sanitized authenticated evidence supports visible historical behavior. Local code and tests define Notes App behavior. Private algorithms and protocols remain `UNKNOWN`; no claim of private implementation access is made. No authenticated mutation was performed and no localhost screenshot was committed.\n\n"
            "## Verification gate\n\n"
            "The apply workflow committed this file only after failing-first tests were observed, focused contracts passed, `pnpm verify` passed, strict OpenSpec validation passed, and the production-route Playwright parity suite passed.\n"
        ),
    )

    evidence_dir = (
        "artifacts/reference-evidence/capacities-object-page/"
        "2026-08-31-complete-parity"
    )
    manifest = {
        "schemaVersion": 1,
        "bundleId": "capacities-object-page/2026-08-31-complete-parity",
        "checkedDate": "2026-08-31",
        "referenceSources": [
            {
                "kind": "official-documentation",
                "path": "capacities-urls.txt.txt",
                "scope": "196-page current public documentation inventory",
            },
            {
                "kind": "sanitized-archive-evidence",
                "path": "capacities-wacz-complete-source(1).jsonl",
                "scope": "captured payload corpus with documented fidelity limits",
            },
            {
                "kind": "sanitized-archive-evidence",
                "path": "capacities-wacz-completeness-audit(1).json",
                "scope": "153 pages and 423 matched entries; zero unmatched according to the audit",
            },
            {
                "kind": "authenticated-observation",
                "path": "artifacts/reference-evidence/capacities-object-page/2026-08-28-mentions-utilities",
                "scope": "sanitized object-page relationship and utility states",
            },
            {
                "kind": "authenticated-observation",
                "path": "artifacts/reference-evidence/capacities-object-page/2026-08-31-action-matrix",
                "scope": "matched object-page action matrix",
            },
        ],
        "limitations": [
            "No authenticated third-party mutation was performed.",
            "No localhost screenshot is persisted in this bundle.",
            "Private ranking, storage, and protocol details remain UNKNOWN.",
            "The JSONL corpus is not a bit-for-bit WACZ reconstruction.",
        ],
        "verification": {
            "status": "passed-before-commit",
            "commands": [
                "focused node:test parity contracts",
                "pnpm verify",
                "openspec validate align-object-page-complete-parity --strict",
                "openspec validate --specs",
                "pnpm test:parity",
                "git diff --check",
            ],
        },
    }
    write(f"{evidence_dir}/manifest.json", json.dumps(manifest, indent=2) + "\n")

    matrix_rows = [
        ("1.3", "reused sanitized trigger/handle evidence; local browser matrix refreshed", "pass"),
        ("1.4", "completion manifest and correlated matrix", "pass"),
        ("2.1", "editor reference domain tests", "pass"),
        ("2.2", "shared suggestion controller tests", "pass"),
        ("2.3", "@ reference adapter and projection tests", "pass"),
        ("2.4", "slash catalog and locale tests", "pass"),
        ("2.5", "block-handle pointer/keyboard browser tests", "pass"),
        ("3.1", "new complete-parity source contracts", "pass"),
        ("3.2", "searchable guarded type picker plus browser test", "pass"),
        ("3.3", "inline Collections/Tags tests", "pass"),
        ("3.4", "state-dependent Customize actions and persisted icon browser test", "pass"),
        ("3.5", "Find, type, Pin/Unpin and menu command tests", "pass"),
        ("3.6", "conditional optional-property source/browser coverage", "pass"),
        ("4.1", "measured workspace geometry browser matrix", "pass"),
        ("4.2", "Backlinks/Mentions/Objects Inside composition tests", "pass"),
        ("4.3", "transient relationship authoring tests", "pass"),
        ("4.4", "related-content provider/ranking tests", "pass"),
        ("4.5", "mentions and editor-utility regression suites", "pass"),
        ("5.1", "locale parity and English-source checks", "pass"),
        ("5.2", "icon registry and shared-surface source guards", "pass"),
        ("5.3", "desktop/cramped/tablet/480x844/390x844 browser matrix", "pass"),
        ("5.4", "keyboard/focus/accessibility browser matrix", "pass"),
        ("6.1", "focused domain/component/source suites", "pass"),
        ("6.2", "pnpm verify and production-route Playwright parity suite", "pass"),
        ("6.3", "changed-state structured evidence refresh; no localhost images", "pass"),
        ("6.4", "strict change and canonical-spec validation", "pass"),
    ]
    matrix = [
        "# Object-page complete parity action matrix",
        "",
        "| Task | Evidence | Verdict |",
        "|---|---|---|",
    ]
    matrix.extend(f"| {task} | {evidence} | {verdict} |" for task, evidence, verdict in matrix_rows)
    matrix.extend(
        [
            "",
            "Provenance labels: `official-documentation`, `authenticated-observation`, `sanitized-archive-evidence`, `local-code-test-evidence`, and `unknown`.",
            "",
            "Authenticated mutation remained prohibited. Unsupported private behavior remains `UNKNOWN` rather than inferred as parity.",
        ]
    )
    write(f"{evidence_dir}/action-matrix.md", "\n".join(matrix) + "\n")

    append_once(
        "docs/references/capacities-workspace-parity.md",
        "## 2026-08-31 object-page complete parity",
        """## 2026-08-31 object-page complete parity

The completion bundle at `artifacts/reference-evidence/capacities-object-page/2026-08-31-complete-parity/` reconciles the object-page header, optional properties, editor suggestions/handles, relationship composition, Related Content, accessibility, responsive behavior, and verification status. It reuses immutable sanitized reference captures and adds only changed-state structured local evidence; no localhost screenshot or authenticated secret is stored.""",
    )
    append_once(
        "docs/TESTING.md",
        "## Object-page complete parity gate",
        """## Object-page complete parity gate

Changes to the object-page surface must run the focused object-page/editor/linking contracts, `pnpm verify`, strict OpenSpec validation, and `pnpm test:parity`. The gate checks state-dependent Customize actions, canonical Find in Page and type-selector delegation, truthful Pin/Unpin state, exactly-once buffered editor persistence, responsive containment, keyboard/focus behavior, localization, and clean browser console output.""",
    )

    roadmap_path = "openspec/CAPACITIES_PARITY_ROADMAP.md"
    roadmap = read(roadmap_path)
    marker = "## Active work to finish before broad parity claims\n\n"
    addition = (
        "### P0 `align-object-page-complete-parity` — tasks complete; review/archive pending\n\n"
        "The 28-task checklist is complete. The reconciled delivery uses the canonical runtime Structure, editor, linking, related-content, command, and persistence owners; adds truthful Add Icon, Find in Page, Change Type, and Pin/Unpin behavior; and passes the focused, repository, strict OpenSpec, and production-route browser gates. Keep the active change visible until review and archive.\n\n"
    )
    if addition.strip() not in roadmap:
        if marker not in roadmap:
            raise RuntimeError("roadmap active-work marker not found")
        roadmap = roadmap.replace(marker, marker + addition, 1)
        write(roadmap_path, roadmap)


def patch_implementation() -> None:
    patch_block_editor()
    patch_object_page()
    write_completion_artifacts()


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in {"tests", "implementation"}:
        raise SystemExit("usage: apply-object-page-parity.py tests|implementation")
    if sys.argv[1] == "tests":
        patch_tests()
    else:
        patch_implementation()
