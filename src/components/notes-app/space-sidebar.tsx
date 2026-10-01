"use client";

import { updateProfile } from "firebase/auth";
import {
  AlertCircle,
  Book,
  Briefcase,
  Check,
  ChevronsUpDown,
  Code,
  Folder,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ComponentProps, type ReactNode, useState } from "react";
import { CreateSpaceForm } from "@/components/notes-app/create-space-form";
import { LanguageSelect } from "@/components/notes-app/language-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-spaces";
import { cn } from "@/lib/utils";
import type { AllowedSpaceIcon } from "@/lib/validators/space";

export interface SpaceSidebarProps extends ComponentProps<"div"> {
  currentSpaceId?: string;
  children?: ReactNode;
  onSelectSpace?: (spaceId: string) => void;
}

const ICON_MAP: Record<AllowedSpaceIcon, typeof Folder> = {
  folder: Folder,
  book: Book,
  briefcase: Briefcase,
  code: Code,
  archive: Folder,
  compass: Folder,
};

function SpaceIcon({
  iconKey,
  className = "size-4",
}: {
  iconKey?: string;
  className?: string;
}) {
  const IconComp =
    Object.entries(ICON_MAP).find(([key]) => key === iconKey)?.[1] ?? Folder;
  return <IconComp className={className} />;
}

function UserAvatar({
  displayName,
  photoUrl,
}: {
  displayName: string;
  photoUrl: string | null;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={20}
        height={20}
        unoptimized
        className="size-5 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      />
    );
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
      {displayName.charAt(0).toUpperCase()}
    </span>
  );
}

function SpaceSidebarStatus({
  error,
  isOffline,
  loading,
  notFound,
  onBack,
  onRetry,
  className,
  props,
  t,
}: {
  error: Error | null;
  isOffline: boolean;
  loading: boolean;
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
  className?: string;
  props: ComponentProps<"div">;
  t: (key: string) => string;
}): ReactNode {
  if (error) {
    return (
      <div
        data-testid="space-switcher-error"
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3",
          className,
        )}
        {...props}
      >
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("connectionError")}</AlertTitle>
          <AlertDescription>
            {t(isOffline ? "offlineDescription" : "databaseErrorDescription")}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          data-testid="space-switcher-retry-btn"
        >
          <RefreshCw className="mr-1.5 size-3.5" />
          {t("retryConnection")}
        </Button>
      </div>
    );
  }
  if (loading) {
    return (
      <div
        data-testid="space-switcher-loading"
        className={cn(
          "flex items-center justify-center p-4 text-xs text-muted-foreground",
          className,
        )}
        {...props}
      >
        <span className="animate-pulse">{t("loading")}</span>
      </div>
    );
  }
  if (notFound) {
    return (
      <div
        data-testid="space-switcher-not-found"
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3",
          className,
        )}
        {...props}
      >
        <Alert role="alert">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("spaceNotFoundTitle")}</AlertTitle>
          <AlertDescription>{t("spaceNotFoundDescription")}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          data-testid="space-switcher-back-btn"
        >
          {t("backToSpaces")}
        </Button>
      </div>
    );
  }
  return null;
}

