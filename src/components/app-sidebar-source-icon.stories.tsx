import type { Story } from "@ladle/react";

import {
  AppSidebarSourceIcon,
  type AppSidebarSourceIconName,
  AppSidebarWorkspaceIcon,
} from "./app-sidebar-source-icon";

const sourceIconNames: AppSidebarSourceIconName[] = [
  "workspace",
  "settings",
  "moon",
  "user",
  "rocket",
  "logout",
  "share",
  "trash",
  "help",
  "graduation",
  "documentation",
  "news",
  "feedback",
  "external",
];

export const AllSourceIcons: Story = () => (
  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {sourceIconNames.map((name) => (
      <div
        key={name}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center hover:bg-muted"
      >
        <AppSidebarSourceIcon name={name} className="text-foreground" />
        <span className="font-mono text-xs text-muted-foreground">{name}</span>
      </div>
    ))}
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center hover:bg-muted">
      <AppSidebarWorkspaceIcon className="text-foreground" />
      <span className="font-mono text-xs text-muted-foreground">WorkspaceIcon</span>
    </div>
  </div>
);
