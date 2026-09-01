"use client";

import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import {
  AppFocusModeControls,
  AppHeader,
  AppHeaderAction,
} from "@/components/app-header";
import {
  AppHeaderCaretDownIcon,
  AppHeaderCompassIcon,
  AppHeaderGraphIcon,
  AppHeaderSidebarSimpleIcon,
} from "@/components/app-header-icons";
import {
  type AppHeaderTab,
  AppSpaceHeader,
} from "@/components/app-header-tabs";
import { useAppShell } from "@/components/app-shell";
import {
  AppSidePanelHeader,
  type SidePanelSpecialEntryId,
} from "@/components/app-side-panel-header";
import type { AppSidebarSpace } from "@/components/app-sidebar";
import { AppSidebarSearchIcon } from "@/components/app-sidebar-icons";
import type {
  AppSidebarCustomSection,
  AppSidebarObjectType,
  AppSidebarPinnedEntity,
  AppSidebarTrashItem,
} from "@/components/app-sidebar-overview";
import { AppSidebarWorkspaceIcon } from "@/components/app-sidebar-source-icon";
import {
  ObjectAiChatIcon,
  ObjectArchiveIcon,
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectBookIcon,
  ObjectCodeIcon,
  ObjectCollectionIcon,
  ObjectIconBadge,
  type ObjectIconProps,
  ObjectIdeaIcon,
  ObjectKnowledgeIcon,
  ObjectPageIcon,
  ObjectProjectIcon,
  ObjectQueryIcon,
  ObjectQuoteIcon,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { objectLifecycleContractSlots } from "@/components/object-lifecycle-contracts";
import { notifyWorkspaceSyncDiagnostics } from "@/components/offline-first-bridge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { blockEditorDocumentToPlainText } from "@/editor/document";
import { cn } from "@/lib/utils";
import {
  createWorkspaceCommandRuntime,
  projectWorkspaceCommands,
  projectWorkspaceShortcutCatalog,
  routeWorkspaceShortcut,
} from "@/lib/workspace-command-registry";
import { createBrowserWorkspaceDatabaseRepository } from "@/lib/workspace-database";
import type { WorkspaceCollectionRecord } from "@/lib/workspace-domain-identities";
import {
  createBrowserMediaStorageAdapter,
  createMediaUrlRegistry,
  garbageCollectMediaAssets,
  type MediaStorageAdapter,
  type MediaStorageError,
  type MediaUrlRegistry,
  readMediaAssetBlob,
  writeMediaAsset,
} from "@/lib/workspace-media-storage";
import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
  WORKSPACE_OBJECT_STORAGE_KEY,
} from "@/lib/workspace-object-storage";
import {
  type CreateStructureInput,
  type NumberPresentation,
  type ObjectIconName,
  type ObjectIconTone,
  type PropertyDefinition,
  type StructurePresentation,
  selectCreatableStructures,
  type WorkspaceStructure,
} from "@/lib/workspace-object-types";
import {
  acceptsFileForType,
  countEntitiesByType,
  createInitialWorkspaceObjectState,
  getCreationFlow,
  getWorkspaceImportError,
  isWorkspaceEntityDeletionAccepted,
  selectTrashedEntities,
  selectTrashRecords,
  type WorkspaceDraft,
  type WorkspaceEntity,
  type WorkspaceObjectError,
  type WorkspaceObjectState,
  workspaceObjectReducer,
} from "@/lib/workspace-objects";
import {
  buildWorkspaceSearchIndex,
  searchWorkspaceIndex,
} from "@/lib/workspace-query-engine";
import {
  contextualPanelRouteState,
  parseWorkspaceRoute,
  type WorkspaceSection,
  workspaceRouteId,
  workspaceRoutePath,
} from "@/lib/workspace-routing";
import {
  formatShortcutChord,
  type ShortcutPlatform,
} from "@/lib/workspace-shortcuts";
import {
  parseWorkspaceSidebarPinnedState,
  serializeWorkspaceSidebarPinnedState,
  WORKSPACE_SIDEBAR_PINNED_STORAGE_KEY,
  type WorkspaceSidebarPinnedItem,
} from "@/lib/workspace-sidebar-pinned-storage";
import {
  parseWorkspaceSidebarState,
  serializeWorkspaceSidebarState,
  WORKSPACE_SIDEBAR_STORAGE_KEY,
} from "@/lib/workspace-sidebar-storage";

const WORKSPACE_TAB_STORAGE_KEY = "notes-app:workspace-tabs:v1";
const WORKSPACE_SPACES_STORAGE_KEY = "notes-app:workspace-spaces:v1";

type SerializedWorkspaceTab = {
  id: string;
  pinned?: boolean;
  draggable?: boolean;
};

type WorkspaceTabGroupState = {
  tabs: SerializedWorkspaceTab[];
  value: string | null;
};

type WorkspaceTabState = {
  main: WorkspaceTabGroupState;
  side: WorkspaceTabGroupState;
};

type WorkspaceSpacesStorageState = {
  activeSpaceId: string;
  spaces: { id: string; name: string }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function workspaceObjectsStorageKeyForSpace(spaceId: string) {
  return `${WORKSPACE_OBJECT_STORAGE_KEY}:${workspaceRouteId(spaceId)}`;
}

function createSpaceId(name: string, existingIds: Iterable<string>) {
  const used = new Set(existingIds);
  const base =
    workspaceRouteId(name)
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "") || "space";
  let id = base;
  let suffix = 2;
  while (used.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function normalizeWorkspaceTagTitle(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function parseWorkspaceSpacesStorage(
  raw: string,
): WorkspaceSpacesStorageState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1) return null;
    const spaces = Array.isArray(value.spaces)
      ? value.spaces.flatMap((space) => {
          if (
            !isRecord(space) ||
            typeof space.id !== "string" ||
            typeof space.name !== "string"
          ) {
            return [];
          }
          const id = space.id.trim();
          const name = space.name.trim();
          return id && name ? [{ id, name }] : [];
        })
      : [];
    const activeSpaceId =
      typeof value.activeSpaceId === "string" &&
      spaces.some((space) => space.id === value.activeSpaceId)
        ? value.activeSpaceId
        : (spaces[0]?.id ?? "labs");
    return spaces.length > 0 ? { activeSpaceId, spaces } : null;
  } catch {
    return null;
  }
}

function serializeWorkspaceSpacesStorage({
  activeSpaceId,
  spaces,
}: WorkspaceSpacesStorageState) {
  return JSON.stringify({
    activeSpaceId,
    spaces,
    version: 1,
  });
}

function toSidebarSpaces(
  storedSpaces: readonly { id: string; name: string }[],
): AppSidebarSpace[] {
  const iconById = new Map(
    initialSpaces.map((space) => [space.id, space.icon]),
  );
  return storedSpaces.map((space) => ({
    id: space.id,
    name: space.name,
    icon: iconById.get(space.id) ?? AppSidebarWorkspaceIcon,
  }));
}

function parseSerializedWorkspaceTab(
  value: unknown,
): SerializedWorkspaceTab | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  const id = value.id.trim();
  if (!id || id === MAIN_DRAFT_TAB_ID) return null;
  return {
    id,
    pinned: typeof value.pinned === "boolean" ? value.pinned : undefined,
    draggable:
      typeof value.draggable === "boolean" ? value.draggable : undefined,
  };
}

function parseWorkspaceTabGroupState(value: unknown): WorkspaceTabGroupState {
  if (!isRecord(value)) return { tabs: [], value: null };
  const tabs = Array.isArray(value.tabs)
    ? value.tabs.flatMap((item) => {
        const tab = parseSerializedWorkspaceTab(item);
        return tab ? [tab] : [];
      })
    : [];
  return {
    tabs,
    value: typeof value.value === "string" ? value.value : null,
  };
}

function parseWorkspaceTabState(raw: string): WorkspaceTabState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1) return null;
    return {
      main: parseWorkspaceTabGroupState(value.main),
      side: parseWorkspaceTabGroupState(value.side),
    };
  } catch {
    return null;
  }
}

function serializeWorkspaceTab(tab: AppHeaderTab): SerializedWorkspaceTab {
  return {
    id: tab.id,
    pinned: tab.pinned || undefined,
    draggable: tab.draggable,
  };
}

function serializeWorkspaceTabState({
  mainTabs,
  mainValue,
  sideTabs,
  sideValue,
}: {
  mainTabs: readonly AppHeaderTab[];
  mainValue: string;
  sideTabs: readonly AppHeaderTab[];
  sideValue: string;
}) {
  return JSON.stringify({
    version: 1,
    main: {
      tabs: mainTabs
        .filter((tab) => tab.id !== MAIN_DRAFT_TAB_ID)
        .map(serializeWorkspaceTab),
      value: mainValue === MAIN_DRAFT_TAB_ID ? null : mainValue,
    },
    side: {
      tabs: sideTabs.map(serializeWorkspaceTab),
      value: sideValue,
    },
  });
}

function withStoredTabFlags(
  tab: AppHeaderTab,
  stored: SerializedWorkspaceTab,
): AppHeaderTab {
  return {
    ...tab,
    pinned: stored.pinned || undefined,
    draggable: stored.draggable ?? tab.draggable,
  };
}

function createInitialMainTabs(
  t: ReturnType<typeof useTranslations<"workspace">>,
): AppHeaderTab[] {
  const objectTypeEyebrow = t("tabs.preview.objectType");
  const atomicNoteLabel = t("objectTypeStudio.objectTypePlurals.atomic-note");
  const quoteLabel = t("objectTypeStudio.objectTypePlurals.quote");
  const pageLabel = t("objectTypeStudio.objectTypePlurals.page");
  return [
    {
      id: "atomic-note",
      label: atomicNoteLabel,
      icon: ObjectAtomicNoteIcon,
      iconClassName: objectIconToneBadgeClass.amber,
      preview: (
        <TabPreview eyebrow={objectTypeEyebrow} title={atomicNoteLabel} />
      ),
    },
    {
      id: "quote",
      label: quoteLabel,
      icon: ObjectQuoteIcon,
      iconClassName: objectIconToneBadgeClass.rose,
      preview: <TabPreview eyebrow={objectTypeEyebrow} title={quoteLabel} />,
    },
    {
      id: "page",
      label: pageLabel,
      icon: ObjectPageIcon,
      iconClassName: objectIconToneBadgeClass.blue,
      preview: <TabPreview eyebrow={objectTypeEyebrow} title={pageLabel} />,
    },
  ];
}

function createInitialSideTabs(
  t: ReturnType<typeof useTranslations<"workspace">>,
): AppHeaderTab[] {
  return [
    {
      id: "explore",
      label: t("explore.title"),
      icon: AppHeaderCompassIcon,
      iconClassName: objectIconToneBadgeClass.gray,
      draggable: false,
    },
  ];
}

const MAIN_DRAFT_TAB_ID = "new-tab-draft";

function createSpecialSideTabs(
  t: ReturnType<typeof useTranslations<"workspace">>,
): Record<SidePanelSpecialEntryId, Omit<AppHeaderTab, "id">> {
  return {
    graphView: {
      label: t("explore.graphView"),
      icon: AppHeaderGraphIcon,
      iconClassName: objectIconToneBadgeClass.gray,
    },
    backlinks: {
      label: t("explore.backlinks"),
      icon: ObjectPageIcon,
      iconClassName: objectIconToneBadgeClass.gray,
    },
    objectsInside: {
      label: t("explore.objectsInside"),
      icon: ObjectAreaIcon,
      iconClassName: objectIconToneBadgeClass.gray,
    },
    relatedContent: {
      label: t("explore.relatedContent"),
      icon: AppHeaderGraphIcon,
      iconClassName: objectIconToneBadgeClass.gray,
    },
    aiAssistantChat: {
      label: t("explore.aiChat"),
      icon: ObjectAiChatIcon,
      iconClassName: objectIconToneBadgeClass.purple,
    },
    localSpaceQuery: {
      label: t("primaryNavigation.search"),
      icon: ObjectQueryIcon,
      iconClassName: objectIconToneBadgeClass.emerald,
    },
  };
}

function createSpecialSideItems(
  t: ReturnType<typeof useTranslations<"workspace">>,
  specialSideTabs: Record<SidePanelSpecialEntryId, Omit<AppHeaderTab, "id">>,
) {
  return (
    [
      "graphView",
      "backlinks",
      "objectsInside",
      "relatedContent",
      "aiAssistantChat",
      "localSpaceQuery",
    ] as const
  ).map((id) => ({
    id,
    label:
      id === "localSpaceQuery"
        ? t("primaryNavigation.search")
        : specialSideTabs[id].label,
    icon: specialSideTabs[id].icon ?? AppHeaderGraphIcon,
  }));
}

function resolveWorkspaceEntityTab({
  id,
  objectTypes,
  structures,
  t,
  workspaceEntities,
}: {
  id: string;
  objectTypes: readonly AppSidebarObjectType[];
  structures: readonly WorkspaceStructure[];
  t: ReturnType<typeof useTranslations<"workspace">>;
  workspaceEntities: readonly WorkspaceEntity[];
}): AppHeaderTab | null {
  const entity = workspaceEntities.find((item) => item.id === id);
  if (entity) {
    const structure = structures.find(
      (item) => item.id === entity.objectTypeId,
    );
    if (!structure) return null;
    const definition = objectTypeDefinitionById[structure.iconName];
    const label = entity.title.trim() || t("lifecycle.untitled");
    return {
      id,
      label,
      icon: definition.icon,
      iconClassName: objectIconToneBadgeClass[structure.tone],
      preview: (
        <TabPreview
          eyebrow={
            structure.ownership === "custom"
              ? structure.singularName
              : t(`objectTypeStudio.objectTypes.${entity.objectTypeId}`)
          }
          title={label}
        />
      ),
    };
  }

  const objectType = objectTypes.find((item) => item.id === id);
  if (!objectType) return null;
  return {
    id,
    label: objectType.label,
    icon: objectType.icon,
    iconClassName: objectIconToneBadgeClass[objectType.tone],
    preview: (
      <TabPreview
        eyebrow={t("tabs.preview.objectType")}
        title={objectType.label}
      />
    ),
  };
}

function resolveMainTab({
  initialMainTabs,
  objectTypes,
  stored,
  structures,
  t,
  workspaceEntities,
}: {
  initialMainTabs: readonly AppHeaderTab[];
  objectTypes: readonly AppSidebarObjectType[];
  stored: SerializedWorkspaceTab;
  structures: readonly WorkspaceStructure[];
  t: ReturnType<typeof useTranslations<"workspace">>;
  workspaceEntities: readonly WorkspaceEntity[];
}): AppHeaderTab | null {
  const initial = initialMainTabs.find((tab) => tab.id === stored.id);
  if (initial) return withStoredTabFlags(initial, stored);
  const tab = resolveWorkspaceEntityTab({
    id: stored.id,
    objectTypes,
    structures,
    t,
    workspaceEntities,
  });
  return tab ? withStoredTabFlags(tab, stored) : null;
}

