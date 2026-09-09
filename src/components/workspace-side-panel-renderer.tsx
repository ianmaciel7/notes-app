"use client";

import {
  AppHeaderCircleDashedIcon,
  AppHeaderGraphIcon,
  AppHeaderSparkleIcon,
} from "@/components/app-header-icons";
import { PendingImplementation } from "@/components/pending-implementation";

type SidePanelItemId =
  | "graphView"
  | "backlinks"
  | "objectsInside"
  | "relatedContent"
  | "aiAssistantChat"
  | "localSpaceQuery";

type SidePanelItem = {
  id: SidePanelItemId;
  label: string;
  description: string;
  icon: React.ElementType;
};

const sidePanelItems: SidePanelItem[] = [
  {
    description: "Show the local graph for the active object.",
    icon: AppHeaderGraphIcon,
    id: "graphView",
    label: "Graph view",
  },
  {
    description: "List objects that link back to the active object.",
    icon: AppHeaderCircleDashedIcon,
    id: "backlinks",
    label: "Backlinks",
  },
  {
    description: "Browse objects linked or contained inside the active object.",
    icon: AppHeaderSparkleIcon,
    id: "objectsInside",
    label: "Objects inside",
  },
  {
    description: "Surface nearby content connected to this context.",
    icon: AppHeaderSparkleIcon,
    id: "relatedContent",
    label: "Related content",
  },
  {
    description: "Start an AI chat with the current object as context.",
    icon: AppHeaderSparkleIcon,
    id: "aiAssistantChat",
    label: "AI chat",
  },
  {
    description: "Search locally from this side-panel context.",
    icon: AppHeaderSparkleIcon,
    id: "localSpaceQuery",
    label: "Search",
  },
];

type WorkspaceSidePanelRendererProps = {
  activeMainObjectTitle?: string;
  activeTabLabel: string;
  onOpenItem?: (item: SidePanelItem) => void;
  sideValue: string;
};

function isExploreOverview(value: string, label: string) {
  return value === "side-1" || value === "explore" || label === "Explore";
}

function findSidePanelItem(value: string, label: string) {
  return (
    sidePanelItems.find((item) => item.id === value) ??
    sidePanelItems.find((item) => item.label === label)
  );
}

function getSidePanelDescription({
  activeMainObjectTitle,
  activeTabLabel,
  sideValue,
}: Pick<
  WorkspaceSidePanelRendererProps,
  "activeMainObjectTitle" | "activeTabLabel" | "sideValue"
>) {
  const item = findSidePanelItem(sideValue, activeTabLabel);
  const baseDescription = item?.description ?? `${activeTabLabel} should be implemented here.`;
  return `${baseDescription}${activeMainObjectTitle ? ` Context: ${activeMainObjectTitle}.` : ""}`;
}

function SidePanelPending({
  activeMainObjectTitle,
  activeTabLabel,
  sideValue,
}: Pick<
  WorkspaceSidePanelRendererProps,
  "activeMainObjectTitle" | "activeTabLabel" | "sideValue"
>) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-card p-4">
      <PendingImplementation
        area="Side panel"
        className="w-full"
        description={getSidePanelDescription({ activeMainObjectTitle, activeTabLabel, sideValue })}
        name={activeTabLabel}
      />
    </div>
  );
}

export function WorkspaceSidePanelRenderer({
  activeMainObjectTitle,
  activeTabLabel,
  sideValue,
}: WorkspaceSidePanelRendererProps) {
  return (
    <SidePanelPending
      activeMainObjectTitle={activeMainObjectTitle}
      activeTabLabel={isExploreOverview(sideValue, activeTabLabel) ? "Explore" : activeTabLabel}
      sideValue={sideValue}
    />
  );
}
