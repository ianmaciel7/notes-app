import { notFound, redirect } from "next/navigation";

import { requireActionUser } from "@/data/action-auth";
import { getOwnedSpace } from "@/data/spaces";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import { createQuestionAction } from "@/lib/actions/question-actions";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function NewQuestionPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const initialPayload: QuestionRevisionPayload = {
    schemaVersion: 1,
    format: "single-choice",
    prompt: "Untitled Question",
    options: [
      { id: "opt-1", text: "Option 1" },
      { id: "opt-2", text: "Option 2" },
    ],
    correctOptionIds: ["opt-1"],
    explanation: "Explanation",
  };

  const question = await createQuestionAction({
    spaceId,
    title: "Untitled Question",
    payload: initialPayload,
  });

  if (!question.ok) {
    throw new Error("Failed to create question draft");
  }

  redirect(`/${lang}/spaces/${spaceId}/questions/${question.data.id}`);
}
