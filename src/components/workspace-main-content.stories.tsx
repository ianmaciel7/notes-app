import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";

import { useWorkspace, WorkspaceProvider } from "./space-controller";
import { WorkspaceDefaultPanel, WorkspaceMainContent } from "./workspace-main-content";

export default {
  title: "Components / Workspace main content",
} satisfies StoryDefault;

type WorkspaceActionState = "search" | "calendar" | "explore" | "tasks" | `pending:${string}`;

function WorkspaceStoryState({ activeAction }: { activeAction?: WorkspaceActionState }) {
  const { setActiveAction, setActiveEntityId, setMainValue } = useWorkspace();

  React.useEffect(() => {
    function applyStoryState() {
      setActiveAction(activeAction);
      if (activeAction) {
        setActiveEntityId(null);
        setMainValue(`primary-action:${activeAction}`);
      }
    }

    applyStoryState();
    const timeout = window.setTimeout(applyStoryState, 0);
    return () => window.clearTimeout(timeout);
  }, [activeAction, setActiveAction, setActiveEntityId, setMainValue]);

  return null;
}

function WorkspaceContentStoryFrame({
  activeAction,
  children,
}: {
  activeAction?: WorkspaceActionState;
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <WorkspaceStoryState activeAction={activeAction} />
      <div className="h-screen min-h-0 w-full overflow-hidden bg-card">{children}</div>
    </WorkspaceProvider>
  );
}

export const MainContentDefaultRoute: Story = () => (
  <WorkspaceContentStoryFrame>
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const DefaultPanelPagesPending: Story = () => (
  <WorkspaceContentStoryFrame>
    <WorkspaceDefaultPanel />
  </WorkspaceContentStoryFrame>
);

export const SearchAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="search">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const CalendarAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="calendar">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const ExploreAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="explore">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const TasksAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="tasks">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingChangeTypeAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:change-type">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingExportAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:export">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingImportAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:import">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingNewCollectionAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:new-collection">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingNewFromTemplateAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:new-from-template">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingNewQueryAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:new-query">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingPinSidebarAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:pin-sidebar">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingPresentAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:present">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingSettingsAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:settings">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PendingShareAction: Story = () => (
  <WorkspaceContentStoryFrame activeAction="pending:share">
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);
