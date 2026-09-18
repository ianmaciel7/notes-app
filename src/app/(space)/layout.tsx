import { type ReactNode, Suspense } from "react";
import { I18nProvider } from "@/components/i18n-provider";
import { getDictionary, getServerLocale } from "@/lib/i18n/dictionaries";

export default function SpaceLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SpaceI18nWrapper>{children}</SpaceI18nWrapper>
    </Suspense>
  );
}

async function SpaceI18nWrapper({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <I18nProvider dictionary={dictionary} locale={locale}>
      {children}
    </I18nProvider>
  );
}
