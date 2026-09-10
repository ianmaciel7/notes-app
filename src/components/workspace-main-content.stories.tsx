import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";

import { useWorkspace, WorkspaceProvider } from "./space-controller";
import { WorkspaceMainContent } from "./workspace-main-content";

const primaryActionOptions = ["search", "calendar", "explore", "tasks"] as const;
const pendingActionOptions = [
  "pending:change-type",
  "pending:export",
  "pending:import",
  "pending:new-collection",
  "pending:new-from-template",
  "pending:new-query",
  "pending:pin-sidebar",
  "pending:present",
  "pending:settings",
  "pending:share",
] as const;

type PrimaryActionState = (typeof primaryActionOptions)[number];
type PendingActionState = (typeof pendingActionOptions)[number];
type WorkspaceActionState = PrimaryActionState | PendingActionState;

type WorkspaceActionStoryProps = {
  activeAction: WorkspaceActionState;
};

export default {
  title: "Components / Workspace main content",
} satisfies StoryDefault;

function WorkspaceStoryState({ activeAction }: { activeAction?: WorkspaceActionState }) {
  const { setActiveAction, setActiveEntityId, setMainValue } = useWorkspace();

  React.useEffect(() => {
    function applyStoryState() {
      setActiveAction(activeAction);
      if (activeAction) {
        setActiveEntityId(null);
        setMainValue(`primary-action:${activeAction}`);
      } else {
        setActiveEntityId("page");
        setMainValue("page");
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

export const Default: Story = () => (
  <WorkspaceContentStoryFrame>
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

export const PrimaryActions: Story<WorkspaceActionStoryProps> = ({ activeAction = "calendar" }) => (
  <WorkspaceContentStoryFrame activeAction={activeAction}>
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

PrimaryActions.args = {
  activeAction: "calendar",
};
PrimaryActions.argTypes = {
  activeAction: {
    control: { type: "select" },
    options: primaryActionOptions,
  },
};

export const PendingStates: Story<WorkspaceActionStoryProps> = ({
  activeAction = "pending:new-query",
}) => (
  <WorkspaceContentStoryFrame activeAction={activeAction}>
    <WorkspaceMainContent />
  </WorkspaceContentStoryFrame>
);

PendingStates.args = {
  activeAction: "pending:new-query",
};
PendingStates.argTypes = {
  activeAction: {
    control: { type: "select" },
    options: pendingActionOptions,
  },
};
