"use client";

import { useTranslations } from "next-intl";
import { type ComponentProps, type ReactNode, useState } from "react";
import { CreateSpaceDialog } from "@/components/notes-app/create-space-dialog";
import { SettingsDialog } from "@/components/notes-app/settings-dialog";
import { SidebarUserMenu } from "@/components/notes-app/sidebar-user-menu";
import { SpaceSwitcherMenu } from "@/components/notes-app/space-switcher";
import { SpacesList } from "@/components/notes-app/spaces-list";
import { SpacesStatus } from "@/components/notes-app/spaces-status";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useSpaceSidebar } from "@/hooks/use-space-sidebar";
import { cn } from "@/lib/utils";

type SpaceSidebarProps = ComponentProps<"div"> & {
  currentSpaceId?: string;
  children?: ReactNode;
  onSelectSpace?: (spaceId: string) => void;
};

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
  const notFound = Boolean(currentSpaceId && !activeSpace);
  const status = (
    <SpacesStatus
      error={error}
      isOffline={isOffline}
      loading={loading}
      notFound={notFound}
      onBack={() => router.replace("/")}
      onRetry={retry}
      className={className}
      {...props}
    />
  );
  if (authLoading)
    return (
      <Empty
        className="flex min-h-svh w-full items-center justify-center"
        data-testid="space-sidebar-loading"
      >
        <EmptyMedia variant="icon">
          <Spinner className="size-8" aria-label={t("loading")} />
        </EmptyMedia>
        <EmptyDescription className="sr-only">{t("loading")}</EmptyDescription>
      </Empty>
    );
  if (!user || error || loading) return status;
  const handleSelect = (spaceId: string) =>
    onSelectSpace ? onSelectSpace(spaceId) : router.push(`/${spaceId}`);
  const handleCreateSpace = async (name: string, icon: string) => {
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
    <SidebarProvider
      data-testid="space-sidebar"
      {...props}
      className={cn("min-h-svh", className)}
    >
      <Sidebar variant="inset" collapsible="none" className="h-svh">
        <SidebarHeader>
          <SpaceSwitcherMenu
            activeSpace={activeSpace}
            onCreate={() => setCreateDialogOpen(true)}
            onSelect={handleSelect}
            spaces={spaces}
            visibleSpaces={spaces}
          />
        </SidebarHeader>
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
        <SpacesList
          notFound={notFound}
          onCreate={() => setCreateDialogOpen(true)}
          showEmptyState={spaces.length === 0}
          status={status}
        >
          {children}
        </SpacesList>
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
          className="fixed right-4 bottom-4"
          data-testid="space-sidebar-offline-indicator"
        >
          {t("operatingOffline")}
        </Badge>
      )}
    </SidebarProvider>
  );
}

export { SpaceSidebar, type SpaceSidebarProps };
