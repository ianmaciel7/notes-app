import type { Story, StoryDefault } from "@ladle/react";

import { AppSidebarTypeLabel } from "./app-sidebar-overview";
import { ObjectBookIcon, ObjectPageIcon } from "./object-icons";

export default {
  title: "Components / App sidebar overview",
} satisfies StoryDefault;

export const TypeBadgeLabels: Story = () => (
  <div className="flex w-64 flex-col gap-2 p-4">
    <AppSidebarTypeLabel icon={ObjectBookIcon} tone="purple">
      Books Collection
    </AppSidebarTypeLabel>
    <AppSidebarTypeLabel icon={ObjectPageIcon} tone="blue">
      Notes & Pages
    </AppSidebarTypeLabel>
  </div>
);
