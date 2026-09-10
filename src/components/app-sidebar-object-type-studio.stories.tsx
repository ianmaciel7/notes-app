import type { Story, StoryDefault } from "@ladle/react";

import { AppSidebarObjectTypeStudio } from "./app-sidebar-object-type-studio";

export default {
  title: "Components / App sidebar object type studio",
} satisfies StoryDefault;

export const StudioDialog: Story = () => (
  <div className="p-4">
    <AppSidebarObjectTypeStudio
      onCreateFromPreset={() => undefined}
      onCreateCustom={() => undefined}
    />
  </div>
);
