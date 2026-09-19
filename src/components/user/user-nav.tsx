"use client";

import { signOut } from "firebase/auth";
import { LaptopIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/hooks/use-i18n";
import { deleteSession } from "@/lib/auth/client-session";
import { auth } from "@/lib/firebase/client";
import { localePath } from "@/lib/i18n/routing";

export interface UserNavProps {
  user?: {
    email?: string | null;
    displayName?: string | null;
  } | null;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email?.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return "U";
}

export function UserNav({ user }: UserNavProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale, t } = useI18n();
  const { setTheme, theme } = useTheme();

  const displayName = user?.displayName;
  const email = user?.email;
  const initials = getInitials(displayName, email);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      await deleteSession();
      router.push(localePath(locale, "/sign-in"));
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        aria-label={displayName || email || t("common.signOut")}
        className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-1 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-3.5"
      >
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {displayName ? (
          <span className="hidden max-w-[150px] truncate text-sm font-medium text-foreground sm:inline-block">
            {displayName}
          </span>
        ) : email ? (
          <span className="hidden max-w-[150px] truncate text-sm font-medium text-foreground sm:inline-block">
            {email}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(displayName || email) && (
          <>
            <div className="flex flex-col gap-1 p-2">
              {displayName && (
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
              )}
              {email && (
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value)}
        >
          <DropdownMenuLabel>{t("common.theme")}</DropdownMenuLabel>
          <DropdownMenuRadioItem value="light" className="cursor-pointer">
            <SunIcon />
            <span>{t("common.themeLight")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="cursor-pointer">
            <MoonIcon />
            <span>{t("common.themeDark")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="cursor-pointer">
            <LaptopIcon />
            <span>{t("common.themeSystem")}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoading}
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <LogOutIcon className="size-4" />
          )}
          <span>{t("common.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
