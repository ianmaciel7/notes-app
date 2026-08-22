"use client";

import { useTranslations } from "next-intl";
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
} from "@/components/app-sidebar-overview";
import { AppSidebarWorkspaceIcon } from "@/components/app-sidebar-source-icon";
import {
  ObjectAiChatIcon,
  ObjectArchiveIcon,
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectBookIcon,
  ObjectCodeIcon,
  ObjectIconBadge,
  ObjectIdeaIcon,
  ObjectKnowledgeIcon,
  ObjectPageIcon,
  ObjectProjectIcon,
  ObjectQueryIcon,
  ObjectQuoteIcon,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  selectCreatableStructures,
  type CreateStructureInput,
  type ObjectIconName,
  type ObjectIconTone,
  type WorkspaceStructure,
} from "@/lib/workspace-object-types";
import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
  WORKSPACE_OBJECT_STORAGE_KEY,
} from "@/lib/workspace-object-storage";
import {
  countEntitiesByType,
  createInitialWorkspaceObjectState,
  getCreationFlow,
  getWorkspaceImportError,
  type WorkspaceDraft,
  type WorkspaceEntity,
  type WorkspaceObjectError,
  workspaceObjectReducer,
} from "@/lib/workspace-objects";

const initialMainTabs: AppHeaderTab[] = [
  {
    id: "page-1",
    label: "aaaaaaaaaaaaa",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.blue,
    preview: <TabPreview eyebrow="Página" title="aaaaaaaaaaaaa" />,
  },
  {
    id: "atomic-note",
    label: "Notas atômicas",
    icon: ObjectAtomicNoteIcon,
    iconClassName: objectIconToneBadgeClass.amber,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Notas atômicas" />,
  },
  {
    id: "quote",
    label: "Citações",
    icon: ObjectQuoteIcon,
    iconClassName: objectIconToneBadgeClass.rose,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Citações" />,
  },
  {
    id: "page",
    label: "Páginas",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.blue,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Páginas" />,
  },
  {
    id: "untitled",
    label: "Sem título",
    icon: ObjectQuoteIcon,
    iconClassName: objectIconToneBadgeClass.rose,
    preview: <TabPreview eyebrow="Citação" title="Sem título" />,
  },
];

const initialSideTabs: AppHeaderTab[] = [
  {
    id: "explore",
    label: "Explorar",
    icon: AppHeaderCompassIcon,
    iconClassName: objectIconToneBadgeClass.gray,
    draggable: false,
  },
];

const MAIN_DRAFT_TAB_ID = "new-tab-draft";

const specialSideTabs: Record<
  SidePanelSpecialEntryId,
  Omit<AppHeaderTab, "id">
