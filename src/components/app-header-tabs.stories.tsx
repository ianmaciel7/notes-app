import type { Story } from "@ladle/react";
import * as React from "react";

import { type AppHeaderTab, AppHeaderTabItem, AppSpaceHeader } from "./app-header-tabs";
import { ObjectPageIcon, ObjectQueryIcon } from "./object-icons";

const sampleTabs: AppHeaderTab[] = [
  { id: "tab-1", label: "Dashboard Page", icon: ObjectPageIcon, pinned: true },
  { id: "tab-2", label: "Knowledge Base", icon: ObjectQueryIcon },
  { id: "tab-3", label: "Project Notes", icon: ObjectPageIcon },
];

export const DefaultTabItem: Story = () => (
  <div className="w-64 p-4">
    <AppHeaderTabItem tab={{ id: "demo-1", label: "Sample Tab", icon: ObjectPageIcon }} active />
  </div>
);

export const TabItemStates: Story = () => (
  <div className="flex w-64 flex-col gap-2 p-4">
    <AppHeaderTabItem
      tab={{ id: "demo-active", label: "Active Tab", icon: ObjectPageIcon }}
      active
      closable
      pinnable
    />
    <AppHeaderTabItem
      tab={{ id: "demo-inactive", label: "Inactive Tab", icon: ObjectQueryIcon }}
      active={false}
      closable
      pinnable
    />
    <AppHeaderTabItem
      tab={{ id: "demo-pinned", label: "Pinned Tab", icon: ObjectPageIcon, pinned: true }}
      active={false}
      closable
      pinnable
    />
  </div>
);

export const SpaceHeaderBar: Story = () => {
  const [tabs, setTabs] = React.useState(sampleTabs);
  const [value, setValue] = React.useState("tab-1");

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background p-2">
      <AppSpaceHeader
        tabs={tabs}
        value={value}
        onValueChange={setValue}
        onTabsChange={setTabs}
        onCreate={() => {
          const newId = `tab-${Date.now()}`;
          setTabs([...tabs, { id: newId, label: "New Tab", icon: ObjectPageIcon }]);
          setValue(newId);
        }}
      />
    </div>
  );
};
