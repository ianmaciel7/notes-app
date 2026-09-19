import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ExamForm } from "@/components/exams/exam-form";
import { requireActionUser } from "@/data/action-auth";
import {
  type ExamAuthoringViewDto,
  getExamAuthoringView,
} from "@/data/exam-authoring";
import { listQuestionSummaries } from "@/data/questions-v2";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function ExamAuthoringPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string; examId: string }>;
}) {
  const { lang, spaceId, examId } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl p-4">Loading exam editor...</div>
      }
    >
      <ExamAuthoringContent lang={lang} spaceId={spaceId} examId={examId} />
    </Suspense>
  );
}

async function ExamAuthoringContent({
  lang,
  spaceId,
  examId,
}: {
  lang: string;
  spaceId: string;
  examId: string;
}) {
  let user: { uid: string; email: string | null };
  try {
    user = await requireActionUser();
  } catch {
    redirect(`/${lang}/sign-in`);
  }

  let examView: ExamAuthoringViewDto;
  try {
    examView = await getExamAuthoringView(user.uid, spaceId, examId);
  } catch {
    notFound();
  }

  const availableQuestions = await listQuestionSummaries(user.uid, spaceId);

  return (
    <div className="mx-auto max-w-5xl">
      <ExamForm
        spaceId={spaceId}
        exam={examView}
        availableQuestions={availableQuestions}
        lang={lang}
      />
    </div>
  );
}
