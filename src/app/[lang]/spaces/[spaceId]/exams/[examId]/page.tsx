import { notFound, redirect } from "next/navigation";
import { ExamEditor } from "@/components/exams/exam-editor";
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
      <ExamEditor
        spaceId={spaceId}
        exam={examView}
        availableQuestions={availableQuestions}
        lang={lang}
      />
    </div>
  );
}
