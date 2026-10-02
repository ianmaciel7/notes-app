"use client";

import {
  Book,
  Briefcase,
  Check,
  ChevronsUpDown,
  Code,
  Folder,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { CreateSpaceDialog } from "@/components/notes-app/create-space-dialog";
import { SettingsDialog } from "@/components/notes-app/settings-dialog";
import { SidebarUserMenu } from "@/components/notes-app/sidebar-user-menu";
import { SpacesEmpty } from "@/components/notes-app/spaces-empty";
import { SpacesStatus } from "@/components/notes-app/spaces-status";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-spaces";
import { cn } from "@/lib/utils";
import type { AllowedSpaceIcon } from "@/lib/validators/space";
import type { Space } from "@/types/space";

type SpaceSidebarProps = ComponentProps<"div"> & {
  currentSpaceId?: string;
  children?: ReactNode;
  onSelectSpace?: (spaceId: string) => void;
};

function useSpaceSidebar({
  currentSpaceId,
}: Pick<SpaceSidebarProps, "currentSpaceId">) {
  const router = useRouter();
  const { user, isLoading: authLoading, signOutUser } = useAuth();
  const { spaces, loading, error, isOffline, retry, createSpace } = useSpaces();
  const firstSpaceId = spaces[0]?.id;

  useEffect(() => {
    if (authLoading || currentSpaceId) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!loading && !error && firstSpaceId) {
      router.replace(`/${firstSpaceId}`);
    }
  }, [authLoading, currentSpaceId, error, firstSpaceId, loading, router, user]);

  return {
    authLoading,
    createSpace,
    error,
    isOffline,
    loading,
    retry,
    router,
    signOutUser,
    spaces,
    user,
  };
}

const ICON_MAP: Record<AllowedSpaceIcon, typeof Folder> = {
  folder: Folder,
  book: Book,
  briefcase: Briefcase,
  code: Code,
  archive: Folder,
  compass: Folder,
};

const SIDEBAR_MENU_POPUP = "min-w-60";

type SpaceIconProps = ComponentProps<"svg"> & {
  iconKey?: string;
};

function SpaceIcon({ iconKey, ...props }: SpaceIconProps) {
  const IconComp =
    Object.entries(ICON_MAP).find(([key]) => key === iconKey)?.[1] ?? Folder;
  return <IconComp {...props} />;
}

type SpaceSidebarMainProps = PropsWithChildren & {
  notFound: boolean;
  onCreate: () => void;
  showEmptyState: boolean;
  status: ReactNode;
  t: (key: string) => string;
};

function SpaceSidebarMain({
  children,
  notFound,
  onCreate,
  showEmptyState,
  status,
  t,
}: SpaceSidebarMainProps) {
  if (notFound) return status;
  if (showEmptyState) {
    return <SpacesEmpty onCreate={onCreate} t={t} />;
  }
  return children;
}

type SpaceSwitcherMenuProps = Omit<
  ComponentProps<typeof SidebarMenu>,
  "onSelect"
> & {
  activeSpace?: Space;
  onCreate: () => void;
  onSelect: (spaceId: string) => void;
  spaces: Space[];
  t: (key: string) => string;
  visibleSpaces: Space[];
};

function SpaceSwitcherMenu({
  activeSpace,
  onCreate,
  onSelect,
  spaces,
  t,
  visibleSpaces,
  ...props
}: SpaceSwitcherMenuProps) {
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
              className={SIDEBAR_MENU_POPUP}
            >
              <DropdownMenuGroup>
                {visibleSpaces.length > 0 ? (
                  visibleSpaces.map((space) => (
                    <DropdownMenuItem
                      key={space.id}
                      onClick={() => onSelect(space.id)}
                      data-testid={`space-item-${space.id}`}
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

function SpaceSidebar({
  currentSpaceId,
  children,
  onSelectSpace,
  className,
  ...props
}: SpaceSidebarProps) {
  const t = useTranslations("spaces");
  const {
    authLoading,
    createSpace,
    error,
    isOffline,
    loading,
    retry,
    router,
    signOutUser,
    spaces,
    user,
  } = useSpaceSidebar({ currentSpaceId });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const activeSpace = currentSpaceId
    ? spaces.find((space) => space.id === currentSpaceId)
    : spaces[0];
  const visibleSpaces = spaces;
  const notFound = Boolean(currentSpaceId && !activeSpace);
  const showEmptyState = spaces.length === 0;

  const status = (
    <SpacesStatus
      error={error}
      isOffline={isOffline}
      loading={loading}
      notFound={Boolean(currentSpaceId && !activeSpace)}
      onBack={() => router.replace("/")}
      onRetry={retry}
      className={className}
      t={t}
      {...props}
    />
  );

  if (authLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Spinner className="size-8" aria-label={t("loading")} />
      </div>
    );
  }

  if (!user || error || loading) {
    return status;
  }

  const handleSelect = (spaceId: string) =>
    onSelectSpace ? onSelectSpace(spaceId) : router.push(`/${spaceId}`);
  const handleCreateSpace = async (name: string, icon: string) => {
    setIsCreating(true);
    try {
      const newSpaceId = await createSpace({ name, icon });
      setCreateDialogOpen(false);
      handleSelect(newSpaceId);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <SidebarProvider
      data-testid="space-switcher"
      className={cn("min-h-svh", className)}
      {...props}
    >
      <Sidebar variant="inset" collapsible="none" className="h-svh">
        <SidebarHeader>
          <SpaceSwitcherMenu
            activeSpace={activeSpace}
            onCreate={() => setCreateDialogOpen(true)}
            onSelect={handleSelect}
            spaces={spaces}
            t={t}
            visibleSpaces={visibleSpaces}
          />
        </SidebarHeader>
        {/*
         * TODO(object-types): Add the object types list here once the
         * Firestore `objectTypes` collection and its management flow exist.
         */}
        <SidebarContent />
        <SidebarFooter>
          <SidebarUserMenu
            user={user}
            onOpenSettings={() => setSettingsDialogOpen(true)}
            onSignOut={() => signOutUser()}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SpaceSidebarMain
          notFound={notFound}
          onCreate={() => setCreateDialogOpen(true)}
          showEmptyState={showEmptyState}
          status={status}
          t={t}
        >
          {children}
        </SpaceSidebarMain>
      </SidebarInset>
      <CreateSpaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSpace}
        isLoading={isCreating}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
      {isOffline && (
        <Badge
          aria-live="polite"
          className="fixed bottom-4 right-4"
          data-testid="offline-status-indicator"
        >
          {t("operatingOffline")}
        </Badge>
      )}
    </SidebarProvider>
  );
}

export { SpaceSidebar, type SpaceSidebarProps, useSpaceSidebar };
