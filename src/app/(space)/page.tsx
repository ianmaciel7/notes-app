import Link from "next/link";
import { Suspense } from "react";

import { AuthGate } from "@/components/auth/auth-gate";
import { UserNav } from "@/components/user/user-nav";
import { getCurrentUser } from "@/data/auth";
import { getExams } from "@/data/exams";
import sampleData from "@/data/fixtures/sample-exams.json";
import { getDictionary, getServerLocale } from "@/lib/i18n/dictionaries";
import type { Exam } from "@/types/exam";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          Loading...
        </main>
      }
    >
      <SpaceHome />
    </Suspense>
  );
}

async function SpaceHome() {
  const locale = await getServerLocale();
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
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              {dictionary.exams.brand}
            </Link>
            <UserNav user={user} />
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
          <section className="space-y-2">
            <p className="text-sm font-medium text-primary">
              {dictionary.exams.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {dictionary.exams.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {dictionary.exams.description}
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            {exams.map((exam) => (
              <article
                key={exam.id}
                className="flex flex-col justify-between rounded-xl border bg-background p-6 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {exam.code}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {exam.totalQuestions} {dictionary.exams.questions}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">{exam.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {exam.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">
                    {dictionary.exams.passScore}:{" "}
                    {exam.passingCriteria.percentage ?? exam.passingScore}%
                  </span>
                  <Link
                    href={`/exam/${exam.id}`}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {dictionary.exams.startPractice}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </AuthGate>
  );
}
