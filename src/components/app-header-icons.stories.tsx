import type { Story } from "@ladle/react";

import * as Icons from "./app-header-icons";

export const AllHeaderIcons: Story = () => {
  const iconList = [
    { name: "AppHeaderBookOpenIcon", Component: Icons.AppHeaderBookOpenIcon },
    { name: "AppHeaderCaretDownIcon", Component: Icons.AppHeaderCaretDownIcon },
    { name: "AppHeaderCaretLeftIcon", Component: Icons.AppHeaderCaretLeftIcon },
    { name: "AppHeaderCaretRightIcon", Component: Icons.AppHeaderCaretRightIcon },
    { name: "AppHeaderCircleDashedIcon", Component: Icons.AppHeaderCircleDashedIcon },
    { name: "AppHeaderCloseIcon", Component: Icons.AppHeaderCloseIcon },
    { name: "AppHeaderCompassIcon", Component: Icons.AppHeaderCompassIcon },
    { name: "AppHeaderCustomizeIcon", Component: Icons.AppHeaderCustomizeIcon },
    { name: "AppHeaderDotsIcon", Component: Icons.AppHeaderDotsIcon },
    { name: "AppHeaderFileIcon", Component: Icons.AppHeaderFileIcon },
    { name: "AppHeaderFolderIcon", Component: Icons.AppHeaderFolderIcon },
    { name: "AppHeaderGraphIcon", Component: Icons.AppHeaderGraphIcon },
    { name: "AppHeaderLightbulbIcon", Component: Icons.AppHeaderLightbulbIcon },
    { name: "AppHeaderPlusIcon", Component: Icons.AppHeaderPlusIcon },
    { name: "AppHeaderPushPinFillIcon", Component: Icons.AppHeaderPushPinFillIcon },
    { name: "AppHeaderPushPinIcon", Component: Icons.AppHeaderPushPinIcon },
    { name: "AppHeaderSidebarSimpleIcon", Component: Icons.AppHeaderSidebarSimpleIcon },
    { name: "AppHeaderSparkleIcon", Component: Icons.AppHeaderSparkleIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {iconList.map(({ name, Component }) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-muted"
        >
          <Component className="size-6 text-foreground" />
          <span className="font-mono text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  );
};
