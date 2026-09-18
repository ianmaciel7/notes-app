"use client";

import { createContext, type ReactNode, useContext, useEffect } from "react";

import type { AppMessages, Locale, MessageKey } from "@/lib/i18n/types";

export type I18nContextValue = {
  locale: Locale;
  t: <K extends MessageKey>(key: K) => string;
};

export const I18nContext = createContext<I18nContextValue | undefined>(
  undefined,
);

export type I18nProviderProps = {
  children: ReactNode;
  dictionary: AppMessages;
  locale: Locale;
};

function getMessage(dictionary: AppMessages, key: MessageKey): string {
  const message = key.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) return undefined;

    return (value as Record<string, unknown>)[segment];
  }, dictionary);

  if (typeof message !== "string") {
    throw new Error(`Missing i18n message for key: ${key}`);
  }

  return message;
}

export function I18nProvider({
  children,
  dictionary,
  locale,
}: I18nProviderProps) {
  useEffect(() => {
    try {
      localStorage.setItem("NEXT_LOCALE", locale);
    } catch {
      // Ignore localStorage errors (e.g. storage disabled / sandbox)
    }
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: (key) => getMessage(dictionary, key),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