> = {
  graphView: {
    label: "Visualização em grafo",
    icon: AppHeaderGraphIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  backlinks: {
    label: "Links de entrada",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  objectsInside: {
    label: "Objetos internos",
    icon: ObjectAreaIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  relatedContent: {
    label: "Conteúdo relacionado",
    icon: AppHeaderGraphIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  aiAssistantChat: {
    label: "Chat de IA",
    icon: ObjectAiChatIcon,
    iconClassName: objectIconToneBadgeClass.purple,
  },
  localSpaceQuery: {
    label: "Buscar",
    icon: ObjectQueryIcon,
    iconClassName: objectIconToneBadgeClass.emerald,
  },
};

type AppSidebarPrimaryNavigationAction = "search" | "explore" | "calendar";

const initialSpaces: AppSidebarSpace[] = [
  { id: "studies", name: "Studies", icon: ObjectBookIcon },
  { id: "ideas", name: "Ideas", icon: ObjectIdeaIcon },
  { id: "labs", name: "zzzzzzzzzz", icon: AppSidebarWorkspaceIcon },
  { id: "projects", name: "Projects", icon: ObjectProjectIcon },
  { id: "dev", name: "Dev", icon: ObjectCodeIcon },
  { id: "knowledge", name: "Knowledge", icon: ObjectKnowledgeIcon },
  { id: "archive", name: "Archive", icon: ObjectArchiveIcon },
];

const availablePinnedEntities: AppSidebarPinnedEntity[] = [
  {
    id: "page-1",
    label: "aaaaaaaaaaaaa",
    icon: ObjectPageIcon,
    tone: "blue",
  },
];

const initialPinnedEntities = availablePinnedEntities.slice(0, 1);

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
  activeAction: AppSidebarPrimaryNavigationAction | undefined;
  activeEntityId: string | null;
  pinnedEntities: AppSidebarPinnedEntity[];
  availablePinnedEntities: AppSidebarPinnedEntity[];
  objectTypes: AppSidebarObjectType[];
  structures: readonly WorkspaceStructure[];
  createdEntities: WorkspaceEntity[];
  workspaceDraft: WorkspaceDraft | null;
  workspaceError: WorkspaceObjectError | null;
  customSections: AppSidebarCustomSection[];
  objectTypeCollections: Record<string, string[]>;
  objectTypeQueries: Record<string, string[]>;
  setSpaces: React.Dispatch<React.SetStateAction<AppSidebarSpace[]>>;
  setSpaceId: React.Dispatch<React.SetStateAction<string>>;
  message: string | null;
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setMainValue: React.Dispatch<React.SetStateAction<string>>;
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setSideValue: React.Dispatch<React.SetStateAction<string>>;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSideSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMainSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    React.SetStateAction<Record<string, string[]>>
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
  deleteWorkspaceStructure: (id: string) => void;
  createWorkspaceEntity: (
    objectTypeId: string,
    objectTypeLabel?: string,
  ) => void;
  createWorkspacePage: (title: string) => void;
  importWorkspaceFiles: (objectTypeId: string, files: File[]) => Promise<void>;
  cancelWorkspaceDraft: () => void;
  commitWorkspaceFile: (file: File) => void;
  commitWorkspaceTask: (title: string) => void;
  commitWorkspaceUrl: (url: string) => void;
  updateWorkspaceEntity: (id: string, patch: Record<string, unknown>) => void;
  changeWorkspaceEntityType: (id: string, objectTypeId: "tag" | "task") => void;
  deleteWorkspaceEntity: (id: string) => void;
  duplicateWorkspaceEntity: (id: string) => void;
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
  const t = useTranslations("workspace");
  const [spaces, setSpaces] = React.useState(initialSpaces);
  const [spaceId, setSpaceId] = React.useState("labs");
  const [mainTabs, setMainTabs] = React.useState(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("untitled");
  const [sideTabs, setSideTabs] = React.useState(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("explore");
  const [focusMode, setFocusMode] = React.useState(false);
  const [sideSearchOpen, setSideSearchOpen] = React.useState(false);
  const [mainSearchOpen, setMainSearchOpen] = React.useState(false);
  const [activeAction, setActiveAction] = React.useState<
    AppSidebarPrimaryNavigationAction | undefined
  >(undefined);
  const [activeEntityId, setActiveEntityId] = React.useState<string | null>(
    "quote",
  );
  const [pinnedEntities, setPinnedEntities] = React.useState<
    AppSidebarPinnedEntity[]
  >(initialPinnedEntities);
  const [workspaceObjects, dispatchWorkspaceObjects] = React.useReducer(
    workspaceObjectReducer,
    undefined,
    createInitialWorkspaceObjectState,
  );
  const [customSections, setCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [objectTypeCollections, setObjectTypeCollections] = React.useState<
    Record<string, string[]>
  >({});
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

  const createdCounts = React.useMemo(
    () => countEntitiesByType(workspaceObjects.entities),
    [workspaceObjects.entities],
  );
  const objectTypes = React.useMemo(() => {
    return selectCreatableStructures(workspaceObjects.structures).map(
      (structure) => {
        const definition = objectTypeDefinitionById[structure.iconName];
        return {
          id: structure.id,
          iconName: structure.iconName,
          label:
            structure.ownership === "custom"
              ? structure.pluralName
              : t(`objectTypeStudio.objectTypes.${structure.id}`),
          icon: definition.icon,
          ownership: structure.ownership,
          singularLabel: structure.singularName,
          tone: structure.tone,
          count: createdCounts[structure.id] ?? 0,
        };
      },
    );
  }, [createdCounts, t, workspaceObjects.structures]);

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

  React.useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;
    try {
      const raw = window.localStorage.getItem(WORKSPACE_OBJECT_STORAGE_KEY);
      if (!raw) {
        dispatchWorkspaceObjects({
          type: "hydrate",
          state: createInitialWorkspaceObjectState(),
        });
      } else {
        const parsed = parseWorkspaceObjectSnapshot(raw);
        if (parsed.ok) {
          dispatchWorkspaceObjects({ type: "hydrate", state: parsed.state });
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
  }, [showMessage, t]);

  React.useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(
      WORKSPACE_OBJECT_STORAGE_KEY,
      serializeWorkspaceObjectState(workspaceObjects),
    );
  }, [storageReady, workspaceObjects]);

  React.useEffect(() => {
    if (!workspaceObjects.error || workspaceObjects.draft) return;
    showMessage(t(`lifecycle.errors.${workspaceObjects.error}`));
  }, [showMessage, t, workspaceObjects.draft, workspaceObjects.error]);

  React.useEffect(() => {
    if (!workspaceObjects.structureError) return;
    showMessage(t("objectTypeStudio.operationFailed"));
  }, [showMessage, t, workspaceObjects.structureError]);

  React.useEffect(() => {
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
          iconClassName: objectIconToneBadgeClass[definition.tone],
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
        if (
          existingIndex === -1 &&
          entity.id !== workspaceObjects.activeEntityId
        ) {
          continue;
        }
        if (existingIndex === -1) next.push(tab);
        else next[existingIndex] = { ...next[existingIndex], ...tab };
      }
      return next;
    });
  }, [
    t,
    workspaceObjects.activeEntityId,
    workspaceObjects.entities,
    workspaceObjects.structures,
  ]);

  React.useEffect(() => {
    if (!workspaceObjects.activeEntityId) return;
    setMainValue(workspaceObjects.activeEntityId);
    setActiveEntityId(workspaceObjects.activeEntityId);
    setActiveAction(undefined);
  }, [workspaceObjects.activeEntityId]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLocaleLowerCase() === "m"
      ) {
        event.preventDefault();
        setFocusMode((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ensureMainTab = React.useCallback((tab: AppHeaderTab) => {
    setMainTabs((current) =>
      current.some((item) => item.id === tab.id) ? current : [...current, tab],
    );
    setMainValue(tab.id);
  }, []);

  const openInSidePanel = React.useCallback((tab: AppHeaderTab) => {
    setSideTabs((current) => {
      if (current.some((item) => item.id === tab.id)) return current;
      return [...current, { ...tab, pinned: undefined, draggable: true }];
    });
    setSideValue(tab.id);
  }, []);

  const selectEntity = React.useCallback(
    (id: string) => {
      const createdEntity = workspaceObjects.entities.find(
        (item) => item.id === id,
      );
      const objectType = objectTypes.find((item) => item.id === id);
      const pinnedEntity = availablePinnedEntities.find(
        (item) => item.id === id,
      );
      const entity = objectType ?? pinnedEntity;

      setActiveEntityId(id);
      setActiveAction(undefined);

      if (createdEntity) {
        dispatchWorkspaceObjects({ type: "selectEntity", id });
        setMainValue(id);
        return;
      }

      if (!entity) return;

      ensureMainTab({
        id: entity.id,
        label: entity.label,
        icon: entity.icon,
        iconClassName: objectIconToneBadgeClass[entity.tone],
        preview: <TabPreview eyebrow="Objeto" title={entity.label} />,
      });
    },
    [ensureMainTab, objectTypes, workspaceObjects.entities],
  );

  const createWorkspaceEntity = React.useCallback(
    (objectTypeId: string, _objectTypeLabel?: string) => {
      dispatchWorkspaceObjects({ type: "beginCreate", objectTypeId });
      if (!getCreationFlow(objectTypeId, workspaceObjects.structures)) {
        showMessage(t("lifecycle.errors.unsupported-object-type"));
      }
    },
    [showMessage, t, workspaceObjects.structures],
  );

  const createWorkspacePage = React.useCallback((title: string) => {
    dispatchWorkspaceObjects({
      type: "createDocument",
      objectTypeId: "page",
      title,
    });
  }, []);

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

  const commitWorkspaceFile = React.useCallback((file: File) => {
    dispatchWorkspaceObjects({
      type: "commitFile",
      fileName: file.name,
      mimeType: file.type,
      previewUrl: URL.createObjectURL(file),
      size: file.size,
    });
  }, []);

  const importWorkspaceFiles = React.useCallback(
    async (objectTypeId: string, files: File[]) => {
      const flow = getCreationFlow(objectTypeId, workspaceObjects.structures);
      if (!flow) {
        showMessage(t("lifecycle.errors.unsupported-object-type"));
        return;
      }

      let accepted = 0;
      let rejected = 0;
      for (const file of files) {
        let text = "";
        if (flow !== "file") {
          try {
            text = await file.text();
          } catch {
            rejected += 1;
            continue;
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
          rejected += 1;
          continue;
        }
        dispatchWorkspaceObjects({
          type: "importFile",
          fileName: file.name,
          mimeType: file.type,
          objectTypeId,
          previewUrl: flow === "file" ? URL.createObjectURL(file) : undefined,
          size: file.size,
          text,
        });
        accepted += 1;
      }

      if (accepted > 0 && rejected > 0) {
        showMessage(
          t("objectTypeOverview.importPartial", { accepted, rejected }),
        );
      } else if (accepted > 0) {
        showMessage(
          t("objectTypeOverview.importComplete", { count: accepted }),
        );
      } else {
        showMessage(t("objectTypeOverview.importRejected"));
      }
    },
    [showMessage, t, workspaceObjects.structures],
  );

  const updateWorkspaceEntity = React.useCallback(
    (id: string, patch: Record<string, unknown>) => {
      dispatchWorkspaceObjects({ type: "updateEntity", id, patch });
    },
    [],
  );

  const changeWorkspaceEntityType = React.useCallback(
    (id: string, objectTypeId: "tag" | "task") => {
      dispatchWorkspaceObjects({ type: "changeEntityType", id, objectTypeId });
    },
    [],
  );

  const deleteWorkspaceEntity = React.useCallback((id: string) => {
    dispatchWorkspaceObjects({ type: "deleteEntity", id });
  }, []);

  const duplicateWorkspaceEntity = React.useCallback((id: string) => {
    dispatchWorkspaceObjects({ type: "duplicateEntity", id });
  }, []);

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
      activeAction,
      activeEntityId,
      pinnedEntities,
      availablePinnedEntities,
      objectTypes,
      structures: workspaceObjects.structures,
      createdEntities: workspaceObjects.entities,
      workspaceDraft: workspaceObjects.draft,
      workspaceError: workspaceObjects.error,
      customSections,
      objectTypeCollections,
      objectTypeQueries,
      setSpaces,
      setSpaceId,
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      setSideSearchOpen,
      setMainSearchOpen,
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
      deleteWorkspaceStructure,
      createWorkspaceEntity,
      createWorkspacePage,
      importWorkspaceFiles,
      cancelWorkspaceDraft,
      commitWorkspaceFile,
      commitWorkspaceTask,
      commitWorkspaceUrl,
      updateWorkspaceEntity,
      changeWorkspaceEntityType,
      deleteWorkspaceEntity,
      duplicateWorkspaceEntity,
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
      sideTabs,
      sideValue,
      activeAction,
      activeEntityId,
      pinnedEntities,
      objectTypes,
      workspaceObjects.structures,
      workspaceObjects.draft,
      workspaceObjects.entities,
      workspaceObjects.error,
      customSections,
      objectTypeCollections,
      objectTypeQueries,
      selectEntity,
      createWorkspaceStructure,
      createWorkspaceStructureFromPreset,
      updateWorkspaceStructure,
      deleteWorkspaceStructure,
      createWorkspaceEntity,
      createWorkspacePage,
      importWorkspaceFiles,
      cancelWorkspaceDraft,
      commitWorkspaceFile,
      commitWorkspaceTask,
      commitWorkspaceUrl,
      updateWorkspaceEntity,
      changeWorkspaceEntityType,
      deleteWorkspaceEntity,
      duplicateWorkspaceEntity,
      openInSidePanel,
    ],
  );

  return (
    <TooltipProvider delay={200}>
      <WorkspaceContext.Provider value={value}>
        {children}
        {sideSearchOpen && <SidePanelSearchOverlay />}
        {mainSearchOpen && <MainTabSearchOverlay />}
        {workspaceObjects.draft && <WorkspaceCreationDialog />}
        {createdTaskId && (
          <div
            data-slot="workspace-task-created"
            role="status"
            className="fixed bottom-4 right-4 z-[130] flex items-center gap-3 rounded-xl border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg"
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

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) cancelAndRestoreFocus();
      }}
    >
      <DialogContent
        data-slot="workspace-creation-dialog"
        showCloseButton={false}
        className="gap-3 rounded-xl sm:max-w-md"
      >
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>{t(titleKey)}</DialogTitle>
            <DialogDescription>{t(descriptionKey)}</DialogDescription>
          </DialogHeader>

          {workspaceDraft.kind === "file" ? (
            <Input
              type="file"
              accept={accept}
              aria-label={t("lifecycle.file.choose")}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) commitWorkspaceFile(file);
              }}
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
            <AppHeaderAction
              aria-label={t("actions.sidePanelOptions")}
              tooltip={t("actions.sidePanelOptions")}
              className="h-7 w-4 rounded-l-none px-0 text-[9px]"
              onClick={() => showMessage(t("actions.sidePanelOptions"))}
            >
              <AppHeaderCaretDownIcon className="size-2.5" />
            </AppHeaderAction>
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
          showMessage("Pinned tabs cannot be closed. Unpin the tab first.");
          return false;
        }}
      />
    </AppHeader>
  );
}

