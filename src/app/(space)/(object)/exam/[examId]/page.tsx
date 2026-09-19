import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AuthGate } from "@/components/auth/auth-gate";
import { Assessment } from "@/components/object/assessment/assessment";
import { getCurrentUser } from "@/data/auth";
import { getExamById } from "@/data/exams";
import sampleData from "@/data/fixtures/sample-exams.json";
import { getUserAssessmentViewMode } from "@/data/preferences";
import { getUserExamProgress } from "@/data/progress";
import { getPracticeQuestions } from "@/data/questions";
import { getDictionary, getServerLocale } from "@/lib/i18n/dictionaries";
import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";

export default function ExamPage({ params }: PageProps<"/exam/[examId]">) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          Loading...
        </main>
      }
    >
      <ExamContent params={params} />
    </Suspense>
  );
}

async function ExamContent({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const locale = await getServerLocale();
  const user = await getCurrentUser(locale);
  const dictionary = await getDictionary(locale);
  const initialMode = await getUserAssessmentViewMode(user.uid).catch(
    () => "continuous" as const,
  );
  let exam: Exam | null = null;
  let questions: Question[] = [];

  try {
    exam = await getExamById(examId);
    questions = await getPracticeQuestions(examId);
  } catch {
    exam = null;
  }

  if (!exam) {
    exam =
      (sampleData.exams as unknown as Exam[]).find(
        (candidate) => candidate.id === examId,
      ) ?? null;
  }

  if (questions.length === 0) {
    questions = (sampleData.questions as unknown as Question[]).filter(
      (question) => question.examId === examId,
    );
  }

  if (!exam) notFound();

  const progress = await getUserExamProgress(user.uid, exam.id).catch(() => ({
    examProgress: null,
    questionProgress: {},
  }));

  return (
    <AuthGate locale={locale}>
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              {dictionary.exams.brand}
            </Link>
            <span className="text-sm text-muted-foreground">
              {user.displayName ?? user.email}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
          <div className="space-y-2">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {dictionary.exams.brand}
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">
              {exam.title}
            </h1>
            <p className="text-muted-foreground">{exam.description}</p>
          </div>
          <Assessment
            examId={exam.id}
            questions={questions}
            domainNames={Object.fromEntries(
              exam.domains.map((domain) => [domain.id, domain.name]),
            )}
            initialMode={initialMode}
            initialProgress={progress.questionProgress}
            labels={dictionary.exams}
          />
        </main>
      </div>
    </AuthGate>
  );
}