function resolveSideTab({
  initialSideTabs,
  objectTypes,
  specialSideTabs,
  stored,
  structures,
  t,
  workspaceEntities,
}: {
  initialSideTabs: readonly AppHeaderTab[];
  objectTypes: readonly AppSidebarObjectType[];
  specialSideTabs: Record<SidePanelSpecialEntryId, Omit<AppHeaderTab, "id">>;
  stored: SerializedWorkspaceTab;
  structures: readonly WorkspaceStructure[];
  t: ReturnType<typeof useTranslations<"workspace">>;
  workspaceEntities: readonly WorkspaceEntity[];
}): AppHeaderTab | null {
  const initial = initialSideTabs.find((tab) => tab.id === stored.id);
  if (initial) return withStoredTabFlags(initial, stored);

  const specialId = stored.id.startsWith("aiAssistantChat_")
    ? "aiAssistantChat"
    : stored.id;
  if (specialId in specialSideTabs) {
    return withStoredTabFlags(
      {
        id: stored.id,
        ...specialSideTabs[specialId as SidePanelSpecialEntryId],
      },
      stored,
    );
  }

  const tab = resolveWorkspaceEntityTab({
    id: stored.id,
    objectTypes,
    structures,
    t,
    workspaceEntities,
  });
  return tab ? withStoredTabFlags({ ...tab, draggable: true }, stored) : null;
}

function uniqueTabs(tabs: readonly AppHeaderTab[]) {
  const seen = new Set<string>();
  return tabs.filter((tab) => {
    if (seen.has(tab.id)) return false;
    seen.add(tab.id);
    return true;
  });
}

function selectStoredTabValue(
  tabs: readonly AppHeaderTab[],
  storedValue: string | null,
) {
  if (storedValue && tabs.some((tab) => tab.id === storedValue)) {
    return storedValue;
  }
  return tabs[0]?.id ?? "";
}

function shouldClearActiveEntity(
  activeEntityId: string | null,
  tabs: readonly AppHeaderTab[],
) {
  return Boolean(
    activeEntityId && !tabs.some((tab) => tab.id === activeEntityId),
  );
}

function resolveRestoredWorkspaceTabs({
  initialMainTabs,
  initialSideTabs,
  objectTypes,
  parsed,
  specialSideTabs,
  structures,
  t,
  workspaceEntities,
}: {
  initialMainTabs: readonly AppHeaderTab[];
  initialSideTabs: readonly AppHeaderTab[];
  objectTypes: readonly AppSidebarObjectType[];
  parsed: WorkspaceTabState;
  specialSideTabs: Record<SidePanelSpecialEntryId, Omit<AppHeaderTab, "id">>;
  structures: readonly WorkspaceStructure[];
  t: ReturnType<typeof useTranslations<"workspace">>;
  workspaceEntities: readonly WorkspaceEntity[];
}) {
  const mainTabs = uniqueTabs(
    parsed.main.tabs.flatMap((stored) => {
      const tab = resolveMainTab({
        initialMainTabs,
        objectTypes,
        stored,
        structures,
        t,
        workspaceEntities,
      });
      return tab ? [tab] : [];
    }),
  );
  const sideTabs = uniqueTabs(
    parsed.side.tabs.flatMap((stored) => {
      const tab = resolveSideTab({
        initialSideTabs,
        objectTypes,
        specialSideTabs,
        stored,
        structures,
        t,
        workspaceEntities,
      });
      return tab ? [tab] : [];
    }),
  );
  return { mainTabs, sideTabs };
}

function shouldStartTabStorageRestore({
  hydrationStatus,
  storageReady,
  tabStorageStarted,
}: {
  hydrationStatus: string;
  storageReady: boolean;
  tabStorageStarted: boolean;
}) {
  return storageReady && hydrationStatus === "ready" && !tabStorageStarted;
}

type ParsedCollectionPinnedId = {
  objectTypeId: string;
  collection: string;
};

type WorkspaceCollectionRecords = Record<string, WorkspaceCollectionRecord>;

const WORKSPACE_SIDEBAR_COLLECTION_ID_PREFIX = "collection:";

let browserMediaStorageAdapter: MediaStorageAdapter | null = null;
let browserMediaUrlRegistry: MediaUrlRegistry | null = null;

function getMediaStorageAdapter(): MediaStorageAdapter {
  browserMediaStorageAdapter ??= createBrowserMediaStorageAdapter();
  return browserMediaStorageAdapter;
}

function getMediaUrlRegistry(): MediaUrlRegistry {
  browserMediaUrlRegistry ??= createMediaUrlRegistry();
  return browserMediaUrlRegistry;
}

function formatByteLimit(bytes: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(bytes);
}

function mediaStorageErrorMessage(
  error: MediaStorageError,
  t: ReturnType<typeof useTranslations<"workspace">>,
  locale: string,
): string {
  if (error.code === "file-size-limit-exceeded") {
    if (error.limitSource === "operational-limit" && error.limitBytes) {
      return t("lifecycle.errors.media-operational-limit-exceeded", {
        limit: formatByteLimit(error.limitBytes, locale),
      });
    }
    return t("lifecycle.errors.media-file-too-large");
  }
  if (error.code === "quota-exceeded") {
    return t("lifecycle.errors.media-quota-exceeded");
  }
  return t("lifecycle.errors.media-storage-failed");
}

function parsePinnedCollectionId(
  value: string,
): ParsedCollectionPinnedId | null {
  if (!value.startsWith(WORKSPACE_SIDEBAR_COLLECTION_ID_PREFIX)) return null;
  const separatorIndex = value.indexOf(
    ":",
    WORKSPACE_SIDEBAR_COLLECTION_ID_PREFIX.length,
  );
  if (separatorIndex === -1) return null;
  const objectTypeId = value.slice(
    WORKSPACE_SIDEBAR_COLLECTION_ID_PREFIX.length,
    separatorIndex,
  );
  const encodedCollection = value.slice(separatorIndex + 1);
  if (!objectTypeId || !encodedCollection) return null;

  try {
    const collection = decodeURIComponent(encodedCollection);
    return collection.trim().length > 0 ? { objectTypeId, collection } : null;
  } catch {
    return null;
  }
}

function getPinnedEntityFromId(
  id: string,
  untitledLabel: string,
  workspaceEntities: readonly WorkspaceEntity[],
  objectTypes: readonly AppSidebarObjectType[],
  structures: readonly WorkspaceStructure[],
  collectionRecords: WorkspaceCollectionRecords,
): AppSidebarPinnedEntity | null {
  const entity = workspaceEntities.find((item) => item.id === id);
  if (entity) {
    const structure = structures.find(
      (item) => item.id === entity.objectTypeId,
    );
    if (!structure) return null;
    const definition = objectTypeDefinitionById[structure.iconName];
    return {
      id,
      label: entity.title.trim() || untitledLabel,
      icon: definition.icon,
      tone: structure.tone,
    };
  }

  const objectType = objectTypes.find((item) => item.id === id);
  if (objectType) {
    return {
      id,
      label: objectType.label,
      icon: objectType.icon,
      tone: objectType.tone,
    };
  }

  const collection = collectionRecords[id];
  if (collection) {
    return {
      id,
      label: collection.name,
      icon: ObjectCollectionIcon,
      tone: "gray",
    };
  }

  const parsedCollection = parsePinnedCollectionId(id);
  if (!parsedCollection) return null;
  const legacyCollection = Object.values(collectionRecords).find(
    (record) =>
      record.structureId === parsedCollection.objectTypeId &&
      record.name === parsedCollection.collection,
  );
  if (!legacyCollection) return null;
  return {
    id: legacyCollection.id,
    label: legacyCollection.name,
    icon: ObjectCollectionIcon,
    tone: "gray",
  };
}

function getPinnedEntityFromIds(
  ids: readonly string[],
  untitledLabel: string,
  workspaceEntities: readonly WorkspaceEntity[],
  objectTypes: readonly AppSidebarObjectType[],
  structures: readonly WorkspaceStructure[],
  collectionRecords: WorkspaceCollectionRecords,
): AppSidebarPinnedEntity[] {
  const items = new Map<string, AppSidebarPinnedEntity>();
  for (const id of ids) {
    if (items.has(id)) continue;
    const entity = getPinnedEntityFromId(
      id,
      untitledLabel,
      workspaceEntities,
      objectTypes,
      structures,
      collectionRecords,
    );
    if (entity) items.set(id, entity);
  }

  return Array.from(items.values());
}

function toWorkspaceSidebarPinSources(
  pinnedEntities: readonly AppSidebarPinnedEntity[],
  workspaceEntities: readonly WorkspaceEntity[],
  objectTypes: readonly AppSidebarObjectType[],
  structures: readonly WorkspaceStructure[],
): WorkspaceSidebarPinnedItem[] {
  return pinnedEntities.map((item) => {
    const objectType = objectTypes.find((type) => type.id === item.id);
    if (objectType?.iconName) {
      return {
        id: item.id,
        iconHint: objectType.iconName,
        toneHint: item.tone,
      };
    }

    const entity = workspaceEntities.find((entry) => entry.id === item.id);
    if (entity) {
      const structure = structures.find(
        (structure) => structure.id === entity.objectTypeId,
      );
      if (structure) {
        return {
          id: item.id,
          iconHint: structure.iconName,
          toneHint: item.tone,
        };
      }
    }

    const parsedCollection = parsePinnedCollectionId(item.id);
    if (parsedCollection) {
      return {
        id: item.id,
        iconHint: `collection:${parsedCollection.objectTypeId}`,
        toneHint: item.tone,
      };
    }

    return {
      id: item.id,
      iconHint: undefined,
      toneHint: item.tone,
    };
  });
}

function arePinnedEntitySetsEquivalent(
  current: readonly AppSidebarPinnedEntity[],
  next: readonly AppSidebarPinnedEntity[],
) {
  if (current.length !== next.length) return false;

  return current.every(
    (item, index) =>
      item.id === next[index]?.id &&
      item.label === next[index]?.label &&
      item.tone === next[index]?.tone &&
      item.icon === next[index]?.icon,
  );
}

function pruneCollectionRecordsByObjectTypes(
  current: WorkspaceCollectionRecords,
  objectTypes: readonly AppSidebarObjectType[],
) {
  const validObjectTypeIds = new Set(objectTypes.map((item) => item.id));
  return Object.fromEntries(
    Object.entries(current).filter(([, collection]) =>
      validObjectTypeIds.has(collection.structureId),
    ),
  );
}

function pruneSidebarItemsByObjectTypes(
  current: Record<string, string[]>,
  objectTypes: readonly AppSidebarObjectType[],
) {
  const validObjectTypeIds = new Set(objectTypes.map((item) => item.id));
  return Object.fromEntries(
    Object.entries(current).flatMap(([objectTypeId, items]) => {
      if (!validObjectTypeIds.has(objectTypeId)) return [];
      const normalizedItems = items
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      return normalizedItems.length > 0
        ? [[objectTypeId, normalizedItems]]
        : [];
    }),
  );
}

function areCollectionRecordMapsEquivalent(
  current: WorkspaceCollectionRecords,
  next: WorkspaceCollectionRecords,
) {
  const currentEntries = Object.entries(current);
  const nextEntries = Object.entries(next);
  return (
    currentEntries.length === nextEntries.length &&
    currentEntries.every(([id, record]) => {
      const nextRecord = next[id];
      return (
        nextRecord?.id === record.id &&
        nextRecord.name === record.name &&
        nextRecord.structureId === record.structureId
      );
    })
  );
}

function areStringArrayMapsEquivalent(
  current: Record<string, string[]>,
  next: Record<string, string[]>,
) {
  const currentEntries = Object.entries(current);
  const nextEntries = Object.entries(next);
  if (currentEntries.length !== nextEntries.length) return false;
  return currentEntries.every(([key, currentItems]) => {
    const nextItems = next[key];
    return (
      nextItems &&
      currentItems.length === nextItems.length &&
      currentItems.every((item, index) => item === nextItems[index])
    );
  });
}

type AppSidebarPrimaryNavigationAction =
  | "search"
  | "explore"
  | "calendar"
  | "tasks"
  | "trash";

const initialSpaces: AppSidebarSpace[] = [
  { id: "studies", name: "Studies", icon: ObjectBookIcon },
  { id: "ideas", name: "Ideas", icon: ObjectIdeaIcon },
  { id: "labs", name: "Labs", icon: AppSidebarWorkspaceIcon },
  { id: "projects", name: "Projects", icon: ObjectProjectIcon },
  { id: "dev", name: "Dev", icon: ObjectCodeIcon },
  { id: "knowledge", name: "Knowledge", icon: ObjectKnowledgeIcon },
  { id: "archive", name: "Archive", icon: ObjectArchiveIcon },
];

type WorkspaceContextValue = {
  spaces: AppSidebarSpace[];
  spaceId: string;
  mainTabs: AppHeaderTab[];
  mainValue: string;
  sideTabs: AppHeaderTab[];
  sideValue: string;
  focusMode: boolean;
  sideSearchOpen: boolean;
  mainSearchOpen: boolean;
  commandPaletteOpen: boolean;
  extendedSearchOpen: boolean;
  findInPageOpen: boolean;
  shortcutBrowserOpen: boolean;
  activeAction: AppSidebarPrimaryNavigationAction | undefined;
  activeEntityId: string | null;
  pinnedEntities: AppSidebarPinnedEntity[];
  availablePinnedEntities: AppSidebarPinnedEntity[];
  objectTypes: AppSidebarObjectType[];
  structures: readonly WorkspaceStructure[];
  createdEntities: WorkspaceEntity[];
  trashItems: AppSidebarTrashItem[];
  workspaceDraft: WorkspaceDraft | null;
  workspaceError: WorkspaceObjectError | null;
  customSections: AppSidebarCustomSection[];
  objectTypeCollections: WorkspaceCollectionRecords;
  objectTypeQueries: Record<string, string[]>;
  setSpaces: React.Dispatch<React.SetStateAction<AppSidebarSpace[]>>;
  createSpace: (name: string) => void;
  deleteSpace: (id: string, confirmation: string) => boolean;
  renameSpace: (id: string, name: string) => void;
  switchSpace: (id: string) => void;
  message: string | null;
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setMainValue: React.Dispatch<React.SetStateAction<string>>;
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setSideValue: React.Dispatch<React.SetStateAction<string>>;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSideSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMainSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setExtendedSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFindInPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShortcutBrowserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveAction: React.Dispatch<
    React.SetStateAction<AppSidebarPrimaryNavigationAction | undefined>
  >;
  setActiveEntityId: React.Dispatch<React.SetStateAction<string | null>>;
  setPinnedEntities: React.Dispatch<
    React.SetStateAction<AppSidebarPinnedEntity[]>
  >;
  setCustomSections: React.Dispatch<
    React.SetStateAction<AppSidebarCustomSection[]>
  >;
  setObjectTypeCollections: React.Dispatch<
    React.SetStateAction<WorkspaceCollectionRecords>
  >;
  setObjectTypeQueries: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  showMessage: (message: string) => void;
  createWorkspaceStructure: (input: CreateStructureInput) => string;
  createWorkspaceStructureFromPreset: (presetId: string) => string;
  updateWorkspaceStructure: (
    id: string,
    input: {
      singularName: string;
      pluralName: string;
      iconName: ObjectIconName;
      tone: ObjectIconTone;
    },
  ) => void;
  updateWorkspacePropertyNumberPresentation: (
    structureId: string,
    propertyId: string,
    presentation: NumberPresentation,
  ) => void;
  replaceWorkspaceStructureSchema: (
    structureId: string,
    propertyDefinitions: readonly PropertyDefinition[],
  ) => void;
  updateWorkspaceStructurePresentation: (
    id: string,
    presentation: StructurePresentation,
  ) => void;
  deleteWorkspaceStructure: (id: string) => void;
  createWorkspaceEntity: (
    objectTypeId: string,
    objectTypeLabel?: string,
  ) => void;
  createWorkspaceObjectReference: (
    objectTypeId: string,
    title: string,
  ) => { readonly id: string; readonly label: string } | null;
  createWorkspaceTag: (title: string) => string;
  createOrReuseWorkspaceTag: (
    title: string,
  ) => { readonly id: string; readonly label: string } | null;
  createWorkspaceEntityFromPreset: (presetId: string) => void;
  createOrAppendDailyNote: (
    date: string,
    appendText?: string,
    template?: string,
  ) => void;
  createWorkspacePage: (title: string) => void;
  importWorkspaceFiles: (objectTypeId: string, files: File[]) => Promise<void>;
  cancelWorkspaceDraft: () => void;
  commitWorkspaceFile: (file: File) => void;
  commitWorkspaceTask: (title: string) => void;
  commitWorkspaceUrl: (url: string) => void;
  setWorkspaceEntityPropertyValue: (
    id: string,
    propertyId: string,
    value: unknown,
  ) => void;
  setLinkedEntityPropertyValue: (
    id: string,
    propertyId: string,
    value: unknown,
  ) => void;
  removeWorkspaceEntityPropertyValue: (id: string, propertyId: string) => void;
  updateWorkspaceEntity: (id: string, patch: Record<string, unknown>) => void;
  changeWorkspaceEntityType: (
    id: string,
    objectTypeId: string,
    propertyValues?: Readonly<Record<string, unknown>>,
  ) => void;
  deleteWorkspaceEntity: (id: string) => void;
  emptyTrash: () => void;
  duplicateWorkspaceEntity: (id: string) => void;
  purgeTrashItem: (id: string) => void;
  restoreTrashItem: (id: string) => void;
  selectEntity: (id: string) => void;
  openInSidePanel: (tab: AppHeaderTab) => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(
  null,
);

function useWorkspace() {
  const context = React.useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider.");
  }

  return context;
}

