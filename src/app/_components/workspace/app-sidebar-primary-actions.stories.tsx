import type { Story, StoryDefault } from "@ladle/react";

import { AppSidebarPrimaryActions } from "./app-sidebar-primary-actions";
import { ObjectPageIcon, ObjectQueryIcon } from "@/app/_components/objects/object-icons";

export default {
  title: "Components / App Sidebar / Primary Actions",
} satisfies StoryDefault;

const sampleObjectTypes = [
  {
    id: "page",
    label: "Pages",
    singularLabel: "Page",
    icon: ObjectPageIcon,
    tone: "blue" as const,
    count: 5,
  },
  {
    id: "query",
    label: "Queries",
    singularLabel: "Query",
    icon: ObjectQueryIcon,
    tone: "green" as const,
    count: 2,
  },
];

export const Default: Story = () => (
  <div className="w-64 border rounded-lg bg-sidebar p-4">
    <AppSidebarPrimaryActions
      objectTypes={sampleObjectTypes}
      onAction={(actionId) => alert(`Action clicked: ${actionId}`)}
      onSelectObjectType={(typeId) => alert(`New item type selected: ${typeId}`)}
    />
  </div>
);
