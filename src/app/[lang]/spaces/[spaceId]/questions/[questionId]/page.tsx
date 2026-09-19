import { notFound } from "next/navigation";
import { Suspense } from "react";

import { QuestionEditor } from "@/components/authoring/question-editor";
import { requireActionUser } from "@/data/action-auth";
import { getObjectRevision } from "@/data/objects";
import { getQuestionAuthoringView } from "@/data/questions-v2";
import { getOwnedSpace } from "@/data/spaces";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function QuestionEditorPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string; questionId: string }>;
}) {
  const { lang, spaceId, questionId } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <Suspense fallback={<div className="p-4">Loading question editor...</div>}>
      <QuestionEditorContent spaceId={spaceId} questionId={questionId} />
    </Suspense>
  );
}

async function QuestionEditorContent({
  spaceId,
  questionId,
}: {
  spaceId: string;
  questionId: string;
}) {
  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  let questionView: Awaited<ReturnType<typeof getQuestionAuthoringView>>;
  try {
    questionView = await getQuestionAuthoringView(
      user.uid,
      spaceId,
      questionId,
    );
  } catch {
    notFound();
  }

  let version = 1;
  const activePayload =
    questionView.draftPayload ?? questionView.publishedPayload;

  if (questionView.latestRevisionId) {
    try {
      const rev = await getObjectRevision<QuestionRevisionPayload>(
        user.uid,
        spaceId,
        questionView.latestRevisionId,
      );
      version = rev.version;
    } catch {
      // fallback to 1
    }
  }

  return (
    <div className="space-y-6">
      <QuestionEditor
        spaceId={spaceId}
        questionId={questionId}
        initialTitle={questionView.title}
        initialLifecycle={questionView.lifecycle}
        initialVersion={version}
        initialPayload={activePayload}
        initialTags={questionView.tags}
      />
    </div>
  );
}