export function SpaceSidebar({
  currentSpaceId,
  children,
  onSelectSpace,
  className,
  ...props
}: SpaceSidebarProps) {
  const t = useTranslations("spaces");
  const authT = useTranslations("auth");
  const settingsT = useTranslations("settings");
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, signOutUser } = useAuth();
  const { spaces, loading, error, isOffline, retry, createSpace } = useSpaces();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const activeSpace = currentSpaceId
    ? spaces.find((space) => space.id === currentSpaceId)
    : spaces[0];
  const visibleSpaces = spaces.filter((space) =>
    space.name
      .toLocaleLowerCase()
      .includes(searchQuery.trim().toLocaleLowerCase()),
  );

  const status = (
    <SpaceSidebarStatus
      error={error}
      isOffline={isOffline}
      loading={loading}
      notFound={Boolean(currentSpaceId && !activeSpace)}
      onBack={() => router.replace("/")}
      onRetry={retry}
      className={className}
      props={props}
      t={t}
    />
  );

  if (!user || error || loading || (currentSpaceId && !activeSpace)) {
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
  const handleSaveProfile = async () => {
    const nextDisplayName = displayName.trim();
    if (!nextDisplayName) return;
    setIsSavingProfile(true);
    try {
      await updateProfile(user, { displayName: nextDisplayName });
      setProfileDialogOpen(false);
      router.refresh();
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (spaces.length === 0) {
    return (
      <div
        data-testid="space-switcher-empty"
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col items-center justify-center",
          className,
        )}
        {...props}
      >
        <Empty className="border border-dashed p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder className="size-4" />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              data-testid="empty-create-space-btn"
            >
              <Plus className="mr-1.5 size-4" />
              {t("createFirstSpace")}
            </Button>
          </EmptyContent>
        </Empty>
        <CreateSpaceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateSpace}
          isLoading={isCreating}
        />
      </div>
    );
  }

  const userIdentifier =
    user.displayName ||
    user.email ||
    (user.isAnonymous ? authT("anonymous") : authT("defaultUser"));
  return (
    <div
      data-testid="space-switcher"
      className={cn("flex min-h-svh w-full", className)}
      {...props}
    >
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="none">
          <SidebarHeader>
            <SidebarMenu aria-label={t("workspace")}>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton
                        data-testid="space-switcher-trigger"
                        aria-label={t("switchSpace")}
                        className="h-8"
                      >
                        <SpaceIcon iconKey={activeSpace?.icon} />
                        <span className="min-w-0 truncate text-[13px]">
                          {activeSpace?.name}
                        </span>
                        <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
                      </SidebarMenuButton>
                    }
                  />
                  <DropdownMenuContent align="start" className="w-56">
                    {visibleSpaces.map((space) => (
                      <DropdownMenuItem
                        key={space.id}
                        onClick={() => handleSelect(space.id)}
                        data-testid={`space-item-${space.id}`}
                      >
                        <SpaceIcon iconKey={space.icon} />
                        <span className="min-w-0 flex-1 truncate">
                          {space.name}
                        </span>
                        {space.id === activeSpace?.id && (
                          <Check className="size-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="size-4" />
                      {t("createSpace")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex flex-col">
              <div className="group/search relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <SidebarInput
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-8 pl-8 pr-10"
                />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-sans text-[11px] text-muted-foreground opacity-0 transition-opacity duration-80 group-hover/search:opacity-100 group-focus-within/search:opacity-100">
                  K
                </kbd>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setCreateDialogOpen(true)}
                    className="group/menu-item"
                  >
                    <Plus />
                    <span>{t("newSpace")}</span>
                    <kbd className="ml-auto font-sans text-[11px] text-muted-foreground opacity-0 transition-opacity duration-80 group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100">
                      O
                    </kbd>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t("spacesLabel")}</SidebarGroupLabel>
              <SidebarGroupAction
                onClick={() => setCreateDialogOpen(true)}
                aria-label={t("createSpace")}
              >
                <Plus />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleSpaces.map((space) => (
                    <SidebarMenuItem key={space.id}>
                      <SidebarMenuButton
                        isActive={space.id === activeSpace?.id}
                        onClick={() => handleSelect(space.id)}
                      >
                        <SpaceIcon iconKey={space.icon} />
                        <span>{space.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                {visibleSpaces.length === 0 && (
                  <p className="px-2 py-3 text-xs text-muted-foreground">
                    {t("noSearchResults")}
                  </p>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-1 pr-1.5">
              <SidebarMenu
                aria-label={t("openUserMenu")}
                className="min-w-0 flex-1"
              >
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuButton aria-label={t("openUserMenu")}>
                          <UserAvatar
                            displayName={userIdentifier}
                            photoUrl={user.photoURL}
                          />
                          <span className="min-w-0 truncate">
                            {userIdentifier}
                          </span>
                          <span className="ml-auto -mr-0.5 flex size-6 shrink-0 items-center justify-center">
                            <ChevronsUpDown className="size-4 text-muted-foreground" />
                          </span>
                        </SidebarMenuButton>
                      }
                    />
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className="w-56"
                    >
                      <DropdownMenuItem
                        onClick={() => setProfileDialogOpen(true)}
                      >
                        <User className="size-4" />
                        {settingsT("profile")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSettingsDialogOpen(true)}
                      >
                        <Settings className="size-4" />
                        {settingsT("settings")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOutUser()}>
                        {authT("signOut")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                aria-label={settingsT("settings")}
                title={settingsT("settings")}
                onClick={() => setSettingsDialogOpen(true)}
              >
                <Settings />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                aria-label={settingsT("darkMode")}
                title={settingsT("darkMode")}
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                <Moon />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <CreateSpaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSpace}
        isLoading={isCreating}
      />
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{settingsT("profile")}</DialogTitle>
            <DialogDescription>
              {settingsT("profileDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="display-name">{settingsT("displayName")}</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSavingProfile || !displayName.trim()}
            >
              {isSavingProfile ? settingsT("saving") : settingsT("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{settingsT("settings")}</DialogTitle>
            <DialogDescription>
              {settingsT("settingsDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="theme-switch">{settingsT("darkMode")}</Label>
              <p className="text-xs text-muted-foreground">
                {settingsT("darkModeDescription")}
              </p>
            </div>
            <Switch
              id="theme-switch"
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>{settingsT("language")}</Label>
            <LanguageSelect />
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsDialogOpen(false)}>
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isOffline && (
        <output
          aria-live="polite"
          className="fixed bottom-4 right-4 text-[11px] text-muted-foreground"
          data-testid="offline-status-indicator"
        >
          {t("operatingOffline")}
        </output>
      )}
    </div>
  );
}

function CreateSpaceDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, icon: string) => Promise<void>;
  isLoading: boolean;
}) {
  const t = useTranslations("spaces");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="create-space-dialog">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <CreateSpaceForm
          onSubmitSpace={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