function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const t = useTranslations("workspace");
  const initialMainTabs = React.useMemo(() => createInitialMainTabs(t), [t]);
  const initialSideTabs = React.useMemo(() => createInitialSideTabs(t), [t]);
  const specialSideTabs = React.useMemo(() => createSpecialSideTabs(t), [t]);
  const [spaces, setSpaces] = React.useState(initialSpaces);
  const [spaceId, setSpaceId] = React.useState("labs");
  const {
    compactDesktop,
    rightPanelRef,
    setRightCollapsed,
    setRightOverlayOpen,
    toggleLeft,
    toggleRight,
  } = useAppShell();
  const [mainTabs, setMainTabs] = React.useState<AppHeaderTab[]>([]);
  const [mainValue, setMainValue] = React.useState("");
  const [sideTabs, setSideTabs] = React.useState(() => initialSideTabs);
  const [sideValue, setSideValue] = React.useState("explore");
  const [focusMode, setFocusMode] = React.useState(false);
  const [sideSearchOpen, setSideSearchOpen] = React.useState(false);
  const [mainSearchOpen, setMainSearchOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [extendedSearchOpen, setExtendedSearchOpen] = React.useState(false);
  const [findInPageOpen, setFindInPageOpen] = React.useState(false);
  const [shortcutBrowserOpen, setShortcutBrowserOpen] = React.useState(false);
  const [activeAction, setActiveAction] = React.useState<
    AppSidebarPrimaryNavigationAction | undefined
  >(undefined);
  const [activeEntityId, setActiveEntityId] = React.useState<string | null>(
    null,
  );
  const [pinnedEntities, setPinnedEntities] = React.useState<
    AppSidebarPinnedEntity[]
  >([]);
  const [workspaceObjects, dispatchWorkspaceObjects] = React.useReducer(
    workspaceObjectReducer,
    undefined,
    createInitialWorkspaceObjectState,
  );
  const workspaceObjectsBySpaceRef = React.useRef<
    Record<string, WorkspaceObjectState>
  >({});
  const workspaceDatabaseRef = React.useRef<ReturnType<
    typeof createBrowserWorkspaceDatabaseRepository
  > | null>(null);
  const [customSections, setCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [objectTypeCollections, setObjectTypeCollections] =
    React.useState<WorkspaceCollectionRecords>({});
  const [objectTypeQueries, setObjectTypeQueries] = React.useState<
    Record<string, string[]>
  >({});
  const [message, setMessage] = React.useState<string | null>(null);
  const [createdTaskId, setCreatedTaskId] = React.useState<string | null>(null);
  const messageTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const taskToastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hydrationStartedRef = React.useRef(false);
  const [storageReady, setStorageReady] = React.useState(false);
  const [pinnedStorageReady, setPinnedStorageReady] = React.useState(false);
  const [sidebarStorageReady, setSidebarStorageReady] = React.useState(false);
  const [tabStorageReady, setTabStorageReady] = React.useState(false);
  const pinnedStorageStartedRef = React.useRef(false);
  const sidebarStorageStartedRef = React.useRef(false);
  const tabStorageStartedRef = React.useRef(false);
  const routeInitializedRef = React.useRef(false);
  const lastRouteRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    workspaceObjectsBySpaceRef.current[spaceId] = workspaceObjects;
  }, [spaceId, workspaceObjects]);

  const getWorkspaceDatabase = React.useCallback(() => {
    workspaceDatabaseRef.current ??= createBrowserWorkspaceDatabaseRepository();
    return workspaceDatabaseRef.current;
  }, []);

  const createdCounts = React.useMemo(
    () => countEntitiesByType(workspaceObjects.entities),
    [workspaceObjects.entities],
  );
  const objectTypes = React.useMemo(() => {
    return selectCreatableStructures(workspaceObjects.structures).map(
      (structure) => {
        const definition = objectTypeDefinitionById[structure.iconName];
        const isRuntimeNamed =
          structure.ownership === "custom" || structure.ownership === "legacy";
        return {
          id: structure.id,
          iconName: structure.iconName,
          label: isRuntimeNamed
            ? structure.pluralName
            : t(`objectTypeStudio.objectTypePlurals.${structure.id}`),
          icon: definition.icon,
          ownership: structure.ownership,
          singularLabel: isRuntimeNamed
            ? structure.singularName
            : t(`objectTypeStudio.objectTypes.${structure.id}`),
          tone: structure.tone,
          count: createdCounts[structure.id] ?? 0,
        };
      },
    );
  }, [createdCounts, t, workspaceObjects.structures]);

  const trashItems = React.useMemo<AppSidebarTrashItem[]>(() => {
    const trashedById = new Map(
      selectTrashedEntities(workspaceObjects).map((entity) => [
        entity.id,
        entity,
      ]),
    );
    return selectTrashRecords(workspaceObjects).flatMap((record) => {
      const entity = trashedById.get(record.entityId);
      if (!entity) return [];
      const typeLabel =
        objectTypes.find((type) => type.id === entity.objectTypeId)
          ?.singularLabel ?? entity.objectTypeId;
      return [
        {
          id: entity.id,
          label: entity.title.trim() || t("lifecycle.untitled"),
          purgeAfter: record.purgeAfter,
          trashedAt: record.trashedAt,
          typeLabel,
        },
      ];
    });
  }, [objectTypes, t, workspaceObjects]);

  const availablePinnedEntities = React.useMemo(
    () =>
      getPinnedEntityFromIds(
        [
          ...workspaceObjects.entities.map((entity) => entity.id),
          ...pinnedEntities.map((entity) => entity.id),
        ],
        t("lifecycle.untitled"),
        workspaceObjects.entities,
        objectTypes,
        workspaceObjects.structures,
        objectTypeCollections,
      ),
    [
      pinnedEntities,
      t,
      workspaceObjects.entities,
      objectTypes,
      objectTypeCollections,
      workspaceObjects.structures,
    ],
  );

  const showMessage = React.useCallback((nextMessage: string) => {
    setMessage(nextMessage);

    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => {
      messageTimerRef.current = null;
      setMessage(null);
    }, 2200);
  }, []);

  React.useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (taskToastTimerRef.current) clearTimeout(taskToastTimerRef.current);
    };
  }, []);

  const resetWorkspaceNavigation = React.useCallback(() => {
    setMainTabs(initialMainTabs);
    setMainValue(initialMainTabs[0]?.id ?? "");
    setSideTabs(initialSideTabs);
    setSideValue(initialSideTabs[0]?.id ?? "explore");
    setActiveAction(undefined);
    setActiveEntityId(initialMainTabs[0]?.id ?? null);
    setSideSearchOpen(false);
    setMainSearchOpen(false);
  }, [initialMainTabs, initialSideTabs]);

  const loadWorkspaceObjectsForSpace = React.useCallback(
    (nextSpaceId: string) => {
      const cached = workspaceObjectsBySpaceRef.current[nextSpaceId];
      if (cached) return cached;
      const raw = window.localStorage.getItem(
        workspaceObjectsStorageKeyForSpace(nextSpaceId),
      );
      const parsed = raw ? parseWorkspaceObjectSnapshot(raw) : null;
      const state = parsed?.ok
        ? parsed.state
        : createInitialWorkspaceObjectState();
      workspaceObjectsBySpaceRef.current[nextSpaceId] = state;
      return state;
    },
    [],
  );

  const persistWorkspaceObjectsForSpace = React.useCallback(
    (nextSpaceId: string, state: WorkspaceObjectState) => {
      if (!storageReady || state.hydrationStatus !== "ready") return;
      window.localStorage.setItem(
        workspaceObjectsStorageKeyForSpace(nextSpaceId),
        serializeWorkspaceObjectState(state),
      );
    },
    [storageReady],
  );

  const switchSpace = React.useCallback(
    (nextSpaceId: string) => {
      if (nextSpaceId === spaceId) return;
      const exists = spaces.some((space) => space.id === nextSpaceId);
      if (!exists) return;
      workspaceObjectsBySpaceRef.current[spaceId] = workspaceObjects;
      persistWorkspaceObjectsForSpace(spaceId, workspaceObjects);
      const nextState = loadWorkspaceObjectsForSpace(nextSpaceId);
      dispatchWorkspaceObjects({ type: "hydrate", state: nextState });
      setSpaceId(nextSpaceId);
      resetWorkspaceNavigation();
    },
    [
      loadWorkspaceObjectsForSpace,
      persistWorkspaceObjectsForSpace,
      resetWorkspaceNavigation,
      spaceId,
      spaces,
      workspaceObjects,
    ],
  );

  const createSpace = React.useCallback(
    (name: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) return;
      const id = createSpaceId(
        trimmedName,
        spaces.map((space) => space.id),
      );
      const nextSpace = {
        icon: AppSidebarWorkspaceIcon,
        id,
        name: trimmedName,
      };
      const nextState = createInitialWorkspaceObjectState();
      workspaceObjectsBySpaceRef.current[spaceId] = workspaceObjects;
      workspaceObjectsBySpaceRef.current[id] = nextState;
      persistWorkspaceObjectsForSpace(spaceId, workspaceObjects);
      setSpaces((current) => [...current, nextSpace]);
      dispatchWorkspaceObjects({ type: "hydrate", state: nextState });
      setSpaceId(id);
      resetWorkspaceNavigation();
    },
    [
      persistWorkspaceObjectsForSpace,
      resetWorkspaceNavigation,
      spaceId,
      spaces,
      workspaceObjects,
    ],
  );

  const renameSpace = React.useCallback((id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSpaces((current) =>
      current.map((space) =>
        space.id === id ? { ...space, name: trimmedName } : space,
      ),
    );
  }, []);

  const deleteSpace = React.useCallback(
    (id: string, confirmation: string) => {
      const space = spaces.find((item) => item.id === id);
      if (!space || spaces.length <= 1 || confirmation !== space.name) {
        return false;
      }
      const nextSpaces = spaces.filter((item) => item.id !== id);
      const fallbackSpace =
        nextSpaces.find((item) => item.id === "labs") ?? nextSpaces[0];
      if (!fallbackSpace) return false;
      delete workspaceObjectsBySpaceRef.current[id];
      window.localStorage.removeItem(workspaceObjectsStorageKeyForSpace(id));
      const nextState = loadWorkspaceObjectsForSpace(fallbackSpace.id);
      setSpaces(nextSpaces);
      dispatchWorkspaceObjects({ type: "hydrate", state: nextState });
      setSpaceId(fallbackSpace.id);
      resetWorkspaceNavigation();
      return true;
    },
    [loadWorkspaceObjectsForSpace, resetWorkspaceNavigation, spaces],
  );

  React.useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;
    try {
      const rawSpaces = window.localStorage.getItem(
        WORKSPACE_SPACES_STORAGE_KEY,
      );
      const parsedSpaces = rawSpaces
        ? parseWorkspaceSpacesStorage(rawSpaces)
        : null;
      const nextSpaces = parsedSpaces
        ? toSidebarSpaces(parsedSpaces.spaces)
        : initialSpaces;
      const nextSpaceId = parsedSpaces?.activeSpaceId ?? "labs";
      setSpaces(nextSpaces);
      setSpaceId(nextSpaceId);

      const raw =
        window.localStorage.getItem(
          workspaceObjectsStorageKeyForSpace(nextSpaceId),
        ) ?? window.localStorage.getItem(WORKSPACE_OBJECT_STORAGE_KEY);
      if (!raw) {
        const initialState = createInitialWorkspaceObjectState();
        workspaceObjectsBySpaceRef.current[nextSpaceId] = initialState;
        dispatchWorkspaceObjects({ type: "hydrate", state: initialState });
      } else {
        const parsed = parseWorkspaceObjectSnapshot(raw);
        if (parsed.ok) {
          workspaceObjectsBySpaceRef.current[nextSpaceId] = parsed.state;
          dispatchWorkspaceObjects({ type: "hydrate", state: parsed.state });
          void getWorkspaceDatabase().migrateLegacySnapshot(raw);
        } else {
          dispatchWorkspaceObjects({ type: "recover" });
          showMessage(t("lifecycle.storageRecovered"));
        }
      }
    } catch {
      dispatchWorkspaceObjects({ type: "recover" });
      showMessage(t("lifecycle.storageRecovered"));
    }
    setStorageReady(true);
  }, [getWorkspaceDatabase, showMessage, t]);

  React.useEffect(() => {
    if (
      !storageReady ||
      workspaceObjects.hydrationStatus === "seed" ||
      sidebarStorageStartedRef.current
    )
      return;
    sidebarStorageStartedRef.current = true;

    try {
      const raw = window.localStorage.getItem(WORKSPACE_SIDEBAR_STORAGE_KEY);
      if (raw) {
        const parsed = parseWorkspaceSidebarState(raw);
        if (parsed.ok) {
          setCustomSections(parsed.state.customSections);
          setObjectTypeCollections(parsed.state.collectionRecords);
          setObjectTypeQueries(parsed.state.objectTypeQueries);
        } else {
          showMessage(t("lifecycle.storageRecovered"));
        }
      }
    } catch {
      showMessage(t("lifecycle.storageRecovered"));
    }
    setSidebarStorageReady(true);
  }, [showMessage, storageReady, t, workspaceObjects.hydrationStatus]);

  React.useEffect(() => {
    if (
      !storageReady ||
      !sidebarStorageReady ||
      workspaceObjects.hydrationStatus === "seed" ||
      pinnedStorageStartedRef.current
    )
      return;
    pinnedStorageStartedRef.current = true;

    const untitledLabel = t("lifecycle.untitled");
    let shouldRecover = false;
    let nextPinnedEntities: AppSidebarPinnedEntity[] = [];
    try {
      const raw = window.localStorage.getItem(
        WORKSPACE_SIDEBAR_PINNED_STORAGE_KEY,
      );
      if (!raw) {
        setPinnedEntities([]);
      } else {
        const parsed = parseWorkspaceSidebarPinnedState(raw);
        if (!parsed.ok) {
          shouldRecover = true;
        } else {
          nextPinnedEntities = getPinnedEntityFromIds(
            parsed.state.items.map((item) => item.id),
            untitledLabel,
            workspaceObjects.entities,
            objectTypes,
            workspaceObjects.structures,
            objectTypeCollections,
          );
          setPinnedEntities(nextPinnedEntities);
        }
      }
    } catch {
      shouldRecover = true;
    }

    if (shouldRecover) {
      showMessage(t("lifecycle.storageRecovered"));
      setPinnedEntities([]);
    }
    setPinnedStorageReady(true);
  }, [
    showMessage,
    objectTypes,
    objectTypeCollections,
    sidebarStorageReady,
    storageReady,
    workspaceObjects.hydrationStatus,
    t,
    workspaceObjects.entities,
    workspaceObjects.structures,
  ]);

  const workspacePinnedState = React.useMemo(
    () =>
      serializeWorkspaceSidebarPinnedState(
        toWorkspaceSidebarPinSources(
          pinnedEntities,
          workspaceObjects.entities,
          objectTypes,
          workspaceObjects.structures,
        ),
      ),
    [
      objectTypes,
      pinnedEntities,
      workspaceObjects.entities,
      workspaceObjects.structures,
    ],
  );

  React.useEffect(() => {
    if (!storageReady || workspaceObjects.hydrationStatus !== "ready") return;
    const serialized = serializeWorkspaceObjectState(workspaceObjects);
    window.localStorage.setItem(WORKSPACE_OBJECT_STORAGE_KEY, serialized);
    window.localStorage.setItem(
      workspaceObjectsStorageKeyForSpace(spaceId),
      serialized,
    );
    window.localStorage.setItem(
      WORKSPACE_SPACES_STORAGE_KEY,
      serializeWorkspaceSpacesStorage({
        activeSpaceId: spaceId,
        spaces: spaces.map(({ id, name }) => ({ id, name })),
      }),
    );
    void getWorkspaceDatabase()
      .persistChangedSnapshot(workspaceObjects, undefined, { spaceId })
      .then((result) => {
        if (navigator.onLine || result.writtenKeys.length === 0) return;
        notifyWorkspaceSyncDiagnostics({
          conflictCount: 0,
          mediaUnavailableCount: workspaceObjects.entities.filter(
            (entity) =>
              entity.kind === "file" && entity.storageState !== "stored",
          ).length,
          pendingCount: result.writtenKeys.length,
          status: "offline-pending",
        });
      });
  }, [getWorkspaceDatabase, spaceId, spaces, storageReady, workspaceObjects]);

  React.useEffect(() => {
    if (!storageReady || workspaceObjects.hydrationStatus === "seed") return;
    let active = true;
    const adapter = getMediaStorageAdapter();
    const urls = getMediaUrlRegistry();
    for (const entity of workspaceObjects.entities) {
      if (
        entity.kind !== "file" ||
        !entity.assetId ||
        !entity.contentHash ||
        entity.previewUrl
      ) {
        continue;
      }
      const assetId = entity.assetId;
      void readMediaAssetBlob(adapter, {
        storageKey: `media:${entity.contentHash}`,
      }).then((result) => {
        if (!active || !result.ok) return;
        dispatchWorkspaceObjects({
          type: "updateEntity",
          id: entity.id,
          patch: {
            previewUrl: urls.create(assetId, result.value),
            storageState: "stored",
          },
        });
      });
    }
    return () => {
      active = false;
    };
  }, [
    storageReady,
    workspaceObjects.entities,
    workspaceObjects.hydrationStatus,
  ]);

  React.useEffect(() => {
    if (!sidebarStorageReady) return;
    window.localStorage.setItem(
      WORKSPACE_SIDEBAR_STORAGE_KEY,
      serializeWorkspaceSidebarState({
        collectionRecords: objectTypeCollections,
        customSections,
        objectTypeQueries,
      }),
    );
  }, [
    customSections,
    objectTypeCollections,
    objectTypeQueries,
    sidebarStorageReady,
  ]);

  React.useEffect(() => {
    if (!pinnedStorageReady) return;
    window.localStorage.setItem(
      WORKSPACE_SIDEBAR_PINNED_STORAGE_KEY,
      workspacePinnedState,
    );
  }, [pinnedStorageReady, workspacePinnedState]);

  React.useEffect(() => {
    if (
      !shouldStartTabStorageRestore({
        hydrationStatus: workspaceObjects.hydrationStatus,
        storageReady,
        tabStorageStarted: tabStorageStartedRef.current,
      })
    )
      return;
    tabStorageStartedRef.current = true;

    try {
      const raw = window.localStorage.getItem(WORKSPACE_TAB_STORAGE_KEY);
      const parsed = raw ? parseWorkspaceTabState(raw) : null;
      if (!parsed) {
        const route = parseWorkspaceRoute(
          window.location.pathname,
          window.location.search,
          locale,
          spaceId,
        );
        if (!route.targetId && !route.section) {
          setMainTabs(initialMainTabs);
          setMainValue(initialMainTabs[0]?.id ?? "");
          setActiveEntityId(initialMainTabs[0]?.id ?? null);
        }
        setTabStorageReady(true);
        return;
      }

      const restoredTabs = resolveRestoredWorkspaceTabs({
        initialMainTabs,
        initialSideTabs,
        objectTypes,
        parsed,
        specialSideTabs,
        structures: workspaceObjects.structures,
        t,
        workspaceEntities: workspaceObjects.entities,
      });

      if (restoredTabs.mainTabs.length > 0) {
        setMainTabs(restoredTabs.mainTabs);
        setMainValue(
          selectStoredTabValue(restoredTabs.mainTabs, parsed.main.value),
        );
        if (
          shouldClearActiveEntity(
            workspaceObjects.activeEntityId,
            restoredTabs.mainTabs,
          )
        ) {
          dispatchWorkspaceObjects({ type: "selectEntity", id: null });
        }
      }
      if (restoredTabs.sideTabs.length > 0) {
        setSideTabs(restoredTabs.sideTabs);
        setSideValue(
          selectStoredTabValue(restoredTabs.sideTabs, parsed.side.value),
        );
      }
    } catch {
      showMessage(t("lifecycle.storageRecovered"));
    }

    setTabStorageReady(true);
  }, [
    initialMainTabs,
    initialSideTabs,
    locale,
    objectTypes,
    showMessage,
    spaceId,
    specialSideTabs,
    storageReady,
    t,
    workspaceObjects.activeEntityId,
    workspaceObjects.entities,
    workspaceObjects.hydrationStatus,
    workspaceObjects.structures,
  ]);

  React.useEffect(() => {
    if (!tabStorageReady) return;
    window.localStorage.setItem(
      WORKSPACE_TAB_STORAGE_KEY,
      serializeWorkspaceTabState({
        mainTabs,
        mainValue,
        sideTabs,
        sideValue,
      }),
    );
  }, [mainTabs, mainValue, sideTabs, sideValue, tabStorageReady]);

  React.useEffect(() => {
    if (!pinnedStorageReady) return;
    setPinnedEntities((current) => {
      const nextPinnedEntities = getPinnedEntityFromIds(
        current.map((item) => item.id),
        t("lifecycle.untitled"),
        workspaceObjects.entities,
        objectTypes,
        workspaceObjects.structures,
        objectTypeCollections,
      );
      return arePinnedEntitySetsEquivalent(current, nextPinnedEntities)
        ? current
        : nextPinnedEntities;
    });
  }, [
    objectTypes,
    objectTypeCollections,
    pinnedStorageReady,
    t,
    workspaceObjects.entities,
    workspaceObjects.structures,
  ]);

  React.useEffect(() => {
    if (!sidebarStorageReady) return;
    setObjectTypeCollections((current) => {
      const next = pruneCollectionRecordsByObjectTypes(current, objectTypes);
      return areCollectionRecordMapsEquivalent(current, next) ? current : next;
    });
    setObjectTypeQueries((current) => {
      const next = pruneSidebarItemsByObjectTypes(current, objectTypes);
      return areStringArrayMapsEquivalent(current, next) ? current : next;
    });
  }, [objectTypes, sidebarStorageReady]);

  React.useEffect(() => {
    if (!workspaceObjects.error || workspaceObjects.draft) return;
    showMessage(t(`lifecycle.errors.${workspaceObjects.error}`));
  }, [showMessage, t, workspaceObjects.draft, workspaceObjects.error]);

  React.useEffect(() => {
    if (!workspaceObjects.structureError) return;
    showMessage(t("objectTypeStudio.operationFailed"));
  }, [showMessage, t, workspaceObjects.structureError]);

  React.useEffect(() => {
    if (!tabStorageReady) return;
    if (workspaceObjects.entities.length === 0) return;
    setMainTabs((current) => {
      const next = [...current];
      for (const entity of workspaceObjects.entities) {
        const structure = workspaceObjects.structures.find(
          (item) => item.id === entity.objectTypeId,
        );
        if (!structure) continue;
        const definition = objectTypeDefinitionById[structure.iconName];
        const label = entity.title.trim() || t("lifecycle.untitled");
        const existingIndex = next.findIndex((tab) => tab.id === entity.id);
        const tab: AppHeaderTab = {
          id: entity.id,
          label,
          icon: definition.icon,
          iconClassName: objectIconToneBadgeClass[structure.tone],
          preview: (
            <TabPreview
              eyebrow={
                structure.ownership === "custom"
                  ? structure.singularName
                  : t(`objectTypeStudio.objectTypes.${entity.objectTypeId}`)
              }
              title={label}
            />
          ),
        };
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], ...tab };
        }
      }
      return next;
    });
  }, [
    t,
    tabStorageReady,
    workspaceObjects.entities,
    workspaceObjects.structures,
  ]);

  React.useEffect(() => {
    if (!tabStorageReady) return;
    if (!workspaceObjects.activeEntityId) return;
    setMainValue(workspaceObjects.activeEntityId);
    setActiveEntityId(workspaceObjects.activeEntityId);
  }, [tabStorageReady, workspaceObjects.activeEntityId]);

  const ensureMainTab = React.useCallback((tab: AppHeaderTab) => {
    setMainTabs((current) =>
      current.some((item) => item.id === tab.id) ? current : [...current, tab],
    );
    setMainValue(tab.id);
  }, []);

  React.useEffect(() => {
    const activeEntity = workspaceObjects.entities.find(
      (entity) => entity.id === workspaceObjects.activeEntityId,
    );
    if (!activeEntity) return;
    const structure = workspaceObjects.structures.find(
      (item) => item.id === activeEntity.objectTypeId,
    );
    if (!structure) return;
    const definition = objectTypeDefinitionById[structure.iconName];
    const label = activeEntity.title.trim() || t("lifecycle.untitled");
    ensureMainTab({
      id: activeEntity.id,
      label,
      icon: definition.icon,
      iconClassName: objectIconToneBadgeClass[structure.tone],
      preview: (
        <TabPreview
          eyebrow={
            structure.ownership === "custom"
              ? structure.singularName
              : t(`objectTypeStudio.objectTypes.${activeEntity.objectTypeId}`)
          }
          title={label}
        />
      ),
    });
  }, [
    ensureMainTab,
    t,
    workspaceObjects.activeEntityId,
    workspaceObjects.entities,
    workspaceObjects.structures,
  ]);

  const openInSidePanel = React.useCallback((tab: AppHeaderTab) => {
    setSideTabs((current) => {
      if (current.some((item) => item.id === tab.id)) return current;
      return [...current, { ...tab, pinned: undefined, draggable: true }];
    });
    setSideValue(tab.id);
  }, []);

  const applyContextualPanelRoute = React.useCallback(
    (route: ReturnType<typeof parseWorkspaceRoute>) => {
      const contextualPanel = contextualPanelRouteState(route);
      const sideEntry =
        contextualPanel.entry === "explore"
          ? null
          : specialSideTabs[contextualPanel.entry];

      if (sideEntry) {
        openInSidePanel({
          id: contextualPanel.entry,
          ...sideEntry,
        });
      } else {
        setSideValue("explore");
      }

      if (compactDesktop) {
        if (!contextualPanel.visible) setRightOverlayOpen(false);
        return;
      }

      const panel = rightPanelRef.current;
      setRightCollapsed(!contextualPanel.visible);
      if (!panel) return;
      if (contextualPanel.visible && panel.isCollapsed()) panel.expand();
      if (!contextualPanel.visible && !panel.isCollapsed()) panel.collapse();
    },
    [
      compactDesktop,
      openInSidePanel,
      rightPanelRef,
      setRightCollapsed,
      setRightOverlayOpen,
      specialSideTabs,
    ],
  );

  const selectEntity = React.useCallback(
    (id: string) => {
      if (id === "trash") {
        dispatchWorkspaceObjects({ type: "selectEntity", id: null });
        setActiveEntityId(null);
        setActiveAction("trash");
        setMainValue("primary-action:trash");
        return;
      }

      const createdEntity = workspaceObjects.entities.find(
        (item) => item.id === id,
      );
      const entity = getPinnedEntityFromId(
        id,
        t("lifecycle.untitled"),
        workspaceObjects.entities,
        objectTypes,
        workspaceObjects.structures,
        objectTypeCollections,
      );

      if (createdEntity) {
        const structure = workspaceObjects.structures.find(
          (item) => item.id === createdEntity.objectTypeId,
        );
        if (structure) {
          const definition = objectTypeDefinitionById[structure.iconName];
          const label = createdEntity.title.trim() || t("lifecycle.untitled");
          ensureMainTab({
            id: createdEntity.id,
            label,
            icon: definition.icon,
            iconClassName: objectIconToneBadgeClass[structure.tone],
            preview: (
              <TabPreview
                eyebrow={
                  structure.ownership === "custom"
                    ? structure.singularName
                    : t(
                        `objectTypeStudio.objectTypes.${createdEntity.objectTypeId}`,
                      )
                }
                title={label}
              />
            ),
          });
        }
        dispatchWorkspaceObjects({ type: "selectEntity", id });
        setMainValue(id);
        setActiveEntityId(id);
        setActiveAction(undefined);
        return;
      }

      if (!entity) {
        if (mainTabs.some((tab) => tab.id === id)) {
          dispatchWorkspaceObjects({ type: "selectEntity", id: null });
          setActiveEntityId(id);
          setActiveAction(undefined);
        }
        return;
      }

      dispatchWorkspaceObjects({ type: "selectEntity", id: null });
      setActiveEntityId(id);
      setActiveAction(undefined);

      ensureMainTab({
        id: entity.id,
        label: entity.label,
        icon: entity.icon,
        iconClassName: objectIconToneBadgeClass[entity.tone],
        preview: (
          <TabPreview eyebrow={t("tabs.preview.object")} title={entity.label} />
        ),
      });
    },
    [
      ensureMainTab,
      mainTabs,
      objectTypes,
      objectTypeCollections,
      workspaceObjects.entities,
      workspaceObjects.structures,
      t,
    ],
  );

  const applyWorkspaceRoute = React.useCallback(
    (route: ReturnType<typeof parseWorkspaceRoute>) => {
      const routeSpace = spaces.find(
        (space) =>
          space.id === route.spaceId ||
          workspaceRouteId(space.id) === route.spaceId,
      );
      if (routeSpace && routeSpace.id !== spaceId) {
        switchSpace(routeSpace.id);
      }

      if (
        route.section === "calendar" ||
        route.section === "search" ||
        route.section === "explore" ||
        route.section === "trash"
      ) {
        setActiveEntityId(null);
        setActiveAction(route.section);
        setMainValue(`primary-action:${route.section}`);
        applyContextualPanelRoute(route);
        return;
      }

      if (route.targetId) {
        const routeEntity = workspaceObjects.entities.find(
          (entity) =>
            entity.id === route.targetId ||
            workspaceRouteId(entity.id) === route.targetId,
        );
        const routeObjectType = objectTypes.find(
          (objectType) =>
            objectType.id === route.targetId ||
            workspaceRouteId(objectType.id) === route.targetId,
        );
        selectEntity(routeEntity?.id ?? routeObjectType?.id ?? route.targetId);
      }
      applyContextualPanelRoute(route);
    },
    [
      applyContextualPanelRoute,
      objectTypes,
      selectEntity,
      spaceId,
      spaces,
      switchSpace,
      workspaceObjects.entities,
    ],
  );

  React.useEffect(() => {
    if (
      !storageReady ||
      workspaceObjects.hydrationStatus !== "ready" ||
      !tabStorageReady
    ) {
      return;
    }

    const route = parseWorkspaceRoute(
      window.location.pathname,
      window.location.search,
      locale,
      spaceId,
    );
    const routeKey = `${window.location.pathname}${window.location.search}`;
    if (lastRouteRef.current === routeKey) return;
    lastRouteRef.current = routeKey;
    applyWorkspaceRoute(route);
    routeInitializedRef.current = true;

    const handlePopState = () => {
      const nextRouteKey = `${window.location.pathname}${window.location.search}`;
      lastRouteRef.current = nextRouteKey;
      applyWorkspaceRoute(
        parseWorkspaceRoute(
          window.location.pathname,
          window.location.search,
          locale,
          spaceId,
        ),
      );
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    applyWorkspaceRoute,
    locale,
    spaceId,
    storageReady,
    tabStorageReady,
    workspaceObjects.hydrationStatus,
  ]);

  React.useEffect(() => {
    if (!routeInitializedRef.current || !tabStorageReady) return;

    const section: WorkspaceSection | null =
      activeAction === "calendar" ||
      activeAction === "search" ||
      activeAction === "explore" ||
      activeAction === "trash"
        ? activeAction
        : null;
    const targetId =
      section || !activeEntityId ? null : workspaceRouteId(activeEntityId);
    const nextPath = workspaceRoutePath({
      locale,
      spaceId: workspaceRouteId(spaceId),
      targetId,
      section,
    });
    if (lastRouteRef.current === nextPath) return;

    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath === nextPath) {
      lastRouteRef.current = nextPath;
      return;
    }

    window.history.pushState(null, "", nextPath);
    lastRouteRef.current = nextPath;
  }, [activeAction, activeEntityId, locale, spaceId, tabStorageReady]);

  const createWorkspaceEntity = React.useCallback(
    (objectTypeId: string, _objectTypeLabel?: string) => {
      setActiveAction(undefined);
      dispatchWorkspaceObjects({ type: "beginCreate", objectTypeId });
      if (!getCreationFlow(objectTypeId, workspaceObjects.structures)) {
        showMessage(t("lifecycle.errors.unsupported-object-type"));
      }
    },
    [showMessage, t, workspaceObjects.structures],
  );

  const createWorkspaceObjectReference = React.useCallback(
    (objectTypeId: string, title: string) => {
      const label = title.trim();
      const flow = getCreationFlow(objectTypeId, workspaceObjects.structures);
      if (!label || !flow || flow === "file" || flow === "url") {
        showMessage(t("lifecycle.errors.unsupported-object-type"));
        return null;
      }
      const id = `created-${objectTypeId}-${workspaceObjects.nextId}`;
      dispatchWorkspaceObjects({
        type: "createEditorObjectReference",
        id,
        objectTypeId,
        title: label,
      });
      return { id, label };
    },
    [showMessage, t, workspaceObjects.nextId, workspaceObjects.structures],
  );

  const createWorkspaceTag = React.useCallback(
    (title: string) => {
      const id = `created-tag-${workspaceObjects.nextId}`;
      dispatchWorkspaceObjects({ type: "createTag", id, title: title.trim() });
      return id;
    },
    [workspaceObjects.nextId],
  );

  const createOrReuseWorkspaceTag = React.useCallback(
    (title: string) => {
      const label = title.trim();
      if (!label) return null;
      const normalized = normalizeWorkspaceTagTitle(label);
      const existing = workspaceObjects.entities.find(
        (entity) =>
          entity.kind === "tag" &&
          normalizeWorkspaceTagTitle(entity.title || entity.id) === normalized,
      );
      if (existing) {
        return { id: existing.id, label: existing.title.trim() || existing.id };
      }
      const id = `created-tag-${workspaceObjects.nextId}`;
      dispatchWorkspaceObjects({ type: "createTag", id, title: label });
      return { id, label };
    },
    [workspaceObjects.entities, workspaceObjects.nextId],
  );

  const createWorkspaceEntityFromPreset = React.useCallback(
    (presetId: string) => {
      const objectTypeId = crypto.randomUUID();
      setActiveAction(undefined);
      dispatchWorkspaceObjects({
        type: "createStructureFromPreset",
        id: objectTypeId,
        presetId,
      });
      dispatchWorkspaceObjects({ type: "beginCreate", objectTypeId });
    },
    [],
  );

  const createOrAppendDailyNote = React.useCallback(
    (date: string, appendText?: string, template?: string) => {
      setActiveAction(undefined);
      dispatchWorkspaceObjects({
        type: "createOrAppendDailyNote",
        appendText,
        date,
        spaceId,
        template,
      });
    },
    [spaceId],
  );

  const createWorkspacePage = React.useCallback((title: string) => {
    dispatchWorkspaceObjects({
      type: "createDocument",
      objectTypeId: "page",
      title,
    });
  }, []);

  const openTodayFromCommand = React.useCallback(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "America/Sao_Paulo",
      year: "numeric",
    });
    createOrAppendDailyNote(formatter.format(new Date()));
  }, [createOrAppendDailyNote]);

  const closeCurrentMainTab = React.useCallback(() => {
    setMainTabs((current) => {
      if (current.length <= 1) return current;
      const index = Math.max(
        current.findIndex((tab) => tab.id === mainValue),
        0,
      );
      const activeTab = current[index];
      if (!activeTab || activeTab.pinned) {
        showMessage(t("tabs.pinnedCloseBlocked"));
        return current;
      }
      const next = current.filter((tab) => tab.id !== activeTab.id);
      const fallback = next[index] ?? next[index - 1] ?? next[0];
      if (fallback) setMainValue(fallback.id);
      return next;
    });
  }, [mainValue, showMessage, t]);

  const toggleWorkspaceTheme = React.useCallback(() => {
    document.documentElement.classList.toggle("dark");
  }, []);

  React.useEffect(() => {
    const platform: ShortcutPlatform = navigator.platform
      .toLocaleLowerCase()
      .includes("mac")
      ? "mac"
      : "windows";
    const structures = selectCreatableStructures(workspaceObjects.structures);
    const runtime = createWorkspaceCommandRuntime({
      locale,
      t,
      actions: {
        openPalette: () => setCommandPaletteOpen(true),
        openNewContent: () =>
          createWorkspaceEntity("page", t("objectTypeStudio.objectTypes.page")),
        openExtendedSearch: () => setExtendedSearchOpen(true),
        openFindInPage: () => setFindInPageOpen(true),
        openShortcuts: () => setShortcutBrowserOpen(true),
        focusSidebarSearch: () => setSideSearchOpen(true),
        openSettings: () => showMessage(t("footer.settings")),
        navigateHome: () => {
          setActiveAction(undefined);
          selectEntity("page");
        },
        navigateBack: () => showMessage(t("actions.back")),
        navigateForward: () => showMessage(t("actions.forward")),
        navigateToday: openTodayFromCommand,
        openExplore: () => {
          setActiveAction("explore");
          setActiveEntityId(null);
          setMainValue("primary-action:explore");
        },
        toggleSidebar: toggleLeft,
        toggleSidePanel: toggleRight,
        toggleFocusMode: () => setFocusMode((current) => !current),
        toggleTheme: toggleWorkspaceTheme,
        closeCurrentTab: closeCurrentMainTab,
        createTask: () =>
          createWorkspaceEntity("task", t("objectTypeStudio.objectTypes.task")),
        setCalendarView: (view) => {
          const keyByView = {
            day: "commands.calendar.day.label",
            month: "commands.calendar.month.label",
            "three-day": "commands.calendar.threeDay.label",
            week: "commands.calendar.week.label",
          } as const;
          showMessage(t(keyByView[view]));
        },
        moveCalendar: (direction) => {
          const keyByDirection = {
            next: "commands.calendar.next.label",
            previous: "commands.calendar.previous.label",
          } as const;
          showMessage(t(keyByDirection[direction]));
        },
        createObject: createWorkspaceEntity,
      },
      state: {
        canNavigateToday: true,
        canUseExtendedSearch: true,
        canFindInPage: Boolean(activeEntityId),
        canOpenSettings: true,
        canToggleTheme: true,
        canToggleTabsBar: false,
        canCloseCurrentTab:
          mainTabs.length > 1 &&
          Boolean(mainTabs.find((tab) => tab.id === mainValue && !tab.pinned)),
        canCreateTask: structures.some((structure) => structure.id === "task"),
        calendarActive: activeAction === "calendar",
        structures: structures.map((structure) => ({
          enabled: true,
          id: structure.id,
          label: structure.singularName,
        })),
      },
    });
    const commands = projectWorkspaceCommands(runtime);
    const handleKeyDown = (event: KeyboardEvent) => {
      routeWorkspaceShortcut({
        runtime,
        platform,
        event,
        claims: commands.flatMap((command) =>
          command.shortcuts.length > 0
            ? [
                {
                  id: command.id,
                  priority: command.category === "calendar" ? "page" : "global",
                  shortcuts: command.shortcuts,
                  commandId: command.id,
                },
              ]
            : [],
        ),
      });
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [
    activeAction,
    activeEntityId,
    closeCurrentMainTab,
    createWorkspaceEntity,
    locale,
    mainTabs,
    mainValue,
    openTodayFromCommand,
    selectEntity,
    showMessage,
    t,
    toggleLeft,
    toggleRight,
    toggleWorkspaceTheme,
    workspaceObjects.structures,
  ]);

  const cancelWorkspaceDraft = React.useCallback(() => {
    dispatchWorkspaceObjects({ type: "cancelDraft" });
  }, []);

  const commitWorkspaceTask = React.useCallback(
    (title: string) => {
      if (title.trim()) {
        const id = `created-task-${workspaceObjects.nextId}`;
        setCreatedTaskId(id);
        if (taskToastTimerRef.current) clearTimeout(taskToastTimerRef.current);
        taskToastTimerRef.current = setTimeout(() => {
          setCreatedTaskId(null);
          taskToastTimerRef.current = null;
        }, 5000);
      }
      dispatchWorkspaceObjects({ type: "commitTask", title });
    },
    [workspaceObjects.nextId],
  );

  const commitWorkspaceUrl = React.useCallback((url: string) => {
    dispatchWorkspaceObjects({ type: "commitUrl", url });
  }, []);

  const commitWorkspaceFile = React.useCallback(
    (file: File) => {
      void writeMediaAsset(
        getMediaStorageAdapter(),
        workspaceObjects.draft?.objectTypeId ?? "file",
        { blob: file, fileName: file.name, mimeType: file.type },
      ).then((result) => {
        if (!result.ok) {
          showMessage(mediaStorageErrorMessage(result.error, t, locale));
          return;
        }
        dispatchWorkspaceObjects({
          type: "commitFile",
          assetId: result.value.id,
          contentHash: result.value.hash,
          fileName: file.name,
          mimeType: file.type,
          previewUrl: getMediaUrlRegistry().create(result.value.id, file),
          size: file.size,
          storageState: result.value.state,
        });
      });
    },
    [locale, showMessage, t, workspaceObjects.draft?.objectTypeId],
  );

  const importWorkspaceFiles = React.useCallback(
    async (objectTypeId: string, files: File[]) => {
      const flow = getCreationFlow(objectTypeId, workspaceObjects.structures);
      if (!flow) {
        showMessage(t("lifecycle.errors.unsupported-object-type"));
        return;
      }

      let accepted = 0;
      let rejected = 0;
      let firstMediaError: MediaStorageError | null = null;
      const importFile = async (file: File) => {
        let text = "";
        if (flow !== "file") {
          try {
            text = await file.text();
          } catch {
            return { accepted: false };
          }
        }
        const importError = getWorkspaceImportError(
          objectTypeId,
          file.type,
          file.name,
          text,
          workspaceObjects.structures,
        );
        if (importError) {
          return { accepted: false };
        }
        if (flow === "file") {
          if (!acceptsFileForType(objectTypeId, file.type, file.name)) {
            return { accepted: false };
          }
          const result = await writeMediaAsset(
            getMediaStorageAdapter(),
            objectTypeId,
            { blob: file, fileName: file.name, mimeType: file.type },
          );
          if (!result.ok) {
            return { accepted: false, error: result.error };
          }
          dispatchWorkspaceObjects({
            type: "importFile",
            assetId: result.value.id,
            contentHash: result.value.hash,
            fileName: file.name,
            mimeType: file.type,
            objectTypeId,
            previewUrl: getMediaUrlRegistry().create(result.value.id, file),
            size: file.size,
            storageState: result.value.state,
            text,
          });
          return { accepted: true };
        }
        dispatchWorkspaceObjects({
          type: "importFile",
          fileName: file.name,
          mimeType: file.type,
          objectTypeId,
          size: file.size,
          text,
        });
        return { accepted: true };
      };
      for (const file of files) {
        const result = await importFile(file);
        if (result.accepted) {
          accepted += 1;
        } else {
          rejected += 1;
          firstMediaError ??= result.error ?? null;
        }
      }

      if (accepted > 0 && rejected > 0) {
        showMessage(
          t("objectTypeOverview.importPartial", { accepted, rejected }),
        );
      } else if (accepted > 0) {
        showMessage(
          t("objectTypeOverview.importComplete", { count: accepted }),
        );
      } else if (firstMediaError) {
        showMessage(mediaStorageErrorMessage(firstMediaError, t, locale));
      } else {
        showMessage(t("objectTypeOverview.importRejected"));
      }
    },
    [locale, showMessage, t, workspaceObjects.structures],
  );

  const updateWorkspaceEntity = React.useCallback(
    (id: string, patch: Record<string, unknown>) => {
      if (patch.file instanceof File) {
        const { file, ...rest } = patch;
        const entity = workspaceObjects.entities.find((item) => item.id === id);
        void writeMediaAsset(
          getMediaStorageAdapter(),
          entity?.objectTypeId ?? "file",
          { blob: file, fileName: file.name, mimeType: file.type },
        ).then((result) => {
          if (!result.ok) {
            showMessage(mediaStorageErrorMessage(result.error, t, locale));
            return;
          }
          dispatchWorkspaceObjects({
            type: "updateEntity",
            id,
            patch: {
              ...rest,
              assetId: result.value.id,
              contentHash: result.value.hash,
              fileName: file.name,
              mimeType: file.type,
              previewUrl: getMediaUrlRegistry().create(result.value.id, file),
              size: file.size,
              storageState: result.value.state,
            },
          });
        });
        return;
      }
      dispatchWorkspaceObjects({ type: "updateEntity", id, patch });
    },
    [locale, showMessage, t, workspaceObjects.entities],
  );

  const setWorkspaceEntityPropertyValue = React.useCallback(
    (id: string, propertyId: string, value: unknown) => {
      dispatchWorkspaceObjects({
        type: "setPropertyValue",
        id,
        propertyId,
        value,
      });
    },
    [],
  );

  const setLinkedEntityPropertyValue = React.useCallback(
    (id: string, propertyId: string, value: unknown) => {
      dispatchWorkspaceObjects({
        type: "setLinkedEntityPropertyValue",
        id,
        propertyId,
        value,
      });
    },
    [],
  );

  const removeWorkspaceEntityPropertyValue = React.useCallback(
    (id: string, propertyId: string) => {
      dispatchWorkspaceObjects({ type: "removePropertyValue", id, propertyId });
    },
    [],
  );

  const changeWorkspaceEntityType = React.useCallback(
    (
      id: string,
      objectTypeId: string,
      propertyValues?: Readonly<Record<string, unknown>>,
    ) => {
      dispatchWorkspaceObjects({
        type: "changeEntityType",
        id,
        objectTypeId,
        propertyValues,
      });
    },
    [],
  );

  const deleteWorkspaceEntity = React.useCallback(
    (id: string) => {
      const entity = workspaceObjects.entities.find((item) => item.id === id);
      if (!isWorkspaceEntityDeletionAccepted(workspaceObjects, id)) {
        dispatchWorkspaceObjects({ type: "deleteEntity", id });
        return;
      }
      const remainingEntities = workspaceObjects.entities.filter(
        (item) => item.id !== id,
      );
      const fallbackEntity = remainingEntities.at(-1);
      const fallbackTab = resolveWorkspaceEntityTab({
        id: fallbackEntity?.id ?? entity?.objectTypeId ?? "",
        objectTypes,
        structures: workspaceObjects.structures,
        t,
        workspaceEntities: remainingEntities,
      });
      dispatchWorkspaceObjects({ type: "deleteEntity", id, spaceId });
      setMainTabs((current) => current.filter((tab) => tab.id !== id));
      setSideTabs((current) => current.filter((tab) => tab.id !== id));
      if (fallbackTab) {
        ensureMainTab(fallbackTab);
      }
      if (mainValue === id) setMainValue(fallbackTab?.id ?? "");
      setActiveEntityId(fallbackEntity?.id ?? fallbackTab?.id ?? null);
      setActiveAction(undefined);
      if (entity?.kind !== "file" || !entity.assetId || !entity.contentHash)
        return;
      const references = remainingEntities.flatMap((item) =>
        item.kind === "file" && item.assetId
          ? [
              {
                assetId: item.assetId,
                ownerId: item.id,
                ownerKind: "object" as const,
              },
            ]
          : [],
      );
      void garbageCollectMediaAssets(
        getMediaStorageAdapter(),
        [{ id: entity.assetId, storageKey: `media:${entity.contentHash}` }],
        references,
      ).then((deletedIds) => {
        for (const deletedId of deletedIds)
          getMediaUrlRegistry().revoke(deletedId);
      });
    },
    [
      ensureMainTab,
      mainValue,
      objectTypes,
      spaceId,
      t,
      workspaceObjects,
      workspaceObjects.entities,
      workspaceObjects.structures,
    ],
  );

  const duplicateWorkspaceEntity = React.useCallback((id: string) => {
    dispatchWorkspaceObjects({ type: "duplicateEntity", id });
  }, []);

  const restoreTrashItem = React.useCallback(
    (id: string) => {
      dispatchWorkspaceObjects({ type: "restoreEntity", id });
      selectEntity(id);
      showMessage(t("sidebarUtilities.restoreToast"));
    },
    [selectEntity, showMessage, t],
  );

  const purgeTrashItem = React.useCallback(
    (id: string) => {
      dispatchWorkspaceObjects({
        type: "purgeEntity",
        id,
        purgedAt: new Date().toISOString(),
      });
      setMainTabs((current) => current.filter((tab) => tab.id !== id));
      setSideTabs((current) => current.filter((tab) => tab.id !== id));
      setPinnedEntities((current) =>
        current.filter((entity) => entity.id !== id),
      );
      if (mainValue === id) setMainValue("");
      if (sideValue === id) setSideValue("");
      if (activeEntityId === id) setActiveEntityId(null);
      showMessage(t("sidebarUtilities.deleteForeverToast"));
    },
    [activeEntityId, mainValue, showMessage, sideValue, t],
  );

  const emptyTrash = React.useCallback(() => {
    const ids = trashItems.map((item) => item.id);
    dispatchWorkspaceObjects({
      type: "emptyTrash",
      spaceId,
      purgedAt: new Date().toISOString(),
    });
    setMainTabs((current) => current.filter((tab) => !ids.includes(tab.id)));
    setSideTabs((current) => current.filter((tab) => !ids.includes(tab.id)));
    setPinnedEntities((current) =>
      current.filter((entity) => !ids.includes(entity.id)),
    );
    if (ids.includes(mainValue)) setMainValue("");
    if (ids.includes(sideValue)) setSideValue("");
    if (activeEntityId && ids.includes(activeEntityId)) {
      setActiveEntityId(null);
    }
    showMessage(t("sidebarUtilities.emptyTrashToast"));
  }, [
    activeEntityId,
    mainValue,
    showMessage,
    sideValue,
    spaceId,
    t,
    trashItems,
  ]);

  const createWorkspaceStructure = React.useCallback(
    (input: CreateStructureInput) => {
      const id = crypto.randomUUID();
      dispatchWorkspaceObjects({ type: "createStructure", id, input });
      return id;
    },
    [],
  );

  const createWorkspaceStructureFromPreset = React.useCallback(
    (presetId: string) => {
      const id = crypto.randomUUID();
      dispatchWorkspaceObjects({
        type: "createStructureFromPreset",
        id,
        presetId,
      });
      return id;
    },
    [],
  );

  const updateWorkspaceStructure = React.useCallback(
    (
      id: string,
      input: {
        singularName: string;
        pluralName: string;
        iconName: ObjectIconName;
        tone: ObjectIconTone;
      },
    ) => {
      dispatchWorkspaceObjects({
        type: "renameStructure",
        id,
        singularName: input.singularName,
        pluralName: input.pluralName,
      });
      dispatchWorkspaceObjects({
        type: "updateStructureAppearance",
        id,
        iconName: input.iconName,
        tone: input.tone,
      });
    },
    [],
  );

  const updateWorkspaceStructurePresentation = React.useCallback(
    (id: string, presentation: StructurePresentation) => {
      dispatchWorkspaceObjects({
        type: "updateStructurePresentation",
        id,
        presentation,
      });
    },
    [],
  );

  const updateWorkspacePropertyNumberPresentation = React.useCallback(
    (
      structureId: string,
      propertyId: string,
      presentation: NumberPresentation,
    ) => {
      const structure = workspaceObjects.structures.find(
        (candidate) => candidate.id === structureId,
      );
      if (!structure) return;
      const propertyDefinitions = structure.propertyDefinitions.map(
        (definition): PropertyDefinition =>
          definition.id === propertyId && definition.valueType === "number"
            ? { ...definition, numberPresentation: presentation }
            : definition,
      );
      dispatchWorkspaceObjects({
        type: "replaceStructureSchema",
        id: structureId,
        propertyDefinitions,
      });
    },
    [workspaceObjects.structures],
  );

  const replaceWorkspaceStructureSchema = React.useCallback(
    (
      structureId: string,
      propertyDefinitions: readonly PropertyDefinition[],
    ) => {
      dispatchWorkspaceObjects({
        type: "replaceStructureSchema",
        id: structureId,
        propertyDefinitions,
      });
    },
    [],
  );

  const deleteWorkspaceStructure = React.useCallback((id: string) => {
    dispatchWorkspaceObjects({ type: "deleteStructure", id });
  }, []);

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      spaces,
      spaceId,
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      focusMode,
      sideSearchOpen,
      mainSearchOpen,
      commandPaletteOpen,
      extendedSearchOpen,
      findInPageOpen,
      shortcutBrowserOpen,
      activeAction,
      activeEntityId,
      pinnedEntities,
      availablePinnedEntities,
      objectTypes,
      structures: workspaceObjects.structures,
      createdEntities: workspaceObjects.entities,
      trashItems,
      workspaceDraft: workspaceObjects.draft,
      workspaceError: workspaceObjects.error,
      customSections,
      objectTypeCollections,
      objectTypeQueries,
      setSpaces,
      createSpace,
      deleteSpace,
      renameSpace,
      switchSpace,
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      setSideSearchOpen,
      setMainSearchOpen,
      setCommandPaletteOpen,
      setExtendedSearchOpen,
      setFindInPageOpen,
      setShortcutBrowserOpen,
      setActiveAction,
      setActiveEntityId,
      setPinnedEntities,
      setCustomSections,
      setObjectTypeCollections,
      setObjectTypeQueries,
      showMessage,
      createWorkspaceStructure,
      createWorkspaceStructureFromPreset,
      updateWorkspaceStructure,
      updateWorkspacePropertyNumberPresentation,
      replaceWorkspaceStructureSchema,
      updateWorkspaceStructurePresentation,
      deleteWorkspaceStructure,
      createWorkspaceEntity,
      createWorkspaceObjectReference,
      createWorkspaceTag,
      createOrReuseWorkspaceTag,
      createWorkspaceEntityFromPreset,
      createOrAppendDailyNote,
      createWorkspacePage,
      importWorkspaceFiles,
      cancelWorkspaceDraft,
      commitWorkspaceFile,
      commitWorkspaceTask,
      commitWorkspaceUrl,
      setWorkspaceEntityPropertyValue,
      setLinkedEntityPropertyValue,
      removeWorkspaceEntityPropertyValue,
      updateWorkspaceEntity,
      changeWorkspaceEntityType,
      deleteWorkspaceEntity,
      emptyTrash,
      duplicateWorkspaceEntity,
      purgeTrashItem,
      restoreTrashItem,
      selectEntity,
      openInSidePanel,
    }),
    [
      spaces,
      spaceId,
      focusMode,
      mainTabs,
      mainValue,
      message,
      showMessage,
      sideSearchOpen,
      mainSearchOpen,
      commandPaletteOpen,
      extendedSearchOpen,
      findInPageOpen,
      shortcutBrowserOpen,
      sideTabs,
      sideValue,
      activeAction,
      activeEntityId,
      pinnedEntities,
      availablePinnedEntities,
      objectTypes,
      trashItems,
      workspaceObjects.structures,
      workspaceObjects.draft,
      workspaceObjects.entities,
      workspaceObjects.error,
      customSections,
      objectTypeCollections,
      objectTypeQueries,
      createSpace,
      deleteSpace,
      renameSpace,
      switchSpace,
      selectEntity,
      createWorkspaceStructure,
      createWorkspaceStructureFromPreset,
      updateWorkspaceStructure,
      updateWorkspacePropertyNumberPresentation,
      replaceWorkspaceStructureSchema,
      updateWorkspaceStructurePresentation,
      deleteWorkspaceStructure,
      createWorkspaceEntity,
      createWorkspaceObjectReference,
      createWorkspaceTag,
      createOrReuseWorkspaceTag,
      createWorkspaceEntityFromPreset,
      createOrAppendDailyNote,
      createWorkspacePage,
      importWorkspaceFiles,
      cancelWorkspaceDraft,
      commitWorkspaceFile,
      commitWorkspaceTask,
      commitWorkspaceUrl,
      setWorkspaceEntityPropertyValue,
      setLinkedEntityPropertyValue,
      removeWorkspaceEntityPropertyValue,
      updateWorkspaceEntity,
      changeWorkspaceEntityType,
      deleteWorkspaceEntity,
      emptyTrash,
      duplicateWorkspaceEntity,
      purgeTrashItem,
      restoreTrashItem,
      openInSidePanel,
    ],
  );

  return (
    <TooltipProvider delay={200}>
      <WorkspaceContext.Provider value={value}>
        {children}
        {sideSearchOpen && <SidePanelSearchOverlay />}
        {mainSearchOpen && <MainTabSearchOverlay />}
        <WorkspaceCommandPalette />
        <WorkspaceExtendedSearchDialog />
        <WorkspaceFindInPageDialog />
        <WorkspaceShortcutBrowser />
        {workspaceObjects.draft && <WorkspaceCreationDialog />}
        {createdTaskId && (
          <div
            data-slot="workspace-task-created"
            role="status"
            className="fixed right-4 bottom-20 z-[130] flex items-center gap-3 rounded-xl border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg"
          >
            <span>{t("lifecycle.task.created")}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                selectEntity(createdTaskId);
                setCreatedTaskId(null);
              }}
            >
              {t("lifecycle.task.open")}
            </Button>
          </div>
        )}
        {message && (
          <div
            data-slot="workspace-message"
            role="status"
            className="pointer-events-none fixed left-1/2 top-14 z-[100] -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
          >
            {message}
          </div>
        )}
      </WorkspaceContext.Provider>
    </TooltipProvider>
  );
}

