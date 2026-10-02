"use client";

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { CreateSpaceDialog } from "@/components/notes-app/create-space-dialog";
import { SettingsDialog } from "@/components/notes-app/settings-dialog";
import { SidebarUserMenu } from "@/components/notes-app/sidebar-user-menu";
import { SpaceLoading } from "@/components/notes-app/space-loading";
import { SpaceSwitcher } from "@/components/notes-app/space-switcher";
import { SpacesList } from "@/components/notes-app/spaces-list";
import {
  SpacesErrorStatus,
  SpacesLoadingStatus,
  SpacesNotFoundStatus,
} from "@/components/notes-app/spaces-status";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useSpaceSidebar } from "@/hooks/use-space-sidebar";
import { cn } from "@/lib/utils";

type SpaceShellProps = Omit<
  ComponentProps<typeof SidebarProvider>,
  "children"
> & {
  children?: ReactNode;
  currentSpaceId?: string;
  onSelectSpace?: (spaceId: string) => void;
};

function SpaceShell({
  children,
  className,
  currentSpaceId,
  onSelectSpace,
  ...props
}: SpaceShellProps) {
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
  const notFound = Boolean(currentSpaceId && !activeSpace);
  const status = error ? (
    <SpacesErrorStatus
      isOffline={isOffline}
      onRetry={retry}
      {...props}
      className={className}
    />
  ) : loading ? (
    <SpacesLoadingStatus {...props} className={className} />
  ) : notFound ? (
    <SpacesNotFoundStatus
      onBack={() => router.replace("/")}
      {...props}
      className={className}
    />
  ) : null;

  if (authLoading) {
    return <SpaceLoading />;
  }

  if (!user || error || loading) return status;

  const handleSelect = (spaceId: string) =>
    onSelectSpace ? onSelectSpace(spaceId) : router.push(`/${spaceId}`);

  const handleCreate = async (name: string, icon: string) => {
    setIsCreating(true);
    try {
      const id = await createSpace({ name, icon });
      setCreateDialogOpen(false);
      handleSelect(id);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <SidebarProvider
        {...props}
        className={cn("min-h-svh", className)}
        data-slot="space-shell"
        data-testid="space-shell"
      >
        <Sidebar variant="inset" collapsible="none" className="h-svh">
          <SidebarHeader>
            <SpaceSwitcher
              activeSpace={activeSpace}
              onCreate={() => setCreateDialogOpen(true)}
              onSelect={handleSelect}
              spaces={spaces}
            />
          </SidebarHeader>
          <SidebarFooter>
            <SidebarUserMenu
              user={user}
              onOpenSettings={() => setSettingsDialogOpen(true)}
              onSignOut={signOutUser}
            />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <SpacesList
            notFound={notFound}
            onCreate={() => setCreateDialogOpen(true)}
            showEmptyState={spaces.length === 0}
            status={status}
          >
            {children}
          </SpacesList>
        </SidebarInset>
      </SidebarProvider>

      <CreateSpaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmitSpace={handleCreate}
        isLoading={isCreating}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </>
  );
}

export { SpaceShell, type SpaceShellProps };
