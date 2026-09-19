import {
  ArrowUpRightIcon,
  CircleCheckIcon,
  ListChecksIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AuthGate } from "@/components/auth/auth-gate";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserNav } from "@/components/user/user-nav";
import { getCurrentUser } from "@/data/auth";
import { getExams } from "@/data/exams";
import sampleData from "@/data/fixtures/sample-exams.json";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import type { Exam } from "@/types/exam";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
          {dictionary.common.loading}
        </main>
      }
    >
      <LocalizedSpaceHome locale={lang} />
    </Suspense>
  );
}

async function LocalizedSpaceHome({ locale }: { locale: Locale }) {
  const user = await getCurrentUser(locale);
  const dictionary = await getDictionary(locale);
  let exams: Exam[] = [];

  try {
    exams = await getExams();
  } catch {
    exams = [];
  }

  if (exams.length === 0) {
    exams = sampleData.exams as unknown as Exam[];
  }

  return (
    <AuthGate locale={locale}>
      <div className="min-h-screen bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {dictionary.common.skipToContent}
        </a>
        <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link
              href={`/${locale}`}
              className="rounded-md font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              translate="no"
            >
              {dictionary.exams.brand}
            </Link>
            <UserNav user={user} />
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12"
        >
          <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-card-foreground shadow-sm sm:px-8 sm:py-10">
            <div className="relative max-w-2xl space-y-4">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                {dictionary.exams.title}
              </h1>
              <p className="max-w-prose leading-7 text-muted-foreground">
                {dictionary.exams.description}
              </p>
            </div>
          </section>

          <section
            aria-labelledby="available-exams-heading"
            className="space-y-4"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="available-exams-heading"
                className="text-lg font-semibold"
              >
                {dictionary.exams.eyebrow}
              </h2>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {exams.length} {dictionary.exams.examCountLabel}
              </span>
            </div>

            {exams.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2">
                {exams.map((exam) => (
                  <li key={exam.id}>
                    <Card
                      size="sm"
                      className="h-full border-border/70 bg-card text-card-foreground shadow-sm motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <CardHeader className="gap-5 px-5 pt-5 sm:px-6 sm:pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <Badge
                            variant="secondary"
                            className="font-mono tracking-wide"
                            translate="no"
                          >
                            {exam.code}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {exam.provider}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight">
                            {exam.title}
                          </h3>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {exam.description}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 px-5 sm:px-6">
                        <dl className="grid grid-cols-2 gap-3 border-t pt-4 text-sm">
                          <div className="flex items-start gap-2">
                            <ListChecksIcon
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-primary"
                            />
                            <div>
                              <dt className="text-xs text-muted-foreground">
                                {dictionary.exams.questions}
                              </dt>
                              <dd className="mt-0.5 font-medium">
                                {exam.totalQuestions}
                              </dd>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CircleCheckIcon
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-primary"
                            />
                            <div>
                              <dt className="text-xs text-muted-foreground">
                                {dictionary.exams.passScore}
                              </dt>
                              <dd className="mt-0.5 font-medium">
                                {exam.passingCriteria.percentage ??
                                  exam.passingScore}
                                %
                              </dd>
                            </div>
                          </div>
                        </dl>
                      </CardContent>

                      <CardFooter className="justify-between gap-4 px-5 py-4 sm:px-6">
                        <span className="text-xs text-muted-foreground">
                          {dictionary.exams.practice}
                        </span>
                        <Link
                          href={`/exam/${exam.id}`}
                          className={buttonVariants({
                            size: "lg",
                            className: "gap-2",
                          })}
                        >
                          {dictionary.exams.startPractice}
                          <ArrowUpRightIcon aria-hidden="true" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-border border-dashed bg-card px-6 py-12 text-center text-card-foreground">
                <h3 className="font-semibold">{dictionary.exams.title}</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  {dictionary.exams.noQuestions}
                </p>
                <Button className="mt-5" variant="outline" disabled>
                  {dictionary.exams.startPractice}
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>
    </AuthGate>
  );
}
