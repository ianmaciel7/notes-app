"use client";

import {
  CheckIcon,
  ChevronsUpDownIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/hooks/use-i18n";
import {
  createSpaceAction,
  renameSpaceAction,
} from "@/lib/actions/space-actions";

export interface SpaceItem {
  id: string;
  name: string;
}

export interface SpaceSwitcherProps {
  spaces: SpaceItem[];
  currentSpaceId: string;
  lang: string;
}

export function SpaceSwitcher({
  spaces,
  currentSpaceId,
  lang,
}: SpaceSwitcherProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();

  const [isCreating, setIsCreating] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameSpaceName, setRenameSpaceName] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);

  const currentSpace = spaces.find((s) => s.id === currentSpaceId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    setCreateError(null);
    startTransition(async () => {
      const result = await createSpaceAction({ name: newSpaceName.trim() });
      if (result.ok) {
        setNewSpaceName("");
        setIsCreating(false);
        router.push(`/${lang}/spaces/${result.data.id}`);
        router.refresh();
      } else {
        setCreateError(result.error.code);
      }
    });
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameSpaceName.trim()) return;

    setRenameError(null);
    startTransition(async () => {
      const result = await renameSpaceAction({
        spaceId: currentSpaceId,
        name: renameSpaceName.trim(),
      });
      if (result.ok) {
        setIsRenaming(false);
        router.refresh();
      } else {
        setRenameError(result.error.code);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 p-2" data-slot="space-switcher">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-medium shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("spaces.switchSpace")}
        >
          <span className="truncate">
            {currentSpace ? currentSpace.name : t("spaces.mySpaces")}
          </span>
          <ChevronsUpDownIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("spaces.mySpaces")}</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {spaces.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {t("spaces.noSpaces")}
            </div>
          ) : (
            spaces.map((space) => (
              <DropdownMenuItem
                key={space.id}
                render={
                  <Link
                    href={`/${lang}/spaces/${space.id}`}
                    className="flex items-center justify-between"
                  />
                }
              >
                <span className="truncate">{space.name}</span>
                {space.id === currentSpaceId && (
                  <CheckIcon className="size-4 shrink-0 text-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsCreating(true);
              setIsRenaming(false);
            }}
          >
            <PlusIcon className="mr-2 size-4" />
            {t("spaces.createSpace")}
          </DropdownMenuItem>
          {currentSpace && (
            <DropdownMenuItem
              onClick={() => {
                setRenameSpaceName(currentSpace.name);
                setIsRenaming(true);
                setIsCreating(false);
              }}
            >
              <PencilIcon className="mr-2 size-4" />
              {t("spaces.renameSpace")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          aria-label={t("spaces.createSpace")}
          className="flex flex-col gap-2 rounded-md border border-border bg-card p-2 text-card-foreground shadow-xs"
        >
          <label
            htmlFor="create-space-input"
            className="text-xs font-medium text-muted-foreground"
          >
            {t("spaces.createSpace")}
          </label>
          <Input
            id="create-space-input"
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
            placeholder={t("spaces.namePlaceholder")}
            disabled={isPending}
            autoFocus
          />
          {createError && (
            <p className="text-xs text-destructive">{createError}</p>
          )}
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
              disabled={isPending}
            >
              {t("common.close")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !newSpaceName.trim()}
            >
              {isPending ? (
                <Spinner className="size-3" />
              ) : (
                t("spaces.createSpace")
              )}
            </Button>
          </div>
        </form>
      )}

      {isRenaming && (
        <form
          onSubmit={handleRename}
          aria-label={t("spaces.renameSpace")}
          className="flex flex-col gap-2 rounded-md border border-border bg-card p-2 text-card-foreground shadow-xs"
        >
          <label
            htmlFor="rename-space-input"
            className="text-xs font-medium text-muted-foreground"
          >
            {t("spaces.renameSpace")}
          </label>
          <Input
            id="rename-space-input"
            value={renameSpaceName}
            onChange={(e) => setRenameSpaceName(e.target.value)}
            placeholder={t("spaces.namePlaceholder")}
            disabled={isPending}
            autoFocus
          />
          {renameError && (
            <p className="text-xs text-destructive">{renameError}</p>
          )}
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsRenaming(false)}
              disabled={isPending}
            >
              {t("common.close")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !renameSpaceName.trim()}
            >
              {isPending ? (
                <Spinner className="size-3" />
              ) : (
                t("spaces.renameSpace")
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
