"use client";

import {
  AlertCircle,
  Book,
  Briefcase,
  Check,
  ChevronsUpDown,
  Code,
  Folder,
  LogOut,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { CreateSpaceDialog } from "@/components/notes-app/create-space-dialog";
import { LanguageSelect } from "@/components/notes-app/language-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
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

type UserAvatarProps = ComponentProps<typeof Avatar> & {
  displayName: string;
  photoUrl: string | null;
};

function UserAvatar({ displayName, photoUrl, ...props }: UserAvatarProps) {
  if (photoUrl) {
    return (
      <Avatar {...props} size="sm">
        <AvatarImage src={photoUrl} alt="" />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  }
  return (
    <Avatar {...props} size="sm">
      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

type SpaceSidebarStatusProps = ComponentProps<"div"> & {
  error: Error | null;
  isOffline: boolean;
  loading: boolean;
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
  t: (key: string) => string;
};

function SpaceSidebarStatus({
  error,
  isOffline,
  loading,
  notFound,
  onBack,
  onRetry,
  className,
  t,
  ...props
}: SpaceSidebarStatusProps): ReactNode {
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
          <AlertCircle data-icon="inline-start" />
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
          <RefreshCw data-icon="inline-start" />
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
        <output className="sr-only">{t("loading")}</output>
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }
  if (notFound) {
    return (
      <div
        data-testid="space-switcher-not-found"
        className={cn("flex flex-1 items-center justify-center p-8", className)}
        {...props}
      >
        <Empty className="max-w-sm border border-dashed p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>{t("spaceNotFoundTitle")}</EmptyTitle>
            <EmptyDescription>{t("spaceNotFoundDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              data-testid="space-switcher-back-btn"
            >
              {t("backToSpaces")}
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
  return null;
}

type SpaceSidebarEmptyProps = ComponentProps<"div"> & {
  onCreate: () => void;
  t: (key: string) => string;
};

function SpaceSidebarEmpty({
  onCreate,
  t,
  className,
  ...props
}: SpaceSidebarEmptyProps) {
  return (
    <div
      data-testid="space-switcher-empty"
      className={cn("flex flex-1 items-center justify-center p-8", className)}
      {...props}
    >
      <Empty className="max-w-sm border border-dashed p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            size="sm"
            onClick={onCreate}
            data-testid="empty-create-space-btn"
          >
            <Plus data-icon="inline-start" />
            {t("createFirstSpace")}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
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
    return <SpaceSidebarEmpty onCreate={onCreate} t={t} />;
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
  const authT = useTranslations("auth");
  const settingsT = useTranslations("settings");
  const { resolvedTheme, setTheme } = useTheme();
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
  const [searchQuery, setSearchQuery] = useState("");
  const activeSpace = currentSpaceId
    ? spaces.find((space) => space.id === currentSpaceId)
    : spaces[0];
  const visibleSpaces = spaces.filter((space) =>
    space.name
      .toLocaleLowerCase()
      .includes(searchQuery.trim().toLocaleLowerCase()),
  );
  const notFound = Boolean(currentSpaceId && !activeSpace);
  const showEmptyState = spaces.length === 0;

  const status = (
    <SpaceSidebarStatus
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
  const userName =
    user.displayName ||
    (user.isAnonymous ? authT("anonymous") : authT("defaultUser"));
  const userIdentifier = user.displayName || user.email || userName;
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
          <SidebarGroup>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <Kbd>K</Kbd>
              </InputGroupAddon>
            </InputGroup>
            {searchQuery.trim() && visibleSpaces.length === 0 && (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                {t("noSearchResults")}
              </p>
            )}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCreateDialogOpen(true)}
                  className="group/menu-item"
                >
                  <Plus />
                  <span>{t("newSpace")}</span>
                  <Kbd className="ml-auto opacity-0 transition-opacity duration-80 group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100">
                    O
                  </Kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarHeader>
        {/*
         * TODO(object-types): Add the object types list here once the
         * Firestore `objectTypes` collection and its management flow exist.
         */}
        <SidebarContent />
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
                        <UserRound />
                        <span className="min-w-0 truncate text-[13px] text-foreground">
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
                    sideOffset={6}
                    className={cn(SIDEBAR_MENU_POPUP, "p-2")}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="p-0">
                        <Item size="xs">
                          <ItemMedia>
                            <UserAvatar
                              displayName={userIdentifier}
                              photoUrl={user.photoURL}
                            />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>{userName}</ItemTitle>
                            {user.email && (
                              <ItemDescription>{user.email}</ItemDescription>
                            )}
                          </ItemContent>
                        </Item>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="mx-0" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => signOutUser()}>
                        <LogOut />
                        {authT("signOut")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={() => setSettingsDialogOpen(true)}
              aria-label={settingsT("settings")}
            >
              <Settings />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label={settingsT("darkMode")}
            >
              <Moon />
            </Button>
          </div>
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
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{settingsT("settings")}</DialogTitle>
            <DialogDescription>
              {settingsT("settingsDescription")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="theme-switch">
                  {settingsT("darkMode")}
                </FieldLabel>
                <FieldDescription>
                  {settingsT("darkModeDescription")}
                </FieldDescription>
              </FieldContent>
              <Switch
                id="theme-switch"
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </Field>
            <Field>
              <FieldLabel>{settingsT("language")}</FieldLabel>
              <LanguageSelect />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button onClick={() => setSettingsDialogOpen(false)}>
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
