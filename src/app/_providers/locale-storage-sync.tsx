"use client";

import * as React from "react";
import {
  buildLocaleCookie,
  getLocalePersistenceAction,
  type Locale,
  localeCookieName,
  localeStorageKey,
  readCookieValue,
} from "@/lib/i18n-locale";

type LocaleStorageSyncProps = {
  locale: Locale;
};

function LocaleStorageSync({ locale }: LocaleStorageSyncProps) {
  React.useEffect(() => {
    let storedLocale: string | null = null;

    try {
      storedLocale = window.localStorage.getItem(localeStorageKey);
    } catch {
      storedLocale = null;
    }

    const action = getLocalePersistenceAction({
      cookieLocale: readCookieValue(document.cookie, localeCookieName),
      serverLocale: locale,
      storedLocale,
    });

    if (action.shouldWriteStorage) {
      try {
        window.localStorage.setItem(localeStorageKey, action.locale);
      } catch {}
    }

    if (action.shouldWriteCookie) {
      // biome-ignore lint/suspicious/noDocumentCookie: next-intl reads NEXT_LOCALE from request cookies.
      document.cookie = buildLocaleCookie(action.locale);
    }

    if (action.shouldReload) {
      window.location.reload();
    }
  }, [locale]);

  return null;
}

export { LocaleStorageSync };
