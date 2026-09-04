import type { Story } from "@ladle/react";

import * as Icons from "./app-sidebar-icons";

export const AllSidebarIcons: Story = () => {
  const iconList = [
    { name: "AppSidebarAlertIcon", Component: Icons.AppSidebarAlertIcon },
    { name: "AppSidebarArchiveIcon", Component: Icons.AppSidebarArchiveIcon },
    { name: "AppSidebarArrowDownIcon", Component: Icons.AppSidebarArrowDownIcon },
    { name: "AppSidebarArrowUpIcon", Component: Icons.AppSidebarArrowUpIcon },
    { name: "AppSidebarAtomicNoteIcon", Component: Icons.AppSidebarAtomicNoteIcon },
    { name: "AppSidebarAudioIcon", Component: Icons.AppSidebarAudioIcon },
    { name: "AppSidebarBookIcon", Component: Icons.AppSidebarBookIcon },
    { name: "AppSidebarCalendarIcon", Component: Icons.AppSidebarCalendarIcon },
    { name: "AppSidebarCheckIcon", Component: Icons.AppSidebarCheckIcon },
    { name: "AppSidebarChevronRightIcon", Component: Icons.AppSidebarChevronRightIcon },
    { name: "AppSidebarChevronsUpDownIcon", Component: Icons.AppSidebarChevronsUpDownIcon },
    { name: "AppSidebarCodeIcon", Component: Icons.AppSidebarCodeIcon },
    { name: "AppSidebarCopyIcon", Component: Icons.AppSidebarCopyIcon },
    { name: "AppSidebarCornerDownLeftIcon", Component: Icons.AppSidebarCornerDownLeftIcon },
    { name: "AppSidebarDotsIcon", Component: Icons.AppSidebarDotsIcon },
    { name: "AppSidebarExploreIcon", Component: Icons.AppSidebarExploreIcon },
    { name: "AppSidebarFileIcon", Component: Icons.AppSidebarFileIcon },
    { name: "AppSidebarFlaskIcon", Component: Icons.AppSidebarFlaskIcon },
    { name: "AppSidebarGripVerticalIcon", Component: Icons.AppSidebarGripVerticalIcon },
    { name: "AppSidebarIdeaIcon", Component: Icons.AppSidebarIdeaIcon },
    { name: "AppSidebarImageIcon", Component: Icons.AppSidebarImageIcon },
    { name: "AppSidebarKnowledgeIcon", Component: Icons.AppSidebarKnowledgeIcon },
    { name: "AppSidebarObjectsIcon", Component: Icons.AppSidebarObjectsIcon },
    { name: "AppSidebarPageIcon", Component: Icons.AppSidebarPageIcon },
    { name: "AppSidebarPdfIcon", Component: Icons.AppSidebarPdfIcon },
    { name: "AppSidebarPinIcon", Component: Icons.AppSidebarPinIcon },
    { name: "AppSidebarPinOffIcon", Component: Icons.AppSidebarPinOffIcon },
    { name: "AppSidebarPlusIcon", Component: Icons.AppSidebarPlusIcon },
    { name: "AppSidebarProjectIcon", Component: Icons.AppSidebarProjectIcon },
    { name: "AppSidebarQuoteIcon", Component: Icons.AppSidebarQuoteIcon },
    { name: "AppSidebarSearchIcon", Component: Icons.AppSidebarSearchIcon },
    { name: "AppSidebarSunIcon", Component: Icons.AppSidebarSunIcon },
    { name: "AppSidebarTableIcon", Component: Icons.AppSidebarTableIcon },
    { name: "AppSidebarTaskIcon", Component: Icons.AppSidebarTaskIcon },
    { name: "AppSidebarTweetIcon", Component: Icons.AppSidebarTweetIcon },
    { name: "AppSidebarWeblinkIcon", Component: Icons.AppSidebarWeblinkIcon },
    { name: "AppSidebarXIcon", Component: Icons.AppSidebarXIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {iconList.map(({ name, Component }) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-muted"
        >
          <Component className="size-5 text-foreground" />
          <span className="font-mono text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  );
};
