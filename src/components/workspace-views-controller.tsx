"use client";

import * as React from "react";

import {
  createDataView,
  createInitialWorkspaceViewState,
  type CreateDataViewInput,
  deleteDataView,
  type DataViewKind,
  type ObjectCreationTemplate,
  parseWorkspaceViewState,
  serializeWorkspaceViewState,
  type StructureDashboard,
  switchDataViewKind,
  updateDataView,
  type WorkspaceDataView,
  type WorkspaceViewState,
} from "@/lib/workspace-object-views";

const WORKSPACE_VIEW_STORAGE_KEY = "notes-app.workspace-views.v1";

type WorkspaceViewsHydrationStatus = "loading" | "ready" | "recovered";

type WorkspaceViewsContextValue = {
  readonly dashboards: readonly StructureDashboard[];
  readonly dataViews: readonly WorkspaceDataView[];
  readonly hydrationStatus: WorkspaceViewsHydrationStatus;
  readonly templates: readonly ObjectCreationTemplate[];
  readonly createWorkspaceDataView: (input: CreateDataViewInput) => string;
  readonly deleteWorkspaceDataView: (id: string) => void;
  readonly replaceWorkspaceDashboard: (dashboard: StructureDashboard) => void;
  readonly replaceWorkspaceTemplate: (template: ObjectCreationTemplate) => void;
  readonly switchWorkspaceDataViewKind: (
    id: string,
    kind: DataViewKind,
  ) => void;
  readonly updateWorkspaceDataView: (
    id: string,
    update: Partial<
      Pick<WorkspaceDataView, "name" | "presentation" | "query">
    >,
  ) => void;
};

const WorkspaceViewsContext =
  React.createContext<WorkspaceViewsContextValue | null>(null);

function replaceById<T extends { readonly id: string }>(
  current: readonly T[],
  replacement: T,
): readonly T[] {
  return current.some((item) => item.id === replacement.id)
    ? current.map((item) =>
        item.id === replacement.id ? replacement : item,
      )
    : [...current, replacement];
}

function replaceDashboard(
  current: readonly StructureDashboard[],
  dashboard: StructureDashboard,
): readonly StructureDashboard[] {
  return current.some((item) => item.structureId === dashboard.structureId)
    ? current.map((item) =>
        item.structureId === dashboard.structureId ? dashboard : item,
      )
    : [...current, dashboard];
}

function readStoredWorkspaceViewState(): {
  readonly state: WorkspaceViewState;
  readonly status: Exclude<WorkspaceViewsHydrationStatus, "loading">;
} {
  const raw = window.localStorage.getItem(WORKSPACE_VIEW_STORAGE_KEY);
  if (!raw) {
    return { state: createInitialWorkspaceViewState(), status: "ready" };
  }
  const parsed = parseWorkspaceViewState(raw);
  return parsed.ok
    ? { state: parsed.value, status: "ready" }
    : { state: createInitialWorkspaceViewState(), status: "recovered" };
}

function WorkspaceViewsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WorkspaceViewState>(
    createInitialWorkspaceViewState,
  );
  const [hydrationStatus, setHydrationStatus] =
    React.useState<WorkspaceViewsHydrationStatus>("loading");

  React.useEffect(() => {
    const stored = readStoredWorkspaceViewState();
    setState(stored.state);
    setHydrationStatus(stored.status);
  }, []);

  React.useEffect(() => {
    if (hydrationStatus === "loading") return;
    window.localStorage.setItem(
      WORKSPACE_VIEW_STORAGE_KEY,
      serializeWorkspaceViewState(state),
    );
  }, [hydrationStatus, state]);

  const createWorkspaceDataView = React.useCallback(
    (input: CreateDataViewInput) => {
      const id = crypto.randomUUID();
      setState((current) => {
        const result = createDataView(current.dataViews, input, () => id);
        return result.ok
          ? { ...current, dataViews: result.value }
          : current;
      });
      return id;
    },
    [],
  );

  const updateWorkspaceDataView = React.useCallback(
    (
      id: string,
      update: Partial<
        Pick<WorkspaceDataView, "name" | "presentation" | "query">
      >,
    ) => {
      setState((current) => {
        const result = updateDataView(current.dataViews, id, update);
        return result.ok
          ? { ...current, dataViews: result.value }
          : current;
      });
    },
    [],
  );

  const deleteWorkspaceDataView = React.useCallback((id: string) => {
    setState((current) => {
      const result = deleteDataView(current.dataViews, id);
      return result.ok ? { ...current, dataViews: result.value } : current;
    });
  }, []);

  const switchWorkspaceDataViewKind = React.useCallback(
    (id: string, kind: DataViewKind) => {
      setState((current) => ({
        ...current,
        dataViews: current.dataViews.map((view) =>
          view.id === id ? switchDataViewKind(view, kind) : view,
        ),
      }));
    },
    [],
  );

  const replaceWorkspaceDashboard = React.useCallback(
    (dashboard: StructureDashboard) => {
      setState((current) => ({
        ...current,
        dashboards: replaceDashboard(current.dashboards, dashboard),
      }));
    },
    [],
  );

  const replaceWorkspaceTemplate = React.useCallback(
    (template: ObjectCreationTemplate) => {
      setState((current) => ({
        ...current,
        templates: replaceById(current.templates, template),
      }));
    },
    [],
  );

  const value = React.useMemo<WorkspaceViewsContextValue>(
    () => ({
      createWorkspaceDataView,
      dashboards: state.dashboards,
      dataViews: state.dataViews,
      deleteWorkspaceDataView,
      hydrationStatus,
      replaceWorkspaceDashboard,
      replaceWorkspaceTemplate,
      switchWorkspaceDataViewKind,
      templates: state.templates,
      updateWorkspaceDataView,
    }),
    [
      createWorkspaceDataView,
      deleteWorkspaceDataView,
      hydrationStatus,
      replaceWorkspaceDashboard,
      replaceWorkspaceTemplate,
      state.dashboards,
      state.dataViews,
      state.templates,
      switchWorkspaceDataViewKind,
      updateWorkspaceDataView,
    ],
  );

  return (
    <WorkspaceViewsContext.Provider value={value}>
      {children}
    </WorkspaceViewsContext.Provider>
  );
}

function useWorkspaceViews(): WorkspaceViewsContextValue {
  const context = React.useContext(WorkspaceViewsContext);
  if (!context) {
    throw new Error(
      "useWorkspaceViews must be used within WorkspaceViewsProvider.",
    );
  }
  return context;
}

export {
  useWorkspaceViews,
  WORKSPACE_VIEW_STORAGE_KEY,
  WorkspaceViewsProvider,
};