function MainTabSearchOverlay() {
  const t = useTranslations("workspace");
  const { mainTabs, setMainTabs, setMainValue, setMainSearchOpen } =
    useWorkspace();
  const [query, setQuery] = React.useState("");

  const options = [
    {
      id: "atomic-note",
      label: t("objectTypeStudio.objectTypes.atomic-note"),
      icon: ObjectAtomicNoteIcon,
    },
    { id: "page-1", label: "aaaaaaaaaaaaa", icon: ObjectPageIcon },
    {
      id: "page",
      label: t("objectTypeStudio.objectTypes.page"),
      icon: ObjectPageIcon,
    },
    {
      id: "quote",
      label: t("objectTypeStudio.objectTypes.quote"),
      icon: ObjectQuoteIcon,
    },
  ];
  const normalized = query.trim().toLocaleLowerCase();
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
      iconClassName:
        objectIconToneBadgeClass[
          objectTypeDefinitionById[option.id]?.tone ?? "blue"
        ],
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
            const tone = objectTypeDefinitionById[option.id]?.tone ?? "blue";
            return (
              <Button
                key={option.id}
                type="button"
                variant="ghost"
                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-muted"
                onClick={() => select(option)}
              >
                <ObjectIconBadge icon={Icon} tone={tone} />
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
  const {
    sideTabs,
    sideValue,
    focusMode,
    setSideTabs,
    setSideValue,
    setSideSearchOpen,
  } = useWorkspace();
  const { toggleRight } = useAppShell();

  if (focusMode) return null;

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    if (entryId === "localSpaceQuery") {
      setSideSearchOpen(true);
      return;
    }

    const existing = sideTabs.find((tab) => {
      if (entryId === "aiAssistantChat")
        return tab.id.startsWith("aiAssistantChat_");
      return tab.id === entryId;
    });

    if (existing) {
      setSideValue(existing.id);
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
  }

  function createSideTab() {
    const explore = sideTabs.find((tab) => tab.id === "explore");

    if (!explore) {
      const nextExplore = initialSideTabs.find((tab) => tab.id === "explore");
      if (!nextExplore) return;

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
      closeLabel={t("tabs.close")}
    />
  );
}

function SidePanelSearchOverlay() {
  const t = useTranslations("workspace");
  const { setSideSearchOpen, setSideTabs, setSideValue } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus({ preventScroll: true });
  }, []);

  const recentItems = React.useMemo(
    () => [
      {
        id: "recent-atomic-note",
        label: t("objectTypeStudio.objectTypes.atomic-note"),
        icon: ObjectAtomicNoteIcon,
        iconClassName: objectIconToneBadgeClass.amber,
      },
      {
        id: "recent-page",
        label: t("objectTypeStudio.objectTypes.page"),
        icon: ObjectPageIcon,
        iconClassName: objectIconToneBadgeClass.blue,
      },
      {
        id: "recent-citations",
        label: t("objectTypeStudio.objectTypes.quote"),
        icon: ObjectQuoteIcon,
        iconClassName: objectIconToneBadgeClass.rose,
      },
    ],
    [t],
  );

  const normalized = query.trim().toLocaleLowerCase();
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
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{eyebrow}</span>
      <span className="font-medium text-foreground">{title}</span>
      <span className="text-sm leading-5 text-muted-foreground">
        Preview content for {title}.
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
