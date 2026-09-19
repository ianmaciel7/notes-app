"use client";

import { useEffect, useRef } from "react";
import {
  QuestionCard,
  type QuestionCardProps,
} from "@/components/object/question/question-card";
import type { QuestionDomainGroup } from "@/lib/assessment/state";

export function ContinuousQuestions({
  groups,
  getCardProps,
  onVisibleQuestion,
  activeQuestionId,
  scrollToQuestionId,
}: {
  groups: QuestionDomainGroup[];
  getCardProps: (questionId: string) => QuestionCardProps;
  onVisibleQuestion: (questionId: string) => void;
  activeQuestionId: string | null;
  scrollToQuestionId: string | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollToQuestionId || !rootRef.current) return;
    const element = rootRef.current.querySelector<HTMLElement>(
      `[data-question-id="${scrollToQuestionId}"]`,
    );
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const isVisible =
      bounds.top >= 80 && bounds.bottom <= window.innerHeight - 40;
    if (isVisible) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [scrollToQuestionId]);

  return (
    <div ref={rootRef} className="space-y-10">
      {groups.map((group) => (
        <section
          key={group.domainId}
          aria-labelledby={`domain-${group.domainId}`}
          className="space-y-4"
        >
          <h2
            id={`domain-${group.domainId}`}
            className="text-sm font-semibold text-muted-foreground"
          >
            {group.title}
          </h2>
          <div className="space-y-6">
            {group.questions.map((question) => (
              <ObservedQuestion
                key={question.id}
                questionId={question.id}
                active={activeQuestionId === question.id}
                onVisible={onVisibleQuestion}
              >
                <QuestionCard {...getCardProps(question.id)} />
              </ObservedQuestion>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ObservedQuestion({
  questionId,
  active,
  onVisible,
  children,
}: {
  questionId: string;
  active: boolean;
  onVisible: (questionId: string) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onVisible(questionId);
      },
      { threshold: [0.45, 0.7] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisible, questionId]);

  return (
    <div
      ref={ref}
      data-question-id={questionId}
      data-active={active || undefined}
    >
      {children}
    </div>
  );
}
