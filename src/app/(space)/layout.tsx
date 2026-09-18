import { type ReactNode, Suspense } from "react";
import { getDictionary, getServerLocale } from "@/app/[lang]/dictionaries";
import { I18nProvider } from "@/components/i18n-provider";

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
