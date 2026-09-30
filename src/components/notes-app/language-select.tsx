"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ComponentProps, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/lib/firebase/client";
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  syncFirebaseLocale,
} from "@/lib/i18n/locale-sync";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps extends ComponentProps<"div"> {}

export function LanguageSwitcher({
  className,
  ...props
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string | null) => {
    if (!newLocale || newLocale === currentLocale) return;

    syncFirebaseLocale(auth, newLocale as SupportedLocale);

    startTransition(() => {
      router.refresh();
    });
  };

  const getLocaleLabel = (loc: SupportedLocale) => {
    switch (loc) {
      case "en":
        return t("en");
      case "pt-BR":
        return t("ptBR");
      case "es":
        return t("es");
      default:
        return loc;
    }
  };

  return (
    <div
      data-testid="language-switcher"
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Select
        value={currentLocale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
      >
        <SelectTrigger
          data-testid="language-select"
          aria-label={t("label")}
          size="sm"
          className="h-8 text-xs"
        >
          <SelectValue>
            {getLocaleLabel(currentLocale as SupportedLocale)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {SUPPORTED_LOCALES.map((loc) => (
            <SelectItem key={loc} value={loc} className="text-xs">
              {getLocaleLabel(loc)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
