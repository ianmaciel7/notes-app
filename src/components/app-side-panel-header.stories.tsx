import type { Story } from "@ladle/react";
import * as React from "react";

import { AppSidePanelHeader } from "./app-side-panel-header";

const initialSideTabs = [
  { id: "tab-1", label: "Graph View" },
  { id: "tab-2", label: "Backlinks" },
];

export const DefaultSidePanelHeader: Story = () => {
  const [tabs, setTabs] = React.useState(initialSideTabs);
  const [value, setValue] = React.useState("tab-1");

  return (
    <div className="w-96 overflow-hidden rounded-lg border bg-background">
      <AppSidePanelHeader
        tabs={tabs}
        value={value}
        onValueChange={setValue}
        onTabsChange={setTabs}
        onCreate={() => {
          const newId = `tab-${Date.now()}`;
          setTabs([...tabs, { id: newId, label: "New Side Tab" }]);
          setValue(newId);
        }}
        onHide={() => alert("Hide clicked")}
      />
    </div>
  );
};
