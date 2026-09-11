import type { Story, StoryDefault } from "@ladle/react";

import { AppSidebarObjectTypeStudio } from "./app-sidebar-object-type-studio";

export default {
  title: "Components / App Sidebar / Object Type Studio",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="p-4">
    <AppSidebarObjectTypeStudio
      onCreateFromPreset={() => undefined}
      onCreateCustom={() => undefined}
    />
  </div>
);
