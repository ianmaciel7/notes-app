import { redirect } from "next/navigation";

export default async function ExamEditRedirectPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string; examId: string }>;
}) {
  const { lang, spaceId, examId } = await params;
  redirect(`/${lang}/spaces/${spaceId}/exams/${examId}`);
}
