import { notFound, redirect } from "next/navigation";
import { requireActionUser } from "@/data/action-auth";
import { createExamAction } from "@/lib/actions/exam-authoring-actions";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function NewExamPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  try {
    await requireActionUser();
  } catch {
    redirect(`/${lang}/sign-in`);
  }

  const result = await createExamAction({
    spaceId,
    title: "Untitled Exam",
  });

  if (!result.ok) {
    redirect(`/${lang}/spaces/${spaceId}/exams`);
  }

  redirect(`/${lang}/spaces/${spaceId}/exams/${result.data.id}`);
}
