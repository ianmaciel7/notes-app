import type { Story } from "@ladle/react";

import { PendingImplementation } from "./pending-implementation";

export const Default: Story = () => (
  <div className="flex min-h-screen items-center justify-center bg-card p-6">
    <PendingImplementation
      area="Workspace action"
      className="max-w-2xl"
      description="Replace this placeholder when the feature is ready."
      name="Object inspector"
    />
  </div>
);

export const MainPanelPages: Story = () => (
  <div className="flex h-screen min-h-0 w-full items-center justify-center bg-card p-6">
    <PendingImplementation
      area="Main panel"
      className="max-w-2xl"
      description="Páginas should be implemented here."
      name="Páginas"
    />
  </div>
);

export const SidePanelExplore: Story = () => (
  <div className="flex h-screen min-h-0 w-full items-center justify-center bg-card p-4">
    <PendingImplementation
      area="Side panel"
      className="w-full"
      description="Explore should be implemented here."
      name="Explore"
    />
  </div>
);
