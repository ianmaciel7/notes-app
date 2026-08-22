"use client";

import { useTranslations } from "next-intl";

import {
  AppHeaderCaretDownIcon,
  AppHeaderGraphIcon,
} from "@/components/app-header-icons";
import {
  AppSidebarArrowDownIcon,
  AppSidebarDotsIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import {
  type WorkspaceCreatedEntity,
  useWorkspace,
} from "@/components/workspace-controller";
import { type AppSidebarObjectType } from "@/components/app-sidebar-overview";
import {
  ObjectAiChatIcon,
  ObjectAreaIcon,
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectPageIcon,
  ObjectQuoteIcon,
  ObjectTagIcon,
  ObjectTableIcon,
} from "@/components/object-icons";
import { Button } from "@/components/ui/button";

function AtomicNotesWorkspace() {
  const { mainTabs, mainValue, activeAction, objectTypes, createdEntities } =
    useWorkspace();
  const activeTab = mainTabs.find((tab) => tab.id === mainValue);
  const activeObjectType = objectTypes.find((item) => item.id === mainValue);
  const activeCreatedEntity = createdEntities.find(
    (entity) => entity.id === mainValue,
  );

  if (activeAction === "explore") {
    return <ExploreWorkspace />;
  }

  if (activeTab?.id === "untitled") {
    return <CitationWorkspace />;
  }

  if (activeCreatedEntity?.objectTypeId === "quote") {
    return <CitationWorkspace />;
  }

  if (activeCreatedEntity) {
    return <CreatedObjectWorkspace entity={activeCreatedEntity} />;
  }

  if (activeObjectType) {
    return <ObjectTypeWorkspace objectType={activeObjectType} />;
  }

  if (activeTab && activeTab.id !== "new-tab-draft") {
    return <OpenedTabWorkspace label={activeTab.label} />;
  }

  return <ObjectTypeWorkspace objectType={objectTypes[0]!} />;
}

function CreatedObjectWorkspace({
  entity,
}: {
  entity: WorkspaceCreatedEntity;
}) {
  const t = useTranslations("workspace");
  const Icon = entity.icon;

  return (
    <div
      data-slot="created-object-workspace"
      data-object-type={entity.objectTypeId}
      className="relative flex h-full min-h-0 flex-col text-foreground"
    >
      <section className="mx-3 mt-6 min-h-[302px] shrink-0 rounded-2xl border border-border bg-card px-10 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
            <ObjectIconBadge icon={Icon} tone={entity.tone} variant="menu" />
            <span>{entity.objectTypeId}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.moreOptions")}
            className="h-7 w-7 border border-border"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        </div>

        <textarea
          aria-label={t("fields.title")}
          placeholder={t("fields.title")}
          rows={1}
          className="mt-3 block h-[41px] w-full resize-none overflow-hidden bg-transparent py-0 text-[30px] font-bold leading-[41px] tracking-[-0.025em] text-foreground outline-none placeholder:text-sidebar-foreground"
        />

        <textarea
          aria-label={t("fields.text")}
          placeholder={t("fields.text")}
          className="mt-3 min-h-32 w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-sidebar-foreground"
        />
      </section>
    </div>
  );
}

function ObjectTypeWorkspace({
  objectType,
}: {
  objectType: AppSidebarObjectType;
}) {
  const t = useTranslations("workspace");
  const Icon = objectType.icon;

  return (
    <div className="flex h-full min-h-0 flex-col text-[#282522]">
      <div className="@container flex flex-wrap items-center justify-between px-3 pt-4">
        <div className="flex min-w-0 items-center gap-2.5 @max-[450px]:basis-full">
          <ObjectIconBadge
            icon={Icon}
            tone={objectType.tone}
            className="size-8 rounded-lg shadow-sm"
            iconClassName="size-[18px]"
          />
          <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">
            {objectType.label}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 @max-[450px]:mt-2 @max-[450px]:w-full @max-[450px]:justify-between">
          <div className="flex h-8 items-center rounded-lg border border-transparent bg-card px-1 text-sidebar-foreground shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            <Button variant="ghost" size="icon-sm" aria-label={t("actions.search")}>
              <AppSidebarSearchIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label={t("actions.collapse")}>
              <AppHeaderCaretDownIcon className="size-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label={t("actions.moreOptions")}>
              <AppSidebarDotsIcon className="size-4" />
            </Button>
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Button className="h-8 rounded-none border-r border-white/15 bg-transparent px-3 text-sm font-normal hover:bg-white/10">
              <AppSidebarPlusIcon className="size-4" />
              {t("actions.new")}
            </Button>
            <Button
              className="h-8 w-8 rounded-none bg-transparent px-0 hover:bg-white/10"
              aria-label={t("actions.newObjectOptions")}
            >
              <AppHeaderCaretDownIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-3 text-[13px] text-[#77716b]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg px-2 hover:bg-[#f5f3f1]"
          >
            <ObjectAreaIcon className="size-3.5" />
            {t("views.overview")}
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg bg-[#f5f3f1] px-3 text-[#3b3835]"
          >
            <ObjectTableIcon className="size-3.5" />
            {t("views.all")}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 items-center gap-1 rounded-lg px-2 hover:bg-[#f5f3f1]"
          >
            <ObjectAreaIcon className="size-3.5" />
            {objectType.count}
          </button>
          <Button variant="ghost" size="icon-sm" aria-label={t("actions.filter")}>
            <AppSidebarSearchIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={t("actions.sort")}>
            <AppSidebarArrowDownIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={t("actions.list")}>
            <ObjectAreaIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={t("actions.grid")}>
            <ObjectTableIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.moreViews")}
          >
            <AppHeaderCaretDownIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 -translate-y-24 items-center justify-center pb-16">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="relative mb-3 flex size-40 items-center justify-center text-[#d9d7d4]">
            <Icon className="size-32" />
            <AppSidebarPlusIcon className="absolute left-5 top-10 size-4 text-[#9b9894]" />
            <AppSidebarPlusIcon className="absolute bottom-8 right-5 size-4 rotate-12 text-[#77746f]" />
          </div>
          <h2 className="text-[16px] font-semibold">
            {t("empty.title")}
          </h2>
          <p className="mt-1.5 text-sm text-[#918b85]">
            {t("empty.description")}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-lg border-[#dedbd7] bg-white px-3 font-normal text-[#615c57] shadow-sm"
            >
              {t("actions.importFiles")}
            </Button>
            <Button className="h-9 rounded-lg bg-primary px-3 font-normal text-primary-foreground hover:bg-[oklch(0.4668_0.0039_16.75)]">
              <AppSidebarPlusIcon className="size-4" />
              {t("actions.new")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CitationWorkspace() {
  const t = useTranslations("workspace");

  return (
    <div
      data-slot="citation-workspace"
      className="relative flex h-full min-h-0 flex-col text-foreground"
    >
      <section className="mx-3 mt-6 h-[302px] shrink-0 rounded-2xl border border-border bg-card px-10 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex h-7 items-center gap-1.5 rounded-lg border border-[#f1bdc8] bg-[#fff1f4] px-2 text-sm text-[#9f3d54]"
            >
              <ObjectQuoteIcon className="size-3.5" />
              {t("objects.quote")}
              <AppHeaderCaretDownIcon className="size-3.5" />
            </button>
            <button
              type="button"
              className="flex h-7 items-center gap-1.5 rounded-lg px-2 text-sm text-foreground hover:bg-sidebar"
            >
              <ObjectCollectionIcon className="size-3.5" />
              {t("objects.collections")}
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.moreOptions")}
            className="h-7 w-7 border border-border"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        </div>

        <textarea
          aria-label={t("fields.title")}
          placeholder={t("fields.title")}
          rows={1}
          className="mt-1.5 block h-[41px] w-full resize-none overflow-hidden bg-transparent py-0 text-[30px] font-bold leading-[41px] tracking-[-0.025em] text-foreground outline-none placeholder:text-sidebar-foreground"
        />

        <label className="mt-1 flex h-7 items-center gap-1.5 text-sm text-sidebar-foreground">
          <ObjectTagIcon className="size-3.5" />
          <input
            aria-label={t("fields.tags")}
            placeholder={t("fields.tags")}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-sidebar-foreground"
          />
        </label>

        <textarea
          aria-label={t("fields.quoteContent")}
          placeholder={t("fields.text")}
          className="mt-1 min-h-20 w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-sidebar-foreground"
        />
      </section>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.collapseEditor")}
        className="absolute right-4 top-[410px] bg-card"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          −
        </span>
      </Button>
    </div>
  );
}

function OpenedTabWorkspace({ label }: { label: string }) {
  const t = useTranslations("workspace");

  return (
    <div className="flex h-full min-h-0 flex-col text-[#282522]">
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <ObjectIconBadge
          icon={ObjectPageIcon}
          tone="blue"
          className="size-8 rounded-lg"
          iconClassName="size-[18px]"
        />
        <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">
          {label}
        </h1>
      </div>
      <div className="mx-auto flex w-full max-w-[42rem] flex-1 flex-col px-8 pt-16">
        <h2 className="text-[30px] font-semibold tracking-[-0.025em]">
          {label}
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("openedTab.description")}
        </p>
      </div>
    </div>
  );
}

function ExploreWorkspace() {
  const t = useTranslations("workspace");
  const actions = [
    {
      label: t("explore.graphView"),
      icon: AppHeaderGraphIcon,
    },
    { label: t("explore.backlinks"), icon: ObjectPageIcon },
    { label: t("explore.objectsInside"), icon: ObjectAreaIcon },
    { label: t("explore.relatedContent"), icon: ObjectCollectionIcon },
    { label: t("explore.aiChat"), icon: ObjectAiChatIcon },
    { label: t("actions.search"), icon: AppSidebarSearchIcon },
  ];

  return (
    <div className="flex h-full min-h-0 items-center justify-center px-8 text-sidebar-foreground">
      <div className="w-full max-w-[331px] -translate-y-2">
        <h2 className="mb-2 text-xs text-muted-foreground">{t("explore.title")}</h2>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                className="flex h-[90px] min-w-0 flex-col justify-between rounded-[8px] border border-border bg-card p-4 text-left transition-colors duration-150 hover:bg-accent motion-reduce:transition-none"
              >
                <Icon className="size-5 shrink-0 text-foreground" />
                <span className="truncate text-xs text-muted-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-[38px] flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("explore.relevantContent")}</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[#5f5a55]"
          >
            <AppSidebarSearchIcon className="size-3.5" />
            {t("explore.findMore")}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <ObjectIconBadge
            icon={ObjectPageIcon}
            tone="blue"
            className="size-5 rounded"
            iconClassName="size-3.5"
          />
          <span>aaaaaaaaaaaaa</span>
        </div>
      </div>
    </div>
  );
}

export { AtomicNotesWorkspace, ExploreWorkspace };
