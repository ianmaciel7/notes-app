"use client";

import {
  AlertCircle,
  Book,
  Briefcase,
  Check,
  ChevronsUpDown,
  Code,
  Folder,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ComponentProps, useState } from "react";
import { CreateSpaceForm } from "@/components/notes-app/create-space-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-spaces";
import { cn } from "@/lib/utils";
import type { AllowedSpaceIcon } from "@/lib/validators/space";

export interface SpaceSwitcherProps extends ComponentProps<"div"> {
  currentSpaceId?: string;
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
  const IconComp = (iconKey && ICON_MAP[iconKey as AllowedSpaceIcon]) || Folder;
  return <IconComp className={className} />;
}

export function SpaceSwitcher({
  currentSpaceId,
  onSelectSpace,
  className,
  ...props
}: SpaceSwitcherProps) {
  const t = useTranslations("spaces");
  const router = useRouter();
  const { user } = useAuth();
  const { spaces, loading, error, isOffline, retry, createSpace } = useSpaces();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const activeSpace = currentSpaceId
    ? spaces.find((space) => space.id === currentSpaceId)
    : spaces[0];

  if (!user) {
    return null;
  }

  const handleSelect = (spaceId: string) => {
    if (onSelectSpace) {
      onSelectSpace(spaceId);
    } else {
      router.push(`/${spaceId}`);
    }
  };

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

  if (error) {
    return (
      <div
        data-testid="space-switcher-error"
        className={cn(
          "flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-3",
          className,
        )}
        {...props}
      >
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("connectionError")}</AlertTitle>
          <AlertDescription>
            {isOffline
              ? t("offlineDescription")
              : t("databaseErrorDescription")}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={retry}
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

  if (currentSpaceId && !activeSpace) {
    return (
      <div
        data-testid="space-switcher-not-found"
        className={cn(
          "flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-3",
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
          onClick={() => router.replace("/")}
          data-testid="space-switcher-back-btn"
        >
          {t("backToSpaces")}
        </Button>
      </div>
    );
  }

  if (spaces.length === 0) {
    return (
      <div
        data-testid="space-switcher-empty"
        className={cn(
          "flex flex-col items-center justify-center w-full max-w-sm mx-auto",
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

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent data-testid="create-space-dialog">
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDescription")}</DialogDescription>
            </DialogHeader>
            <CreateSpaceForm
              onSubmitSpace={handleCreateSpace}
              onCancel={() => setCreateDialogOpen(false)}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div
      data-testid="space-switcher"
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 gap-2 text-sm font-medium"
                data-testid="space-switcher-trigger"
              />
            }
          >
            <SpaceIcon iconKey={activeSpace?.icon} />
            <span className="truncate max-w-[140px]">
              {activeSpace ? activeSpace.name : t("selectSpace")}
            </span>
            <ChevronsUpDown className="size-3.5 opacity-50 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("spacesLabel")}
              </DropdownMenuLabel>
              {spaces.map((space) => {
                const isSelected = space.id === activeSpace?.id;
                return (
                  <DropdownMenuItem
                    key={space.id}
                    onClick={() => handleSelect(space.id)}
                    className="flex items-center justify-between cursor-pointer"
                    data-testid={`space-item-${space.id}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <SpaceIcon iconKey={space.icon} />
                      <span className="truncate">{space.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="size-4 text-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setCreateDialogOpen(true)}
              className="flex items-center gap-2 cursor-pointer text-primary"
              data-testid="new-space-item"
            >
              <Plus className="size-4" />
              <span>{t("createSpace")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeSpace && (
          <Button
            size="sm"
            onClick={() => handleSelect(activeSpace.id)}
            data-testid="enter-space-btn"
          >
            {t("enterSpace")}
          </Button>
        )}
      </div>

      {isOffline && (
        <output
          aria-live="polite"
          className="text-[11px] text-muted-foreground"
          data-testid="offline-status-indicator"
        >
          {t("operatingOffline")}
        </output>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent data-testid="create-space-dialog">
          <DialogHeader>
            <DialogTitle>{t("dialogTitle")}</DialogTitle>
            <DialogDescription>{t("dialogDescription")}</DialogDescription>
          </DialogHeader>
          <CreateSpaceForm
            onSubmitSpace={handleCreateSpace}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
