import type { Question } from "@/domain/catalog/question";

export interface AssessmentQuestionProgress {
  [questionId: string]: {
    isCompleted: boolean;
  };
}

export interface QuestionDomainGroup {
  domainId: string;
  title: string;
  questions: Question[];
}

export function getInitialQuestionId(
  questions: Question[],
  progress: AssessmentQuestionProgress,
): string | null {
  return (
    questions.find((question) => !progress[question.id]?.isCompleted)?.id ??
    questions[0]?.id ??
    null
  );
}

export function groupQuestionsByDomain(
  questions: Question[],
  domainNames: Record<string, string>,
): QuestionDomainGroup[] {
  const groups = new Map<string, QuestionDomainGroup>();

  for (const question of questions) {
    const existing = groups.get(question.domainId);
    if (existing) {
      existing.questions.push(question);
      continue;
    }

    groups.set(question.domainId, {
      domainId: question.domainId,
      title: domainNames[question.domainId] ?? question.domainId,
      questions: [question],
    });
  }

  return [...groups.values()];
}
