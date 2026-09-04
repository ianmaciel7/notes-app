import type { Story } from "@ladle/react";
import { NextIntlClientProvider } from "next-intl";

import { AppSidebarPrimaryActions } from "./app-sidebar-primary-actions";
import { ObjectPageIcon, ObjectQueryIcon } from "./object-icons";

const messages = {
  workspace: {
    primaryNavigation: {
      navigationLabel: "Primary Navigation",
      new: "New",
      search: "Search",
      explore: "Explore",
      calendar: "Calendar",
      tasks: "Tasks",
      searchHint: "Quick search",
      extendedSearchHint: "Extended search",
      exploreHint: "Explore knowledge graph",
      exploreSideHint: "Explore in side panel",
      calendarHint: "View calendar",
      tasksHint: "View tasks",
      or: "or",
      searchContentType: "Search content types",
      typesLabel: "Content Types",
      navigate: "Navigate",
      cancel: "Cancel",
      select: "Select",
    },
  },
};

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

export const SidebarActions: Story = () => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <div className="w-64 border rounded-lg bg-sidebar p-4">
      <AppSidebarPrimaryActions
        objectTypes={sampleObjectTypes}
        onAction={(actionId) => alert(`Action clicked: ${actionId}`)}
        onSelectObjectType={(typeId) => alert(`New item type selected: ${typeId}`)}
      />
    </div>
  </NextIntlClientProvider>
);
