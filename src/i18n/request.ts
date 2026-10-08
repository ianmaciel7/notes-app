import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  negotiateLocale,
} from "@/lib/i18n/config";

export default getRequestConfig(async () => {
  const localeCookie = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  const locale = isSupportedLocale(localeCookie)
    ? localeCookie
    : (negotiateLocale((await headers()).get("accept-language")) ??
      defaultLocale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