function getDraftAccept(draft: WorkspaceDraft): string | undefined {
  if (draft.objectTypeId === "image") return "image/*";
  if (draft.objectTypeId === "pdf") return "application/pdf,.pdf";
  if (draft.objectTypeId === "audio") return "audio/*";
  return undefined;
}

function WorkspaceCommandPalette() {
  const t = useTranslations("workspace");
  const {
    activeAction,
    activeEntityId,
    commandPaletteOpen,
    createOrAppendDailyNote,
    createWorkspaceEntity,
    createdEntities,
    mainTabs,
    mainValue,
    selectEntity,
    setActiveAction,
    setActiveEntityId,
    setCommandPaletteOpen,
    setExtendedSearchOpen,
    setFindInPageOpen,
    setFocusMode,
    setMainTabs,
    setMainValue,
    setShortcutBrowserOpen,
    setSideSearchOpen,
    showMessage,
    structures,
  } = useWorkspace();
  const { toggleLeft, toggleRight } = useAppShell();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const platform: ShortcutPlatform =
    typeof navigator !== "undefined" &&
    navigator.platform.toLocaleLowerCase().includes("mac")
      ? "mac"
      : "windows";
  const creatableStructures = React.useMemo(
    () => selectCreatableStructures(structures),
    [structures],
  );
  const openToday = React.useCallback(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "America/Sao_Paulo",
      year: "numeric",
    });
    createOrAppendDailyNote(formatter.format(new Date()));
  }, [createOrAppendDailyNote]);
  const closeTab = React.useCallback(() => {
    setMainTabs((current) => {
      if (current.length <= 1) return current;
      const index = Math.max(
        current.findIndex((tab) => tab.id === mainValue),
        0,
      );
      const activeTab = current[index];
      if (!activeTab || activeTab.pinned) {
        showMessage(t("tabs.pinnedCloseBlocked"));
        return current;
      }
      const next = current.filter((tab) => tab.id !== activeTab.id);
      const fallback = next[index] ?? next[index - 1] ?? next[0];
      if (fallback) setMainValue(fallback.id);
      return next;
    });
  }, [mainValue, setMainTabs, setMainValue, showMessage, t]);

  const runtime = React.useMemo(
    () =>
      createWorkspaceCommandRuntime({
        locale: "workspace",
        t,
        actions: {
          openPalette: () => setCommandPaletteOpen(true),
          openNewContent: () =>
            createWorkspaceEntity(
              "page",
              t("objectTypeStudio.objectTypes.page"),
            ),
          openExtendedSearch: () => setExtendedSearchOpen(true),
          openFindInPage: () => setFindInPageOpen(true),
          openShortcuts: () => setShortcutBrowserOpen(true),
          focusSidebarSearch: () => {
            setSideSearchOpen(true);
          },
          openSettings: () => showMessage(t("footer.settings")),
          navigateHome: () => {
            setActiveAction(undefined);
            selectEntity("page");
          },
          navigateBack: () => showMessage(t("actions.back")),
          navigateForward: () => showMessage(t("actions.forward")),
          navigateToday: openToday,
          openExplore: () => {
            setActiveAction("explore");
            setActiveEntityId(null);
            setMainValue("primary-action:explore");
          },
          toggleSidebar: toggleLeft,
          toggleSidePanel: toggleRight,
          toggleFocusMode: () => setFocusMode((current) => !current),
          toggleTheme: () => document.documentElement.classList.toggle("dark"),
          closeCurrentTab: closeTab,
          createTask: () =>
            createWorkspaceEntity(
              "task",
              t("objectTypeStudio.objectTypes.task"),
            ),
          setCalendarView: (view) =>
            showMessage(
              t(
                {
                  day: "commands.calendar.day.label",
                  month: "commands.calendar.month.label",
                  "three-day": "commands.calendar.threeDay.label",
                  week: "commands.calendar.week.label",
                }[view],
              ),
            ),
          moveCalendar: (direction) =>
            showMessage(
              t(
                {
                  next: "commands.calendar.next.label",
                  previous: "commands.calendar.previous.label",
                }[direction],
              ),
            ),
          createObject: createWorkspaceEntity,
        },
        state: {
          canNavigateToday: true,
          canUseExtendedSearch: true,
          canFindInPage: Boolean(activeEntityId),
          canOpenSettings: true,
          canToggleTheme: true,
          canToggleTabsBar: false,
          canCloseCurrentTab:
            mainTabs.length > 1 &&
            Boolean(
              mainTabs.find((tab) => tab.id === mainValue && !tab.pinned),
            ),
          canCreateTask: creatableStructures.some(
            (structure) => structure.id === "task",
          ),
          calendarActive: activeAction === "calendar",
          structures: creatableStructures.map((structure) => ({
            enabled: true,
            id: structure.id,
            label: structure.singularName,
          })),
        },
      }),
    [
      activeAction,
      activeEntityId,
      closeTab,
      createWorkspaceEntity,
      creatableStructures,
      mainTabs,
      mainValue,
      openToday,
      selectEntity,
      setActiveAction,
      setActiveEntityId,
      setCommandPaletteOpen,
      setExtendedSearchOpen,
      setFindInPageOpen,
      setFocusMode,
      setMainValue,
      setShortcutBrowserOpen,
      setSideSearchOpen,
      showMessage,
      t,
      toggleLeft,
      toggleRight,
    ],
  );
  const commands = React.useMemo(
    () =>
      projectWorkspaceCommands(runtime).filter(
        (command) => command.id !== "workspace.openPalette",
      ),
    [runtime],
  );
  const searchIndex = React.useMemo(
    () => buildWorkspaceSearchIndex(createdEntities),
    [createdEntities],
  );
  const searchResults = React.useMemo(
    () =>
      deferredQuery.trim()
        ? searchWorkspaceIndex(searchIndex, deferredQuery, "all").slice(0, 8)
        : [],
    [deferredQuery, searchIndex],
  );

  function handleOpenChange(open: boolean) {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setCommandPaletteOpen(true);
      return;
    }
    setCommandPaletteOpen(false);
    setQuery("");
    window.requestAnimationFrame(() => {
      if (restoreFocusRef.current?.isConnected) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      restoreFocusRef.current = null;
    });
  }

  function runCommand(command: (typeof commands)[number]) {
    command.execute();
    handleOpenChange(false);
  }

  function openSearchResult(result: (typeof searchResults)[number]) {
    selectEntity(result.entityId);
    handleOpenChange(false);
  }

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={handleOpenChange}
      title={t("commands.palette.title")}
      description={t("commands.palette.description")}
      className="w-[min(42rem,calc(100vw-2rem))] rounded-xl border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <Command data-slot="workspace-command-palette">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("commands.palette.placeholder")}
        />
        <CommandList className="max-h-[min(28rem,calc(100vh-12rem))]">
          <CommandEmpty>{t("commands.palette.empty")}</CommandEmpty>
          <CommandGroup heading={t("commands.groups.commands")}>
            {commands.map((command) => (
              <CommandItem
                key={command.id}
                value={`${command.label} ${command.aliases.join(" ")}`}
                onSelect={() => runCommand(command)}
              >
                <span className="min-w-0 flex-1 truncate">{command.label}</span>
                {command.shortcuts[0] ? (
                  <CommandShortcut>
                    {formatShortcutChord(command.shortcuts[0], platform)}
                  </CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
          {searchResults.length > 0 ? <CommandSeparator /> : null}
          {searchResults.length > 0 ? (
            <CommandGroup heading={t("commands.groups.results")}>
              {searchResults.map((result) => {
                const structure = structures.find(
                  (item) =>
                    item.id ===
                    createdEntities.find(
                      (entity) => entity.id === result.entityId,
                    )?.objectTypeId,
                );
                const definition = structure
                  ? objectTypeDefinitionById[structure.iconName]
                  : objectTypeDefinitionById.page;
                const label =
                  result.kind === "object" ? result.title : result.text;
                const detail =
                  result.kind === "object"
                    ? structure?.singularName
                    : result.ownerTitle;
                return (
                  <CommandItem
                    key={`${result.kind}:${result.entityId}:${result.kind === "block" ? result.blockId : "object"}`}
                    value={`${label} ${detail ?? ""}`}
                    onSelect={() => openSearchResult(result)}
                  >
                    <ObjectIconBadge
                      icon={definition.icon}
                      tone={structure?.tone ?? "blue"}
                    />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    {detail ? (
                      <span className="ml-auto max-w-32 truncate text-xs text-muted-foreground">
                        {detail}
                      </span>
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function entityTextForFind(entity: WorkspaceEntity): string {
  if (entity.kind === "document" || entity.kind === "quote") {
    return blockEditorDocumentToPlainText(entity.body);
  }
  if (entity.kind === "task" || entity.kind === "url") return entity.body;
  if (entity.kind === "table") return entity.notes;
  if (entity.kind === "query") return entity.description;
  return "";
}

function WorkspaceExtendedSearchDialog() {
  const t = useTranslations("workspace");
  const {
    createdEntities,
    extendedSearchOpen,
    selectEntity,
    setExtendedSearchOpen,
    structures,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const searchIndex = React.useMemo(
    () => buildWorkspaceSearchIndex(createdEntities),
    [createdEntities],
  );
  const searchResults = React.useMemo(
    () =>
      deferredQuery.trim()
        ? searchWorkspaceIndex(searchIndex, deferredQuery, "all").slice(0, 24)
        : [],
    [deferredQuery, searchIndex],
  );

  function handleOpenChange(open: boolean) {
    setExtendedSearchOpen(open);
    if (!open) setQuery("");
  }

  return (
    <CommandDialog
      open={extendedSearchOpen}
      onOpenChange={handleOpenChange}
      title={t("commands.extendedSearch.title")}
      description={t("commands.extendedSearch.description")}
      className="w-[min(48rem,calc(100vw-2rem))] rounded-xl border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <Command data-slot="workspace-extended-search">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("commands.extendedSearch.placeholder")}
        />
        <CommandList className="max-h-[min(32rem,calc(100vh-12rem))]">
          <CommandEmpty>{t("commands.extendedSearch.empty")}</CommandEmpty>
          <CommandGroup heading={t("commands.groups.results")}>
            {searchResults.map((result) => {
              const entity = createdEntities.find(
                (item) => item.id === result.entityId,
              );
              const structure = structures.find(
                (item) => item.id === entity?.objectTypeId,
              );
              const definition = structure
                ? objectTypeDefinitionById[structure.iconName]
                : objectTypeDefinitionById.page;
              return (
                <CommandItem
                  key={`${result.kind}:${result.entityId}:${result.kind === "block" ? result.blockId : "object"}`}
                  value={
                    result.kind === "object"
                      ? result.title
                      : `${result.ownerTitle} ${result.text}`
                  }
                  onSelect={() => {
                    selectEntity(result.entityId);
                    handleOpenChange(false);
                  }}
                >
                  <ObjectIconBadge
                    icon={definition.icon}
                    tone={structure?.tone ?? "blue"}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {result.kind === "object" ? result.title : result.text}
                  </span>
                  <span className="ml-auto max-w-40 truncate text-xs text-muted-foreground">
                    {result.kind === "object"
                      ? structure?.singularName
                      : result.ownerTitle}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function WorkspaceFindInPageDialog() {
  const t = useTranslations("workspace");
  const { activeEntityId, createdEntities, findInPageOpen, setFindInPageOpen } =
    useWorkspace();
  const [query, setQuery] = React.useState("");
  const activeEntity = React.useMemo(
    () => createdEntities.find((entity) => entity.id === activeEntityId),
    [activeEntityId, createdEntities],
  );
  const matches = React.useMemo(() => {
    if (!activeEntity || !query.trim()) return [];
    return entityTextForFind(activeEntity)
      .split("\n")
      .map((text, index) => ({ id: `${activeEntity.id}:${index}`, text }))
      .filter((line) =>
        line.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      )
      .slice(0, 12);
  }, [activeEntity, query]);

  function handleOpenChange(open: boolean) {
    setFindInPageOpen(open);
    if (!open) setQuery("");
  }

  return (
    <CommandDialog
      open={findInPageOpen}
      onOpenChange={handleOpenChange}
      title={t("commands.findInPage.title")}
      description={t("commands.findInPage.description")}
      className="w-[min(38rem,calc(100vw-2rem))] rounded-xl border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <Command data-slot="workspace-find-in-page">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("commands.findInPage.placeholder")}
        />
        <CommandList className="max-h-[min(22rem,calc(100vh-12rem))]">
          <CommandEmpty>{t("commands.findInPage.empty")}</CommandEmpty>
          <CommandGroup
            heading={
              activeEntity?.title ?? t("commands.findInPage.currentPage")
            }
          >
            {matches.map((match) => (
              <CommandItem key={match.id} value={match.text}>
                <span className="min-w-0 flex-1 truncate">{match.text}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function WorkspaceShortcutBrowser() {
  const t = useTranslations("workspace");
  const {
    activeAction,
    createdEntities,
    shortcutBrowserOpen,
    setShortcutBrowserOpen,
    structures,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const platform: ShortcutPlatform =
    typeof navigator !== "undefined" &&
    navigator.platform.toLocaleLowerCase().includes("mac")
      ? "mac"
      : "windows";
  const runtime = React.useMemo(
    () =>
      createWorkspaceCommandRuntime({
        locale: "workspace",
        t,
        actions: {
          openPalette: () => undefined,
          openNewContent: () => undefined,
          openExtendedSearch: () => undefined,
          openFindInPage: () => undefined,
          openShortcuts: () => undefined,
          focusSidebarSearch: () => undefined,
          openSettings: () => undefined,
          navigateHome: () => undefined,
          navigateBack: () => undefined,
          navigateForward: () => undefined,
          navigateToday: () => undefined,
          openExplore: () => undefined,
          toggleSidebar: () => undefined,
          toggleSidePanel: () => undefined,
          toggleFocusMode: () => undefined,
          toggleTheme: () => undefined,
          closeCurrentTab: () => undefined,
          createTask: () => undefined,
          setCalendarView: () => undefined,
          moveCalendar: () => undefined,
          createObject: () => undefined,
        },
        state: {
          canNavigateToday: true,
          canUseExtendedSearch: true,
          canFindInPage: createdEntities.length > 0,
          canOpenSettings: true,
          canToggleTheme: true,
          canCloseCurrentTab: true,
          canCreateTask: structures.some(
            (structure) => structure.id === "task",
          ),
          calendarActive: activeAction === "calendar",
          structures: selectCreatableStructures(structures).map(
            (structure) => ({
              enabled: true,
              id: structure.id,
              label: structure.singularName,
            }),
          ),
        },
      }),
    [activeAction, createdEntities.length, structures, t],
  );
  const catalog = React.useMemo(
    () => projectWorkspaceShortcutCatalog(runtime),
    [runtime],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const groups = [
    "general",
    "navigation",
    "workspace",
    "page",
    "calendar",
    "creation",
  ] as const;

  function handleOpenChange(open: boolean) {
    setShortcutBrowserOpen(open);
    if (!open) setQuery("");
  }

  return (
    <CommandDialog
      open={shortcutBrowserOpen}
      onOpenChange={handleOpenChange}
      title={t("commands.shortcuts.title")}
      description={t("commands.shortcuts.description")}
      className="w-[min(44rem,calc(100vw-2rem))] rounded-xl border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <Command data-slot="workspace-shortcut-browser">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("commands.shortcuts.placeholder")}
        />
        <CommandList className="max-h-[min(30rem,calc(100vh-12rem))]">
          <CommandEmpty>{t("commands.shortcuts.empty")}</CommandEmpty>
          {groups.map((group) => {
            const entries = catalog.filter(
              (entry) =>
                entry.group === group &&
                entry.shortcuts.length > 0 &&
                (!normalizedQuery ||
                  `${entry.label} ${entry.description} ${entry.shortcuts.join(" ")}`
                    .toLocaleLowerCase()
                    .includes(normalizedQuery)),
            );
            if (entries.length === 0) return null;
            return (
              <CommandGroup key={group} heading={t(`commands.groups.${group}`)}>
                {entries.map((entry) => (
                  <CommandItem key={entry.id} value={entry.label}>
                    <span className="min-w-0 flex-1 truncate">
                      {entry.label}
                    </span>
                    <CommandShortcut>
                      {entry.shortcuts
                        .map((shortcut) =>
                          formatShortcutChord(shortcut, platform),
                        )
                        .join(" / ")}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function WorkspaceDraftError({
  error,
}: {
  error: WorkspaceObjectError | null;
}) {
  const t = useTranslations("workspace");
  if (!error) return null;
  return (
    <p
      id="workspace-draft-error"
      role="alert"
      data-lifecycle-contract={
        objectLifecycleContractSlots.ObjectValidationMessage
      }
      className="text-sm text-destructive"
    >
      {t(`lifecycle.errors.${error}`)}
    </p>
  );
}

function WorkspaceCreationDialog() {
  const t = useTranslations("workspace");
  const {
    workspaceDraft,
    workspaceError,
    cancelWorkspaceDraft,
    commitWorkspaceFile,
    commitWorkspaceTask,
    commitWorkspaceUrl,
  } = useWorkspace();
  const [value, setValue] = React.useState("");

  if (!workspaceDraft) return null;

  const isTask = workspaceDraft.kind === "task";
  const isUrl = workspaceDraft.kind === "url";
  const accept = getDraftAccept(workspaceDraft);
  const titleKey = isTask
    ? "lifecycle.task.createTitle"
    : `lifecycle.${isUrl ? "url" : "file"}.createTitle.${workspaceDraft.objectTypeId}`;
  const descriptionKey = `lifecycle.${isTask ? "task" : isUrl ? "url" : "file"}.description`;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isTask) commitWorkspaceTask(value);
    else if (isUrl) commitWorkspaceUrl(value);
  }

  function cancelAndRestoreFocus() {
    cancelWorkspaceDraft();
    window.requestAnimationFrame(() => {
      document.getElementById("workspace-new-trigger")?.focus();
    });
  }

  function commitSelectedFile(event: React.FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) commitWorkspaceFile(file);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) cancelAndRestoreFocus();
      }}
    >
      <DialogContent
        data-slot="workspace-creation-dialog"
        data-lifecycle-contract={
          objectLifecycleContractSlots.ObjectCaptureSurface
        }
        showCloseButton={false}
        className="gap-3 rounded-xl sm:max-w-md"
      >
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>{t(titleKey)}</DialogTitle>
            <DialogDescription>{t(descriptionKey)}</DialogDescription>
          </DialogHeader>

          {workspaceDraft.kind === "file" ? (
            <input
              type="file"
              data-slot="input"
              accept={accept}
              aria-label={t("lifecycle.file.choose")}
              className={cn(
                "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
                "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
              )}
              onChange={commitSelectedFile}
              onInput={commitSelectedFile}
            />
          ) : (
            <Input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-invalid={workspaceError ? true : undefined}
              aria-describedby={
                workspaceError ? "workspace-draft-error" : undefined
              }
              placeholder={
                isTask
                  ? t("lifecycle.task.placeholder")
                  : t("lifecycle.url.placeholder")
              }
            />
          )}

          <WorkspaceDraftError error={workspaceError} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={cancelAndRestoreFocus}
            >
              {t("lifecycle.cancel")}
            </Button>
            {workspaceDraft.kind !== "file" && (
              <Button type="submit">
                {isTask
                  ? t("lifecycle.task.submit")
                  : t("lifecycle.url.submit")}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WorkspaceMainHeader() {
  const t = useTranslations("workspace");
  const specialSideTabs = React.useMemo(() => createSpecialSideTabs(t), [t]);
  const specialItems = React.useMemo(
    () => createSpecialSideItems(t, specialSideTabs),
    [specialSideTabs, t],
  );
  const {
    mainTabs,
    mainValue,
    focusMode,
    setMainTabs,
    setMainValue,
    setFocusMode,
    setMainSearchOpen,
    openInSidePanel,
    selectEntity,
    showMessage,
  } = useWorkspace();
  const { rightCollapsed, toggleRight } = useAppShell();

  if (focusMode) {
    return (
      <AppFocusModeControls
        onBack={() => showMessage(t("actions.back"))}
        onForward={() => showMessage(t("actions.forward"))}
        onExit={() => setFocusMode(false)}
      />
    );
  }

  function createTab() {
    const draft: AppHeaderTab = {
      id: MAIN_DRAFT_TAB_ID,
      label: t("tabs.new"),
      icon: ObjectPageIcon,
      iconClassName: objectIconToneBadgeClass.blue,
      draggable: false,
    };

    setMainTabs((current) =>
      current.some((tab) => tab.id === MAIN_DRAFT_TAB_ID)
        ? current
        : [...current, draft],
    );
    setMainValue(MAIN_DRAFT_TAB_ID);
    setMainSearchOpen(true);
  }

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    const descriptor = specialSideTabs[entryId];
    const id =
      entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
    openInSidePanel({
      id,
      ...descriptor,
      draggable: true,
    });
    if (rightCollapsed) toggleRight();
  }

  return (
    <AppHeader
      onBack={() => showMessage(t("actions.back"))}
      onForward={() => showMessage(t("actions.forward"))}
      onFocus={() => setFocusMode(true)}
      end={
        rightCollapsed ? (
          <div className="flex items-center">
            <AppHeaderAction
              aria-label={t("actions.showSidePanel")}
              tooltip={t("actions.showSidePanel")}
              className="rounded-r-none border-r-0"
              onClick={toggleRight}
            >
              <AppHeaderSidebarSimpleIcon className="size-4 rotate-180" />
            </AppHeaderAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <AppHeaderAction
                    aria-label={t("tabs.sidePanelMenu")}
                    tooltip={t("tabs.sidePanelMenu")}
                    className="h-7 w-4 rounded-l-none px-0 text-[9px]"
                  >
                    <AppHeaderCaretDownIcon className="size-2.5" />
                  </AppHeaderAction>
                }
              />
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="w-64 p-1.5"
              >
                {specialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => openSpecialEntry(item.id)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null
      }
    >
      <AppSpaceHeader
        tabs={mainTabs}
        value={mainValue}
        onValueChange={(id) => {
          setMainValue(id);
          selectEntity(id);
        }}
        onTabsChange={setMainTabs}
        onCreate={createTab}
        createLabel={t("tabs.create")}
        tabListLabel={t("tabs.list")}
        searchTabsPlaceholder={t("tabs.search")}
        onShiftOpen={(tab) => {
          openInSidePanel(tab);
          if (rightCollapsed) toggleRight();
          showMessage(t("tabs.openedInSidePanel", { label: tab.label }));
        }}
        onCloseRequest={(tab) => {
          if (!tab.pinned) return true;
          showMessage(t("tabs.pinnedCloseBlocked"));
          return false;
        }}
      />
    </AppHeader>
  );
}

function MainTabSearchOverlay() {
  const t = useTranslations("workspace");
  const {
    mainTabs,
    objectTypes,
    setMainTabs,
    setMainValue,
    setMainSearchOpen,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);

  const options = React.useMemo(
    () =>
      objectTypes.map((option) => ({
        id: option.id,
        label: option.label,
        icon: option.icon,
        iconClassName: objectIconToneBadgeClass[option.tone],
        tone: option.tone,
      })),
    [objectTypes],
  );
  const normalized = deferredQuery.trim().toLocaleLowerCase();
  const filtered = normalized
    ? options.filter((option) =>
        option.label.toLocaleLowerCase().includes(normalized),
      )
    : options;

  function cancel() {
    const next = mainTabs.filter((tab) => tab.id !== MAIN_DRAFT_TAB_ID);
    setMainTabs(next);
    setMainValue(next[0]?.id ?? "atomic-note");
    setMainSearchOpen(false);
  }

  function select(option: (typeof options)[number]) {
    const selected: AppHeaderTab = {
      id: option.id,
      label: option.label,
      icon: option.icon,
      iconClassName: option.iconClassName,
    };
    setMainTabs((current) => {
      const withoutDraft = current.filter(
        (tab) => tab.id !== MAIN_DRAFT_TAB_ID,
      );
      return withoutDraft.some((tab) => tab.id === selected.id)
        ? withoutDraft
        : [...withoutDraft, selected];
    });
    setMainValue(selected.id);
    setMainSearchOpen(false);
  }

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") cancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/15 px-4 pt-[10vh]">
      <button
        type="button"
        aria-label={t("tabs.cancelCreate")}
        className="absolute inset-0 cursor-default"
        onClick={cancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("tabs.create")}
        className="relative w-full max-w-[42rem] overflow-hidden rounded-xl border border-black/10 bg-popover text-popover-foreground shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 border-b px-3">
          <AppSidebarSearchIcon className="size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("tabs.searchContentPlaceholder")}
            aria-label={t("tabs.searchContent")}
            className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
          />
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            Esc
          </span>
        </div>
        <div className="p-2">
          <p className="px-2 pb-1.5 text-xs text-muted-foreground">
            {t("tabs.recentlyOpened")}
          </p>
          {filtered.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                type="button"
                variant="ghost"
                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-muted"
                onClick={() => select(option)}
              >
                <ObjectIconBadge icon={Icon} tone={option.tone} />
                <span className="truncate">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidePanelHeader() {
  const t = useTranslations("workspace");
  const specialSideTabs = React.useMemo(() => createSpecialSideTabs(t), [t]);
  const specialItems = React.useMemo(
    () => createSpecialSideItems(t, specialSideTabs),
    [specialSideTabs, t],
  );
  const {
    sideTabs,
    sideValue,
    focusMode,
    setSideTabs,
    setSideValue,
    setSideSearchOpen,
  } = useWorkspace();
  const { rightCollapsed, toggleRight } = useAppShell();

  if (focusMode) return null;

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    const existing = sideTabs.find((tab) => {
      if (entryId === "aiAssistantChat")
        return tab.id.startsWith("aiAssistantChat_");
      return tab.id === entryId;
    });

    if (existing) {
      setSideValue(existing.id);
      if (rightCollapsed) toggleRight();
      return;
    }

    const descriptor = specialSideTabs[entryId];
    const id =
      entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
    const next: AppHeaderTab = {
      id,
      ...descriptor,
      draggable: true,
    };

    setSideTabs((current) => [...current, next]);
    setSideValue(id);
    if (rightCollapsed) toggleRight();
  }

  function createSideTab() {
    const explore = sideTabs.find((tab) => tab.id === "explore");

    if (!explore) {
      const nextExplore: AppHeaderTab = {
        id: "explore",
        label: t("primaryNavigation.explore"),
        icon: AppHeaderCompassIcon,
        iconClassName: objectIconToneBadgeClass.gray,
        draggable: false,
      };
      setSideTabs((current) => [...current, nextExplore]);
      setSideValue(nextExplore.id);
      return;
    }

    if (sideValue === explore.id) {
      setSideSearchOpen(true);
      return;
    }

    setSideValue(explore.id);
  }

  return (
    <AppSidePanelHeader
      tabs={sideTabs}
      value={sideValue}
      onValueChange={setSideValue}
      onTabsChange={setSideTabs}
      onCreate={createSideTab}
      onHide={toggleRight}
      onSpecialEntrySelect={openSpecialEntry}
      createLabel={t("tabs.createSidePanel")}
      hideLabel={t("tabs.hideSidePanel")}
      menuLabel={t("tabs.sidePanelMenu")}
      tabListLabel={t("tabs.sidePanelTabs")}
      closeLabel={t("tabs.close")}
      specialItems={specialItems}
    />
  );
}

function SidePanelSearchOverlay() {
  const t = useTranslations("workspace");
  const {
    createdEntities,
    objectTypes,
    setSideSearchOpen,
    setSideTabs,
    setSideValue,
    structures,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus({ preventScroll: true });
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setSideSearchOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSideSearchOpen]);

  const recentItems = React.useMemo(() => {
    const items = new Map<
      string,
      {
        id: string;
        label: string;
        icon: React.ElementType<ObjectIconProps>;
        iconClassName: string;
      }
    >();

    for (const entity of createdEntities) {
      const structure = structures.find(
        (item) => item.id === entity.objectTypeId,
      );
      if (!structure) continue;
      const definition = objectTypeDefinitionById[structure.iconName];
      items.set(entity.id, {
        id: entity.id,
        label: entity.title.trim() || t("lifecycle.untitled"),
        icon: definition.icon,
        iconClassName: objectIconToneBadgeClass[structure.tone],
      });
    }

    for (const objectType of objectTypes) {
      if (items.has(objectType.id)) continue;
      items.set(objectType.id, {
        id: objectType.id,
        label: objectType.label,
        icon: objectType.icon,
        iconClassName: objectIconToneBadgeClass[objectType.tone],
      });
    }

    return Array.from(items.values());
  }, [createdEntities, objectTypes, structures, t]);

  const normalized = deferredQuery.trim().toLocaleLowerCase();
  const filtered = normalized
    ? recentItems.filter((item) =>
        item.label.toLocaleLowerCase().includes(normalized),
      )
    : recentItems;

  function openRecent(item: (typeof recentItems)[number]) {
    const tab: AppHeaderTab = {
      id: item.id,
      label: item.label,
      icon: item.icon,
      iconClassName: item.iconClassName,
      draggable: true,
    };

    setSideTabs((current) => {
      if (current.some((entry) => entry.id === tab.id)) return current;
      return [...current, tab];
    });
    setSideValue(tab.id);
    setSideSearchOpen(false);
  }

  return (
    /* biome-ignore lint/a11y/noStaticElementInteractions: the backdrop dismisses the semantic dialog nested inside */
    <div
      role="presentation"
      data-slot="side-panel-search-overlay"
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/50 px-4 pt-[10vh]"
      onMouseDown={() => setSideSearchOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[50rem] overflow-hidden rounded-xl border border-black/10 bg-white text-[#282522] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-[58px] items-center gap-3 border-b border-black/10 px-4">
          <span className="text-xl">⌕</span>
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("tabs.sidePanelSearchPlaceholder")}
            className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-[17px] shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <span className="text-sm text-[#6b6661]">ⓘ</span>
          <span className="text-sm text-[#6b6661]">↗</span>
        </div>

        <div className="px-4 pt-2">
          <span className="inline-flex h-6 items-center rounded-md bg-[#f1efed] px-2 text-xs text-[#595550]">
            ▣ {t("tabs.openInSidePanel")}
          </span>
        </div>

        <div className="max-h-[520px] overflow-y-auto px-4 pb-4 pt-4">
          <div className="mb-3 text-[15px] text-[#595550]">
            {t("tabs.recentlyOpened")}
          </div>
          <div className="mb-2 text-xs text-[#837d76]">
            {t("tabs.yesterday")}
          </div>

          <div className="space-y-0.5">
            {filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex h-11 w-full items-center justify-start gap-3 rounded-lg px-1.5 text-left text-[15px] font-normal",
                    index === 0 && !normalized
                      ? "bg-[#f2f0ee]"
                      : "hover:bg-[#f2f0ee]",
                  )}
                  onClick={() => openRecent(item)}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-md",
                      item.iconClassName,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span
                    className={cn(
                      "rounded-md border border-current/50 px-2 py-1 text-xs",
                      item.iconClassName,
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="mb-2 mt-5 text-[15px] text-[#595550]">
            {t("tabs.allActions")}
          </div>
          {[
            t("tabs.actions.openCalendar"),
            t("tabs.actions.openToday"),
            t("tabs.actions.openSettings"),
            t("tabs.actions.openGraph"),
            t("tabs.actions.openObjectsInside"),
            t("tabs.actions.openRelatedContent"),
            t("tabs.actions.toggleFocusMode"),
          ].map((label) => (
            <div
              key={label}
              className="flex h-11 items-center gap-3 px-1.5 text-[15px]"
            >
              <span className="flex size-6 items-center justify-center rounded-md border border-black/10 text-[#837d76]">
                ◇
              </span>
              <span className="flex-1">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex h-8 items-center border-t border-black/10 px-3 text-xs text-[#595550]">
          {t("tabs.keyboardHelp")}
        </div>
      </div>
    </div>
  );
}

function TabPreview({ eyebrow, title }: { eyebrow: string; title: string }) {
  const t = useTranslations("workspace.tabs");
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{eyebrow}</span>
      <span className="font-medium text-foreground">{title}</span>
      <span className="text-sm leading-5 text-muted-foreground">
        {t("previewContent", { title })}
      </span>
    </div>
  );
}

export {
  useWorkspace,
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
};
