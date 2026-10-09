"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useTheme } from "@/app/_components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseTheme, themes } from "@/lib/theme/theme-script";

type ThemeDropdownMenuProps = ComponentProps<typeof DropdownMenu>;

export function ThemeDropdownMenu(props: ThemeDropdownMenuProps) {
  const { theme, setTheme } = useTheme();
  const translate = useTranslations("theme");

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={translate("label")} />
        }
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(parseTheme(value))}
        >
          {themes.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {translate(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
