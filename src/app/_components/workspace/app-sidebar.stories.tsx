import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";
import { ObjectPageIcon } from "@/app/_components/objects/object-icons";
import type { AppSidebarSpace } from "./app-sidebar";
import { AppSidebar } from "./app-sidebar";

export default {
  title: "Components / App Sidebar",
} satisfies StoryDefault;

const sampleSpaces: AppSidebarSpace[] = [
  { id: "personal", name: "Personal Space", icon: ObjectPageIcon },
  { id: "work", name: "Work & Projects", icon: ObjectPageIcon },
];

export const Interactive: Story = () => {
  const [spaces, setSpaces] = React.useState(sampleSpaces);
  const [value, setValue] = React.useState("personal");

  return (
    <div className="h-[500px] w-64 overflow-hidden rounded-lg border bg-sidebar">
      <AppSidebar
        spaces={spaces}
        value={value}
        onValueChange={setValue}
        onReorder={(nextSpaces) => setSpaces(nextSpaces)}
        onCreateSpace={(name) => {
          const newId = `space-${Date.now()}`;
          setSpaces([...spaces, { id: newId, name, icon: ObjectPageIcon }]);
          setValue(newId);
        }}
      >
        <div className="p-4 text-xs text-muted-foreground">Sidebar children & object list...</div>
      </AppSidebar>
    </div>
  );
};
