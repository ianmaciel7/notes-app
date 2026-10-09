"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { setLocalePreference } from "@/actions/locale-actions";
import { isSupportedLocale } from "@/lib/i18n/config";

export function useLocalePicker() {
  const selectedLocale = useLocale();
  const translate = useTranslations("locale");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function selectLocale(value: string) {
    if (pending || !isSupportedLocale(value) || value === selectedLocale) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      await setLocalePreference(value);
      document.documentElement.lang = value;
      router.refresh();
    } catch {
      setError(translate("saveError"));
    } finally {
      setPending(false);
    }
  }

  return {
    selectedLocale,
    pending,
    error,
    selectLocale,
    label: translate("label"),
    options: [
      { value: "en", label: translate("english") },
      { value: "pt-BR", label: translate("portuguese") },
      { value: "es", label: translate("spanish") },
    ],
  };
}
