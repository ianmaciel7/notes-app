import type { Story } from "@ladle/react";
import { Folder } from "lucide-react";
import {
  WorkspaceEmptyState,
  workspaceCardGridClass,
  workspaceContentScopeClass,
  workspaceEditorSurfaceClass,
  workspaceFieldGroupClass,
  workspaceListRowClass,
  workspaceListSurfaceClass,
  workspaceMetaTextClass,
  workspaceNamedCardClass,
  workspaceOverviewContentClass,
  workspaceReferenceSecondaryTextClass,
  workspaceRouteClass,
  workspaceSectionTitleClass,
} from "./space-surface";

export const EmptyState: Story = () => (
  <div className="p-6">
    <WorkspaceEmptyState
      icon={Folder}
      title="No items found"
      description="Get started by creating a new object or searching existing content."
    />
  </div>
);

export const EmptyStateCompact: Story = () => (
  <div className="p-6 max-w-sm">
    <WorkspaceEmptyState
      compact
      title="No results"
      description="Try searching with a different term."
    />
  </div>
);

export const WorkspaceSurfacesOverview: Story = () => (
  <div className={workspaceContentScopeClass}>
    <div className={workspaceRouteClass}>
      <div className={workspaceOverviewContentClass}>
        <h2 className={workspaceSectionTitleClass}>Workspace Section</h2>
        <p className={workspaceMetaTextClass}>
          This is metadata text demonstrating{" "}
          <span className={workspaceReferenceSecondaryTextClass}>secondary text styling</span>.
        </p>

        <div className="mt-4 space-y-4">
          <div className={workspaceFieldGroupClass}>
            <p className={workspaceSectionTitleClass}>Field Group Container</p>
            <p className={workspaceMetaTextClass}>Encapsulated group properties surface.</p>
          </div>

          <div className={workspaceCardGridClass}>
            <div className={workspaceNamedCardClass}>
              <p className={workspaceSectionTitleClass}>Card Item 1</p>
              <p className={workspaceMetaTextClass}>Details for item 1</p>
            </div>
            <div className={workspaceNamedCardClass}>
              <p className={workspaceSectionTitleClass}>Card Item 2</p>
              <p className={workspaceMetaTextClass}>Details for item 2</p>
            </div>
          </div>

          <div className={workspaceListSurfaceClass}>
            <button type="button" className={workspaceListRowClass}>
              <span className={workspaceSectionTitleClass}>List Row 1</span>
            </button>
            <button type="button" className={workspaceListRowClass}>
              <span className={workspaceSectionTitleClass}>List Row 2</span>
            </button>
          </div>

          <div className={workspaceEditorSurfaceClass}>
            <p className={workspaceSectionTitleClass}>Editor Surface</p>
            <p className={workspaceMetaTextClass}>Editor container box surface.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
