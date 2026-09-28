"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ComponentProps, useTransition } from "react";
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

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    if (newLocale === currentLocale) return;

    syncFirebaseLocale(auth, newLocale);

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
      <select
        data-testid="language-select"
        aria-label={t("label")}
        value={currentLocale}
        disabled={isPending}
        onChange={(e) => handleLocaleChange(e.target.value as SupportedLocale)}
        className="h-8 rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
      >
        {SUPPORTED_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {getLocaleLabel(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
