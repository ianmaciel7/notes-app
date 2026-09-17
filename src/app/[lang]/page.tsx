"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

import { isSupportedLocale } from "./dictionaries";

export default function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = use(params);
  if (!isSupportedLocale(lang)) notFound();

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <LoadingFallback />
        </main>
      }
    >
      <AuthenticatedHome locale={lang} />
    </Suspense>
  );
}

function LoadingFallback() {
  const { t } = useI18n();

  return t("common.loading");
}

function AuthenticatedHome({ locale }: { locale: "en" | "pt-BR" }) {
  const { t } = useI18n();
  const [headingPrefix = "", headingSuffix = ""] =
    t("home.heading").split("page.tsx");
  const [beforeTemplates = "", afterTemplates = ""] = t(
    "home.description",
  ).split(t("home.templates"));
  const [betweenLinks = "", afterLearning = ""] = afterTemplates.split(
    t("home.learning"),
  );

  return (
    <AuthGate locale={locale}>
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 dark:bg-black sm:items-start">
          <Card className="flex w-full flex-1 flex-col items-center justify-between gap-0 rounded-none bg-white py-0 text-inherit ring-0 dark:bg-black sm:items-start">
            <CardHeader className="w-full p-0">
              <Image
                className="h-5 w-[100px] dark:invert"
                src="/next.svg"
                alt={t("home.logoAlt")}
                width={100}
                height={20}
                priority
              />
            </CardHeader>
            <CardContent className="flex w-full flex-col items-center gap-6 p-0 text-center sm:items-start sm:text-left">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                {headingPrefix}
                <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
                  page.tsx
                </code>
                {headingSuffix}
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                {beforeTemplates}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                >
                  {t("home.templates")}
                </a>
                {betweenLinks}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                >
                  {t("home.learning")}
                </a>
                {afterLearning}
              </p>
            </CardContent>
            <CardFooter className="flex w-full flex-col gap-4 rounded-none border-0 bg-transparent p-0 text-base font-medium sm:flex-row">
              <Button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                nativeButton={false}
                render={
                  <a
                    aria-label={t("home.deployNow")}
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      className="h-[14px] w-4 dark:invert"
                      src="/vercel.svg"
                      alt={t("home.vercelLogomarkAlt")}
                      width={16}
                      height={14}
                    />
                    {t("home.deployNow")}
                  </a>
                }
              />
              <Button
                variant="outline"
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
                nativeButton={false}
                render={
                  <a
                    aria-label={t("home.documentation")}
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("home.documentation")}
                  </a>
                }
              />
            </CardFooter>
          </Card>
        </main>
      </div>
    </AuthGate>
  );
}
