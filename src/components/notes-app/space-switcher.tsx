"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SpaceIcon } from "@/lib/space-icons";
import type { Space } from "@/types/space";

type SpaceSwitcherMenuProps = Omit<
  ComponentProps<typeof SidebarMenu>,
  "onSelect"
> & {
  activeSpace?: Space;
  onCreate: () => void;
  onSelect: (spaceId: string) => void;
  spaces: Space[];
  visibleSpaces: Space[];
};

function SpaceSwitcherMenu({
  activeSpace,
  onCreate,
  onSelect,
  spaces,
  visibleSpaces,
  ...props
}: SpaceSwitcherMenuProps) {
  const t = useTranslations("spaces");
  return (
    <SidebarMenu aria-label={t("workspace")} {...props}>
      <SidebarMenuItem>
        {spaces.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  data-testid="space-switcher-trigger"
                  aria-label={t("switchSpace")}
                >
                  <SpaceIcon iconKey={activeSpace?.icon} />
                  <span className="min-w-0 truncate text-sm">
                    {activeSpace?.name ?? t("selectSpace")}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent
              align="start"
              sideOffset={4}
              className="min-w-60"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("workspace")}</DropdownMenuLabel>
                {visibleSpaces.length > 0 ? (
                  visibleSpaces.map((space) => (
                    <DropdownMenuItem
                      key={space.id}
                      onClick={() => onSelect(space.id)}
                      data-testid={`space-switcher-item-${space.id}`}
                    >
                      <SpaceIcon iconKey={space.icon} />
                      <span className="min-w-0 flex-1 truncate">
                        {space.name}
                      </span>
                      {space.id === activeSpace?.id && <Check />}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    {t("noSearchResults")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onCreate}>
                  <Plus />
                  {t("createSpace")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton
            data-testid="space-switcher-create-trigger"
            onClick={onCreate}
          >
            <Plus />
            <span>{t("createFirstSpace")}</span>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { SpaceSwitcherMenu, type SpaceSwitcherMenuProps };
