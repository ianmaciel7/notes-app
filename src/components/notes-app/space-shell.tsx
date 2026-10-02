"use client";

import type { ComponentProps, ReactNode } from "react";
import { CreateSpaceDialog } from "@/components/notes-app/create-space-dialog";
import { SettingsDialog } from "@/components/notes-app/settings-dialog";
import { SidebarUserMenu } from "@/components/notes-app/sidebar-user-menu";
import { SpaceLoading } from "@/components/notes-app/space-loading";
import { SpaceSwitcher } from "@/components/notes-app/space-switcher";
import { SpacesErrorStatus } from "@/components/notes-app/spaces-error-status";
import { SpacesList } from "@/components/notes-app/spaces-list";
import { SpacesLoadingStatus } from "@/components/notes-app/spaces-loading-status";
import { SpacesNotFoundStatus } from "@/components/notes-app/spaces-not-found-status";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useSpaceShell } from "@/hooks/use-space-shell";
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
    activeSpace,
    authLoading,
    backToSpaces,
    createDialogOpen,
    error,
    isCreating,
    isOffline,
    loading,
    notFound,
    onCreateDialogOpenChange,
    onSettingsDialogOpenChange,
    openCreateDialog,
    openSettingsDialog,
    retry,
    selectSpace,
    settingsDialogOpen,
    signOutUser,
    spaces,
    submitCreateSpace,
    user,
  } = useSpaceShell({ currentSpaceId, onSelectSpace });

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
      onBack={backToSpaces}
      {...props}
      className={className}
    />
  ) : null;

  if (authLoading) {
    return <SpaceLoading />;
  }

  if (!user || error || loading) return status;

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
              onCreate={openCreateDialog}
              onSelect={selectSpace}
              spaces={spaces}
            />
          </SidebarHeader>
          <SidebarFooter>
            <SidebarUserMenu
              user={user}
              onOpenSettings={openSettingsDialog}
              onSignOut={signOutUser}
            />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <SpacesList
            notFound={notFound}
            onCreate={openCreateDialog}
            showEmptyState={spaces.length === 0}
            status={status}
          >
            {children}
          </SpacesList>
        </SidebarInset>
      </SidebarProvider>

      <CreateSpaceDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogOpenChange}
        onSubmitSpace={submitCreateSpace}
        isLoading={isCreating}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={onSettingsDialogOpenChange}
      />
    </>
  );
}

export { SpaceShell, type SpaceShellProps };
